const assetPathPrefix = "https://www.figma.com/api/mcp/asset/548c785c-5a2b-42e5-8c05-e8776fe10c44";
const imgPenRuler = `${assetPathPrefix}/199ca.svg`;
const imgChevronLeft = `${assetPathPrefix}/f0303.svg`;
const imgChevronRight = `${assetPathPrefix}/48584.svg`;
const imgCaretDown = `${assetPathPrefix}/5a297.svg`;
const imgChevronRight1 = `${assetPathPrefix}/e0a99.svg`;
const imgPhoto = `${assetPathPrefix}/19894.png`;
const imgGroupFalse = `${assetPathPrefix}/70bc9.svg`;
const imgItslearningLogoSymbol = `${assetPathPrefix}/efe3e.svg`;
const imgMagnifyingGlass = `${assetPathPrefix}/908b0.svg`;
const imgBell = `${assetPathPrefix}/15a55.svg`;
const imgComment = `${assetPathPrefix}/181c8.svg`;
const imgGraduationCap = `${assetPathPrefix}/30415.svg`;
const imgEllipsis = `${assetPathPrefix}/71cde.svg`;
const imgSharedFolders = `${assetPathPrefix}/c078e.svg`;
const imgEllipsis1 = `${assetPathPrefix}/fd2a8.svg`;
const imgMagnifyingGlass1 = `${assetPathPrefix}/be6f0.svg`;
const imgChevronRight2 = `${assetPathPrefix}/92937.svg`;
const imgCaretDown1 = `${assetPathPrefix}/9ef9a.svg`;
const imgArrowUpArrowDown = `${assetPathPrefix}/f913f.svg`;
const imgDocx = `${assetPathPrefix}/eee5e.svg`;
const imgEllipsis2 = `${assetPathPrefix}/10ddd.svg`;
const imgArrowTurnDownRight = `${assetPathPrefix}/0d8c5.svg`;
const imgDownload = `${assetPathPrefix}/90a36.svg`;
const imgTrash = `${assetPathPrefix}/d9b5b.svg`;
const imgEye = `${assetPathPrefix}/465b3.svg`;
const imgTimer = `${assetPathPrefix}/905f7.svg`;
const imgUsers = `${assetPathPrefix}/3fa11.svg`;
const imgArrow = `${assetPathPrefix}/2aed3.svg`;

type ToolsProps = {
className?: string;
tools?: "Yes";
};

function Tools({ className, tools = "Yes" }: ToolsProps) {
return (
<div className={className || "content-stretch flex flex-col gap-[8px] items-start relative w-[360px]"} data-node-id="4994:14459">
<div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="4994:14449" data-name="wrapper">
<div className="relative shrink-0 size-[24px]" data-node-id="4994:14450" data-name="pen-ruler">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPenRuler} />
</div>
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] w-[328px]" data-node-id="4994:14451">
Tools
</p>
</div>
<div className="content-stretch flex flex-col items-center justify-center overflow-clip pl-[var(--size\/100,12px)] relative shrink-0 w-full" data-node-id="4994:14452" data-name="Details">
<ul className="[word-break:break-word] block font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/200,14px)] w-full" data-node-id="4994:14453">
<li className="list-disc ms-[21px]">
<span className="leading-[1.5]">Microsoft Word, Excel and PowerPoint, Page</span>
</li>
</ul>
</div>
</div>
);
}

type PaginationProps = {
className?: string;
collapsed?: "False";
itemsPerPage?: boolean;
};

