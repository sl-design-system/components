const StyleDictionary = require('style-dictionary'),
  _ = require('lodash');

const template = _.template(`<% _.each(props, function(prop, classname) { %>@mixin <%= classname %> {
<% _.each(prop, (value, rule) => { %><% if (typeof value === 'object') { %>  &.<%= rule %> {<% _.each(value, (subvalue, subrule) => { %>
  <%= subrule %>: <%= subvalue %>;<% }) %>
}<% } else { %>  <%= rule %>: <%= value %>;<% } %>
<% }) %><% }) %>}
`);
    
StyleDictionary.registerTransform({
  name: 'attribute/group',
  type: 'attribute',
  matcher: prop => {
    return prop.filePath.endsWith('components.json');
  },
  transformer: prop => {
    return {
      group: true,
      groupName: prop.path.slice(0, prop.path.length - 1).join('-')
    };
  }
});

StyleDictionary.registerTransformGroup({
  name: 'custom/scss',
  // transforms: StyleDictionary.transformGroup['css'].concat(['attribute/group'])
  // transforms: ['name/cti/kebab', 'attribute/group']
  transforms: ['attribute/cti', 'color/css', 'name/cti/kebab', 'size/px']
});

StyleDictionary.registerFormat({
  name: 'scss/mixin2',
  formatter: ({ dictionary }) => {
    const props = {};

    // go through properties and structure final props object
    dictionary.allTokens.map(prop => {
      const { attributes, path } = prop;
      let value = prop.value;

      if (!prop.filePath.endsWith('components.json')) {
        return;
      }

      // extract attributes to build custom class and style rules
      const { category, type, item, subitem } = attributes;

      if (dictionary.usesReference(prop.original.value)) {
        const refs = dictionary.getReferences(prop.original.value);
        refs.forEach(ref => value = `var(--${ref.name})`);
      }

      // build main classname for .scss file
      // const className = `${category}-${type}`;
      const className = ['sl', ...path.slice(0, -1)].join('-');

      if (!props.hasOwnProperty(className)) {
        props[className] = {};
      }

      if (subitem) {
        const kebabCase = subitem
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .replace(/[\s_]+/g, '-')
          .toLowerCase();

        // add the subitem and value as final CSS rule
        props[className][kebabCase] = value;
      }
    });

    return template({ props });
  }
});

StyleDictionary.registerFormat({
  name: 'scss/mixin',
  formatter: function (dictionary, config) {
    const groupMap = dictionary.allProperties.reduce(function (prev, curr) {
      if (!prev[curr.attributes.groupName]) {
        prev[curr.attributes.groupName] = [];
      }
      prev[curr.attributes.groupName].push(curr);
      return prev;
    }, {});

    return Object.keys(groupMap)
      .filter(key => key !== 'undefined')
      .map(key => {
        let props = groupMap[key];

        return `@mixin sl-${key} {
${props
  .map(prop => {
    console.log(prop);
    return `  ${prop.name}: ${prop.value};`;
  })
  .join('\n')}
}`;
      })
      .join('\n\n');
  }
});

const StyleDictionaryExtended = StyleDictionary.extend(__dirname + '/config.json');

StyleDictionaryExtended.buildAllPlatforms();
