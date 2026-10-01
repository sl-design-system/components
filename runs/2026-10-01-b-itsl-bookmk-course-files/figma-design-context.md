# get_design_context raw response — node 4886:12955 (course files)

fileKey: ya00uFyX1rjxYWF0dlOsoT

## Reference code (React + Tailwind, as emitted by the tool — NOT the implementation target)

```tsx
const assetPathPrefix = "https://www.figma.com/api/mcp/asset/50b78132-ea7c-47a9-9262-f88b2785b3fc";
const imgYourFiles = `${assetPathPrefix}/9106c.svg`;
const imgPhoto = `${assetPathPrefix}/19894.png`;
const imgGroupFalse = `${assetPathPrefix}/70bc9.svg`;
const imgItslearningLogoSymbol = `${assetPathPrefix}/347f2.svg`;
const imgMagnifyingGlass = `${assetPathPrefix}/ef8c2.svg`;
const imgBell = `${assetPathPrefix}/154ff.svg`;
const imgComment = `${assetPathPrefix}/6dcda.svg`;
const imgCircleInfo = `${assetPathPrefix}/c803f.svg`;
const imgXmark = `${assetPathPrefix}/1d1e6.svg`;
const imgArrowUpArrowDown = `${assetPathPrefix}/c9143.svg`;
const imgGraduationCap = `${assetPathPrefix}/5a964.svg`;
const imgCirclePen = `${assetPathPrefix}/c89e8.svg`;

function YourFiles({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"} data-node-id="4016:6593" data-name="your-files">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgYourFiles} />
    </div>
  );
}

type AvatarProps = {
  className?: string;
  group?: "False";
  photo?: boolean;
};

function Avatar({ className, group = "False", photo = true }: AvatarProps) {
  return (
    <div className={className || "overflow-clip relative rounded-[120px] size-[32px]"} data-node-id="4016:6538">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroupFalse} />
      {photo && (
        <div className="absolute inset-0" data-node-id="4016:6541" data-name="Photo">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPhoto} />
        </div>
      )}
    </div>
  );
}

export default function CourseFiles() {
  return (
    <div className="bg-[var(--$gray--150,#f2f2f2)] content-stretch flex flex-col items-center relative size-full" data-node-id="4886:12955" data-name="course files">
      <div className="content-stretch drop-shadow-[0px_4px_4px_rgba(0,0,0,0.05)] flex flex-col items-start relative shrink-0 w-[1280px]" data-node-id="4886:12956" data-name="Navigation">
        <div className="bg-[var(--$gray--0,white)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex h-[56px] items-center px-[var(--size\/25,4px)] relative shrink-0 w-full" data-node-id="I4886:12956;4461:5603" data-name=".Main menu">
          <div className="content-stretch flex h-full items-center px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4886:12956;4461:5603;9976:10621" data-name="Logo area">
            <div className="relative shrink-0 size-[32px]" data-node-id="I4886:12956;4461:5603;9976:10622" data-name="itslearning-logo-symbol">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgItslearningLogoSymbol} />
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px relative" data-node-id="I4886:12956;4461:5603;9976:10623" data-name="Main menu">
            <div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4886:12956;4461:5603;9976:10624" data-name=".Navigation item">
              <div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4886:12956;4461:5603;9976:10624;9976:10576">
                <p className="leading-[1.5]">Courses</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4886:12956;4461:5603;13432:5117" data-name=".Navigation item">
              <div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4886:12956;4461:5603;13432:5117;9976:10576">
                <p className="leading-[1.5]">Updates</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4886:12956;4461:5603;15220:17430" data-name=".Navigation item">
              <div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4886:12956;4461:5603;15220:17430;9976:10576">
                <p className="leading-[1.5]">Groups</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4886:12956;4461:5603;9976:10626" data-name=".Navigation item">
              <div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4886:12956;4461:5603;9976:10626;9976:10576">
                <p className="leading-[1.5]">Calendar</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4886:12956;4461:5603;9976:10627" data-name=".Navigation item">
              <div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4886:12956;4461:5603;9976:10627;9976:10576">
                <p className="leading-[1.5]">Library</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex h-full items-start justify-end pl-[var(--size\/700,24px)] relative shrink-0" data-node-id="I4886:12956;4461:5603;9976:10630" data-name="Personal menu">
            <div className="content-stretch flex h-full items-center px-[var(--size\/50,8px)] relative shrink-0" data-node-id="I4886:12956;4461:5603;11704:5608" data-name="Search wrapper">
              <div className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid content-stretch flex items-start max-w-[264px] pl-[var(--size\/100,12px)] relative rounded-[var(--border-radius,4px)] shrink-0 w-[264px]" data-node-id="I4886:12956;4461:5603;11704:5609" data-name="Search">
                <div className="content-stretch flex flex-col h-[16px] items-start px-[4px] py-[var(--size\/50,8px)] relative shrink-0 w-0" data-node-id="I4886:12956;4461:5603;11704:5609;17089:13616" data-name="Icon wrapper" />
                <div className="content-stretch flex flex-[1_0_0] items-center min-w-px pr-[var(--size\/25,4px)] py-[var(--size\/50,8px)] relative" data-node-id="I4886:12956;4461:5603;11704:5609;13211:9102" data-name="Text wrapper">
                  <p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--600,#757575)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4886:12956;4461:5603;11704:5609;13157:8017">
                    Search
                  </p>
                </div>
                <div className="content-stretch flex items-start relative shrink-0" data-node-id="I4886:12956;4461:5603;11704:5609;13157:8020" data-name="Actions">
                  <div className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-br-[var(--border-radius,4px)] rounded-tr-[var(--border-radius,4px)] shrink-0" data-node-id="I4886:12956;4461:5603;11704:5609;13157:8022" data-name="search">
                    <div className="relative shrink-0 size-[24px]" data-node-id="I4886:12956;4461:5603;11704:5609;13157:8022;1902:2742" data-name="Icon placeholder">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMagnifyingGlass} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex h-full items-center p-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4886:12956;4461:5603;9976:10631" data-name=".Navigation item">
              <div className="relative shrink-0 size-[24px]" data-node-id="I4886:12956;4461:5603;9976:10631;9976:10604" data-name="circle-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBell} />
              </div>
            </div>
            <div className="content-stretch flex h-full items-center p-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4886:12956;4461:5603;9976:10635" data-name="IM">
              <div className="relative shrink-0 size-[24px]" data-node-id="I4886:12956;4461:5603;9976:10635;9976:10604" data-name="circle-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComment} />
              </div>
            </div>
            <div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center p-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4886:12956;4461:5603;9976:10636" data-name="User menu">
              <Avatar className="overflow-clip relative rounded-[120px] shrink-0 size-[32px]" />
            </div>
          </div>
        </div>
        <div className="border-[var(--gray\/300,#e1e1e1)] border-b border-solid content-stretch flex h-[56px] items-center px-[var(--size\/25,4px)] relative shrink-0 w-full" data-node-id="I4886:12956;4461:5604" data-name=".Secondary menu">
          <div aria-hidden className="absolute bg-[var(--$gray--50,#f9f9f9)] inset-0 pointer-events-none" />
          <div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/50,8px)] relative shrink-0" data-node-id="I4886:12956;4461:5605" data-name="Course">
            <YourFiles className="relative shrink-0 size-[32px]" />
            <p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/400,18px)] whitespace-nowrap" data-node-id="I4886:12956;4461:5607">
              Files
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px relative" data-node-id="I4886:12956;4461:5608" data-name="Main menu">
            <div className="content-stretch flex gap-[var(--size\/size--50,8px)] h-full items-center px-[var(--size\/size--300,16px)] py-[var(--size\/size--100,12px)] relative shrink-0" data-node-id="I4886:12956;4461:5609" data-name=".Navigation item">
              <div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--gray\/900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4886:12956;4461:5609;9976:10576">
                <p className="leading-[1.5]">Your files</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[var(--size\/size--50,8px)] h-full items-center px-[var(--size\/size--300,16px)] py-[var(--size\/size--100,12px)] relative shrink-0" data-node-id="I4886:12956;4461:5610" data-name=".Navigation item">
              <div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--gray\/900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4886:12956;4461:5610;9976:10576">
                <p className="leading-[1.5]">{`Save course materials `}</p>
              </div>
              <div className="absolute bg-[var(--gray\/700,#565656)] bottom-0 h-[4px] left-[16px] right-[16px] rounded-tl-[8px] rounded-tr-[8px]" data-node-id="I4886:12956;4461:5610;9976:10581" data-name="Highlight" />
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_4px_8px_0px_rgba(0,0,0,0.05)]" />
        </div>
      </div>
      <div className="content-stretch flex items-start justify-center relative shrink-0 w-full" data-node-id="4886:12957" data-name="main-wrapper">
        <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-w-px pb-[56px] px-[var(--ca-horisontal-margin,48px)] relative" data-node-id="4886:12958" data-name="content-area-wrapper">
          <div className="content-stretch flex flex-col items-center max-w-[1280px] pb-[var(--size\/500,20px)] relative shrink-0 w-full" data-node-id="4886:12959" data-name="content-area">
            <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-node-id="4886:12960" data-name="PageHeader">
              <div className="content-stretch flex flex-col gap-[var(--size\/25,4px)] items-start py-[var(--size\/500,20px)] relative shrink-0 w-full" data-node-id="I4886:12960;5889:6338" data-name="Title and subtitle">
                <div className="content-start flex flex-wrap gap-[var(--size\/100,12px)] items-start relative shrink-0 w-full" data-node-id="I4886:12960;5419:6693" data-name="Group wrapper">
                  <div className="content-stretch flex flex-[1_0_0] flex-col gap-[var(--size\/25,4px)] items-start min-w-[200px] pr-[var(--size\/500,20px)] relative" data-node-id="I4886:12960;6438:6285" data-name="Content">
                    <div className="content-center flex flex-wrap gap-[var(--size\/100,12px)] items-center relative shrink-0 w-full" data-node-id="I4886:12960;11648:5210" data-name="Title wrapper">
                      <p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] max-w-[800px] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/800,26px)] whitespace-nowrap" data-node-id="I4886:12960;5419:6694">{`Save course materials `}</p>
                    </div>
                  </div>
                  <div className="content-center flex flex-wrap gap-[12px] items-center relative shrink-0 size-[40px]" data-node-id="I4886:12960;23120:8171" data-name="Actions slot" />
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[var(--ca-cards-gap,20px)] items-start relative shrink-0 w-full" data-node-id="4886:12961" data-name="cards">
              <div className="bg-[var(--$gray--0,white)] border border-[var(--$gray--300,#e1e1e1)] border-solid content-stretch flex flex-col gap-[var(--size\/500,20px)] items-start px-[var(--content-block\/content-block-horisontal-padding,32px)] py-[var(--content-block\/content-block-vertical-padding,20px)] relative rounded-[4px] shrink-0 w-full" data-node-id="4886:12962" data-name="Content-block">
                <div className="bg-[var(--$blue--100,#ecf8ff)] content-stretch flex items-start pl-[var(--size\/100,12px)] relative shrink-0 w-full" data-node-id="4886:12963" data-name="Banner">
                  <div className="content-stretch flex items-start pt-[10px] relative shrink-0" data-node-id="I4886:12963;3841:6676" data-name="Icon wrapper">
                    <div className="relative shrink-0 size-[24px]" data-node-id="I4886:12963;23112:4891" data-name="circle-info">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCircleInfo} />
                    </div>
                  </div>
                  <div className="content-stretch flex flex-[1_0_0] flex-col gap-[var(--size\/100,12px)] items-start min-w-px pl-[var(--size\/50,8px)] pr-[var(--size\/100,12px)] py-[var(--size\/100,12px)] relative" data-node-id="I4886:12963;2504:3039" data-name="Text wrapper">
                    <p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/200,14px)] w-full" data-node-id="I4886:12963;0:26488">
                      This section contains all the course files you've created or uploaded. Select a course to access its files
                    </p>
                  </div>
                  <div className="content-stretch flex items-center pr-[var(--size\/10,2px)] py-[var(--size\/10,2px)] relative shrink-0" data-node-id="I4886:12963;3841:6883" data-name="Button wrapper">
                    <div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4886:12963;17344:7058" data-name="Button">
                      <div className="relative shrink-0 size-[24px]" data-node-id="I4886:12963;17344:7058;1902:2850" data-name="Icon placeholder">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgXmark} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-[1120px]" data-node-id="4886:12965" data-name="table">
                  <!-- 6 row instances (1 header "courses" @4886:12966, 5 body "courses" @4886:12968/12969/12971/12972(hidden)/12973) each with Cell instances for Course/Status/Teacher/Last updated columns — full markup preserved in tool output, truncated here for brevity, identical structure per row with text: Math 2c / Archived|Deleted / Floyd Miles and 2 more / 05/04/2024 -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Tool notes (verbatim)

> SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
>
> 1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
> 2. Convert React syntax to the target framework/library
> 3. Transform all Tailwind classes to the target styling system while preserving exact visual design
> 4. Follow the project's existing patterns and conventions
>    DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

> Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.

## Styles contained in the design

Body large: Font(family: "default-font", style: Regular, size: Size/300, weight: 400, lineHeight: 1.5, letterSpacing: 0), Base: Font(family: "default-font", style: regular, size: Size/300, weight: 400, lineHeight: 1.5, letterSpacing: 0), Title M: Font(family: "default-font", style: bold, size: Size/400, weight: 700, lineHeight: 1.5, letterSpacing: 0), Gray/900: #333333, Gray/700: #565656, Gray/300: #E1E1E1, layer-shadow: Effect(type: DROP_SHADOW, color: #0000000D, offset: (0, 4), radius: 8, spread: 0), Title XL: Font(family: "default-font", style: bold, size: Size/800, weight: 700, lineHeight: 1.5, letterSpacing: 0), Base small: Font(family: "default-font", style: regular, size: Size/200, weight: 400, lineHeight: 1.5, letterSpacing: 0), Base small strong: Font(family: "default-font", style: bold, size: Size/200, weight: 700, lineHeight: 1.5, letterSpacing: 0), Links/Base primary link: Font(family: "default-font", style: bold, size: Size/300, weight: 700, lineHeight: 1.5, letterSpacing: 0).

## Component descriptions (verbatim, from Figma component documentation)

### Navigation — Node ID: 4016:6647

Menu
Documentation: https://styleguide.itsbuild.net/assets/patterns/MainMenu/v1/

### Search — Node ID: 4016:5924

Usage: This Figma component represents 2 components in Prometheus: SearchInput and GlobalSearch.
Global=false (searchinput) can be used on each page where we have search as you type, and it doesn't require confirmation from user; can be combined with filters.
Global=true (Globalesearch) can be used in navigation and search result page. Used when we require confirmation from user to start the searching mechanism.
Auto-complete: For SearchInput only. The text field can be combined with auto-complete functionality.
Keywords: search, global, input
Documentation: https://styleguide.itsbuild.net/assets/inputs/SearchInput/v1/

### Button — Node ID: 4016:5507

Usage: Large is default size; small can be used when large is too big. Button width depends on its label. Button can't lead to another page — use link instead. Truncate button's label if it doesn't fit; label should never wrap.
Loading: button can be in loading state, text hidden and spinner shown, maintain original width.
Row of actions: distance defined by variable actions-gap; behaviour handled by ButtonGroup component (no Figma analogue, simple auto-layout row).
Documentation: https://styleguide.itsbuild.net/assets/inputs/Button/v1/

### magnifying-glass — Node ID: 2275:4351

search

### bell — Node ID: 4016:6527

bell, notification

### comment — Node ID: 4016:6535

Not in Semiotic comment, messages

### Avatar — Node ID: 4016:6537

Usage: predefined sizes only — 100:24x24(size--700), 200:32x32(size--900), 300:48x48(size--1100), 400:64x64(size--1200), 500:80x80(size--1300), 600:96x96(size--1400). Contact UX team for other sizes.
Keywords: User, person, userpic
Documentation: https://styleguide.itsbuild.net/assets/nodes/Avatar/v1/

### Editable=False — Node ID: 4680:12985

Usage: This component represents 2 components in Prometheus: PageHeader and PageHeaderEditable. Optional like can concatenate several text lines divided by bullet symbol (accessible solution exists, reusable). Editable option in Figma needs tweaks when title is long or screen is narrow.
Documentation: https://styleguide.itsbuild.net/assets/patterns/PageHeader/v1/

### PageHeader — Node ID: 4680:12984

(same usage text as above — represents PageHeader / PageHeaderEditable; Subtitle concatenates lines divided by bullet; don't use line break/complex structure in subtitle)
Documentation: https://styleguide.itsbuild.net/assets/patterns/PageHeader/v1/

### Banner — Node ID: 4676:9879

Usage: Banners shown inside Banner Area component. Usually at top of page/section, full width of container. Put close to relevant content. Should be dismissible unless critical/important step required. Don't use as only way to access regular info/action. Help banners can be displayed near related items (e.g. mid-form).
Content: container that can technically contain anything incl. buttons/links/images; accessibility concern — interactive controls in non-persistent banners don't receive focus automatically.
Writing: UX writing guidelines link (Confluence, internal — not fetched).
Keywords: alert, feedback, message
Documentation: https://styleguide.itsbuild.net/assets/feedback/Banner/v1/

### Button — Node ID: 4675:10050

(same Button usage text as above)
Documentation: https://styleguide.itsbuild.net/assets/inputs/Button/v1/

### xmark — Node ID: 4571:11998

close, remove

### Property 1=Active — Node ID: 4686:11999 (table row template)

Usage: This is a template component — detach before using as starting point for mockups (styles live at Cell level, so table style changes propagate). Once detached, make a new local component. Adjust number of columns; change content type to predefined ones or new. Recommended to rename text cell to column name. Put instances of local row component into List template; row takes full available width. To create header row, select all cells in 1st row instance and toggle "Header" parameter.
Keywords: Template, blueprint

### Cell — Node ID: 4978:10912

How to use: use cell component to build row and tables; icon cell needs a visible label next to it; action cell always shows 1 button, if more than 1 action use icon-only with ellipsis icon, show actions in dropdown.
Sort: to show sorting changes, change icon to increase/decrease sorting and background of cell to Brand/100.
Figma file (sort/table template source): https://www.figma.com/design/8gsaOc6G4f4GcpxOryCcKR/Filter-Area-%2B-Table-template?node-id=4366-19238
Deprecated: switch cell (should be under action dropdown), input cell, multiple action cell.
Documentation: https://styleguide.itsbuild.net/assets/lists/Cell/v1/

### Property 1=Inactive — Node ID: 4686:12006 (same as Property 1=Active template text)

### Cell — Node ID: 2295:5708 (duplicate documentation entry, identical to 4978:10912)

### Course-hat — Node ID: 2275:4959

Keywords: Avatar
Documentation: https://styleguide.itsbuild.net/docs/styles/blocks/

### graduation-cap — Node ID: 2275:4957

course

### Status — Node ID: 2295:4983

Usage: Component used to show a state of some object/process. Can be used without icon. The status cannot be interactive. Colours of statuses shouldn't be changed; consult UX team for a new colour.
Accessibility: Don't truncate the label — show in multiple lines if long. When zoomed >200%, show status tag without icon.
Keywords: status, tag, label

## Images/assets note (verbatim)

Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## Screenshot

Rendered screenshot matches: itslearning "Files" app, "Save course materials" tab active, blue info banner, 4-column course table (Course/Status/Teacher/Last updated) with 4 visible rows (Math 2c, Archived/Deleted statuses, "Floyd Miles and 2 more", 05/04/2024). See cached `screenshot.png` in this run folder.

---

## Supplement — table subtree (node `4886:12965`), recovered by the orchestrator

**Why this section exists:** the analyst wrote the top-node `get_design_context` output into this
file but replaced the entire table subtree with a one-line `<!-- … truncated here for brevity -->`
comment. The file is meant to be the verbatim raw tool output kept for reproducibility, so the
elision destroyed the only per-cell geometry in the run. The orchestrator re-called
`get_design_context` on `4886:12965` and distilled the result below. **Finding for the batch: the
analyst summarised a "raw output" artifact.**

### Table (`4886:12965`) — flex column, width 1120px, no gap, no own background

Every row (`courses`) is: `background #ffffff` (`--sl-color-white`), `border-bottom: 1px solid
#e1e1e1` (`--sl-color-palette-grey-300`), `overflow: clip`, `display:flex`, `align-items:
flex-start`, full width. **4 cells per row, each `flex: 1 0 0; min-width: 0`** — so the four
columns are equal width (280px each at 1120px).

### Header row (`4886:12966`), min-height 32px

- Every cell: `background #f9f9f9` (`--sl-color-palette-grey-050`), `padding-inline: 8px`
  (`--sl-size-100`), `align-self: stretch`, `min-height: 32px`.
