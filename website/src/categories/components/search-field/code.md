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

Suggestions help users complete a name or discover a useful search phrase. Choosing a suggestion is always optional: users can still search their own words.

### Enable suggestions

Set `autocomplete` to one of the following modes:

|Mode|Behavior|
|-|-|
|`off`|No suggestions. This is the default.|
|`inline`|Proposes the rest of a phrase that starts with the typed words, directly in the field.|
|`list`|Shows matching phrases in a list below the field.|
|`both`|Combines the inline proposal and the list.|

{.ds-table .ds-table-align-top}

Supply the phrases as native `<option>` elements, or set the `suggestions` property to an array of strings. When both are present, the `suggestions` property is used.

```html
<sl-search-field aria-label="Search" autocomplete="both" matching="contains">
  <option>High West Institute</option>
  <option>Elementary High School</option>
</sl-search-field>
```

### Configuration

|Property|Default|Description|
|-|-|-|
|`matching`|`starts-with`|`starts-with` shows phrases that start with the typed words and emphasises the rest. `contains` shows phrases containing the typed words anywhere and emphasises the match. Inline proposals always need a `starts-with` match.|
|`suggestion-threshold`|`3`|Number of non-space characters before suggestions appear.|
|`suggestion-placement`|`overlay`|`overlay` shows the list on top of the following content. `flow` pushes the following content down.|
|`loading`|`false`|Shows a loading message while suggestions are fetched.|
|`unavailable`|`false`|Shows a message when suggestions could not be fetched.|

{.ds-table .ds-table-align-top}

Good to know:

- Matching ignores case, accents and repeated whitespace.
- Suggestions respect `maxlength`. Phrases that are too long are not offered and are never truncated.
- The native input uses `autocomplete="off"`, so browser suggestions do not compete with the field's own suggestions.

### Typed words and accepted suggestions

- **Enter** searches only the typed words.
- **Right Arrow** or **End** accepts the inline proposal, which then becomes editable text.
- An inline proposal that is not accepted is never part of `value`, form submission or validation.
- `sl-search` is emitted 300 ms after typing stops, immediately on Enter and immediately after choosing a suggestion from the list.

See the [accessibility tab](/categories/components/search-field/accessibility) for all keyboard interactions.

### Asynchronous suggestions

1. Listen for `sl-change` and start fetching suggestions for the new query. Cancel or ignore the previous request.
2. Set `loading` while fetching.
3. Set `suggestions` when the response arrives, or set `unavailable` when the request fails.
4. On `sl-clear`, cancel the pending request, clear `suggestions` and reset `loading` and `unavailable`.

Loading, empty and unavailable messages are about suggestions, not about search results. Users can still search the typed words in each of these states.

</section>

{% include "../component-table.njk" %}
