# get_design_context raw response — node 71:13345 (fileKey Mzc8BuOvMxOJGAQtv0h64M)

NOTE: The full tool response exceeded the 25000-token truncation limit because it embedded
a large, unrelated WGSL shader-runtime code blob (a "ShaderEffect"/"CodeComponentId_..."
custom effect used to render a dither/pixelate visual effect on some layer's drop-shadow
style). That shader code is not relevant to component/token mapping for this screen and has
been omitted below; everything else from the response (generated reference code, component
descriptions, styles note, and the image note) is preserved verbatim.

## Generated reference code (React + Tailwind, must be adapted to target project)

```
const assetPathPrefix = "https://www.figma.com/api/mcp/asset/c18ee164-3688-4995-9b03-502e25b05789";
import { ShaderEffect } from './lib/custom-effect-runtime/index';
import { setup as setupCodeComponentId_071aec2b9818c2bb3f1b3a37d55d6401ecd6f810_e5c29ccd6b1680a9af75402a594dac6ccbf8056b, render as renderCodeComponentId_071aec2b9818c2bb3f1b3a37d55d6401ecd6f810_e5c29ccd6b1680a9af75402a594dac6ccbf8056b, manifest as manifestCodeComponentId_071aec2b9818c2bb3f1b3a37d55d6401ecd6f810_e5c29ccd6b1680a9af75402a594dac6ccbf8056b } from './lib/custom-effects/CodeComponentId_071aec2b9818c2bb3f1b3a37d55d6401ecd6f810_e5c29ccd6b1680a9af75402a594dac6ccbf8056b';
const imgPexelsMaryTaylor58965211 = `${assetPathPrefix}/98e00.png`;
const imgLogoWordmark = `${assetPathPrefix}/37df9.svg`;


  type ImageLoginProps = {
className?: string;
name?: "img 1"
}

function ImageLogin({className, name = "img 1"}: ImageLoginProps) {
    return (<div className={className || "h-[924px] relative w-[745px]"} data-node-id="176:38379"><div className="absolute inset-0 rounded-[24px]" data-node-id="176:38388" data-name="pexels-mary-taylor-5896521 1"><div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[24px]"><img alt="" className="absolute h-[117.85%] left-[-161.71%] max-w-none top-[-4.22%] w-[261.68%]" src={imgPexelsMaryTaylor58965211} /></div></div></div>);
}





function LogoWordmark({className}: {className?: string}) {
    return (<div className={className || "h-[19.454px] relative w-[106.998px]"} data-node-id="56:25434" data-name="logo-wordmark"><img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLogoWordmark} /></div>);
}





export default function Login1() {
    return (<div className="bg-[var(--background\/canvas,#fbfaf7)] overflow-clip relative rounded-[var(--size\/icon\/font\/xs,12px)] shadow-[0px_125px_35px_0px_rgba(62,85,152,0),0px_80px_32px_0px_rgba(62,85,152,0.01),0px_45px_27px_0px_rgba(62,85,152,0.03),0px_20px_20px_0px_rgba(62,85,152,0.04),0px_5px_11px_0px_rgba(62,85,152,0.05)] size-full" data-node-id="71:13345" data-name="Login 1"><LogoWordmark className="absolute h-[19.454px] left-[40px] top-[41px] w-[106.998px]" /><ImageLogin className="absolute h-[924px] left-[732px] top-[29px] w-[745px]" /><div className="-translate-y-1/2 absolute content-stretch flex flex-col gap-[80px] h-[504px] items-center left-[147px] top-[calc(50%-8px)] w-[461px]" data-node-id="71:13433"><div className="[word-break:break-word] content-stretch flex flex-col font-['New_Message:SemiBold'] gap-[40px] items-center not-italic relative shrink-0 text-[color:var(--color\/palette\/purple\/900,#29076e)] text-center" data-node-id="71:13434"><p className="leading-[var(--size\/lineheight\/600,48px)] relative shrink-0 text-[length:var(--size\/text-new\/heading\/2xl,48px)] w-[464px]" data-node-id="71:13435">Welcome to AI Teacher Assistant</p><p className="leading-[var(--size\/lineheight\/250,20px)] relative shrink-0 text-[length:var(--size\/text-new\/heading\/md,16px)] w-[463px]" data-node-id="71:13436">Let´s get you to the right place.<br aria-hidden />Select your country level to continue</p></div><div className="content-stretch flex flex-col items-center relative shrink-0 w-[375px]" data-node-id="71:13437" data-name="content inputs"><div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="71:13438"><div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="71:13439"><div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="71:13440"><CodeConnectSnippet data-node-id="71:13441" data-name="sl-select (simple-prototype)" data-snippet-language="SL Design System">
    <sl-form-field label="Select location">
      <sl-select


         placeholder="Placeholder"

         value="Belgium"
      >
        <!-- Insert options here -->
      </sl-select>
    </sl-form-field>
  </CodeConnectSnippet><CodeConnectSnippet data-node-id="71:13442" data-name="sl-button-pill" data-snippet-language="SL Design System">
    <sl-button



      shape="pill"


      variant="primary"
    >

      Sign in

    </sl-button>
  </CodeConnectSnippet></div></div></div></div></div><div className="absolute content-stretch flex flex-col h-[41px] items-center justify-center left-0 p-[10px] top-[906px] w-[732px]" data-node-id="72:10150" data-name="footer"><div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0 w-full" data-node-id="I72:10150;173:3540"><CodeConnectSnippet data-node-id="I72:10150;173:3541" data-name="sl-button-pill" data-snippet-language="SL Design System">
    <sl-button


      fill="link"
      shape="pill"
      size="sm"

      variant="primary"
    >

      Privacy Notice

    </sl-button>
  </CodeConnectSnippet><CodeConnectSnippet data-node-id="I72:10150;173:3542" data-name="sl-button-pill" data-snippet-language="SL Design System">
    <sl-button


      fill="link"
      shape="pill"
      size="sm"

      variant="primary"
    >

      Terms and conditions

    </sl-button>
  </CodeConnectSnippet><CodeConnectSnippet data-node-id="I72:10150;173:3543" data-name="sl-button-pill" data-snippet-language="SL Design System">
    <sl-button


      fill="link"
      shape="pill"
      size="sm"

      variant="primary"
    >

      Other link

    </sl-button>
  </CodeConnectSnippet><CodeConnectSnippet data-node-id="I72:10150;216:81142" data-name="sl-button-pill" data-snippet-language="SL Design System">
    <sl-button


      fill="link"
      shape="pill"
      size="sm"

      variant="primary"
    >

      AI Transparency Statement

    </sl-button>
  </CodeConnectSnippet></div></div></div>);
}
```

