const assetPathPrefix = "https://www.figma.com/api/mcp/asset/fc65805b-91c9-492c-8b1d-e69fbb520373";
const imgLogo = `${assetPathPrefix}/32664.png`;
const imgAvatarContent = `${assetPathPrefix}/0b42d.svg`;
const imgMask = `${assetPathPrefix}/37b56.svg`;
const imgRectangle1192 = `${assetPathPrefix}/a4db3.svg`;
const imgIconColorMask = `${assetPathPrefix}/95dc3.svg`;

type SelectDividerProps = {
className?: string;
size?: "MD";
};

function SelectDivider({ className, size = "MD" }: SelectDividerProps) {
return (
<div className={className || "content-stretch flex h-[var(--size\\/250,20px)] items-center px-[var(--space-new\\/xs,4px)] relative"} data-node-id="33130:92562">
<div className="bg-[#d9d9d9] h-[24px] relative shrink-0 w-px" data-node-id="33130:92564" />
</div>
);
}

export default function FamUsers() {
return (
<div className="bg-white border-2 border-[var(--color\/palette\/grey\/900,#222)] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[4px] size-full" data-node-id="17264:29098" data-name="FAM - Users">
<div className="bg-[#02242e] content-stretch flex gap-[545px] h-[50px] items-center pl-[16px] pr-[20px] relative shrink-0 w-full" data-node-id="17264:29099" data-name="top nav bar">
<div className="content-stretch flex flex-col h-[40px] items-start pl-[6px] pr-[10px] py-[10px] relative shrink-0 w-[181px]" data-node-id="I17264:29099;1481:4133">
<div className="h-[20px] relative shrink-0 w-[155px]" data-node-id="I17264:29099;1481:4109" data-name="logo">
<img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center justify-end min-w-px relative" data-node-id="I17264:29099;1481:4132">
<div className="flex flex-row items-center self-stretch" data-node-id="I17264:29099;23066:86145">
<div className="content-stretch flex gap-[4px] h-full items-center px-[16px] py-[13px] relative shrink-0" data-name="Projects">
<div className="content-stretch flex items-start relative shrink-0 size-[20px]" data-node-id="I17264:29099;23066:86145;6539:37591" data-name="sl-icon">
<div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-node-id="I17264:29099;23066:86145;6539:37591;8025:2875" data-name="sl-icon">
<div className="flex-[1_0_0] h-full min-w-px relative" data-node-id="I17264:29099;23066:86145;6539:37591;8025:2875;1419:9264" data-name="icon-container">
<div className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Solid'] inset-0 justify-center leading-[0] not-italic text-[20px] text-[color:var(--surface,white)] text-center" data-node-id="I17264:29099;23066:86145;6539:37591;8025:2875;1419:9264;802:2162">
<p className="leading-[16px]">book-circle-arrow-up</p>
</div>
</div>
</div>
</div>
<p className="[word-break:break-word] font-['Font_Awesome_7_Pro:Regular'] leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap" data-node-id="I17264:29099;23066:86145;1481:4038">
chevron-down
</p>
</div>
</div>
<div className="content-stretch flex gap-[var(--space-new\/md,8px)] isolate items-center relative shrink-0" data-node-id="I17264:29099;25806:56903" data-name="sl-avatar">
<div className="content-stretch flex flex-col items-start relative shrink-0 z-[2]" data-node-id="I17264:29099;25806:56903;7403:217898">
<div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="I17264:29099;25806:56903;7401:1034" data-name="Avatar">
<div className="col-1 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[32px_32px] ml-0 mt-0 relative row-1 size-[32px]" data-node-id="I17264:29099;25806:56903;7401:1041" style={{ maskImage: `url("${imgAvatarContent}")` }} data-name="avatar-content">
<div className="absolute content-stretch flex inset-0 isolate items-center justify-center" data-node-id="I17264:29099;25806:56903;7401:1042" data-name="Mask">
<div className="absolute bg-[var(--color\/background\/primary\/bold,#36f)] inset-0 z-[1]" data-node-id="I17264:29099;25806:56903;7401:1042;7355:28686" data-name="BG" />
</div>
<div className="-translate-y-1/2 absolute aspect-[80/80] left-0 right-0 top-1/2" data-node-id="I17264:29099;25806:56903;7401:1043" data-name="avatar-content-variant">
<div className="absolute content-stretch flex inset-0 isolate items-center justify-center mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-19.5px_0px] mask-size-[71px_32px]" data-node-id="I17264:29099;25806:56903;7401:1048" style={{ maskImage: `url("${imgMask}")` }} data-name="Mask">
<div className="absolute bg-[var(--color\/foreground\/primary\/onbold,white)] inset-0 z-[2]" data-node-id="I17264:29099;25806:56903;7401:1048;7355:28738" data-name="FG" />
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div className="bg-[var(--color\/palette\/grey\/100,#f0f2f5)] border-[#c8c8cf] border-b border-solid content-stretch flex flex-col h-[181px] items-start overflow-clip px-[120px] relative shrink-0 w-full" data-node-id="17264:29100" data-name="top navigation">
<div className="content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-h-px relative w-full" data-node-id="17264:29101">
<div className="content-stretch flex flex-col h-[70px] items-start relative shrink-0 w-full" data-node-id="17264:29102">
<div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px pr-[5px] relative w-full" data-node-id="17264:29103">
<p className="[word-break:break-word] flex-[1_0_0] font-['Raleway:Bold'] font-bold leading-[38px] min-w-px relative text-[#021d25] text-[28px] text-center tracking-[-0.28px]" data-node-id="17264:29104">
Functional management
</p>
</div>
</div>
</div>
<div className="bg-white border-[#c8c8cf] border-b border-solid content-stretch flex items-end relative shrink-0 w-[1200px]" data-node-id="17264:29105" data-name="tabbar-horizontal">
<div className="content-stretch flex flex-[1_0_0] items-end min-w-px overflow-x-auto overflow-y-clip relative" data-node-id="I17264:29105;4163:2717" data-name="tabs">
<div className="content-stretch flex items-start relative shrink-0" data-node-id="I17264:29105;4163:2718" data-name="1-4">
<div className="bg-white border-[#c8c8cf] border-b border-solid content-stretch flex items-start justify-center relative shrink-0" data-node-id="I17264:29105;4163:2719" data-name="tab horizontal-theme">
<div className="content-stretch flex items-start justify-center relative shrink-0" data-node-id="I17264:29105;4163:2719;4163:2691" data-name="tab-config">
<div className="content-stretch flex items-start relative shrink-0" data-node-id="I17264:29105;4163:2719;4163:2691;4379:32424" data-name="tab-base">
<div className="content-stretch flex gap-[8px] items-start px-[24px] py-[12px] relative shrink-0" data-node-id="I17264:29105;4163:2719;4163:2691;4379:32424;4360:2873" data-name="tab-content">
<div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0" data-node-id="I17264:29105;4163:2719;4163:2691;4379:32424;4360:2876" data-name="main">
<p className="[word-break:break-word] font-['Roboto:Regular'] font-normal leading-[20px] relative shrink-0 text-[#02242e] text-[14px] whitespace-nowrap" data-node-id="I17264:29105;4163:2719;4163:2691;4379:32424;4360:2877" style={{ fontVariationSettings: '"wdth" 100' }}>
Users
</p>
</div>
</div>
</div>
</div>
<div className="absolute bottom-[-1px] h-[4px] left-0 overflow-clip right-0" data-node-id="I17264:29105;4163:2719;4163:2692" data-name="tab-indicator">
<div className="absolute bg-[#4589be] inset-0" data-node-id="I17264:29105;4163:2719;4163:2692;4163:2934" data-name="indicator" />
</div>
</div>
<div className="bg-white border-[#c8c8cf] border-b border-solid content-stretch flex items-start justify-center relative shrink-0" data-node-id="I17264:29105;4163:2720" data-name="tab horizontal-theme">
<div className="content-stretch flex items-start justify-center relative shrink-0" data-node-id="I17264:29105;4163:2720;4163:2691" data-name="tab-config">
<div className="content-stretch flex items-start relative shrink-0" data-node-id="I17264:29105;4163:2720;4163:2691;4379:32424" data-name="tab-base">
<div className="content-stretch flex gap-[8px] items-start px-[24px] py-[12px] relative shrink-0" data-node-id="I17264:29105;4163:2720;4163:2691;4379:32424;4360:2873" data-name="tab-content">
<div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0" data-node-id="I17264:29105;4163:2720;4163:2691;4379:32424;4360:2876" data-name="main">
<p className="[word-break:break-word] font-['Roboto:Regular'] font-normal leading-[20px] relative shrink-0 text-[#02242e] text-[14px] whitespace-nowrap" data-node-id="I17264:29105;4163:2720;4163:2691;4379:32424;4360:2877" style={{ fontVariationSettings: '"wdth" 100' }}>
Downtime events
</p>
</div>
</div>
</div>
</div>
</div>
<div className="bg-white border-[#c8c8cf] border-b border-solid content-stretch flex items-start justify-center relative shrink-0" data-node-id="I17264:29105;4163:2721" data-name="tab horizontal-theme">
<div className="content-stretch flex items-start justify-center relative shrink-0" data-node-id="I17264:29105;4163:2721;4163:2691" data-name="tab-config">
<div className="content-stretch flex items-start relative shrink-0" data-node-id="I17264:29105;4163:2721;4163:2691;4379:32424" data-name="tab-base">
<div className="content-stretch flex gap-[8px] items-start px-[24px] py-[12px] relative shrink-0" data-node-id="I17264:29105;4163:2721;4163:2691;4379:32424;4360:2873" data-name="tab-content">
<div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0" data-node-id="I17264:29105;4163:2721;4163:2691;4379:32424;4360:2876" data-name="main">
<p className="[word-break:break-word] font-['Roboto:Regular'] font-normal leading-[20px] relative shrink-0 text-[#02242e] text-[14px] whitespace-nowrap" data-node-id="I17264:29105;4163:2721;4163:2691;4379:32424;4360:2877" style={{ fontVariationSettings: '"wdth" 100' }}>
Services
</p>
</div>
</div>
</div>
</div>
</div>
<div className="bg-white border-[#c8c8cf] border-b border-solid content-stretch flex items-start justify-center relative shrink-0" data-node-id="I17264:29105;4163:2722" data-name="tab horizontal-theme">
<div className="content-stretch flex items-start justify-center relative shrink-0" data-node-id="I17264:29105;4163:2722;4163:2691" data-name="tab-config">
<div className="content-stretch flex items-start relative shrink-0" data-node-id="I17264:29105;4163:2722;4163:2691;4379:32424" data-name="tab-base">
<div className="content-stretch flex gap-[8px] items-start px-[24px] py-[12px] relative shrink-0" data-node-id="I17264:29105;4163:2722;4163:2691;4379:32424;4360:2873" data-name="tab-content">
<div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0" data-node-id="I17264:29105;4163:2722;4163:2691;4379:32424;4360:2876" data-name="main">
<p className="[word-break:break-word] font-['Roboto:Regular'] font-normal leading-[20px] relative shrink-0 text-[#02242e] text-[14px] whitespace-nowrap" data-node-id="I17264:29105;4163:2722;4163:2691;4379:32424;4360:2877" style={{ fontVariationSettings: '"wdth" 100' }}>
Metadata usage
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
<div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px px-[120px] py-[40px] relative w-full" data-node-id="17264:29106">
<div className="content-stretch flex gap-[10px] items-end justify-end relative shrink-0 w-full" data-node-id="17266:31413">
<div className="content-stretch flex flex-col h-[60px] items-end relative shrink-0 w-[280px]" data-node-id="17266:31414" data-name="sl-searchfield">
<div className="content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex flex-col h-[32px] isolate items-start relative rounded-[2px] shrink-0 w-full" data-node-id="I17266:31414;5871:2228" data-name="sl-searchfield-theme">
<div className="content-stretch flex items-start relative shrink-0 w-full z-[2]" data-node-id="I17266:31414;5871:2228;5871:2204" data-name="sl-label-theme">
<div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px pb-[4px] relative" data-node-id="I17266:31414;5871:2228;5871:2204;4777:19095" data-name="sl-base-label">
<div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="I17266:31414;5871:2228;5871:2204;4777:19095;6390:2908">
<div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-node-id="I17266:31414;5871:2228;5871:2204;4777:19095;1222:5143" data-name="label-container">
<div className="[word-break:break-word] flex flex-col font-['Roboto:Medium'] font-medium justify-center leading-[0] relative shrink-0 text-[#02242e] text-[14px] whitespace-nowrap" data-node-id="I17266:31414;5871:2228;5871:2204;4777:19095;1215:5045" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Search user</p>
</div>
</div>
</div>
</div>
</div>
<div className="bg-white border border-[#7a818e] border-solid content-stretch drop-shadow-[0px_0px_0px_rgba(0,0,0,0)] flex gap-[8px] isolate items-center justify-center px-[13px] py-[8px] relative rounded-[4px] shrink-0 w-full z-[1]" data-node-id="I17266:31414;5871:2228;5871:2205" data-name="sl_base-search_field">
<div className="relative shrink-0 size-[20px] z-[5]" data-node-id="I17266:31414;5871:2228;5871:2205;6670:1939" data-name="core-icon-start">
<div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
<div className="flex-[1_0_0] h-full min-w-px relative" data-node-id="I17266:31414;5871:2228;5871:2205;6670:1939;399:65" data-name="search">
<div className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#02242e] text-[16px] text-center" data-node-id="I17266:31414;5871:2228;5871:2205;6670:1939;399:65;5555:15890">
<p className="leading-[16px]">search</p>
</div>
</div>
</div>
</div>
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] min-w-px relative text-[#7a818e] text-[14px] z-[3]" data-node-id="I17266:31414;5871:2228;5871:2205;6670:1938" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Enter search text</p>
</div>
</div>
</div>
</div>
<div className="absolute content-stretch flex flex-col gap-[var(--space-new\/xs,4px)] items-start left-[290px] top-0 w-[280px]" data-node-id="17557:100187" data-name="sl-select (simple-prototype)">
<div className="content-stretch flex flex-col gap-[var(--space-new\/none,0px)] items-start relative shrink-0" data-node-id="I17557:100187;1514:155951" data-name="sl-base-label">
<div className="content-stretch flex gap-[var(--space-new\/2xs,2px)] items-center relative shrink-0" data-node-id="I17557:100187;1514:155951;961:65930" data-name="label-container">
<div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-node-id="I17557:100187;1514:155951;961:65947">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:Medium')] font-[var(--text-new\/typeset\/fontweight\/semibold,500)] justify-center leading-[0] relative shrink-0 text-[14px] text-[color:var(--color\/foreground\/bold,#222)] whitespace-nowrap" data-node-id="I17557:100187;1514:155951;961:65931" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Last login date</p>
</div>
</div>
</div>
</div>
<div className="content-stretch flex flex-col gap-[var(--space-new\/xs,4px)] isolate items-start relative shrink-0 w-full" data-node-id="I17557:100187;1550:6733" data-name="input and validation">
<button className="content-stretch cursor-pointer flex flex-col gap-[var(--space-new\/xs,4px)] isolate items-start relative shrink-0 w-full z-[2]" data-node-id="I17557:100187;1514:155394" data-name="Select variations">
<div className="content-stretch flex gap-[var(--space\/100,8px)] items-center px-[var(--space\/150,12px)] py-[var(--space\/100,8px)] relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0 w-full z-[3]" data-node-id="I17557:100187;1514:155394;1526:11217">
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] min-w-px relative text-[#25292f] text-[14px] text-left" data-node-id="I17557:100187;1514:155394;1526:11218" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Last 30 days</p>
</div>
<SelectDivider className="content-stretch flex h-[20px] items-center px-[var(--space-new\/xs,4px)] relative shrink-0" />
<div className="content-stretch flex items-center relative shrink-0" data-node-id="I17557:100187;1514:155394;1526:11220" data-name="sl-icon">
<div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="I17557:100187;1514:155394;1526:11220;301:41086" data-name="SL-icon/md">
<div className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]" data-node-id="I17557:100187;1514:155394;1526:11220;301:41086;62:7102" data-name="Base/Icon">
<div className="flex-[1_0_0] h-full min-w-px relative" data-node-id="I17557:100187;1514:155394;1526:11220;301:41086;62:7102;49:7112" data-name="icon-container">
<div className="[word-break:break-word] absolute flex flex-col font-[family-name:var(--text-new\/typeset\/fontfamily\/icon,'Font_Awesome_7_Pro:Regular')] font-[var(--icon\/typeset\/fontweight\/icon-regular,normal)] inset-0 justify-center leading-[0] text-[#25292f] text-[length:var(--size\/icon\/font\/md,16px)] text-center" data-node-id="I17557:100187;1514:155394;1526:11220;301:41086;62:7102;49:7100">
<p className="leading-[16px]">chevron-down</p>
</div>
</div>
</div>
</div>
</div>
</div>
<div className="absolute bg-white border-[#818b98] border-[length:var(--size\/borderwidth\/default,1px)] border-solid content-stretch flex gap-[var(--space\/100,8px)] inset-0 items-center px-[var(--space\/150,12px)] py-[var(--space\/075,6px)] rounded-[var(--size\/borderradius\/default,4px)] z-[1]" data-node-id="I17557:100187;1514:155394;1526:17888" data-name="select-bg">
<div className="absolute bg-[#c8d1da] inset-[-1px] opacity-[calc(var(--opacity\/interactive\/plain\/idle,0)/100)] rounded-[var(--size\/borderradius\/default,4px)]" data-node-id="I17557:100187;1514:155394;1526:17888;1526:10636" data-name="interactive" />
<div className="absolute inset-[-1px]" data-node-id="I17557:100187;1514:155394;1526:17888;1526:10637" data-name="Focus ring outside" />
</div>
</button>
</div>
</div>
<div className="flex flex-[1_0_0] flex-row items-end self-stretch" data-node-id="17266:31418">
<div className="flex-[1_0_0] h-full min-w-px relative">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRectangle1192} />
</div>
</div>
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="17266:31419" data-name="sl-button-rectangular">
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17266:31419;109:59550" data-name="Button-Variants">
<div className="bg-[var(--color\/background\/primary\/bold,#36f)] border-[length:var(--size\/borderwidth\/none,0px)] border-[var(--color\/transparant,rgba(0,0,0,0))] border-solid content-stretch flex gap-[var(--space-new\/sm,6px)] isolate items-center justify-center overflow-clip px-[var(--space\/200,16px)] py-[var(--space\/100,8px)] relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17266:31419;109:59550;730:95929" data-name="Button-Base">
<div className="relative shrink-0 size-[16px] z-[4]" data-node-id="I17266:31419;109:59550;730:95929;730:95779" data-name="start icon">
<div className="absolute bg-[var(--color\/foreground\/primary\/onbold,white)] inset-[-2px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[2px_1.656px] mask-size-[16px_16.719px]" data-node-id="I17266:31419;109:59550;730:95929;730:95781" style={{ maskImage: `url("${imgIconColorMask}")` }} data-name="icon color mask" />
</div>
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:SemiBold')] font-semibold justify-center leading-[0] min-w-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/foreground\/primary\/onbold,white)] text-center whitespace-nowrap z-[3]" data-node-id="I17266:31419;109:59550;730:95929;730:95782" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Add new user</p>
</div>
<div className="absolute inset-0 opacity-[calc(var(--opacity\/interactive\/bold\/idle,0)/100)] rounded-[var(--size\/borderradius\/default,4px)] z-[1]" data-node-id="I17266:31419;109:59550;730:95929;730:95787" data-name="interactive" />
</div>
</div>
<div className="absolute inset-[0_1px_0_0]" data-node-id="I17266:31419;2101:99172" data-name="Focus ring outside" />
</div>
</div>
<div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="17264:29112">
<div className="bg-white content-stretch flex items-start overflow-clip relative rounded-[4px] shrink-0 w-full" data-node-id="17264:29113" data-name="mat-body">
<div className="bg-[#f4f5fa] content-stretch flex flex-[1_0_0] flex-col items-center min-w-px overflow-clip relative" data-node-id="17264:29114" data-name="Frame">
<button className="content-stretch cursor-pointer flex gap-[10px] h-[48px] items-center overflow-clip px-[16px] py-[10px] relative shrink-0 w-full" data-node-id="17264:29115" data-name="th-text-start">
<div aria-hidden className="absolute bg-[#f4f5fa] inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] min-w-px relative text-[#585c61] text-[0px] text-left tracking-[0.4px]" data-node-id="I17264:29115;5922:160170" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="whitespace-pre-wrap">
<span className="leading-[20px] text-[16px]">{`Login  `}</span>
<span className="[word-break:break-word] font-['Font_Awesome_6_Pro:Solid'] leading-[20px] not-italic text-[14px]">arrow-up</span>
</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</button>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29116" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" data-node-id="I17264:29116;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">AkashPM</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29117" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" data-node-id="I17264:29117;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">AlisamertensOM</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29118" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" data-node-id="I17264:29118;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">AnnedePauwCA</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
</div>
<div className="bg-[#f4f5fa] content-stretch flex flex-[1_0_0] flex-col items-center min-w-px overflow-clip relative" data-node-id="17264:29121" data-name="Frame">
<button className="content-stretch cursor-pointer flex gap-[10px] h-[48px] items-center overflow-clip px-[16px] py-[10px] relative shrink-0 w-full" data-node-id="17264:29122" data-name="th-text-start">
<div aria-hidden className="absolute bg-[#f4f5fa] inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] min-w-px relative text-[#585c61] text-[16px] text-left tracking-[0.4px]" data-node-id="I17264:29122;5922:160170" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Name</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</button>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29123" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" data-node-id="I17264:29123;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">AkashPM</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29124" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Van IN: Alisa Mertens</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29125" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Van In: Ann de Pauw CA</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
</div>
<div className="bg-[#f4f5fa] content-stretch flex flex-[1_0_0] flex-col items-center min-w-px overflow-clip relative" data-node-id="17264:29128" data-name="Frame">
<button className="content-stretch cursor-pointer flex gap-[10px] h-[48px] items-center overflow-clip px-[16px] py-[10px] relative shrink-0 w-full" data-node-id="17264:29129" data-name="th-text-start">
<div aria-hidden className="absolute bg-[#f4f5fa] inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] min-w-px relative text-[#585c61] text-[16px] text-left tracking-[0.4px]" data-node-id="I17264:29129;5922:160170" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Email</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</button>
<div className="content-stretch flex items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29130" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">akashpm@kampus.fi</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29131" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">a.mertens@vanin.be</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29132" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">anndepauw@vanin.nl</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
</div>
<div className="bg-[#f4f5fa] content-stretch flex flex-[1_0_0] flex-col items-center min-w-px overflow-clip relative" data-node-id="17264:29135" data-name="Frame">
<button className="content-stretch cursor-pointer flex gap-[10px] h-[48px] items-center overflow-clip px-[16px] py-[10px] relative shrink-0 w-full" data-node-id="17264:29136" data-name="th-text-start">
<div aria-hidden className="absolute bg-[#f4f5fa] inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] min-w-px relative text-[#585c61] text-[16px] text-left tracking-[0.4px]" data-node-id="I17264:29136;5922:160170" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Role</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</button>
<div className="content-stretch flex items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29137" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Publication Manager</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29138" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" data-node-id="I17264:29138;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Outline Manager</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29139" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" data-node-id="I17264:29139;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Content Analyst</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
</div>
<div className="bg-[#f4f5fa] content-stretch flex flex-[1_0_0] flex-col items-center min-w-px overflow-clip relative" data-node-id="17264:29140" data-name="Frame">
<button className="content-stretch cursor-pointer flex gap-[10px] h-[48px] items-center overflow-clip px-[16px] py-[10px] relative shrink-0 w-full" data-node-id="17264:29141" data-name="th-text-start">
<div aria-hidden className="absolute bg-[#f4f5fa] inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] min-w-px relative text-[#585c61] text-[16px] text-left tracking-[0.4px]" data-node-id="I17264:29141;5922:160170" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Employee type</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</button>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29142" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" data-node-id="I17264:29142;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Developer</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29143" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" data-node-id="I17264:29143;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Manager</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29144" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:Regular'] font-normal h-full justify-center leading-[0] min-w-px relative text-[#1d1f20] text-[14px] tracking-[0.25px]" data-node-id="I17264:29144;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Manager</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
</div>
<div className="bg-[#f4f5fa] content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="17264:29145" data-name="Frame">
<button className="content-stretch cursor-pointer flex gap-[10px] h-[48px] items-center overflow-clip px-[16px] py-[10px] relative shrink-0 w-[117px]" data-node-id="17264:29146" data-name="th-text-start">
<div aria-hidden className="absolute bg-[#f4f5fa] inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#585c61] text-[16px] text-left tracking-[0.4px] whitespace-nowrap" data-node-id="I17264:29146;5922:160170" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">CFA</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</button>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-[117px]" data-node-id="17264:29147" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#1d1f20] text-[14px] tracking-[0.25px] whitespace-nowrap" data-node-id="I17264:29147;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Sanoma pro</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-[117px]" data-node-id="17264:29148" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#1d1f20] text-[14px] tracking-[0.25px] whitespace-nowrap" data-node-id="I17264:29148;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">{`Kampus `}</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-[117px]" data-node-id="17264:29149" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#1d1f20] text-[14px] tracking-[0.25px] whitespace-nowrap" data-node-id="I17264:29149;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">iDiddit</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
</div>
<div className="bg-[#f4f5fa] content-stretch flex flex-[1_0_0] flex-col items-center min-w-px overflow-clip relative" data-node-id="17264:29150" data-name="Frame">
<button className="content-stretch cursor-pointer flex gap-[10px] h-[48px] items-center overflow-clip px-[16px] py-[10px] relative shrink-0 w-full" data-node-id="17264:29151" data-name="th-text-start">
<div aria-hidden className="absolute bg-[#f4f5fa] inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#585c61] text-[16px] text-left tracking-[0.4px] w-[133px]" data-node-id="I17264:29151;5922:160170" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Last login date</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</button>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29152" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#1d1f20] text-[14px] tracking-[0.25px] whitespace-nowrap" data-node-id="I17264:29152;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">23-10-2024 at 14:30</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29153" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#1d1f20] text-[14px] tracking-[0.25px] whitespace-nowrap" data-node-id="I17264:29153;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">23-10-2024 at 14:30</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex h-[68px] items-center overflow-clip px-[16px] py-[14px] relative shrink-0 w-full" data-node-id="17264:29154" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#1d1f20] text-[14px] tracking-[0.25px] whitespace-nowrap" data-node-id="I17264:29154;5922:160167" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">23-10-2024 at 14:30</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
</div>
<div className="bg-[#f4f5fa] content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="17264:29155" data-name="Frame">
<button className="content-stretch cursor-pointer flex gap-[10px] h-[48px] items-center overflow-clip px-[16px] py-[10px] relative shrink-0 w-full" data-node-id="17264:29156" data-name="th-text-start">
<div aria-hidden className="absolute bg-[#f4f5fa] inset-0 pointer-events-none" />
<div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] min-w-px relative text-[#585c61] text-[16px] text-left tracking-[0.4px]" data-node-id="I17264:29156;5922:160170" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">{` `}</p>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</button>
<div className="content-stretch flex gap-[10px] h-[68px] items-center overflow-clip px-[8px] py-[12px] relative shrink-0 w-full" data-node-id="17264:29157" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29157;17257:103082" data-name="sl-button-rectangular">
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29157;17257:103082;109:59550" data-name="Button-Variants">
<div className="border-[length:var(--size\/borderwidth\/none,0px)] border-[var(--color\/transparant,rgba(0,0,0,0))] border-solid content-stretch flex gap-[var(--space-new\/sm,6px)] isolate items-center justify-center overflow-clip px-[var(--space\/175,14px)] py-[var(--space\/025,2px)] relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29157;17257:103082;109:59550;730:95867" data-name="Button-Base">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:SemiBold')] font-semibold justify-center leading-[0] min-w-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/foreground\/primary\/bold,#1727b6)] text-center whitespace-nowrap z-[3]" data-node-id="I17264:29157;17257:103082;109:59550;730:95867;730:95373" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Edit</p>
</div>
<div className="absolute inset-0 opacity-[calc(var(--opacity\/interactive\/plain\/idle,0)/100)] rounded-[var(--size\/borderradius\/default,4px)] z-[1]" data-node-id="I17264:29157;17257:103082;109:59550;730:95867;730:95378" data-name="interactive" />
</div>
</div>
<div className="absolute inset-[0_1px_0_0]" data-node-id="I17264:29157;17257:103082;2101:99172" data-name="Focus ring outside" />
</div>
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29157;17257:103188" data-name="Button-Variants">
<div className="border-[length:var(--size\/borderwidth\/none,0px)] border-[var(--color\/transparant,rgba(0,0,0,0))] border-solid content-stretch flex gap-[var(--space-new\/sm,6px)] isolate items-center justify-center overflow-clip px-[var(--space\/175,14px)] py-[var(--space\/025,2px)] relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29157;17257:103188;730:95867" data-name="Button-Base">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:SemiBold')] font-semibold justify-center leading-[0] min-w-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/foreground\/primary\/bold,#1727b6)] text-center whitespace-nowrap z-[3]" data-node-id="I17264:29157;17257:103188;730:95867;730:95373" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Delete</p>
</div>
<div className="absolute inset-0 opacity-[calc(var(--opacity\/interactive\/plain\/idle,0)/100)] rounded-[var(--size\/borderradius\/default,4px)] z-[1]" data-node-id="I17264:29157;17257:103188;730:95867;730:95378" data-name="interactive" />
</div>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex gap-[10px] h-[68px] items-center overflow-clip px-[8px] py-[12px] relative shrink-0 w-full" data-node-id="17264:29158" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29158;17257:103082" data-name="sl-button-rectangular">
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29158;17257:103082;109:59550" data-name="Button-Variants">
<div className="border-[length:var(--size\/borderwidth\/none,0px)] border-[var(--color\/transparant,rgba(0,0,0,0))] border-solid content-stretch flex gap-[var(--space-new\/sm,6px)] isolate items-center justify-center overflow-clip px-[var(--space\/175,14px)] py-[var(--space\/025,2px)] relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29158;17257:103082;109:59550;730:95867" data-name="Button-Base">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:SemiBold')] font-semibold justify-center leading-[0] min-w-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/foreground\/primary\/bold,#1727b6)] text-center whitespace-nowrap z-[3]" data-node-id="I17264:29158;17257:103082;109:59550;730:95867;730:95373" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Edit</p>
</div>
<div className="absolute inset-0 opacity-[calc(var(--opacity\/interactive\/plain\/idle,0)/100)] rounded-[var(--size\/borderradius\/default,4px)] z-[1]" data-node-id="I17264:29158;17257:103082;109:59550;730:95867;730:95378" data-name="interactive" />
</div>
</div>
<div className="absolute inset-[0_1px_0_0]" data-node-id="I17264:29158;17257:103082;2101:99172" data-name="Focus ring outside" />
</div>
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29158;17257:103188" data-name="Button-Variants">
<div className="border-[length:var(--size\/borderwidth\/none,0px)] border-[var(--color\/transparant,rgba(0,0,0,0))] border-solid content-stretch flex gap-[var(--space-new\/sm,6px)] isolate items-center justify-center overflow-clip px-[var(--space\/175,14px)] py-[var(--space\/025,2px)] relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29158;17257:103188;730:95867" data-name="Button-Base">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:SemiBold')] font-semibold justify-center leading-[0] min-w-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/foreground\/primary\/bold,#1727b6)] text-center whitespace-nowrap z-[3]" data-node-id="I17264:29158;17257:103188;730:95867;730:95373" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Delete</p>
</div>
<div className="absolute inset-0 opacity-[calc(var(--opacity\/interactive\/plain\/idle,0)/100)] rounded-[var(--size\/borderradius\/default,4px)] z-[1]" data-node-id="I17264:29158;17257:103188;730:95867;730:95378" data-name="interactive" />
</div>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
<div className="content-stretch flex gap-[10px] h-[68px] items-center overflow-clip px-[8px] py-[12px] relative shrink-0 w-full" data-node-id="17264:29159" data-name="td-text-start">
<div aria-hidden className="absolute bg-white inset-0 pointer-events-none" />
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29159;17257:103082" data-name="sl-button-rectangular">
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29159;17257:103082;109:59550" data-name="Button-Variants">
<div className="border-[length:var(--size\/borderwidth\/none,0px)] border-[var(--color\/transparant,rgba(0,0,0,0))] border-solid content-stretch flex gap-[var(--space-new\/sm,6px)] isolate items-center justify-center overflow-clip px-[var(--space\/175,14px)] py-[var(--space\/025,2px)] relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29159;17257:103082;109:59550;730:95867" data-name="Button-Base">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:SemiBold')] font-semibold justify-center leading-[0] min-w-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/foreground\/primary\/bold,#1727b6)] text-center whitespace-nowrap z-[3]" data-node-id="I17264:29159;17257:103082;109:59550;730:95867;730:95373" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Edit</p>
</div>
<div className="absolute inset-0 opacity-[calc(var(--opacity\/interactive\/plain\/idle,0)/100)] rounded-[var(--size\/borderradius\/default,4px)] z-[1]" data-node-id="I17264:29159;17257:103082;109:59550;730:95867;730:95378" data-name="interactive" />
</div>
</div>
<div className="absolute inset-[0_1px_0_0]" data-node-id="I17264:29159;17257:103082;2101:99172" data-name="Focus ring outside" />
</div>
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29159;17257:103188" data-name="Button-Variants">
<div className="border-[length:var(--size\/borderwidth\/none,0px)] border-[var(--color\/transparant,rgba(0,0,0,0))] border-solid content-stretch flex gap-[var(--space-new\/sm,6px)] isolate items-center justify-center overflow-clip px-[var(--space\/175,14px)] py-[var(--space\/025,2px)] relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I17264:29159;17257:103188;730:95867" data-name="Button-Base">
<div className="[word-break:break-word] flex flex-col font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:SemiBold')] font-semibold justify-center leading-[0] min-w-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/foreground\/primary\/bold,#1727b6)] text-center whitespace-nowrap z-[3]" data-node-id="I17264:29159;17257:103188;730:95867;730:95373" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Delete</p>
</div>
<div className="absolute inset-0 opacity-[calc(var(--opacity\/interactive\/plain\/idle,0)/100)] rounded-[var(--size\/borderradius\/default,4px)] z-[1]" data-node-id="I17264:29159;17257:103188;730:95867;730:95378" data-name="interactive" />
</div>
</div>
<div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.12)]" />
</div>
</div>
</div>
<div className="bg-white content-stretch flex gap-[34px] h-[58px] items-center justify-end overflow-clip px-[8px] relative shrink-0 w-full" data-node-id="17264:29167" data-name="mat-data-footer">
<div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#1d1f20] text-[12px] text-right tracking-[0.4px] whitespace-nowrap" data-node-id="I17264:29167;6034:38145" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">Rows per page:</p>
</div>
<div className="content-stretch flex flex-col items-start relative shrink-0 w-[33px]" data-node-id="I17264:29167;6034:38146" data-name="mat-select__slot">
<div className="content-stretch flex gap-[10px] h-[26px] items-center overflow-clip py-[8px] relative shrink-0 w-full" data-node-id="I17264:29167;6034:38146;69:1064" data-name="Frame">
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-node-id="I17264:29167;6034:38146;69:1065" data-name="mat-input__slot">
<div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#1d1f20] text-[14px] tracking-[0.4px] whitespace-nowrap" data-node-id="I17264:29167;6034:38146;69:1065;63:896" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">25</p>
</div>
</div>
<div className="relative shrink-0 size-[24px]" data-node-id="I17264:29167;6034:38146;69:1066" data-name="mat-icon">
<div className="[word-break:break-word] absolute flex flex-col font-['Material_Icons:Regular'] font-normal inset-0 justify-center leading-[0] text-[#7a818e] text-[24px] text-center whitespace-nowrap" data-node-id="I17264:29167;6034:38146;69:1066;50:48" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
<p className="leading-none">arrow_drop_down</p>
</div>
</div>
</div>
<div className="bg-[rgba(0,0,0,0.42)] h-px relative shrink-0 w-full" data-node-id="I17264:29167;6034:38146;69:1067" data-name="mat-divider" />
</div>
<div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#1d1f20] text-[14px] text-right tracking-[0.4px] whitespace-nowrap" data-node-id="I17264:29167;5922:160227" style={{ fontVariationSettings: '"wdth" 100' }}>
<p className="leading-[20px]">1-1 of 1</p>
</div>
<div className="content-stretch flex items-center justify-center px-[16px] relative rounded-[32px] shrink-0 size-[32px]" data-node-id="I17264:29167;5922:160228" data-name="mat-btn">
<div className="[word-break:break-word] flex flex-col font-['Material_Icons:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#c8c8cf] text-[24px] text-center whitespace-nowrap" data-node-id="I17264:29167;5922:160228;49:330" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
<p className="leading-none">chevron_left</p>
</div>
</div>
<div className="content-stretch flex items-center justify-center px-[16px] relative rounded-[32px] shrink-0 size-[32px]" data-node-id="I17264:29167;5922:160229" data-name="mat-btn">
<div className="[word-break:break-word] flex flex-col font-['Material_Icons:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#c8c8cf] text-[24px] text-center whitespace-nowrap" data-node-id="I17264:29167;5922:160229;49:330" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
<p className="leading-none">navigate_next</p>
</div>
</div>
</div>
</div>
</div>
</div>
);
}
