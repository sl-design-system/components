import markdownit from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItAnchor from 'markdown-it-anchor';

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

// markdown.use(markdownItAnchor, {
//   permalink: markdownItAnchor.permalink.headerLink(),
//   level: [2, 3]
// });
