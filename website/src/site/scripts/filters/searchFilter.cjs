const elasticlunr = require('elasticlunr');

module.exports = function (collection) {
  const index = elasticlunr(function () {
    this.setRef('id');
    this.addField('title');
    this.addField('content');
  });

  collection.forEach(page => {
    index.addDoc({
      id: page.url,
      title: page.template.frontMatter.data.title,
      content: page.templateContent.replace(/<[^>]+>/g, '')
    });
  });

  return index.toJSON();
};
