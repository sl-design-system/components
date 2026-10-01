const assetPathPrefix = "https://www.figma.com/api/mcp/asset/244182d0-7238-4158-b3da-3c24bac1f11a";
const imgHorizontalDivider = `${assetPathPrefix}/4f0d6.svg`;
const imgIconColorMask = `${assetPathPrefix}/4b9e1.svg`;
const imgVerticalDividerShort = `${assetPathPrefix}/26831.svg`;
const imgVerticalDividerFull = `${assetPathPrefix}/b0660.svg`;
const imgVerticalDivider = `${assetPathPrefix}/249b0.svg`;
const imgVerticalDividerShort1 = `${assetPathPrefix}/3a440.svg`;
const imgIconColorMask1 = `${assetPathPrefix}/78129.svg`;
const imgIconColorMask2 = `${assetPathPrefix}/ad76e.svg`;
const imgIconColorMask3 = `${assetPathPrefix}/5190c.svg`;

type SlCheckboxProps = {
className?: string;
checked?: boolean;
intermediate?: "false";
label?: "false";
longLabelText?: "false";
state?: "Idle";
variant?: "Default";
};

function SlCheckbox({ className, checked = false, intermediate = "false", label = "false", longLabelText = "false", state = "Idle", variant = "Default" }: SlCheckboxProps) {
return (
<div className={className || "content-stretch flex items-start relative"} data-node-id="2388:66321">
<div className="content-stretch flex gap-[var(--space-new\/md,8px)] items-start relative shrink-0" data-node-id="2388:66429" data-name="checkbox-base">
<div className="bg-[var(--color\/background\/input\/plain,white)] border-[length:var(--size\/borderwidth\/default,1px)] border-[var(--color\/border\/input,#818b98)] border-solid content-stretch flex flex-col gap-[8px] isolate items-center justify-center overflow-clip p-[var(--space\/100,8px)] relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0 size-[24px]" data-node-id="I2388:66429;892:254279" data-name="checkbox-box">
<div className="relative shrink-0 size-[16px] z-[2]" data-node-id="I2388:66429;911:261845" data-name="Icon" />
<div className="absolute bg-[var(--color\/background\/selected\/interactive\/plain,#598eff)] inset-[-1px] opacity-[calc(var(--opacity\/interactive\/plain\/idle,0)/100)] rounded-[var(--size\/borderradius\/default,4px)] z-[1]" data-node-id="I2388:66429;892:255429" data-name="interactive" />
</div>
<div className="absolute left-0 size-[24px] top-0" data-node-id="I2388:66429;892:254283" data-name="Focus ring outside" />
</div>
</div>
);
}

type SlGridRowProps = {
className?: string;
cellWidthFill?: "true";
column1?: boolean;
column10?: boolean;
column2?: boolean;
column3?: boolean;
column4?: boolean;
column5?: boolean;
column6?: boolean;
column7?: boolean;
column8?: boolean;
column9?: boolean;
density?: "Plain";
fixedWidthFirstAndLast?: "true";
fullHeightDivider?: boolean;
showCheckbox?: boolean;
showGrabber?: boolean;
showHorizontalDivider?: boolean;
showIcons?: boolean;
showVerticalDivider?: boolean;
type?: "Default";
};

