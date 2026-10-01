Single call on the whole frame (174:232051) succeeded — no fallback to structural children was needed.

```jsx
const assetPathPrefix = "https://www.figma.com/api/mcp/asset/6d3339a7-abab-4259-8de4-9e7150366fc6";
const imgPexelsMaryTaylor58965212 = `${assetPathPrefix}/f1fba.png`;
const imgLogoWordmark = `${assetPathPrefix}/37df9.svg`;

type ImageLoginProps = {
  className?: string;
  name?: "img 2";
};

function ImageLogin({ className, name = "img 2" }: ImageLoginProps) {
  return (
    <div className={className || "h-[924px] relative w-[745px]"} data-node-id="176:38378">
      <div className="absolute inset-0 rounded-[24px]" data-node-id="176:38387" data-name="pexels-mary-taylor-5896521 2">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[24px]">
          <img alt="" className="absolute h-[132.69%] left-[-8.65%] max-w-none top-[-17.75%] w-[113.63%]" src={imgPexelsMaryTaylor58965212} />
        </div>
      </div>
    </div>
  );
}

function LogoWordmark({ className }: { className?: string }) {
  return (
    <div className={className || "h-[19.454px] relative w-[106.998px]"} data-node-id="56:25434" data-name="logo-wordmark">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLogoWordmark} />
    </div>
  );
}

export default function AccountCreation({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[var(--background\\/canvas,#fbfaf7)] h-[982px] overflow-clip relative rounded-[var(--size\\/icon\\/font\\/xs,12px)] shadow-[0px_125px_35px_0px_rgba(62,85,152,0),0px_80px_32px_0px_rgba(62,85,152,0.01),0px_45px_27px_0px_rgba(62,85,152,0.03),0px_20px_20px_0px_rgba(62,85,152,0.04),0px_5px_11px_0px_rgba(62,85,152,0.05)] w-[1512px]"} data-node-id="174:232051" data-name="Account creation">
      <div className="-translate-y-1/2 absolute content-stretch flex flex-col gap-[56px] items-center left-[147px] top-[calc(50%+28px)] w-[462px]" data-node-id="174:231462">
        <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="174:231463">
          <p className="[word-break:break-word] font-['New_Message:SemiBold'] leading-[var(--size\/lineheight\/500,40px)] not-italic relative shrink-0 text-[color:var(--color\/palette\/purple\/900,#29076e)] text-[length:var(--size\/text-new\/heading\/xl,32px)] text-center w-[464px]" data-node-id="174:231464">
            Create an account
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-[376px]" data-node-id="174:231465" data-name="content inputs">
          <div className="content-stretch flex flex-col gap-[64px] items-start relative shrink-0 w-[374px]" data-node-id="174:231466">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="174:231467">
              <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="174:231468">
                <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-node-id="174:231587" data-name="inputs wrapper">
                  <CodeConnectSnippet data-node-id="174:231588" data-name="sl-text-field" data-snippet-language="SL Design System">
                    <sl-form-field label="First name">
                      <sl-text-field
                        placeholder="[object Object]"

                        value="[object Object]"
                      ></sl-text-field>
                    </sl-form-field>
                  </CodeConnectSnippet>
                  <CodeConnectSnippet data-node-id="174:231589" data-name="sl-text-field" data-snippet-language="SL Design System">
                    <sl-form-field label="Last name">
                      <sl-text-field
                        placeholder="[object Object]"

                        value="[object Object]"
                      ></sl-text-field>
                    </sl-form-field>
                  </CodeConnectSnippet>
                </div>
                <CodeConnectSnippet data-node-id="174:231470" data-name="sl-text-field" data-snippet-language="SL Design System">
                  <sl-form-field label="Email address">
                    <sl-text-field placeholder="[object Object]" required value="[object Object]"></sl-text-field>
                  </sl-form-field>
                </CodeConnectSnippet>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="174:231965">
              <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="174:231966">
                <CodeConnectSnippet data-node-id="174:231967" data-name="sl-checkbox" data-snippet-language="SL Design System">
                  <sl-checkbox checked></sl-checkbox>
                </CodeConnectSnippet>
                <CodeConnectSnippet data-node-id="174:231968" data-name="sl-checkbox" data-snippet-language="SL Design System">
                  <sl-checkbox checked></sl-checkbox>
                </CodeConnectSnippet>
                <CodeConnectSnippet data-node-id="174:231969" data-name="sl-checkbox" data-snippet-language="SL Design System">
                  <sl-checkbox checked></sl-checkbox>
                </CodeConnectSnippet>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[var(--space-new\/lg,16px)] items-start relative shrink-0 w-full" data-node-id="174:232024">
              <CodeConnectSnippet data-node-id="174:232025" data-name="sl-button-pill" data-snippet-language="SL Design System">
                <sl-button
                  shape="pill"
                  size="lg"

                  variant="primary"
                >
                  Continue
                </sl-button>
              </CodeConnectSnippet>
              <CodeConnectSnippet data-node-id="174:232026" data-name="sl-button-pill" data-snippet-language="SL Design System">
                <sl-button
                  fill="outline"
                  shape="pill"
                  size="lg"

                  variant="primary"
                >
                  <sl-icon name="far-arrow-left"></sl-icon>
                  Go back
                </sl-button>
              </CodeConnectSnippet>
            </div>
          </div>
          <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0 w-full" data-node-id="174:231473">
            <div className="[word-break:break-word] flex flex-col font-['New_Message:Medium'] justify-center leading-[0] not-italic relative shrink-0 text-[color:var(--color\/foreground\/secondary\/bold,#222)] text-[length:var(--size\/text-new\/body\/md,14px)] text-center whitespace-nowrap" data-node-id="174:231474">
              <p className="leading-[var(--size\/lineheight\/250,20px)]">{`Already have an account? `}</p>
            </div>
            <CodeConnectSnippet data-node-id="174:231475" data-name="sl-button-pill" data-snippet-language="SL Design System">
              <sl-button
                fill="link"
                shape="pill"

                variant="primary"
              >
                Sign in
              </sl-button>
            </CodeConnectSnippet>
          </div>
        </div>
      </div>
      <LogoWordmark className="absolute h-[19.454px] left-[40px] top-[41px] w-[106.998px]" />
      <ImageLogin className="absolute h-[924px] left-[732px] top-[29px] w-[745px]" />
      <div className="absolute content-stretch flex flex-col h-[41px] items-center justify-center left-0 p-[10px] top-[925px] w-[732px]" data-node-id="174:231478" data-name="footer">
        <div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0 w-full" data-node-id="I174:231478;173:3540">
          <CodeConnectSnippet data-node-id="I174:231478;173:3541" data-name="sl-button-pill" data-snippet-language="SL Design System">
            <sl-button
              fill="link"
              shape="pill"
              size="sm"

              variant="primary"
            >
              Privacy Notice
            </sl-button>
          </CodeConnectSnippet>
          <CodeConnectSnippet data-node-id="I174:231478;173:3542" data-name="sl-button-pill" data-snippet-language="SL Design System">
            <sl-button
              fill="link"
              shape="pill"
              size="sm"

              variant="primary"
            >
              Cookie Notice
            </sl-button>
          </CodeConnectSnippet>
          <CodeConnectSnippet data-node-id="I174:231478;173:3543" data-name="sl-button-pill" data-snippet-language="SL Design System">
            <sl-button
              fill="link"
              shape="pill"
              size="sm"

              variant="primary"
            >
              Terms of User
            </sl-button>
          </CodeConnectSnippet>
          <CodeConnectSnippet data-node-id="I174:231478;216:81142" data-name="sl-button-pill" data-snippet-language="SL Design System">
            <sl-button
              fill="link"
              shape="pill"
              size="sm"

              variant="primary"
            >
              AI Transparency Statement
            </sl-button>
          </CodeConnectSnippet>
        </div>
      </div>
    </div>
  );
}
```