- Label wrapper: `padding-block: 5px`, centred. Label text: **Lato Bold 14px / 1.5**, colour
  `#333333` (`--sl-color-palette-grey-900`). Figma style "Base small strong" (weight **700**).
- Labels, in order: `Course`, `Status`, `Teacher`, `Last updated`.
- **Only the Teacher and Last-updated cells** carry a sort Button: `min-height 32px`,
  `min-width 32px`, `padding 4px` (`--sl-size-050`), `gap 4px`, `border-radius 4px`
  (`--sl-size-borderRadius-md`), containing a **20×20** `arrow-up-arrow-down` icon.
  Theme equivalent: `<sl-icon name="sort" size="md">` — see Icon Gaps.

### Body rows (`4886:12968`, `12969`, `12971`, `12973` — and `12972`, which is **hidden**)

Cell padding for all four body cells: `padding-inline: 8px` (`--sl-size-100`),
`padding-block: 12px` (`--sl-size-150`), `align-self: stretch`.

1. **Course cell** — `gap: 8px`. Contains:
   - "Course-hat": a **24×24** circle, `border-radius: 120px` (i.e. fully round →
     `--sl-size-borderRadius-full`), background `#d9e3e8` (Figma `$pigeongrey--100`, **genuinely
     unbound — no token anywhere in the repo**), holding a `graduation-cap` glyph inset 18.75%
     (→ 15×15 within the 24px circle). **`graduation-cap` is not registered in the itslearning
     theme.**
   - Course-name link: **Lato Bold 16px / 1.5, underlined**, colour `#00458f`
     (`--sl-color-palette-blue-700`), `flex: 1 0 0`. Figma style "Links/Base primary link"
     (weight **700**). Text: `Math 2c`.
