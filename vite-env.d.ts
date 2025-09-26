declare module '*.css' {
  const css: CSSStyleSheet;
  export default css;
}

declare module '*.css?inline' {
  const css: string;
  export default css;
}