function SlGridRow({ className, cellWidthFill = "true", column1 = true, column10 = false, column2 = true, column3 = true, column4 = true, column5 = true, column6 = false, column7 = false, column8 = false, column9 = false, density = "Plain", fixedWidthFirstAndLast = "true", fullHeightDivider = false, showCheckbox = true, showGrabber = true, showHorizontalDivider = true, showIcons = true, showVerticalDivider = true, type = "Default" }: SlGridRowProps) {
return (
<div className={className || "content-stretch flex isolate items-center relative w-[1447px]"} data-node-id="2422:87272">
{showHorizontalDivider && (
<div className="absolute h-0 left-0 right-0 top-0 z-[41]" data-node-id="2422:87278" data-name="horizontal divider">
<div className="absolute inset-[-0.5px_0]">
<img alt="" className="block max-w-none size-full" src={imgHorizontalDivider} />
</div>
</div>
)}
{showGrabber && (
<div className="bg-[rgba(255,255,255,0)] content-stretch flex isolate items-center relative shrink-0 w-[48px] z-[40]" data-node-id="2422:87280" data-name="grabber">
<div className="absolute inset-[1px_0_0_1px] z-[4]" data-node-id="I2422:87280;4584:600366" data-name="Focus ring inside" />
<div className="content-stretch flex isolate items-center min-h-[40px] relative shrink-0 z-[1]" data-node-id="I2422:87280;4584:600370" data-name="grid-cell content">
<div className="content-stretch flex items-center overflow-clip px-[var(--space\/150,12px)] py-[var(--space\/100,8px)] relative shrink-0 w-[48px] z-[1]" data-node-id="I2422:87280;4584:600370;4584:600418" data-name="Content">
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I2422:87280;4584:600370;4585:911932" data-name="sl-button-rectangular">
<div className="content-stretch flex items-start overflow-clip relative rounded-[4px] shrink-0" data-node-id="I2422:87280;4584:600370;4585:911932;109:59550" data-name="Variant Button">
<div className="border-[length:var(--size\/borderwidth\/action,1px)] border-[var(--color\/transparent,rgba(0,0,0,0))] border-solid content-stretch flex gap-[var(--space-new\/sm,6px)] isolate items-center justify-center overflow-clip p-[var(--space\/075,6px)] relative rounded-[4px] shrink-0" data-node-id="I2422:87280;4584:600370;4585:911932;109:59550;730:95879" data-name="Base Button">
<div className="relative shrink-0 size-[12px] z-[4]" data-node-id="I2422:87280;4584:600370;4585:911932;109:59550;730:95879;730:95381" data-name="start icon">
<div className="absolute bg-[var(--color\/foreground\/secondary\/bold,#222)] inset-[-2px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[2px_2px] mask-size-[12px_12.5px]" data-node-id="I2422:87280;4584:600370;4585:911932;109:59550;730:95879;730:95383" style={{ maskImage: `url("${imgIconColorMask}")` }} data-name="icon color mask" />
</div>
<div className="absolute inset-[-1px] opacity-[calc(var(--opacity\/interactive\/plain\/idle,0)/100)] z-[1]" data-node-id="I2422:87280;4584:600370;4585:911932;109:59550;730:95879;730:95389" data-name="interactive" />
</div>
</div>
<div className="absolute inset-[0_1px_0_0]" data-node-id="I2422:87280;4584:600370;4585:911932;2101:99172" data-name="Focus ring outside" />
</div>
</div>
</div>
</div>
)}
{showVerticalDivider && (
<div className="h-[40px] relative shrink-0 w-0 z-[39]" data-node-id="2422:87281" data-name="Vertical divider short">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDividerShort} />
</div>
</div>
)}
{fullHeightDivider && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87282">
<div className="h-full relative shrink-0 w-0 z-[38]" data-name="Vertical divider full">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVerticalDividerFull} />
</div>
</div>
)}
{showCheckbox && (
<div className="bg-[rgba(255,255,255,0)] content-stretch flex isolate items-center justify-center relative shrink-0 w-[48px] z-[37]" data-node-id="2422:87283" data-name="checkbox">
<div className="absolute inset-[1px_0_0_1px] z-[4]" data-node-id="I2422:87283;4584:600366" data-name="Focus ring inside" />
<div className="content-stretch flex isolate items-center justify-center min-h-[40px] relative shrink-0 z-[1]" data-node-id="I2422:87283;4584:600370" data-name="grid-cell content">
<div className="content-stretch flex items-center justify-center overflow-clip px-[var(--space\/150,12px)] py-[var(--space\/100,8px)] relative shrink-0 z-[1]" data-node-id="I2422:87283;4584:600370;4584:600396" data-name="Content">
<SlCheckbox className="content-stretch flex items-start relative shrink-0" />
</div>
</div>
</div>
)}
{showVerticalDivider && (
<div className="h-[40px] relative shrink-0 w-0 z-[36]" data-node-id="2422:87284" data-name="Vertical divider short">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDividerShort} />
</div>
</div>
)}
{fullHeightDivider && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87285">
<div className="h-full relative shrink-0 w-0 z-[35]" data-name="Vertical divider full">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVerticalDividerFull} />
</div>
</div>
)}
{column1 && (
<div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-[1_0_0] isolate items-center min-w-px relative z-[34]" data-node-id="2422:87286" data-name="sl-grid-cell-1">
<div className="absolute inset-[1px_0_0_1px] z-[4]" data-node-id="I2422:87286;4584:600366" data-name="Focus ring inside" />
<div className="content-stretch flex flex-[1_0_0] isolate items-center min-h-[40px] min-w-px relative z-[1]" data-node-id="I2422:87286;4584:600370" data-name="grid-cell content">
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px overflow-clip px-[var(--space\/150,12px)] py-[var(--space\/100,8px)] relative z-[1]" data-node-id="I2422:87286;4584:600370;4584:600380" data-name="Content">
<p className="[word-break:break-word] font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:Regular')] font-[var(--text-new\/typeset\/fontweight\/regular,400)] leading-[var(--size\/lineheight\/250,20px)] relative shrink-0 text-[color:var(--color\/foreground\/plain,#25292f)] text-[length:var(--size\/text-new\/body\/md,14px)] whitespace-nowrap" data-node-id="I2422:87286;4584:600370;4584:600381" style={{ fontVariationSettings: '"wdth" 100' }}>
Text
</p>
</div>
</div>
</div>
)}
{showVerticalDivider && (
<div className="h-[40px] relative shrink-0 w-0 z-[33]" data-node-id="2422:87287" data-name="Vertical divider short">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDividerShort} />
</div>
</div>
)}
{fullHeightDivider && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87288">
<div className="h-full relative shrink-0 w-0 z-[32]" data-name="Vertical divider full">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVerticalDividerFull} />
</div>
</div>
)}
{column2 && (
<div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-[1_0_0] isolate items-center min-w-px relative z-[31]" data-node-id="2422:87289" data-name="sl-grid-cell-2">
<div className="absolute inset-[1px_0_0_1px] z-[4]" data-node-id="I2422:87289;4584:600366" data-name="Focus ring inside" />
<div className="content-stretch flex flex-[1_0_0] isolate items-center min-h-[40px] min-w-px relative z-[1]" data-node-id="I2422:87289;4584:600370" data-name="grid-cell content">
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px overflow-clip px-[var(--space\/150,12px)] py-[var(--space\/100,8px)] relative z-[1]" data-node-id="I2422:87289;4584:600370;4584:600380" data-name="Content">
<p className="[word-break:break-word] font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:Regular')] font-[var(--text-new\/typeset\/fontweight\/regular,400)] leading-[var(--size\/lineheight\/250,20px)] relative shrink-0 text-[color:var(--color\/foreground\/plain,#25292f)] text-[length:var(--size\/text-new\/body\/md,14px)] whitespace-nowrap" data-node-id="I2422:87289;4584:600370;4584:600381" style={{ fontVariationSettings: '"wdth" 100' }}>
Text
</p>
</div>
</div>
</div>
)}
{showVerticalDivider && (
<div className="h-[40px] relative shrink-0 w-0 z-[30]" data-node-id="2422:87290" data-name="Vertical divider short">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDividerShort} />
</div>
</div>
)}
{fullHeightDivider && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87291">
<div className="h-full relative shrink-0 w-0 z-[29]" data-name="Vertical divider full">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVerticalDividerFull} />
</div>
</div>
)}
{column3 && (
<div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-[1_0_0] isolate items-center min-w-px relative z-[28]" data-node-id="2422:87292" data-name="sl-grid-cell-3">
<div className="absolute inset-[1px_0_0_1px] z-[4]" data-node-id="I2422:87292;4584:600366" data-name="Focus ring inside" />
<div className="content-stretch flex flex-[1_0_0] isolate items-center min-h-[40px] min-w-px relative z-[1]" data-node-id="I2422:87292;4584:600370" data-name="grid-cell content">
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px overflow-clip px-[var(--space\/150,12px)] py-[var(--space\/100,8px)] relative z-[1]" data-node-id="I2422:87292;4584:600370;4584:600380" data-name="Content">
<p className="[word-break:break-word] font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:Regular')] font-[var(--text-new\/typeset\/fontweight\/regular,400)] leading-[var(--size\/lineheight\/250,20px)] relative shrink-0 text-[color:var(--color\/foreground\/plain,#25292f)] text-[length:var(--size\/text-new\/body\/md,14px)] whitespace-nowrap" data-node-id="I2422:87292;4584:600370;4584:600381" style={{ fontVariationSettings: '"wdth" 100' }}>
Text
</p>
</div>
</div>
</div>
)}
{showVerticalDivider && (
<div className="h-[40px] relative shrink-0 w-0 z-[27]" data-node-id="2422:87293" data-name="Vertical divider short">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDividerShort} />
</div>
</div>
)}
{fullHeightDivider && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87294">
<div className="h-full relative shrink-0 w-0 z-[26]" data-name="Vertical divider full">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVerticalDividerFull} />
</div>
</div>
)}
{column4 && (
<div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-[1_0_0] isolate items-center min-w-px relative z-[25]" data-node-id="2422:87295" data-name="sl-grid-cell-4">
<div className="absolute inset-[1px_0_0_1px] z-[4]" data-node-id="I2422:87295;4584:600366" data-name="Focus ring inside" />
<div className="content-stretch flex flex-[1_0_0] isolate items-center min-h-[40px] min-w-px relative z-[1]" data-node-id="I2422:87295;4584:600370" data-name="grid-cell content">
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px overflow-clip px-[var(--space\/150,12px)] py-[var(--space\/100,8px)] relative z-[1]" data-node-id="I2422:87295;4584:600370;4584:600380" data-name="Content">
<p className="[word-break:break-word] font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:Regular')] font-[var(--text-new\/typeset\/fontweight\/regular,400)] leading-[var(--size\/lineheight\/250,20px)] relative shrink-0 text-[color:var(--color\/foreground\/plain,#25292f)] text-[length:var(--size\/text-new\/body\/md,14px)] whitespace-nowrap" data-node-id="I2422:87295;4584:600370;4584:600381" style={{ fontVariationSettings: '"wdth" 100' }}>
Text
</p>
</div>
</div>
</div>
)}
{showVerticalDivider && (
<div className="h-[40px] relative shrink-0 w-0 z-[24]" data-node-id="2422:87296" data-name="Vertical divider short">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDividerShort} />
</div>
</div>
)}
{fullHeightDivider && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87297">
<div className="h-full relative shrink-0 w-0 z-[23]" data-name="Vertical divider full">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVerticalDividerFull} />
</div>
</div>
)}
{column5 && (
<div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-[1_0_0] isolate items-center min-w-px relative z-[22]" data-node-id="2422:87298" data-name="sl-grid-cell-5">
<div className="absolute inset-[1px_0_0_1px] z-[4]" data-node-id="I2422:87298;4584:600366" data-name="Focus ring inside" />
<div className="content-stretch flex flex-[1_0_0] isolate items-center min-h-[40px] min-w-px relative z-[1]" data-node-id="I2422:87298;4584:600370" data-name="grid-cell content">
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px overflow-clip px-[var(--space\/150,12px)] py-[var(--space\/100,8px)] relative z-[1]" data-node-id="I2422:87298;4584:600370;4584:600380" data-name="Content">
<p className="[word-break:break-word] font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:Regular')] font-[var(--text-new\/typeset\/fontweight\/regular,400)] leading-[var(--size\/lineheight\/250,20px)] relative shrink-0 text-[color:var(--color\/foreground\/plain,#25292f)] text-[length:var(--size\/text-new\/body\/md,14px)] whitespace-nowrap" data-node-id="I2422:87298;4584:600370;4584:600381" style={{ fontVariationSettings: '"wdth" 100' }}>
Text
</p>
</div>
</div>
</div>
)}
{showVerticalDivider && (
<div className="h-[40px] relative shrink-0 w-0 z-[21]" data-node-id="2422:87299" data-name="Vertical divider short">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDividerShort} />
</div>
</div>
)}
{fullHeightDivider && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87300">
<div className="h-full relative shrink-0 w-0 z-[20]" data-name="Vertical divider full">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVerticalDividerFull} />
</div>
</div>
)}
{column6 && (
<div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-[1_0_0] isolate items-center min-w-px relative z-[19]" data-node-id="2422:87301" data-name="sl-grid-cell-6">
<div className="absolute inset-[1px_0_0_1px] z-[4]" data-node-id="I2422:87301;4584:600366" data-name="Focus ring inside" />
<div className="absolute bottom-0 left-0 top-0 w-0 z-[3]" data-node-id="I2422:87301;4584:600367" data-name="Vertical divider">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDivider} />
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] isolate items-center min-h-[40px] min-w-px relative z-[1]" data-node-id="I2422:87301;4584:600370" data-name="grid-cell content">
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px overflow-clip px-[var(--space\/150,12px)] py-[var(--space\/100,8px)] relative z-[1]" data-node-id="I2422:87301;4584:600370;4584:600380" data-name="Content">
<p className="[word-break:break-word] font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:Regular')] font-[var(--text-new\/typeset\/fontweight\/regular,400)] leading-[var(--size\/lineheight\/250,20px)] relative shrink-0 text-[color:var(--color\/foreground\/plain,#25292f)] text-[length:var(--size\/text-new\/body\/md,14px)] whitespace-nowrap" data-node-id="I2422:87301;4584:600370;4584:600381" style={{ fontVariationSettings: '"wdth" 100' }}>
Text
</p>
</div>
</div>
</div>
)}
{showVerticalDivider && (
<div className="h-[40px] relative shrink-0 w-0 z-[18]" data-node-id="2422:87302" data-name="Vertical divider short">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDividerShort} />
</div>
</div>
)}
{fullHeightDivider && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87303">
<div className="h-full relative shrink-0 w-0 z-[17]" data-name="Vertical divider full">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVerticalDividerFull} />
</div>
</div>
)}
{column7 && (
<div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-[1_0_0] isolate items-center min-w-px relative z-[16]" data-node-id="2422:87304" data-name="sl-grid-cell-7">
<div className="absolute inset-[1px_0_0_1px] z-[4]" data-node-id="I2422:87304;4584:600366" data-name="Focus ring inside" />
<div className="absolute bottom-0 left-0 top-0 w-0 z-[3]" data-node-id="I2422:87304;4584:600367" data-name="Vertical divider">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDivider} />
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] isolate items-center min-h-[40px] min-w-px relative z-[1]" data-node-id="I2422:87304;4584:600370" data-name="grid-cell content">
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px overflow-clip px-[var(--space\/150,12px)] py-[var(--space\/100,8px)] relative z-[1]" data-node-id="I2422:87304;4584:600370;4584:600380" data-name="Content">
<p className="[word-break:break-word] font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:Regular')] font-[var(--text-new\/typeset\/fontweight\/regular,400)] leading-[var(--size\/lineheight\/250,20px)] relative shrink-0 text-[color:var(--color\/foreground\/plain,#25292f)] text-[length:var(--size\/text-new\/body\/md,14px)] whitespace-nowrap" data-node-id="I2422:87304;4584:600370;4584:600381" style={{ fontVariationSettings: '"wdth" 100' }}>
Text
</p>
</div>
</div>
</div>
)}
{showVerticalDivider && (
<div className="h-[40px] relative shrink-0 w-0 z-[15]" data-node-id="2422:87305" data-name="Vertical divider short">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDividerShort} />
</div>
</div>
)}
{fullHeightDivider && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87306">
<div className="h-full relative shrink-0 w-0 z-[14]" data-name="Vertical divider full">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVerticalDividerFull} />
</div>
</div>
)}
{column8 && (
<div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-[1_0_0] isolate items-center min-w-px relative z-[13]" data-node-id="2422:87307" data-name="sl-grid-cell-8">
<div className="absolute inset-[1px_0_0_1px] z-[4]" data-node-id="I2422:87307;4584:600366" data-name="Focus ring inside" />
<div className="absolute bottom-0 left-0 top-0 w-0 z-[3]" data-node-id="I2422:87307;4584:600367" data-name="Vertical divider">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDivider} />
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] isolate items-center min-h-[40px] min-w-px relative z-[1]" data-node-id="I2422:87307;4584:600370" data-name="grid-cell content">
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px overflow-clip px-[var(--space\/150,12px)] py-[var(--space\/100,8px)] relative z-[1]" data-node-id="I2422:87307;4584:600370;4584:600380" data-name="Content">
<p className="[word-break:break-word] font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:Regular')] font-[var(--text-new\/typeset\/fontweight\/regular,400)] leading-[var(--size\/lineheight\/250,20px)] relative shrink-0 text-[color:var(--color\/foreground\/plain,#25292f)] text-[length:var(--size\/text-new\/body\/md,14px)] whitespace-nowrap" data-node-id="I2422:87307;4584:600370;4584:600381" style={{ fontVariationSettings: '"wdth" 100' }}>
Text
</p>
</div>
</div>
</div>
)}
{showVerticalDivider && (
<div className="h-[40px] relative shrink-0 w-0 z-[12]" data-node-id="2422:87308" data-name="Vertical divider short">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDividerShort} />
</div>
</div>
)}
{fullHeightDivider && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87309">
<div className="h-full relative shrink-0 w-0 z-[11]" data-name="Vertical divider full">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVerticalDividerFull} />
</div>
</div>
)}
{column9 && (
<div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-[1_0_0] isolate items-center min-w-px relative z-[10]" data-node-id="2422:87310" data-name="sl-grid-cell-9">
<div className="absolute inset-[1px_0_0_1px] z-[4]" data-node-id="I2422:87310;4584:600366" data-name="Focus ring inside" />
<div className="absolute bottom-0 left-0 top-0 w-0 z-[3]" data-node-id="I2422:87310;4584:600367" data-name="Vertical divider">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDivider} />
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] isolate items-center min-h-[40px] min-w-px relative z-[1]" data-node-id="I2422:87310;4584:600370" data-name="grid-cell content">
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px overflow-clip px-[var(--space\/150,12px)] py-[var(--space\/100,8px)] relative z-[1]" data-node-id="I2422:87310;4584:600370;4584:600380" data-name="Content">
<p className="[word-break:break-word] font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:Regular')] font-[var(--text-new\/typeset\/fontweight\/regular,400)] leading-[var(--size\/lineheight\/250,20px)] relative shrink-0 text-[color:var(--color\/foreground\/plain,#25292f)] text-[length:var(--size\/text-new\/body\/md,14px)] whitespace-nowrap" data-node-id="I2422:87310;4584:600370;4584:600381" style={{ fontVariationSettings: '"wdth" 100' }}>
Text
</p>
</div>
</div>
</div>
)}
{showVerticalDivider && (
<div className="h-[40px] relative shrink-0 w-0 z-[9]" data-node-id="2422:87311" data-name="Vertical divider short">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDividerShort} />
</div>
</div>
)}
{fullHeightDivider && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87312">
<div className="h-full relative shrink-0 w-0 z-[8]" data-name="Vertical divider full">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVerticalDividerFull} />
</div>
</div>
)}
{showVerticalDivider && (
<div className="h-[40px] relative shrink-0 w-0 z-[7]" data-node-id="2422:87313" data-name="Vertical divider short">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDividerShort} />
</div>
</div>
)}
{fullHeightDivider && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87314">
<div className="h-full relative shrink-0 w-0 z-[6]" data-name="Vertical divider full">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVerticalDividerFull} />
</div>
</div>
)}
{column10 && (
<div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-[1_0_0] isolate items-center min-w-px relative z-[5]" data-node-id="2422:87315" data-name="sl-grid-cell-10">
<div className="absolute inset-[1px_0_0_1px] z-[4]" data-node-id="I2422:87315;4584:600366" data-name="Focus ring inside" />
<div className="absolute bottom-0 left-0 top-0 w-0 z-[3]" data-node-id="I2422:87315;4584:600367" data-name="Vertical divider">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDivider} />
</div>
</div>
<div className="content-stretch flex flex-[1_0_0] isolate items-center min-h-[40px] min-w-px relative z-[1]" data-node-id="I2422:87315;4584:600370" data-name="grid-cell content">
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px overflow-clip px-[var(--space\/150,12px)] py-[var(--space\/100,8px)] relative z-[1]" data-node-id="I2422:87315;4584:600370;4584:600380" data-name="Content">
<p className="[word-break:break-word] font-[family-name:var(--text-new\/typeset\/fontfamily\/body,'Roboto:Regular')] font-[var(--text-new\/typeset\/fontweight\/regular,400)] leading-[var(--size\/lineheight\/250,20px)] relative shrink-0 text-[color:var(--color\/foreground\/plain,#25292f)] text-[length:var(--size\/text-new\/body\/md,14px)] whitespace-nowrap" data-node-id="I2422:87315;4584:600370;4584:600381" style={{ fontVariationSettings: '"wdth" 100' }}>
Text
</p>
</div>
</div>
</div>
)}
{showVerticalDivider && (
<div className="h-[40px] relative shrink-0 w-0 z-[4]" data-node-id="2422:87316" data-name="Vertical divider short">
<div className="absolute inset-[0_-1px_0_0]">
<img alt="" className="block max-w-none size-full" src={imgVerticalDividerShort1} />
</div>
</div>
)}
{fullHeightDivider && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87320">
<div className="h-full relative shrink-0 w-0 z-[3]" data-name="Vertical divider full">
<img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVerticalDividerFull} />
</div>
</div>
)}
{showIcons && (
<div className="flex flex-row items-center self-stretch" data-node-id="2422:87321">
<div className="bg-[rgba(255,255,255,0)] content-stretch flex h-full isolate items-center relative shrink-0 w-[160px] z-[2]" data-name="buttonbar">
<div className="absolute inset-[1px_0_0_1px] z-[4]" data-node-id="I2422:87321;4584:600366" data-name="Focus ring inside" />
<div className="content-stretch flex flex-[1_0_0] isolate items-center justify-end min-h-[40px] min-w-px relative z-[1]" data-node-id="I2422:87321;4584:600370" data-name="grid-cell content">
<div className="content-stretch flex flex-[1_0_0] items-center min-w-px overflow-clip px-[var(--space\/150,12px)] py-[var(--space\/025,2px)] relative z-[1]" data-node-id="I2422:87321;4584:600370;4584:600415" data-name="Content">
<div className="content-stretch flex flex-[1_0_0] gap-[var(--space-new\/xs,4px)] items-center justify-end min-w-px relative" data-node-id="I2422:87321;4584:600370;10056:318538" data-name="sl-button-bar/Rectangle">
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315721" data-name="Action 2">
<div className="content-stretch flex items-start overflow-clip relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315721;109:59550" data-name="Button-Variants">
<div className="content-stretch flex gap-[var(--space-new\/sm,6px)] isolate items-center justify-center overflow-clip p-[var(--space\/125,10px)] relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315721;109:59550;730:95879" data-name="Button-Base">
<div className="relative shrink-0 size-[16px] z-[4]" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315721;109:59550;730:95879;730:95790" data-name="start icon">
<div className="absolute bg-[var(--color\/foreground\/secondary\/bold,#222)] inset-[-2px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[2px_2px] mask-size-[16px_16px]" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315721;109:59550;730:95879;730:95792" style={{ maskImage: `url("${imgIconColorMask1}")` }} data-name="icon color mask" />
</div>
<div className="absolute inset-0 opacity-[calc(var(--opacity\/interactive\/plain\/idle,0)/100)] z-[1]" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315721;109:59550;730:95879;730:95798" data-name="interactive" />
</div>
</div>
<div className="absolute inset-[0_1px_0_0]" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315721;2101:99172" data-name="Focus ring outside" />
</div>
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315723" data-name="Action 3">
<div className="content-stretch flex items-start overflow-clip relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315723;109:59550" data-name="Button-Variants">
<div className="content-stretch flex gap-[var(--space-new\/sm,6px)] isolate items-center justify-center overflow-clip p-[var(--space\/125,10px)] relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315723;109:59550;730:95879" data-name="Button-Base">
<div className="relative shrink-0 size-[16px] z-[4]" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315723;109:59550;730:95879;730:95790" data-name="start icon">
<div className="absolute bg-[var(--color\/foreground\/secondary\/bold,#222)] inset-[-2px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[2px_2px] mask-size-[16px_16px]" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315723;109:59550;730:95879;730:95792" style={{ maskImage: `url("${imgIconColorMask2}")` }} data-name="icon color mask" />
</div>
<div className="absolute inset-0 opacity-[calc(var(--opacity\/interactive\/plain\/idle,0)/100)] z-[1]" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315723;109:59550;730:95879;730:95798" data-name="interactive" />
</div>
</div>
<div className="absolute inset-[0_1px_0_0]" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315723;2101:99172" data-name="Focus ring outside" />
</div>
<div className="content-stretch flex items-start relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315725" data-name="Action 4">
<div className="content-stretch flex items-start overflow-clip relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315725;109:59550" data-name="Button-Variants">
<div className="content-stretch flex gap-[var(--space-new\/sm,6px)] isolate items-center justify-center overflow-clip p-[var(--space\/125,10px)] relative rounded-[var(--size\/borderradius\/default,4px)] shrink-0" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315725;109:59550;730:95879" data-name="Button-Base">
<div className="relative shrink-0 size-[16px] z-[4]" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315725;109:59550;730:95879;730:95790" data-name="start icon">
<div className="absolute bg-[var(--color\/foreground\/secondary\/bold,#222)] inset-[-2px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[2px_2px] mask-size-[16px_16px]" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315725;109:59550;730:95879;730:95792" style={{ maskImage: `url("${imgIconColorMask3}")` }} data-name="icon color mask" />
</div>
<div className="absolute inset-0 opacity-[calc(var(--opacity\/interactive\/plain\/idle,0)/100)] z-[1]" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315725;109:59550;730:95879;730:95798" data-name="interactive" />
</div>
</div>
<div className="absolute inset-[0_1px_0_0]" data-node-id="I2422:87321;4584:600370;10056:318538;8244:315725;2101:99172" data-name="Focus ring outside" />
</div>
</div>
</div>
</div>
</div>
</div>
)}
<div className="absolute content-stretch flex flex-col inset-0 items-start z-[1]" data-node-id="2422:87322" data-name="grid-row-background">
<div className="absolute bg-[var(--color\/background\/interactive\/plain,#818b98)] inset-0 opacity-[calc(var(--opacity\/interactive\/plain\/idle,0)/100)]" data-node-id="I2422:87322;4584:745884" data-name="Interactive" />
</div>
</div>
);
}

export default function SlGridRow1() {
return <SlGridRow className="content-stretch flex isolate items-center relative size-full" column5={false} showCheckbox={false} showGrabber={false} showIcons={false} />;
}SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.

1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
   DO NOT install any Tailwind as a dependency unless the user instructs you to do so.
   Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.These styles are contained in the design: Body/md/regular: Font(family: "text-new/typeset/fontFamily/body", style: Regular, size: size/text-new/body/md, weight: text-new/typeset/fontWeight/regular, lineHeight: size/lineHeight/250, letterSpacing: 0).Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Row type=Default, State=Idle

**Node ID:** 2404:74806

Background of elevated components like cards, grids, or dropdowns that sit on top of the base surface. Use in combination with 'elevation.shadow.raised'.Images and SVGs will be stored as constants, e.g. const image = `${assetPathPrefix}/<asset file name>`, where assetPathPrefix is declared once at the top of the code and every asset URL interpolates it. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