2. **Status cell** — `gap: 4px`. Contains one "Status" chip:
   `background #f4f4f4` (`--sl-color-palette-grey-100`), `border: 1px solid #cfcfcf`
   (`--sl-color-palette-grey-400`), `border-radius: 12px`, `min-height: 24px`,
   `padding-inline: 8px` (`--sl-size-100`), `gap: 2px` (`--sl-size-025`), `align-items: flex-start`.
   - Icon wrapper is **12px wide × 20px tall** with a **16×16** `circle-pen` glyph positioned
     `left: -4px; top: 4px` — i.e. the icon deliberately overhangs its wrapper to the left.
     **`circle-pen` is not registered in the itslearning theme.**
   - Label wrapper: `padding-top: 1px` (`--sl-size-010`), `padding-bottom: 2px`
     (`--sl-size-025`). Label: **Lato Regular 14px / 1.5**, colour `#333333`.
   - Row values, top to bottom: `Archived`, `Deleted`, `Deleted`, `Archived`.
3. **Teacher cell** — text **Lato Regular 16px / 1.5**, `#333333`, `flex: 1 0 0`.
   Value in every row: `Floyd Miles and 2 more`.
4. **Last updated cell** — same type as Teacher. Value in every row: `05/04/2024`.

### Figma component documentation attached to this subtree (verbatim excerpts)