## Component descriptions (from Figma)

- sl-text-field (1128:388094): "A text field component allows users to enter and edit single-line textual input." Docs: https://sanomalearning.design/categories/components/text-field/usage/
- Variant=Default, State=Idle (1128:388064): "Use for borders of form UI elements, such as text fields, checkboxes and, radio buttons."
- sl-checkbox (1422:709516): "Checkboxes allow users to choose one or more items from a list of options..." Docs: https://sanomalearning.design/categories/components/checkbox/usage/
- sl-icon (37:52328): "Icons communicate messages, enhance interactivity, and highlight critical information." Docs: https://sanomalearning.design/categories/components/icon/usage/
- sl-button-pill (397:42251): "A button initiates an action when clicked... INVERTED BUTTONS are only to be used with elevation.surface.raised.inverted and elevation.surface.raised.primary." Docs: https://sanomalearning.design/categories/components/button/usage/
- Icon only=false, Size=LG/MD/SM (32:118327 / 32:118325 / 32:118323): "Use for borders that highlight secondary actions."

## Notes

- Checkbox snippets render as empty `<sl-checkbox checked></sl-checkbox>` in the generated code — the rich label text with embedded links visible in the screenshot ("I have read and accept Terms & conditions", "I confirm that I have read and understood the Privacy Notice...", "I accept that AI Teacher Assistant uses cookies...") is not captured in the Code Connect snippet output itself; it must be supplied as slotted/label content by the implementer, per the screenshot.
- Drop-shadow effect style "Large" (same effect string as the Login 1 frame) is applied to the outer container.
- Footer sub-node IDs (`I174:231478;173:3541/3542/3543/216:81142`) are structurally identical in id-suffix to the Login 1 frame's footer (`I72:10150;173:3541` etc.) but carry different link text here ("Cookie Notice", "Terms of User" vs. "Terms and conditions", "Other link") — same reusable footer component, different content per screen.
