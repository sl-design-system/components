---
title: Button usage
tags: usage
eleventyNavigation:
  parent: Button
  key: ButtonUsage
---

# Usage
<section>

<div class="ds-example">

<sl-button fill="solid" variant="primary" size="md">Button</sl-button>

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

1. **To Initiate Actions**: Buttons are used to trigger specific actions or functions. For example, you can use a "Submit" button in a form to send user input to a server, or a "Save" button to save changes in an application.

1. **To Provide Navigation**: Buttons can be used as links or navigation elements. For instance, a "Learn More" button can take users to a detailed page about a product or service.

</section>
<section>

## When not to use

1. **Menu Items**: When creating a navigation menu, such as a dropdown menu or a side menu, using text links or icons is typically more common and efficient. Buttons can make menus look bulky and less streamlined.

</section>
<section>

## Anatomy
Alignment refers to whether the buttons are aligned to the right or the left of a window, container, or layout. Buttons are unique, more so than any other component, in that their alignment depends on where they appear and whether or not they’re contained within another component.

As a general rule, on full-page screens, the primary button is on the left side of the page. When the browser window is large, and the user is scrolling to read, it’s best to have the primary button where the user’s attention has been focused all along. Where a user progresses through a series of steps or dialog windows, search fields and data tables, the primary action traditionally sits at the bottom right.

|Position |Usage| 
|---|---|
|Left|Default position and Full-pages.|
|Right|Dialogs, Notifications, Steps forms and Alert messages.|

{.ds-table}

</section>
<section>

## Button types

### Solid  (Essential)
Solid buttons are essential; they're necessary to move forward in the user flow. They emphasize critical actions, ensuring users respond quickly and understand what to do.

(visual)

### Outline (Important, but not essential)
Outline buttons are important, but not essential in a user interface. Unlike solid buttons, outline buttons are optional in a user flow; they draw attention to certain actions but don't block progression.
(visual)

### Ghost 👻 (Suggest)
Ghost buttons discreetly suggest actions or options in a user interface. They're employed for advanced functionality, offering choices or recommendations without being essential or distracting from the user flow. Ghost buttons are ideal for suggesting secondary actions or guiding users to less emphasized but relevant interactions.

(visual)

### Link (Inform)
Link buttons are there to help users find more information or related content without being intrusive. They're great for actions like "Read More" or "View Details" when you want to provide extra details without cluttering the interface. They enhance user exploration while keeping the interface clean and minimalist.

</section>
<section>

## Button variants

Take a look at our button options designed for different user needs and situations. They enhance user experiences for everyday actions and critical decisions. Check out our default, primary, success, warning, and danger button variants in our overview.

|||
|-------------|--------|
|Primary|Primary buttons are like the interface's guiding stars, drawing immediate attention to critical actions. They're best used for the primary user flow, making them stand out for important tasks.|
|Default	|These buttons stand below the primary button in the hierarchy. They serve well in secondary user flows on a page, such as adding an extra timeslot, or additional feedback when marking students' work. <br/> When there is no clear hierarchy in user flows on the page (for example a dashboard or overview page) this is your go-to button. |
|Success |Success buttons act as digital applause, marking successful task completion and enhancing the user experience. This addition can effectively communicate achievement and contribute to overall user satisfaction. |
|Warning	|A warning button signals the need for careful consideration and double-checking. Its purpose is to prevent unintended actions and confirm the right choice. |
| Danger | The danger button is a clear warning of risky actions, typically associated with irreversible outcomes or significant data loss.|

{.ds-table}
</section>
<section>

## Button Types vs Button Variants
This table provides guidance on when to use each button variant (Solid, Outline, Ghost, and Link) for different button types, considering their specific characteristics and purposes in user interface design.

|Button Variants|Solid |Outline |Ghost |Link |
|-|-|-|-|-|
||*Essential*|*Important but not essential*|*Suggest*|*Inform*|
|Primary|	<sl-button fill="solid" variant="primary" size="md">Button</sl-button><br/> Used to move forward in a primary (the most important) user flow.|<sl-button fill="outline" variant="primary" size="md">Button</sl-button><br/> For secondary actions related to the primary user flow. |<sl-button fill="ghost" variant="primary" size="md">Button</sl-button><br/> To give suggestive actions related to the primary user flow.|<sl-button fill="link" variant="primary" size="md">Button</sl-button><br/> To give information related to the primary user flow.|
|Default |<sl-button fill="solid" variant="default" size="md">Button</sl-button><br/>Used to move forward in a secondary user flow or when there is no specific user flow. | <sl-button fill="outline" variant="default" size="md">Button</sl-button><br/>For secondary actions related to the secondary user flow. | <sl-button fill="ghost" variant="default" size="md">Button</sl-button><br/>To give suggestive actions related to the secondary user flow. | <sl-button fill="link" variant="default" size="md">Button</sl-button><br/> To give information related to the secondary user flow|
|Success|<sl-button fill="solid" variant="success" size="md">Button</sl-button><br/>For actions confirming successful operations.|<sl-button fill="outline" variant="success" size="md">Button</sl-button><br/>For secondary actions related to the successful operation. |<sl-button fill="ghost" variant="success" size="md">Button</sl-button><br/>To give suggestive actions related to the successful operation.|<sl-button fill="link" variant="success" size="md">Button</sl-button><br/>To give information related to the successful operation.|
|Warning	|<sl-button fill="solid" variant="warning" size="md">Button</sl-button><br/>For actions requiring caution or user confirmation. |<sl-button fill="outline" variant="warning" size="md">Button</sl-button><br/>For secondary actions related to the warning.|<sl-button fill="ghost" variant="warning" size="md">Button</sl-button><br/>To give suggestions related to the warning.|<sl-button fill="link" variant="warning" size="md">Button</sl-button><br/>To give information related to the warning user flow. |
|Danger	|<sl-button fill="solid" variant="danger" size="md">Button</sl-button><br/>For actions confirming potentially negative consequences. |<sl-button fill="outline" variant="danger" size="md">Button</sl-button><br/>For secondary actions related to potentially negative consequences.|<sl-button fill="ghost" variant="danger" size="md">Button</sl-button><br/>To give suggestions related to potentially negative consequences.|<sl-button fill="link" variant="danger" size="md">Button</sl-button><br/>To give information related to potentially negative consequences.|

{.ds-table .ds-table-align-top}

### Example

Here's an example that explains which button to use in different scenarios:

1. The "remove" button should be Default-Outline; it's a secondary action and not part of the main user flow on this page.
1. The "add coupon" button should be Default-Solid; although it's not part of the main user flow, it requires emphasis.
1. The "Proceed to checkout" button should be Primary-Solid; it represents the next step in the user flow and the primary reason the user is on this page.
1. Add a "cancel" or "back" button, which should be Primary-Outline; it's part of the main user flow but a secondary action.

(visual)
</section>
<section>

## Content

Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>
