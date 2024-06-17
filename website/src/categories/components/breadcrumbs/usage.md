---
title: Breadcrumbs usage
tags: usage
eleventyNavigation:
  parent: Breadcrumbs
  key: CardUsage
---
<section class="no-heading">

<div class="ds-example">
<sl-breadcrumbs>
  <a href="javascript:void(0)">Settings</a>
  <a href="javascript:void(0)">My profile</a>
  <a href="javascript:void(0)">Details</a>
</sl-breadcrumbs>
</div>

<div class="ds-code">

  ```html
    <sl-breadcrumbs>
      <a href="...">Settings</a>
      <a href="...">My profile</a>
      <a href="...">Details</a>
    </sl-breadcrumbs>
  ```

</div>

</section>

<section>

## When to use

### Hierarchy representation
Breadcrumbs visually depict the structural hierarchy of a digital product. They guide users through layers of content, showing where they are within the system. Each breadcrumb link corresponds to a specific level in the hierarchy. They typically appear horizontally at the top of a digital product.

</section>

<section>

## When not to use

### Limited content depth
When your digital product has shallow navigation, breadcrumbs may add clutter without significant benefit. If there are only one or two layers of hierarchy, users can find their way without breadcrumbs.

### User navigation path
The actual path a user takes during their session may differ from the breadcrumb trail and is not shown within the breadcrumb.
Users might jump directly from one section to another, use search functionality, or follow external links. Their journey can be nonlinear and influenced by various factors.

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Breadcrumbs|Combines a number of ‘breadcrumb items’ and separators|no|
|2|Breadcrumb item|An a href link, it can include an icon in front of the link|no|
|3|Separator	|Visual separator that appears after ‘breadcrumb items’|no|

{.ds-table}

</div>

</section>

<section>

## Figma Options

With these options, you can tweak the appearance of the breadcrumbs in Figma. They are available in the Design Panel so you can compose the breadcrumbs to exactly fit the user experience need for the use case you are working on.

<div class="ds-table-wrapper">
  
###  Base settings
  
|Item|Options|Description|
|-|-|-|
|Type|`desktop` `mobile` `home`|To indicate the sizing of the breadcrumb|
|Page up to and including 3  |`boolean`|To indicate which pages are visible within the breadcrumb|
|Current|`boolean`|To indicate if the active page is visible in the end of the breadcrumb |

{.ds-table}

</div>

<div class="ds-table-wrapper">
  
###  Home item
  
|Item|Options|Description|
|-|-|-|
|State|`idle` `hover` `active` `current`|Indicate the state of the home item|
|Show icon|`boolean`|Indicates if the icon is visible|
|Show label|`boolean`|Indicates if the label is visible|

{.ds-table}

</div>

<div class="ds-table-wrapper">
  
###  Page up to and including 3
  
|Item|Options|Description|
|-|-|-|
|Overflow|`boolean`|Indicates if the page is visble or truncated |
|State|`idle` `hover` `active` `current`|Indicates if the icon is visible|
|Text|`value`|The title of the page|

{.ds-table}

</div>

<div class="ds-table-wrapper">
  
###  Menu
The option below is only shown when the **overflow** option is selected.
  
|Item|Options|Description|
|-|-|-|
|Menu|`boolean`|Indicates if the menu with truncated pages is open or closed |

{.ds-table}

</div>

</section>
