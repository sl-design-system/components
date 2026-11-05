import figma, { type InstanceHandle } from 'figma';
import { checkBooleanProperty, checkEnum, checkStringProperty } from './figma-assertions.js';

export function getFormFieldProperties(labelBase?: InstanceHandle) {
  if (!labelBase) return { label: '', hint: '', required: false, mark: '', infotip: '' };

  const label = checkStringProperty(labelBase.getString('label'), 'label'),
    displayHint = checkBooleanProperty(labelBase.getBoolean('display-hint'), 'display-hint'),
    displayInfotip = checkBooleanProperty(
      labelBase.getBoolean('display-infotip'),
      'display-infotip'
    ),
    hint = displayHint ? checkStringProperty(labelBase.getString('hint'), 'hint') : '',
    required =
      checkEnum(labelBase.getEnum('required', { true: 'true', false: 'false' }), 'required') ===
      'true',
    optional =
      checkEnum(labelBase.getEnum('optional', { true: 'true', false: 'false' }), 'optional') ===
      'true';

  let infotip = '';
  if (displayInfotip) {
    const infotipInstance = labelBase.findInstance('Infotip');
    if (infotipInstance.type === 'ERROR') {
      throw new Error('Missing Figma instance: Infotip');
    }

    infotip = infotipInstance
      .executeTemplate()
      .example.filter(section => section.type === 'CODE')
      .map(section => section.code)
      .join('\n')
      .replace('<sl-infotip', '<sl-infotip slot="infotip"');
  }

  return {
    label,
    hint,
    required,
    mark: required ? 'required' : optional ? 'optional' : '',
    infotip
  };
}

export function renderFormField(
  { label, hint, mark, infotip }: ReturnType<typeof getFormFieldProperties>,
  content: ReturnType<typeof figma.code> | string = ''
) {
  return figma.code`
    <sl-form-field
      ${label && !infotip ? ` label="${label}"` : ''}
      ${hint ? ` hint="${hint}"` : ''}
      ${mark ? ` mark="${mark}"` : ''}
    >
      ${
        infotip
          ? figma.code`
        <sl-label slot="label" ${mark ? ` mark="${mark}"` : ''}>
          ${label}
          ${infotip}
        </sl-label>
      `
          : ''
      }
      ${content}
    </sl-form-field>
  `;
}