function Pagination({ className, collapsed = "False", itemsPerPage = true }: PaginationProps) {
return (
<div className={className || "content-stretch flex gap-[var(--size\\/300,16px)] items-center justify-end relative rounded-[40px] w-[1160px]"} data-node-id="5512:7935">
<div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="5512:7937">
<div className="content-stretch flex flex-[1_0_0] gap-[8px] h-full items-center min-w-px relative" data-name="Pager">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="5512:7938" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I5512:7938;1902:2859" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft} />
</div>
</div>
<div className="bg-[var(--$brand--700,#5d4a68)] content-stretch flex flex-col gap-[var(--size\/25,4px)] h-[40px] items-center justify-center px-[var(--size\/300,16px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="5512:7939" data-name=".Page link">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--0,white)] text-[length:var(--size\/200,14px)] text-center whitespace-nowrap" data-node-id="I5512:7939;4997:6344">
1
</p>
</div>
<div className="content-stretch flex flex-col gap-[var(--size\/25,4px)] h-[40px] items-center justify-center px-[var(--size\/300,16px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="5512:7940" data-name=".Page link">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] text-center whitespace-nowrap" data-node-id="I5512:7940;4997:6338">
2
</p>
</div>
<div className="content-stretch flex flex-col gap-[var(--size\/25,4px)] h-[40px] items-center justify-center px-[var(--size\/300,16px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="5512:7941" data-name=".Page link">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] text-center whitespace-nowrap" data-node-id="I5512:7941;4997:6338">
3
</p>
</div>
<div className="content-stretch flex flex-col gap-[var(--size\/25,4px)] h-[40px] items-center justify-center px-[var(--size\/300,16px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="5512:7942" data-name=".Page link">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] text-center whitespace-nowrap" data-node-id="I5512:7942;4997:6338">
4
</p>
</div>
<div className="content-stretch flex flex-col gap-[var(--size\/25,4px)] h-[40px] items-center justify-center px-[var(--size\/300,16px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="5512:7943" data-name=".Page link">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] text-center whitespace-nowrap" data-node-id="I5512:7943;4997:6338">
5
</p>
</div>
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="5512:7944" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I5512:7944;1902:2850" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight} />
</div>
</div>
</div>
</div>
{itemsPerPage && (
<div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="5512:7945" data-name="Control">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/200,14px)] text-center whitespace-nowrap" data-node-id="5512:7946">
1 to 10 of 47
</p>
<div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[80px]" data-node-id="5512:7947" data-name="Select">
<div className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid content-stretch flex gap-[var(--size\/50,8px)] h-[40px] items-center overflow-clip pl-[var(--size\/100,12px)] pr-[40px] py-[var(--size\/25,4px)] relative rounded-[var(--border-radius,4px)] shrink-0 w-full" data-node-id="I5512:7947;29:7275" data-name="Input">
<p className="[word-break:break-word] flex-[1_0_0] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] min-w-px overflow-hidden relative text-[16px] text-[color:var(--$gray--900,#333)] text-ellipsis whitespace-nowrap" data-node-id="I5512:7947;29:7276">
10
</p>
<div className="absolute right-[6px] size-[24px] top-[6px]" data-node-id="I5512:7947;1429:2756" data-name="caret-down">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCaretDown} />
</div>
</div>
</div>
</div>
)}
</div>
);
}

type CheckboxProps = {
className?: string;
partial?: "False";
selected?: "False";
state?: "Default";
};

function Checkbox({ className, partial = "False", selected = "False", state = "Default" }: CheckboxProps) {
return <div className={className || "bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid relative rounded-[var(--border-radius,4px)] size-[22px]"} data-node-id="5483:3567" />;
}

type BreadcrumbTrailProps = {
className?: string;
currentLocation?: boolean;
};

