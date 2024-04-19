import { writeFile } from 'fs/promises';
import { join } from 'path';
import { camelize, dasherize } from './utils.js';

function getComponentEvents(component, eventMap) {
  return component.members
    .filter(member => member.kind === 'field' && !member.privacy && member.name.endsWith('Event'))
    .map(member => {
      const matches = member.type.text.match(/EventEmitter\<(\w+)(\<(.+)\>)?\>/),
        type = matches?.[1],
        name = camelize(member.name.replace('Event', '')),
        event = `${component.name}['${name}']`,
        code = `  @Output() ${name} = new EventEmitter<${type ?? 'void'}>();`

      console.log(type, eventMap.get(type));

      return { type, name, event, code };
    });
};

function generateComponent(imports, component, events) {
  return `import { Directive, ${events.length ? 'EventEmitter, ' : ''}Input${events.length ? ', Output' : ''} } from '@angular/core';
${imports.join('\n')}
import { CePassthrough } from './ce-passthrough';

@Directive({
  selector: '${component.tagName}',
  standalone: true
})
export class ${component.name}Directive extends CePassthrough<${component.name}> {
${component.members
  .filter(member => member.kind === 'field' && !member.privacy && !member.name.endsWith('Event'))
  .map(member => `  @Input() ${member.name}!: ${component.name}['${member.name}'];`).join('\n')}
${events.map(event => event.code).join('\n')}
}
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

    const imports = [
      `import { ${component.name} } from '${ce.package}';`,
      `import '${ce.package}/register.js';`
    ];

    const events = getComponentEvents(component, eventMap);

    const componentSrc = await generateComponent(imports, component, events);

    await writeFile(join(outDir, `${dasherize(component.name)}.directive.ts`), componentSrc, 'utf8');
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
