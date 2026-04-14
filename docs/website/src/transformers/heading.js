export function headingTransformer(options = {}) {
  options = {
    container: 'body',
    ...options
  };

  return function (doc) {
    const container = doc.querySelector(options.container);
    if (!container) {
      return;
    }

    container.querySelectorAll('h2, h3').forEach(heading => {
      const level = heading.rawTagName === 'h2' ? 2 : 3,
        id = heading.getAttribute('id') || '',
        attrs = id ? ` id="${id}" level="${level}"` : ` level="${level}"`;

      heading.replaceWith(`<doc-heading${attrs}>${heading.innerHTML}</doc-heading>`);
    });
  };
}
