import ts from 'typescript';
import { isAlsoAttribute, getAttributeName, reflects } from '@custom-elements-manifest/analyzer/src/features/framework-plugins/lit/utils.js';
import { decorator } from '@custom-elements-manifest/analyzer/src/utils/index.js';
import { createAttributeFromField } from '@custom-elements-manifest/analyzer/src/features/analyse-phase/creators/createAttribute.js';
import { extractMixinNodes, isMixin } from '@custom-elements-manifest/analyzer/src/utils/mixins.js';
import { handleName } from '@custom-elements-manifest/analyzer/src/features/analyse-phase/creators/createMixin.js';

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

          // console.log('declaration.members', declaration.members);
        });
      });
    }
  }
}
export function eventPlugin() {
  return {
    name: 'event-plugin',
    analyzePhase({ts, node, moduleDoc}){
      switch (node.kind) {
        case ts.SyntaxKind.VariableStatement:
        case ts.SyntaxKind.FunctionDeclaration:
          if(isMixin(node)) {
            const { mixinFunction, mixinClass } = extractMixinNodes(node);
            const { name } = handleName({}, mixinFunction);
            handleEventDecorator(mixinClass, moduleDoc, name);
          }
          break;

        case ts.SyntaxKind.ClassDeclaration:    
          handleEventDecorator(node, moduleDoc);
          break;
        }
      }
  }
}

export function sortMembersPlugin() {
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


function handleEventDecorator(classNode, moduleDoc, mixinName = null) {
  let className;
  if(!mixinName) {
    className = classNode?.name?.getText();
  } else {
    className = mixinName;
  }

  
  const currClass = moduleDoc?.declarations?.find(declaration => declaration.name === className);

  /**
   * Find members with @event decorator
   */
  classNode?.members?.forEach(member => {
    if (hasEventDecorator(member)) {
      const propertyDecorator = member.decorators.find(decorator('event'));
      const propertyOptions = propertyDecorator?.expression?.arguments?.find(arg => ts.isObjectLiteralExpression(arg));
      
      /**
       * If property does _not_ have `attribute: false`, also create an attribute based on the field
      */
     if (isAlsoAttribute(propertyOptions)) {
       const field = currClass.members.find(classMember => classMember.name === member.name.getText());
       /** If a `field` was not found on the `currClass`, that's because it has a @internal jsdoc notation */
       if(!field) {
         return;
        }
        const attribute = createAttributeFromField(field);

        /**
         * If an attribute name is provided
         * @example @property({attribute:'my-foo'})
         */
        const attributeName = getAttributeName(propertyOptions);
        if(attributeName) {
          attribute.name = attributeName;
          field.attribute = attributeName;
        } else {
          field.attribute = field.name;
        }

        
        if(reflects(propertyOptions)) {
          field.attribute = attribute.name;
          field.reflects = true;
        }

        const existingAttribute = currClass?.events?.find(attr => attr.name === attribute.name);

        if(!existingAttribute) {
          currClass.events.push(attribute);
        } else {
          currClass.events = currClass?.events?.map(attr => attr.name === attribute.name ? ({...attr, ...attribute}) : attr);
        }
      }
    }
  });
}

export function hasEventDecorator(node) {
  return node?.decorators?.some((decorator) => { 
    return decorator?.expression?.expression?.getText() === 'event'
  });
}