- **Status** (`2295:4983`): "Component used to show a state of some object, process etc. Can be
  used without any icon. **The status cannot be interactive.** Colours of statuses shouldn't be
  changed." Accessibility: "Don't truncate the label. If it is long, show it in multiple lines."
  Keywords: status, tag, label.
- **Cell** (`2295:5708` / `4978:10912`): "use cell component to build row and tables"; "icon cell
  needs to have a visible label next to it"; sorting is shown by changing the icon _and_ the
  cell background to Brand/100.
- **Course-hat** (`2275:4959`): Keywords: **Avatar**. **graduation-cap** (`2275:4957`): "course".
- **Button** (`4675:10050`): "The button can't lead to another page — use the link instead."
  (Relevant: the course name is a link, not a button.)
- Row template (`4686:11999` Active / `4686:12006` Inactive): explicitly a _template_ component
  meant to be detached — i.e. there is no single shared "row" component in the library, which is
  why no Code Connect mapping exists for it.

### Remaining page geometry (from the top-node context, for completeness)

- Page root: `background #f2f2f2` (`--sl-color-palette-grey-150`), column flex, centred.
- `.Main menu` bar: height **56px**, `background #ffffff`, `border-bottom: 1px solid #e1e1e1`,
  `padding-inline: 4px` (`--sl-size-050`). Logo area: `padding-inline 8px`, `padding-block 12px`,
  32×32 logo. Nav items: `padding-inline 16px` (`--sl-size-200`), `padding-block 12px`,
  `gap 8px`, label **Lato Regular 16px/1.5** `#333333`.
