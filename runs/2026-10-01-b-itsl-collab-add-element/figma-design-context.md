# get_design_context raw output — nodeId 5006:43051 (Q3gzx1pCseyKnFNDUOOjCw)

## Reference code (React + Tailwind, as emitted by the tool — needs full conversion to Lit + itslearning theme tokens)

```tsx
const assetPathPrefix = 'https://www.figma.com/api/mcp/asset/b502a72f-754f-4ca5-8624-9ea2fd85691a';
const imgPhoto = `${assetPathPrefix}/19894.png`;
const imgGroupFalse = `${assetPathPrefix}/70bc9.svg`;
const imgItslearningLogoSymbol = `${assetPathPrefix}/efe3e.svg`;
const imgMagnifyingGlass = `${assetPathPrefix}/908b0.svg`;
const imgBell = `${assetPathPrefix}/15a55.svg`;
const imgComment = `${assetPathPrefix}/181c8.svg`;
const imgGraduationCap = `${assetPathPrefix}/30415.svg`;
const imgEllipsis = `${assetPathPrefix}/71cde.svg`;
const imgChevronRight = `${assetPathPrefix}/e0a99.svg`;
const imgFileImport = `${assetPathPrefix}/fc10c.svg`;
const imgXlsx = `${assetPathPrefix}/179fc.svg`;
const imgPptx = `${assetPathPrefix}/ed7d5.svg`;
const imgDocx = `${assetPathPrefix}/2df2d.svg`;
const imgPage = `${assetPathPrefix}/ca170.svg`;

type AvatarProps = {
  className?: string;
  group?: 'False';
  photo?: boolean;
};

function Avatar({ className, group = 'False', photo = true }: AvatarProps) {
  return (
    <div
      className={className || 'overflow-clip relative rounded-[120px] size-[32px]'}
      data-node-id="2275:4904">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroupFalse} />
      {photo && (
        <div className="absolute inset-0" data-node-id="2275:4908" data-name="Photo">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={imgPhoto}
          />
        </div>
      )}
    </div>
  );
}

export default function AddElement3rdImplementation() {
  return (
    <div
      className="bg-[var(--$gray--150,#f2f2f2)] content-stretch flex flex-col items-center relative size-full"
      data-node-id="5006:43051"
      data-name="Add element [3rd implementation]">
      <div
        className="content-stretch drop-shadow-[0px_4px_4px_rgba(0,0,0,0.05)] flex flex-col items-start relative shrink-0 w-full"
        data-node-id="5006:43052"
        data-name="Navigation">
        <div
          className="bg-[var(--$gray--0,white)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex h-[56px] items-center px-[var(--size\/25,4px)] relative shrink-0 w-full"
          data-node-id="I5006:43052;9976:10654"
          data-name=".Main menu">
          <div
            className="content-stretch flex h-full items-center px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative shrink-0"
            data-node-id="I5006:43052;9976:10654;9976:10621"
            data-name="Logo area">
            <div
              className="relative shrink-0 size-[32px]"
              data-node-id="I5006:43052;9976:10654;9976:10622"
              data-name="itslearning-logo-symbol">
              <img
                alt=""
                className="absolute block inset-0 max-w-none size-full"
                src={imgItslearningLogoSymbol}
              />
            </div>
          </div>
          <div
            className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px relative"
            data-node-id="I5006:43052;9976:10654;9976:10623"
            data-name="Main menu">
            <div
              className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10654;9976:10624"
              data-name=".Navigation item">
              <div
                className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap"
                data-node-id="I5006:43052;9976:10654;9976:10624;9976:10576">
                <p className="leading-[1.5]">Courses</p>
              </div>
            </div>
            <div
              className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10654;13432:5117"
              data-name=".Navigation item">
              <div
                className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap"
                data-node-id="I5006:43052;9976:10654;13432:5117;9976:10576">
                <p className="leading-[1.5]">Updates</p>
              </div>
            </div>
            <div
              className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10654;15220:17430"
              data-name=".Navigation item">
              <div
                className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap"
                data-node-id="I5006:43052;9976:10654;15220:17430;9976:10576">
                <p className="leading-[1.5]">Groups</p>
              </div>
            </div>
            <div
              className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10654;9976:10626"
              data-name=".Navigation item">
              <div
                className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap"
                data-node-id="I5006:43052;9976:10654;9976:10626;9976:10576">
                <p className="leading-[1.5]">Calendar</p>
              </div>
            </div>
            <div
              className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10654;9976:10627"
              data-name=".Navigation item">
              <div
                className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap"
                data-node-id="I5006:43052;9976:10654;9976:10627;9976:10576">
                <p className="leading-[1.5]">Library</p>
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex h-full items-start justify-end pl-[var(--size\/700,24px)] relative shrink-0"
            data-node-id="I5006:43052;9976:10654;9976:10630"
            data-name="Personal menu">
            <div
              className="content-stretch flex h-full items-center px-[var(--size\/50,8px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10654;11704:5608"
              data-name="Search wrapper">
              <div
                className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid content-stretch flex items-start max-w-[264px] pl-[var(--size\/100,12px)] relative rounded-[var(--border-radius,4px)] shrink-0 w-[264px]"
                data-node-id="I5006:43052;9976:10654;11704:5609"
                data-name="Search">
                <div
                  className="content-stretch flex flex-col h-[16px] items-start px-[4px] py-[var(--size\/50,8px)] relative shrink-0 w-0"
                  data-node-id="I5006:43052;9976:10654;11704:5609;17089:13616"
                  data-name="Icon wrapper"
                />
                <div
                  className="content-stretch flex flex-[1_0_0] items-center min-w-px pr-[var(--size\/25,4px)] py-[var(--size\/50,8px)] relative"
                  data-node-id="I5006:43052;9976:10654;11704:5609;13211:9102"
                  data-name="Text wrapper">
                  <p
                    className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--600,#757575)] text-[length:var(--size\/300,16px)] whitespace-nowrap"
                    data-node-id="I5006:43052;9976:10654;11704:5609;13157:8017">
                    Search
                  </p>
                </div>
                <div
                  className="content-stretch flex items-start relative shrink-0"
                  data-node-id="I5006:43052;9976:10654;11704:5609;13157:8020"
                  data-name="Actions">
                  <div
                    className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-br-[var(--border-radius,4px)] rounded-tr-[var(--border-radius,4px)] shrink-0"
                    data-node-id="I5006:43052;9976:10654;11704:5609;13157:8022"
                    data-name="search">
                    <div
                      className="relative shrink-0 size-[24px]"
                      data-node-id="I5006:43052;9976:10654;11704:5609;13157:8022;1902:2742"
                      data-name="Icon placeholder">
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgMagnifyingGlass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex h-full items-center p-[var(--size\/100,12px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10654;9976:10631"
              data-name=".Navigation item">
              <div
                className="relative shrink-0 size-[24px]"
                data-node-id="I5006:43052;9976:10654;9976:10631;9976:10604"
                data-name="circle-dot">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBell} />
              </div>
            </div>
            <div
              className="content-stretch flex h-full items-center p-[var(--size\/100,12px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10654;9976:10635"
              data-name="IM">
              <div
                className="relative shrink-0 size-[24px]"
                data-node-id="I5006:43052;9976:10654;9976:10635;9976:10604"
                data-name="circle-dot">
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={imgComment}
                />
              </div>
            </div>
            <div
              className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center p-[var(--size\/100,12px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10654;9976:10636"
              data-name="User menu">
              <Avatar className="overflow-clip relative rounded-[120px] shrink-0 size-[32px]" />
            </div>
          </div>
        </div>
        <div
          className="border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex h-[56px] items-center px-[var(--size\/25,4px)] relative shrink-0 w-full"
          data-node-id="I5006:43052;9976:10655"
          data-name=".Secondary menu">
          <div
            aria-hidden
            className="absolute bg-[var(--$gray--50,#f9f9f9)] inset-0 pointer-events-none"
          />
          <div
            className="content-stretch flex gap-[var(--size\/100,12px)] h-full items-center px-[var(--size\/50,8px)] relative shrink-0"
            data-node-id="I5006:43052;9976:10655;9976:10658"
            data-name="Course">
            <div
              className="bg-[var(--$bronze--100,#feebbb)] relative rounded-[120px] shrink-0 size-[32px]"
              data-node-id="I5006:43052;9976:10655;9976:10659"
              data-name="Course Hat">
              <div
                className="absolute inset-[18.75%]"
                data-node-id="I5006:43052;9976:10655;9976:10659;663:3906"
                data-name="graduation-cap">
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={imgGraduationCap}
                />
              </div>
            </div>
            <p
              className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/400,18px)] whitespace-nowrap"
              data-node-id="I5006:43052;9976:10655;9976:10660">
              Natural Science 7A
            </p>
          </div>
          <div
            className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px relative"
            data-node-id="I5006:43052;9976:10655;9976:10661"
            data-name="Main menu">
            <div
              className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10655;9976:10662"
              data-name=".Navigation item">
              <div
                className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap"
                data-node-id="I5006:43052;9976:10655;9976:10662;9976:10576">
                <p className="leading-[1.5]">Overview</p>
              </div>
            </div>
            <div
              className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10655;9976:10663"
              data-name=".Navigation item">
              <div
                className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap"
                data-node-id="I5006:43052;9976:10655;9976:10664;9976:10576">
                <p className="leading-[1.5]">Plans</p>
              </div>
            </div>
            <div
              className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10655;9976:10664"
              data-name=".Navigation item">
              <div
                className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap"
                data-node-id="I5006:43052;9976:10655;9976:10664;9976:10576">
                <p className="leading-[1.5]">Resources</p>
              </div>
            </div>
            <div
              className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10655;9976:10665"
              data-name=".Navigation item">
              <div
                className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap"
                data-node-id="I5006:43052;9976:10655;9976:10665;9976:10576">
                <p className="leading-[1.5]">Reports</p>
              </div>
            </div>
            <div
              className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0"
              data-node-id="I5006:43052;9976:10655;9976:10666"
              data-name=".Navigation item">
              <div
                className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap"
                data-node-id="I5006:43052;9976:10655;9976:10666;9976:10576">
                <p className="leading-[1.5]">Participants</p>
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex h-full items-center p-[var(--size\/100,12px)] relative shrink-0"
            data-node-id="I5006:43052;9976:10655;9976:10670"
            data-name=".Navigation item">
            <div
              className="relative shrink-0 size-[24px]"
              data-node-id="I5006:43052;9976:10655;9976:10670;9976:10604"
              data-name="circle-dot">
              <img
                alt=""
                className="absolute block inset-0 max-w-none size-full"
                src={imgEllipsis}
              />
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_4px_8px_0px_rgba(0,0,0,0.05)]" />
        </div>
      </div>
      <div
        className="content-stretch flex flex-col items-start relative shrink-0 w-full"
        data-node-id="5006:43053"
        data-name="main-wrapper">
        <div
          className="content-stretch flex flex-col items-center px-[var(--ca-horisontal-margin,48px)] relative shrink-0 w-full"
          data-node-id="5006:43054"
          data-name="content-area-wrapper">
          <div
            className="content-stretch flex flex-col items-center max-w-[1280px] pb-[var(--size\/500,20px)] relative shrink-0 w-full"
            data-node-id="5006:43055"
            data-name="content-area">
            <div
              className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full"
              data-node-id="5006:43056"
              data-name="PageHeader">
              <div
                className="content-stretch flex flex-col items-start justify-end pt-[var(--size\/50,8px)] relative shrink-0 w-full"
                data-node-id="I5006:43056;19853:9719"
                data-name="Breadcrumb wrapper">
                <div
                  className="content-center flex flex-wrap gap-[var(--size\/50,8px)] items-center relative shrink-0 w-full"
                  data-node-id="I5006:43056;19853:9045"
                  data-name="Breadcrumb trail">
                  <div
                    className="content-stretch flex gap-[var(--size\/25,4px)] items-start py-[var(--size\/25,4px)] relative shrink-0"
                    data-node-id="I5006:43056;19853:9045;19853:6322"
                    data-name="Breadcrumb">
                    <p
                      className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] underline whitespace-nowrap"
                      data-node-id="I5006:43056;19853:9045;19853:6322;19853:6315">
                      Resources
                    </p>
                  </div>
                  <div
                    className="content-stretch flex gap-[var(--size\/25,4px)] items-start py-[var(--size\/25,4px)] relative shrink-0"
                    data-node-id="I5006:43056;19853:9045;19853:6324"
                    data-name="Breadcrumb">
                    <div
                      className="content-stretch flex items-center pt-[var(--size\/10,2px)] relative shrink-0 w-[16px]"
                      data-node-id="I5006:43056;19853:9045;19853:6324;19853:6317"
                      data-name="icon wrapper">
                      <div
                        className="flex-[1_0_0] h-[16px] min-w-px relative"
                        data-node-id="I5006:43056;19853:9045;19853:6324;19853:6318"
                        data-name="chevron-right">
                        <img
                          alt=""
                          className="absolute block inset-0 max-w-none size-full"
                          src={imgChevronRight}
                        />
                      </div>
                    </div>
                    <p
                      className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] underline whitespace-nowrap"
                      data-node-id="I5006:43056;19853:9045;19853:6324;19853:6319">
                      [folder name]
                    </p>
                    <div
                      className="content-stretch flex items-center pt-[var(--size\/10,2px)] relative shrink-0 w-[16px]"
                      data-node-id="I5006:43056;19853:9045;19853:6324;22038:9460"
                      data-name="icon wrapper">
                      <div
                        className="flex-[1_0_0] h-[16px] min-w-px relative"
                        data-node-id="I5006:43056;19853:9045;19853:6324;22038:9461"
                        data-name="chevron-right">
                        <img
                          alt=""
                          className="absolute block inset-0 max-w-none size-full"
                          src={imgChevronRight}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="content-stretch flex flex-col gap-[var(--size\/25,4px)] items-start py-[var(--size\/500,20px)] relative shrink-0 w-full"
                data-node-id="I5006:43056;5889:6338"
                data-name="Title and subtitle">
                <div
                  className="content-start flex flex-wrap gap-[var(--size\/100,12px)] items-start relative shrink-0 w-full"
                  data-node-id="I5006:43056;5419:6693"
                  data-name="Group wrapper">
                  <div
                    className="content-stretch flex flex-[1_0_0] flex-col gap-[var(--size\/25,4px)] items-start min-w-[200px] pr-[var(--size\/500,20px)] relative"
                    data-node-id="I5006:43056;6438:6285"
                    data-name="Content">
                    <div
                      className="content-center flex flex-wrap gap-[var(--size\/100,12px)] items-center relative shrink-0 w-full"
                      data-node-id="I5006:43056;11648:5210"
                      data-name="Title wrapper">
                      <p
                        className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] max-w-[800px] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/800,26px)] whitespace-nowrap"
                        data-node-id="I5006:43056;5419:6694">
                        Add element to [folder name]
                      </p>
                    </div>
                  </div>
                  <div
                    className="content-center flex flex-wrap gap-[12px] items-center relative shrink-0 size-[40px]"
                    data-node-id="I5006:43056;23120:8171"
                    data-name="Actions slot"
                  />
                </div>
              </div>
            </div>
            <div
              className="content-start flex flex-wrap gap-[var(--actions\/actions-gap,12px)] items-start pb-[var(--size\/500,20px)] relative shrink-0 w-full"
              data-node-id="5006:43057"
              data-name="Actions">
              <div
                className="bg-[var(--$accent--600,#008859)] content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center pl-[var(--size\/100,12px)] pr-[var(--size\/500,20px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0"
                data-node-id="5006:43058"
                data-name="Button">
                <div
                  className="relative shrink-0 size-[24px]"
                  data-node-id="I5006:43058;1915:3157"
                  data-name="Icon placeholder">
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={imgFileImport}
                  />
                </div>
                <p
                  className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--0,white)] text-[length:var(--size\/300,16px)] text-center whitespace-nowrap"
                  data-node-id="I5006:43058;1915:3158">
                  Upload file
                </p>
              </div>
              <div
                className="bg-[var(--$gray--0,white)] border-2 border-[var(--$brand--400,#a997b5)] border-solid content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center px-[var(--size\/500,20px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0"
                data-node-id="5006:43059"
                data-name="Button">
                <p
                  className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$brand--800,#42354a)] text-[length:var(--size\/300,16px)] text-center whitespace-nowrap"
                  data-node-id="I5006:43059;1915:4326">
                  Create folder
                </p>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full"
              data-node-id="5006:43060">
              <div
                className="bg-[var(--$gray--0,white)] border border-[var(--$gray--300,#e1e1e1)] border-solid content-stretch flex flex-col gap-[var(--size\/100,12px)] items-start px-[var(--content-block\/content-block-horisontal-padding,32px)] py-[var(--content-block\/content-block-vertical-padding,20px)] relative rounded-[4px] shrink-0 w-full"
                data-node-id="5006:43061"
                data-name="Content-block">
                <p
                  className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/600,22px)] w-[195px]"
                  data-node-id="5006:43062">
                  Resources
                </p>
                <div
                  className="content-start flex flex-wrap gap-[12px] items-start relative shrink-0 w-full"
                  data-node-id="5006:43063">
                  <div
                    className="content-stretch flex gap-[var(--size\/100,12px)] h-[56px] items-start min-w-[276px] py-[var(--size\/25,4px)] relative rounded-[4px] shrink-0 w-[362.667px]"
                    data-node-id="5006:43064"
                    data-name="CategoryLink">
                    <div
                      className="relative shrink-0 size-[48px]"
                      data-node-id="5006:43065"
                      data-name="xlsx">
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgXlsx}
                      />
                    </div>
                    <div
                      className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[1.5] min-h-[48px] min-w-px relative text-[color:var(--$gray--900,#333)]"
                      data-node-id="5006:43066"
                      data-name="Description">
                      <p
                        className="font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] relative shrink-0 text-[length:var(--size\/300,16px)] w-full"
                        data-node-id="5006:43067">
                        Excel
                      </p>
                      <p
                        className="font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] relative shrink-0 text-[length:var(--size\/200,14px)] w-full"
                        data-node-id="5006:43068">
                        Description
                      </p>
                    </div>
                  </div>
                  <div
                    className="content-stretch flex gap-[var(--size\/100,12px)] h-[56px] items-start min-w-[276px] py-[var(--size\/25,4px)] relative rounded-[4px] shrink-0 w-[362.667px]"
                    data-node-id="5006:43069"
                    data-name="CategoryLink">
                    <div
                      className="relative shrink-0 size-[48px]"
                      data-node-id="5006:43070"
                      data-name="pptx">
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgPptx}
                      />
                    </div>
                    <div
                      className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[1.5] min-h-[48px] min-w-px relative text-[color:var(--$gray--900,#333)]"
                      data-node-id="5006:43071"
                      data-name="Description">
                      <p
                        className="font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] relative shrink-0 text-[length:var(--size\/300,16px)] w-full"
                        data-node-id="5006:43072">
                        PowerPoint
                      </p>
                      <p
                        className="font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] relative shrink-0 text-[length:var(--size\/200,14px)] w-full"
                        data-node-id="5006:43073">
                        Description
                      </p>
                    </div>
                  </div>
                  <div
                    className="content-stretch flex gap-[var(--size\/100,12px)] h-[56px] items-start min-w-[276px] py-[var(--size\/25,4px)] relative rounded-[4px] shrink-0 w-[362.667px]"
                    data-node-id="5006:43074"
                    data-name="CategoryLink">
                    <div
                      className="relative shrink-0 size-[48px]"
                      data-node-id="5006:43075"
                      data-name="docx">
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgDocx}
                      />
                    </div>
                    <div
                      className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[1.5] min-h-[48px] min-w-px relative text-[color:var(--$gray--900,#333)]"
                      data-node-id="5006:43076"
                      data-name="Description">
                      <p
                        className="font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] relative shrink-0 text-[length:var(--size\/300,16px)] w-full"
                        data-node-id="5006:43077">
                        Word
                      </p>
                      <p
                        className="font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] relative shrink-0 text-[length:var(--size\/200,14px)] w-full"
                        data-node-id="5006:43078">
                        Description
                      </p>
                    </div>
                  </div>
                  <div
                    className="content-stretch flex gap-[var(--size\/100,12px)] items-start min-w-[276px] py-[var(--size\/25,4px)] relative rounded-[4px] shrink-0 w-[363px]"
                    data-node-id="5006:43079"
                    data-name="CategoryLink">
                    <div
                      className="relative shrink-0 size-[48px]"
                      data-node-id="5006:43080"
                      data-name="page">
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgPage}
                      />
                    </div>
                    <div
                      className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[1.5] min-h-[48px] min-w-px relative text-[color:var(--$gray--900,#333)]"
                      data-node-id="5006:43081"
                      data-name="Description">
                      <p
                        className="font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] relative shrink-0 text-[length:var(--size\/300,16px)] w-full"
                        data-node-id="5006:43082">
                        Page
                      </p>
                      <p
                        className="font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] relative shrink-0 text-[length:var(--size\/200,14px)] w-full"
                        data-node-id="5006:43083">
                        Description
                      </p>
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

## Tool notes (verbatim)

- SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system. (1) Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens. (2) Convert React syntax to the target framework/library. (3) Transform all Tailwind classes to the target styling system while preserving exact visual design. (4) Follow the project's existing patterns and conventions. DO NOT install any Tailwind as a dependency unless the user instructs you to do so.
- Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
- These styles are contained in the design: Base: Font(family: "default-font", style: regular, size: Size/300, weight: 400, lineHeight: 1.5, letterSpacing: 0), Title M: Font(family: "default-font", style: bold, size: Size/400, weight: 700, lineHeight: 1.5, letterSpacing: 0), layer-shadow: Effect(type: DROP_SHADOW, color: #0000000D, offset: (0, 4), radius: 8, spread: 0), Links/Base small secondary link: Font(family: "default-font", style: regular, size: Size/200, weight: 400, lineHeight: 1.5, letterSpacing: 0), Title XL: Font(family: "default-font", style: bold, size: Size/800, weight: 700, lineHeight: 1.5, letterSpacing: 0), Base strong: Font(family: "default-font", style: bold, size: Size/300, weight: 700, lineHeight: 1.5, letterSpacing: 0), Title L: Font(family: "default-font", style: bold, size: Size/600, weight: 700, lineHeight: 1.5, letterSpacing: 0), Base small: Font(family: "default-font", style: regular, size: Size/200, weight: 400, lineHeight: 1.5, letterSpacing: 0).
- Images and SVGs will be stored as constants... Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## Component descriptions (Figma library "usage" documentation attached to main components — this is the evidence used to identify instances in place of a working Code Connect map)

### Mobile=False — Node ID: 5566:11566

Menu
Documentation: https://styleguide.itsbuild.net/assets/patterns/MainMenu/v1/

### Navigation — Node ID: 5566:11565

Usage: 1) Ask developers about specific breakpoints when menus change for smaller screens. 2) Note that there is no variant for a mid-size screen in Figma, but the behaviour in code might have more variations depending on the available space on the screen. These 2 options help easily depict 2 most common cases.
Keywords: Menu, main, course

### Search — Node ID: 5483:11897

Usage: This Figma component represents 2 components in Prometheus: SearchInput and GlobalSearch. Global=false (searchinput) can be used on each page where we have search as you type, and it doesn't require from user confirmation; can be combined with filters. Global=true (Globalesearch) can be used in navigation and search result page. Used when we require confirmation from user to start the searching mechanism. Auto-complete: for SearchInput only; the text field can be combined with auto-complete functionality.
Keywords: search, global, input
Documentation: https://styleguide.itsbuild.net/assets/inputs/SearchInput/v1/

### Button — Node ID: 5368:8591

Usage: 1) Large is a default size of the button. The small size can be used in some specific cases when the large one is too big. 2) The button width depends on its label. 3) The button can't lead to another page — use the link instead. 4) Truncate button's label if it doesn't fit; button label should never wrap.
Loading: the button can be in a loading state (text hidden, spinner shown, width maintained).
Row of actions: distance between actions defined by `actions-gap` variable; behaviour of a row of actions handled by the ButtonGroup component — "We don't have any analogue in Figma, for designers it is simple row inside an Auto Layout."
Documentation: https://styleguide.itsbuild.net/assets/inputs/Button/v1/

### magnifying-glass — Node ID: 5483:11895

search

### bell — Node ID: 5483:12029

bell, notification

### comment — Node ID: 5483:3871

Not in Semiotic comment, messages

### Avatar — Node ID: 2275:4903

Usage: predefined sizes only — 100: 24x24 (size--700), 200: 32x32 (size--900), 300: 48x48 (size--1100), 400: 64x64 (size--1200), 500: 80x80 (size--1300), 600: 96x96 (size--1400). Please use only these options.
Keywords: User, person, userpic
Documentation: https://styleguide.itsbuild.net/assets/nodes/Avatar/v1/

### Course Hat — Node ID: 5512:7653

Course avatar, label
Documentation: https://prom.itsldevops.net/docs/styles/blocks/#course-hat

### graduation-cap — Node ID: 4023:1013

course

### ellipsis — Node ID: 5483:3670

3-dot, dots, ellipsis, options, more

### Editable=False — Node ID: 5483:11384

Usage: 1) This component represents 2 components in Prometheus: PageHeader and PageHeaderEditable. 2) The optional like can concatenate several text lines divided by the bullet symbol (accessible solution exists, reusable). 3) The editable option in Figma needs some tweaks when the title is long or the screen is narrow.
Documentation: https://styleguide.itsbuild.net/assets/patterns/PageHeader/v1/

### PageHeader — Node ID: 5483:11383

Usage: 1) Represents 2 components in Prometheus: PageHeader and PageHeaderEditable. 2) The Subtitle concatenates several text lines divided by the bullet symbol (accessible solution exists) — don't use line break and complex structure in the subtitle. 3) The editable option in Figma needs tweaks when the title is long or the screen is narrow.
Documentation: https://styleguide.itsbuild.net/assets/patterns/PageHeader/v1/

### Breadcrumb trail — Node ID: 5483:11343

How to use: 1) can be used as additional navigation when there are multiple levels of hierarchy. 2) for smaller screens wrap into multiline. 3) when used inside PageHeader do not show current location!
More guidelines: https://www.figma.com/design/NcOdZ7kMoI18os0UibrVk6/Breadcrumbs?node-id=1-2
Keywords: breadcrumb, breadcrumbs, trail

### chevron-right — Node ID: 5483:11183

arrow, right

### file-import — Node ID: 5512:6760

import
