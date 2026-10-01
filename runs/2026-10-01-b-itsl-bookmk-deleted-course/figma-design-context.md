const assetPathPrefix = "https://www.figma.com/api/mcp/asset/1f97f61f-24de-4f67-aa7d-c286f522be2c";
const imgChevronLeft = `${assetPathPrefix}/4adad.svg`;
const imgChevronRight = `${assetPathPrefix}/0cee5.svg`;
const imgCaretDown = `${assetPathPrefix}/3ba13.svg`;
const imgIconPlaceholder = `${assetPathPrefix}/8103c.svg`;
const imgYourFiles = `${assetPathPrefix}/9106c.svg`;
const imgPhoto = `${assetPathPrefix}/19894.png`;
const imgGroupFalse = `${assetPathPrefix}/70bc9.svg`;
const imgItslearningLogoSymbol = `${assetPathPrefix}/347f2.svg`;
const imgMagnifyingGlass = `${assetPathPrefix}/ef8c2.svg`;
const imgBell = `${assetPathPrefix}/154ff.svg`;
const imgComment = `${assetPathPrefix}/6dcda.svg`;
const imgChevronRight1 = `${assetPathPrefix}/02c19.svg`;
const imgCircleInfo = `${assetPathPrefix}/c803f.svg`;
const imgXmark = `${assetPathPrefix}/1d1e6.svg`;
const imgMagnifyingGlass1 = `${assetPathPrefix}/5ecf8.svg`;
const imgCaretDown1 = `${assetPathPrefix}/d74b5.svg`;
const imgArrowUpArrowDown = `${assetPathPrefix}/c9143.svg`;
const imgCheck = `${assetPathPrefix}/5fcbe.svg`;
const imgAssignment = `${assetPathPrefix}/6d674.svg`;
const imgEllipsis = `${assetPathPrefix}/1aebc.svg`;
const imgDownload = `${assetPathPrefix}/bcb64.svg`;
const imgDivider = `${assetPathPrefix}/0e2bd.svg`;
const imgXmark1 = `${assetPathPrefix}/36b1d.svg`;

type PaginationProps = {
className?: string;
collapsed?: "False";
itemsPerPage?: boolean;
};

function Pagination({ className, collapsed = "False", itemsPerPage = true }: PaginationProps) {
return (
<div className={className || "content-stretch flex gap-[var(--size\\/300,16px)] items-center justify-end relative rounded-[40px] w-[1160px]"} data-node-id="4680:14010">
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4680:14012">
<div className="content-stretch flex flex-[1_0_0] gap-[8px] h-full items-center min-w-px relative" data-name="Pager">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="4680:14013" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4680:14013;1902:2859" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft} />
</div>
</div>
<div className="bg-[var(--$brand--700,#5d4a68)] content-stretch flex flex-col gap-[var(--size\/25,4px)] h-[40px] items-center justify-center px-[var(--size\/300,16px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="4680:14014" data-name=".Page link">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--0,white)] text-[length:var(--size\/200,14px)] text-center whitespace-nowrap" data-node-id="I4680:14014;4997:6344">
1
</p>
</div>
<div className="content-stretch flex flex-col gap-[var(--size\/25,4px)] h-[40px] items-center justify-center px-[var(--size\/300,16px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="4680:14015" data-name=".Page link">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] text-center whitespace-nowrap" data-node-id="I4680:14015;4997:6338">
2
</p>
</div>
<div className="content-stretch flex flex-col gap-[var(--size\/25,4px)] h-[40px] items-center justify-center px-[var(--size\/300,16px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="4680:14016" data-name=".Page link">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] text-center whitespace-nowrap" data-node-id="I4680:14016;4997:6338">
3
</p>
</div>
<div className="content-stretch flex flex-col gap-[var(--size\/25,4px)] h-[40px] items-center justify-center px-[var(--size\/300,16px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="4680:14017" data-name=".Page link">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] text-center whitespace-nowrap" data-node-id="I4680:14017;4997:6338">
4
</p>
</div>
<div className="content-stretch flex flex-col gap-[var(--size\/25,4px)] h-[40px] items-center justify-center px-[var(--size\/300,16px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="4680:14018" data-name=".Page link">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] text-center whitespace-nowrap" data-node-id="I4680:14018;4997:6338">
5
</p>
</div>
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="4680:14019" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4680:14019;1902:2850" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight} />
</div>
</div>
</div>
</div>
{itemsPerPage && (
<div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="4680:14020" data-name="Control">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/200,14px)] text-center whitespace-nowrap" data-node-id="4680:14021">
1 to 10 of 47
</p>
<div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[80px]" data-node-id="4680:14022" data-name="Select">
<div className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid content-stretch flex gap-[var(--size\/50,8px)] h-[40px] items-center overflow-clip pl-[var(--size\/100,12px)] pr-[40px] py-[var(--size\/25,4px)] relative rounded-[var(--border-radius,4px)] shrink-0 w-full" data-node-id="I4680:14022;29:7275" data-name="Input">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px overflow-hidden relative text-[16px] text-[color:var(--$gray--900,#333)] text-ellipsis whitespace-nowrap" data-node-id="I4680:14022;29:7276">
10
</p>
<div className="absolute right-[6px] size-[24px] top-[6px]" data-node-id="I4680:14022;1429:2756" data-name="caret-down">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCaretDown} />
</div>
</div>
</div>
</div>
)}
</div>
);
}

type ButtonProps = {
className?: string;
focused?: boolean;
icons?: "No" | "Left";
size?: "Large";
state?: "Normal";
type?: "Secondary" | "Plain";
};

