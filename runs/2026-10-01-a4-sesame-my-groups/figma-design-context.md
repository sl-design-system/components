# Raw `get_design_context` responses — a4-sesame-my-groups

Server: `figma` (remote). fileKey `UBr399hnydpNF9P5Jb2vfx`. Root node `2847:14994` ("My Groups").

The root node is 1280 × 1796 px / 822 nodes, so no single root-level `get_design_context`
call was made. Context was fetched for **11 targeted sub-nodes** covering every distinct
region and every distinct repeating cell type. Each section below is the verbatim tool
response for one node.

Every response carried the same three trailer notes, recorded once here rather than
repeated 11 times:

> SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target
> project's technology stack and styling system. 1. Analyze the target codebase to
> identify: technology stack, styling approach, component patterns, and design tokens 2. Convert React syntax to the target framework/library 3. Transform all Tailwind
> classes to the target styling system while preserving exact visual design 4. Follow the
> project's existing patterns and conventions. DO NOT install any Tailwind as a dependency
> unless the user instructs you to do so.

> Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.

> Images and SVGs will be stored as constants, e.g. const image =
> `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top
> of the code and every asset URL interpolates it. These constants will be used in the code
> as the source for the image, ex: `<img src={image} />`. Image assets are stored on a remote
> server for 7 days and can be fetched using the provided URLs until they expire.

Node-specific "These styles are contained in the design" and "Component descriptions"
blocks ARE reproduced per section, because they differ per node.

Nodes fetched, in call order:

| #   | Node ID      | Region                                                    |
| --- | ------------ | --------------------------------------------------------- |
| 1   | `2847:14995` | Page title row + page-level action buttons                |
| 2   | `2847:15395` | Filter / search card                                      |
| 3   | `2847:15379` | Bulk-selection action bar                                 |
| 4   | `2847:15003` | App header (top nav bar + secondary school bar)           |
| 5   | `2847:15426` | Footer                                                    |
| 6   | `2847:15358` | Row overflow menu ("group-card-dropdown")                 |
| 7   | `2847:15083` | Table header cell, Name column (with select-all checkbox) |
| 8   | `2847:15089` | Table body cell, Name column, selected row                |
| 9   | `2847:15245` | Table body cell, Action column (overflow icon button)     |
| 10  | `2847:15427` | "40 Groups" result count                                  |
| 11  | `2847:15709` | `sl-helper-theme` inline error message                    |
| 12  | `2847:15077` | "ALL SCHOOL GROUPS" section heading                       |
| 13  | `2847:15152` | Table body cell, Type column (plain text td instance)     |
| 14  | `2847:15242` | Table header cell, Action column                          |

(14 calls total; the table above supersedes the "11" count in the intro.)

---

## 1. `2847:14995` — Page title row + action buttons

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/f50f828a-8cc8-446b-982f-e41802e48448';
const imgIconsPlus = `${assetPathPrefix}/d9725.svg`;

export default function Frame1000000745() {
  return (
    <div
      className="content-stretch flex items-center justify-between relative size-full"
      data-node-id="2847:14995">
      <p
        className="[word-break:break-word] font-['Open_Sans:Bold'] font-bold leading-[40px] relative shrink-0 text-[#323232] text-[28px] tracking-[-0.56px] w-[352px]"
        data-node-id="2847:14996"
        style={{ fontVariationSettings: '"wdth" 100' }}>
        Groups
      </p>
      <div
        className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0 w-[459px]"
        data-node-id="2847:14997">
        <div
          className="content-stretch flex flex-col items-start relative shrink-0"
          data-node-id="2847:14998"
          data-name="sl-button">
          <div
            className="content-stretch flex flex-col items-start relative shrink-0"
            data-node-id="I2847:14998;2798:30776"
            data-name="sl-button-theme">
            <div
              className="bg-[rgba(0,0,0,0)] border-2 border-[#af1685] border-solid content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[8px] relative rounded-[800px] shrink-0"
              data-node-id="I2847:14998;2798:30776;2798:29666"
              data-name="button">
              <div
                className="relative shrink-0 size-[16px]"
                data-node-id="I2847:14998;2798:30776;2798:29666;915:4542"
                data-name="icon-core-start">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                  <div
                    className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]"
                    data-node-id="I2847:14998;2798:30776;2798:29666;915:4543"
                    data-name="icon-core-start">
                    <div
                      className="flex-[1_0_0] h-full min-w-px relative"
                      data-node-id="I2847:14998;2798:30776;2798:29666;915:4543;404:33"
                      data-name="icon-container">
                      <div
                        className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#af1685] text-[16px] text-center"
                        data-node-id="I2847:14998;2798:30776;2798:29666;915:4543;404:33;802:2162">
                        <p className="leading-[14px]">archive</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#af1685] text-[14px] text-center whitespace-nowrap"
                data-node-id="I2847:14998;2798:30776;2798:29666;915:4544"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[24px]">Archive a school year</p>
              </div>
              <div
                className="absolute inset-[-2px]"
                data-node-id="I2847:14998;2798:30776;2798:29666;2123:30628"
                data-name="Focus ring">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
              </div>
            </div>
          </div>
        </div>
        <div
          className="content-stretch flex flex-col items-start relative shrink-0"
          data-node-id="2847:14999"
          data-name="sl-button">
          <div
            className="content-stretch flex flex-col items-start relative shrink-0"
            data-node-id="I2847:14999;2798:30776"
            data-name="sl-button-theme">
            <div
              className="bg-[rgba(0,0,0,0)] border-2 border-[#af1685] border-solid content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[8px] relative rounded-[800px] shrink-0"
              data-node-id="I2847:14999;2798:30776;2798:29666"
              data-name="button">
              <div
                className="relative shrink-0 size-[16px]"
                data-node-id="I2847:14999;2798:30776;2798:29666;915:4542"
                data-name="icon-core-start">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                  <div
                    className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]"
                    data-node-id="I2847:14999;2798:30776;2798:29666;915:4543"
                    data-name="icon-core-start">
                    <div
                      className="flex-[1_0_0] h-full min-w-px relative"
                      data-node-id="I2847:14999;2798:30776;2798:29666;915:4543;404:33"
                      data-name="icon-container">
                      <div
                        className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#af1685] text-[16px] text-center"
                        data-node-id="I2847:14999;2798:30776;2798:29666;915:4543;404:33;802:2162">
                        <p className="leading-[14px]">download</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#af1685] text-[14px] text-center whitespace-nowrap"
                data-node-id="I2847:14999;2798:30776;2798:29666;915:4544"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[24px]">Download groups</p>
              </div>
              <div
                className="absolute inset-[-2px]"
                data-node-id="I2847:14999;2798:30776;2798:29666;2123:30628"
                data-name="Focus ring">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
              </div>
            </div>
          </div>
        </div>
        <div
          className="content-stretch flex flex-col items-start relative shrink-0"
          data-node-id="2847:15000"
          data-name="sl-button">
          <div
            className="content-stretch flex flex-col items-start relative shrink-0"
            data-node-id="I2847:15000;2798:30776"
            data-name="sl-button-theme">
            <div
              className="bg-[rgba(0,0,0,0)] border-2 border-[#af1685] border-solid content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[8px] relative rounded-[800px] shrink-0"
              data-node-id="I2847:15000;2798:30776;2798:29666"
              data-name="button">
              <div
                className="relative shrink-0 size-[16px]"
                data-node-id="I2847:15000;2798:30776;2798:29666;915:4542"
                data-name="icon-core-start">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                  <div
                    className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]"
                    data-node-id="I2847:15000;2798:30776;2798:29666;915:4543"
                    data-name="icon-core-start">
                    <div
                      className="flex-[1_0_0] h-full min-w-px relative"
                      data-node-id="I2847:15000;2798:30776;2798:29666;915:4543;404:33"
                      data-name="icon-container">
                      <div
                        className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#af1685] text-[16px] text-center"
                        data-node-id="I2847:15000;2798:30776;2798:29666;915:4543;404:33;802:2162">
                        <p className="leading-[14px]">upload</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#af1685] text-[14px] text-center whitespace-nowrap"
                data-node-id="I2847:15000;2798:30776;2798:29666;915:4544"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[24px]">Upload groups</p>
              </div>
              <div
                className="absolute inset-[-2px]"
                data-node-id="I2847:15000;2798:30776;2798:29666;2123:30628"
                data-name="Focus ring">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
              </div>
            </div>
          </div>
        </div>
        <div
          className="content-stretch flex items-center justify-end relative shrink-0"
          data-node-id="2847:15001">
          <div
            className="bg-[#af1685] content-stretch flex gap-[10px] items-center justify-center overflow-clip pl-[16px] pr-[24px] py-[8px] relative rounded-[24px] shrink-0"
            data-node-id="2847:15002"
            data-name="Button">
            <div
              className="relative shrink-0 size-[24px]"
              data-node-id="I2847:15002;3:1423"
              data-name="Icons/plus">
              <img
                alt=""
                className="absolute block inset-0 max-w-none size-full"
                src={imgIconsPlus}
              />
            </div>
            <p
              className="[word-break:break-word] font-['Open_Sans:Bold'] font-bold leading-[24px] relative shrink-0 text-[14px] text-white tracking-[0.42px] whitespace-nowrap"
              data-node-id="I2847:15002;3:1424"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              Add group
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

> These styles are contained in the design: button/primary/outline/idle/foreground: #AF1685,
> button/primary/outline/idle/background: #000000, button/primary/outline/idle/border: #AF1685.

> Component descriptions:
>
> ## sl-button — **Node ID:** 2:48280
>
> A button initiates an action when clicked, like redirecting to a new page or submitting a
> form. It's a key element for interaction and action.
> Documentation: https://sanomalearning.design/categories/components/button/

---

## 2. `2847:15395` — Filter / search card

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/70c6421b-1acb-4e4c-896f-7af0cac9a9f7';
const imgBtnIcons = `${assetPathPrefix}/22f82.svg`;

export default function Frame27162() {
  return (
    <div
      className="bg-white content-stretch drop-shadow-[0px_2px_2px_rgba(0,0,0,0.25)] flex flex-col gap-[24px] items-start p-[24px] relative rounded-[4px] size-full"
      data-node-id="2847:15395">
      <div
        className="content-stretch flex items-center relative shrink-0 w-full"
        data-node-id="2847:15396">
        <div
          className="content-stretch flex flex-col items-start relative shrink-0 w-[629px]"
          data-node-id="2847:15397"
          data-name="sl-searchfield">
          <div
            className="content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex flex-col isolate items-start relative rounded-[2px] shrink-0 w-full"
            data-node-id="I2847:15397;6128:2229"
            data-name="sl-searchfield-theme">
            <div
              className="bg-white border border-[#9d9f9f] border-solid content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex gap-[8px] isolate items-center justify-center px-[16px] py-[8px] relative rounded-[4px] shrink-0 w-full z-[1]"
              data-node-id="I2847:15397;6128:2229;6128:2182"
              data-name="sl_base-search_field">
              <div
                className="relative shrink-0 size-[20px] z-[5]"
                data-node-id="I2847:15397;6128:2229;6128:2182;6670:1939"
                data-name="core-icon-start">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                  <div
                    className="flex-[1_0_0] h-full min-w-px relative"
                    data-node-id="I2847:15397;6128:2229;6128:2182;6670:1939;399:65"
                    data-name="search">
                    <div
                      className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#8d8d8d] text-[16px] text-center"
                      data-node-id="I2847:15397;6128:2229;6128:2182;6670:1939;399:65;5555:15890">
                      <p className="leading-[16px]">search</p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] min-w-px relative text-[#323232] text-[16px] z-[4]"
                data-node-id="I2847:15397;6128:2229;6128:2182;6670:1937"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[24px]">Input Value</p>
              </div>
              <button
                className="-translate-y-1/2 absolute bg-[rgba(0,0,0,0)] cursor-pointer right-[3px] size-[32px] top-1/2 z-[1]"
                data-node-id="I2847:15397;6128:2229;6128:2182;6676:5614"
                data-name="field-button">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                  <div
                    className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]"
                    data-node-id="I2847:15397;6128:2229;6128:2182;6676:5614;6676:5575"
                    data-name="core-icon">
                    <div
                      className="flex-[1_0_0] h-full min-w-px relative"
                      data-node-id="I2847:15397;6128:2229;6128:2182;6676:5614;6676:5575;399:65"
                      data-name="xmark">
                      <div
                        className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#323232] text-[16px] text-center"
                        data-node-id="I2847:15397;6128:2229;6128:2182;6676:5614;6676:5575;399:65;1765:11246">
                        <p className="leading-[16px]">xmark</p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="content-stretch flex h-[68px] items-end justify-between relative shrink-0 w-full"
        data-node-id="2847:15398">
        <div
          className="content-end flex flex-wrap gap-[16px] items-end relative shrink-0 w-[632px]"
          data-node-id="2847:15399">
          <div
            className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[200px]"
            data-node-id="2847:15400"
            data-name="Dropdown">
            <p
              className="[word-break:break-word] font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] w-[200px]"
              data-node-id="2847:15401"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              Group status
            </p>
            <div
              className="bg-white border border-[#bfbfbf] border-solid content-stretch flex h-[40px] items-center justify-between p-[16px] relative rounded-[6px] shrink-0 w-[200px]"
              data-node-id="2847:15402"
              data-name="dropdown">
              <p
                className="[word-break:break-word] font-['Open_Sans:Regular'] font-normal leading-[24px] relative shrink-0 text-[#323232] text-[16px] whitespace-nowrap"
                data-node-id="2847:15403"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                Active
              </p>
              <div
                className="relative shrink-0 size-[12px]"
                data-node-id="2847:15404"
                data-name="btn icons">
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={imgBtnIcons}
                />
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[200px]"
            data-node-id="2847:15406"
            data-name="Dropdown">
            <p
              className="[word-break:break-word] font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] w-[200px]"
              data-node-id="2847:15407"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              Group type
            </p>
            <div
              className="bg-white border border-[#bfbfbf] border-solid content-stretch flex h-[40px] items-center justify-between p-[16px] relative rounded-[6px] shrink-0 w-[200px]"
              data-node-id="2847:15408"
              data-name="dropdown">
              <p
                className="[word-break:break-word] font-['Open_Sans:Regular'] font-normal leading-[24px] relative shrink-0 text-[#323232] text-[16px] whitespace-nowrap"
                data-node-id="2847:15409"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                Any
              </p>
              <div
                className="relative shrink-0 size-[12px]"
                data-node-id="2847:15410"
                data-name="btn icons">
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={imgBtnIcons}
                />
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[200px]"
            data-node-id="2847:15412"
            data-name="Dropdown">
            <p
              className="[word-break:break-word] font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] w-[200px]"
              data-node-id="2847:15413"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              School year
            </p>
            <div
              className="bg-white border border-[#bfbfbf] border-solid content-stretch flex h-[40px] items-center justify-between p-[16px] relative rounded-[6px] shrink-0 w-[200px]"
              data-node-id="2847:15414"
              data-name="dropdown">
              <p
                className="[word-break:break-word] font-['Open_Sans:Regular'] font-normal leading-[24px] relative shrink-0 text-[#323232] text-[16px] whitespace-nowrap"
                data-node-id="2847:15415"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                Any
              </p>
              <div
                className="relative shrink-0 size-[12px]"
                data-node-id="2847:15416"
                data-name="btn icons">
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={imgBtnIcons}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="content-stretch flex gap-[24px] items-center justify-end relative shrink-0"
          data-node-id="2847:15418">
          <div
            className="content-stretch flex gap-[8px] items-center relative shrink-0"
            data-node-id="2847:15419">
            <p
              className="[word-break:break-word] font-['Font_Awesome_6_Pro:Regular'] leading-[24px] not-italic relative shrink-0 text-[#af1685] text-[14px] whitespace-nowrap"
              data-node-id="2847:15420">
              xmark
            </p>
            <div
              className="content-stretch flex items-center relative shrink-0 w-[78px]"
              data-node-id="2847:15421">
              <p
                className="[word-break:break-word] font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#af1685] text-[14px] whitespace-nowrap"
                data-node-id="2847:15422"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                Clear filters
              </p>
            </div>
          </div>
          <div
            className="[word-break:break-word] bg-[#af1685] content-center flex flex-wrap gap-[8px] items-center px-[24px] py-[8px] relative rounded-[24px] shrink-0 text-white whitespace-nowrap"
            data-node-id="2847:15423"
            data-name="button primary">
            <p
              className="font-['Font_Awesome_6_Pro:Regular'] leading-[normal] not-italic relative shrink-0 text-[16px]"
              data-node-id="2847:15424">
              magnifying-glass
            </p>
            <p
              className="font-['Open_Sans:Bold'] font-bold leading-[24px] relative shrink-0 text-[14px]"
              data-node-id="2847:15425"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              Search
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

> These styles are contained in the design: input/textField/default/default/icon: #8D8D8D,
> input/textField/default/default/inputText: #323232, input/textField/text/lg: Font(family:
> "Open Sans", style: Regular, size: 16, weight: 400, lineHeight: 24, letterSpacing: 0),
> input/textField/default/default/background: #FFFFFF, input/textField/default/default/border:
> #9D9F9F, none: Effect(type: DROP_SHADOW, color: #00000000, offset: (0, 0), radius: 0,
> spread: 0), text button: Font(family: "Open Sans", style: Bold, size: 14, weight: 700,
> lineHeight: 24, letterSpacing: 0).

> Component descriptions:
>
> ## sl-searchfield — **Node ID:** 2:70500
>
> A search field is used for searching and filtering items.
> Documentation: https://sanomalearning.design/categories/components/search-field/usage/
>
> ## sl-searchfield-theme — **Node ID:** 2:70502
>
> ✏️ Only edit the properties below The colors of this component are fixed and you wouldn't
> have to edit them. You can adjust the width of the field to fit your design.
>
> ## sl_base-search_field-lg — **Node ID:** 2:70650
>
> 🚫 Do not edit this component. This component is used to build the text input component and
> not intended for independent use. ↖️ Instead, edit the top-level component.

---

## 3. `2847:15379` — Bulk-selection action bar

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/03a4cac7-36c7-4cd8-8f24-ab710551c376';
const imgXmark = `${assetPathPrefix}/1b071.svg`;

export default function BulkPanel() {
  return (
    <div
      className="bg-[#af1685] content-stretch flex items-center overflow-clip pl-[16px] pr-[8px] py-[16px] relative rounded-[24px] size-full"
      data-node-id="2847:15379"
      data-name="bulk panel">
      <div
        className="content-stretch flex gap-[16px] items-center relative shrink-0"
        data-node-id="2847:15380">
        <div className="relative shrink-0 size-[20px]" data-node-id="2847:15381" data-name="xmark">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgXmark} />
        </div>
        <div
          className="content-stretch flex gap-[24px] items-center relative shrink-0"
          data-node-id="2847:15382"
          data-name="panel">
          <div
            className="[word-break:break-word] content-stretch flex gap-[var(--size\/10,2px)] items-center leading-[1.5] relative shrink-0 text-[length:var(--size\/200,14px)] text-white whitespace-nowrap"
            data-node-id="2847:15383"
            data-name="items selected">
            <p
              className="font-[family-name:var(--default-font,'Lato:Bold')] not-italic relative shrink-0"
              data-node-id="2847:15384">
              3
            </p>
            <p
              className="font-['Open_Sans:Regular'] font-normal relative shrink-0"
              data-node-id="2847:15385"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              selected out of 40
            </p>
          </div>
          <div
            className="border-[#e1e1e1] border-l border-solid content-stretch flex gap-[16px] items-center pl-[10px] relative shrink-0"
            data-node-id="2847:15386"
            data-name="buttons">
            <div
              className="content-stretch flex items-center relative shrink-0"
              data-node-id="2847:15388">
              <div
                className="content-stretch flex flex-col items-start relative shrink-0"
                data-node-id="2847:15389"
                data-name="sl-button">
                <div
                  className="content-stretch flex flex-col items-start relative shrink-0"
                  data-node-id="I2847:15389;2798:30776"
                  data-name="sl-button-theme">
                  <div
                    className="bg-[rgba(0,0,0,0)] border-2 border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[4px] relative rounded-[800px] shrink-0"
                    data-node-id="I2847:15389;2798:30776;2798:29038"
                    data-name="button">
                    <div
                      className="relative shrink-0 size-[12px]"
                      data-node-id="I2847:15389;2798:30776;2798:29038;915:4406"
                      data-name="icon-core-start">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                        <div
                          className="content-stretch flex items-center justify-center relative shrink-0 size-[12px]"
                          data-node-id="I2847:15389;2798:30776;2798:29038;915:4407"
                          data-name="icon-core-start">
                          <div
                            className="flex-[1_0_0] h-full min-w-px relative"
                            data-node-id="I2847:15389;2798:30776;2798:29038;915:4407;404:33"
                            data-name="icon-container">
                            <div
                              className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[12px] text-center text-white"
                              data-node-id="I2847:15389;2798:30776;2798:29038;915:4407;404:33;802:2162">
                              <p className="leading-[14px]">trash</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap"
                      data-node-id="I2847:15389;2798:30776;2798:29038;915:4408"
                      style={{ fontVariationSettings: '"wdth" 100' }}>
                      <p className="leading-[16px]">Delete</p>
                    </div>
                    <div
                      className="absolute inset-[-2px]"
                      data-node-id="I2847:15389;2798:30776;2798:29038;2123:33965"
                      data-name="Focus ring">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="content-stretch flex flex-col items-start relative shrink-0"
                data-node-id="2847:15390"
                data-name="sl-button">
                <div
                  className="content-stretch flex flex-col items-start relative shrink-0"
                  data-node-id="I2847:15390;2798:30776"
                  data-name="sl-button-theme">
                  <div
                    className="bg-[rgba(0,0,0,0)] border-2 border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[4px] relative rounded-[800px] shrink-0"
                    data-node-id="I2847:15390;2798:30776;2798:29158"
                    data-name="button">
                    <div
                      className="relative shrink-0 size-[12px]"
                      data-node-id="I2847:15390;2798:30776;2798:29158;915:4406"
                      data-name="icon-core-start">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                        <div
                          className="content-stretch flex items-center justify-center relative shrink-0 size-[12px]"
                          data-node-id="I2847:15390;2798:30776;2798:29158;915:4407"
                          data-name="icon-core-start">
                          <div
                            className="flex-[1_0_0] h-full min-w-px relative"
                            data-node-id="I2847:15390;2798:30776;2798:29158;915:4407;404:33"
                            data-name="icon-container">
                            <div
                              className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#bfbfbf] text-[12px] text-center"
                              data-node-id="I2847:15390;2798:30776;2798:29158;915:4407;404:33;802:2162">
                              <p className="leading-[14px]">boxes-packing</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#bfbfbf] text-[14px] text-center whitespace-nowrap"
                      data-node-id="I2847:15390;2798:30776;2798:29158;915:4408"
                      style={{ fontVariationSettings: '"wdth" 100' }}>
                      <p className="leading-[16px]">Reactivate</p>
                    </div>
                    <div
                      className="absolute inset-[-2px]"
                      data-node-id="I2847:15390;2798:30776;2798:29158;2123:33965"
                      data-name="Focus ring">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="content-stretch flex flex-col items-start relative shrink-0"
                data-node-id="2847:15391"
                data-name="sl-button">
                <div
                  className="content-stretch flex flex-col items-start relative shrink-0"
                  data-node-id="I2847:15391;2798:30776"
                  data-name="sl-button-theme">
                  <div
                    className="bg-[rgba(0,0,0,0)] border-2 border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[4px] relative rounded-[800px] shrink-0"
                    data-node-id="I2847:15391;2798:30776;2798:29038"
                    data-name="button">
                    <div
                      className="relative shrink-0 size-[12px]"
                      data-node-id="I2847:15391;2798:30776;2798:29038;915:4406"
                      data-name="icon-core-start">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                        <div
                          className="content-stretch flex items-center justify-center relative shrink-0 size-[12px]"
                          data-node-id="I2847:15391;2798:30776;2798:29038;915:4407"
                          data-name="icon-core-start">
                          <div
                            className="flex-[1_0_0] h-full min-w-px relative"
                            data-node-id="I2847:15391;2798:30776;2798:29038;915:4407;404:33"
                            data-name="icon-container">
                            <div
                              className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[12px] text-center text-white"
                              data-node-id="I2847:15391;2798:30776;2798:29038;915:4407;404:33;802:2162">
                              <p className="leading-[14px]">box-archive</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap"
                      data-node-id="I2847:15391;2798:30776;2798:29038;915:4408"
                      style={{ fontVariationSettings: '"wdth" 100' }}>
                      <p className="leading-[16px]">Archive</p>
                    </div>
                    <div
                      className="absolute inset-[-2px]"
                      data-node-id="I2847:15391;2798:30776;2798:29038;2123:33965"
                      data-name="Focus ring">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

> These styles are contained in the design: Display small: Font(family: "default-font",
> style: Bold, size: Size/200, weight: 700, lineHeight: 1.5, letterSpacing: 0),
> button/text/sm: Font(family: "Open Sans", style: Bold, size: 14, weight: 700, lineHeight:
> 16, letterSpacing: 0), button/primary/ghost/idle/background: #000000,
> button/primary/ghost/idle/border: #000000, button/primary/ghost/disabled/background:
> #000000, button/primary/ghost/disabled/border: #000000.

> Component descriptions:
>
> ## xmark — **Node ID:** 7:5952 — close, remove
>
> ## sl-button — **Node ID:** 2:48280 — A button initiates an action when clicked...
>
> Documentation: https://sanomalearning.design/categories/components/button/

---

## 4. `2847:15003` — App header (top nav bar + secondary school bar)

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/7cda6203-d5f7-4c58-baf6-801b93ddce1c';
const imgLogoMyVanIn1 = `${assetPathPrefix}/c6fa2.svg`;
const imgGroup = `${assetPathPrefix}/bcc1f.svg`;
const imgFrame26856 = `${assetPathPrefix}/757aa.svg`;
const imgLine24 = `${assetPathPrefix}/696c9.svg`;
const imgSlAvatarCircle = `${assetPathPrefix}/d6912.svg`;

type MenuItemSuProps = {
  className?: string;
  property1?: 'default';
};

function MenuItemSu({ className, property1 = 'default' }: MenuItemSuProps) {
  return (
    <div
      className={
        className || 'content-stretch flex items-start overflow-clip px-[2px] py-[8px] relative'
      }
      data-node-id="772:26895">
      <div
        className="[word-break:break-word] flex flex-col font-['Open_Sans:SemiBold'] font-semibold justify-end leading-[0] relative shrink-0 text-[#323232] text-[14px] text-center whitespace-nowrap"
        data-node-id="772:26891"
        style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">Learning materials</p>
      </div>
    </div>
  );
}

export default function Frame1000000825() {
  return (
    <div
      className="content-stretch flex flex-col items-center relative size-full"
      data-node-id="2847:15003">
      <div
        className="bg-white h-[56px] overflow-clip relative shrink-0 w-full"
        data-node-id="2847:15005"
        data-name="top navi bar">
        <div
          className="absolute h-[24px] left-[128px] overflow-clip top-[16px] w-[123.467px]"
          data-node-id="2847:15006"
          data-name="MittSanoma 3">
          <div
            className="absolute contents inset-[-8.33%_-16.63%_-8.33%_0]"
            data-node-id="2847:15007"
            data-name="Clip path group">
            <div
              className="absolute inset-[-8.33%_-16.63%_-8.33%_2.43%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_2px] mask-size-[123.467px_24px] overflow-clip"
              data-node-id="2847:15010"
              style={{ maskImage: `url("${imgLogoMyVanIn1}")` }}
              data-name="Logo_MyVanIn 1">
              <div
                className="absolute inset-[21.77%_0.24%_0_24.06%]"
                data-node-id="2847:15011"
                data-name="Group">
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={imgGroup}
                />
              </div>
              <div
                className="absolute bottom-[89.29%] contents left-0 right-full top-[10.71%]"
                data-node-id="2847:15019"
                data-name="Group"
              />
              <div
                className="absolute h-[18.822px] left-0 top-[3px] w-[26.985px]"
                data-node-id="2847:15055">
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={imgFrame26856}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="-translate-x-1/2 absolute content-stretch flex gap-[24px] items-start justify-end left-[calc(50%+0.5px)] py-[10px] top-0"
          data-node-id="2847:15059">
          <MenuItemSu className="content-stretch flex items-start overflow-clip px-[2px] py-[8px] relative shrink-0" />
          <div
            className="content-stretch flex flex-col gap-[2px] items-center px-[2px] py-[8px] relative shrink-0"
            data-node-id="2847:15061"
            data-name="menu item SU">
            <div
              className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-end leading-[0] relative shrink-0 text-[#323232] text-[14px] text-center w-full"
              data-node-id="I2847:15061;772:26885"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[20px]">Groups</p>
            </div>
            <div className="h-0 relative shrink-0 w-full" data-node-id="I2847:15061;772:26886">
              <div className="absolute inset-[-2px_0_0_0]">
                <img alt="" className="block max-w-none size-full" src={imgLine24} />
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex items-start overflow-clip px-[2px] py-[8px] relative shrink-0"
            data-node-id="2847:15062"
            data-name="menu item SU">
            <div
              className="[word-break:break-word] flex flex-col font-['Open_Sans:SemiBold'] font-semibold justify-end leading-[0] relative shrink-0 text-[#323232] text-[14px] text-center whitespace-nowrap"
              data-node-id="I2847:15062;772:26891"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[20px]">Users</p>
            </div>
          </div>
          <div
            className="content-stretch flex items-start overflow-clip px-[2px] py-[8px] relative shrink-0"
            data-node-id="2847:15063"
            data-name="menu item SU">
            <div
              className="[word-break:break-word] flex flex-col font-['Open_Sans:SemiBold'] font-semibold justify-end leading-[0] relative shrink-0 text-[#323232] text-[14px] text-center whitespace-nowrap"
              data-node-id="I2847:15063;772:26891"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[20px]">Licenses</p>
            </div>
          </div>
        </div>
        <div
          className="absolute content-stretch flex h-[56px] items-center justify-end left-[calc(68.75%-5.06px)] top-0 w-[277px]"
          data-node-id="2847:15064">
          <div
            className="content-stretch flex items-start p-[8px] relative rounded-[4px] shrink-0"
            data-node-id="2847:15065"
            data-name="avatar_SU">
            <div
              className="content-stretch flex gap-[8px] isolate items-center relative shrink-0"
              data-node-id="I2847:15065;775:12268"
              data-name="sl-avatar-circle-text">
              <div
                className="[word-break:break-word] content-stretch flex flex-col font-['Open_Sans:Regular'] font-normal items-end leading-[0] relative shrink-0 text-[#323232] whitespace-nowrap z-[3]"
                data-node-id="I2847:15065;775:12269"
                data-name="avatar-header">
                <div
                  className="flex flex-col justify-center relative shrink-0 text-[14px]"
                  data-node-id="I2847:15065;775:12270"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[20px]">Anna Magiera</p>
                </div>
                <div
                  className="flex flex-col justify-center relative shrink-0 text-[12px]"
                  data-node-id="I2847:15065;775:12271"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[12px]">Administrator</p>
                </div>
              </div>
              <div
                className="content-stretch flex isolate items-center relative shrink-0 z-[2]"
                data-node-id="I2847:15065;775:12272"
                data-name="sl-avatar-circle-text">
                <div
                  className="relative shrink-0 size-[32px] z-[1]"
                  data-node-id="I2847:15065;775:12273"
                  data-name="sl-avatar-circle">
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={imgSlAvatarCircle}
                  />
                  <div
                    className="absolute content-stretch flex gap-[8px] h-[12px] isolate items-center justify-center min-w-[12px] px-px py-[2px] right-[-2px] rounded-[999px] top-[-2px]"
                    data-node-id="I2847:15065;775:12281"
                    data-name="icon">
                    <div
                      className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] flex flex-col font-['Font_Awesome_6_Pro:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[#323232] text-[9px] text-center uppercase whitespace-nowrap z-[2]"
                      data-node-id="I2847:15065;775:12282">
                      <p className="leading-[9px]">gear</p>
                    </div>
                    <div
                      className="absolute inset-0 z-[1]"
                      data-node-id="I2847:15065;775:12283"
                      data-name="icon-bg">
                      <div
                        className="absolute bg-white inset-0 rounded-[800px]"
                        data-node-id="I2847:15065;775:12283;2801:8913"
                        data-name="badge-bg"
                      />
                    </div>
                  </div>
                  <div
                    className="-translate-x-1/2 -translate-y-1/2 [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] absolute flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] left-1/2 text-[#323232] text-[12px] text-center top-[calc(50%+0.5px)] uppercase w-[32px]"
                    data-node-id="I2847:15065;775:12284"
                    style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[16px]">AM</p>
                  </div>
                </div>
              </div>
              <div
                className="[word-break:break-word] flex flex-col font-['Font_Awesome_6_Pro:Regular'] justify-end leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap z-[1]"
                data-node-id="I2847:15065;775:12286">
                <p className="leading-[20px]">chevron-up</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-white content-stretch flex items-center justify-end overflow-clip px-[128px] py-[12px] relative shrink-0 w-full"
        data-node-id="2847:15066"
        data-name="secondary bar">
        <div
          className="content-stretch flex items-start relative shrink-0"
          data-node-id="2847:15067">
          <div
            className="content-stretch flex gap-[16px] h-[40px] items-center relative shrink-0"
            data-node-id="2847:15068"
            data-name="School selection">
            <div
              className="content-stretch flex items-center relative shrink-0"
              data-node-id="2847:15069"
              data-name="Dropdown">
              <p
                className="[word-break:break-word] font-['Font_Awesome_6_Pro:Regular'] leading-[24px] not-italic relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                data-node-id="2847:15070">
                school-flag
              </p>
              <div
                className="content-stretch flex gap-[8px] items-start pl-[8px] relative shrink-0"
                data-node-id="2847:15071"
                data-name="School label">
                <p
                  className="[word-break:break-word] font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                  data-node-id="2847:15074"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  Bogaerts International School
                </p>
              </div>
              <div
                className="bg-[rgba(0,0,0,0)] border-2 border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[4px] relative rounded-[800px] shrink-0"
                data-node-id="2847:15075"
                data-name="button">
                <div
                  className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#af1685] text-[14px] text-center whitespace-nowrap"
                  data-node-id="I2847:15075;915:4408"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[16px]">Switch school</p>
                </div>
                <div
                  className="absolute inset-[-2px]"
                  data-node-id="I2847:15075;2123:33965"
                  data-name="Focus ring">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

> Component descriptions:
>
> ## Property 1=Default — **Node ID:** 777:12400
>
> An avatar is a visual representation of an entity, such as a user or an organization.
> **Notes** — A subheader on a small horizontal avatar is not allowed and is turned off by default.
> Documentation: https://sanomalearning.design/categories/components/avatar/

---

## 5. `2847:15426` — Footer

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/e407f82a-ee5f-415b-a230-1274aaa50c25';
const imgLanguageBlack24Dp12 = `${assetPathPrefix}/b98f1.svg`;
const imgIconRight = `${assetPathPrefix}/ef41b.svg`;
const imgImage1 = `${assetPathPrefix}/a908e.png`;

type Component2Props = {
  className?: string;
  property1?: 'Dropdown up';
};

function Component2({ className, property1 = 'Dropdown up' }: Component2Props) {
  return (
    <div
      className={className || 'content-stretch flex items-center relative'}
      data-node-id="2:70426">
      <div
        className="content-stretch flex gap-[8px] items-center pl-[8px] relative shrink-0"
        data-node-id="2:70427"
        data-name="School label">
        <div
          className="relative shrink-0 size-[16px]"
          data-node-id="2:70428"
          data-name="language_black_24dp (1) 2">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={imgLanguageBlack24Dp12}
          />
        </div>
        <p
          className="[word-break:break-word] font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
          data-node-id="2:70431"
          style={{ fontVariationSettings: '"wdth" 100' }}>
          English - EN
        </p>
      </div>
      <div
        className="content-stretch flex gap-[8px] items-center justify-center p-[8px] relative rounded-[4px] shrink-0"
        data-node-id="2:70432"
        data-name="Button">
        <div
          className="relative shrink-0 size-[16px]"
          data-node-id="2:70434"
          data-name="Icon-right">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconRight} />
        </div>
      </div>
    </div>
  );
}

type MenuItemFooterProps = {
  className?: string;
  property1?: 'default';
};

function MenuItemFooter({ className, property1 = 'default' }: MenuItemFooterProps) {
  return (
    <div
      className={className || 'content-stretch flex items-start p-[8px] relative'}
      data-node-id="2:70415">
      <p
        className="[word-break:break-word] capitalize font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
        data-node-id="2:70416"
        style={{ fontVariationSettings: '"wdth" 100' }}>
        Privacy Policy
      </p>
    </div>
  );
}

type FooterProps = {
  className?: string;
  property1?: 'Footer desktop';
};

function Footer({ className, property1 = 'Footer desktop' }: FooterProps) {
  return (
    <div
      className={
        className ||
        'bg-[#f6f8f8] content-stretch flex flex-col items-start overflow-clip px-[128px] py-[24px] relative'
      }
      data-node-id="2:70476">
      <div
        className="content-stretch flex items-start justify-between relative shrink-0 w-[1024px]"
        data-node-id="2:70477">
        <div className="h-[40px] relative shrink-0 w-[198px]" data-node-id="2:70478">
          <div
            className="absolute h-[25px] left-0 top-0 w-[112.868px]"
            data-node-id="2:70479"
            data-name="image 1">
            <img
              alt=""
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
              src={imgImage1}
            />
          </div>
        </div>
        <div
          className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0"
          data-node-id="2:70480">
          <div
            className="content-stretch flex gap-[16px] items-start px-[8px] relative shrink-0"
            data-node-id="2:70481">
            <MenuItemFooter className="content-stretch flex items-start p-[8px] relative shrink-0" />
            <div
              className="content-stretch flex items-start p-[8px] relative shrink-0"
              data-node-id="2:70483"
              data-name="menu item footer">
              <p
                className="[word-break:break-word] capitalize font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                data-node-id="I2:70483;2678:143004"
                style={{ fontVariationSettings: '"wdth" 100' }}>{`Terms & Conditions`}</p>
            </div>
            <div
              className="content-stretch flex items-start p-[8px] relative shrink-0"
              data-node-id="2:70484"
              data-name="menu item footer">
              <p
                className="[word-break:break-word] capitalize font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                data-node-id="I2:70484;2678:143004"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                Contact
              </p>
            </div>
            <div
              className="content-stretch flex items-start p-[8px] relative shrink-0"
              data-node-id="2:70485"
              data-name="menu item footer">
              <p
                className="[word-break:break-word] capitalize font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                data-node-id="I2:70485;2678:143004"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                Cookies
              </p>
            </div>
            <div
              className="content-stretch flex items-start p-[8px] relative shrink-0"
              data-node-id="2:70486"
              data-name="menu item footer">
              <p
                className="[word-break:break-word] capitalize font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                data-node-id="I2:70486;2678:143004"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                Disclaimer
              </p>
            </div>
          </div>
          <Component2 className="content-stretch flex items-center relative shrink-0" />
        </div>
      </div>
    </div>
  );
}

export default function Footer1() {
  return (
    <Footer className="bg-[#f6f8f8] content-stretch flex flex-col items-start px-[128px] py-[24px] relative size-full" />
  );
}
```

