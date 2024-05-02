export function methodAndFieldPlugin(type) {
  return {
    name: 'method-plugin',
    packageLinkPhase({ customElementsManifest, context }) {
      customElementsManifest.modules.forEach(mod => {
        let elements = [];
        mod.declarations.forEach(declaration => {
          declaration.members?.forEach(member => {
            if (member && member.kind === type && !member.attribute) {
              elements.push(member);
            }
            if (type === 'field') {
              declaration.fields = elements;
            } else {
              declaration.methods = elements;
            }
          });
        });
      });
    }
  };
}

export function noPrivateFieldsPlugin() {
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
  };
}

export function sortMembersPlugin() {
  function sortBy(fieldName) {
    return (a, b) => {
      const valueA = a[fieldName], valueB = b[fieldName];

      if (valueA < valueB) {
        return -1;
      } else if (valueA > valueB) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  return {
    name: 'sort-members-plugin',
    packageLinkPhase({ customElementsManifest }) {
      customElementsManifest.modules.sort(sortBy('path'));
      customElementsManifest.modules.forEach(mod => {
        mod.declarations.sort(sortBy('name'));
        mod.declarations.forEach(declaration => {
          declaration.members?.sort(sortBy('name'));
        });
      });
    }
  }
}
