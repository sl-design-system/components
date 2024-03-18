import {
  type Attrs,
  type DOMOutputSpec,
  type Mark,
  type MarkSpec,
  type NodeSpec,
  type Node as PMNode
} from 'prosemirror-model';

export declare type EditorMarks =
  | 'link'
  | 'em'
  | 'strong'
  | 'code'
  | 'underline'
  | 'strikethrough'
  | 'subscript'
  | 'superscript';

export declare type EditorNodes =
  | 'doc'
  | 'paragraph'
  | 'blockquote'
  | 'horizontalRule'
  | 'heading'
  | 'codeBlock'
  | 'text'
  | 'image'
  | 'hardBreak'
  | 'listItem'
  | 'orderedList'
  | 'bulletList';

const SLOT = 0; // https://prosemirror.net/docs/guide/#schema.serialization_and_parsing

export const isEmpty = (obj: Record<string, unknown>): boolean => Object.keys(obj).length === 0;

export const removeEntries = (
  obj: Record<string, unknown>,
  predicate: (key: string) => boolean
): Record<string, string> => {
  return (
    Object.keys(obj)
      .filter(key => predicate(key))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      .reduce((acc, curr: any) => Object.assign(acc, { [curr]: obj[curr] }), {})
  );
};

export const removeEmptyEntries = (obj: Record<string, unknown>): Record<string, string> => {
  const predicate = (key: string): boolean => obj[key] !== null && obj[key] !== undefined && obj[key] !== '';

  return removeEntries(obj, predicate);
};

export const commonAttributes = (): Attrs => {
  return {
    class: { default: null },
    id: { default: null },
    style: { default: null }
  };
};

export const marks: Record<EditorMarks, MarkSpec> = {
  /**
   * A link. Has `href` and `title` attributes. `title` defaults to an empty string.
   * Rendered and parsed as an `<a>` element.
   */
  link: {
    attrs: {
      href: { default: '' },
      target: { default: null },
      title: { default: null }
    },
    inclusive: false,
    parseDOM: [
      {
        getAttrs: (node: string | HTMLElement): Attrs | null => {
          if (typeof node !== 'string') {
            return {
              href: node.getAttribute('href'),
              target: node.getAttribute('target'),
              title: node.getAttribute('title')
            };
          }

          return null;
        },
        tag: 'a[href]'
      }
    ],
    toDOM: (mark: Mark): DOMOutputSpec => [
      'a',
      // Add default value for href. Otherwise the link is not rendered properly
      Object.assign({}, { href: '' }, removeEmptyEntries(mark.attrs)),
      SLOT
    ]
  },
  /**
   * An emphasis mark. Rendered as an `<em>` element.
   * Has parse rules that also match `<i>` and `font-style: italic`.
   */
  em: {
    parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
    toDOM: (): DOMOutputSpec => ['em', SLOT]
  },
  /**
   * A strong mark. Rendered as `<strong>`, parse rules also match `<b>` and `font-weight: bold`.
   */
  strong: {
    parseDOM: [
      { tag: 'strong' },
      // This works around a Google Docs misbehavior where pasted content will be inexplicably
      // wrapped in `<b>`tags with a font-weight normal
      {
        tag: 'b',
        getAttrs: (node: string | HTMLElement): false | null => {
          if (typeof node !== 'string') {
            return node.style.fontWeight !== 'normal' && null;
          }

          return null;
        }
      },
      {
        // According to the docs, the value can be a DOM element (for tag rules) or a string (for style rules).
        getAttrs: (node: string | HTMLElement): false | null => {
          if (typeof node === 'string') {
            return /^(bold(er)?|[5-9]\d{2,})$/.test(node) && null;
          }

          return null;
        },
        style: 'font-weight'
      }
    ],
    toDOM: (): DOMOutputSpec => ['strong', SLOT]
  },
  /**
   * Code font mark. Represented as a `<code>` element.
   */
  code: {
    parseDOM: [
      { tag: 'span.code', preserveWhitespace: true },
      { tag: 'code', preserveWhitespace: true },
      { tag: 'tt', preserveWhitespace: true },
      {
        tag: 'span',
        preserveWhitespace: true,
        getAttrs: domNode => {
          const dom = domNode as HTMLSpanElement;

          if (dom.style.whiteSpace === 'pre') {
            return {};
          }

          if (dom.style.fontFamily && dom.style.fontFamily.toLowerCase().indexOf('monospace') >= 0) {
            return {};
          }

          return false;
        }
      }
    ],
    toDOM: (): DOMOutputSpec => ['code', SLOT]
  },
  /**
   * An underline mark. Rendered as a `<u>` element. Parse rules also match `text-decoration: underline`.
   */
  underline: {
    parseDOM: [{ tag: 'u' }, { style: 'text-decoration=underline' }],
    toDOM: (): DOMOutputSpec => ['u', SLOT]
  },
  /**
   * A strikethrough mark. Rendered as a `<del>` element.
   * Parse rules also match `<s>`, `<strike>`, `text-decoration: line-through`.
   */
  strikethrough: {
    parseDOM: [{ tag: 'del' }, { tag: 's' }, { tag: 'strike' }, { style: 'text-decoration=line-through' }],
    toDOM: (): DOMOutputSpec => ['del', SLOT]
  },
  /**
   * A subscript mark. Rendered as a `<sub>` element. Parse rules also match `vertical-align: sub`.
   */
  subscript: {
    parseDOM: [{ tag: 'sub' }, { style: 'vertical-align=sub' }],
    toDOM: (): DOMOutputSpec => ['sub', SLOT]
  },
  /**
   * A superscript mark. Rendered as a `<sup>` element. Parse rules also match `vertical-align: super`.
   */
  superscript: {
    parseDOM: [{ tag: 'sup' }, { style: 'vertical-align=super' }],
    toDOM: (): DOMOutputSpec => ['sup', SLOT]
  }
};

