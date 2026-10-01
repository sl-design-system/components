const assetPathPrefix = "https://www.figma.com/api/mcp/asset/b24e6fc8-5959-4e99-aa69-dd18a053cab6";
export default function Frame108() {
return (
<div className="bg-white content-stretch flex items-start justify-between px-[12px] py-[16px] relative rounded-[8px] size-full" data-node-id="2422:87221">
<div className="[word-break:break-word] content-stretch flex flex-col gap-[15px] items-start leading-[0] relative shrink-0 w-[79px]" data-node-id="2422:87222">
<div className="flex flex-col font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:Regular')] font-[var(--text-new\/typeset\/fontweight\/regular,400)] justify-center relative shrink-0 text-[color:var(--color\/black,black)] text-[length:var(--size\/text-new\/body\/lg,16px)] w-full" data-node-id="2422:87223" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[var(--size\/lineheight\/300,24px)]">Class code</p>
</div>
<div className="flex flex-col font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:Medium')] font-[var(--text-new\/typeset\/fontweight\/semibold,500)] justify-center relative shrink-0 text-[color:var(--color\/palette\/grey\/600,#59636e)] text-[length:var(--size\/text-new\/body\/md,14px)] w-full" data-node-id="2422:87224" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[var(--size\/lineheight\/250,20px)]">D9981</p>
</div>
</div>
<div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="2422:87225">
<CodeConnectSnippet data-node-id="2422:87226" data-name="sl-button-rectangular" data-snippet-language="SL Design System">
<sl-button
aria-label="Button"

            fill="ghost"
          >
            <sl-icon name="far-copy"></sl-icon>
          </sl-button>
        </CodeConnectSnippet>
        <CodeConnectSnippet data-node-id="2422:87227" data-name="sl-button-rectangular" data-snippet-language="SL Design System">
          <sl-button
            aria-label="Button"

            fill="ghost"
          >
            <sl-icon name="far-share"></sl-icon>
          </sl-button>
        </CodeConnectSnippet>
      </div>
    </div>

);
}SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.

1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
   DO NOT install any Tailwind as a dependency unless the user instructs you to do so.
   Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.These styles are contained in the design: Body/lg/regular: Font(family: "text-new/typeset/fontFamily/body", style: Regular, size: size/text-new/body/lg, weight: text-new/typeset/fontWeight/regular, lineHeight: size/lineHeight/300, letterSpacing: 0), Body/md/bold: Font(family: "text-new/typeset/fontFamily/body", style: Medium, size: size/text-new/body/md, weight: text-new/typeset/fontWeight/semiBold, lineHeight: size/lineHeight/250, letterSpacing: 0).If the node is connected to a code component in the users codebase via Code Connect, the connected component will be included in the final markup wrapped in a CodeConnectSnippet element, with relevant imports at the top of the file. There are two formats: 1. Single snippet: <CodeConnectSnippet data-snippet-language="React"><TitleComponent>Hello World</TitleComponent></CodeConnectSnippet> 2. Multiple options: <CodeConnectSnippet data-snippet-language="React" options={[<Button variant="primary" />, <Button variant="secondary" />]} /> IMPORTANT: the CodeConnectSnippet wrapper element should not be part of the final code. For the options format, choose the single most appropriate option to use in your implementation. The source of the code component will be in the import path, e.g. import {ComponentName } from 'path/to/component'; IMPORTANT: the import path may not be relative/may point to a URL, so you should search for the component in the codebase and MUST use it if possible.Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## sl-button-rectangular

**Node ID:** 2045:9049

A button initiates an action when clicked, like redirecting to a new page or submitting a form. It's a key element for interaction and action.

INVERTED BUTTONS are only to be used with `elevation.surface.raised.inverted` and `elevation.surface.raised.primary`.

**Documentation:**

- [https://sanomalearning.design/categories/components/button/usage/](https://sanomalearning.design/categories/components/button/usage/)

## Icon only=true, ↕️ - Size=MD

**Node ID:** 2034:5922

Use for borders that highlight secondary actions.Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
