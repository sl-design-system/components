import ts from 'typescript';
import { createAttribute } from '@custom-elements-manifest/analyzer/src/features/analyse-phase/creators/createAttribute.js';
import { handleName } from '@custom-elements-manifest/analyzer/src/features/analyse-phase/creators/createMixin.js';
import { decorator } from '@custom-elements-manifest/analyzer/src/utils/index.js';
import { extractMixinNodes, isMixin } from '@custom-elements-manifest/analyzer/src/utils/mixins.js';

function handleEventDeclaration(node, moduleDoc) {
  const name = node.name.getText();

  if (node.modifiers?.at(0)?.kind === ts.SyntaxKind.ExportKeyword && name.endsWith('Event')) {
    moduleDoc.exports.push({
      kind: 'js',
      name,
      declaration: {
        name,
        module: moduleDoc.path
      }
    });
  }
}

function handleEventDecorator(classNode, moduleDoc, mixinName = null) {
  const className = mixinName || classNode?.name?.getText(),
    currClass = moduleDoc?.declarations?.find(decl => decl.name === className);

  classNode?.members
    ?.filter(member => member?.modifiers?.some(mod => mod?.expression?.expression?.getText() === 'event'))
    .forEach(member => {
      const eventDecorator = member.modifiers.find(decorator('event')),
        name = eventDecorator?.expression?.arguments?.at(0)?.properties?.at(0)?.initializer?.text,
        description = member?.jsDoc?.at(0)?.tags?.at(0)?.comment || member?.jsDoc?.at(0)?.comment,
        type = member.type?.typeArguments?.at(0)?.getText();

      const attribute = createAttribute();
      attribute.name = name;
      attribute.description = description;
      attribute.kind = 'event';
      attribute.type = { text: type };

      const existingAttribute = currClass?.events?.find(attr => attr.name === attribute.name);
      if (!existingAttribute) {
        currClass.events.push(attribute);
      } else {
        currClass.events = currClass?.events?.map(attr =>
          attr.name === attribute.name ? { ...attr, ...attribute } : attr
        );
      }
    });
}

export function eventDecoratorPlugin() {
  return {
    name: 'event-decorator-plugin',
    analyzePhase({ ts, node, moduleDoc }) {
      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
          handleEventDecorator(node, moduleDoc);
          break;
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.VariableStatement:
          if (isMixin(node)) {
            const { mixinFunction, mixinClass } = extractMixinNodes(node),
              { name } = handleName({}, mixinFunction);

            handleEventDecorator(mixinClass, moduleDoc, name);
          }
          break;
        case ts.SyntaxKind.TypeAliasDeclaration:
          handleEventDeclaration(node, moduleDoc);
          break;
      }
    }
  };
}

