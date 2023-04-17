function noPrivateFieldsPlugin() {
  return {
    name: 'no-private-fields-plugin',
    packageLinkPhase({ customElementsManifest, context }) {
      customElementsManifest.modules.forEach(mod => {
        mod.declarations.forEach(declaration => {
          declaration.attributes = declaration.attributes?.filter(attr => {
            if (!attr.fieldName) {
              return true;
            }

            const field = declaration.members?.find(member => member.name === attr.fieldName);

            return !field || field.privacy !== 'private';
          });

          declaration.events = declaration.events?.filter(event => {
            return event.privacy !== 'private';
          });

          declaration.members = declaration.members?.filter(member => {
            return member.privacy !== 'private' && !member.name.startsWith('#');
          });
        });
      });
    }
  }
}

function sortMembersPlugin() {
  return {
    name: 'sort-members-plugin',
    packageLinkPhase({ customElementsManifest, context }) {
      customElementsManifest.modules.forEach(mod => {
        mod.declarations.forEach(declaration => {
          declaration.members?.sort((a, b) => {
            const nameA = a.name, nameB = b.name;

            if (nameA < nameB) {
              return -1;
            } else if (nameA > nameB) {
              return 1;
            } else {
              return 0;
            }
          });
        });
      });
    }    
  }
}

export default {
  globs: ['src/**/*.ts'],
  exclude: [
    'src/**/*.{d,e2e,spec}.ts',
    'src/**/*.stories.*',
    'src/locales/**/*'
  ],
  litelement: true,
  outdir: 'dist',
  plugins: [
    noPrivateFieldsPlugin(),
    sortMembersPlugin()
  ]
};
