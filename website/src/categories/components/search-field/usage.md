---
title: Search field usage
tags: usage
eleventyNavigation:
  parent: Search field
  key: SearchFieldUsage
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



<section>

## When to use

### Fast Findings
Making it easier for the user to find specific items within large data volumes. Users expect this feature for streamlined access, especially in interfaces with dynamic content. Improving task efficiency and usability ensures users access relevant information seamlessly, for example, by filtering a list of dynamic content like cards.

### Section Page Search
Use a search field within a specific page section when users need to search data, such as in a data table. This implementation ensures that users can efficiently locate and filter data within that section, maintaining consistency and usability across the product. It enhances the user experience by providing targeted, relevant search results without the need to navigate away from the current context.

</section>


<section>

## When not to use

### Small Data
Avoid using a search field within a page section when dealing with small or limited data. Additionally, refrain from implementing it when the information is simple and easily accessible within a single view. In such cases, a search field may be unnecessary and could complicate the user experience rather than enhance it. Use it for scenarios where it adds value and helps maintain a clean and efficient interface.

</section>


<section>

## Search field or Combobox?

Use **Search field** to search or filter content using a phrase. Suggestions assist the query; choosing one is optional, and Enter in the field searches the typed words.

Use [Combobox](/categories/components/combobox/usage) when the task is to choose a form value from options, including configurations that allow custom values or multiple selections. Typing helps users locate a value to select.

Choose based on the user's task: finding content belongs in Search field; choosing a value belongs in Combobox.

</section>

<section>

## Suggested searches

Autocomplete helps users complete names, recognise useful terms and form a search query with less typing. Use it when people may need help finding the right words to search a collection.

### How suggestions appear

- **Inline** proposes the rest of a phrase directly in the field, helping users complete a predictable term.
- **List** displays matching phrases below the field, helping users compare alternatives.
- **Both** combines inline completion with a suggestion list.

Suggestions are optional. Users can continue typing or search their own words without accepting a proposal.

### Phrase matching

Matching determines which phrases appear and which text stands out.

- **Starts with** shows phrases beginning with the typed words. For “high”, it can suggest “High **West Institute**”. The added text is emphasised to help users compare completions.
- **Contains** also finds the typed words within a phrase, such as “Elementary **High** School”. The matching text is emphasised to show why the phrase appears.

Inline completion always uses a starting match.

### Searching with suggestions

Enter in the field searches the typed words. Accepting an inline completion adds it to the query. Choosing a phrase from the list runs that search.

Label the list **“Suggested searches”** to distinguish it from actual results. Loading, empty and unavailable messages describe the suggestions. Users can still search their own words.

</section>

<section>

## Anatomy

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Icon | The icon improves the visibility. |Yes|
|2|Placeholder | The placeholder provides a clue to the user. |Yes|
|3|Input | When the user enters their inputs. |Yes|
|4|Clear Button | This button clears the user's input. It only appears when there is an input. |Yes|
|5|Search Button | Search action button. |No|

{.ds-table .ds-table-align-top}

</section>


<section>

## States and Status
Search field share the same behaivour as an Input field. That provide it with the same states, each suited for different interactions. The states provided are **default**, **hover**, **active**, **disabled** and **focus**.

</section>


<section>

## Options
With these options, you can tweak the appearance of the Search field in Figma. They are available in the Design Panel so you can compose the spinner to exactly fit the user experience need for the use case you are working on.

|Item|Options|Description|
|-|-|-|
|Size|`'md', 'lg'`|This are the sizes of the Search field. The `md`is the default size.  |
|State|`'Default', 'Hover', 'Active', 'Disabled'`|The states of the Search field. |
|Placeholder|`'On', 'Off'`|Toggle to switch between the placeholder and the input value. |
|Label|`'On', 'Off'`|Toggle to display the Field Label. |

{.ds-table .ds-table-align-top}


</section>


<section>

## Behavior
Understanding the behavior of Search field is crucial for creating intuitive and user-friendly content access. Search field exhibit the same behaviors of the Text field, and one more.

### Restart Search
When the users introduce their search value, a restart button will clear the search field values to make it easier for all users to start a new search.

</section>
