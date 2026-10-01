# Figma design-context raw responses — Subchapter feed page (5311:37116)

File: 73YHtIYl0UHXH8ST4J7VKI ("New content view")
Root node: 5311:37116 "Subchapter feed page" (1280x720)

Economy note: given the 1803-node / 83-component-type size of this screen, get_design_context
was called on the root's distinct top-level regions/components only (not on every descendant).
Each section below is the verbatim tool response for the node named in its heading.

---

## Node 5311:37151 "Header-navigation"

```
const assetPathPrefix = "https://www.figma.com/api/mcp/asset/d5349f0a-9979-489f-9c9f-ff18a4b16afc";
const imgIcon = `${assetPathPrefix}/816ae.svg`;
const imgSearch = `${assetPathPrefix}/7e0b2.svg`;
const imgIcon1 = `${assetPathPrefix}/203b3.svg`;
const imgHelp = `${assetPathPrefix}/0804d.svg`;
const imgIcon2 = `${assetPathPrefix}/44357.svg`;

export default function HeaderNavigation() {
  return (
    <div className="bg-[#643695] ..." data-node-id="5311:37151" data-name="Header-navigation">
      <div data-node-id="I5311:37151;9353:30102" data-name="top navigation">
        <div data-node-id="I5311:37151;9353:30103">
          <div data-node-id="I5311:37151;9353:30104" data-name="top-navi-item-light">"My page" label + Icon</div>
        </div>
        <div data-node-id="I5311:37151;9353:30105" data-name="main navigation">
          top-navi-item-light x3: "Learning materials" (active), "Tests", "Dashboard"
        </div>
        <div data-node-id="I5311:37151;9353:30113" data-name="settings and search">
          4x top-navi-item-icon (search, notifications w/ number-tag badge "3", help, account)
        </div>
      </div>
    </div>
  );
}
```

Styles: Neutrals/$kampus-color-white #FFFFFF, UI/Button font (Open Sans SemiBold 14/24, ls 3),
Primary/$kampus-color-purple-7 #643695, UI/Extra-tiny-semibold (Open Sans SemiBold 10/12, ls 3),
Dashboard/kampus-color-orange-8 #DB7109, shadow-low (drop shadow 0/2/8/0 #6D6E7359).

Component descriptions: notification (1701:4728, "notification, bell"), number-tag (1701:4721,
"✅ implemented"), account (401:3572, "profile, account").

---

## Node 5311:37150 "Left-toolbar"

```
const assetPathPrefix = "https://www.figma.com/api/mcp/asset/4d8a1617-677c-4749-95ac-4f750a28ba14";
export default function LeftToolbar() {
  return (
    <div data-node-id="5311:37150" data-name="Left-toolbar">
      <img data-node-id="I5311:37150;9353:30179" data-name="image 14" /> {/* user avatar-like image */}
      <div data-node-id="I5311:37150;9353:30181" data-name="Feed Tools">
        Filter row x5: "Contents" (toc icon), "Edit content" (edit-feed icon + number-tag badge),
        "Assignments" (assignments icon + number-tag badge "1"), "Notes" (notes icon),
        "Access key" (access-key-sec icon)
      </div>
    </div>
  );
}
```

Styles: Primary/$kampus-color-purple-7 #643695, UI/Extra-Tiny (Open Sans Regular 10/12, ls 3),
Neutrals/$kampus-color-gray-3 #CECFD2, Neutrals/Full White #FFFFFF, Dashboard/kampus-color-orange-8
#DB7109, UI/Tiny-bold (Open Sans Bold 12/16, ls 3), shadow-low.

Component descriptions: toc (1701:8296, "table of contents, TOC"), number-tag (1001:2105,
"✅ implemented"), access-key-sec (1701:8300, "access key").

---

## Node 5311:37117 "Fullscreen toggle"

