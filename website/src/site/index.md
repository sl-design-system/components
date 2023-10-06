---
title: Welcome to the Sanoma Learning Design System
layout: base.njk
eleventyNavigation:
  key: Pages
---

[//]: # (** &#40;Left for the future use&#41;)

[//]: # (### Not SSR:)

[//]: # (<ds-test-element></ds-test-element>)

[//]: # ()
[//]: # (### SSR:)

[//]: # (<is-land on:interaction="pointerenter" import="/js/components/test-component.js">)

[//]: # (<ds-test-element count="10"></ds-test-element>)

[//]: # (</is-land>)

[//]: # ()
[//]: # (### SSR:)

[//]: # (<is-land on:interaction="pointerenter" import="/js/components/my-counter.js">)

[//]: # (<my-counter></my-counter>)

[//]: # (</is-land>)

[//]: # ()
[//]: # (### not SSR:)

[//]: # (<my-counter></my-counter>)

<section class="ds-hero-block">

# Learn, develop, deploy

Create enjoyable, usable and accessible products that meet students and teachers needs.

</section>

<section class="ds-explore">

Explore {.ds-heading-1}

<div class="ds-explore-wrapper">

<div class="ds-explore__components ds-explore__card">

<div class="ds-explore__card-image">
{{'homepage/puzzle.svg' | svgImage }}
</div>

<div class="ds-heading-2">
<a href="/categories/components/overview/" aria-labelledby="componentsParagraph">
Components
</a>
</div>

<p id="componentsParagraph">Sanoma Learning’s UI components are built to best practices to ensure usability, performance and accessibility.</p>

</div>

<div class="ds-explore__design-tokens ds-explore__card">

<div class="ds-explore__card-image">
{{'homepage/slide-design.svg' | svgImage }}
</div>

<div class="ds-heading-2">
<a href="/categories/design-tokens/color" aria-labelledby="tokensParagraph">
Design tokens
</a>
</div>

<p id="tokensParagraph">Tokens are platform-agnostic variables that define the look and feel of your brand.</p>

</div>

<div class="ds-explore__guidelines ds-explore__card">

<div class="ds-explore__card-image">
{{'homepage/brush-ruler.svg' | svgImage }}
</div>

<div class="ds-heading-2">
<a href="/categories/guidelines/" aria-labelledby="guidelinesParagraph">
Guidelines
</a>
</div>

<p id="guidelinesParagraph">Practical guides to get started with designing and developing your experience with Sanoma Learning's Design System.</p>

</div>

</div>

</section>

<section class="ds-call-to-action">


{{'homepage/pupil.svg' | svgImage }}


<div class="ds-call-to-action__description">

LATEST RELEASE {.ds-call-to-action__main-text}

Sanoma Learning Design System v0.0.1 {.ds-call-to-action__heading .ds-heading-1}

This latest release includes form controls.

<a class="ds-call-to-action__link" href="https://github.com/sl-design-system/components/releases" target="_blank">
  View the release notes 
</a>

</div>

</section>

<section class="ds-contact-block">

<div class="ds-contact-block__contribute">

Contribute {.ds-heading-1}

<div class="ds-contact-block__description">
Sanoma Learning Design System is hosted on GitHub. Request features or report bugs through our <a class="ds-contact-block__description-link" href="https://github.com/sl-design-system/components/issues/new/choose" target="_blank">issue form</a>.
</div>

<a class="ds-contact-block__button" href="https://github.com/sl-design-system/components/blob/main/CONTRIBUTING.md" target="_blank">
<sl-icon name="fab-github"></sl-icon> Contribute on GitHub
</a>

</div>

<div class="ds-contact-block__get-in-touch">

Get in touch {.ds-heading-1}

<a class="ds-contact-block__link ds-contact-block__slack" href="https://sanoma.slack.com/archives/C03SA9HUUA3" target="_blank">
<sl-icon name="fab-slack"></sl-icon> Slack channel
</a>

<a class="ds-contact-block__link ds-contact-block__question" href="mailto:designsystem@sanoma.com">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" fill="none">
<path fill="#36F" d="M5.875 7c0-.344.25-.625.625-.625.344 0 .625.281.625.625a.627.627 0 0 1-.625.625A.608.608 0 0 1 5.875 7Zm.094-4.75h.937c.813 0 1.5.688 1.5 1.5 0 .563-.312 1.063-.844 1.313l-.593.312V5.5c0 .281-.219.5-.5.5-.25 0-.5-.219-.5-.5v-.438a.49.49 0 0 1 .281-.437l.875-.438c.156-.093.281-.25.281-.437 0-.281-.218-.5-.5-.5H5.97a.414.414 0 0 0-.407.406c0 .281-.218.5-.5.5a.494.494 0 0 1-.5-.5A1.4 1.4 0 0 1 5.97 2.25ZM11 10H7l-3.406 1.938C3.5 12 3.438 12 3.375 12 3.156 12 3 11.875 3 11.625V10H2c-1.125 0-2-.875-2-2V2C0 .906.875 0 2 0h9c1.094 0 2 .906 2 2v6c0 1.125-.906 2-2 2Zm0-1.5c.25 0 .5-.219.5-.5V2c0-.25-.25-.5-.5-.5H2c-.281 0-.5.25-.5.5v6c0 .281.219.5.5.5h2.5v1.219L6.594 8.5H11ZM9.5 11v1c0 .281.219.5.5.5h3.375l2.125 1.219V12.5H18c.25 0 .5-.219.5-.5V6c0-.25-.25-.5-.5-.5h-4V4h4c1.094 0 2 .906 2 2v6c0 1.125-.906 2-2 2h-1v1.625c0 .25-.188.375-.375.375-.094 0-.156 0-.25-.063L13 14h-3c-1.125 0-2-.875-2-2v-1h1.5Z"/>
</svg>
Contact support
</a>

<a class="ds-contact-block__link ds-contact-block__bug" href="https://github.com/sl-design-system/components/issues/new/choose" target="_blank">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" fill="none">
<path fill="#36F" d="M11 3v.125c0 .5-.406.875-.906.875H5.875A.854.854 0 0 1 5 3.125V3c0-1.656 1.313-3 3-3a3 3 0 0 1 3 3Zm-9.781.219a.736.736 0 0 1 1.031 0L4.531 5.5A3.17 3.17 0 0 1 6.25 5h3.5c.625 0 1.188.188 1.688.5l2.28-2.281a.736.736 0 0 1 1.032 0c.313.312.313.781 0 1.062L12.5 6.563c.313.5.5 1.062.5 1.687h2.25A.76.76 0 0 1 16 9a.74.74 0 0 1-.75.75H13V10c0 .875-.219 1.656-.594 2.375l2.344 2.344c.313.312.313.781 0 1.062a.684.684 0 0 1-1.031 0L11.5 13.594A5.046 5.046 0 0 1 8 15a5.065 5.065 0 0 1-3.531-1.406L2.25 15.78a.684.684 0 0 1-1.031 0c-.313-.281-.313-.75 0-1.062l2.343-2.344C3.188 11.656 3 10.875 3 10v-.25H.75A.722.722 0 0 1 0 9a.74.74 0 0 1 .75-.75H3c0-.625.156-1.188.469-1.688l-2.25-2.28c-.313-.282-.313-.75 0-1.063ZM4.5 10a3.49 3.49 0 0 0 2.75 3.438V8.75A.74.74 0 0 1 8 8a.76.76 0 0 1 .75.75v4.688A3.522 3.522 0 0 0 11.5 10V8.25c0-.938-.813-1.75-1.75-1.75h-3.5c-.969 0-1.75.813-1.75 1.75V10Z"/>
</svg>
Submit an issue
</a>

</div>

</section>
