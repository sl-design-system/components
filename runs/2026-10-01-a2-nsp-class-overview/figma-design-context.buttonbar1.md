const assetPathPrefix = "https://www.figma.com/api/mcp/asset/ed87b985-f3c6-4c5a-9113-8d4fb54f4e36";
export default function SlButtonBarRectangle() {
return (
<CodeConnectSnippet data-node-id="2422:87052" data-name="sl-button-bar/Rectangle" data-snippet-language="SL Design System">
<sl-button-bar fill="outline">
<sl-button variant="primary">
<sl-icon name="far-presentation-screen"></sl-icon>
Add students
</sl-button>
</sl-button-bar>
</CodeConnectSnippet>
);
}SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.

1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
   DO NOT install any Tailwind as a dependency unless the user instructs you to do so.
   Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.These styles are contained in the design: Body/md/bold: Font(family: "text-new/typeset/fontFamily/body", style: Medium, size: size/text-new/body/md, weight: text-new/typeset/fontWeight/semiBold, lineHeight: size/lineHeight/250, letterSpacing: 0).If the node is connected to a code component in the users codebase via Code Connect, the connected component will be included in the final markup wrapped in a CodeConnectSnippet element, with relevant imports at the top of the file. There are two formats: 1. Single snippet: <CodeConnectSnippet data-snippet-language="React"><TitleComponent>Hello World</TitleComponent></CodeConnectSnippet> 2. Multiple options: <CodeConnectSnippet data-snippet-language="React" options={[<Button variant="primary" />, <Button variant="secondary" />]} /> IMPORTANT: the CodeConnectSnippet wrapper element should not be part of the final code. For the options format, choose the single most appropriate option to use in your implementation. The source of the code component will be in the import path, e.g. import {ComponentName } from 'path/to/component'; IMPORTANT: the import path may not be relative/may point to a URL, so you should search for the component in the codebase and MUST use it if possible.Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## sl-button-bar/Rectangle

**Node ID:** 2079:26529

The Button bar provides a organized way to present buttons side by side, which will stack up when there's not enough space.

**Documentation:**

- [https://sanomalearning.design/categories/components/button-bar/usage/](https://sanomalearning.design/categories/components/button-bar/usage/)

## sl-button-rectangular

**Node ID:** 2045:9049

A button initiates an action when clicked, like redirecting to a new page or submitting a form. It's a key element for interaction and action.

INVERTED BUTTONS are only to be used with `elevation.surface.raised.inverted` and `elevation.surface.raised.primary`.

**Documentation:**

- [https://sanomalearning.design/categories/components/button/usage/](https://sanomalearning.design/categories/components/button/usage/)

## Icon only=false, ↕️ - Size=MD

**Node ID:** 2034:5921

Use for borders that highlight secondary actions.Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