## Tool notes (verbatim)

- "SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system. ... DO NOT install any Tailwind as a dependency unless the user instructs you to do so."
- "Node ids have been added to the code as data attributes, e.g. `data-node-id=\"1:2\"`."
- Styles: "Large: Effect(type: DROP_SHADOW, color: #3E55980D, offset: (0, 5), radius: 11, spread: 0); Effect(type: DROP_SHADOW, color: #3E55980A, offset: (0, 20), radius: 20, spread: 0); Effect(type: DROP_SHADOW, color: #3E559808, offset: (0, 45), radius: 27, spread: 0); Effect(type: DROP_SHADOW, color: #3E559803, offset: (0, 80), radius: 32, spread: 0); Effect(type: DROP_SHADOW, color: #3E559800, offset: (0, 125), radius: 35, spread: 0)."
- "If the node is connected to a code component in the users codebase via Code Connect, the connected component will be included in the final markup wrapped in a CodeConnectSnippet element... IMPORTANT: the CodeConnectSnippet wrapper element should not be part of the final code."

## Component descriptions (verbatim)

### sl-select (simple-prototype)

**Node ID:** 1422:260651

A select component allows users to choose from a predefined list of options. You can click or tap on it, and it reveals a list of options and you can select the option that aligns with your preference.

**Documentation:**

- https://sanomalearning.design/categories/components/select/usage/

### sl-icon

**Node ID:** 37:52328

Icons communicate messages, enhance interactivity, and highlight critical information. Use them as visual representations of concepts, objects, or actions efficiently.

**Documentation:**

- https://sanomalearning.design/categories/components/icon/usage/

### Variant=Default, State=Idle

**Node ID:** 123:20912

Use for borders of form UI elements, such as text fields, checkboxes and, radio buttons.

### sl-button-pill

**Node ID:** 397:42251

A button initiates an action when clicked, like redirecting to a new page or submitting a form. It's a key element for interaction and action.

INVERTED BUTTONS are only to be used with `elevation.surface.raised.inverted` and `elevation.surface.raised.primary`.

**Documentation:**

- https://sanomalearning.design/categories/components/button/usage/

### Icon only=false, ↕️ - Size=MD

**Node ID:** 123:17069

Use for borders that highlight secondary actions.

### Icon only=false, ↕️ - Size=SM

**Node ID:** 32:118323

Use for borders that highlight secondary actions.

## Image asset note (verbatim)

"Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. These constants will be used in the code as the source for the image, ex: `<img src={image} />`. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire."

## Shader/effect note (verbatim, code omitted — see truncation note above)

"IMPORTANT: This design involves shader fills and/or effects. The <ShaderEffect> and <ShaderFill> components require the Figma shader runtime library. You MUST read the shader-runtime-index MCP resource and then copy the shader runtime files using the MCP shader-runtime-file resource template. You MUST use the shader runtime verbatim. Do NOT try to approximate using CSS or other techniques. You MUST also copy each of the following shader source files. You MUST ensure that all imports resolve correctly. If any <ShaderEffect> elements are used, you MUST warn the user that they need to enable the upcoming HTML-in-Canvas API for shaders to be rendered. You MUST also warn the user that shaders require WebGPU support."

[The full WGSL "Pixelate B&W Dither" shader source (manifest name "Pixelate B&W Dither", used presumably for a decorative dither/pixelate effect somewhere in the frame's raster styling) was returned here but omitted from this cache for size — it is not relevant to component/token mapping. Re-fetch `get_design_context` on this node if the shader runtime code itself is needed downstream.]
