export const sizePx = {
  name: 'size/px',
  type: 'value',
  matcher: token => ['borderRadius', 'borderWidth', 'sizing', 'spacing'].includes(token.type),
  transformer: token => `${token.value}px`
};
