/**
 * Token declarations of a single theme, grouped by the context they apply in. The `base` context
 * holds the unconditional declarations (`body`, `:root`, ...). Other keys are `user-group=<group>`,
 * `subtheme=<subtheme>` or the at-rule/selector chain.
 */
export type ThemeContexts = Map<string, Map<string, string>>;

export type TokenBucket = 'shared' | 'themed' | 'userGroup';

export type TokenBuckets = Record<TokenBucket, string[]>;

export const BASE_CONTEXT = 'base';

const MISSING = '<missing>';

export const normalizeValue = (value: string): string => value.replace(/\s+/g, ' ').trim();

export const appliesToUserGroup = (name: string, userGroup: string): boolean => {
  const suffix = name.match(/-(early|developing|advanced|poweruser)$/)?.[1];

  return suffix === undefined || suffix === userGroup;
};

export const contextKey = (selector: string, conditions: string[]): string => {
  const userGroup = selector.match(/^\[data-user-group=['"]?([\w-]+)['"]?\]$/i)?.[1],
    subtheme = selector.match(/^\[data-[\w-]+-subthemes=['"]?([\w-]+)['"]?\]$/i)?.[1],
    part = userGroup
      ? `user-group=${userGroup}`
      : subtheme
        ? `subtheme=${subtheme}`
        : ['body', ':root', 'html', ':host'].includes(selector.trim())
          ? BASE_CONTEXT
          : selector.trim();

  return conditions.length ? [...conditions, part].join(' ') : part;
};

/** Replaces every `var()` reference with the value it points to, following aliases recursively. */
export const resolveValue = (
  value: string,
  lookup: (name: string) => string | undefined,
  seen: ReadonlySet<string> = new Set()
): string => {
  let result = '',
    index = 0;

  for (;;) {
    const start = value.indexOf('var(', index);
    if (start === -1) {
      return result + value.slice(index);
    }

    let depth = 0,
      end = start + 3;
    for (; end < value.length; end++) {
      if (value[end] === '(') {
        depth++;
      } else if (value[end] === ')' && --depth === 0) {
        break;
      }
    }

    const inner = value.slice(start + 4, end),
      comma = inner.indexOf(','),
      name = (comma === -1 ? inner : inner.slice(0, comma)).trim(),
      fallback = comma === -1 ? undefined : inner.slice(comma + 1).trim(),
      referenced = seen.has(name) ? undefined : lookup(name);

    result += value.slice(index, start);
    result +=
      referenced !== undefined
        ? resolveValue(referenced, lookup, new Set([...seen, name]))
        : fallback !== undefined
          ? resolveValue(fallback, lookup, seen)
          : MISSING;
    index = end + 1;
  }
};

const resolveToken = (contexts: ThemeContexts, context: string, name: string): string => {
  const scoped = contexts.get(context),
    base = contexts.get(BASE_CONTEXT),
    lookup = (token: string) => scoped?.get(token) ?? base?.get(token),
    value = lookup(name);

  return value === undefined ? MISSING : resolveValue(value, lookup, new Set([name]));
};

/**
 * Sorts every token into one bucket: - `themed`: the resolved value differs between themes (in any
 * context), the token is missing in some theme, or it changes per subtheme - `userGroup`: identical
 * in every theme, but changes per user group - `shared`: identical in every theme, context and user
 * group
 *
 * Values are compared as resolved text, so `calc(8px)` and `8px` count as different. That only errs
 * towards `themed`: more snapshots, never a missed change.
 */
export const classifyTokens = (themes: Map<string, ThemeContexts>): TokenBuckets => {
  const allThemes = [...themes.values()],
    names = new Set<string>(),
    comparedContexts = new Set<string>([BASE_CONTEXT]),
    buckets: TokenBuckets = { shared: [], themed: [], userGroup: [] };

  for (const contexts of allThemes) {
    for (const [context, declarations] of contexts) {
      declarations.forEach((_, name) => names.add(name));

      if (!context.startsWith('subtheme=')) {
        comparedContexts.add(context);
      }
    }
  }

  const userGroupContexts = [...comparedContexts].filter(context =>
    context.startsWith('user-group=')
  );

  for (const name of [...names].sort()) {
    const valuesIn = (context: string) =>
        allThemes.map(contexts =>
          resolveToken(contexts, contexts.has(context) ? context : BASE_CONTEXT, name)
        ),
      differsBetweenThemes = [...comparedContexts].some(
        context => new Set(valuesIn(context)).size > 1
      ),
      differsPerSubtheme = allThemes.some(contexts =>
        [...contexts.keys()]
          .filter(context => context.startsWith('subtheme='))
          .some(
            context =>
              resolveToken(contexts, context, name) !== resolveToken(contexts, BASE_CONTEXT, name)
          )
      );

    if (differsBetweenThemes || differsPerSubtheme) {
      buckets.themed.push(name);
    } else if (
      userGroupContexts.some(context => valuesIn(context)[0] !== valuesIn(BASE_CONTEXT)[0])
    ) {
      buckets.userGroup.push(name);
    } else {
      buckets.shared.push(name);
    }
  }

  return buckets;
};
