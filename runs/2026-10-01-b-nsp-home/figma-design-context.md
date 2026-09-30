Response from mcp__figma__get_design_context (fileKey sSrpLCZm302ces3khoBGls, nodeId 2095:44291), captured verbatim (code portion complete; the tail metadata/description footer was truncated by the MCP client at ~25k tokens but the component descriptions and style-name annotations were captured before truncation and are included below).

## Code (React+Tailwind reference, to be translated to lit + sanoma-pro theme)

```
const assetPathPrefix = "https://www.figma.com/api/mcp/asset/a9392ba1-c990-444e-91e0-dbf8629783df";
const imgImage = `${assetPathPrefix}/5e22d.png`;
const imgLogo = `${assetPathPrefix}/b4039.svg`;
const imgProperty1Default = `${assetPathPrefix}/b4762.svg`;
const imgImage1 = `${assetPathPrefix}/d2f0d.png`;
const imgAvatarContent = `${assetPathPrefix}/d5fc3.svg`;
const imgMask = `${assetPathPrefix}/041a2.svg`;
const imgIconColorMask = `${assetPathPrefix}/bbed8.svg`;
const imgIconContainer = `${assetPathPrefix}/fb4be.svg`;

// ContentBlock (blueprint, data-node-id=2095:40608) — "This is a blueprint — please detach it before using in any mockups."
// MediaFillOrFit (data-node-id=2074:12654) — plain <img> fill/fit wrapper, used inside each class card's media slot.
// Clear (data-node-id=2034:6953) — sl-icon "times-circle" clear-affordance used inside SlSearchField.
// SlSearchField (data-node-id range 2034:7194-2034:7222) — full sl-search-field render tree (label + sl-icon "search" + input + Clear).
// Logo / Logo1 — static logo image swatches (2034:4190 / 2034:4193).

export default function Home() {
  return (
    <div data-node-id="2095:44291" data-name="home"> {/* bg grey/100, flex column, pb-20 */}
      <div data-node-id="2095:44292" data-name="Navigation"> {/* global topbar: Logo, 4x Link-nav (Home[active]/Calendar/Method catalogue/Teaching materials), SlSearchField, profile(sl-avatar + sl-icon chevron-down) */}
      <div data-node-id="2095:44293" data-name="main wrapper">
        <div data-node-id="2095:44294" data-name="content-area-wrapper"> {/* px-48 */}
          <div data-node-id="2095:44295" data-name="content-area"> {/* pt-32 pb-20 */}
            <div data-node-id="2095:44296" data-name="cards"> {/* gap-32, flex row */}
              <div data-node-id="2095:44297" data-name="card"> {/* "Classes" column, w-712 */}
                <div data-node-id="2095:44298"> {/* header row: "Classes" heading/lg + sl-button-rectangular "Create class" (outline/primary, icon far-plus) */}
                <div data-node-id="2095:44301"> {/* 3-col x 2-row CSS grid, gap 20/20, 6 class cards (plain frames, NOT component instances): */}
                  {/* Card 1: 2095:44443 "5B English" — media/Responsive(2095:44444) + title(2095:44447) + card-slot-header-badges(2095:44448 containing sl-badge "15 students", icon users) + content row: sl-icon(2095:44451) + text "No method added" (info/bold blue) */}
                  {/* Card 2: 2095:44455 "5A English" — same structure, badge "21 students", "No method added" */}
                  {/* Card 3: 2095:44467 "5C English" — media + title + badge "2 students" (NO content/info row — shorter card) */}
                  {/* Card 4: 2095:44530 "6A English" — media + title + badge "2 students" (no info row) */}
                  {/* Card 5: 2095:44552 "6B English" — media + title + badge "2 students" (no info row) */}
                </div>
              </div>
              <div data-node-id="2095:44306"> {/* "Task list" column, flex-1 */}
                <div data-node-id="2095:44307">Task list</div> {/* heading/lg */}
                <ContentBlock /> {/* x3, each a blueprint slot containing a dashed-border Placeholder */}
                <ContentBlock />
                <ContentBlock />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Typography styles present in the design

Body/md/regular, Heading/lg, Body/md/bold, Heading/md, Body/sm/regular — all families "text-new/typeset/fontFamily/_" (Roboto in Figma source; sanoma-pro theme substitutes 'Open Sans'/'New Message' per --sl-text-new-_ tokens), weights via text-new/typeset/fontWeight/_, line-heights via size/lineHeight/_.

## Component descriptions captured from Figma (usage docs attached to instances/components used in this frame)

- **Type=Simple** (2034:6902): "Use for borders that highlight secondary actions."
- **sl-search-field** (2034:7194): "A search field lets users specify a word or phrase to filter relevant content within a specific page section..." Doc: https://sanomalearning.design/categories/components/search-field/
- **sl-icon** (2003:3302, also 2034:4975): "Icons communicate messages, enhance interactivity, and highlight critical information..." Doc: https://sanomalearning.design/categories/components/icon/usage/
- **Variant=Default, State=Idle** (2034:7164): "Use for borders of form UI elements, such as text fields, checkboxes and, radio buttons."
- **sl-avatar** (2034:2165): "An avatar is a visual representation of an entity, such as a user or an organization." Doc: https://sanomalearning.design/categories/components/avatar/usage/
- **sl-button-rectangular** (2045:9049): "A button initiates an action when clicked, like redirecting to a new page or submitting a form... INVERTED BUTTONS are only to be used with elevation.surface.raised.inverted and elevation.surface.raised.primary." Doc: https://sanomalearning.design/categories/components/button/usage/
- **Icon only=false, Size=MD** (2034:5921): "Use for borders that highlight secondary actions."
- **accent=yellow, emphasis=subtle, size=lg** (2074:13052): "A vibrant blue background option, applied purely for stylistic purposes without specific meaning." (description text as given, despite yellow accent name)
- **sl-badge** (2074:13006): "A badge is a non-interactive visual indicator used to communicate status." Doc: https://sanomalearning.design/categories/components/badge/usage/
- **Variant=text & icon** (2074:12694): "Use for headers and labels."
- **Content-block** (2095:40608): "Usage — This is a blueprint — please detach it before using in any mockups. Keywords — Card, section." Doc: https://styleguide.itsbuild.net/docs/styles/blocks/#content-block

## Screenshot

See ../screenshot.png (cached from the always-remote get_screenshot call).