function BreadcrumbTrail({ className, currentLocation = true }: BreadcrumbTrailProps) {
return (
<div className={className || "content-center flex flex-wrap gap-[var(--size\\/50,8px)] items-center relative w-[587px]"} data-node-id="5483:11343" data-name="Breadcrumb trail">
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-start py-[var(--size\/25,4px)] relative shrink-0" data-node-id="5483:11344" data-name="Breadcrumb">
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] underline whitespace-nowrap" data-node-id="I5483:11344;19853:6315">
Root page
</p>
</div>
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-start py-[var(--size\/25,4px)] relative shrink-0" data-node-id="5483:11345" data-name="Breadcrumb">
<div className="content-stretch flex items-center pt-[var(--size\/10,2px)] relative shrink-0 w-[16px]" data-node-id="I5483:11345;19853:6313" data-name="icon wrapper">
<div className="flex-[1_0_0] h-[16px] min-w-px relative" data-node-id="I5483:11345;19853:6314" data-name="chevron-right">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight1} />
</div>
</div>
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] underline whitespace-nowrap" data-node-id="I5483:11345;19853:6315">
Breadcrumb
</p>
</div>
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-start py-[var(--size\/25,4px)] relative shrink-0" data-node-id="5483:11346" data-name="Breadcrumb">
<div className="content-stretch flex items-center pt-[var(--size\/10,2px)] relative shrink-0 w-[16px]" data-node-id="I5483:11346;19853:6313" data-name="icon wrapper">
<div className="flex-[1_0_0] h-[16px] min-w-px relative" data-node-id="I5483:11346;19853:6314" data-name="chevron-right">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight1} />
</div>
</div>
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] underline whitespace-nowrap" data-node-id="I5483:11346;19853:6315">
Breadcrumb
</p>
</div>
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-start py-[var(--size\/25,4px)] relative shrink-0" data-node-id="5483:11347" data-name="Breadcrumb">
<div className="content-stretch flex items-center pt-[var(--size\/10,2px)] relative shrink-0 w-[16px]" data-node-id="I5483:11347;19853:6313" data-name="icon wrapper">
<div className="flex-[1_0_0] h-[16px] min-w-px relative" data-node-id="I5483:11347;19853:6314" data-name="chevron-right">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight1} />
</div>
</div>
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] underline whitespace-nowrap" data-node-id="I5483:11347;19853:6315">
Breadcrumb
</p>
</div>
{currentLocation && (
<div className="content-stretch flex gap-[var(--size\/25,4px)] items-start py-[var(--size\/25,4px)] relative shrink-0" data-node-id="5483:11348" data-name="Breadcrumb">
<div className="content-stretch flex items-center pt-[var(--size\/10,2px)] relative shrink-0 w-[16px]" data-node-id="I5483:11348;19853:6317" data-name="icon wrapper">
<div className="flex-[1_0_0] h-[16px] min-w-px relative" data-node-id="I5483:11348;19853:6318" data-name="chevron-right">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight1} />
</div>
</div>
<p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] underline whitespace-nowrap" data-node-id="I5483:11348;19853:6319">
Breadcrumb
</p>
<div className="content-stretch flex items-center pt-[var(--size\/10,2px)] relative shrink-0 w-[16px]" data-node-id="I5483:11348;22038:9460" data-name="icon wrapper">
<div className="flex-[1_0_0] h-[16px] min-w-px relative" data-node-id="I5483:11348;22038:9461" data-name="chevron-right">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight1} />
</div>
</div>
</div>
)}
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
<div className={className || "overflow-clip relative rounded-[120px] size-[32px]"} data-node-id="2275:4904">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroupFalse} />
{photo && (
<div className="absolute inset-0" data-node-id="2275:4908" data-name="Photo">
<img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPhoto} />
</div>
)}
</div>
);
}

