export const palette = {
  name: 'attribute/palette',
  type: 'attribute',
  transformer: token => {
    const { category, type } = token.attributes;

    if (category === 'color' && type === 'palette') {
      token.palette = true;
    }

    return token;
  }
};

export const shadow = {
  name: 'shadow/css',
  type: 'value',
  transitive: true,
  matcher: token => token.type === 'boxShadow',
  transformer: token => {
    return `${token.value.x} ${token.value.y} ${token.value.blur} ${token.value.spread} ${token.value.color}`;
  }
};

export const sizePx = {
  name: 'size/px',
  type: 'value',
  matcher: token => ['borderRadius', 'borderWidth', 'paragraphSpacing', 'sizing', 'spacing'].includes(token.type),
  transformer: token => (typeof token.value === 'string' ? token.value : `${token.value}px`)
};

export const typography = {
  name: 'typography/scss',
  type: 'value',
  transitive: true,
  matcher: token => token.type === 'typography',
  transformer: token => {
    console.log('typography', token);
    return '';
  }
};
