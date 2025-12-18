---
title: Paginator usage
tags: usage
eleventyNavigation:
  parent: Paginator
  key: PaginatorUsage
---
<style>
.pagination {
 align-items: center;
 display: inline-flex;
 justify-content: space-between;
 inline-size: 100%;
}

sl-paginator {
 inline-size: 440px;
 justify-content: center;
}
</style>

<section class="no-heading">

<div class="ds-example">
<div class="pagination">
  <sl-paginator-status></sl-paginator-status>
  <sl-paginator></sl-paginator>
  <sl-paginator-page-size
    page-size="10"
    page-sizes="[5,10,15]"
  ></sl-paginator-page-size>
</div>
</div>

<div class="ds-code">

  ```html
  <sl-paginator-status></sl-paginator-status>
  <sl-paginator></sl-paginator>
  <sl-paginator-page-size page-size="10" page-sizes="[5,10,15]"></sl-paginator-page-size>

  <script>
    // This is an example with manual management of the pagination state

    const paginatorStatus = document.querySelector('sl-paginator-status');
    const paginator = document.querySelector('sl-paginator');
    const paginatorPageSize = document.querySelector('sl-paginator-page-size');

    const students = Array.from({ length: 120 }).map((_, index) => `Student ${index + 1}`);

    const update = ({ page, pageSize }) => {
      if (typeof pageSize === 'number' && pageSize !== paginator.pageSize) {
        page = 0;
      } else {
        page ??= paginator.page;
      }

      pageSize ??= paginator.pageSize;

      paginator.page = paginatorPageSize.page = page;
      paginator.pageSize = paginatorPageSize.pageSize = pageSize;
    };

    const onPageChange = ({ detail: page }) => update({ page });

    const onPageSizeChange = ({ detail: pageSize }) => update({ pageSize });

    paginator?.addEventListener('sl-page-change', onPageChange);

    paginatorPageSize?.addEventListener('sl-page-size-change', onPageSizeChange);

    paginator.totalItems = students.length;
    paginatorStatus.totalItems = students.length;

    paginatorStatus.itemLabel = 'students';
    paginatorPageSize.itemLabel = 'Students';
  </script>
  ```

</div>
</section>

<section>

## When to use

### Large Datasets   
When there is too much data to display within a single page or component view, and you want to break it into manageable chunks so users can scan, compare, and keep their place more easily. Also when loading all available data at once would be slow, heavy, or resource-intensive, and you need to keep performance predictable.

### Precise Navigation
When users need explicit control over where they are in a list, for example, jumping to a specific page, returning to a remembered page number, or sharing a URL that always opens the same subset of results.

</section>


<section>

## When not to use

### Linear Journeys Flows**  
For multi-step processes such as forms, wizards, or checkout flows where the user should move forward or backward step by step. In these cases, use buttons or a progress indicator instead of paginator.

### Short, Small, or Simple Content**  
When the content fits comfortably on a single page without performance issues, or when the dataset is small gives a simpler, more natural experience.

</section>


<section>

## Anatomy

### Page Size
Control that lets users choose how many items are shown per page. Changing this value recalculates the total number of pages.

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Label | Text that describes the page size control (e.g. “Items per page”).| yes|
|2|Select | Dropdown used to choose how many items are displayed per page.| yes|

{.ds-table .ds-table-align-top}

</div>

### Paginator
The main navigation for moving across pages.

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Prev/Next buttons | Move one page backward or forward. `Previous` is disabled on the first page, and `Next` is disabled on the last page.| yes|
|2|Page Button | A numbered button that takes the user to a specific page.| yes|
|3|Selected page | The current page, visually highlighted.| yes|
|4|Overflow Button | A menu button that exposes hidden pages when there are more pages than can be displayed at once.| yes|

{.ds-table .ds-table-align-top}

</div>

### Status
Text that communicates where the user is in the full result set, typically:

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Range Items | Text element that displays the current range, the start and end of it. | yes|
|2|Total Items | Text element that displays the total. | yes|
|3|Items Label | Text that describes the items in the range (e.g. “items”, “results”). | yes|

{.ds-table .ds-table-align-top}

</div>

</section>


<section>
  
## Widths
Control how many page buttons are visible at once before pages are moved into the overflow menu.

- **LG:** Shows up to **13** page items in a single row.  
- **MD:** Shows up to **11** page items.  
- **SM:** Shows up to **9** page items.  
- **XS:** When the available space is very limited, page buttons are replaced by a single **select field** so users can pick a page from a dropdown.

