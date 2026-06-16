import slugify from 'slugify';

function createId(text) {
  let slug = slugify(String(text), {
    remove: /[^\w|\s]/g,
    lower: true
  });

  // ids must start with a letter
  if (!/^[a-z]/i.test(slug)) {
    slug = `wa_${slug}`;
  }

  return slug;
}

export function anchorHeadingsTransformer(options = {}) {
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
        id = heading.getAttribute('id') || createId(heading.text),
        attrs = ` id="${id}" level="${level}"`,
        inner = `<a href="#${id}">${heading.innerHTML}</a>`;

      heading.replaceWith(`<doc-heading${attrs}>${inner}</doc-heading>`);
    });
  };
}
