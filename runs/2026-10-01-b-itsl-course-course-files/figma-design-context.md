NOTE: get_design_context for node 4007:3161 ("course files") was called successfully. The full response was very large (hundreds of nodes) and the MCP tool truncated the code portion at its 25000-token output limit. What was captured below is the leading portion of the generated React+Tailwind reference code (Navigation, PageHeader, Banner, table header row, first four table data rows, start of Pagination component) plus the FULL "Component descriptions" section (usage/documentation text for every named component in the file: Navigation, Search, Button, magnifying-glass, bell, comment, Avatar, PageHeader/Editable, Banner, xmark, table row template (Property 1=Active/Inactive), Cell, Course Hat, graduation-cap, Status Tag, Pagination, chevron-left, chevron-right, Select, caret-down) plus the screenshot (saved separately to screenshot.png) and the typography/color style list.

KEY FINDING: the generated reference code contains ZERO <sl-*> custom elements or Code-Connect-resolved component tags anywhere -- every node renders as a plain <div>, <p>, or <img> (Tailwind-styled React). This corroborates the get_code_connect_map results (all {} / null) across subtree call, 7 per-node instance calls, and 8 per-node main-component-definition calls: this Figma file has no Code Connect mapping to the sl-design-system codebase for any of its components.

=== CAPTURED CODE (truncated by tool) ===

const assetPathPrefix = "https://www.figma.com/api/mcp/asset/4fc59c46-c6ef-47a7-bfc5-279cdf101b57";
const imgChevronLeft = `${assetPathPrefix}/69dc0.svg`;
const imgChevronRight = `${assetPathPrefix}/88d50.svg`;
const imgCaretDown = `${assetPathPrefix}/d14d6.svg`;
const imgYourFiles = `${assetPathPrefix}/9106c.svg`;
const imgPhoto = `${assetPathPrefix}/19894.png`;
const imgGroupFalse = `${assetPathPrefix}/70bc9.svg`;
const imgItslearningLogoSymbol = `${assetPathPrefix}/347f2.svg`;
const imgMagnifyingGlass = `${assetPathPrefix}/48abb.svg`;
const imgBell = `${assetPathPrefix}/57756.svg`;
const imgComment = `${assetPathPrefix}/2b72d.svg`;
const imgCircleInfo = `${assetPathPrefix}/f357e.svg`;
const imgXmark = `${assetPathPrefix}/e8986.svg`;
const imgArrowUpArrowDown = `${assetPathPrefix}/9cf7f.svg`;
const imgGraduationCap = `${assetPathPrefix}/4a634.svg`;