const getAttributes = (node: string | HTMLElement): Attrs => {
  const result: { [key: string]: string } = {};

  if (typeof node !== 'string') {
    const attributes = node.attributes;

    let attr;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < attributes.length; i++) {
      attr = attributes[i];
      result[attr.name] = attr.value;
    }
  }

  return result;
};

export const nodes: Record<EditorNodes, NodeSpec> = {
  /** The top level document node. */
  doc: {
    content: 'block+'
  },
  /**
   * A plain textblock paragraph. Represented as a `<p>` element in the DOM.
   */
  paragraph: {
    attrs: Object.assign({}, commonAttributes()),
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p', getAttrs: getAttributes }],
    toDOM: (node: PMNode): DOMOutputSpec =>
      isEmpty(node.attrs) ? ['p', SLOT] : ['p', removeEmptyEntries(node.attrs), SLOT]
  },
  /**
   * A blockquote (`<blockquote>`) which wraps one or more blocks.
   */
  blockquote: {
    attrs: Object.assign({}, commonAttributes()),
    content: 'inline*',
    defining: true,
    group: 'block',
    parseDOM: [{ tag: 'blockquote', getAttrs: getAttributes }],
    toDOM: (node: PMNode): DOMOutputSpec => ['blockquote', removeEmptyEntries(node.attrs), SLOT]
  },
  /**
   * A horizontal (`<hr>`) rule.
   */
  horizontalRule: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM: (): DOMOutputSpec => ['hr']
  },
  /**
   * A heading textblock with a `level` attribute that has to hold a number from 1 to 6.
   * Parsed and serialized as an `<h1>` to an `<h6>` element.
   */
  heading: {
    attrs: Object.assign({ level: { default: 1 } }, commonAttributes()),
    content: 'inline*',
    defining: true,
    group: 'block',
    parseDOM: [
      { tag: 'h1', getAttrs: (node: string | HTMLElement) => ({ ...getAttributes(node), level: 1 }) },
      { tag: 'h2', getAttrs: (node: string | HTMLElement) => ({ ...getAttributes(node), level: 2 }) },
      { tag: 'h3', getAttrs: (node: string | HTMLElement) => ({ ...getAttributes(node), level: 3 }) },
      { tag: 'h4', getAttrs: (node: string | HTMLElement) => ({ ...getAttributes(node), level: 4 }) },
      { tag: 'h5', getAttrs: (node: string | HTMLElement) => ({ ...getAttributes(node), level: 5 }) },
      { tag: 'h6', getAttrs: (node: string | HTMLElement) => ({ ...getAttributes(node), level: 6 }) }
    ],
    toDOM: (node: PMNode): DOMOutputSpec => {
      const attrs = removeEntries(node.attrs, key => key !== 'level'),
        { level } = node.attrs as Attrs & { level: number };

      return [`h${level}`, removeEmptyEntries(attrs), SLOT];
    }
  },
  /**
   * A code listing. Prevents marks or non-text inline nodes by default.
   * Represented as a `<pre>` element with a `<code>` element inside.
   */
  codeBlock: {
    code: true,
    content: 'text*',
    defining: true,
    group: 'block',
    marks: '',
    parseDOM: [
      {
        preserveWhitespace: 'full',
        tag: 'pre'
      }
    ],
    toDOM: (): DOMOutputSpec => ['pre', ['code', SLOT]]
  },
  /** The text node. */
  text: {
    group: 'inline'
  },
  /**
   * An inline image (`<img>`) node. Supports `src`, `alt`, and `href` attributes.
   * The last two default to an empty string.
   */
  image: {
    attrs: Object.assign({}, commonAttributes(), {
      alt: { default: null },
      height: { default: null },
      src: {},
      width: { default: null }
    }),
    draggable: true,
    group: 'inline',
    inline: true,
    parseDOM: [{ tag: 'img[src]', getAttrs: getAttributes }],
    toDOM: (node: PMNode): DOMOutputSpec => ['img', removeEmptyEntries(node.attrs)]
  },
  /**
   * A hard line break. Represented as a `<br>` element in the DOM.
   */
  hardBreak: {
    group: 'inline',
    inline: true,
    parseDOM: [{ tag: 'br', getAttrs: getAttributes }],
    selectable: false,
    toDOM: (): DOMOutputSpec => ['br']
  },
  /**
   * A list item. Represented as a `<li>` element.
   */
  listItem: {
    attrs: Object.assign({}, commonAttributes()),
    content: 'paragraph block*',
    marks: '_',
    parseDOM: [{ tag: 'li', getAttrs: getAttributes }],
    toDOM: (node: PMNode): DOMOutputSpec => ['li', removeEmptyEntries(node.attrs), SLOT]
  },
  /**
   * An ordered list. Represented as an `<ol>` element. Has a single `order` attribute
   * which determines the number at which the list starts counting. Defaults to 1.
   */
  orderedList: {
    attrs: {
      order: {
        default: 1
      }
    },
    content: 'listItem+',
    group: 'block',
    parseDOM: [
      {
        getAttrs: (node: string | HTMLElement) => {
          if (typeof node === 'string') {
            return {};
          }

          return {
            ...getAttributes(node),
            order: node.hasAttribute('start') ? parseInt(node.getAttribute('start') || '0', 10) : 1
          };
        },
        tag: 'ol'
      }
    ],
    toDOM: (node: PMNode): DOMOutputSpec => {
      const { order } = node.attrs as Attrs & { order: number };

      return order === 1 ? ['ol', SLOT] : ['ol', { start: order }, SLOT];
    }
  },
  /**
   * An unordered list. Represented as a `<ul>` element.
   */
  bulletList: {
    content: 'listItem+',
    group: 'block',
    parseDOM: [{ tag: 'ul', getAttrs: getAttributes }],
    toDOM: (): DOMOutputSpec => ['ul', SLOT]
  }
};
