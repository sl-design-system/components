# Raw `get_design_context` responses — b-sesame-group-details

File `UBr399hnydpNF9P5Jb2vfx` (MySesame-Redesign) · root node `2142:48093` "Group details"
Server: remote `mcp__figma__get_design_context`. Framework hint `lit`, languages `typescript,html,css`,
`excludeScreenshot: true`.

**No root-level call was made.** The root frame is ~400 metadata nodes (far more once instances expand);
7 targeted region calls cover 100% of the visible surface. Regions fetched:

| Node ID      | Region                                                                             |
| ------------ | ---------------------------------------------------------------------------------- |
| `2142:48094` | Group 26820 — back link, page title, detail rows, Archive group, Linking code card |
| `2142:48139` | Frame 1000000824 — app header (top navi bar + secondary school bar)                |
| `2142:48135` | tabs                                                                               |
| `2142:48171` | Frame 1000000776 — "Add student to group" panel (search row + no-results)          |
| `2142:48316` | Frame 1000000791 — "Can't find the student?" create-student form + actions         |
| `2142:48470` | Frame 8829 — empty state                                                           |
| `2142:48477` | Footer                                                                             |

Not fetched: the panel wrapper `2142:48170` ("Frame 1000000800", x=128 w=1024 h=1293) was **not**
called on its own, so its own fill is not captured here — see the manifest's "Known gaps".
The stray `<vector id="2142:48496" name="Arrow 9">` has no design-context representation.

Every response below is reproduced verbatim, including the trailing "SUPER CRITICAL" boilerplate,
the "These styles are contained in the design" line and the "Component descriptions" block.

---

## 1. `2142:48094` — Group 26820 (back link, title, detail rows, Archive group, Linking code)

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/6d39f572-1609-4ba9-8261-573ec77d16ec';
const imgIconsEdit2 = `${assetPathPrefix}/6f425.svg`;
const imgArchive1 = `${assetPathPrefix}/31566.svg`;
const imgKey51 = `${assetPathPrefix}/06e41.svg`;

