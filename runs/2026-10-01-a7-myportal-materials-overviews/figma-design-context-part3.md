# figma-design-context.md — Part 3: Breadcrumb (node 15878:180442)

Source node: `15878:180442` ("sl-breadcrumb")

```jsx
export default function SlBreadcrumb() {
  return (
    <div
      className="content-stretch flex gap-[16px] items-center px-[24px] relative size-full"
      data-node-id="15878:180442"
      data-name="sl-breadcrumb">
      <div
        className="content-stretch flex gap-[4px] h-[32px] items-center relative shrink-0"
        data-node-id="I15878:180442;3093:1585"
        data-name="breadcrumb-home">
        <div
          className="content-stretch flex items-center justify-center relative shrink-0 size-[14px]"
          data-node-id="I15878:180442;3093:1585;3093:1553"
          data-name="icon-core-start">
          <div
            className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]"
            data-node-id="I15878:180442;3093:1585;3093:1554"
            data-name="icon-core-start">
            <div
              className="flex-[1_0_0] h-full min-w-px relative"
              data-node-id="I15878:180442;3093:1585;3093:1554;404:33"
              data-name="icon-container">
              <div
                className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#002649] text-[14px] text-center"
                data-node-id="I15878:180442;3093:1585;3093:1554;404:33;802:2162">
                <p className="leading-[12px]">home-blank</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="content-stretch flex h-[16px] items-center max-w-[120px] relative shrink-0"
          data-node-id="I15878:180442;3093:1585;3093:1555"
          data-name="link">
          <div
            className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Proxima_Nova:Semibold'] justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[#002649] text-[14px] text-ellipsis whitespace-nowrap"
            data-node-id="I15878:180442;3093:1585;3093:1556">
            <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid leading-[16px] overflow-hidden text-ellipsis underline">
              Home
            </p>
          </div>
        </div>
      </div>
      <div
        className="content-stretch flex gap-[16px] h-[32px] items-center relative shrink-0"
        data-node-id="I15878:180442;3093:1589"
        data-name="breadcrumb-current">
        <div
          className="content-stretch flex items-center justify-center relative shrink-0 size-[12px]"
          data-node-id="I15878:180442;3093:1589;3093:1578"
          data-name="breadcrumb-icon-divider">
          <div
            className="flex-[1_0_0] h-full min-w-px relative"
            data-node-id="I15878:180442;3093:1589;3093:1578;6032:43558"
            data-name="icon-container">
            <div
              className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#8d959d] text-[13px] text-center"
              data-node-id="I15878:180442;3093:1589;3093:1578;6032:43558;802:2162">
              <p className="leading-[12px]">slash-forward</p>
            </div>
          </div>
        </div>
        <div
          className="content-stretch flex h-[16px] items-center relative shrink-0"
          data-node-id="I15878:180442;3093:1589;3093:1579"
          data-name="breadcrumb/title">
          <div
            className="[word-break:break-word] flex flex-col font-['Proxima_Nova:Regular'] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#002649] text-[14px] text-ellipsis whitespace-nowrap"
            data-node-id="I15878:180442;3093:1589;3093:1579;3093:1532">
            <p className="leading-[16px] overflow-hidden text-ellipsis">Reken Maar! 4</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Bound styles (verbatim):** foreground: #002649, href/md: Font(family: "Proxima Nova", style: Semibold, size: 14, weight: 600, lineHeight: 16, letterSpacing: 0), breadcrumb/divider: #8D959D, icon/font/icon/sm: Font(family: "Font Awesome 6 Pro", style: Regular, size: 13, weight: 400, lineHeight: 12, letterSpacing: 0), href/active/foreground: #002649, breadcrumb/current: Font(family: "Proxima Nova", style: Regular, size: 14, weight: 400, lineHeight: 16, letterSpacing: 0).

**Component descriptions (verbatim):**

## sl-breadcrumb

**Node ID:** 10913:138441

Breadcrumbs are a navigation element used to show a user's location in a digital product.
