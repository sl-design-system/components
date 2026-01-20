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

/**
 * A plugin that allows to omit inherited or unwanted properties, events,
 * methods, slots, and CSS-related members from component documentation.
 *
 * To use this plugin, add specific JSDoc tags to your class declaration:
 *
 * - `@omit <propertyName>`: Omits a property/attribute.
 * - `@omit-event <eventName>`: Omits an event.
 * - `@omit-method <methodName>`: Omits a method.
 * - `@omit-slot <slotName>`: Omits a slot.
 * - `@omit-part <partName>`: Omits a CSS part.
 * - `@omit-cssprop <cssPropertyName>`: Omits a CSS custom property.
 *
 * Example:
 * ```ts
 * /**
 *  * @omit type
 *  * @omit-event change
 *  * @omit-method calculateValue
 *  * @omit-slot footer
 *  * @omit-part button
 *  * @omit-cssprop --sl-component-color
 *  *\/
 */
export function omitPlugin() {
  const omitTagsByClass = {};

  return {
    name: 'omit-plugin',

    analyzePhase({ ts, node }) {
      if (!ts.isClassDeclaration(node) || !node.name) {
        return;
      }

      const className = node.name.text;

      const jsDocTags = ts.getJSDocTags(node);

      if (!jsDocTags?.length) {
        return;
      }
      const omitTags = {
        properties: new Set(),
        events: new Set(),
        methods: new Set(),
        slots: new Set(),
        cssParts: new Set(),
        cssProperties: new Set()
      };

      for (const tag of jsDocTags) {
        const tagName = tag.tagName.text;

        let rawComment;

        if (typeof tag.comment === 'string') {
          rawComment = tag.comment.trim();
        } else if (tag.comment) {
          // In newer TypeScript versions, tag.comment can be an array of JSDoc comment parts.
          if (typeof ts.getTextOfJSDocComment === 'function') {
            rawComment = ts.getTextOfJSDocComment(tag.comment)?.trim();
          } else {
            rawComment = String(tag.comment).trim();
          }
        }

        if (!rawComment) {
          continue;
        }

        const parts = rawComment.split(/\s+/),
         value = parts[0];

        // Ensure we have a valid identifier-like token as the first part.
        if (!value || !/^[A-Za-z0-9._-]+$/.test(value)) {
          continue;
        }

        switch (tagName) {
          case 'omit':
            omitTags.properties.add(value);
            break;
          case 'omit-event':
            omitTags.events.add(value);
            break;
          case 'omit-method':
            omitTags.methods.add(value);
            break;
          case 'omit-slot':
            omitTags.slots.add(value);
            break;
          case 'omit-part':
            omitTags.cssParts.add(value);
            break;
          case 'omit-cssprop':
            omitTags.cssProperties.add(value);
            break;
        }
      }

      omitTagsByClass[className] = omitTags;
    },

    packageLinkPhase({ customElementsManifest }) {
      customElementsManifest.modules.forEach(mod => {
        mod.declarations?.forEach(declaration => {
          const omitTags = omitTagsByClass[declaration.name];

          if (!omitTags) {
            return;
          }

          declaration.members = declaration.members?.filter(member => {
            if (member.kind === 'method') {
              return !omitTags.methods.has(member.name);
            }

            if (member.kind === 'field' || !member.kind) {
              return !omitTags.properties.has(member.name);
            }

            return true;
          });

          declaration.attributes = declaration.attributes?.filter(attr => {
            return !omitTags.properties.has(attr.name) && !omitTags.properties.has(attr.fieldName);
          });

          declaration.events = declaration.events?.filter(event => {
            return !omitTags.events.has(event.name);
          });

          declaration.slots = declaration.slots?.filter(slot => {
            const slotName = slot.name && slot.name.length > 0 ? slot.name : 'default';
            return !omitTags.slots.has(slotName);
          });

          declaration.cssParts = declaration.cssParts?.filter(part => {
            return !omitTags.cssParts.has(part.name);
          });

          declaration.cssProperties = declaration.cssProperties?.filter(prop => {
            return !omitTags.cssProperties.has(prop.name);
          });
        });
      });
    }
  };
}