export default function Group26820() {
  return (
    <div className="contents relative size-full" data-node-id="2142:48094">
      <div
        className="absolute h-[40px] left-[128px] top-[160px] w-[934px]"
        data-node-id="2142:48095">
        <p
          className="[word-break:break-word] absolute font-['Open_Sans:Bold'] font-bold leading-[40px] left-0 text-[28px] text-black top-0 tracking-[-0.56px] w-[352px]"
          data-node-id="2142:48096"
          style={{ fontVariationSettings: '"wdth" 100' }}>
          Group details
        </p>
      </div>
      <p
        className="[word-break:break-word] absolute font-['Open_Sans:Bold'] font-bold leading-[24px] left-[128px] text-[#01766d] text-[14px] top-[120px] whitespace-nowrap"
        data-node-id="2142:48097"
        style={{ fontVariationSettings: '"wdth" 100' }}>{`< Back to Groups`}</p>
      <div
        className="absolute content-stretch flex flex-col items-start left-[127px] top-[240px]"
        data-node-id="2142:48098">
        <div
          className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[628px]"
          data-node-id="2142:48099"
          data-name="left colum">
          <div
            className="border-[#cecfd2] border-b border-solid content-stretch flex h-[72px] items-start relative shrink-0 w-full"
            data-node-id="2142:48100"
            data-name="group name">
            <div
              className="content-stretch flex flex-[1_0_0] items-center justify-between min-w-px relative"
              data-node-id="2142:48101">
              <div
                className="[word-break:break-word] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 text-[#323232] text-[16px]"
                data-node-id="2142:48102">
                <p
                  className="col-1 font-['Open_Sans:Regular'] font-normal leading-[24px] ml-0 mt-0 relative row-1 tracking-[-0.32px] w-[322px]"
                  data-node-id="2142:48103"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  Group name
                </p>
                <p
                  className="col-1 font-['Open_Sans:Bold'] font-bold leading-[28px] ml-0 mt-[28px] relative row-1 w-[322px]"
                  data-node-id="2142:48104"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  French 1D
                </p>
              </div>
              <div
                className="bg-white border border-[#01766d] border-solid content-stretch flex gap-[8px] items-center px-[24px] py-[8px] relative rounded-[4px] shrink-0"
                data-node-id="2142:48105"
                data-name="button secondary">
                <div
                  className="relative shrink-0 size-[16px]"
                  data-node-id="I2142:48105;2846:104553"
                  data-name="Icons/plus">
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={imgIconsEdit2}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="border-[#cecfd2] border-b border-solid content-stretch flex h-[72px] items-start relative shrink-0 w-full"
            data-node-id="2142:48106"
            data-name="school year">
            <div
              className="content-stretch flex flex-[1_0_0] items-center justify-between min-w-px relative"
              data-node-id="2142:48107">
              <div
                className="[word-break:break-word] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 text-[#323232] text-[16px]"
                data-node-id="2142:48108">
                <p
                  className="col-1 font-['Open_Sans:Regular'] font-normal leading-[24px] ml-0 mt-0 relative row-1 tracking-[-0.32px] w-[322px]"
                  data-node-id="2142:48109"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  School year
                </p>
                <p
                  className="col-1 font-['Open_Sans:Bold'] font-bold leading-[28px] ml-0 mt-[28px] relative row-1 w-[322px]"
                  data-node-id="2142:48110"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  22/23
                </p>
              </div>
              <div
                className="bg-white border border-[#01766d] border-solid content-stretch flex gap-[8px] items-center px-[24px] py-[8px] relative rounded-[4px] shrink-0"
                data-node-id="2142:48111"
                data-name="button secondary">
                <div
                  className="relative shrink-0 size-[16px]"
                  data-node-id="I2142:48111;2846:104553"
                  data-name="Icons/plus">
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={imgIconsEdit2}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="border-[#cecfd2] border-b border-solid content-stretch flex h-[72px] items-start relative shrink-0 w-full"
            data-node-id="2142:48112"
            data-name="school year">
            <div
              className="content-stretch flex flex-[1_0_0] items-center justify-between min-w-px relative"
              data-node-id="2142:48113">
              <div
                className="[word-break:break-word] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 text-[#323232] text-[16px]"
                data-node-id="2142:48114">
                <p
                  className="col-1 font-['Open_Sans:Regular'] font-normal leading-[24px] ml-0 mt-0 relative row-1 tracking-[-0.32px] w-[322px]"
                  data-node-id="2142:48115"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  Group type
                </p>
                <p
                  className="col-1 font-['Open_Sans:Bold'] font-bold leading-[28px] ml-0 mt-[28px] relative row-1 w-[322px]"
                  data-node-id="2142:48116"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  Study group
                </p>
              </div>
              <div
                className="bg-white border border-[#01766d] border-solid content-stretch flex gap-[8px] items-center px-[24px] py-[8px] relative rounded-[4px] shrink-0"
                data-node-id="2142:48118"
                data-name="button secondary">
                <div
                  className="relative shrink-0 size-[16px]"
                  data-node-id="I2142:48118;2846:104553"
                  data-name="Icons/plus">
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={imgIconsEdit2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute bg-white content-stretch flex gap-[8px] items-center justify-end left-[calc(81.25%-79px)] py-[8px] rounded-[6px] top-[240px] w-[189px]"
        data-node-id="2142:48119"
        data-name="Button-sesame">
        <div
          className="relative shrink-0 size-[16px]"
          data-node-id="2142:48120"
          data-name="archive 1">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArchive1} />
        </div>
        <p
          className="[word-break:break-word] font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#ed1111] text-[14px] tracking-[0.42px] whitespace-nowrap"
          data-node-id="2142:48124"
          style={{ fontVariationSettings: '"wdth" 100' }}>
          Archive group
        </p>
      </div>
      <div
        className="absolute bg-[#f5f5f6] content-stretch drop-shadow-[0px_2px_4px_rgba(109,110,115,0.35)] flex flex-col gap-[16px] items-start left-[calc(62.5%-12px)] px-[24px] py-[16px] rounded-[16px] top-[304px] w-[364px]"
        data-node-id="2142:48126"
        data-name="Linking code">
        <div
          className="content-stretch flex gap-[8px] items-center p-[8px] relative shrink-0 w-[249px]"
          data-node-id="2142:48127">
          <div
            className="relative shrink-0 size-[16px]"
            data-node-id="2142:48128"
            data-name="key (5) 1">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgKey51} />
          </div>
          <p
            className="[word-break:break-word] font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#5d5d5d] text-[16px] w-[217px]"
            data-node-id="2142:48130"
            style={{ fontVariationSettings: '"wdth" 100' }}>
            Linking code
          </p>
        </div>
        <div
          className="content-stretch flex items-center pl-[8px] relative shrink-0 w-full"
          data-node-id="2142:48131"
          data-name="Group key">
          <p
            className="[word-break:break-word] font-['Open_Sans:Bold'] font-bold leading-[40px] relative shrink-0 text-[#323232] text-[36px] tracking-[-0.72px] whitespace-nowrap"
            data-node-id="2142:48132"
            style={{ fontVariationSettings: '"wdth" 100' }}>
            AB3FRR
          </p>
        </div>
        <div className="h-[40px] relative shrink-0 w-[249px]" data-node-id="2142:48133" />
      </div>
    </div>
  );
}
```

> SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
>
> 1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
> 2. Convert React syntax to the target framework/library
> 3. Transform all Tailwind classes to the target styling system while preserving exact visual design
> 4. Follow the project's existing patterns and conventions
>    DO NOT install any Tailwind as a dependency unless the user instructs you to do so.
>    Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
>    These styles are contained in the design: text button: Font(family: "Open Sans", style: Bold, size: 14, weight: 700, lineHeight: 24, letterSpacing: 0), secondary text color: #5D5D5D, Neutrals/$kampus-color-gray-1: #F5F5F6, shadow-low: Effect(type: DROP_SHADOW, color: #6D6E7359, offset: (0, 2), radius: 8, spread: 0).
> Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

---

## 2. `2142:48139` — Frame 1000000824 (app header: top navi bar + secondary bar)

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/53e3a5be-a7fb-4f2b-968d-a67122295d4b';
const imgGroup = `${assetPathPrefix}/c6fa2.svg`;
const imgGroup1 = `${assetPathPrefix}/e056f.svg`;
const imgLine24 = `${assetPathPrefix}/a20fe.svg`;
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

export default function Frame1000000824() {
  return (
    <div
      className="content-stretch flex flex-col items-center relative size-full"
      data-node-id="2142:48139">
      <div
        className="bg-white h-[56px] overflow-clip relative shrink-0 w-full"
        data-node-id="2142:48140"
        data-name="top navi bar">
        <div
          className="absolute h-[24px] left-[128px] overflow-clip top-[16px] w-[123.467px]"
          data-node-id="2142:48141"
          data-name="MittSanoma 3">
          <div
            className="absolute contents inset-0"
            data-node-id="2142:48142"
            data-name="Clip path group">
            <div
              className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[123.467px_24px]"
              data-node-id="2142:48145"
              style={{ maskImage: `url("${imgGroup}")` }}
              data-name="Group">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1} />
            </div>
          </div>
        </div>
        <div
          className="-translate-x-1/2 absolute content-stretch flex gap-[24px] items-start justify-end left-[calc(50%+0.5px)] py-[10px] top-0"
          data-node-id="2142:48150">
          <MenuItemSu className="content-stretch flex items-start overflow-clip px-[2px] py-[8px] relative shrink-0" />
          <div
            className="content-stretch flex flex-col gap-[2px] items-center px-[2px] py-[8px] relative shrink-0"
            data-node-id="2142:48152"
            data-name="menu item SU">
            <div
              className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-end leading-[0] relative shrink-0 text-[#323232] text-[14px] text-center w-full"
              data-node-id="I2142:48152;772:26885"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[20px]">Groups</p>
            </div>
            <div className="h-0 relative shrink-0 w-full" data-node-id="I2142:48152;772:26886">
              <div className="absolute inset-[-2px_0_0_0]">
                <img alt="" className="block max-w-none size-full" src={imgLine24} />
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex items-start overflow-clip px-[2px] py-[8px] relative shrink-0"
            data-node-id="2142:48153"
            data-name="menu item SU">
            <div
              className="[word-break:break-word] flex flex-col font-['Open_Sans:SemiBold'] font-semibold justify-end leading-[0] relative shrink-0 text-[#323232] text-[14px] text-center whitespace-nowrap"
              data-node-id="I2142:48153;772:26891"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[20px]">Users</p>
            </div>
          </div>
          <div
            className="content-stretch flex items-start overflow-clip px-[2px] py-[8px] relative shrink-0"
            data-node-id="2142:48154"
            data-name="menu item SU">
            <div
              className="[word-break:break-word] flex flex-col font-['Open_Sans:SemiBold'] font-semibold justify-end leading-[0] relative shrink-0 text-[#323232] text-[14px] text-center whitespace-nowrap"
              data-node-id="I2142:48154;772:26891"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[20px]">Licenses</p>
            </div>
          </div>
        </div>
        <div
          className="absolute content-stretch flex h-[56px] items-center justify-end left-[calc(68.75%-5.06px)] top-0 w-[277px]"
          data-node-id="2142:48155">
          <div
            className="content-stretch flex items-start p-[8px] relative rounded-[4px] shrink-0"
            data-node-id="2142:48156"
            data-name="avatar_SU">
            <div
              className="content-stretch flex gap-[8px] isolate items-center relative shrink-0"
              data-node-id="I2142:48156;775:12268"
              data-name="sl-avatar-circle-text">
              <div
                className="[word-break:break-word] content-stretch flex flex-col font-['Open_Sans:Regular'] font-normal items-end leading-[0] relative shrink-0 text-[#323232] whitespace-nowrap z-[3]"
                data-node-id="I2142:48156;775:12269"
                data-name="avatar-header">
                <div
                  className="flex flex-col justify-center relative shrink-0 text-[14px]"
                  data-node-id="I2142:48156;775:12270"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[20px]">Anna Magiera</p>
                </div>
                <div
                  className="flex flex-col justify-center relative shrink-0 text-[12px]"
                  data-node-id="I2142:48156;775:12271"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[12px]">Teacher</p>
                </div>
              </div>
              <div
                className="content-stretch flex isolate items-center relative shrink-0 z-[2]"
                data-node-id="I2142:48156;775:12272"
                data-name="sl-avatar-circle-text">
                <div
                  className="relative shrink-0 size-[32px] z-[1]"
                  data-node-id="I2142:48156;775:12273"
                  data-name="sl-avatar-circle">
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={imgSlAvatarCircle}
                  />
                  <div
                    className="absolute content-stretch flex gap-[8px] h-[12px] isolate items-center justify-center min-w-[12px] px-px py-[2px] right-[-2px] rounded-[999px] top-[-2px]"
                    data-node-id="I2142:48156;775:12281"
                    data-name="icon">
                    <div
                      className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] flex flex-col font-['Font_Awesome_6_Pro:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[#323232] text-[9px] text-center uppercase whitespace-nowrap z-[2]"
                      data-node-id="I2142:48156;775:12282">
                      <p className="leading-[9px]">gear</p>
                    </div>
                    <div
                      className="absolute inset-0 z-[1]"
                      data-node-id="I2142:48156;775:12283"
                      data-name="icon-bg">
                      <div
                        className="absolute bg-white inset-0 rounded-[800px]"
                        data-node-id="I2142:48156;775:12283;2801:8913"
                        data-name="badge-bg"
                      />
                    </div>
                  </div>
                  <div
                    className="-translate-x-1/2 -translate-y-1/2 [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] absolute flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] left-1/2 text-[#323232] text-[12px] text-center top-[calc(50%+0.5px)] uppercase w-[32px]"
                    data-node-id="I2142:48156;775:12284"
                    style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[16px]">EM</p>
                  </div>
                </div>
              </div>
              <div
                className="[word-break:break-word] flex flex-col font-['Font_Awesome_6_Pro:Regular'] justify-end leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap z-[1]"
                data-node-id="I2142:48156;775:12286">
                <p className="leading-[20px]">chevron-down</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-white content-stretch flex items-center justify-end overflow-clip px-[128px] py-[12px] relative shrink-0 w-full"
        data-node-id="2142:48157"
        data-name="secondary bar">
        <div
          className="content-stretch flex items-start relative shrink-0"
          data-node-id="2142:48158">
          <div
            className="content-stretch flex gap-[16px] h-[40px] items-center relative shrink-0"
            data-node-id="2142:48159"
            data-name="School selection">
            <div
              className="content-stretch flex items-center relative shrink-0"
              data-node-id="2142:48160"
              data-name="Dropdown">
              <div
                className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[353px]"
                data-node-id="2142:48161">
                <div
                  className="content-stretch flex items-center relative shrink-0"
                  data-node-id="2142:48162">
                  <p
                    className="[word-break:break-word] font-['Font_Awesome_6_Pro:Regular'] leading-[24px] not-italic relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                    data-node-id="2142:48163">
                    school-flag
                  </p>
                  <div
                    className="content-stretch flex gap-[8px] items-start pl-[8px] relative shrink-0"
                    data-node-id="2142:48164"
                    data-name="School label">
                    <p
                      className="[word-break:break-word] font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                      data-node-id="2142:48167"
                      style={{ fontVariationSettings: '"wdth" 100' }}>
                      Bogaerts International School
                    </p>
                  </div>
                </div>
                <div
                  className="bg-[rgba(0,0,0,0)] border-2 border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[4px] relative rounded-[800px] shrink-0"
                  data-node-id="2142:48168"
                  data-name="button">
                  <div
                    className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#01766d] text-[14px] text-center whitespace-nowrap"
                    data-node-id="I2142:48168;915:4408"
                    style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[16px]">Switch school</p>
                  </div>
                  <div
                    className="absolute inset-[-2px]"
                    data-node-id="I2142:48168;2123:33965"
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
  );
}
```

> SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
>
> 1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
> 2. Convert React syntax to the target framework/library
> 3. Transform all Tailwind classes to the target styling system while preserving exact visual design
> 4. Follow the project's existing patterns and conventions
>    DO NOT install any Tailwind as a dependency unless the user instructs you to do so.
>    Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.

Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

### Property 1=Default

**Node ID:** 777:12400

An avatar is a visual representation of an entity, such as a user or an organization.

**Notes**

- A subheader on a small horizontal avatar is not allowed and is turned off by default.

**Documentation:**

- [https://sanomalearning.design/categories/components/avatar/](https://sanomalearning.design/categories/components/avatar/)

> Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

---

## 3. `2142:48135` — tabs

```tsx
export default function Tabs() {
  return (
    <div
      className="border-[#cecfd2] border-b border-solid content-stretch flex items-start relative size-full"
      data-node-id="2142:48135"
      data-name="tabs">
      <div
        className="content-stretch flex gap-[8px] items-center px-[24px] py-[16px] relative shrink-0"
        data-node-id="2142:48136"
        data-name="DEMO - Tab-switches">
        <div
          aria-hidden
          className="absolute bg-[rgba(255,255,255,0.01)] inset-0 pointer-events-none"
        />
        <div
          className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#5d5d5d] text-[16px] text-center whitespace-nowrap"
          data-node-id="I2142:48136;11109:145010"
          style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[24px]">Students</p>
        </div>
        <div
          className="bg-[#f2a900] content-stretch flex flex-col items-center justify-center px-[3px] py-px relative rounded-[12px] shrink-0 size-[24px]"
          data-node-id="I2142:48136;11109:145011"
          data-name="number-tag">
          <div
            className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[12px] tracking-[0.36px] whitespace-nowrap"
            data-node-id="I2142:48136;11109:145011;10169:35199"
            style={{ fontVariationSettings: '"wdth" 100' }}>
            <p className="leading-[16px]">10</p>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_0px_0px_#2e5c64]" />
      </div>
      <div
        className="bg-[rgba(255,255,255,0.01)] border-[#cecfd2] border-b border-solid content-stretch flex gap-[8px] items-center px-[24px] py-[16px] relative shrink-0"
        data-node-id="2142:48137"
        data-name="DEMO - Tab-switches">
        <div
          className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#323232] text-[16px] text-center whitespace-nowrap"
          data-node-id="I2142:48137;11109:145013"
          style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[24px]">Teachers</p>
        </div>
        <div
          className="bg-[#f2a900] content-stretch flex flex-col items-center justify-center px-[3px] py-px relative rounded-[12px] shrink-0 size-[24px]"
          data-node-id="I2142:48137;11109:145014"
          data-name="number-tag">
          <div
            className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[12px] tracking-[0.36px] whitespace-nowrap"
            data-node-id="I2142:48137;11109:145014;10169:35199"
            style={{ fontVariationSettings: '"wdth" 100' }}>
            <p className="leading-[16px]">1</p>
          </div>
        </div>
      </div>
      <div
        className="bg-[rgba(255,255,255,0.01)] border-[#cecfd2] border-b border-solid content-stretch flex gap-[8px] items-center px-[24px] py-[16px] relative shrink-0"
        data-node-id="2142:48138"
        data-name="DEMO - Tab-switches">
        <div
          className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#323232] text-[16px] text-center whitespace-nowrap"
          data-node-id="I2142:48138;11109:145013"
          style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[24px]">Manage student licenses</p>
        </div>
      </div>
    </div>
  );
}
```

> SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
>
> 1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
> 2. Convert React syntax to the target framework/library
> 3. Transform all Tailwind classes to the target styling system while preserving exact visual design
> 4. Follow the project's existing patterns and conventions
>    DO NOT install any Tailwind as a dependency unless the user instructs you to do so.
>    Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
>    These styles are contained in the design: Body/Small-bold: Font(family: "Open Sans", style: Bold, size: 16, weight: 700, lineHeight: 24, letterSpacing: 0), UI/Tiny-bold: Font(family: "Open Sans", style: Bold, size: 12, weight: 700, lineHeight: 16, letterSpacing: 3), Body/Small: Font(family: "Open Sans", style: Regular, size: 16, weight: 400, lineHeight: 24, letterSpacing: 0).

Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

### State=Active, Content=Number indicator

**Node ID:** 2:69159

Tab / Default

### DEMO - Tab-switches

**Node ID:** 2:69119

✨Variants

### number-tag

**Node ID:** 2:69165

✅ implemented

### State=Inactive, Content=Number indicator

**Node ID:** 2:69162

Tab / Default

> Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

---

## 4. `2142:48477` — Footer

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/a301de63-897a-416d-b82b-d72d0c6a97c8';
const imgSanomaPayoffFunky01DarkGreenRgb2 = `${assetPathPrefix}/46163.svg`;

type MenuItemFooterProps = {
  className?: string;
  property1?: 'default';
};

function MenuItemFooter({ className, property1 = 'default' }: MenuItemFooterProps) {
  return (
    <div
      className={className || 'content-stretch flex items-start p-[8px] relative'}
      data-node-id="2:69240">
      <p
        className="[word-break:break-word] capitalize font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
        data-node-id="2:69241"
        style={{ fontVariationSettings: '"wdth" 100' }}>
        Privacy Policy
      </p>
    </div>
  );
}

export default function Footer() {
  return (
    <div
      className="bg-[#f6f8f8] content-stretch flex flex-col items-start px-[128px] relative size-full"
      data-node-id="2142:48477"
      data-name="Footer">
      <div
        className="content-stretch flex gap-[12px] items-center relative shrink-0 w-[1024px]"
        data-node-id="2142:48478">
        <div
          className="h-[126px] relative shrink-0 w-[201.6px]"
          data-node-id="2142:48479"
          data-name="SANOMA+Payoff FUNKY 01 DARK GREEN RGB 2">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={imgSanomaPayoffFunky01DarkGreenRgb2}
          />
        </div>
        <div
          className="content-stretch flex items-center justify-end relative shrink-0 w-[810px]"
          data-node-id="2142:48488">
          <div
            className="content-stretch flex flex-col items-end relative shrink-0 w-[520px]"
            data-node-id="2142:48489">
            <div
              className="content-stretch flex gap-[16px] items-start px-[8px] relative shrink-0"
              data-node-id="2142:48490">
              <MenuItemFooter className="content-stretch flex items-start p-[8px] relative shrink-0" />
              <div
                className="content-stretch flex items-start p-[8px] relative shrink-0"
                data-node-id="2142:48492"
                data-name="menu item footer">
                <p
                  className="[word-break:break-word] capitalize font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                  data-node-id="I2142:48492;2678:143004"
                  style={{ fontVariationSettings: '"wdth" 100' }}>{`Terms & conditions`}</p>
              </div>
              <div
                className="content-stretch flex items-start p-[8px] relative shrink-0"
                data-node-id="2142:48493"
                data-name="menu item footer">
                <p
                  className="[word-break:break-word] capitalize font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                  data-node-id="I2142:48493;2678:143004"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  Cookies
                </p>
              </div>
              <div
                className="content-stretch flex items-start p-[8px] relative shrink-0"
                data-node-id="2142:48494"
                data-name="menu item footer">
                <p
                  className="[word-break:break-word] capitalize font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                  data-node-id="I2142:48494;2678:143004"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  Support
                </p>
              </div>
              <div
                className="content-stretch flex items-start p-[8px] relative shrink-0"
                data-node-id="2142:48495"
                data-name="menu item footer">
                <p
                  className="[word-break:break-word] capitalize font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                  data-node-id="I2142:48495;2678:143004"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  About our digital services
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

> SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
>
> 1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
> 2. Convert React syntax to the target framework/library
> 3. Transform all Tailwind classes to the target styling system while preserving exact visual design
> 4. Follow the project's existing patterns and conventions
>    DO NOT install any Tailwind as a dependency unless the user instructs you to do so.
>    Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
>    Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

---

## 5. `2142:48470` — Frame 8829 (empty state)

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/a4316b41-b3c1-48f7-83ad-28aae389237e';
const imgProperty1Default = `${assetPathPrefix}/94b18.svg`;

type EmptyIsonProps = {
  className?: string;
  property1?: 'Default';
};

function EmptyIson({ className, property1 = 'Default' }: EmptyIsonProps) {
  return (
    <div className={className || 'h-[57.085px] relative w-[80px]'} data-node-id="2:69251">
      <img
        alt=""
        className="absolute block inset-0 max-w-none size-full"
        src={imgProperty1Default}
      />
    </div>
  );
}

export default function Frame8829() {
  return (
    <div
      className="content-stretch flex flex-col gap-[24px] items-center justify-center py-[24px] relative size-full"
      data-node-id="2142:48470">
      <EmptyIson className="h-[71.357px] relative shrink-0 w-[100px]" />
      <div
        className="content-stretch flex flex-col items-center relative shrink-0"
        data-node-id="2142:48472">
        <div
          className="content-stretch flex flex-col items-center relative shrink-0"
          data-node-id="2142:48473">
          <div
            className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-center relative shrink-0 text-black w-[556px]"
            data-node-id="2142:48474">
            <p
              className="font-['Open_Sans:Bold'] font-bold leading-[normal] relative shrink-0 text-[24px] text-center w-[390px]"
              data-node-id="2142:48475"
              style={{
                fontVariationSettings: '"wdth" 100'
              }}>{`You don't have any students yet`}</p>
            <ul
              className="block font-['Open_Sans:Regular'] font-normal leading-[0] relative shrink-0 text-[16px] w-[220px]"
              data-node-id="2142:48476"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              <li className="list-disc ms-[24px]">
                <span className="leading-[24px]">{`Start by adding a student `}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
```

> SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
>
> 1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
> 2. Convert React syntax to the target framework/library
> 3. Transform all Tailwind classes to the target styling system while preserving exact visual design
> 4. Follow the project's existing patterns and conventions
>    DO NOT install any Tailwind as a dependency unless the user instructs you to do so.
>    Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
>    These styles are contained in the design: Gray/gray 300: #BFBFBF.
>    Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

---

## 6. `2142:48171` — Frame 1000000776 ("Add student to group" panel: heading, search row, no-results)

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/90921983-ec64-489d-9626-049245f38f2a';
function ChevronDown({ className }: { className?: string }) {
  return (
    <div
      className={className || 'relative size-[16px]'}
      data-node-id="2:8679"
      data-name="chevron-down">
      <div
        className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#222] text-[16px] text-center"
        data-node-id="2:8680">
        <p className="leading-[16px]">chevron-down</p>
      </div>
    </div>
  );
}

export default function Frame1000000776() {
  return (
    <div
      className="content-stretch flex flex-col items-start relative size-full"
      data-node-id="2142:48171">
      <div
        className="content-stretch flex flex-col items-start relative shrink-0 w-full"
        data-node-id="2142:48172">
        <div
          className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full"
          data-node-id="2142:48173">
          <div
            className="content-stretch flex flex-col items-start relative shrink-0"
            data-node-id="2142:48174">
            <p
              className="[word-break:break-word] font-['Open_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#323] text-[18px] uppercase whitespace-nowrap"
              data-node-id="2142:48175"
              style={{ fontVariationSettings: '"wdth" 100' }}>
              Add student TO GROUP
            </p>
          </div>
          <div
            className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full"
            data-node-id="2142:48176">
            <div
              className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 whitespace-nowrap"
              data-node-id="2142:48177">
              <p
                className="font-['Open_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#323] text-[18px]"
                data-node-id="2142:48178"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                Search for a student
              </p>
              <p
                className="font-['Open_Sans:Regular'] font-normal leading-[24px] relative shrink-0 text-[#323232] text-[16px]"
                data-node-id="2142:48179"
                style={{
                  fontVariationSettings: '"wdth" 100'
                }}>{`Start by searching school records to add an existing student. `}</p>
            </div>
            <div
              className="content-stretch flex flex-col items-start justify-end relative shrink-0 w-full"
              data-node-id="2142:48180">
              <div
                className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[991px]"
                data-node-id="2142:48181">
                <div
                  className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative"
                  data-node-id="2142:48182"
                  data-name="sl-text_input">
                  <div
                    className="content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex flex-col isolate items-start relative rounded-[2px] shrink-0 w-full"
                    data-node-id="I2142:48182;2711:12444"
                    data-name="sl-text_input-theme">
                    <div
                      className="content-stretch flex items-start relative shrink-0 w-full z-[3]"
                      data-node-id="I2142:48182;2711:12444;2711:11125"
                      data-name="sl-label-theme">
                      <div
                        className="content-stretch flex flex-[1_0_0] gap-[4px] items-start min-w-px pb-[8px] relative"
                        data-node-id="I2142:48182;2711:12444;2711:11125;2711:11259"
                        data-name="sl-base-label-sm">
                        <div
                          className="content-stretch flex gap-[2px] items-center relative shrink-0"
                          data-node-id="I2142:48182;2711:12444;2711:11125;2711:11259;1222:5054"
                          data-name="label-container">
                          <div
                            className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                            data-node-id="I2142:48182;2711:12444;2711:11125;2711:11259;1215:5039"
                            style={{ fontVariationSettings: '"wdth" 100' }}>
                            <p className="leading-[16px]">First name</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="bg-white border border-[#9d9f9f] border-solid content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex gap-[8px] isolate items-center justify-center px-[16px] py-[8px] relative rounded-[4px] shrink-0 w-full z-[2]"
                      data-node-id="I2142:48182;2711:12444;2711:11126"
                      data-name="sl_base-text_input-lg2">
                      <div
                        className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] min-w-px relative text-[#323232] text-[16px] z-[3]"
                        data-node-id="I2142:48182;2711:12444;2711:11126;2911:2320"
                        style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[24px]">Type here</p>
                      </div>
                      <div
                        className="absolute inset-[-1px] z-[1]"
                        data-node-id="I2142:48182;2711:12444;2711:11126;2911:2322"
                        data-name="Focus ring">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex flex-[1_0_0] flex-col isolate items-start min-w-px relative rounded-[2px]"
                  data-node-id="2142:48183"
                  data-name="sl-text_input-theme [DEPRECATED]">
                  <div
                    className="content-stretch flex items-start relative shrink-0 w-full z-[3]"
                    data-node-id="2142:48184"
                    data-name="sl-label-theme [DEPRECATED]">
                    <div
                      className="content-stretch flex flex-[1_0_0] gap-[4px] items-start min-w-px pb-[8px] relative"
                      data-node-id="I2142:48184;2711:11259"
                      data-name="sl-base-label-sm">
                      <div
                        className="content-stretch flex gap-[2px] items-center relative shrink-0"
                        data-node-id="I2142:48184;2711:11259;1222:5054"
                        data-name="label-container">
                        <div
                          className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                          data-node-id="I2142:48184;2711:11259;1215:5039"
                          style={{ fontVariationSettings: '"wdth" 100' }}>
                          <p className="leading-[16px]">Last name</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="bg-white border border-[#9d9f9f] border-solid content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex gap-[8px] isolate items-center justify-center px-[16px] py-[8px] relative rounded-[4px] shrink-0 w-full z-[2]"
                    data-node-id="2142:48185"
                    data-name="sl_base-text_input">
                    <div
                      className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] min-w-px relative text-[#323232] text-[16px] z-[4]"
                      data-node-id="I2142:48185;2241:22370"
                      style={{ fontVariationSettings: '"wdth" 100' }}>
                      <p className="leading-[24px]">Woźniak</p>
                    </div>
                    <div
                      className="absolute inset-[-1px] z-[1]"
                      data-node-id="I2142:48185;2444:23862"
                      data-name="Focus ring">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
                    </div>
                  </div>
                </div>
                <div
                  className="content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex flex-[1_0_0] flex-col isolate items-start min-w-px relative rounded-[2px]"
                  data-node-id="2142:48187"
                  data-name="sl-text_input-theme [DEPRECATED]">
                  <div
                    className="content-stretch flex items-start relative shrink-0 w-full z-[3]"
                    data-node-id="I2142:48187;2711:11125"
                    data-name="sl-label-theme [DEPRECATED]">
                    <div
                      className="content-stretch flex flex-[1_0_0] gap-[4px] items-start min-w-px pb-[8px] relative"
                      data-node-id="I2142:48187;2711:11125;2711:11263"
                      data-name="sl-base-label-sm">
                      <div
                        className="content-stretch flex gap-[2px] items-center relative shrink-0"
                        data-node-id="I2142:48187;2711:11125;2711:11263;1222:5054"
                        data-name="label-container">
                        <div
                          className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                          data-node-id="I2142:48187;2711:11125;2711:11263;1215:5039"
                          style={{ fontVariationSettings: '"wdth" 100' }}>
                          <p className="leading-[16px]">Email</p>
                        </div>
                      </div>
                      <div
                        className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                        data-node-id="I2142:48187;2711:11125;2711:11263;1215:5074"
                        style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[16px]">(optional)</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="bg-white border border-[#9d9f9f] border-solid content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex gap-[8px] isolate items-center justify-center px-[16px] py-[8px] relative rounded-[4px] shrink-0 w-full z-[2]"
                    data-node-id="I2142:48187;2711:11126"
                    data-name="sl_base-text_input-lg2">
                    <div
                      className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] min-w-px relative text-[#323232] text-[16px] z-[3]"
                      data-node-id="I2142:48187;2711:11126;2911:2320"
                      style={{ fontVariationSettings: '"wdth" 100' }}>
                      <p className="leading-[24px]">Type here</p>
                    </div>
                    <div
                      className="absolute inset-[-1px] z-[1]"
                      data-node-id="I2142:48187;2711:11126;2911:2322"
                      data-name="Focus ring">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
                    </div>
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-w-px relative"
                  data-node-id="2142:48188"
                  data-name="sl-select">
                  <div
                    className="content-stretch flex items-start relative shrink-0 w-[34px] z-[2]"
                    data-node-id="2142:48189"
                    data-name="sl-label-theme">
                    <div
                      className="content-stretch flex flex-[1_0_0] gap-[4px] items-start min-w-px pb-[8px] relative"
                      data-node-id="I2142:48189;2711:11259"
                      data-name="label">
                      <div
                        className="content-stretch flex gap-[2px] items-center relative shrink-0"
                        data-node-id="I2142:48189;2711:11259;1222:5054"
                        data-name="label-container">
                        <div
                          className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                          data-node-id="I2142:48189;2711:11259;1215:5039"
                          style={{ fontVariationSettings: '"wdth" 100' }}>
                          <p className="leading-[16px]">Grade level</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="content-stretch flex flex-col items-start relative shrink-0 w-[242px] z-[1]"
                    data-node-id="2142:48190"
                    data-name="dropdown+helper">
                    <div
                      className="content-stretch flex flex-col gap-[4px] h-[40px] isolate items-start relative shrink-0 w-full"
                      data-node-id="2142:48191"
                      data-name="✏️ dropdown">
                      <div
                        className="relative shrink-0 w-full z-[2]"
                        data-node-id="2142:48192"
                        data-name="01">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
                          <div
                            className="content-stretch flex items-start relative shrink-0 w-full"
                            data-node-id="2142:48193"
                            data-name="sl_base-selecetbox-bg">
                            <div
                              className="content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex flex-[1_0_0] isolate items-center justify-center min-w-px relative rounded-[2px]"
                              data-node-id="2142:48194"
                              data-name="sl-selectbox-theme">
                              <div
                                className="bg-white border border-[#9d9f9f] border-solid content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex flex-[1_0_0] gap-[8px] isolate items-center min-w-px px-[16px] py-[8px] relative rounded-[4px] z-[1]"
                                data-node-id="2142:48195"
                                data-name="sl-base-selectbox">
                                <div
                                  className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] min-w-px relative text-[#323232] text-[16px] z-[3]"
                                  data-node-id="2142:48198"
                                  style={{ fontVariationSettings: '"wdth" 100' }}>
                                  <p className="leading-[24px]">{` `}</p>
                                </div>
                                <div
                                  className="relative shrink-0 size-[16px] z-[2]"
                                  data-node-id="2142:48199"
                                  data-name="select-box-down">
                                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                    <ChevronDown className="flex-[1_0_0] h-full min-w-px relative" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] left-[12px] text-[#5d5d5d] text-[16px] top-1/2 whitespace-nowrap"
                            data-node-id="2142:48201"
                            style={{ fontVariationSettings: '"wdth" 100' }}>
                            <p className="leading-[24px]">Please select</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="[word-break:break-word] bg-white content-stretch flex flex-col gap-[16px] items-start leading-[21px] p-[32px] relative rounded-[4px] shrink-0 text-[#323232] text-center w-[992px] whitespace-nowrap"
              data-node-id="2142:48309">
              <div
                className="content-stretch flex gap-[8px] items-center relative shrink-0 text-[18px]"
                data-node-id="2142:48310">
                <p
                  className="font-['Font_Awesome_6_Pro:Solid'] not-italic relative shrink-0"
                  data-node-id="2142:48311">
                  magnifying-glass
                </p>
                <p
                  className="font-['Open_Sans:SemiBold'] font-semibold relative shrink-0"
                  data-node-id="2142:48312"
                  style={{ fontVariationSettings: '"wdth" 100' }}>{`No matching results `}</p>
              </div>
              <p
                className="font-['Open_Sans:Regular'] font-normal relative shrink-0 text-[16px]"
                data-node-id="2142:48313"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                Can’t find the student? Please, add a new student by clicking Create new student
                below.
              </p>
            </div>
          </div>
          <div
            className="absolute h-[41.248px] left-[952px] top-0 w-[40px]"
            data-node-id="2142:48314"
            data-name="close">
            <p
              className="[word-break:break-word] absolute font-['Font_Awesome_6_Pro:Solid'] inset-[21.82%_35%_20%_37.5%] leading-[24px] not-italic text-[14px] text-black whitespace-nowrap"
              data-node-id="2142:48315">
              close
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

> SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
>
> 1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
> 2. Convert React syntax to the target framework/library
> 3. Transform all Tailwind classes to the target styling system while preserving exact visual design
> 4. Follow the project's existing patterns and conventions
>    DO NOT install any Tailwind as a dependency unless the user instructs you to do so.
>    Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
>    These styles are contained in the design: H3: Font(family: "Open Sans", style: SemiBold, size: 18, weight: 600, lineHeight: 100, letterSpacing: 0), H4: Font(family: "Open Sans", style: SemiBold, size: 18, weight: 600, lineHeight: 100, letterSpacing: 0), color/input/fieldLabel/text/default: #323232, text/input/fieldLabel/label/sm: Font(family: "Open Sans", style: Bold, size: 14, weight: 700, lineHeight: 16, letterSpacing: 0), color/input/textField/default/default/inputText: #323232, text/input/textField/text/lg: Font(family: "Open Sans", style: Regular, size: 16, weight: 400, lineHeight: 24, letterSpacing: 0), color/input/textField/default/default/background: #FFFFFF, color/input/textField/default/default/border: #9D9F9F, boxShadow/none: Effect(type: DROP_SHADOW, color: #00000000, offset: (0, 0), radius: 0, spread: 0), text/input/fieldLabel/tag/sm: Font(family: "Open Sans", style: Regular, size: 14, weight: 400, lineHeight: 16, letterSpacing: 0).

Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

### sl-text_input

**Node ID:** 7:35563

A text field component allows users to enter and edit single-line textual input. It serves as a fundamental building block for various form inputs in user interfaces

**Documentation:**

- [https://sanomalearning.design/categories/components/text-field/](https://sanomalearning.design/categories/components/text-field/)

### sl-text_input-theme

**Node ID:** 7:4834

✏️ Only edit the properties below The colors of this component are fixed and you wouldn't have to edit them. You can adjust the width of the field to fit your design.

### sl-label-theme

**Node ID:** 2:99832

Padding property

### sl_base-text_input-lg2

**Node ID:** 7:4824

🚫 Do not edit this component. This component is used to build the text input component and not intended for independent use. ↖️ Instead, edit the top-level component.

### sl-label-theme [DEPRECATED]

**Node ID:** 7:5008

⛔️ This component is deprecated. Please use the component \[Form Field\] in your projects going forward. Padding property

### sl_base-text_input-lg

**Node ID:** 7:4708

🚫 Do not edit this component. This component is used to build the text input component and not intended for independent use. ↖️ Instead, edit the top-level component.

### sl-text_input-theme [DEPRECATED]

**Node ID:** 7:5182

⛔️ This component is deprecated. Please use the component \[Form Field\] in your projects going forward. ✏️ Only edit the properties below The colors of this component are fixed and you wouldn't have to edit them. You can adjust the width of the field to fit your design.

> Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

---

## 7. `2142:48316` — Frame 1000000791 ("Can't find the student?" form + action row)

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/b0a50c5d-7844-4bd5-88a0-24a23b3e6bed';
function ChevronDown({ className }: { className?: string }) {
  return (
    <div
      className={className || 'relative size-[16px]'}
      data-node-id="2:8679"
      data-name="chevron-down">
      <div
        className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#222] text-[16px] text-center"
        data-node-id="2:8680">
        <p className="leading-[16px]">chevron-down</p>
      </div>
    </div>
  );
}

export default function Frame1000000791() {
  return (
    <div
      className="content-stretch flex flex-col gap-[40px] items-start relative size-full"
      data-node-id="2142:48316">
      <div
        className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0"
        data-node-id="2142:48317">
        <div
          className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0"
          data-node-id="2142:48318">
          <p
            className="font-['Open_Sans:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#323] text-[18px] whitespace-nowrap"
            data-node-id="2142:48319"
            style={{ fontVariationSettings: '"wdth" 100' }}>
            Can’t find the student?
          </p>
          <p
            className="font-['Open_Sans:Regular'] font-normal leading-[24px] relative shrink-0 text-[#323232] text-[16px] w-[562px]"
            data-node-id="2142:48320"
            style={{ fontVariationSettings: '"wdth" 100' }}>
            If you can’t find the student in the search suggestions or you add the student to school
            records for the first time, hit Create new student button.
          </p>
        </div>
        <div
          className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0"
          data-node-id="2142:48321">
          <div
            className="content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex flex-col isolate items-start relative rounded-[2px] shrink-0 w-[320px]"
            data-node-id="2142:48322"
            data-name="sl-text_input-theme [DEPRECATED]">
            <div
              className="content-stretch flex items-start relative shrink-0 w-full z-[3]"
              data-node-id="2142:48323"
              data-name="sl-label-theme [DEPRECATED]">
              <div
                className="content-stretch flex flex-[1_0_0] gap-[4px] items-start min-w-px pb-[8px] relative"
                data-node-id="I2142:48323;2711:11259"
                data-name="sl-base-label-sm">
                <div
                  className="content-stretch flex gap-[2px] items-center relative shrink-0"
                  data-node-id="I2142:48323;2711:11259;1222:5054"
                  data-name="label-container">
                  <div
                    className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                    data-node-id="I2142:48323;2711:11259;1215:5039"
                    style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[16px]">First name</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="bg-white border border-[#9d9f9f] border-solid content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex gap-[8px] isolate items-center justify-center px-[16px] py-[8px] relative rounded-[4px] shrink-0 w-full z-[2]"
              data-node-id="2142:48324"
              data-name="sl_base-text_input">
              <div
                className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] min-w-px relative text-[#323232] text-[16px] z-[4]"
                data-node-id="I2142:48324;2241:22370"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[24px]">Karol</p>
              </div>
              <div
                className="absolute inset-[-1px] z-[1]"
                data-node-id="I2142:48324;2444:23862"
                data-name="Focus ring">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
              </div>
            </div>
          </div>
          <div
            className="content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex flex-col isolate items-start relative rounded-[2px] shrink-0 w-[320px]"
            data-node-id="2142:48326"
            data-name="sl-text_input-theme [DEPRECATED]">
            <div
              className="content-stretch flex items-start relative shrink-0 w-full z-[3]"
              data-node-id="2142:48327"
              data-name="sl-label-theme [DEPRECATED]">
              <div
                className="content-stretch flex flex-[1_0_0] gap-[4px] items-start min-w-px pb-[8px] relative"
                data-node-id="I2142:48327;2711:11259"
                data-name="sl-base-label-sm">
                <div
                  className="content-stretch flex gap-[2px] items-center relative shrink-0"
                  data-node-id="I2142:48327;2711:11259;1222:5054"
                  data-name="label-container">
                  <div
                    className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                    data-node-id="I2142:48327;2711:11259;1215:5039"
                    style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[16px]">Last name</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="bg-white border border-[#9d9f9f] border-solid content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex gap-[8px] isolate items-center justify-center px-[16px] py-[8px] relative rounded-[4px] shrink-0 w-full z-[2]"
              data-node-id="2142:48328"
              data-name="sl_base-text_input">
              <div
                className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] min-w-px relative text-[#323232] text-[16px] z-[4]"
                data-node-id="2142:48329"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[24px]">Woźniak</p>
              </div>
              <div
                className="absolute inset-[-1px] z-[1]"
                data-node-id="2142:48332"
                data-name="Focus ring">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex flex-col h-[64px] isolate items-start relative shrink-0"
            data-node-id="2142:48334"
            data-name="sl-select">
            <div
              className="content-stretch flex items-start relative shrink-0 w-[34px] z-[2]"
              data-node-id="2142:48335"
              data-name="sl-label-theme">
              <div
                className="content-stretch flex flex-[1_0_0] gap-[4px] items-start min-w-px pb-[8px] relative"
                data-node-id="I2142:48335;2711:11259"
                data-name="label">
                <div
                  className="content-stretch flex gap-[2px] items-center relative shrink-0"
                  data-node-id="I2142:48335;2711:11259;1222:5054"
                  data-name="label-container">
                  <div
                    className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                    data-node-id="I2142:48335;2711:11259;1215:5039"
                    style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[16px]">Grade level</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative z-[1]"
              data-node-id="2142:48336"
              data-name="dropdown+helper">
              <div
                className="content-stretch flex flex-col gap-[4px] h-[40px] isolate items-start relative shrink-0 w-[320px]"
                data-node-id="2142:48337"
                data-name="✏️ dropdown">
                <div
                  className="flex-[1_0_0] min-h-px relative w-full z-[2]"
                  data-node-id="2142:48338"
                  data-name="01">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
                    <div
                      className="content-stretch flex flex-[1_0_0] items-start min-h-px relative w-full"
                      data-node-id="2142:48339"
                      data-name="sl_base-selecetbox-bg">
                      <div
                        className="content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex h-full isolate items-center justify-center relative rounded-[2px] shrink-0 w-[320px]"
                        data-node-id="2142:48340"
                        data-name="sl-selectbox-theme">
                        <div
                          className="bg-white border border-[#9d9f9f] border-solid content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex gap-[8px] h-full isolate items-center px-[16px] py-[8px] relative rounded-[4px] shrink-0 w-[320px] z-[1]"
                          data-node-id="2142:48341"
                          data-name="sl-base-selectbox">
                          <div
                            className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] min-w-px relative text-[#323232] text-[14px] z-[5]"
                            data-node-id="2142:48342"
                            style={{ fontVariationSettings: '"wdth" 100' }}>
                            <p className="leading-[20px]">3</p>
                          </div>
                          <div
                            className="relative shrink-0 size-[16px] z-[2]"
                            data-node-id="2142:48345"
                            data-name="select-box-down">
                            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                              <ChevronDown className="flex-[1_0_0] h-full min-w-px relative" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] left-[12px] text-[#5d5d5d] text-[16px] top-1/2 whitespace-nowrap"
                      data-node-id="2142:48347"
                      style={{ fontVariationSettings: '"wdth" 100' }}>
                      <p className="leading-[24px]">​</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[68px]"
            data-node-id="2142:48455"
            data-name="sl-radio_group-theme">
            <div
              className="content-stretch flex items-start relative shrink-0 w-full"
              data-node-id="I2142:48455;2711:10634"
              data-name="sl-label-theme">
              <div
                className="content-stretch flex flex-[1_0_0] gap-[4px] items-start min-w-px pb-[8px] relative"
                data-node-id="I2142:48455;2711:10634;2711:11259"
                data-name="sl-base-label-sm">
                <div
                  className="content-stretch flex gap-[2px] items-center relative shrink-0"
                  data-node-id="I2142:48455;2711:10634;2711:11259;1222:5054"
                  data-name="label-container">
                  <div
                    className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                    data-node-id="I2142:48455;2711:10634;2711:11259;1215:5039"
                    style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[16px]">Login type</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full"
              data-node-id="I2142:48455;2711:10635"
              data-name="container">
              <div
                className="content-stretch flex items-start relative shrink-0 w-full"
                data-node-id="I2142:48455;2711:10636"
                data-name="sl-radio-1">
                <div
                  className="content-stretch flex flex-[1_0_0] items-start min-w-px relative"
                  data-node-id="I2142:48455;2711:10636;2711:12440"
                  data-name="sl-radio-theme">
                  <div
                    className="content-stretch flex gap-[8px] items-center py-[4px] relative shrink-0"
                    data-node-id="I2142:48455;2711:10636;2711:12440;2711:12537"
                    data-name="sl-base-radio">
                    <div
                      className="bg-white border-2 border-[#5d5d5d] border-solid content-stretch flex flex-col items-center justify-center overflow-clip p-[8px] relative rounded-[800px] shrink-0 size-[24px]"
                      data-node-id="I2142:48455;2711:10636;2711:12440;2711:12537;240:40"
                      data-name="radio-box">
                      <div
                        className="content-stretch flex items-center justify-center relative shrink-0 size-[12px]"
                        data-node-id="I2142:48455;2711:10636;2711:12440;2711:12537;324:80"
                        data-name="core-icon">
                        <div
                          className="flex-[1_0_0] h-full min-w-px relative"
                          data-node-id="I2142:48455;2711:10636;2711:12440;2711:12537;324:80;399:65"
                          data-name="svg-circle"
                        />
                      </div>
                    </div>
                    <p
                      className="[word-break:break-word] font-['Open_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                      data-node-id="I2142:48455;2711:10636;2711:12440;2711:12537;240:42"
                      style={{ fontVariationSettings: '"wdth" 100' }}>
                      Easy login (simple username, password and QR code)
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="content-stretch flex items-start relative shrink-0 w-full"
                data-node-id="I2142:48455;2711:10637"
                data-name="sl-radio-2">
                <div
                  className="content-stretch flex flex-[1_0_0] items-start min-w-px relative"
                  data-node-id="I2142:48455;2711:10637;2711:12440"
                  data-name="sl-radio-theme">
                  <div
                    className="content-stretch flex gap-[8px] items-center py-[4px] relative shrink-0"
                    data-node-id="I2142:48455;2711:10637;2711:12440;2711:12507"
                    data-name="sl-base-radio">
                    <div
                      className="bg-white border-2 border-[#5d5d5d] border-solid content-stretch flex flex-col items-center justify-center overflow-clip p-[8px] relative rounded-[800px] shrink-0 size-[24px]"
                      data-node-id="I2142:48455;2711:10637;2711:12440;2711:12507;240:40"
                      data-name="radio-box"
                    />
                    <p
                      className="[word-break:break-word] font-['Open_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                      data-node-id="I2142:48455;2711:10637;2711:12440;2711:12507;240:42"
                      style={{ fontVariationSettings: '"wdth" 100' }}>
                      Regular
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="bg-[#f6f8f8] border-[#bfbfbf] border-b border-solid content-stretch cursor-pointer flex flex-col gap-[13px] items-start overflow-clip relative shrink-0 w-full"
            data-node-id="3659:36698"
            data-name="Accordion-multiple-view">
            <div
              className="content-stretch flex flex-col items-start relative shrink-0 w-full"
              data-node-id="I3659:36698;3616:44042"
              data-name="accordion-header">
              <div
                className="content-stretch flex flex-col items-start relative shrink-0 w-[255px]"
                data-node-id="I3659:36698;3616:44042;4169:240"
                data-name="accordion-header-base">
                <div
                  className="bg-[#f6f8f8] content-stretch flex flex-col items-start py-[16px] relative shrink-0 w-full"
                  data-node-id="I3659:36698;3616:44042;4169:240;6223:9478"
                  data-name="header">
                  <div
                    className="content-stretch flex gap-[8px] items-start px-[8px] relative shrink-0 w-full"
                    data-node-id="I3659:36698;3616:44042;4169:240;6223:9479"
                    data-name="title">
                    <div
                      className="h-[28px] overflow-clip relative shrink-0 w-[24px]"
                      data-node-id="I3659:36698;3616:44042;4169:240;6223:9480"
                      data-name="icon">
                      <div
                        className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2"
                        data-node-id="I3659:36698;3616:44042;4169:240;6223:9480;5273:46106">
                        <div
                          className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#323232] h-[16px] left-1/2 rounded-[0.825px] top-1/2 w-[1.979px]"
                          data-node-id="I3659:36698;3616:44042;4169:240;6223:9480;5273:46107"
                        />
                        <div
                          className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[1.979px] items-center justify-center left-1/2 top-1/2 w-[16px]"
                          data-node-id="I3659:36698;3616:44042;4169:240;6223:9480;5273:46108">
                          <div className="flex-none rotate-90">
                            <div className="bg-[#323232] h-[16px] relative rounded-[0.825px] w-[1.979px]" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-[1_0_0] items-center min-w-px pr-[16px] relative"
                      data-node-id="I3659:36698;3616:44042;4169:240;6223:9481"
                      data-name="Icon-animation/accordion-title">
                      <div
                        className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] min-w-px relative text-[#323232] text-[18px] text-left"
                        data-node-id="I3659:36698;3616:44042;4169:240;6223:9481;5267:45993"
                        style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[28px]">Login types explained</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </button>
          <div
            className="content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex flex-col isolate items-start relative rounded-[2px] shrink-0 w-[320px]"
            data-node-id="3659:36670"
            data-name="sl-text_input-theme [DEPRECATED]">
            <div
              className="content-stretch flex items-start relative shrink-0 w-full z-[3]"
              data-node-id="I3659:36670;2711:11125"
              data-name="sl-label-theme [DEPRECATED]">
              <div
                className="content-stretch flex flex-[1_0_0] gap-[4px] items-start min-w-px pb-[8px] relative"
                data-node-id="I3659:36670;2711:11125;2711:11263"
                data-name="sl-base-label-sm">
                <div
                  className="content-stretch flex gap-[2px] items-center relative shrink-0"
                  data-node-id="I3659:36670;2711:11125;2711:11263;1222:5054"
                  data-name="label-container">
                  <div
                    className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                    data-node-id="I3659:36670;2711:11125;2711:11263;1215:5039"
                    style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[16px]">Email</p>
                  </div>
                </div>
                <div
                  className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                  data-node-id="I3659:36670;2711:11125;2711:11263;1215:5074"
                  style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[16px]">(optional)</p>
                </div>
              </div>
            </div>
            <div
              className="bg-white border border-[#9d9f9f] border-solid content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex gap-[8px] isolate items-center justify-center px-[16px] py-[8px] relative rounded-[4px] shrink-0 w-full z-[2]"
              data-node-id="I3659:36670;2711:11126"
              data-name="sl_base-text_input-lg2">
              <div
                className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] min-w-px relative text-[#323232] text-[16px] z-[3]"
                data-node-id="I3659:36670;2711:11126;2911:2320"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[24px]">Type here</p>
              </div>
              <div
                className="absolute inset-[-1px] z-[1]"
                data-node-id="I3659:36670;2711:11126;2911:2322"
                data-name="Focus ring">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
              </div>
            </div>
          </div>
          <div
            className="content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex flex-col isolate items-start relative rounded-[2px] shrink-0 w-[320px]"
            data-node-id="2142:48457"
            data-name="sl-text_input-theme [DEPRECATED]">
            <div
              className="content-stretch flex items-start relative shrink-0 w-full z-[3]"
              data-node-id="I2142:48457;2711:11125"
              data-name="sl-label-theme [DEPRECATED]">
              <div
                className="content-stretch flex flex-[1_0_0] gap-[4px] items-start min-w-px pb-[8px] relative"
                data-node-id="I2142:48457;2711:11125;2711:11259"
                data-name="sl-base-label-sm">
                <div
                  className="content-stretch flex gap-[2px] items-center relative shrink-0"
                  data-node-id="I2142:48457;2711:11125;2711:11259;1222:5054"
                  data-name="label-container">
                  <div
                    className="[word-break:break-word] flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                    data-node-id="I2142:48457;2711:11125;2711:11259;1215:5039"
                    style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[16px]">Username</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="bg-white border border-[#9d9f9f] border-solid content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex gap-[8px] isolate items-center justify-center px-[16px] py-[8px] relative rounded-[4px] shrink-0 w-full z-[2]"
              data-node-id="I2142:48457;2711:11126"
              data-name="sl_base-text_input-lg2">
              <div
                className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] min-w-px relative text-[#323232] text-[16px] z-[3]"
                data-node-id="I2142:48457;2711:11126;2911:2320"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[24px]">karol123</p>
              </div>
              <div
                className="absolute inset-[-1px] z-[1]"
                data-node-id="I2142:48457;2711:11126;2911:2322"
                data-name="Focus ring">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
              </div>
            </div>
          </div>
        </div>
        <div
          className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Open_Sans:Bold'] font-bold justify-center leading-[0] left-[336px] text-[#01766d] text-[16px] top-[621px] tracking-[0.4px] whitespace-nowrap"
          data-node-id="2142:48458"
          style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[20px]">Regenerate</p>
        </div>
      </div>
      <div
        className="content-stretch flex items-center justify-end px-[8px] relative shrink-0 w-[992px]"
        data-node-id="2142:48459">
        <div
          className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative"
          data-node-id="2142:48460">
          <div
            className="content-stretch flex items-center relative shrink-0"
            data-node-id="2142:48461">
            <div
              className="content-stretch flex gap-[16px] items-center relative shrink-0"
              data-node-id="2142:48462">
              <div
                className="content-stretch flex items-center relative shrink-0"
                data-node-id="2142:48463">
                <div
                  className="content-stretch flex items-start relative shrink-0"
                  data-node-id="2142:48464">
                  <div
                    className="bg-[#01766d] content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[8px] relative rounded-[4px] shrink-0"
                    data-node-id="2142:48465"
                    data-name="button primary">
                    <p
                      className="[word-break:break-word] font-['Open_Sans:Bold'] font-bold leading-[24px] relative shrink-0 text-[14px] text-white whitespace-nowrap"
                      data-node-id="I2142:48465;2846:104533"
                      style={{ fontVariationSettings: '"wdth" 100' }}>
                      Create new student
                    </p>
                  </div>
                </div>
              </div>
              <p
                className="[word-break:break-word] font-['Open_Sans:SemiBold'] font-semibold leading-[24px] relative shrink-0 text-[#01766d] text-[14px] whitespace-nowrap"
                data-node-id="2142:48466"
                style={{ fontVariationSettings: '"wdth" 100' }}>
                Cancel
              </p>
            </div>
          </div>
          <div
            className="content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex items-start relative shrink-0"
            data-node-id="2142:48467"
            data-name="sl-checkbox">
            <div
              className="content-stretch flex items-start relative shrink-0"
              data-node-id="2142:48468"
              data-name="sl-checkbox-theme">
              <div
                className="content-stretch flex items-start relative shrink-0 w-[64px]"
                data-node-id="2142:48469"
                data-name="sl-base-checkbox">
                <div
                  className="content-stretch flex flex-[1_0_0] items-start min-w-px relative"
                  data-node-id="I2142:48469;2711:12456"
                  data-name="sl-checkbox-theme [DEPRECATED]">
                  <div
                    className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0"
                    data-node-id="I2142:48469;2711:12456;3146:85266"
                    data-name="sl-base-checkbox">
                    <div
                      className="bg-white border-2 border-[#5d5d5d] border-solid content-stretch flex flex-col items-center justify-center overflow-clip p-[8px] relative rounded-[2px] shrink-0 size-[20px]"
                      data-node-id="I2142:48469;2711:12456;3146:85266;5293:3690"
                      data-name="checkbox-box"
                    />
                    <p
                      className="[word-break:break-word] font-['Open_Sans:Regular'] font-normal leading-[20px] relative shrink-0 text-[#323232] text-[14px] whitespace-nowrap"
                      data-node-id="I2142:48469;2711:12456;3146:85266;5293:3692"
                      style={{ fontVariationSettings: '"wdth" 100' }}>
                      Create another
                    </p>
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

> SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
>
> 1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
> 2. Convert React syntax to the target framework/library
> 3. Transform all Tailwind classes to the target styling system while preserving exact visual design
> 4. Follow the project's existing patterns and conventions
>    DO NOT install any Tailwind as a dependency unless the user instructs you to do so.
>    Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
>    These styles are contained in the design: H4: Font(family: "Open Sans", style: SemiBold, size: 18, weight: 600, lineHeight: 100, letterSpacing: 0), color/input/fieldLabel/text/default: #323232, text/input/fieldLabel/label/sm: Font(family: "Open Sans", style: Bold, size: 14, weight: 700, lineHeight: 16, letterSpacing: 0), color/input/textField/default/default/inputText: #323232, text/input/textField/text/lg: Font(family: "Open Sans", style: Regular, size: 16, weight: 400, lineHeight: 24, letterSpacing: 0), color/input/textField/default/default/background: #FFFFFF, color/input/textField/default/default/border: #9D9F9F, boxShadow/none: Effect(type: DROP_SHADOW, color: #00000000, offset: (0, 0), radius: 0, spread: 0), color/input/option/default/checked/default/icon: #FFFFFF, color/input/option/default/checked/default/background: #01766D, color/input/option/default/checked/default/border: #01766D, color/input/option/default/checked/default/label: #323232, text/input/option/md: Font(family: "Open Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0), color/input/option/default/unchecked/default/background: #FFFFFF, color/input/option/default/unchecked/default/border: #5D5D5D, color/input/option/default/unchecked/default/label: #323232, text/input/fieldLabel/tag/sm: Font(family: "Open Sans", style: Regular, size: 14, weight: 400, lineHeight: 16, letterSpacing: 0), text button: Font(family: "Open Sans", style: Bold, size: 14, weight: 700, lineHeight: 24, letterSpacing: 0).

Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

### sl-label-theme [DEPRECATED]

**Node ID:** 7:5008

⛔️ This component is deprecated. Please use the component \[Form Field\] in your projects going forward. Padding property

### sl_base-text_input-lg

**Node ID:** 7:4708

🚫 Do not edit this component. This component is used to build the text input component and not intended for independent use. ↖️ Instead, edit the top-level component.

### sl-label-theme

**Node ID:** 2:99832

Padding property

### sl-text_input-theme [DEPRECATED]

**Node ID:** 7:5182

⛔️ This component is deprecated. Please use the component \[Form Field\] in your projects going forward. ✏️ Only edit the properties below The colors of this component are fixed and you wouldn't have to edit them. You can adjust the width of the field to fit your design.

### sl_base-text_input-lg2

**Node ID:** 7:4824

🚫 Do not edit this component. This component is used to build the text input component and not intended for independent use. ↖️ Instead, edit the top-level component.

### sl-checkbox [DEPRECATED]

**Node ID:** 2:50638

⛔️ This component is deprecated. Please use the component \[Form Field\] in your projects going forward. Checkboxes allow users to choose one or more items from a list of options, providing a convenient way to make selections. They typically appear in forms.

**Documentation:**

- [https://sanomalearning.design/categories/components/checkbox/](https://sanomalearning.design/categories/components/checkbox/)

### sl-checkbox-theme [DEPRECATED]

**Node ID:** 2:50640

⛔️ This component is deprecated. Please use the component \[Form Field\] in your projects going forward.

> Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

---

_End of raw `get_design_context` captures. 7 regions, 7 successful calls, 0 errors, 0 omissions within the fetched regions._
