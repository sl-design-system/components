---
title: Search field code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Search field
  key: SearchFieldCode
---
<section class="no-heading">

<div class="ds-example">
  <sl-search-field placeholder="Search"></sl-search-field>
</div>

<div class="ds-code">

  ```html
    <sl-search-field placeholder="Search"></sl-search-field>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="search-field"></ds-install-info>
<section>

## Search element

When using the search field as a standalone component, please wrap the search field in a `<search>` element to ensure the search field is accessible to screen readers. For more information, see this [article on the search element](https://www.scottohara.me/blog/2023/03/24/search-element.html) by Scott O'Hara.

</section>

<section>

## Suggested searches

Enable suggestions with `autocomplete="inline"`, `"list"` or `"both"`. The default is `"off"`. Supply phrases as native options or set the `suggestions` property to an array of strings. An explicitly supplied array takes precedence over native options.

```html
<sl-search-field aria-label="Search" autocomplete="both" matching="contains">
  <option>High West Institute</option>
  <option>Elementary High School</option>
</sl-search-field>
```

`matching="starts-with"` filters by prefix and emphasises the remaining text. `matching="contains"` filters anywhere in a phrase and emphasises the match. Matching ignores case, accents and repeated whitespace. Inline completion always requires a prefix match and preserves the words as typed.

Suggestions start after three non-space characters by default. Set `suggestion-threshold="1"` or `"2"` to start earlier. The default `suggestion-placement="overlay"` covers following content; `"flow"` moves it down.

Enter in the field searches only the typed words. Right Arrow or End explicitly accepts the proposed suffix, making it editable text. Tab moves through the Clear button to the suggestion list; Up/Down also moves focus from the field to the list. Arrow keys and Home/End navigate the list, and Enter searches the focused phrase. Escape closes suggestions and returns focus from the list to the field. A further Escape clears the field.

`sl-search` continues to emit the current query 300 ms after editing, immediately on Enter, and immediately after choosing a list suggestion. An unaccepted inline suffix is rendered as a visual overlay. It is excluded from the query, `value`, the native input value, form submission and validation.

For asynchronous data, listen for `sl-change`, set `loading` while fetching phrases, then update `suggestions`. Set `unavailable` when fetching fails. Ignore stale responses in your data provider. Loading, empty and unavailable states describe suggestions; the typed query can still be searched. Browser autofill is disabled so it does not compete with these suggestions.

</section>

{% include "../component-table.njk" %}
