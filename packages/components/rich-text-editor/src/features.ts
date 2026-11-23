/** The names of the built-in editor features. */
export type RichTextEditorFeature =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'link'
  | 'headings'
  | 'bullet-list'
  | 'ordered-list'
  | 'checklist'
  | 'quote'
  | 'history'
  | 'character-count';

/** All built-in features, in the order their toolbar buttons appear. */
export const EDITOR_FEATURES: readonly RichTextEditorFeature[] = [
  'headings',
  'bold',
  'italic',
  'underline',
  'strike',
  'code',
  'link',
  'bullet-list',
  'ordered-list',
  'checklist',
  'quote',
  'history',
  'character-count'
];

/**
 * The features you get with `features="default"`, or when the attribute is not set. This list is
 * fixed: opt-in features (`code`, `checklist` and `character-count`) are never part of it, so an
 * editor only gains a capability when someone names it.
 */
export const DEFAULT_FEATURES: readonly RichTextEditorFeature[] = [
  'bold',
  'italic',
  'underline',
  'strike',
  'link',
  'headings',
  'bullet-list',
  'ordered-list',
  'quote',
  'history'
];

const isFeature = (name: string): name is RichTextEditorFeature =>
  (EDITOR_FEATURES as readonly string[]).includes(name);

/**
 * Resolves a `features` attribute value into a set of features. The value is a space-separated list
 * of tokens, read left to right: a name adds a feature, `default` adds the standard set and `-name`
 * removes one. An empty or missing value means `default`. Unknown names log a warning and are
 * skipped.
 */
export const resolveFeatures = (value?: string | null): Set<RichTextEditorFeature> => {
  const tokens = (value ?? '').split(/\s+/).filter(Boolean),
    features = new Set<RichTextEditorFeature>();

  if (tokens.length === 0) {
    tokens.push('default');
  }

  for (const token of tokens) {
    const remove = token.startsWith('-'),
      name = remove ? token.slice(1) : token,
      names = name === 'default' ? DEFAULT_FEATURES : isFeature(name) ? [name] : undefined;

    if (!names) {
      console.warn(`sl-rich-text-editor: unknown feature "${name}" is ignored.`);
      continue;
    }

    names.forEach(feature => (remove ? features.delete(feature) : features.add(feature)));
  }

  return features;
};
