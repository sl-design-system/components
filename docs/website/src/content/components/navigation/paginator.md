---
title: Paginator
layout: docs
eleventyNavigation:
  key: Paginator
  parent: Navigation
---

`<sl-paginator>` splits a large list of items across multiple pages and lets the user move between
them. It comes with two companion components: `<sl-paginator-status>`, which shows a "showing X–Y of
Z" summary, and `<sl-paginator-page-size>`, which lets the user change how many items appear per
page.

Configure the paginator with the total number of items (`total-items`), the page size (`page-size`)
and the current page (`page`, zero-based).

## Usage

```html
<sl-paginator total-items="200" page-size="10" page="0"></sl-paginator>
```

The paginator emits an `sl-page-change` event with the new page index whenever the user navigates.

## Examples

### Basic

```html {.example .show-source}
<sl-paginator total-items="200" page-size="10" page="1"></sl-paginator>
```

### Status

`<sl-paginator-status>` shows which items are currently visible.

```html {.example .show-source}
<sl-paginator-status total-items="200" page-size="10" page="1"></sl-paginator-status>
```

### Page size selector

`<sl-paginator-page-size>` lets the user choose the page size from a list. It emits an
`sl-page-size-change` event.

```html {.example .show-source}
<sl-paginator-page-size page-size="10" page-sizes="[5, 10, 15]"></sl-paginator-page-size>
```

### Putting it together

In a real application you wire the three components together so changing the page or page size keeps
them in sync.

```html
<section style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
  <sl-paginator-status total-items="200" page-size="10"></sl-paginator-status>
  <sl-paginator total-items="200" page-size="10"></sl-paginator>
  <sl-paginator-page-size page-size="10" page-sizes="[5, 10, 15]"></sl-paginator-page-size>
</section>

<script type="module">
  const paginator = document.querySelector('sl-paginator');
  const status = document.querySelector('sl-paginator-status');
  const pageSize = document.querySelector('sl-paginator-page-size');

  paginator.addEventListener('sl-page-change', event => {
    status.page = event.detail;
  });

  pageSize.addEventListener('sl-page-size-change', event => {
    paginator.page = 0;
    paginator.pageSize = status.pageSize = event.detail;
  });
</script>
```

## API

See the API reference for [`sl-paginator`](/api-reference/sl-paginator),
[`sl-paginator-status`](/api-reference/sl-paginator-status) and
[`sl-paginator-page-size`](/api-reference/sl-paginator-page-size).