```
const assetPathPrefix = "https://www.figma.com/api/mcp/asset/1616217e-314f-4604-8ad1-566cc715eeb1";
type FullscreenToggleProps = { className?: string; state?: "Default" };
function FullscreenToggle({ className, state = "Default" }) {
  return (
    <div data-node-id="12545:192801">
      <div data-node-id="12545:192803" data-name="Icon-button"> {/* round white icon button, 40px */}
        <img data-node-id="I12545:192803;192:2472" data-name="icon" />
      </div>
      <p>View fullscreen</p>
    </div>
  );
}
export default function FullscreenToggle1() {
  return <FullscreenToggle />;
}
```

Styles: Primary/$kampus-color-purple-7 #643695, Neutrals/$kampus-color-white #FFFFFF, shadow-low,
UI/Extra-Tiny.

Component descriptions: Icon-button (11360:135408, "✅ implemented ✨Variants").

---

## Node 5311:37120 "Table of contents - Elements basics"

```
export default function TableOfContentsElementsBasics() {
  return (
    <div data-node-id="5311:37120" data-name="Table of contents - Elements basics">
      <div data-name="layer content">
        <div data-name=".TOC-header">
          "Table of Contents" heading + Icon-button (close "X")
          Button-row: "Expand all" / "Collapse all" (Button component)
        </div>
        <div data-name="TOC-items">
          repeated .TOC-item rows: "Start page", ".TOC-chapter" ("Minä, kieli ja kulttuuri",
          expanded, containing 9 .TOC-subchapter rows: "Jakson tavoitteet", "1. Kieli, kulttuuri
          ja identiteetti" (highlighted/current, purple bg #F0ECF5), "2. Maailman kielet",
          "3. Suomen sukukielet", "4. Monikielinen Suomi", "5. Suomen kielen ominaispiirteet",
          "6. Puhekielen vaihtelu", "Open oma kappale", "Teacher-created subchapter"),
          then collapsed chapters "Kielitieto", "Lukutaito", "Kirjallisuustieto",
          "Kirjoitustaito", "Vuorovaikutustaidot", "Kielitaito", "Chapter"
        </div>
      </div>
    </div>
  );
}
```

Styles: Neutrals/$kampus-color-gray-8 #29292B, "New look & feel 2023/h3 (desktop)" (Open Sans
Bold 20/28, ls -2), Primary/$kampus-color-purple-7 #643695, UI/Button, Neutrals/$kampus-color-gray-3
#CECFD2, UI/Small-semibold (Open Sans SemiBold 16/20), Neutrals/$kampus-color-white #FFFFFF,
UI/Extra-small-regular (Open Sans Regular 14/20), UI/Extra-small-semibold (Open Sans SemiBold
14/20), Primary/$kampus-color-purple-1 #F0ECF5, shadow-low.

Component descriptions: Icon-button (11360:135408 and 1701:4877, "✅ implemented ✨Variants"),
cross (601:1856, "x close"), Button (12026:147754, "✅ implemented"), more (1701:6992 / 1701:8980,
"add, plus" — actually rendered as an expand/collapse chevron affordance per screenshot).

---

## Node 5311:37122 "breadcrumb-2023"

```
type IconButtonProps = { className?: string; size?: "Default"; state?: "Default"; type?: "Primary" };
function IconButton({ ... }) {
  return (
    <div data-node-id="11360:135454">
      <img data-node-id="11360:135593" data-name="icon" />
    </div>
  );
}
export default function Breadcrumb2023() {
  return (
    <div data-node-id="5311:37122" data-name="breadcrumb-2023">
      <div data-name="breadcrump">
        row 1: "Start page" > "Kielititieto" > "Kieli, kulttuuri ja identiteetti" (current, bold)
      </div>
      <div data-name="navigation">
        2x round purple Icon-button (chevron-left / chevron-right, prev/next subchapter nav)
      </div>
    </div>
  );
}
```

