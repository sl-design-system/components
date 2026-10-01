# get_design_context — region: main exercise list panel ("Digital Exercises" header, level select, exercise count, 4x "Exercise block" rows), node 25124:56996

```jsx
const assetPathPrefix = "https://www.figma.com/api/mcp/asset/d37f617d-32b1-49e3-8229-b3ea30f74eb5";
const imgLine13 = `${assetPathPrefix}/32643.svg`;
const imgVector = `${assetPathPrefix}/da4b0.svg`;

type AddButtonProps = {
  className?: string;
  buttonState?: "Added";
};

function AddButton({ className, buttonState = "Added" }: AddButtonProps) {
  return (
    <div className={className || "content-stretch flex items-start relative"} data-node-id="8300:30408">
      <div className="content-stretch flex items-start relative shrink-0" data-node-id="8300:30422" data-name="sl-button-theme">
        <div className="bg-white border border-[#e3e6ea] border-solid content-stretch flex gap-[4px] items-center justify-center p-[4px] relative rounded-[800px] shrink-0" data-node-id="I8300:30422;2603:4611" data-name="button">
          <div className="relative shrink-0 size-[16px]" data-node-id="I8300:30422;2603:4611;915:4412" data-name="icon-core-start">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
              <div className="content-stretch flex items-center justify-center relative shrink-0 size-[14px]" data-node-id="I8300:30422;2603:4611;915:4413" data-name="icon-core-start">
                <div className="flex-[1_0_0] h-full min-w-px relative" data-node-id="I8300:30422;2603:4611;915:4413;404:33" data-name="icon-container">
                  <div className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#002f62] text-[12px] text-center" data-node-id="I8300:30422;2603:4611;915:4413;404:33;802:2162">
                    <p className="leading-[14px]">check</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-[-1px]" data-node-id="I8300:30422;2603:4611;2121:28942" data-name="Focus ring">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

type Component22Props = {
  className?: string;
  property1?: "sl-button-theme";
};

function Component22({ className, property1 = "sl-button-theme" }: Component22Props) {
  return (
    <div className={className || "content-stretch flex items-start relative"} data-node-id="12220:175359">
      <div className="content-stretch flex items-start relative shrink-0" data-node-id="12220:175344" data-name="sl-button-theme">
        <div className="bg-white border border-[#e3e6ea] border-solid content-stretch flex gap-[4px] items-center justify-center p-[4px] relative rounded-[800px] shrink-0" data-node-id="I12220:175344;2603:4611" data-name="button">
          <div className="relative shrink-0 size-[16px]" data-node-id="I12220:175344;2603:4611;915:4412" data-name="icon-core-start">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
              <div className="content-stretch flex items-center justify-center relative shrink-0 size-[14px]" data-node-id="I12220:175344;2603:4611;915:4413" data-name="icon-core-start">
                <div className="flex-[1_0_0] h-full min-w-px relative" data-node-id="I12220:175344;2603:4611;915:4413;404:33" data-name="icon-container">
                  <div className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#002f62] text-[12px] text-center" data-node-id="I12220:175344;2603:4611;915:4413;404:33;802:2162">
                    <p className="leading-[14px]">plus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-[-1px]" data-node-id="I12220:175344;2603:4611;2121:28942" data-name="Focus ring">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SlSelect() {
  return (
    <div className="border border-[#f2f3f5] border-solid content-stretch flex flex-col isolate items-start p-[16px] relative rounded-[12px] size-full" data-node-id="25124:56996" data-name="sl-select">
      <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full z-[1]" data-node-id="25124:56997">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="25124:56998">
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="25124:56999">
            <div className="content-stretch flex items-center relative shrink-0" data-node-id="25124:57000">
              <div className="content-stretch flex items-center relative shrink-0" data-node-id="25124:57001">
                <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-node-id="25124:57002">
                  <p className="[word-break:break-word] font-['Open_Sans:Bold'] font-bold leading-[34px] relative shrink-0 text-[#002649] text-[20px] whitespace-nowrap" data-node-id="25124:57003" style={{ fontVariationSettings: '"wdth" 100' }}>
                    Digital Exercises
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="25124:57004">
          <div className="content-stretch flex isolate items-start relative shrink-0" data-node-id="25124:57005" data-name="sl-select">
            <CodeConnectSnippet data-node-id="25124:57006" data-name="sl-select (simple-prototype)" data-snippet-language="SL Design System">
              <sl-form-field label="Exercises level">
                <sl-select
                  placeholder="Placeholder"

                  value="Show all"
                >
                  <sl-option>label</sl-option>
                  <sl-option>label</sl-option>
                  <sl-option>label</sl-option>
                  <sl-option>label</sl-option>
                </sl-select>
              </sl-form-field>
            </CodeConnectSnippet>
          </div>
          <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-node-id="25124:57007">
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="25124:57008">
              <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="25124:57009">
                <div className="[word-break:break-word] flex flex-col font-['Proxima_Nova:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[#002649] text-[14px] whitespace-nowrap" data-node-id="25124:57010">
                  <p>
                    <span className="leading-[20px]">{`6 exerices `}</span>
                    <span className="[word-break:break-word] font-['Proxima_Nova:Regular'] leading-[20px] not-italic">available</span>
                  </p>
                </div>
              </div>
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="25124:57011">
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="25124:57012" data-name="list of lessons">
                  <div className="bg-white border border-[#e3e6ea] border-solid content-stretch flex items-start overflow-clip p-[12px] relative rounded-[8px] shrink-0 w-full" data-node-id="25124:57013" data-name="Exercise block">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="25124:57014" data-name="exercise title and details">
                      <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="25124:57015">
                        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-node-id="25124:57016">
                          <div className="content-stretch flex items-start relative shrink-0" data-node-id="25124:57017">
                            <div className="content-stretch flex items-center relative shrink-0" data-node-id="25124:57018" data-name="time and type">
                              <div className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#71777d] text-[12px] whitespace-nowrap" data-node-id="25124:57019" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[16px]">Reken Maar! 2 | Blok 2</p>
                              </div>
                            </div>
                          </div>
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="25124:57020" data-name="name and chapter">
                            <div className="[word-break:break-word] flex flex-col font-['Open_Sans:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#002649] text-[14px] w-full" data-node-id="25124:57021" style={{ fontVariationSettings: '"wdth" 100' }}>
                              <p className="leading-[20px]">Instructiefilmpje hoofdletter w long name would look like</p>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0" data-node-id="25124:57022">
                          <div className="content-stretch flex items-start relative shrink-0" data-node-id="25124:57023" data-name="sl-button-theme">
                            <div className="bg-white border border-[#e3e6ea] border-solid content-stretch flex gap-[4px] items-center justify-center p-[4px] relative rounded-[800px] shrink-0" data-node-id="I25124:57023;2603:4611" data-name="button">
                              <div className="relative shrink-0 size-[16px]" data-node-id="I25124:57023;2603:4611;915:4412" data-name="icon-core-start">
                                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                  <div className="content-stretch flex items-center justify-center relative shrink-0 size-[14px]" data-node-id="I25124:57023;2603:4611;915:4413" data-name="icon-core-start">
                                    <div className="flex-[1_0_0] h-full min-w-px relative" data-node-id="I25124:57023;2603:4611;915:4413;404:33" data-name="icon-container">
                                      <div className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#002f62] text-[12px] text-center" data-node-id="I25124:57023;2603:4611;915:4413;404:33;802:2162">
                                        <p className="leading-[14px]">eye</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="absolute inset-[-1px]" data-node-id="I25124:57023;2603:4611;2121:28942" data-name="Focus ring">
                                <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
                              </div>
                            </div>
                          </div>
                          <Component22 className="content-stretch flex items-start relative shrink-0" />
                        </div>
                      </div>
                      <div className="h-0 relative shrink-0 w-full" data-node-id="25124:57025">
                        <div className="absolute inset-[-1px_0_0_0]">
                          <img alt="" className="block max-w-none size-full" src={imgLine13} />
                        </div>
                      </div>
                      <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="25124:57026">
                        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-node-id="25124:57027">
                          <div className="[word-break:break-word] flex flex-col font-['Proxima_Nova:Regular'] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#71777d] text-[10px] w-[min-content]" data-node-id="25124:57028">
                            <p className="leading-[14px]">Type:</p>
                          </div>
                          <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-node-id="25124:57029">
                            <div className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#002649] text-[12px] text-center whitespace-nowrap" data-node-id="25124:57030" style={{ fontVariationSettings: '"wdth" 100' }}>
                              <p className="leading-[16px]">Single choice |Multi choice |Drag and drop</p>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-[1_0_0] gap-[40px] items-center justify-end min-w-px relative" data-node-id="25124:57032">
                          <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="25124:57033">
                            <div className="[word-break:break-word] flex flex-col font-['Proxima_Nova:Regular'] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#71777d] text-[10px] w-[min-content]" data-node-id="25124:57034">
                              <p className="leading-[14px]">Time:</p>
                            </div>
                            <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[46.667px]" data-node-id="25124:57035" data-name="time">
                              <div className="relative shrink-0 size-[11.667px]" data-node-id="25124:57036" data-name="Vector">
                                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector} />
                              </div>
                              <div className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#002649] text-[12px] whitespace-nowrap" data-node-id="25124:57037" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[16px]">00:45</p>
                              </div>
                            </div>
                          </div>
                          <div className="[word-break:break-word] content-stretch flex flex-col items-start leading-[0] relative shrink-0 whitespace-nowrap" data-node-id="25124:57038">
                            <div className="flex flex-col font-['Proxima_Nova:Regular'] justify-center not-italic relative shrink-0 text-[#71777d] text-[10px]" data-node-id="25124:57039">
                              <p className="leading-[14px]">Exercises:</p>
                            </div>
                            <div className="content-stretch flex gap-[4px] items-center relative shrink-0 text-[#002649] text-[12px]" data-node-id="25124:57040" data-name="time">
                              <div className="flex flex-col font-['Font_Awesome_6_Pro:Regular'] justify-center not-italic relative shrink-0" data-node-id="25124:57041">
                                <p className="leading-[16px]">list</p>
                              </div>
                              <div className="flex flex-col font-['Open_Sans:Regular'] font-normal justify-center relative shrink-0" data-node-id="25124:57042" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[16px]">1</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-[#e3e6ea] border-solid content-stretch flex items-start overflow-clip p-[12px] relative rounded-[8px] shrink-0 w-full" data-node-id="25124:57043" data-name="Exercise block">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="25124:57044" data-name="exercise title and details">
                      <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="25124:57045">
                        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-node-id="25124:57046">
                          <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-node-id="25124:57047">
                            <div className="content-stretch flex items-center relative shrink-0" data-node-id="25124:57048" data-name="time and type">
                              <div className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#71777d] text-[12px] whitespace-nowrap" data-node-id="25124:57049" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[16px]">Reken Maar! 2 | Blok 2</p>
                              </div>
                            </div>
                            <div className="content-stretch flex items-start relative shrink-0" data-node-id="25124:57050" data-name="sl-badge [DRAFT]">
                              <div className="content-stretch flex items-start relative shrink-0" data-node-id="I25124:57050;931:392128" data-name="badge-base-theme [DRAFT]">
                                <div className="bg-[#e0eaff] content-stretch flex gap-[4px] h-[16px] items-center px-[8px] relative rounded-[999px] shrink-0" data-node-id="I25124:57050;931:392128;7294:4490" data-name="badge">
                                  <div className="content-stretch flex items-center justify-center relative shrink-0 size-[12px]" data-node-id="I25124:57050;931:392128;7294:4490;6743:8604" data-name="badge-icon">
                                    <div className="flex-[1_0_0] h-full min-w-px relative" data-node-id="I25124:57050;931:392128;7294:4490;6743:8604;6743:17393" data-name="icon-container">
                                      <div className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#2351db] text-[10px] text-center" data-node-id="I25124:57050;931:392128;7294:4490;6743:8604;6743:17393;802:2162">
                                        <p className="leading-[12px]">star</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="[word-break:break-word] flex flex-col font-['Source_Sans_Pro:SemiBold'] justify-center leading-[0] not-italic relative shrink-0 text-[#2351db] text-[10px] text-center uppercase whitespace-nowrap" data-node-id="I25124:57050;931:392128;7294:4490;6743:8605">
                                    <p className="leading-[12px]">MAX</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="25124:57051" data-name="name and chapter">
                            <div className="[word-break:break-word] flex flex-col font-['Open_Sans:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#002649] text-[14px] w-full" data-node-id="25124:57052" style={{ fontVariationSettings: '"wdth" 100' }}>
                              <p className="leading-[20px]">Instructiefilmpje hoofdletter w long name would look like</p>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0" data-node-id="25124:57053">
                          <div className="content-stretch flex items-start relative shrink-0" data-node-id="25124:57054" data-name="sl-button-theme">
                            <div className="bg-white border border-[#e3e6ea] border-solid content-stretch flex gap-[4px] items-center justify-center p-[4px] relative rounded-[800px] shrink-0" data-node-id="I25124:57054;2603:4611" data-name="button">
                              <div className="relative shrink-0 size-[16px]" data-node-id="I25124:57054;2603:4611;915:4412" data-name="icon-core-start">
                                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                  <div className="content-stretch flex items-center justify-center relative shrink-0 size-[14px]" data-node-id="I25124:57054;2603:4611;915:4413" data-name="icon-core-start">
                                    <div className="flex-[1_0_0] h-full min-w-px relative" data-node-id="I25124:57054;2603:4611;915:4413;404:33" data-name="icon-container">
                                      <div className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#002f62] text-[12px] text-center" data-node-id="I25124:57054;2603:4611;915:4413;404:33;802:2162">
                                        <p className="leading-[14px]">eye</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="absolute inset-[-1px]" data-node-id="I25124:57054;2603:4611;2121:28942" data-name="Focus ring">
                                <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
                              </div>
                            </div>
                          </div>
                          <Component22 className="content-stretch flex items-start opacity-50 relative shrink-0" />
                        </div>
                      </div>
                      <div className="h-0 relative shrink-0 w-full" data-node-id="25124:57056">
                        <div className="absolute inset-[-1px_0_0_0]">
                          <img alt="" className="block max-w-none size-full" src={imgLine13} />
                        </div>
                      </div>
                      <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="25124:57057">
                        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-node-id="25124:57058">
                          <div className="[word-break:break-word] flex flex-col font-['Proxima_Nova:Regular'] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#71777d] text-[10px] w-[min-content]" data-node-id="25124:57059">
                            <p className="leading-[14px]">Type:</p>
                          </div>
                          <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-node-id="25124:57060">
                            <div className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#002649] text-[12px] text-center whitespace-nowrap" data-node-id="25124:57061" style={{ fontVariationSettings: '"wdth" 100' }}>
                              <p className="leading-[16px]">Single choice |Multi choice |Drag and drop</p>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-[1_0_0] gap-[40px] items-center justify-end min-w-px relative" data-node-id="25124:57063">
                          <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="25124:57064">
                            <div className="[word-break:break-word] flex flex-col font-['Proxima_Nova:Regular'] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#71777d] text-[10px] w-[min-content]" data-node-id="25124:57065">
                              <p className="leading-[14px]">Time:</p>
                            </div>
                            <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[46.667px]" data-node-id="25124:57066" data-name="time">
                              <div className="relative shrink-0 size-[11.667px]" data-node-id="25124:57067" data-name="Vector">
                                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector} />
                              </div>
                              <div className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#002649] text-[12px] whitespace-nowrap" data-node-id="25124:57068" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[16px]">00:45</p>
                              </div>
                            </div>
                          </div>
                          <div className="[word-break:break-word] content-stretch flex flex-col items-start leading-[0] relative shrink-0 whitespace-nowrap" data-node-id="25124:57069">
                            <div className="flex flex-col font-['Proxima_Nova:Regular'] justify-center not-italic relative shrink-0 text-[#71777d] text-[10px]" data-node-id="25124:57070">
                              <p className="leading-[14px]">Exercises:</p>
                            </div>
                            <div className="content-stretch flex gap-[4px] items-center relative shrink-0 text-[#002649] text-[12px]" data-node-id="25124:57071" data-name="time">
                              <div className="flex flex-col font-['Font_Awesome_6_Pro:Regular'] justify-center not-italic relative shrink-0" data-node-id="25124:57072">
                                <p className="leading-[16px]">list</p>
                              </div>
                              <div className="flex flex-col font-['Open_Sans:Regular'] font-normal justify-center relative shrink-0" data-node-id="25124:57073" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[16px]">1</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-[#e3e6ea] border-solid content-stretch flex items-start overflow-clip p-[12px] relative rounded-[8px] shrink-0 w-full" data-node-id="25124:57074" data-name="Exercise block">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="25124:57075" data-name="exercise title and details">
                      <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="25124:57076">
                        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-node-id="25124:57077">
                          <div className="content-stretch flex items-start relative shrink-0" data-node-id="25124:57078">
                            <div className="content-stretch flex items-center relative shrink-0" data-node-id="25124:57079" data-name="time and type">
                              <div className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#71777d] text-[12px] whitespace-nowrap" data-node-id="25124:57080" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[16px]">Reken Maar! 2 | Blok 2</p>
                              </div>
                            </div>
                          </div>
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="25124:57081" data-name="name and chapter">
                            <div className="[word-break:break-word] flex flex-col font-['Open_Sans:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#002649] text-[14px] w-full" data-node-id="25124:57082" style={{ fontVariationSettings: '"wdth" 100' }}>
                              <p className="leading-[20px]">Instructiefilmpje hoofdletter w long name would look like</p>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0" data-node-id="25124:57083">
                          <div className="content-stretch flex items-start relative shrink-0" data-node-id="25124:57084" data-name="sl-button-theme">
                            <div className="bg-white border border-[#e3e6ea] border-solid content-stretch flex gap-[4px] items-center justify-center p-[4px] relative rounded-[800px] shrink-0" data-node-id="I25124:57084;2603:4611" data-name="button">
                              <div className="relative shrink-0 size-[16px]" data-node-id="I25124:57084;2603:4611;915:4412" data-name="icon-core-start">
                                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                  <div className="content-stretch flex items-center justify-center relative shrink-0 size-[14px]" data-node-id="I25124:57084;2603:4611;915:4413" data-name="icon-core-start">
                                    <div className="flex-[1_0_0] h-full min-w-px relative" data-node-id="I25124:57084;2603:4611;915:4413;404:33" data-name="icon-container">
                                      <div className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#002f62] text-[12px] text-center" data-node-id="I25124:57084;2603:4611;915:4413;404:33;802:2162">
                                        <p className="leading-[14px]">eye</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="absolute inset-[-1px]" data-node-id="I25124:57084;2603:4611;2121:28942" data-name="Focus ring">
                                <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
                              </div>
                            </div>
                          </div>
                          <Component22 className="content-stretch flex items-start relative shrink-0" />
                        </div>
                      </div>
                      <div className="h-0 relative shrink-0 w-full" data-node-id="25124:57086">
                        <div className="absolute inset-[-1px_0_0_0]">
                          <img alt="" className="block max-w-none size-full" src={imgLine13} />
                        </div>
                      </div>
                      <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="25124:57087">
                        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-node-id="25124:57088">
                          <div className="[word-break:break-word] flex flex-col font-['Proxima_Nova:Regular'] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#71777d] text-[10px] w-[min-content]" data-node-id="25124:57089">
                            <p className="leading-[14px]">Type:</p>
                          </div>
                          <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-node-id="25124:57090">
                            <div className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#002649] text-[12px] text-center whitespace-nowrap" data-node-id="25124:57091" style={{ fontVariationSettings: '"wdth" 100' }}>
                              <p className="leading-[16px]">Single choice |Multi choice |Drag and drop</p>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-[1_0_0] gap-[40px] items-center justify-end min-w-px relative" data-node-id="25124:57093">
                          <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="25124:57094">
                            <div className="[word-break:break-word] flex flex-col font-['Proxima_Nova:Regular'] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#71777d] text-[10px] w-[min-content]" data-node-id="25124:57095">
                              <p className="leading-[14px]">Time:</p>
                            </div>
                            <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[46.667px]" data-node-id="25124:57096" data-name="time">
                              <div className="relative shrink-0 size-[11.667px]" data-node-id="25124:57097" data-name="Vector">
                                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector} />
                              </div>
                              <div className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#002649] text-[12px] whitespace-nowrap" data-node-id="25124:57098" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[16px]">00:45</p>
                              </div>
                            </div>
                          </div>
                          <div className="[word-break:break-word] content-stretch flex flex-col items-start leading-[0] relative shrink-0 whitespace-nowrap" data-node-id="25124:57099">
                            <div className="flex flex-col font-['Proxima_Nova:Regular'] justify-center not-italic relative shrink-0 text-[#71777d] text-[10px]" data-node-id="25124:57100">
                              <p className="leading-[14px]">Exercises:</p>
                            </div>
                            <div className="content-stretch flex gap-[4px] items-center relative shrink-0 text-[#002649] text-[12px]" data-node-id="25124:57101" data-name="time">
                              <div className="flex flex-col font-['Font_Awesome_6_Pro:Regular'] justify-center not-italic relative shrink-0" data-node-id="25124:57102">
                                <p className="leading-[16px]">list</p>
                              </div>
                              <div className="flex flex-col font-['Open_Sans:Regular'] font-normal justify-center relative shrink-0" data-node-id="25124:57103" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[16px]">1</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-[#e3e6ea] border-solid content-stretch flex items-start overflow-clip p-[12px] relative rounded-[8px] shrink-0 w-full" data-node-id="25124:57104" data-name="Exercise block">
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="25124:57105" data-name="exercise title and details">
                      <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="25124:57106">
                        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-node-id="25124:57107">
                          <div className="content-stretch flex items-start relative shrink-0" data-node-id="25124:57108">
                            <div className="content-stretch flex items-center relative shrink-0" data-node-id="25124:57109" data-name="time and type">
                              <div className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#71777d] text-[12px] whitespace-nowrap" data-node-id="25124:57110" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[16px]">Reken Maar! 2 | Blok 2</p>
                              </div>
                            </div>
                          </div>
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="25124:57111" data-name="name and chapter">
                            <div className="[word-break:break-word] flex flex-col font-['Open_Sans:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#002649] text-[14px] w-full" data-node-id="25124:57112" style={{ fontVariationSettings: '"wdth" 100' }}>
                              <p className="leading-[20px]">Instructiefilmpje hoofdletter w long name would look like</p>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0" data-node-id="25124:57113">
                          <div className="content-stretch flex items-start relative shrink-0" data-node-id="25124:57114" data-name="sl-button-theme">
                            <div className="bg-white border border-[#e3e6ea] border-solid content-stretch flex gap-[4px] items-center justify-center p-[4px] relative rounded-[800px] shrink-0" data-node-id="I25124:57114;2603:4611" data-name="button">
                              <div className="relative shrink-0 size-[16px]" data-node-id="I25124:57114;2603:4611;915:4412" data-name="icon-core-start">
                                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                                  <div className="content-stretch flex items-center justify-center relative shrink-0 size-[14px]" data-node-id="I25124:57114;2603:4611;915:4413" data-name="icon-core-start">
                                    <div className="flex-[1_0_0] h-full min-w-px relative" data-node-id="I25124:57114;2603:4611;915:4413;404:33" data-name="icon-container">
                                      <div className="[word-break:break-word] absolute flex flex-col font-['Font_Awesome_6_Pro:Regular'] inset-0 justify-center leading-[0] not-italic text-[#002f62] text-[12px] text-center" data-node-id="I25124:57114;2603:4611;915:4413;404:33;802:2162">
                                        <p className="leading-[14px]">eye</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="absolute inset-[-1px]" data-node-id="I25124:57114;2603:4611;2121:28942" data-name="Focus ring">
                                <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full" />
                              </div>
                            </div>
                          </div>
                          <Component22 className="content-stretch flex items-start opacity-50 relative shrink-0" />
                        </div>
                      </div>
                      <div className="h-0 relative shrink-0 w-full" data-node-id="25124:57116">
                        <div className="absolute inset-[-1px_0_0_0]">
                          <img alt="" className="block max-w-none size-full" src={imgLine13} />
                        </div>
                      </div>
                      <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="25124:57117">
                        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-node-id="25124:57118">
                          <div className="[word-break:break-word] flex flex-col font-['Proxima_Nova:Regular'] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#71777d] text-[10px] w-[min-content]" data-node-id="25124:57119">
                            <p className="leading-[14px]">Type:</p>
                          </div>
                          <div className="content-stretch flex gap-[4px] items-start relative shrink-0" data-node-id="25124:57120">
                            <div className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#002649] text-[12px] text-center whitespace-nowrap" data-node-id="25124:57121" style={{ fontVariationSettings: '"wdth" 100' }}>
                              <p className="leading-[16px]">Single choice |Multi choice |Drag and drop</p>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-[1_0_0] gap-[40px] items-center justify-end min-w-px relative" data-node-id="25124:57123">
                          <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="25124:57124">
                            <div className="[word-break:break-word] flex flex-col font-['Proxima_Nova:Regular'] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#71777d] text-[10px] w-[min-content]" data-node-id="25124:57125">
                              <p className="leading-[14px]">Time:</p>
                            </div>
                            <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[46.667px]" data-node-id="25124:57126" data-name="time">
                              <div className="relative shrink-0 size-[11.667px]" data-node-id="25124:57127" data-name="Vector">
                                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector} />
                              </div>
                              <div className="[word-break:break-word] flex flex-col font-['Open_Sans:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#002649] text-[12px] whitespace-nowrap" data-node-id="25124:57128" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[16px]">00:45</p>
                              </div>
                            </div>
                          </div>
                          <div className="[word-break:break-word] content-stretch flex flex-col items-start leading-[0] relative shrink-0 whitespace-nowrap" data-node-id="25124:57129">
                            <div className="flex flex-col font-['Proxima_Nova:Regular'] justify-center not-italic relative shrink-0 text-[#71777d] text-[10px]" data-node-id="25124:57130">
                              <p className="leading-[14px]">Exercises:</p>
                            </div>
                            <div className="content-stretch flex gap-[4px] items-center relative shrink-0 text-[#002649] text-[12px]" data-node-id="25124:57131" data-name="time">
                              <div className="flex flex-col font-['Font_Awesome_6_Pro:Regular'] justify-center not-italic relative shrink-0" data-node-id="25124:57132">
                                <p className="leading-[16px]">list</p>
                              </div>
                              <div className="flex flex-col font-['Open_Sans:Regular'] font-normal justify-center relative shrink-0" data-node-id="25124:57133" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[16px]">1</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute content-stretch flex isolate items-start left-0 top-0" data-node-id="25124:57134" data-name="sl-select">
            <CodeConnectSnippet data-node-id="25124:57135" data-name="sl-select (simple-prototype)" data-snippet-language="SL Design System">
              <sl-form-field label="Exercises level">
                <sl-select
                  placeholder="Placeholder"

                  value="Show all"
                >
                  <sl-option>label</sl-option>
                  <sl-option>label</sl-option>
                  <sl-option>label</sl-option>
                  <sl-option>label</sl-option>
                </sl-select>
              </sl-form-field>
            </CodeConnectSnippet>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Tool metadata for this call:

- "SUPER CRITICAL" framework-conversion notice.
- Node ids added as data attributes.
- Styles contained in the design: body/foreground: #002649, shadow.overlay: Effect(type: DROP_SHADOW, color: color/shadow/overlay2, offset: (0, 6), radius: 18, spread: 0); Effect(type: DROP_SHADOW, color: color/shadow/overlay1, offset: (0, 6), radius: 12, spread: -3), input/textField/text/md: Font(family: "Proxima Nova", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0), color/palette/neutral/600: #71777D, text/body/sm/normal: Font(family: "Open Sans", style: Regular, size: 12, weight: 400, lineHeight: 16, letterSpacing: 0), text/body/md/demibold: Font(family: "Open Sans", style: SemiBold, size: 14, weight: 600, lineHeight: 20, letterSpacing: 0), button/default/solid/idle/foreground: #002F62, button/default/solid/idle/background: #FFFFFF, button/default/solid/idle/border: #E3E6EA, color/palette/neutral/50: #F2F3F5, color/button/default/solid/idle/border: #E3E6EA.
- **IMPORTANT Code Connect finding**: nodes 25124:57006 and 25124:57135 ("sl-select (simple-prototype)") ARE resolved via Code Connect, wrapped in a `CodeConnectSnippet` tag, mapping to:
  ```html
  <sl-form-field label="Exercises level">
    <sl-select placeholder="Placeholder" value="Show all">
      <sl-option>label</sl-option>
      <sl-option>label</sl-option>
      <sl-option>label</sl-option>
      <sl-option>label</sl-option>
    </sl-select>
  </sl-form-field>
  ```
  This directly contradicts the earlier per-node `get_code_connect_map` probe on node 25124:57006, which returned `{}` with a timeout note on both the initial call and the retry. The design-context call succeeded where the direct map probe failed/timed out. This node should be treated as CONNECTED (`sl-form-field` + `sl-select` + `sl-option`), not as unconnected/inferred — see the updated note in `figma-code-connect-map.json`.
- Component descriptions: sl-select (simple-prototype) (Node ID 29432:32979): "A select component allows users to choose from a predefined list of options..." Documentation: https://sanomalearning.design/categories/components/select/usage/; sl-icon (Node ID 24403:668989): Documentation: https://sanomalearning.design/categories/components/icon/usage/; menu-variants (Node ID 24403:669124): "The default, flat surface level. Used for primary content backgrounds or non-interactive UI regions."; menu-base (Node ID 24403:669018): "For overlays like modals, drawers, or menus."; Variant=Default, State=Idle (Node ID 24403:669649): "Use for borders of form UI elements, such as text fields, checkboxes and, radio buttons."
- Image assets note: images/SVGs are constants referencing `${assetPathPrefix}/<file>`, hosted on a remote server for 7 days.
- Screenshot for this call shows the select dropdown open (prototype interaction state) with options "Regular / Differentiation / Remediation / Enrichment" overlaying the exercise list — this is a non-default/open state, not the default static layout.