function Button({ className, focused = false, icons = "No", size = "Large", state = "Normal", type = "Secondary" }: ButtonProps) {
const isPlainAndLeftAndLargeAndNormal = type === "Plain" && icons === "Left" && size === "Large" && state === "Normal";
const isSecondaryAndNoAndLargeAndNormal = type === "Secondary" && icons === "No" && size === "Large" && state === "Normal";
return (
<div className={className || `${String.raw`content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] `}${isPlainAndLeftAndLargeAndNormal ? String.raw`pl-[var(--size\/25,4px)] pr-[var(--size\/50,8px)]` : String.raw`bg-[var(--$gray--0,white)] border-2 border-[var(--$brand--400,#a997b5)] border-solid px-[var(--size\/500,20px)]`}`} id={isPlainAndLeftAndLargeAndNormal ? "node-4675_10419" : "node-4675_10163"}>
{isSecondaryAndNoAndLargeAndNormal && (
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$brand--800,#42354a)] text-[length:var(--size\/300,16px)] text-center whitespace-nowrap" data-node-id="4675:10164">
Button
</p>
)}
{isSecondaryAndNoAndLargeAndNormal && focused && (
<div className="absolute inset-[-2px]" data-node-id="4675:10165" data-name="Focus ring">
<div className="absolute border-3 border-[var(--$blue--600,#0055b0)] border-solid inset-[-5px] rounded-[var(--size\/50,8px)]" data-node-id="I4675:10165;3977:5193" data-name="Focus ring" />
</div>
)}
{isPlainAndLeftAndLargeAndNormal && (
<>
<div className="relative shrink-0 size-[24px]" data-node-id="4675:10420" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconPlaceholder} />
</div>
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$brand--700,#5d4a68)] text-[length:var(--size\/300,16px)] text-center whitespace-nowrap" data-node-id="4675:10421">
Button
</p>
</>
)}
{isPlainAndLeftAndLargeAndNormal && focused && (
<div className="absolute inset-0" data-node-id="4675:10422" data-name="Focus ring">
<div className="absolute border-3 border-[var(--$blue--600,#0055b0)] border-solid inset-[-5px] rounded-[var(--size\/50,8px)]" data-node-id="I4675:10422;3977:5193" data-name="Focus ring" />
</div>
)}
</div>
);
}

type CellProps = {
className?: string;
checkbox?: boolean;
header?: boolean;
multipleSlots?: boolean;
type?: "Text" | "Checkbox";
};

function Cell({ className, checkbox = true, header = false, multipleSlots = false, type = "Text" }: CellProps) {
const isCheckboxAndFalse = type === "Checkbox" && !header;
const isTextAndFalse = type === "Text" && !header;
return (
<div className={className || `${String.raw`content-stretch flex gap-[var(--size\/50,8px)] px-[var(--size\/50,8px)] relative `}${isCheckboxAndFalse ? String.raw`flex-col items-center min-w-[60px] pb-[14px] pt-[var(--size\/100,12px)]` : String.raw`[word-break:break-word] font-[family-name:var(--default-font,"Lato:Regular")] font-[var(--regular,normal)] items-start leading-[1.5] py-[var(--size\/100,12px)] text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)] w-[241px]`}`} id={isCheckboxAndFalse ? "node-4978_10927" : "node-4978_10913"}>
      {isTextAndFalse && (
        <p className="flex-[1_0_0] min-w-px relative" data-node-id="4978:10931">
          Text
        </p>
      )}
      {isTextAndFalse && multipleSlots && (
        <p className="relative shrink-0 whitespace-nowrap" data-node-id="4978:10932">
          Text
        </p>
      )}
      {isCheckboxAndFalse && checkbox && <div className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid relative rounded-[var(--border-radius,4px)] shrink-0 size-[22px]" data-node-id="4978:10964" data-name="Checkbox" />}
</div>
);
}

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

function Navigation({ className }: { className?: string }) {
return (
<div className={className || "content-stretch drop-shadow-[0px_4px_4px_rgba(0,0,0,0.05)] flex flex-col items-start relative w-[1280px]"} data-node-id="4016:6647" data-name="Navigation">
<div className="bg-[var(--$gray--0,white)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex h-[56px] items-center px-[var(--size\/25,4px)] relative shrink-0 w-full" data-node-id="4016:6648" data-name=".Main menu">
<div className="content-stretch flex h-full items-center px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4016:6648;9976:10621" data-name="Logo area">
<div className="relative shrink-0 size-[32px]" data-node-id="I4016:6648;9976:10622" data-name="itslearning-logo-symbol">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgItslearningLogoSymbol} />
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px relative" data-node-id="I4016:6648;9976:10623" data-name="Main menu">
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4016:6648;9976:10624" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4016:6648;9976:10624;9976:10576">
<p className="leading-[1.5]">Courses</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4016:6648;13432:5117" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4016:6648;13432:5117;9976:10576">
<p className="leading-[1.5]">Updates</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4016:6648;15220:17430" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4016:6648;15220:17430;9976:10576">
<p className="leading-[1.5]">Groups</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4016:6648;9976:10626" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4016:6648;9976:10626;9976:10576">
<p className="leading-[1.5]">Calendar</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4016:6648;9976:10627" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4016:6648;9976:10627;9976:10576">
<p className="leading-[1.5]">Library</p>
</div>
</div>
</div>
<div className="content-stretch flex h-full items-start justify-end pl-[var(--size\/700,24px)] relative shrink-0" data-node-id="I4016:6648;9976:10630" data-name="Personal menu">
<div className="content-stretch flex h-full items-center px-[var(--size\/50,8px)] relative shrink-0" data-node-id="I4016:6648;11704:5608" data-name="Search wrapper">
<div className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid content-stretch flex items-start max-w-[264px] pl-[var(--size\/100,12px)] relative rounded-[var(--border-radius,4px)] shrink-0 w-[264px]" data-node-id="I4016:6648;11704:5609" data-name="Search">
<div className="content-stretch flex flex-col h-[16px] items-start px-[4px] py-[var(--size\/50,8px)] relative shrink-0 w-0" data-node-id="I4016:6648;11704:5609;17089:13616" data-name="Icon wrapper" />
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px pr-[var(--size\/25,4px)] py-[var(--size\/50,8px)] relative" data-node-id="I4016:6648;11704:5609;13211:9102" data-name="Text wrapper">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--600,#757575)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4016:6648;11704:5609;13157:8017">
Search
</p>
</div>
<div className="content-stretch flex items-start relative shrink-0" data-node-id="I4016:6648;11704:5609;13157:8020" data-name="Actions">
<div className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-br-[var(--border-radius,4px)] rounded-tr-[var(--border-radius,4px)] shrink-0" data-node-id="I4016:6648;11704:5609;13157:8022" data-name="search">
<div className="relative shrink-0 size-[24px]" data-node-id="I4016:6648;11704:5609;13157:8022;1902:2742" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMagnifyingGlass} />
</div>
</div>
</div>
</div>
</div>
<div className="content-stretch flex h-full items-center p-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4016:6648;9976:10631" data-name=".Navigation item">
<div className="relative shrink-0 size-[24px]" data-node-id="I4016:6648;9976:10631;9976:10604" data-name="circle-dot">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBell} />
</div>
</div>
<div className="content-stretch flex h-full items-center p-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4016:6648;9976:10635" data-name="IM">
<div className="relative shrink-0 size-[24px]" data-node-id="I4016:6648;9976:10635;9976:10604" data-name="circle-dot">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComment} />
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center p-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4016:6648;9976:10636" data-name="User menu">
<Avatar className="overflow-clip relative rounded-[120px] shrink-0 size-[32px]" />
</div>
</div>
</div>
<div className="border-[var(--gray\/300,#e1e1e1)] border-b border-solid content-stretch flex h-[56px] items-center px-[var(--size\/25,4px)] relative shrink-0 w-full" data-node-id="4016:6649" data-name=".Secondary menu">
<div aria-hidden className="absolute bg-[var(--$gray--50,#f9f9f9)] inset-0 pointer-events-none" />
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/50,8px)] relative shrink-0" data-node-id="4016:6650" data-name="Course">
<YourFiles className="relative shrink-0 size-[32px]" />
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/400,18px)] whitespace-nowrap" data-node-id="4016:6652">
Files
</p>
</div>
<div className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px relative" data-node-id="4016:6653" data-name="Main menu">
<div className="content-stretch flex gap-[var(--size\/size--50,8px)] h-full items-center px-[var(--size\/size--300,16px)] py-[var(--size\/size--100,12px)] relative shrink-0" data-node-id="4016:6654" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--gray\/900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4016:6654;9976:10576">
<p className="leading-[1.5]">Your files</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/size--50,8px)] h-full items-center px-[var(--size\/size--300,16px)] py-[var(--size\/size--100,12px)] relative shrink-0" data-node-id="4016:6655" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--gray\/900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4016:6655;9976:10576">
<p className="leading-[1.5]">Course files</p>
</div>
<div className="absolute bg-[var(--gray\/700,#565656)] bottom-0 h-[4px] left-[16px] right-[16px] rounded-tl-[8px] rounded-tr-[8px]" data-node-id="I4016:6655;9976:10581" data-name="Highlight" />
</div>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_4px_8px_0px_rgba(0,0,0,0.05)]" />
</div>
</div>
);
}