Styles: Primary/$kampus-color-purple-7 #643695, UI/Button, Primary/Default #643695,
Neutrals/$kampus-color-gray-9 #0E0E0F, UI/Extra-small-semibold, Neutrals/$kampus-color-gray-1
#F5F5F6, Primary/$kampus-color-purple-1 #F0ECF5, "breadcrumb gradient grey" (gradient, no hex).

Component descriptions: Button (12026:147754, "✅ implemented"), chevron-right (107:1162),
Icon-button (11360:135408, "✅ implemented ✨Variants"), chevron-left (1701:8112).

---

## Node 5311:37123 "Feed headings (2023)"

```
export default function FeedHeadings2023() {
  return (
    <div data-node-id="5311:37123" data-name="Feed headings (2023)">
      <ol className="list-decimal"><li>Kieli, kulttuuri ja identiteetti</li></ol>  {/* h1, numbered */}
      <div data-name="Actions">2x Icon-button (link/share icon, overflow "..." menu icon)</div>
    </div>
  );
}
```

Note: instances of this same component repeat 4 more times in the page with different heading
text/level (e.g. "1. Kieli, kulttuuri ja identiteetti" as h4 section heading above card groups) —
same component, different content/variant.

Styles: Neutrals/$kampus-color-gray-9 #0E0E0F, "New look & feel 2023/h1 (desktop)" (Open Sans Bold
30/38, ls -3), Primary/$kampus-color-purple-7 #643695.

Component descriptions: Icon-button (1701:4877, "✅ implemented ✨Variants").

---

## Node 5311:37124 "Feed filters"

```
export default function FeedFilters() {
  return (
    <div data-node-id="5311:37124" data-name="Feed filters">
      <p>Filter</p>
      <div>
        Filter-pill "Show everything" (selected, purple bg)
        Filter-pill "Text" + number-tag badge "11"
        Filter-pill "Exercise" + number-tag badge "26"
      </div>
    </div>
  );
}
```

Styles: Neutrals/$kampus-color-gray-9 #0E0E0F, UI/Button, Neutrals/$kampus-color-white #FFFFFF,
Primary/$kampus-color-purple-7 #643695, Neutrals/$kampus-color-gray-7 #444548, UI/Extra-tiny-semibold,
Neutrals/$kampus-color-gray-6 #6D6E73, Neutrals/$kampus-color-gray-2 #E2E2E4.

Component descriptions: Filter-pill (1701:5931, "Pill component is a radiobutton type of
component. It is used as filters on My page and Content feed."), number-tag (1001:2105,
"✅ implemented").

---

## Node 5311:37125 "Student view"

```
function SimpleToggle({ className, onOff = "Off", state = "Default" }) {
  return <div data-node-id="1702:18966">{/* off-state switch graphic */}</div>;
}
function StudentView({ className }) {
  return (
    <div data-node-id="4701:55280" data-name="Student view">
      <SimpleToggle />
      <p>Student view</p>
    </div>
  );
}
export default function StudentView1() { return <StudentView />; }
```

Styles: Neutrals/$kampus-color-gray-6 #6D6E73, Neutrals/$kampus-color-gray-1 #F5F5F6, shadow-low,
Neutrals/$kampus-color-gray-9 #0E0E0F, Body/Small (Open Sans Regular 16/24).

Component descriptions: Simple-toggle (1702:18965, "✅ implemented").

---

## Node 5311:37127 "Theory-card-UPDATE"

```
function CardFooterTheory({ className, state = "Content information" }) {
  return (
    <div data-node-id="12026:147927">
      <div data-name="Course information"><p>Text</p></div>
    </div>
  );
}
export default function TheoryCardUpdate() {
  return (
    <div data-node-id="5311:37127" data-name="Theory-card-UPDATE">
      <div data-name="content">
        <div data-name="image">{/* thumbnail photo, 170x128 */}</div>
        <div data-name="text">
          <h4>Kieli, kulttuuri ja identiteetti</h4>
          <p>{lorem-ipsum description, 2-line clamp}</p>
        </div>
        <div data-name="tools"><Icon-button /> {/* overflow "..." menu */}</div>
      </div>
      <CardFooterTheory /> {/* footer row, "Text" content-type label, top purple border */}
    </div>
  );
}
```

