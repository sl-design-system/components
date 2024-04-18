import { writeFile } from 'fs/promises';
import { join } from 'path';

const STRING_DASHERIZE_REGEXP = /[ _]/g,
  STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;

function dasherize(str) {
  return decamelize(str).replace(STRING_DASHERIZE_REGEXP, '-');
}

function decamelize(str) {
  return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}

function getComponentEvents(components, events) {
  return components.flatMap(component => {
    return component.members
      .filter(member => member.kind === 'field' && !member.privacy && member.name.endsWith('Event'))
      .map(member => {
        const type = member.type.text;
        const name = member.name.replace('Event', '');
        const event = `${component.name}['${name}']`;

        events.push(`  @Output() ${name} = new EventEmitter<${type}>();`);

        return { type, name, event };
      });
  });
};

function generateComponent(imports, component, events) {
  return `import { Directive, Input, Output } from '@angular/core';
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

    const events = [];

    console.log(getComponentEvents(components, events));

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
