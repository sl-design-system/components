import figma, { html } from '@figma/code-connect/html';

const props = {
  buttonVariants: figma.nestedProps('Button-Variants', {
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Info: 'info',
      Warning: 'warning',
      Danger: 'danger',
      Inverted: 'inverted'
    }),

    fill: figma.enum('Type', {
      Solid: 'solid',
      Outline: 'outline',
      Ghost: 'ghost',
      Link: 'link'
    }),

    // State=Disabled maps to the disabled boolean attribute; all other
    // states (Idle, Hover, Focused) are non-persistent interaction states.
    disabled: figma.enum('State', {
      Disabled: true
    })
  }),

  // Button-Base is nested inside Button-Variants but must be declared at
  // the top level — nestedProps cannot be nested inside another nestedProps.
  buttonBase: figma.nestedProps('Button-Base', {
    size: figma.enum('↕️ - Size', {
      SM: 'sm',
      MD: 'md',
      LG: 'lg'
    }),

    label: figma.string('𝐓 - Label')
  })
};

figma.connect(
  // The rectangular button
  'https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=301-54273',
  {
    props,
    example: p => html`
      <sl-button
        ?disabled=${p.buttonVariants.disabled}
        fill=${p.buttonVariants.fill}
        size=${p.buttonBase.size}
        variant=${p.buttonVariants.variant}
        >${p.buttonBase.label}</sl-button
      >
    `
  }
);

figma.connect(
  // The pill-shaped button
  'https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=301-54346',
  {
    props,
    example: p => html`
      <sl-button
        ?disabled=${p.buttonVariants.disabled}
        fill=${p.buttonVariants.fill}
        shape="pill"
        size=${p.buttonBase.size}
        variant=${p.buttonVariants.variant}
        >${p.buttonBase.label}</sl-button
      >
    `
  }
);
