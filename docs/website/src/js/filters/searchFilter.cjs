const elasticlunr = require("elasticlunr");

module.exports = function(collection) {
  var index = elasticlunr(function() {
    this.addField("title");
    this.addField("excerpt");
    this.addField("genres");
    this.setRef("id");
  });

  collection.forEach(page => {
    index.addDoc({
      id: page.url,
      title: page.template.frontMatter.data.title,
      excerpt: page.template.frontMatter.data.excerpt,
      genres: page.template.frontMatter.data.genres
    });
  });

  return index.toJSON();
};
