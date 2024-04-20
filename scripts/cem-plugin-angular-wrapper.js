import { writeFile } from 'fs/promises';
import { join } from 'path';
import { camelize, dasherize } from './utils.js';

function getComponentEvents(component, eventMap) {
  return component.events
    ?.map(event => {
      console.log(event);
      const matches = event.type.text.match(/(\w+)(\<(.+)\>)?/),
        type = matches[1],
        name = camelize(event.name),
        code = `  @Output() ${name} = new EventEmitter<${type ?? 'void'}>();`,
        { declaration } = eventMap.get(type),
        pkgName = declaration.module.replace('packages/components/', '').split('/')[0],
        path = `@sl-design-system/${pkgName === 'shared' ? 'shared/events.js' : pkgName}`;

      return { name, type, code, path };
    });
};

function generateComponent(imports, component, events) {
  return `import { CUSTOM_ELEMENTS_SCHEMA, Component, ${events.length ? 'EventEmitter, ' : ''}Input${events.length ? ', Output' : ''} } from '@angular/core';
${imports.join('\n')}
import { CePassthrough } from './ce-passthrough';

@Component({
  selector: '${component.tagName}',
  standalone: true,
  template: '<ng-content/>',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ${component.name}Component extends CePassthrough<${component.name}> {
${component.members
  .filter(member => member.kind === 'field' && !member.privacy && !member.name.endsWith('Event'))
  .map(member => `  @Input() ${member.name}!: ${component.name}['${member.name}'];`).join('\n')}
${events.length ? `\n${events.map(event => event.code).join('\n')}\n` : ''}}
`;
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

  const components = modules.flatMap(m => m.declarations.filter(decl => !exclude.includes(decl.name) && decl.customElement || decl.tagName));

  for (const component of components) {
    const ce = ceMap.get(component.tagName);
    if (!ce?.package) {
      continue;
    }

    const events = getComponentEvents(component, eventMap) ?? [];

    const imports = [
      `import { ${component.name} } from '${ce.package}';`,
      `import '${ce.package}/register.js';`,
      ...events.map(event => `import { ${event.type} } from '${event.path}';`)
    ];

    const componentSrc = await generateComponent(imports, component, events);

    await writeFile(join(outDir, `${dasherize(component.name)}.component.ts`), componentSrc, 'utf8');
  }
};

export default function plugin({
  exclude = [],
  outDir = 'dist'
} = {}) {
  return {
    name: 'angular-wrapper',
    async packageLinkPhase({ customElementsManifest }) {
      const { modules } = customElementsManifest;

      await generateComponents(modules, exclude, outDir);
    }
  };
};
