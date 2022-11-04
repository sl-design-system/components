const elasticlunr = require("elasticlunr");

module.exports = function(collection) {
  var index = elasticlunr(function() {
    this.addField("title");
    // this.addField("excerpt");
    this.setRef("id");
    this.addField("content");
  });

  collection.forEach(page => {
    console.log('page.template', /*page.templateContent,*/ page.templateContent.replace(/<[^>]+>/g, ''));
    index.addDoc({
      id: page.url,
      title: page.template.frontMatter.data.title,
      // excerpt: page.template.frontMatter.data.excerpt,
      content: page.templateContent.replace(/<[^>]+>/g, '')
    });
  });

  return index.toJSON();
};
