import { writeFile } from 'fs/promises';
import { join } from 'path';
import { camelize, dasherize } from './utils.js';

function getComponentEvents(component, eventMap) {
  return component.events
    ?.map(event => {
      const matches = event.type.text.match(/(\w+)(\<(.+)\>)?/),
        type = matches[1],
        angularName = camelize(event.name),
        code = `  @Output() ${angularName} = new EventEmitter<${type ?? 'void'}>();`,
        { declaration } = eventMap.get(type),
        pkgName = declaration.module.replace('packages/components/', '').split('/')[0],
        path = `@sl-design-system/${pkgName === 'shared' ? 'shared/events.js' : pkgName}`;

      return { name: event.name, angularName, type, code, path };
    });
};

function generateComponent(imports, component, events) {
  return `import { Component, ${events.length ? 'EventEmitter, ' : ''}Input${events.length ? ', Output' : ''} } from '@angular/core';
${imports.join('\n')}
import { CePassthrough } from './ce-passthrough';

@Component({
  selector: '${component.tagName}',
  standalone: true,
  template: '<ng-content/>'
})
export class ${component.name}Component extends CePassthrough<${component.name}> {${events.length ? `\n  static override eventMap = {\n${events.map(event => `    '${event.name}': '${event.angularName}'`).join(',\n')}\n  };\n` : ''}
${component.members
  .filter(member => member.kind === 'field' && !member.privacy && !member.static && !member.name.endsWith('Event'))
  .map(member => `  @Input() ${member.name}!: ${component.name}['${member.name}'];`).join('\n')}
${events.length ? `\n${events.map(event => event.code).join('\n')}\n` : ''}}
`;
};

const generateIndex = async (components, outDir) => {
  const indexSrc = components.map(component => `export * from './${dasherize(component.name)}.component';`).join('\n');

  await writeFile(join(outDir, 'index.ts'), indexSrc, 'utf8');
};

const generateComponents = async (modules, exclude, outDir) => {
  const ceMap = new Map(
    modules.flatMap(m => m.exports
      .filter(exp => exp.kind === 'custom-element-definition')
      .map(exp => ({ ...exp, package: `@sl-design-system/${m.path?.replace('packages/components/', '').split('/')[0]}` }))
      .map(exp => [exp.name, exp])
    )
  );

  const eventMap = new Map(
    modules.flatMap(m => m.exports
      .filter(exp => exp.name.endsWith('Event'))
      .map(exp => ({ ...exp, package: `@sl-design-system/${m.path?.replace('packages/components/', '').split('/')[0]}` }))
      .map(exp => [exp.name, exp])
    )
  );

  const components = modules
    .flatMap(m => m.declarations.filter(decl => !exclude.includes(decl.name) && decl.customElement || decl.tagName))
    .filter(({ tagName }) => ceMap.has(tagName) && ceMap.get(tagName).package);

  for (const component of components) {
    const ce = ceMap.get(component.tagName),
      events = getComponentEvents(component, eventMap) ?? [];

    const imports = [
      `import { ${component.name} } from '${ce.package}';`,
      `import '${ce.package}/register.js';`,
      ...events.map(event => `import { ${event.type} } from '${event.path}';`)
    ];

    const componentSrc = await generateComponent(imports, component, events);

    await writeFile(join(outDir, `${dasherize(component.name)}.component.ts`), componentSrc, 'utf8');
  }

  await generateIndex(components, outDir);
};

export default function plugin({
  exclude = [],
  outDir = 'dist'
} = {}) {
  return {
    name: 'angular-wrapper-plugin',
    async packageLinkPhase({ customElementsManifest }) {
      const { modules } = customElementsManifest;

      await generateComponents(modules, exclude, outDir);
    }
  };
};
