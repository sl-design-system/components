---
title: Button usage
tags: usage
eleventyNavigation:
  parent: Button
  key: ButtonUsage
---



<section class="no-heading">

<div class="ds-example">

<sl-button fill="solid" variant="primary" size="md"> Button</sl-button>

</div>

<div class="ds-code">

  ```html
  <sl-button fill="solid" variant="primary" size="md">Button</sl-button>
  ```

</div>

</section>

<section>

## When to use

Buttons should be used in user interfaces when you want to provide users with a clear and actionable way to interact with a webpage, application, or device. Here are some common scenarios when you should use buttons:

<section class="ds-cards">
<figure class="ds-cards__do">
  {{'components/button/sl-button-when-use-actions.svg' | svgImage}}
<figcaption>

### To Initiate Actions 
Buttons are used to trigger specific actions or functions. For example, you can use a "Submit" button in a form to send user input to a server, or a "Save" button to save changes in an application.
</figcaption>
</figure>

</section>
</section>

<section>

## When not to use

<section class="ds-cards">
  <figure class="ds-cards__dont">
    {{'components/button/sl-button-when-not-use-menu.svg' | svgImage}}
<figcaption>

  ### Menu Items
  When creating a navigation menu, such as a dropdown menu or a side menu, using text links or icons is typically more common and efficient. Buttons can make menus look bulky and less streamlined.
</figcaption>
  </figure>
</section>
</section>
<section>

## Anatomy
{{ 'components/button/sl-buttons-anatomy.svg' | svgImage }}

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Text label	|A button's text label acts as a concise but powerful message, informing users of the action triggered by a click or tap. It serves as the button's voice, delivering clarity and guidance in a few well-chosen words.	|yes|
|2|Container	|The container of a button is its home, providing structure and placement within the user interface. It ensures the button is visually pleasing, strategically positioned, and accessible to users.	|no|
|3|Icon	|The icon of a button is like a visual cue, conveying meaning and enhancing user understanding. It's a compact symbol that complements the button's text, adding an extra layer of context or functionality.|yes|

{.ds-table}

</section>
<section>

## Types

<section class="ds-cards">
  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" aria-describedby="interactiveexample" size="sm"></sl-icon>
      <sl-button fill="solid" variant="primary" size="lg">Solid</sl-button>
    </div>
    <figcaption>

  ### Solid  (Essential)
  Solid buttons are essential; they're necessary to move forward in the user flow. They emphasize critical actions, ensuring users respond quickly and understand what to do.
</figcaption>
  </figure>
  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" aria-describedby="interactiveexample" size="sm"></sl-icon>
      <sl-button fill="outline" variant="primary" size="lg">Outline</sl-button>
    </div>
    <figcaption>

### Outline (Important, but not essential)
Outline buttons are important, but not essential in a user interface. Unlike solid buttons, outline buttons are optional in a user flow; they draw attention to certain actions but don't block progression.
</figcaption>
  </figure>
  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" aria-describedby="interactiveexample" size="sm"></sl-icon>
      <sl-button fill="ghost" variant="primary" size="lg">Ghost</sl-button>
    </div>
    <figcaption>

### Ghost 👻 (Suggest)
Ghost buttons discreetly suggest actions or options in a user interface. They're employed for advanced functionality, offering choices or recommendations without being essential or distracting from the user flow. Ghost buttons are ideal for suggesting secondary actions or guiding users to less emphasized but relevant interactions.
</figcaption>
  </figure>
  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" aria-describedby="interactiveexample" size="sm"></sl-icon>
      <sl-button fill="link" variant="primary" size="lg">Link</sl-button>
    </div>
    <figcaption>

### Link (Inform)
Link buttons are there to help users find more information or related content without being intrusive. They're great for actions like "Read More" or "View Details" when you want to provide extra details without cluttering the interface. They enhance user exploration while keeping the interface clean and minimalist.
</figcaption>
  </figure>
  </section>
</section>
<section>

## Variants

Take a look at our button options designed for different user needs and situations. They enhance user experiences for everyday actions and critical decisions. Check out our default, primary, success, warning, and danger button variants in our overview.