---

## 6. `2847:15358` — Row overflow menu ("group-card-dropdown")

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/16793136-ac0c-4184-ad1e-c2f59854ba6d';
export default function GroupCardDropdown() {
  return (
    <div
      className="bg-white border border-solid border-white content-stretch flex flex-col items-center overflow-clip p-[12px] relative rounded-[4px] shadow-[0px_2px_8px_0px_rgba(109,110,115,0.35)] size-full"
      data-node-id="2847:15358"
      data-name="group-card-dropdown">
      <div
        className="content-stretch flex h-[40px] items-center pl-[6px] pr-[5px] py-[2px] relative shrink-0 w-full"
        data-node-id="2847:15362"
        data-name="Dropdown Panels">
        <div
          className="[word-break:break-word] content-stretch flex gap-[8px] h-full items-center justify-center leading-[24px] py-[10px] relative shrink-0 text-[14px] w-[29px]"
          data-node-id="2847:15363">
          <p
            className="absolute font-['Open_Sans:SemiBold'] font-semibold h-[24px] left-[32px] right-[-131px] text-[#323232] top-[6px]"
            data-node-id="2847:15364"
            style={{ fontVariationSettings: '"wdth" 100' }}>
            View details
          </p>
          <p
            className="font-['Font_Awesome_6_Pro:Regular'] not-italic relative shrink-0 text-black whitespace-nowrap"
            data-node-id="2847:15365">
            eye
          </p>
        </div>
      </div>
      <div
        className="content-stretch flex h-[40px] items-center pl-[6px] pr-[5px] py-[2px] relative shrink-0 w-full"
        data-node-id="2847:15366"
        data-name="Dropdown Panels">
        <div
          className="content-stretch flex gap-[8px] items-center justify-center p-[8px] relative rounded-[4px] shrink-0"
          data-node-id="2847:15367"
          data-name="Button">
          <div
            className="[word-break:break-word] flex flex-col font-['Font_Awesome_6_Pro:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[#323232] text-[14px] tracking-[0.4px] whitespace-nowrap"
            data-node-id="2847:15369">
            <p className="leading-[20px]">trash</p>
          </div>
        </div>
        <p
          className="[word-break:break-word] font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] w-[141px]"
          data-node-id="2847:15370"
          style={{ fontVariationSettings: '"wdth" 100' }}>
          Delete group
        </p>
      </div>
      <div
        className="content-stretch flex h-[40px] items-center pl-[6px] pr-[5px] py-[2px] relative shrink-0 w-full"
        data-node-id="2847:15371"
        data-name="Dropdown Panels">
        <div
          className="[word-break:break-word] content-stretch flex gap-[8px] items-center justify-center py-[10px] relative shrink-0 text-[#323232] w-[29px]"
          data-node-id="2847:15372">
          <div
            className="flex flex-col font-['Font_Awesome_6_Pro:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[16px] tracking-[0.25px] whitespace-nowrap"
            data-node-id="2847:15373">
            <p className="leading-[20px]">box-archive</p>
          </div>
          <p
            className="absolute font-['Open_Sans:SemiBold'] font-semibold h-[24px] leading-[24px] left-[32px] right-[-131px] text-[14px] top-[6px]"
            data-node-id="2847:15374"
            style={{ fontVariationSettings: '"wdth" 100' }}>
            Archive group
          </p>
        </div>
      </div>
      <div
        className="content-stretch flex h-[40px] items-center pl-[6px] pr-[5px] py-[2px] relative shrink-0 w-full"
        data-node-id="2847:15375"
        data-name="Dropdown Panels">
        <div
          className="[word-break:break-word] content-stretch flex gap-[8px] h-full items-center justify-center leading-[24px] py-[10px] relative shrink-0 text-[#323232] text-[14px] w-[29px]"
          data-node-id="2847:15376">
          <p
            className="font-['Font_Awesome_6_Pro:Regular'] not-italic relative shrink-0 whitespace-nowrap"
            data-node-id="2847:15377">
            boxes-packing
          </p>
          <p
            className="absolute font-['Open_Sans:SemiBold'] font-semibold h-[24px] left-[32px] right-[-131px] top-[6px]"
            data-node-id="2847:15378"
            style={{ fontVariationSettings: '"wdth" 100' }}>
            Reactivate group
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 7. `2847:15083` — Table header cell, Name column (select-all checkbox)

```tsx
export default function ThTextStart() {
  return (
    <div
      className="content-stretch flex gap-[10px] items-center px-[16px] py-[10px] relative size-full"
      data-node-id="2847:15083"
      data-name="th-text-start">
      <div aria-hidden className="absolute bg-[#dedede] inset-0 pointer-events-none" />
      <div
        className="content-stretch flex items-center justify-center px-[16px] relative rounded-[32px] shrink-0 size-[32px]"
        data-node-id="2847:15084"
        data-name="v-input--selection-controls">
        <div
          className="bg-[#af1685] border border-[#af1685] border-solid content-stretch flex flex-col items-center justify-center overflow-clip p-[8px] relative rounded-[2px] shadow-[0px_0px_0px_0px_rgba(0,0,0,0)] shrink-0 size-[18px]"
          data-node-id="2847:15085"
          data-name="checkbox-box">
          <div
            className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]"
            data-node-id="2847:15086"
            data-name="core-icon">
            <div
              className="[word-break:break-word] flex flex-col font-['Font_Awesome_6_Pro:Solid'] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap"
              data-node-id="2847:15087">
              <p className="leading-[16px]">minus</p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] tracking-[0.4px] whitespace-nowrap"
        data-node-id="2847:15088"
        style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">{`Name `}</p>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
    </div>
  );
}
```

> These styles are contained in the design: boxShadow/none: Effect(type: DROP_SHADOW, color:
> #00000000, offset: (0, 0), radius: 0, spread: 0).

---

## 8. `2847:15089` — Table body cell, Name column, selected row

```tsx
export default function TdTextStart() {
  return (
    <div
      className="bg-[#f9ecf5] border-[#dedede] border-b border-solid content-stretch flex gap-[10px] items-center px-[16px] py-[10px] relative size-full"
      data-node-id="2847:15089"
      data-name="td-text-start">
      <div
        className="content-stretch flex items-center justify-center px-[16px] relative rounded-[32px] shrink-0 size-[32px]"
        data-node-id="2847:15090"
        data-name="v-input--selection-controls">
        <div
          className="[word-break:break-word] flex flex-col font-['Material_Icons:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#af1685] text-[24px] text-center whitespace-nowrap"
          data-node-id="I2847:15090;58:540"
          style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          <p className="leading-none">check_box</p>
        </div>
      </div>
      <div
        className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:SemiBold'] font-semibold h-full justify-center leading-[0] min-w-px relative text-[#af1685] text-[14px]"
        data-node-id="2847:15091"
        style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid leading-[24px] underline">
          Class 1
        </p>
      </div>
    </div>
  );
}
```

> These styles are contained in the design: v-icon/medium: Font(family: "Material Icons",
> style: Regular, size: 24, weight: 400, lineHeight: 1, letterSpacing: 0).

---

## 9. `2847:15245` — Table body cell, Action column

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/65a43c1f-2568-469a-bf63-e2274a89e5dd';
const imgEllipsis = `${assetPathPrefix}/5f7e7.svg`;

export default function TdTextStart() {
  return (
    <div
      className="bg-[#f9ecf5] border-[#dedede] border-b border-solid content-stretch flex gap-[10px] items-start justify-center px-[24px] py-[4px] relative size-full"
      data-node-id="2847:15245"
      data-name="td-text-start">
      <div
        className="content-stretch flex items-center relative shrink-0"
        data-node-id="2847:15246">
        <div
          className="relative rounded-[56px] shrink-0 size-[40px]"
          data-node-id="2847:15247"
          data-name="Icon-button">
          <div
            className="absolute inset-[0_-1.25%_0_1.25%] rounded-[56px]"
            data-node-id="2847:15248"
            data-name="Icon-button">
            <div
              className="absolute inset-[20%]"
              data-node-id="I2847:15248;192:2740"
              data-name="icon">
              <img
                alt=""
                className="absolute block inset-0 max-w-none size-full"
                src={imgEllipsis}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

> Component descriptions:
>
> ## Icon-button — **Node ID:** 1:107 — ✅ implemented ✨Variants

---

## 10. `2847:15427` — "40 Groups" result count

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/a690b8e5-e900-4c47-bb8e-58600c8f6331';
const imgLine39 = `${assetPathPrefix}/6018c.svg`;

export default function Frame1000000739() {
  return (
    <div
      className="content-stretch flex gap-[12px] items-center justify-end relative size-full"
      data-node-id="2847:15427">
      <div
        className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] tracking-[0.4px] whitespace-nowrap"
        data-node-id="2847:15428"
        style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">40 Groups</p>
      </div>
      <div
        className="flex h-[24px] items-center justify-center relative shrink-0 w-0"
        data-node-id="2847:15429">
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[24px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLine39} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 11. `2847:15709` — `sl-helper-theme` inline error message

```tsx
export default function SlHelperTheme() {
  return (
    <div
      className="content-stretch flex items-start relative size-full"
      data-node-id="2847:15709"
      data-name="sl-helper-theme">
      <div
        className="content-stretch flex flex-[1_0_0] gap-[4px] items-start min-w-px pt-[4px] relative"
        data-node-id="I2847:15709;2711:11206"
        data-name="sl-base-helper">
        <div
          className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]"
          data-node-id="I2847:15709;2711:11206;1165:4968"
          data-name="core-icon">
          <div
            className="flex-[1_0_0] h-full min-w-px relative"
            data-node-id="I2847:15709;2711:11206;1165:4968;399:65"
            data-name="error-solid">
            <div
              className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Solid'] inset-0 justify-center leading-[0] not-italic text-[#ed1111] text-[15px] text-center"
              data-node-id="I2847:15709;2711:11206;1165:4968;399:65;668:2526">
              <p className="leading-[16px]">triangle-exclamation</p>
            </div>
          </div>
        </div>
        <div
          className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#ed1111] text-[12px] whitespace-nowrap"
          data-node-id="I2847:15709;2711:11206;1165:4969"
          style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[16px]">
            You cannot reactivate an active group. Please, disselect all active groups to be able to
            continue.
          </p>
        </div>
      </div>
    </div>
  );
}
```

> These styles are contained in the design: color/input/helper/icon/invalid: #ED1111,
> text/input/textField/fontIcon/md: Font(family: "Font Awesome 6 Pro", style: Solid, size:
> 15, weight: 900, lineHeight: 16, letterSpacing: 0), color/input/helper/text/invalid:
> #ED1111, text/input/helper/text/sm: Font(family: "Open Sans", style: Regular, size: 12,
> weight: 400, lineHeight: 16, letterSpacing: 0).

---

## 12. `2847:15077` — "ALL SCHOOL GROUPS" section heading

```tsx
export default function Frame27134() {
  return (
    <div
      className="content-stretch flex items-start justify-between relative size-full"
      data-node-id="2847:15077">
      <p
        className="[word-break:break-word] font-['Open_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#8d8d8d] text-[18px] whitespace-nowrap"
        data-node-id="2847:15078"
        style={{ fontVariationSettings: '"wdth" 100' }}>
        ALL SCHOOL GROUPS
      </p>
      <div className="h-[40px] relative shrink-0 w-[150px]" data-node-id="2847:15079" />
    </div>
  );
}
```

> These styles are contained in the design: Gray/gray 500: #8D8D8D, H4: Font(family: "Open
> Sans", style: SemiBold, size: 18, weight: 600, lineHeight: 100, letterSpacing: 0).

---

## 13. `2847:15152` — Table body cell, Type column (plain text td instance)

```tsx
export default function TdTextStart() {
  return (
    <div
      className="bg-[#f9ecf5] border-[#dedede] border-b border-solid content-stretch flex items-center px-[16px] py-[10px] relative size-full"
      data-node-id="2847:15152"
      data-name="td-text-start">
      <div
        className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#323232] text-[14px] tracking-[0.25px]"
        data-node-id="I2847:15152;72:383"
        style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">class</p>
      </div>
    </div>
  );
}
```

---

## 14. `2847:15242` — Table header cell, Action column

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/682bb813-13ec-46e7-a42f-c8701f6d87a1';
export default function ThTextStart() {
  return (
    <div
      className="content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[10px] relative size-full"
      data-node-id="2847:15242"
      data-name="th-text-start">
      <div aria-hidden className="absolute bg-[#dedede] inset-0 pointer-events-none" />
      <div
        className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] tracking-[0.4px] whitespace-nowrap"
        data-node-id="2847:15243"
        style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[20px]">Action</p>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
    </div>
  );
}
```