[... full Pagination(), YourFiles(), Avatar(), and CourseFiles() default-export component code was returned, rendering: Navigation (logo + main menu + secondary menu with "Files / Your files / Save course materials" tabs, search box, bell, comment, avatar icons), PageHeader ("Save course materials" title), a Content-block containing: Banner (info icon + text + close "Button" instance), a 5-row "table" (1 header "courses" row of 4 sortable "Cell" instances: Course, Status, Teacher [sortable], Last updated [sortable]; 4 visible data "courses" rows each with: Cell 1 = Course Hat icon-badge + "Math 2c" link text, Cell 2 = Status Tag ("Archived"/"Deleted"), Cell 3 = "Floyd Miles and 2 more" text, Cell 4 = "05/04/2024" date text), and a Pagination component (prev/next chevron Buttons, 5 numbered ".Page link" instances, "1 to 10 of 47" text, a page-size "Select" dropdown showing "10"). One table row (4008:9150) and the Search bar instance (4007:3170) are marked hidden=true in the design and not visually present. One nav item ("Status Tag" on PageHeader title, "Back link", "Breadcrumb", extra nav items) are hidden=true variants not shown. ALL of the above renders as plain HTML tags in the reference code -- no sl-* tags.

=== COMPONENT DESCRIPTIONS (full, from get_design_context) ===

## Navigation (4461:5786) -- "Menu". Doc: https://styleguide.itsbuild.net/assets/patterns/MainMenu/v1/

## Search (6145:10170) -- represents itslearning's SearchInput / GlobalSearch components. Doc: https://styleguide.itsbuild.net/assets/inputs/SearchInput/v1/

## Button (6077:5717) -- Large is default size; width depends on label; truncate label if needed; has loading state; row-of-actions via ButtonGroup. Doc: https://styleguide.itsbuild.net/assets/inputs/Button/v1/

## magnifying-glass (6145:10168) -- "search"

## bell (2027:742) -- "bell, notification"

## comment (2027:750) -- "Not in Semiotic comment, messages"

## Avatar (2254:1410) -- sizes 100(24)/200(32)/300(48)/400(64)/500(80)/600(96). Doc: https://styleguide.itsbuild.net/assets/nodes/Avatar/v1/

## Editable=False (6145:9622) / ## PageHeader (6145:9621) -- represents itslearning's PageHeader and PageHeaderEditable. Doc: https://styleguide.itsbuild.net/assets/patterns/PageHeader/v1/

## Banner (6077:6144) -- shown inside BannerArea; full width; dismissible unless critical. Doc: https://styleguide.itsbuild.net/assets/feedback/Banner/v1/

## xmark (6077:6134) -- "close, remove"

## Property 1=Active (4008:8813) / Property 1=Inactive (4008:8812) -- table-row TEMPLATE component: "detach before using... make a new local component... put instances into the List template". Keywords: Template, blueprint.

## Cell (6145:11793) -- used to build rows/tables; icon cells need a visible label; action cells show 1 button (use ellipsis+dropdown if >1); sort cells swap icon + Brand/100 background. Doc: https://styleguide.itsbuild.net/assets/lists/Cell/v1/

## Course Hat (6145:10333) -- "Course avatar, label". Doc: https://prom.itsldevops.net/docs/styles/blocks/#course-hat

## graduation-cap (4412:10990) -- "course"

## Status Tag (6145:9591) -- shows state of an object/process; not interactive; colors shouldn't be changed; don't truncate label; hide icon at >200% zoom. Doc: https://prom.itsldevops.net/docs/styles/blocks/#status-tag

## Pagination (6145:12461) -- hide when only 1 page; item-count control optional; "component is in implementation now". Doc: https://styleguide.itsbuild.net/assets/Navigation/Pagination/v1/

## chevron-left (6145:12446) -- "arrow, left"

## chevron-right (6145:9477) -- "arrow, right"

## Select (6145:9872) -- use when 5+ options; for least-important/secondary actions. Doc: https://styleguide.itsbuild.net/assets/inputs/Select/v1/

## caret-down (6145:5748) -- "expand, arrow, down"

=== STYLES REFERENCED (from get_design_context style list) ===
Body large: Lato Regular, Size/300, weight 400, line-height 1.5
Base: Lato Regular, Size/300, weight 400, line-height 1.5
Title M: Lato Bold, Size/400, weight 700, line-height 1.5
Gray/900: #333333
Gray/700: #565656
Gray/300: #E1E1E1
layer-shadow: drop-shadow #0000000D offset(0,4) radius 8
Title XL: Lato Bold, Size/800, weight 700, line-height 1.5
Base small: Lato Regular, Size/200, weight 400, line-height 1.5
Base small strong: Lato Bold, Size/200, weight 700, line-height 1.5
Links/Base primary link: Lato Bold, Size/300, weight 700, line-height 1.5

=== ANNOTATIONS found in generated code (data-annotations attributes) ===

- node I4008:8839;4008:8764;1606:2453 (table header cell "Course" label): data-annotations="Change to 'courses'"
- node I4008:8839;4008:8766;1606:2453 (table header cell "Teacher" label): data-annotations="Change to 'Teachers'"