<section class="ds-cards">
  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" aria-describedby="interactiveexample" size="sm"></sl-icon>
      <sl-button fill="solid" variant="primary" size="lg">Primary</sl-button>
    </div>
    <figcaption>
  
  ### Primary
  Primary buttons are like the interface's guiding stars, drawing immediate attention to critical actions. They're best used for the primary user flow, making them stand out for important tasks.
  </figcaption>
  </figure>
  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" aria-describedby="interactiveexample" size="sm"></sl-icon>
      <sl-button fill="solid" variant="default" size="lg">Default</sl-button>
    </div>
    <figcaption>
  
  ### Default
  These buttons stand below the primary button in the hierarchy. They serve well in secondary user flows on a page, such as adding an extra timeslot, or additional feedback when marking students' work. <br/> When there is no clear hierarchy in user flows on the page (for example a dashboard or overview page) this is your go-to button.
  </figcaption>
  </figure>
  <figure>    
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" aria-describedby="interactiveexample" size="sm"></sl-icon>
      <sl-button fill="solid" variant="success" size="lg">Success</sl-button>
    </div>
    <figcaption>
  
  ### Success 
  Success buttons act as digital applause, marking successful task completion and enhancing the user experience. This addition can effectively communicate achievement and contribute to overall user satisfaction. 
  </figcaption>
  </figure>
  <figure>    
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" aria-describedby="interactiveexample" size="sm"></sl-icon>
      <sl-button fill="solid" variant="warning" size="lg">Warning</sl-button>
    </div>
    <figcaption>

  ### Warning
  A warning button signals the need for careful consideration and double-checking. Its purpose is to prevent unintended actions and confirm the right choice. 
  </figcaption>
  </figure>
  <figure>    
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" aria-describedby="interactiveexample" size="sm"></sl-icon>
      <sl-button fill="solid" variant="danger" size="lg">Danger</sl-button>
    </div>
    <figcaption>
  
  ### Danger
  The danger button is a clear warning of risky actions, typically associated with irreversible outcomes or significant data loss
</figcaption>
</section>
</section>
<section>

## Types vs Variants
This table provides guidance on when to use each button variant (Solid, Outline, Ghost, and Link) for different button types, considering their specific characteristics and purposes in user interface design.

{{ 'components/button/sl-button-importance-graph.svg' | svgImage }}

|Variants|Solid |Outline |Ghost |Link |
|-|-|-|-|-|
|Primary|	 Used to move forward in a primary (the most important) user flow.| For secondary actions related to the primary user flow. | To give suggestive actions related to the primary user flow.| To give information related to the primary user flow.|
|Default |Used to move forward in a secondary user flow or when there is no specific user flow. | For secondary actions related to the secondary user flow. | To give suggestive actions related to the secondary user flow. |  To give information related to the secondary user flow|
|Success|For actions confirming successful operations.|For secondary actions related to the successful operation. |To give suggestive actions related to the successful operation.|To give information related to the successful operation.|
|Warning	|For actions requiring caution or user confirmation. |For secondary actions related to the warning.|To give suggestions related to the warning.|To give information related to the warning user flow. |
|Danger	|For actions confirming potentially negative consequences. |For secondary actions related to potentially negative consequences.|To give suggestions related to potentially negative consequences.|To give information related to potentially negative consequences.|

{.ds-table .ds-table-align-top}

### Example

Here's an example that explains which button to use in different scenarios:
{{ 'components/button/sl-button-variants-types-example.svg' | svgImage}}

1. The "Remove" button should be Danger-Outline; it's a secondary action and not part of the main user flow on this page.
2. The "Upload CSV" button should be Default-Outline; although it's not part of the main user flow, it requires emphasis.
3. The "Confirm Participants" button should be Primary-Solid; it represents the next step in the user flow and the primary reason the user is on this page.
4. Add a "Cancel" or "Back" button, which should be Primary-Outline; it's part of the main user flow but a secondary action.
</section>
<section>

## Figma Options

With these options you can tweak the appearance of the button in Figma. They are available in the Design Panel so you can compose the button to exactly fit the user experience need for the uses case you are working on.

{{ 'components/button/sl-button-figma-options.svg' | svgImage }}

|Item|Options|Description|
|-|-|-|
|Type|`solid` `outline` `ghost` `link`|There are four button types to choose from so you can differentiate between buttons, depending on how essential they are.  <br> [More info about button types](#types)|
|Variant|`default` `primary` `success` `warning` `danger` `info`|Indicates the variant of the button. <br> [More info about button variants](#variants) |
|Size|`small` `medium` `large`|The button is available in three sizes. If not specified the default value is `medium`.|
|Icon |`start` `end`|Indictes the position of the icon.|
|Label|`text`|Value of the button.|
|Icon only|`boolean`|Indicates if it is an icon only button.|

{.ds-table .ds-table-align-top}

</section>

<section>

## Behavior

### Mouse Interaction
Users can activate a button by clicking anywhere within the button container.

### Tooltip When Label is Hidden
When the button label is concealed, a tooltip appears on hover, revealing the label text and, when applicable, a keyboard shortcut.

### Transition
Hover and Active State Transitions: When users hover over a button or the button is in an active state, the background color and/or border color smoothly transition to provide visual feedback. 
</section>