- `.Secondary menu` bar: height **56px**, `background #f9f9f9`, `border-bottom: 1px solid #e1e1e1`,
  `padding-inline: 4px`, plus `box-shadow: inset 0 4px 8px 0 rgba(0,0,0,0.05)`.
  "Course" group: `gap 8px`, `padding-inline 8px`, a 32×32 `your-files` app icon, and the label
  **Lato Bold 18px/1.5** `#333333`. Two `.Navigation item`s ("Your files", "Save course
  materials "), same metrics as the main-menu items. The **active** item carries a "Highlight"
  bar: `position:absolute; bottom:0; left:16px; right:16px; height:4px; background #565656`
  (`--sl-color-palette-grey-700`), `border-radius: 8px 8px 0 0`.
- `content-area-wrapper`: `padding-inline: 48px` (`--sl-size-600`, Figma `ca-horisontal-margin`),
  `padding-bottom: 56px`.
- `content-area`: `max-width 1280px`, `padding-bottom: 20px` (`--sl-size-250`).
- `PageHeader` → "Title and subtitle": `padding-block: 20px` (`--sl-size-250`), `gap 4px`;
  title **Lato Bold 26px / 1.5** `#333333`, `max-width 800px`. Text: `Save course materials `
  (note the trailing space in the Figma string). An empty 40×40 "Actions slot" sits to its right.
- `cards`: column, `gap 20px` (Figma `ca-cards-gap`).
- `Content-block` (the card): `background #ffffff`, `border: 1px solid #e1e1e1`,
  `border-radius: 4px`, `padding-inline: 32px` (`--sl-size-400`), `padding-block: 20px`
  (`--sl-size-250`), `gap: 20px`.
- `Banner` (`4886:12963`): `background #ecf8ff` (`--sl-color-palette-blue-050`),
  `padding-left: 12px` (`--sl-size-150`), full width, `align-items: flex-start`. Icon wrapper
  `padding-top: 10px` holding a **24×24** `circle-info` (theme name: `info`). Text wrapper
  `padding-left 8px`, `padding-right 12px`, `padding-block 12px`, text **Lato Regular 14px/1.5**
  `#333333`: "This section contains all the course files you've created or uploaded. Select a
  course to access its files". Dismiss button wrapper `padding-right 2px`, `padding-block 2px`;
  the button is `padding 8px`, `border-radius 4px`, holding a **24×24** `xmark`.
  **Note: the Banner has no rounded corners and no border in the design.**