export default function SharedFolderTeacherView() {
return (
<div className="bg-[var(--$gray--150,#f2f2f2)] content-stretch flex flex-col items-center relative size-full" data-node-id="4200:13792" data-name="Shared folder - teacher view">
<div className="content-stretch drop-shadow-[0px_4px_4px_rgba(0,0,0,0.05)] flex flex-col items-start relative shrink-0 w-full" data-node-id="4200:13793" data-name="Navigation">
<div className="bg-[var(--$gray--0,white)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex h-[56px] items-center px-[var(--size\/25,4px)] relative shrink-0 w-full" data-node-id="I4200:13793;9976:10654" data-name=".Main menu">
<div className="content-stretch flex h-full items-center px-[var(--size\/50,8px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10654;9976:10621" data-name="Logo area">
<div className="relative shrink-0 size-[32px]" data-node-id="I4200:13793;9976:10654;9976:10622" data-name="itslearning-logo-symbol">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgItslearningLogoSymbol} />
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px relative" data-node-id="I4200:13793;9976:10654;9976:10623" data-name="Main menu">
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10654;9976:10624" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4200:13793;9976:10654;9976:10624;9976:10576">
<p className="leading-[1.5]">Courses</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10654;13432:5117" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4200:13793;9976:10654;13432:5117;9976:10576">
<p className="leading-[1.5]">Updates</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10654;15220:17430" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4200:13793;9976:10654;15220:17430;9976:10576">
<p className="leading-[1.5]">Groups</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10654;9976:10626" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4200:13793;9976:10654;9976:10626;9976:10576">
<p className="leading-[1.5]">Calendar</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10654;9976:10627" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4200:13793;9976:10654;9976:10627;9976:10576">
<p className="leading-[1.5]">Library</p>
</div>
</div>
</div>
<div className="content-stretch flex h-full items-start justify-end pl-[var(--size\/700,24px)] relative shrink-0" data-node-id="I4200:13793;9976:10654;9976:10630" data-name="Personal menu">
<div className="content-stretch flex h-full items-center px-[var(--size\/50,8px)] relative shrink-0" data-node-id="I4200:13793;9976:10654;11704:5608" data-name="Search wrapper">
<div className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid content-stretch flex items-start max-w-[264px] pl-[var(--size\/100,12px)] relative rounded-[var(--border-radius,4px)] shrink-0 w-[264px]" data-node-id="I4200:13793;9976:10654;11704:5609" data-name="Search">
<div className="content-stretch flex flex-col h-[16px] items-start px-[4px] py-[var(--size\/50,8px)] relative shrink-0 w-0" data-node-id="I4200:13793;9976:10654;11704:5609;17089:13616" data-name="Icon wrapper" />
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px pr-[var(--size\/25,4px)] py-[var(--size\/50,8px)] relative" data-node-id="I4200:13793;9976:10654;11704:5609;13211:9102" data-name="Text wrapper">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--600,#757575)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4200:13793;9976:10654;11704:5609;13157:8017">
Search
</p>
</div>
<div className="content-stretch flex items-start relative shrink-0" data-node-id="I4200:13793;9976:10654;11704:5609;13157:8020" data-name="Actions">
<div className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-br-[var(--border-radius,4px)] rounded-tr-[var(--border-radius,4px)] shrink-0" data-node-id="I4200:13793;9976:10654;11704:5609;13157:8022" data-name="search">
<div className="relative shrink-0 size-[24px]" data-node-id="I4200:13793;9976:10654;11704:5609;13157:8022;1902:2742" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMagnifyingGlass} />
</div>
</div>
</div>
</div>
</div>
<div className="content-stretch flex h-full items-center p-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10654;9976:10631" data-name=".Navigation item">
<div className="relative shrink-0 size-[24px]" data-node-id="I4200:13793;9976:10654;9976:10631;9976:10604" data-name="circle-dot">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBell} />
</div>
</div>
<div className="content-stretch flex h-full items-center p-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10654;9976:10635" data-name="IM">
<div className="relative shrink-0 size-[24px]" data-node-id="I4200:13793;9976:10654;9976:10635;9976:10604" data-name="circle-dot">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComment} />
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center p-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10654;9976:10636" data-name="User menu">
<Avatar className="overflow-clip relative rounded-[120px] shrink-0 size-[32px]" />
</div>
</div>
</div>
<div className="border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex h-[56px] items-center px-[var(--size\/25,4px)] relative shrink-0 w-full" data-node-id="I4200:13793;9976:10655" data-name=".Secondary menu">
<div aria-hidden className="absolute bg-[var(--$gray--50,#f9f9f9)] inset-0 pointer-events-none" />
<div className="content-stretch flex gap-[var(--size\/100,12px)] h-full items-center px-[var(--size\/50,8px)] relative shrink-0" data-node-id="I4200:13793;9976:10655;9976:10658" data-name="Course">
<div className="bg-[var(--$bronze--100,#feebbb)] relative rounded-[120px] shrink-0 size-[32px]" data-node-id="I4200:13793;9976:10655;9976:10659" data-name="Course Hat">
<div className="absolute inset-[18.75%]" data-node-id="I4200:13793;9976:10655;9976:10659;663:3906" data-name="graduation-cap">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGraduationCap} />
</div>
</div>
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/400,18px)] whitespace-nowrap" data-node-id="I4200:13793;9976:10655;9976:10660">
Natural Science 7A
</p>
</div>
<div className="content-stretch flex flex-[1_0_0] h-full items-start min-w-px relative" data-node-id="I4200:13793;9976:10655;9976:10661" data-name="Main menu">
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10655;9976:10662" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4200:13793;9976:10655;9976:10662;9976:10576">
<p className="leading-[1.5]">Overview</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10655;9976:10663" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4200:13793;9976:10655;9976:10663;9976:10576">
<p className="leading-[1.5]">Plans</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10655;9976:10664" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4200:13793;9976:10655;9976:10664;9976:10576">
<p className="leading-[1.5]">Resources</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10655;9976:10665" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4200:13793;9976:10655;9976:10665;9976:10576">
<p className="leading-[1.5]">Reports</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/50,8px)] h-full items-center px-[var(--size\/300,16px)] py-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10655;9976:10666" data-name=".Navigation item">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] justify-center leading-[0] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4200:13793;9976:10655;9976:10666;9976:10576">
<p className="leading-[1.5]">Participants</p>
</div>
</div>
</div>
<div className="content-stretch flex h-full items-center p-[var(--size\/100,12px)] relative shrink-0" data-node-id="I4200:13793;9976:10655;9976:10670" data-name=".Navigation item">
<div className="relative shrink-0 size-[24px]" data-node-id="I4200:13793;9976:10655;9976:10670;9976:10604" data-name="circle-dot">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipsis} />
</div>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_4px_8px_0px_rgba(0,0,0,0.05)]" />
</div>
</div>
<div className="content-stretch flex items-start justify-center relative shrink-0 w-full" data-node-id="4200:13794" data-name="Content area + sidebar">
<div className="content-stretch flex flex-[1_0_0] flex-col items-center min-w-px px-[var(--ca-horisontal-margin,48px)] relative" data-node-id="4200:13795" data-name="content-area-wrapper">
<div className="content-stretch flex flex-col items-center max-w-[1148px] pb-[24px] relative shrink-0 w-full" data-node-id="4200:13796" data-name="content-area">
<div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-node-id="4200:13797" data-name="PageHeader">
<div className="content-stretch flex flex-col items-start justify-end pt-[var(--size\/50,8px)] relative shrink-0 w-full" data-node-id="I4200:13797;19853:9719" data-name="Breadcrumb wrapper">
<BreadcrumbTrail className="content-center flex flex-wrap gap-[var(--size\/50,8px)] items-center relative shrink-0 w-full" />
</div>
<div className="content-stretch flex flex-col gap-[var(--size\/25,4px)] items-start py-[var(--size\/500,20px)] relative shrink-0 w-full" data-node-id="I4200:13797;5889:6338" data-name="Title and subtitle">
<div className="content-start flex flex-wrap gap-[var(--size\/100,12px)] items-start relative shrink-0 w-full" data-node-id="I4200:13797;5419:6693" data-name="Group wrapper">
<div className="content-stretch flex items-start pt-[var(--size\/25,4px)] relative shrink-0" data-node-id="I4200:13797;6487:6427" data-name="Icon wrapper">
<div className="relative shrink-0 size-[32px]" data-node-id="I4200:13797;6487:6428" data-name="file">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSharedFolders} />
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] flex-col gap-[var(--size\/25,4px)] items-start min-w-[200px] pr-[var(--size\/500,20px)] relative" data-node-id="I4200:13797;6438:6285" data-name="Content">
<div className="content-center flex flex-wrap gap-[var(--size\/100,12px)] items-center relative shrink-0 w-full" data-node-id="I4200:13797;11648:5210" data-name="Title wrapper">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] max-w-[800px] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/800,26px)] whitespace-nowrap" data-node-id="I4200:13797;5419:6694">
Donna Tartt elaboration
</p>
</div>
</div>
<div className="content-center flex flex-wrap gap-[12px] items-center relative shrink-0" data-node-id="I4200:13797;23120:8171" data-name="Actions slot">
<div className="bg-[var(--$gray--0,white)] border-2 border-[var(--$brand--400,#a997b5)] border-solid content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center p-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="I4200:13797;5823:6544" data-name="Button">
<div className="relative shrink-0 size-[24px]" data-node-id="I4200:13797;5823:6544;1902:2742" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipsis1} />
</div>
</div>
</div>
</div>
</div>
</div>
<div className="content-stretch flex gap-[var(--size\/500,20px)] items-start relative shrink-0 w-full" data-node-id="4200:13798">
<div className="content-stretch flex flex-[1_0_0] flex-col gap-[var(--size\/500,20px)] items-center min-w-px overflow-clip relative" data-node-id="4200:13799" data-name="List">
<div className="bg-[var(--$gray--0,white)] border border-[var(--$gray--300,#e1e1e1)] border-solid content-stretch flex flex-col gap-[12px] items-start px-[32px] py-[20px] relative rounded-[4px] shrink-0 w-full" data-node-id="4200:13814" data-name="Card">
<div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="4214:18783">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/300,16px)] w-full" data-node-id="4214:18782">
Description
</p>
<div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="4200:14210">
<div className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[0] relative shrink-0 text-[0px] text-[color:var(--$gray--900,#333)] w-full" data-node-id="4200:13815">
<p className="leading-[1.5] mb-0 text-[16px] whitespace-pre-wrap">Donna Louise Tartt is an American novelist. She wrote the novels The Secret History, The Little Friend, and The Goldfinch, which won the Pulitzer Prize for Fiction and was adapted into a 2019 film of the same name.</p>
<ul className="leading-[1.5] list-disc text-[16px]">
<li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
<span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['Lato:Regular'] not-italic text-[#00458f] underline">Read all about author</span>
{`(link to web content)`}
</li>
<li className="ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
<span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['Lato:Regular'] not-italic text-[#00458f] underline">You can use page about Donna Tartt</span>
{`(link to resource)`}
</li>
</ul>
</div>
</div>
</div>
</div>
<div className="bg-[var(--$gray--0,white)] border border-[var(--$gray--300,#e1e1e1)] border-solid content-stretch flex flex-col gap-[var(--size\/500,20px)] items-start px-[var(--content-block\/content-block-horisontal-padding,32px)] py-[var(--content-block\/content-block-vertical-padding,20px)] relative rounded-[4px] shrink-0 w-[728px]" data-node-id="4411:11840" data-name="Content-block">
<div className="content-stretch flex flex-col gap-[var(--content-block\/content-block-vertical-padding,20px)] items-start relative shrink-0 w-[664px]" data-node-id="4411:11841">
<div className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid content-stretch flex items-start pl-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0 w-full" data-node-id="4411:11843" data-name="Search">
<div className="content-stretch flex items-start py-[var(--size\/50,8px)] relative shrink-0" data-node-id="I4411:11843;17089:13614" data-name="Icon wrapper">
<div className="relative shrink-0 size-[24px]" data-node-id="I4411:11843;540:2074" data-name="magnifying-glass">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMagnifyingGlass1} />
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px pl-[var(--size\/25,4px)] pr-[var(--size\/100,12px)] py-[var(--size\/50,8px)] relative" data-node-id="I4411:11843;13211:8848" data-name="Text wrapper">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--600,#757575)] text-[length:var(--size\/300,16px)] whitespace-nowrap" data-node-id="I4411:11843;13211:5703">{`Search in folder `}</p>
</div>
</div>
<div className="content-start flex flex-wrap gap-[var(--actions\/actions-gap,12px)] items-start relative shrink-0 w-full" data-node-id="4411:11844" data-name="Actions">
<div className="bg-[var(--$accent--600,#008859)] content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center min-h-[40px] px-[var(--size\/700,24px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="4411:11845" data-name="Standalone link">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--0,white)] text-[length:var(--size\/300,16px)] text-center whitespace-nowrap" data-node-id="I4411:11845;18700:6730">
Add
</p>
<div className="relative shrink-0 size-[24px]" data-node-id="I4411:11845;23111:11699" data-name="chevron-right">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight2} />
</div>
</div>
<div className="bg-[var(--$brand--800,#42354a)] content-stretch flex gap-[var(--size\/25,4px)] items-center justify-center px-[var(--size\/700,24px)] py-[var(--size\/50,8px)] relative rounded-[var(--border-radius,4px)] shrink-0" data-node-id="4573:9232" data-name="Button">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--0,white)] text-[length:var(--size\/300,16px)] text-center whitespace-nowrap" data-node-id="I4573:9232;19:7334">
Actions
</p>
<div className="relative shrink-0 size-[24px]" data-node-id="I4573:9232;1902:3266" data-name="Icon placeholder">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCaretDown1} />
</div>
</div>
</div>
<div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="4411:11847">
<div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-node-id="4495:50569">
<div className="content-stretch flex items-start justify-center pt-[8px] relative shrink-0" data-node-id="4495:50570">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Regular')] font-[var(--regular,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/200,14px)] whitespace-nowrap" data-node-id="4495:50571">
1 to 10 of 47
</p>
</div>
<div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-node-id="4495:50573">
<div className="content-stretch flex gap-[var(--size\/50,8px)] items-start py-[var(--size\/50,8px)] relative shrink-0" data-node-id="4495:50574" data-name="Checkbox">
<Checkbox className="bg-[var(--$gray--0,white)] border-2 border-[var(--$gray--600,#757575)] border-solid relative rounded-[var(--border-radius,4px)] shrink-0 size-[22px]" />
<div className="content-stretch flex flex-col gap-[var(--size\/25,4px)] items-start relative shrink-0" data-node-id="I4495:50574;1144:2743" data-name="Content">
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$text,#333)] text-[length:var(--size\/200,14px)] w-full" data-node-id="I4495:50574;911:2219">
Select all visible
</p>
</div>
</div>
<p className="[word-break:break-word] font-[family-name:var(--default-font,'Lato:Bold')] font-[var(--bold,normal)] leading-[1.5] relative shrink-0 text-[color:var(--$gray--900,#333)] text-[length:var(--size\/200,14px)] whitespace-nowrap" data-node-id="4495:50575">
(10)
</p>
</div>
</div>
<div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="4411:11853" data-name="table">
<div className="bg-[var(--$gray--0,white)] border-[var(--$gray--300,#e1e1e1)] border-b border-solid content-stretch flex items-center overflow-clip relative shrink-0 w-full" data-node-id="4411:11854" data-name="🛠️ Row">
<div className="bg-[var(--$gray--50,#f9f9f9)] content-stretch flex items-start min-h-[32px] min-w-[60px] px-[var(--size\/50,8px)] relative shrink-0" data-node-id="I4411:11854;4088:16271" data-name="Cell">
<div className="content-stretch flex items-center justify-center py-[5px] relative shrink-0" data-node-id="I4411:11854;4088:16271;20752:12410" data-name="label wrapper">
