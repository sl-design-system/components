const assetPathPrefix = "https://www.figma.com/api/mcp/asset/431b4847-1360-4bf4-ac46-90dfb4ef4d66";
export default function SlGridQuickGrid() {
return (
<CodeConnectSnippet data-node-id="2422:87812" data-name="sl-grid-quick-grid" data-snippet-language="SL Design System">
<sl-grid></sl-grid>
</CodeConnectSnippet>
);
}SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.

1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
   DO NOT install any Tailwind as a dependency unless the user instructs you to do so.
   Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.These styles are contained in the design: Body/md/bold: Font(family: "text-new/typeset/fontFamily/body", style: Medium, size: size/text-new/body/md, weight: text-new/typeset/fontWeight/semiBold, lineHeight: size/lineHeight/250, letterSpacing: 0), Body/md/regular: Font(family: "text-new/typeset/fontFamily/body", style: Regular, size: size/text-new/body/md, weight: text-new/typeset/fontWeight/regular, lineHeight: size/lineHeight/250, letterSpacing: 0).If the node is connected to a code component in the users codebase via Code Connect, the connected component will be included in the final markup wrapped in a CodeConnectSnippet element, with relevant imports at the top of the file. There are two formats: 1. Single snippet: <CodeConnectSnippet data-snippet-language="React"><TitleComponent>Hello World</TitleComponent></CodeConnectSnippet> 2. Multiple options: <CodeConnectSnippet data-snippet-language="React" options={[<Button variant="primary" />, <Button variant="secondary" />]} /> IMPORTANT: the CodeConnectSnippet wrapper element should not be part of the final code. For the options format, choose the single most appropriate option to use in your implementation. The source of the code component will be in the import path, e.g. import {ComponentName } from 'path/to/component'; IMPORTANT: the import path may not be relative/may point to a URL, so you should search for the component in the codebase and MUST use it if possible.Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Frame=true, Zebra=false, Horizontal dividers=true, Vertical dividers=false, Full Vertical dividers=false

**Node ID:** 2422:87518

Use to visually group or seperate UI elements, such as card, tabs or side panel dividers.

## sl-button-rectangular

**Node ID:** 2045:9049

A button initiates an action when clicked, like redirecting to a new page or submitting a form. It's a key element for interaction and action.

INVERTED BUTTONS are only to be used with `elevation.surface.raised.inverted` and `elevation.surface.raised.primary`.

**Documentation:**

- [https://sanomalearning.design/categories/components/button/usage/](https://sanomalearning.design/categories/components/button/usage/)

## Icon only=true, ↕️ - Size=SM

**Node ID:** 2034:5920

Use for borders that highlight secondary actions.

## Row type=Header, State=Idle

**Node ID:** 2404:74809

An alternate surface color used for visual differentiation in components like tables or lists, providing contrast between consecutive items (e.g., zebra striping).

## sl-search-field embeded

**Node ID:** 2404:74162

A search field lets users specify a word or phrase to filter relevant content within a specific page section. For example, filter the content in a data grid or a list of content.

**Documentation:**

- [https://sanomalearning.design/categories/components/search-field/](https://sanomalearning.design/categories/components/search-field/)

## sl-icon

**Node ID:** 2003:3302

Icons communicate messages, enhance interactivity, and highlight critical information. Use them as visual representations of concepts, objects, or actions efficiently.

**Documentation:**

- [https://sanomalearning.design/categories/components/icon/usage/](https://sanomalearning.design/categories/components/icon/usage/)

## Variant=Default, State=Idle

**Node ID:** 2404:73802

Use for borders of form UI elements, such as text fields, checkboxes and, radio buttons.

## Row type=Default, State=Idle

**Node ID:** 2404:74806

Background of elevated components like cards, grids, or dropdowns that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'.

## sl-button-bar/Rectangle

**Node ID:** 2079:26529

The Button bar provides a organized way to present buttons side by side, which will stack up when there's not enough space.

**Documentation:**

- [https://sanomalearning.design/categories/components/button-bar/usage/](https://sanomalearning.design/categories/components/button-bar/usage/)

## Icon only=true, ↕️ - Size=MD

**Node ID:** 2034:5922

Use for borders that highlight secondary actions.Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