export default function DeletedCourseContent() {
return (
<div className="bg-[var(--$gray--150,#f2f2f2)] content-stretch flex flex-col items-center pb-[56px] relative size-full" data-node-id="4549:8339" data-name="Deleted course - content">
<Navigation className="content-stretch drop-shadow-[0px_4px_4px_rgba(0,0,0,0.05)] flex flex-col items-start relative shrink-0 w-[1280px]" />
<div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-node-id="4549:8341" data-name="main-wrapper">
<div className="content-stretch flex flex-col items-center pb-[20px] px-[var(--ca-horisontal-margin,48px)] relative shrink-0 w-full" data-node-id="4549:8342" data-annotations="Section with description (similar element exists in resource tab for shared folder)" data-name="content-area-wrapper">
<div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-node-id="4549:8343" data-name="PageHeader">
<div className="content-stretch flex flex-col items-start justify-end pt-[var(--size\/50,8px)] relative shrink-0 w-full" data-node-id="I4549:8343;19853:9719" data-name="Breadcrumb wrapper">
<div className="content-center flex flex-wrap gap-[var(--size\/50,8px)] items-center relative shrink-0 w-full" data-node-id="I4549:8343;19853:9045" data-name="Breadcrumb trail">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-start py-[var(--size\/25,4px)] relative shrink-0" data-node-id="I4549:8343;19853:9045;19853:6322" data-name="Breadcrumb">
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] underline whitespace-nowrap" data-node-id="I4549:8343;19853:9045;19853:6322;19853:6319">
Course files
</p>
<div className="content-stretch flex items-center pt-[var(--size\/10,2px)] relative shrink-0 w-[16px]" data-node-id="I4549:8343;19853:9045;19853:6322;22038:9460" data-name="icon wrapper">
<div className="flex-[1_0_0] h-[16px] min-w-px relative" data-node-id="I4549:8343;19853:9045;19853:6322;22038:9461" data-name="chevron-right">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight1} />
</div>
</div>
</div>
</div>
</div>
<div className="content-stretch flex flex-col gap-[var(--size\/25,4px)] items-start py-[var(--size\/500,20px)] relative shrink-0 w-full" data-node-id="I4549:8343;5889:6338" data-name="Title and subtitle">
<div className="content-start flex flex-wrap gap-[var(--size\/100,12px)] items-start relative shrink-0 w-full" data-node-id="I4549:8343;5419:6693" data-name="Group wrapper">
<div className="content-stretch flex flex-[1_0_0] flex-col gap-[var(--size\/25,4px)] items-start min-w-[200px] pr-[var(--size\/500,20px)] relative" data-node-id="I4549:8343;6438:6285" data-name="Content">
<div className="content-center flex flex-wrap gap-[var(--size\/100,12px)] items-center relative shrink-0 w-full" data-node-id="I4549:8343;11648:5210" data-name="Title wrapper">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] max-w-[800px] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/800,26px)] whitespace-nowrap" data-node-id="I4549:8343;5419:6694">
Social Studies 9A
</p>
</div>
</div>
<div className="content-center flex flex-wrap gap-[12px] items-center relative shrink-0 size-[40px]" data-node-id="I4549:8343;23120:8171" data-name="Actions slot" />
</div>
</div>
</div>
<div className="content-stretch flex flex-col gap-[var(--size\/500,20px)] items-end relative shrink-0 w-[1184px]" data-node-id="4549:8344" data-name="cards">
<div className="bg-[var(--$gray--0,white)] border border-[var(--$gray--300,#e1e1e1)] border-solid content-stretch flex flex-col gap-[var(--size\/500,20px)] items-start px-[var(--content-block\/content-block-horisontal-padding,32px)] py-[var(--content-block\/content-block-vertical-padding,20px)] relative rounded-[4px] shrink-0 w-full" data-node-id="4549:8347" data-name="Content-block">
<div className="bg-[var(--$blue--100,#ecf8ff)] content-stretch flex items-start pl-[var(--size\/100,12px)] relative shrink-0 w-full" data-node-id="4549:8349" data-name="Banner">
<div className="content-stretch flex items-start pt-[10px] relative shrink-0" data-node-id="I4549:8349;3841:6676" data-name="Icon wrapper">
<div className="relative shrink-0 size-[24px]" data-node-id="I4549:8349;23112:4891" data-name="circle-info">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCircleInfo} />
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] flex-col gap-[var(--size\/100,12px)] items-start min-w-px pl-[var(--size\/50,8px)] pr-[var(--size\/100,12px)] py-[var(--size\/100,12px)] relative" data-node-id="I4549:8349;2504:3039" data-name="Text wrapper">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/200,14px)] w-full" data-node-id="I4549:8349;0:26488">{`This folder is created for the course “[name of the course]” you will find here all your work and important files. `}</p>
</div>
<div className="content-stretch flex items-center pr-[var(--size\/10,2px)] py-[var(--size\/10,2px)] relative shrink-0" data-node-id="I4549:8349;3841:6883" data-name="Button wrapper">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4549:8349;17344:7058" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4549:8349;17344:7058;1902:2850" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgXmark} />
</div>
</div>
</div>
</div>
<div className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid content-stretch flex items-start pl-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0 w-full" data-node-id="4549:8358" data-name="Search">
<div className="content-stretch flex items-start py-[var(--size\/50,8px)] relative shrink-0" data-node-id="I4549:8358;17089:13614" data-name="Icon wrapper">
<div className="relative shrink-0 size-[24px]" data-node-id="I4549:8358;540:2074" data-name="magnifying-glass">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMagnifyingGlass1} />
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px pl-[var(--size\/25,4px)] pr-[var(--size\/100,12px)] py-[var(--size\/50,8px)] relative" data-node-id="I4549:8358;13211:8848" data-name="Text wrapper">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--600,#757575)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4549:8358;13211:5703">
Search [what user can search]
</p>
</div>
</div>
<div className="bg-[var(--$gray--0,white)] border-2 border-[var(--$brand--400,#a997b5)] border-solid content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center pl-[var(--size\/500,20px)] pr-[var(--size\/100,12px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="4573:8406" data-name="Button">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$brand--800,#42354a)] text-[length:var(--size\/300,16px)] text-center whitespace-nowrap" data-node-id="I4573:8406;19:7332">
Actions
</p>
<div className="relative shrink-0 size-[24px]" data-node-id="I4573:8406;1902:3218" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCaretDown1} />
</div>
</div>
<div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="4549:8360" data-name="tab;le">
<div className="bg-[var(--$gray--0,white)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex items-center overflow-clip relative shrink-0 w-full" data-node-id="4549:8361" data-name="content">
<div className="flex flex-row items-center self-stretch" data-node-id="4549:8363">
<div className="bg-[var(--$gray--50,#f9f9f9)] content-stretch flex h-full items-start min-h-[32px] px-[var(--size\/50,8px)] relative shrink-0" data-name="Cell">
<div className="content-stretch flex items-center justify-center py-[5px] relative shrink-0" data-node-id="I4549:8363;18129:8573" data-name="label wrapper">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] whitespace-nowrap" data-node-id="I4549:8363;1685:2530">
Select
</p>
</div>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4571:16848">
<div className="bg-[var(--$gray--50,#f9f9f9)] content-stretch flex flex-[1_0_0] h-full items-start min-h-[32px] min-w-px px-[var(--size\/50,8px)] relative" data-name="Cell">
<div className="content-stretch flex items-center justify-center py-[5px] relative shrink-0" data-node-id="I4571:16848;18129:8573" data-name="label wrapper">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] whitespace-nowrap" data-node-id="I4571:16848;1685:2530">
Title
</p>
</div>
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center min-h-[32px] min-w-[32px] p-[var(--size\/25,4px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4571:16848;18129:8574" data-name="Button">
<div className="relative shrink-0 size-[20px]" data-node-id="I4571:16848;18129:8574;1902:2838" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowUpArrowDown} />
</div>
</div>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8364">
<div className="bg-[var(--$gray--50,#f9f9f9)] content-stretch flex flex-[1_0_0] h-full items-start min-h-[32px] min-w-px px-[var(--size\/50,8px)] relative" data-name="Cell">
<div className="content-stretch flex items-center justify-center py-[5px] relative shrink-0" data-node-id="I4549:8364;18129:8615" data-name="label wrapper">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] whitespace-nowrap" data-node-id="I4549:8364;18129:8616">
Type
</p>
</div>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8365">
<div className="bg-[var(--$gray--50,#f9f9f9)] content-stretch flex flex-[1_0_0] h-full items-start min-h-[32px] min-w-px px-[var(--size\/50,8px)] relative" data-name="Cell">
<div className="content-stretch flex items-center justify-center py-[5px] relative shrink-0" data-node-id="I4549:8365;18129:8317" data-name="label wrapper">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] whitespace-nowrap" data-node-id="I4549:8365;1606:2453">
Last updated
</p>
</div>
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center min-h-[32px] min-w-[32px] p-[var(--size\/25,4px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4549:8365;18129:7840" data-name="Button">
<div className="relative shrink-0 size-[20px]" data-node-id="I4549:8365;18129:7840;1902:2838" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowUpArrowDown} />
</div>
</div>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8366">
<div className="bg-[var(--$gray--50,#f9f9f9)] content-stretch flex flex-[1_0_0] h-full items-start min-h-[32px] min-w-px px-[var(--size\/50,8px)] relative" data-name="Cell">
<div className="content-stretch flex items-center justify-center py-[5px] relative shrink-0" data-node-id="I4549:8366;18129:8317" data-name="label wrapper">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] whitespace-nowrap" data-node-id="I4549:8366;1606:2453">
Actions
</p>
</div>
</div>
</div>
</div>
<div className="bg-[var(--$gray--100,#f4f4f4)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex items-center overflow-clip relative shrink-0 w-full" data-node-id="4549:8368" data-name="content">
<div className="flex flex-row items-center self-stretch" data-node-id="4549:8370">
<div className="content-stretch flex flex-col gap-[var(--size\/50,8px)] h-full items-center min-w-[60px] pb-[14px] pt-[var(--size\/100,12px)] px-[var(--size\/50,8px)] relative shrink-0 w-[60px]" data-name="Cell">
<div className="bg-[var(--$green--600,#0b8356)] relative rounded-[var(--border-radius,4px)] shrink-0 size-[22px]" data-node-id="I4549:8370;1606:2455" data-name="Checkbox">
<div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[20px] top-1/2" data-node-id="I4549:8370;1606:2455;1070:2775" data-name="check">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck} />
</div>
</div>
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-node-id="4571:16763" data-name="Cell">
<div className="bg-[var(--$pigeongrey--100,#d9e3e8)] relative rounded-[120px] shrink-0 size-[24px]" data-node-id="I4571:16763;19393:6514" data-name="Course Hat">
<div className="absolute inset-[18.75%]" data-node-id="I4571:16763;19393:6514;663:3904" data-name="graduation-cap">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAssignment} />
</div>
</div>
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] min-w-px relative text-[color:var(--$blue--700,#00458f)] text-[length:var(--size\/300,16px)] underline" data-node-id="I4571:16763;18129:8605">
[assignment title]
</p>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8371">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8371;1606:2451">
Assignment
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8372">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8372;1606:2451">
Last updated
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8373">
<div className="content-start flex flex-[1_0_0] flex-wrap gap-[var(--size\/25,4px)] gap-y-[4px] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/25,4px)] relative" data-name="Cell">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4549:8373;18131:6496" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4549:8373;18131:6496;1902:2850" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipsis} />
</div>
</div>
</div>
</div>
</div>
<div className="bg-[var(--$gray--100,#f4f4f4)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex items-center overflow-clip relative shrink-0 w-full" data-node-id="4549:8375" data-name="content">
<div className="flex flex-row items-center self-stretch" data-node-id="4549:8377">
<div className="content-stretch flex flex-col gap-[var(--size\/50,8px)] h-full items-center min-w-[60px] pb-[14px] pt-[var(--size\/100,12px)] px-[var(--size\/50,8px)] relative shrink-0 w-[60px]" data-name="Cell">
<div className="bg-[var(--$green--600,#0b8356)] relative rounded-[var(--border-radius,4px)] shrink-0 size-[22px]" data-node-id="I4549:8377;1606:2455" data-name="Checkbox">
<div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[20px] top-1/2" data-node-id="I4549:8377;1606:2455;1070:2775" data-name="check">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck} />
</div>
</div>
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-node-id="4571:16773" data-name="Cell">
<div className="bg-[var(--$pigeongrey--100,#d9e3e8)] relative rounded-[120px] shrink-0 size-[24px]" data-node-id="I4571:16773;19393:6514" data-name="Course Hat">
<div className="absolute inset-[18.75%]" data-node-id="I4571:16773;19393:6514;663:3904" data-name="graduation-cap">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAssignment} />
</div>
</div>
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] min-w-px relative text-[color:var(--$blue--700,#00458f)] text-[length:var(--size\/300,16px)] underline" data-node-id="I4571:16773;18129:8605">
[assignment title]
</p>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8378">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8378;1606:2451">
Assignment
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8379">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8379;1606:2451">
Last updated
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8380">
<div className="content-start flex flex-[1_0_0] flex-wrap gap-[var(--size\/25,4px)] gap-y-[4px] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/25,4px)] relative" data-name="Cell">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4549:8380;18131:6496" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4549:8380;18131:6496;1902:2850" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipsis} />
</div>
</div>
</div>
</div>
</div>
<div className="bg-[var(--$gray--0,white)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex items-center overflow-clip relative shrink-0 w-full" data-node-id="4549:8382" data-name="content">
<Cell className="flex flex-row items-center self-stretch" type="Checkbox" />
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-node-id="4571:16779" data-name="Cell">
<div className="bg-[var(--$pigeongrey--100,#d9e3e8)] relative rounded-[120px] shrink-0 size-[24px]" data-node-id="I4571:16779;19393:6514" data-name="Course Hat">
<div className="absolute inset-[18.75%]" data-node-id="I4571:16779;19393:6514;663:3904" data-name="graduation-cap">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAssignment} />
</div>
</div>
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] min-w-px relative text-[color:var(--$blue--700,#00458f)] text-[length:var(--size\/300,16px)] underline" data-node-id="I4571:16779;18129:8605">
[assignment title]
</p>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8385">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8385;1606:2451">
Assignment
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8386">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8386;1606:2451">
Last updated
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8387">
<div className="content-start flex flex-[1_0_0] flex-wrap gap-[var(--size\/25,4px)] gap-y-[4px] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/25,4px)] relative" data-name="Cell">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4549:8387;18131:6496" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4549:8387;18131:6496;1902:2850" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipsis} />
</div>
</div>
</div>
</div>
</div>
<div className="bg-[var(--$gray--0,white)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex items-center overflow-clip relative shrink-0 w-full" data-node-id="4549:8389" data-name="content">
<Cell className="content-stretch flex flex-col gap-[var(--size\/50,8px)] items-center min-w-[60px] pb-[14px] pt-[var(--size\/100,12px)] px-[var(--size\/50,8px)] relative shrink-0" type="Checkbox" />
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-node-id="4571:16787" data-name="Cell">
<div className="bg-[var(--$pigeongrey--100,#d9e3e8)] relative rounded-[120px] shrink-0 size-[24px]" data-node-id="I4571:16787;19393:6514" data-name="Course Hat">
<div className="absolute inset-[18.75%]" data-node-id="I4571:16787;19393:6514;663:3904" data-name="graduation-cap">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAssignment} />
</div>
</div>
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] min-w-px relative text-[color:var(--$blue--700,#00458f)] text-[length:var(--size\/300,16px)] underline" data-node-id="I4571:16787;18129:8605">
resource title
</p>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8392">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8392;1606:2451">{`Excel `}</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8393">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8393;1606:2451">
Last updated
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8394">
<div className="content-start flex flex-[1_0_0] flex-wrap gap-[var(--size\/25,4px)] gap-y-[4px] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/25,4px)] relative" data-name="Cell">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4549:8394;18131:6496" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4549:8394;18131:6496;1902:2850" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipsis} />
</div>
</div>
</div>
</div>
</div>
<div className="bg-[var(--$gray--0,white)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex items-center overflow-clip relative shrink-0 w-full" data-node-id="4549:8396" data-name="content">
<Cell className="content-stretch flex flex-col gap-[var(--size\/50,8px)] items-center min-w-[60px] pb-[14px] pt-[var(--size\/100,12px)] px-[var(--size\/50,8px)] relative shrink-0 w-[60px]" type="Checkbox" />
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-node-id="4571:16808" data-name="Cell">
<div className="bg-[var(--$pigeongrey--100,#d9e3e8)] relative rounded-[120px] shrink-0 size-[24px]" data-node-id="I4571:16808;19393:6514" data-name="Course Hat">
<div className="absolute inset-[18.75%]" data-node-id="I4571:16808;19393:6514;663:3904" data-name="graduation-cap">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAssignment} />
</div>
</div>
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] min-w-px relative text-[color:var(--$blue--700,#00458f)] text-[length:var(--size\/300,16px)] underline" data-node-id="I4571:16808;18129:8605">
[assignment title]
</p>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8399">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8399;1606:2451">
Assignment
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8400">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8400;1606:2451">
Last updated
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8401">
<div className="content-start flex flex-[1_0_0] flex-wrap gap-[var(--size\/25,4px)] gap-y-[4px] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/25,4px)] relative" data-name="Cell">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4549:8401;18131:6496" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4549:8401;18131:6496;1902:2850" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipsis} />
</div>
</div>
</div>
</div>
</div>
<div className="bg-[var(--$gray--100,#f4f4f4)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex items-center overflow-clip relative shrink-0 w-full" data-node-id="4549:8403" data-name="content">
<div className="content-stretch flex flex-col gap-[var(--size\/50,8px)] items-center min-w-[60px] pb-[14px] pt-[var(--size\/100,12px)] px-[var(--size\/50,8px)] relative shrink-0" data-node-id="4549:8405" data-name="Cell">
<div className="bg-[var(--$green--600,#0b8356)] relative rounded-[var(--border-radius,4px)] shrink-0 size-[22px]" data-node-id="I4549:8405;1606:2455" data-name="Checkbox">
<div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[20px] top-1/2" data-node-id="I4549:8405;1606:2455;1070:2775" data-name="check">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck} />
</div>
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-node-id="4571:16814" data-name="Cell">
<div className="bg-[var(--$pigeongrey--100,#d9e3e8)] relative rounded-[120px] shrink-0 size-[24px]" data-node-id="I4571:16814;19393:6514" data-name="Course Hat">
<div className="absolute inset-[18.75%]" data-node-id="I4571:16814;19393:6514;663:3904" data-name="graduation-cap">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAssignment} />
</div>
</div>
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] min-w-px relative text-[color:var(--$blue--700,#00458f)] text-[length:var(--size\/300,16px)] underline" data-node-id="I4571:16814;18129:8605">
resource title
</p>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8406">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8406;1606:2451">
Word
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8407">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8407;1606:2451">
Last updated
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8408">
<div className="content-start flex flex-[1_0_0] flex-wrap gap-[var(--size\/25,4px)] gap-y-[4px] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/25,4px)] relative" data-name="Cell">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4549:8408;18131:6496" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4549:8408;18131:6496;1902:2850" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipsis} />
</div>
</div>
</div>
</div>
</div>
<div className="bg-[var(--$gray--0,white)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex items-center overflow-clip relative shrink-0 w-full" data-node-id="4549:8410" data-name="content">
<Cell className="content-stretch flex flex-col gap-[var(--size\/50,8px)] items-center min-w-[60px] pb-[14px] pt-[var(--size\/100,12px)] px-[var(--size\/50,8px)] relative shrink-0" type="Checkbox" />
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-node-id="4571:16829" data-name="Cell">
<div className="bg-[var(--$pigeongrey--100,#d9e3e8)] relative rounded-[120px] shrink-0 size-[24px]" data-node-id="I4571:16829;19393:6514" data-name="Course Hat">
<div className="absolute inset-[18.75%]" data-node-id="I4571:16829;19393:6514;663:3904" data-name="graduation-cap">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAssignment} />
</div>
</div>
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] min-w-px relative text-[color:var(--$blue--700,#00458f)] text-[length:var(--size\/300,16px)] underline" data-node-id="I4571:16829;18129:8605">
resource title
</p>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8413">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8413;1606:2451">
Image
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8414">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8414;1606:2451">
Last updated
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8415">
<div className="content-start flex flex-[1_0_0] flex-wrap gap-[var(--size\/25,4px)] gap-y-[4px] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/25,4px)] relative" data-name="Cell">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4549:8415;18131:6496" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4549:8415;18131:6496;1902:2850" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipsis} />
</div>
</div>
</div>
</div>
</div>
<div className="bg-[var(--$gray--0,white)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex items-center overflow-clip relative shrink-0 w-full" data-node-id="4549:8417" data-name="content">
<Cell className="content-stretch flex flex-col gap-[var(--size\/50,8px)] items-center min-w-[60px] pb-[14px] pt-[var(--size\/100,12px)] px-[var(--size\/50,8px)] relative shrink-0" type="Checkbox" />
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-node-id="4571:16841" data-name="Cell">
<div className="bg-[var(--$pigeongrey--100,#d9e3e8)] relative rounded-[120px] shrink-0 size-[24px]" data-node-id="I4571:16841;19393:6514" data-name="Course Hat">
<div className="absolute inset-[18.75%]" data-node-id="I4571:16841;19393:6514;663:3904" data-name="graduation-cap">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAssignment} />
</div>
</div>
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] min-w-px relative text-[color:var(--$blue--700,#00458f)] text-[length:var(--size\/300,16px)] underline" data-node-id="I4571:16841;18129:8605">
[assignment title]
</p>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8420">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8420;1606:2451">
Assignment
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8421">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--size\/50,8px)] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative" data-name="Cell">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px relative text-[color:var(--$text,#333)] text-[length:var(--size\/300,16px)]" data-node-id="I4549:8421;1606:2451">
Last updated
</p>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="4549:8422">
<div className="content-start flex flex-[1_0_0] flex-wrap gap-[var(--size\/25,4px)] gap-y-[4px] h-full items-start min-w-px px-[var(--size\/50,8px)] py-[var(--size\/25,4px)] relative" data-name="Cell">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4549:8422;18131:6496" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4549:8422;18131:6496;1902:2850" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipsis} />
</div>
</div>
</div>
</div>
</div>
</div>
<div className="bg-[var(--$card-background,white)] border border-[var(--$outline,#e1e1e1)] border-solid content-stretch flex items-start overflow-clip pl-[var(--size\/300,16px)] pr-[var(--size\/50,8px)] py-[var(--size\/50,8px)] relative rounded-[var(--size\/25,4px)] shrink-0 w-[1120px]" data-node-id="4571:16720" data-name="Bulk actions panel">
<div className="content-stretch flex flex-[1_0_0] gap-[16px] items-start min-w-px relative" data-node-id="I4571:16720;18318:9021" data-name="panel">
<div className="[word-break:break-word] content-stretch flex gap-[var(--size\/10,2px)] items-center leading-[1.5] not-italic pt-[8px] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] whitespace-nowrap" data-node-id="I4571:16720;18318:9022" data-name="items selected">
<p className="font-[family-name:var(--default-font,'Lato:Bold')] relative shrink-0" data-node-id="I4571:16720;18318:9023">
2
</p>
<p className="font-[family-name:var(--default-font,'Lato:Regular')] relative shrink-0" data-node-id="I4571:16720;18318:9024">
selected out of 40
</p>
</div>
<div className="content-stretch flex flex-[1_0_0] items-start justify-between min-w-px relative" data-node-id="I4571:16720;18318:9025" data-name="buttons">
<div className="content-center flex flex-wrap gap-[var(--size\/100,12px)] items-center max-w-[712px] relative shrink-0 w-[608px]" data-node-id="I4571:16720;18318:9026" data-name="actions">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center pl-[var(--size\/25,4px)] pr-[var(--size\/50,8px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4571:16720;18318:9027" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4571:16720;18318:9027;1915:3317" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDownload} />
</div>
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$brand--700,#5d4a68)] text-[length:var(--size\/300,16px)] text-center whitespace-nowrap" data-node-id="I4571:16720;18318:9027;1915:3318">
Download
</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] items-start relative self-stretch shrink-0" data-node-id="I4571:16720;18318:9033" data-name="clear">
<div className="flex h-full items-center justify-center relative shrink-0 w-0" data-node-id="I4571:16720;18318:9034" style={{ containerType: "size" }}>
<div className="flex-none rotate-90 w-[100cqh]">
<div className="h-0 relative w-full" data-name="Divider">
<div className="absolute inset-[-0.5px_-1.25%]">
<img alt="" className="block max-w-none size-full" src={imgDivider} />
</div>
</div>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center pl-[var(--size\/25,4px)] pr-[var(--size\/50,8px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4571:16720;18318:9035" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4571:16720;18318:9035;1915:3317" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgXmark1} />
</div>
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$brand--700,#5d4a68)] text-[length:var(--size\/300,16px)] text-center whitespace-nowrap" data-node-id="I4571:16720;18318:9035;1915:3318">
Clear selection
</p>
</div>
</div>
</div>
</div>
</div>
<Pagination className="content-stretch flex gap-[var(--size\/300,16px)] items-center justify-end relative rounded-[40px] shrink-0 w-full" />
</div>
</div>
</div>
</div>
</div>
);
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.

1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
   DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
These styles are contained in the design: Body large: Font(family: "default-font", style: Regular, size: Size/300, weight: 400, lineHeight: 1.5, letterSpacing: 0), Base: Font(family: "default-font", style: regular, size: Size/300, weight: 400, lineHeight: 1.5, letterSpacing: 0), Title M: Font(family: "default-font", style: bold, size: Size/400, weight: 700, lineHeight: 1.5, letterSpacing: 0), Gray/900: #333333, Gray/700: #565656, Gray/300: #E1E1E1, layer-shadow: Effect(type: DROP_SHADOW, color: #0000000D, offset: (0, 4), radius: 8, spread: 0), Links/Base small secondary link: Font(family: "default-font", style: regular, size: Size/200, weight: 400, lineHeight: 1.5, letterSpacing: 0), Title XL: Font(family: "default-font", style: bold, size: Size/800, weight: 700, lineHeight: 1.5, letterSpacing: 0), Base small: Font(family: "default-font", style: regular, size: Size/200, weight: 400, lineHeight: 1.5, letterSpacing: 0), Base strong: Font(family: "default-font", style: bold, size: Size/300, weight: 700, lineHeight: 1.5, letterSpacing: 0), Base small strong: Font(family: "default-font", style: bold, size: Size/200, weight: 700, lineHeight: 1.5, letterSpacing: 0), Links/Base primary link: Font(family: "default-font", style: bold, size: Size/300, weight: 700, lineHeight: 1.5, letterSpacing: 0), Display small: Font(family: "default-font", style: Bold, size: Size/200, weight: 700, lineHeight: 1.5, letterSpacing: 0), Body regular: Font(family: "default-font", style: Regular, size: Size/200, weight: 400, lineHeight: 1.5, letterSpacing: 0).
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Navigation

**Node ID:** 4016:6647

Menu

**Documentation:**

- [https://styleguide.itsbuild.net/assets/patterns/MainMenu/v1/](https://styleguide.itsbuild.net/assets/patterns/MainMenu/v1/)

## Search

**Node ID:** 4016:5924

Usage
-----

This Figma component represents 2 components in Prometheus: SearchInput and GlobalSearch.

**Global=false (**[**searchinput**](https://styleguide.itsbuild.net/assets/inputs/SearchInput/v1/)**)** can be used on each page where we have search as you type, and it doesn't require from user confirmation.

- can be combined with filters

**Global=true (**[**Globalesearch**](https://styleguide.itsbuild.net/assets/inputs/GlobalSearch/v1/)**)** can be used in navigation and search result page. Used when we require confirmation form user to start the searching mechanism

Auto-complete
-------------

- For SearchInput only.
- The text field can be combined with auto-complete functionality, to facilitate the introduction of Names and entries from databases.

Keywords
--------

search, global, input

**Documentation:**

- [https://styleguide.itsbuild.net/assets/inputs/SearchInput/v1/](https://styleguide.itsbuild.net/assets/inputs/SearchInput/v1/)

## Button

**Node ID:** 4016:5507

Usage
-----

1.  **Large** is a default size of the button. The small size can be used in some specific cases when the large one is too big.
2.  The button width depends on its label.
3.  The button can't lead to another page — use the [link](https://styleguide.itsbuild.net/assets/Navigation/Link/v1/) instead.
4.  **Truncate** button's label if it doesn’t fit. Button label should never wrap. Avoid such long labels and translations. Truncating is a way to handle exception cases, but in the end the copy has to be updated.

Loading
-------

The button can be in the loading state: the button text is hidden and a spinner is shown in its place. Maintain the width that it would have if the text were visible. For examples, see the Styleguide.

Row of actions
--------------

1.  The distance between actions is defined in the variable **actions-gap**.
2.  The behaviour of a row of actions is handled by the [ButtonGroup](https://styleguide.itsbuild.net/assets/inputs/ButtonGroup/v1/) component. We don't have any analogue in Figma, for designers it is simple row inside an Auto Layout. Feel free to the refer to the ButtonGroup component in communication with developers.

**Documentation:**

- [https://styleguide.itsbuild.net/assets/inputs/Button/v1/](https://styleguide.itsbuild.net/assets/inputs/Button/v1/)

## magnifying-glass

**Node ID:** 2275:4351

search

## bell

**Node ID:** 4016:6527

bell, notification

## comment

**Node ID:** 4016:6535

Not in Semiotic comment, messages

## Avatar

**Node ID:** 4016:6537

Usage
-----

The avatar component has a predefined set of sizes:

- 100: **24x24** (size--700)
- 200: **32x32** (size--900)
- 300: **48x48** (size--1100)
- 400: **64x64** (size--1200)
- 500: **80x80** (size--1300)
- 600: **96x96** (size--1400)

Please use only these options. If some other size is crucial, please contact the UX team.

Keywords
--------

User, person, userpic

**Documentation:**

- [https://styleguide.itsbuild.net/assets/nodes/Avatar/v1/](https://styleguide.itsbuild.net/assets/nodes/Avatar/v1/)

## Editable=False

**Node ID:** 4680:12985

Usage
-----

1.  This component represents 2 components in Prometheus: [PageHeader](https://styleguide.itsbuild.net/assets/patterns/PageHeader/v1/) and [PageHeaderEditable](https://styleguide.itsbuild.net/assets/patterns/PageHeaderEditable/v1/).
2.  The optional like can concatenate several text lines divided by the bullet symbol. This solution can be done accessibly (Mikhail Voronov has created a code for this solution, it can be reused in any place).
3.  The editable option in Figma needs some tweaks when the title is long or the screen is narrow.

**Documentation:**

- [https://styleguide.itsbuild.net/assets/patterns/PageHeader/v1/](https://styleguide.itsbuild.net/assets/patterns/PageHeader/v1/)

## PageHeader

**Node ID:** 4680:12984

Usage
-----

1.  This component represents 2 components in Prometheus: [PageHeader](https://styleguide.itsbuild.net/assets/patterns/PageHeader/v1/) and [PageHeaderEditable](https://styleguide.itsbuild.net/assets/patterns/PageHeaderEditable/v1/).
2.  The Subtitle concatenates several text lines divided by the bullet symbol. This solution can be done accessibly (Mikhail Voronov has created a code for this solution, it can be reused in any place). Please don't use like break and complex structure in the subtitle.
3.  The editable option in Figma needs some tweaks when the title is long or the screen is narrow. Check the component in the Styleguide.

**Documentation:**

- [https://styleguide.itsbuild.net/assets/patterns/PageHeader/v1/](https://styleguide.itsbuild.net/assets/patterns/PageHeader/v1/)

## Breadcrumb trail

**Node ID:** 4680:9561

How to use:
===========

1.  can be used as a additional navigation when there are multiple levels of hierarchy
2.  for smaller screens wrap into multiline
3.  when used inside PageHeader do not show current location!

For more guidelines please check:

[https://www.figma.com/design/NcOdZ7kMoI18os0UibrVk6/Breadcrumbs?node-id=1-2](https://www.figma.com/design/NcOdZ7kMoI18os0UibrVk6/Breadcrumbs?node-id=1-2)

Keywords:
=========

breadcrumb, breadcrumbs, trail

## chevron-right

**Node ID:** 4676:10993

arrow, right

## Banner

**Node ID:** 4676:9879

Usage
-----

1.  Banners are shown inside the [Banner Area](https://styleguide.itsbuild.net/assets/feedback/BannerArea/v1/) component.
2.  Banners are usually located at the top of a page or section and take the full width of their container.
3.  Put the banner as close to relevant content as possible.
4.  Banner should be dismissible unless it contains critical information or an important step a user needs to take.
5.  Don’t use it as a the only way to access information or action one needs on a regular basis.
6.  Help banners can be displayed near the items they are related to (for example, in the middle of the form)

Content
-------

A banner is a container that, from the technical standpoint, can contain anything, including buttons, links, images etc. Note that there’re **accessibility concerns** about having interactive controls like links or buttons in not persistent banner since the focus is not move to it once it appear on a page.

---

Writing
-------

[Writing guidelines for banners](https://sanoma-learning.atlassian.net/wiki/spaces/GM2/pages/82144369/UX+writing+guidelines+for+components#UXwritingguidelinesforcomponents-banners)

Keywords
--------

alert, feedback, message

**Documentation:**

- [https://styleguide.itsbuild.net/assets/feedback/Banner/v1/](https://styleguide.itsbuild.net/assets/feedback/Banner/v1/)

## Button

**Node ID:** 4675:10050

Usage
-----

1.  **Large** is a default size of the button. The small size can be used in some specific cases when the large one is too big.
2.  The button width depends on its label.
3.  The button can't lead to another page — use the [link](https://styleguide.itsbuild.net/assets/Navigation/Link/v1/) instead.
4.  **Truncate** button's label if it doesn’t fit. Button label should never wrap. Avoid such long labels and translations. Truncating is a way to handle exception cases, but in the end the copy has to be updated.

Loading
-------

The button can be in the loading state: the button text is hidden and a spinner is shown in its place. Maintain the width that it would have if the text were visible. For examples, see the Styleguide.

Row of actions
--------------

1.  The distance between actions is defined in the variable **actions-gap**.
2.  The behaviour of a row of actions is handled by the [ButtonGroup](https://styleguide.itsbuild.net/assets/inputs/ButtonGroup/v1/) component. We don't have any analogue in Figma, for designers it is simple row inside an Auto Layout. Feel free to the refer to the ButtonGroup component in communication with developers.

**Documentation:**

- [https://styleguide.itsbuild.net/assets/inputs/Button/v1/](https://styleguide.itsbuild.net/assets/inputs/Button/v1/)

## xmark

**Node ID:** 4571:11998

close, remove

## Search

**Node ID:** 4680:12012

Usage
-----

This Figma component represents 2 components in Prometheus: SearchInput and GlobalSearch.

**Global=false (**[**searchinput**](https://styleguide.itsbuild.net/assets/inputs/SearchInput/v1/)**)** can be used on each page where we have search as you type, and it doesn't require from user confirmation.

- can be combined with filters

**Global=true (**[**Globalesearch**](https://styleguide.itsbuild.net/assets/inputs/GlobalSearch/v1/)**)** can be used in navigation and search result page. Used when we require confirmation form user to start the searching mechanism

Auto-complete
-------------

- For SearchInput only.
- The text field can be combined with auto-complete functionality, to facilitate the introduction of Names and entries from databases.

Keywords
--------

search, global, input

**Documentation:**

- [https://styleguide.itsbuild.net/assets/inputs/SearchInput/v1/](https://styleguide.itsbuild.net/assets/inputs/SearchInput/v1/)

## magnifying-glass

**Node ID:** 4680:12010

search

## caret-down

**Node ID:** 4573:8425

expand, arrow, down

## Cell

**Node ID:** 4978:10912

How to use:
-----------

1.  use cell component to build row and tables
2.  icon call need to have a visible label next to it
3.  action cell always show 1 button, if more then 1 action use icon only with ellipsis icon, show actions in drop down

**Sort:**

1.  to show sorting changes, change icon to increase/decrease sorting and background of a cell to Brand/100

Figma file: [https://www.figma.com/design/8gsaOc6G4f4GcpxOryCcKR/Filter-Area-%2B-Table-template?node-id=4366-19238&node-type=section&t=R0DKmavklfAfkWa8-11](https://www.figma.com/design/8gsaOc6G4f4GcpxOryCcKR/Filter-Area-%2B-Table-template?node-id=4366-19238&node-type=section&t=R0DKmavklfAfkWa8-11)

**Deprecated:**

1.  switch cell - switch should be under action drop down
2.  input cell
3.  multiple action cell

**Documentation:**

- [https://styleguide.itsbuild.net/assets/lists/Cell/v1/](https://styleguide.itsbuild.net/assets/lists/Cell/v1/)

## Checkbox

**Node ID:** 4571:13623

**Documentation:**

- [https://styleguide.itsbuild.net/assets/inputs/Checkbox/v1/](https://styleguide.itsbuild.net/assets/inputs/Checkbox/v1/)

## check

**Node ID:** 4571:13619

check, complete, task

## ellipsis

**Node ID:** 4676:8755

3-dot, dots, ellipsis, options, more

## Variant=Desktop

**Node ID:** 4978:11049

Usage
-----

- This is a template component — please **detach it** before using as a starting point for your mockups. Don't worry, actual styles are at the level of Cells, so if the table style changes in the future, your mockups will be updated.
- Once detached, **make a new, local component** out of it. It keeps the shared styles connected but the content of your table is completely independent and nothing from outside would be able to break it. You may have as many local row components as you need.
- Adjust the number of columns in the local row component. You can change the type of content to one of predefined ones, or create something new. It is recommended to change text in the text cell to the name of the column.
- Put as many instances of your local row component as you need to the [List](https://www.figma.com/file/p3JEpXtd3He8nBXat7n1tY/itslearning-Web-UI-kit?type=design&node-id=1606-2444&mode=design&t=JAmqVT6FZlYwzFyL-4) template. A row takes the full available width.
- To create a table header row, select all cells inside the 1st row instance in a list and toggle the "Header" parameter.

Keywords
--------

Template, blueprint

## Bulk actions panel

**Node ID:** 4978:11048

How to use:
-----------

1.  use bulk panel for bulk actions in table
2.  change numbers on the panel
3.  display actions available only in bulk
4.  wrap buttons if they do not fit into one line

Figma file:

[https://www.figma.com/design/8gsaOc6G4f4GcpxOryCcKR/Filter-Area-%2B-Table-template?node-id=4371-26576&node-type=section&t=S4I9Ms6ePwmtx7s9-11](https://www.figma.com/design/8gsaOc6G4f4GcpxOryCcKR/Filter-Area-%2B-Table-template?node-id=4371-26576&node-type=section&t=S4I9Ms6ePwmtx7s9-11)

## Pagination

**Node ID:** 4680:14009

Usage
-----

1.  When there is only 1 page, the pages are not visible.
2.  The control of the number of element in the list is optional.
3.  The component is in implementation now.
4.  When there is only 1 page, **hide** the component.

Keywords
--------

Pages

**Documentation:**

- [https://styleguide.itsbuild.net/assets/Navigation/Pagination/v1/](https://styleguide.itsbuild.net/assets/Navigation/Pagination/v1/)

## chevron-left

**Node ID:** 4680:13994

arrow, left

## Select

**Node ID:** 4680:13737

Usage
-----

- Use when there’re 5+ options.
- Use for the least important actions so the user isn’t distracted by secondary tasks.
- Can also be used for a set of actions that won’t fit in the available screen space.

Label on the left
-----------------

Label on the left should not be used in forms. It can be helpful in toolbars above lists or tables. Label on the left would not work for multiline version of component.

Keywords
--------

select, dropdown

**Documentation:**

- [https://styleguide.itsbuild.net/assets/inputs/Select/v1/](https://styleguide.itsbuild.net/assets/inputs/Select/v1/)
  Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
  Some elements have annotation data attributes. They provide extra information about how the element should be implemented.IMPORTANT: Do not ignore these annotation attributes. They should not appear in your final code.