Styles: Neutrals/$kampus-color-gray-9 #0E0E0F, "New look & feel 2023/h4 (desktop)" (Open Sans Bold
18/24, ls -2), Neutrals/$kampus-color-gray-8 #29292B, Body/Small, Neutrals/$kampus-color-gray-6
#6D6E73, UI/Extra-small-regular, Neutrals/$kampus-color-white #FFFFFF, Primary/$kampus-color-purple-7
#643695, shadow-low.

Component descriptions: Theory-card-UPDATE (12718:185041, "theory card, feed card"), Icon-button
(11360:135408, "✅ implemented ✨Variants").

Repeats 3x in page (varying title/description/thumbnail) at full width (798px) inside
"Feed headings (2023)" content groups.

---

## Node 5311:37131 "Exercise-card-UPDATE"

```
function StarOutlined({ className }) {
  return <div data-node-id="1701:8049" data-name="star-outlined"><img/></div>;
}
type ExerciseCardUpdateProps = {
  className?: string; assignment?: "Off"; device?: "Desktop"; hidden?: "Off";
  property?: "Default"; type?: "Editor created";
};
function ExerciseCardUpdate({ ... }) {
  return (
    <div data-node-id="12033:148258">
      <div data-name="Header">
        <div data-name="Exercise type"><p>Self -correcting exercise</p></div>
        <div>
          <div data-name="exercise-icon">{/* purple square, exercise icon glyph */}</div>
          <div data-name="heading"><p>1.7 Vastaa kysymyksiin</p></div>
        </div>
        <div data-name="tools"><Icon-button/> {/* overflow "..." menu */}</div>
      </div>
      <div data-name="card-footer-exercise">
        <div data-name="Course information">
          <div data-name=".exercise-difficulty-level">star + star-outlined + star-outlined
          (1 of 3 filled — difficulty rating)</div>
          <p>Exercise</p>
        </div>
      </div>
    </div>
  );
}
export default function ExerciseCardUpdate1() { return <ExerciseCardUpdate />; }
```

Styles: Neutrals/$kampus-color-gray-6 #6D6E73, UI/Extra-small-regular, Neutrals/$kampus-color-white
#FFFFFF, Primary/$kampus-color-purple-7 #643695, Neutrals/$kampus-color-gray-9 #0E0E0F,
"New look & feel 2023/h4 (desktop)", Right Border/shadow-low.

Component descriptions: Exercise-card-UPDATE (12033:148257, "exercise card, feed card"), exercise
(1701:7824), Icon-button (11360:135408, "✅ implemented ✨Variants"), star (1701:4873, "star
filled, difficulty level"), star-outlined (1701:8049, "star outline, difficulty level").

Repeats 8x in page (2-per-row x4 rows, 390px each, half of the 798px content column), varying
heading/difficulty rating.

---

## get_code_connect_map results (all queried nodes)

Root 5311:37116 → `{}`
5311:37117 (Fullscreen toggle) → `{}`
5311:37120 (Table of contents - Elements basics) → `{}`
5311:37122 (breadcrumb-2023) → `{}`
5311:37123 (Feed headings (2023)) → `{}`
5311:37124 (Feed filters) → `{}`
5311:37125 (Student view) → `{}`
5311:37127 (Theory-card-UPDATE) → `{}`
5311:37131 (Exercise-card-UPDATE) → `{}`
5311:37150 (Left-toolbar) → `{}`
5311:37151 (Header-navigation) → `{}`

No entries at all (not even `null` or `hasTemplate:false`) were returned for this design file's
subtree — see note appended to figma-code-connect-map.json.
