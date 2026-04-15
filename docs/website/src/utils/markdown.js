import markdownit from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItContainer from 'markdown-it-container';
import markdownItDeflist from 'markdown-it-deflist';

export const markdown = markdownit({
  html: true,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: false,
  typographer: false
});

markdown.use(markdownItAttrs, {
  allowedAttributes: []
});

markdown.use(markdownItContainer, 'info', {
  validate(params) {
    return params.trim() === 'info';
  },
  render(tokens, idx) {
    if (tokens[idx].nesting === 1) {
      return '<sl-callout>';
    } else {
      return '</sl-callout>';
    }
  }
});

markdown.use(markdownItDeflist);