Use wider vesions when the Paginator is a primary control, for example, at the bottom of a data table and narrower vesions when space is constrained or the pagination is secondary.

</section>


<section>
  
## Emphasis
The Paginator supports two emphasis levels:

- **Subtle:** Low-contrast styling that keeps pagination in the background while still discoverable. Use when pagination is supportive, not the main focus of the page.
- **Bold:** Higher visual weight for cases where pagination is a primary navigation element or is critical to the user’s workflow.

Choose the emphasis that matches the visual hierarchy of surrounding content.

</section>


<section>
  
## Sizes
The Paginator offers three control sizes:

- **Large:** For dense layouts, large data tables or touch-first experiences where targets need to be easier to hit.  
- **Medium:** The default size for most use cases and general content pages.  
- **Small:** For compact layouts, side panels, or areas where vertical space is limited.

Ideally, match the Paginator size to the height of related controls, for example, table rows or filter inputs.

</section>


<section>

## Figma Options
With these options, you can tweak the appearance of the paginator in Figma.
They are available in the Design Panel so you can compose the paginator to exactly fit the user experience need for the use case you are working on.


### Paginator
<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Size |`lg`, `md`, `sm`| Sets the paginator control size. |
|Width|`lg`, `md`, `sm`, `xs`| Defines how many page buttons are visible before overflow. |
|Emphasis|`subtle`, `bold`| Sets the visual impact style. |
|Arrow Start|`boolean`| Controls visibility of the previous-page arrow. |
|Overflow Start|`boolean`| Controls visibility of the leading overflow. |
|Overflow End|`boolean`| Controls visibility of the trailing overflow. |
|Arrow End|`boolean`| Controls visibility of the next-page arrow. |

{.ds-table .ds-table-align-top}

</div>

### Paginator Status
<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Item label |`text`| Text label used for items (e.g. “items”, students). |
|Total Range|`number`| Total number of items in the dataset. |
|High Range|`number`| Last item index displayed on the current page. |
|Low Range|`number`| First item index displayed on the current page. |

{.ds-table .ds-table-align-top}

</div>

### Paginator Size
<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Item label |`text`| Change the "Items" label for the page size control. |

{.ds-table .ds-table-align-top}

</div>

</section>


<section>
  
## Behaviours

### Keyboard navigation
Users can move through the Paginator with the keyboard using `Tab` and `Shift+Tab` to follow a logical focus order across controls, and use `Enter` or `Space` to activate Previous and Next, select a page, or open and confirm options in overflow menus, while arrow keys help navigate within any the overflow dropdown.

### Overflow pages
When there are more pages than can be shown at once, hidden pages are moved into an overflow menu represented by an ellipsis, which adapts depending on the current page (start or end of the range) while keeping the overall layout stable and avoiding any width changes.

### Responsive behaviour
On larger viewports, the Paginator can show more page buttons alongside Previous and Next, while on smaller or constrained layouts it reduces the number of visible pages and, at the narrowest widths, can replace numbered buttons with a page select field to keep pagination usable and readable on mobile.

</section>


<section>
  
## Related components
- [Text Field](/categories/components/text-field/usage): If you want a free-form text input.
- [Select](/categories/components/select/usage): Selecting from predefined numeric options.

</section>


<script>
requestAnimationFrame(() => {
const students = Array.from({ length: 120 }).map((_, index) => `Student ${index + 1}`);

const update = ({ page, pageSize }) => {
  const paginator = document.querySelector('sl-paginator');
    const size = document.querySelector('sl-paginator-page-size');
   const status = document.querySelector('sl-paginator-status');

  if (typeof pageSize === 'number' && pageSize !== paginator.pageSize) {
    page = 0;
  } else {
    page ??= paginator.page;
  }

  pageSize ??= paginator.pageSize;

  paginator.page = status.page = page;
  paginator.pageSize = size.pageSize = status.pageSize = pageSize;
};

const onPageChange = ({ detail: page }) => update({ page });

const onPageSizeChange = ({ detail: pageSize }) => update({ pageSize });

const paginatorStatus = document.querySelector('sl-paginator-status');
const paginator = document.querySelector('sl-paginator'); 

paginator?.addEventListener('sl-page-change', onPageChange);

const paginatorPageSize = document.querySelector('sl-paginator-page-size');
paginatorPageSize?.addEventListener('sl-page-size-change', onPageSizeChange);

paginator.totalItems=(students).length;
paginatorStatus.totalItems=(students).length;

paginatorStatus.itemLabel='students';
paginatorPageSize.itemLabel='Students';

});
</script>