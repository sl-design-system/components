---
title: Card usage
tags: usage
eleventyNavigation:
  parent: Card
  key: CardUsage
---

<section>
  
<div class="ds-example">
  <div class="ds-example__code-wrapper">
    <sl-card style="--sl-card-media-aspect-ratio:1/1; --sl-card-horizontal-breakpoint:500px;">
        <img slot="media" src="https://sanomalearning.design/assets/images/open-graph-card.jpg" />
        <h2>Fun adventures in digital learning</h2>
        <span slot="header"><sl-badge variant="accent">new</sl-badge> written by: Lynn</span>
        <p slot="body">
          Digital learning is when we use computers, tablets, or even phones to learn new things. It's super cool because it lets us explore all sorts of topics without even leaving our homes!
        </p>
        <p slot="body">First off, digital learning means we can learn anytime, anywhere. Say goodbye to boring textbooks! With digital learning, we can watch fun videos, play educational games, and even talk to teachers and other students online. It's like having a whole world of knowledge at our fingertips!</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
      </sl-card>
  </div>
</div>

<div class="ds-code">

  ```html
  <sl-card style="
      --sl-card-media-aspect-ratio:1/1; 
      --sl-card-horizontal-breakpoint:500px;">
    <img slot="media" src="images/open-graph-card.jpg" />
    <h2>Fun adventures...</h2>
    <span slot="header">
      <sl-badge>new</sl-badge>
       written by: Lynn
    </span>
    <p slot="body">
      Digital learning is when...
    </p>
    <sl-button slot="actions" icon-only fill="ghost">
      <sl-icon name="eye"></sl-icon>
    </sl-button>
  </sl-card>
  ```

</div>
  
</section>

<section>

## When to use

### Content Grouping
Cards are great for putting similar content together. Use them when you want to show information about one specific thing.

### Visual Hierarchy
Cards help organize information clearly. They make it easy for users to scan and identify important information.

### Modularity
When you need a modular design that can be reused across different parts of your application, cards are a great choice.

</section>

<section>

## When not to use

### Complexity
Use cards for simple content presentation, but avoid them for complex layouts or intricate interactions.

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Card Container	|The placeholder of the card|no|
|2|Card image	|The image of the card|yes|
|3|Card header	|The title of the card|no|
|4|More button	|To display secondary actions related to the content|yes|
|5|Card body	|The content of the card |no|
|6|Card footer	|Displays actions related to subject|yes|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Options

With these options, you can tweak the appearance of the card in Figma. They are available in the Design Panel so you can compose the card to exactly fit the user experience need for the use case you are working on.

<div class="ds-table-wrapper">
  
|Item|Options|Description|
|-|-|-|
|Orientation|`horizontal` `vertical`|Indicates the orientation of the card|
|Media margin|`1/2` `1/2` `none`|Indicates if there is margin around the media or not|
|Ratio| Depends on the orientation |Indicates the ratio between the card body and media|
|Truncation|`boolean`|Indicates if the text of the card body is truncated|
|Media position|`top` `left` `right` `none`|Indicates the position of the media|
|Card icon|`boolean`|Indicates if there is an icon in front of the header|
|More button|`boolean`|Indicates if there is more button|
|Body text|`value`|To insert the text of the card|


{.ds-table .ds-table-align-top}
</div>

</section>
