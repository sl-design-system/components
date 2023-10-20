const elasticlunr = require('elasticlunr');

module.exports = function (collection) {
  const index = elasticlunr(function () {
    this.setRef('id');
    this.addField('title');
    this.addField('content');
  });

  collection.forEach(page => {
    if(page.template._frontMatter){
      index.addDoc({
        id: page.url,
        title: page.template._frontMatter?.data.title,
        content: page.template._frontMatter.content?.replace(/<[^>]+>/g, '')
      });
    } else {
      console.warn(`⛔️ "${page.template.inputPath}" is empty, are you sure this isn't an error?`);
    }

  });

  return index.toJSON();
};
