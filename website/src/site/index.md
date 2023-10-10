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

Sanoma Learning Design System {.ds-call-to-action__heading .ds-heading-1}

Check out our latest releases on our github page.

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
<sl-icon name="far-messages-question"></sl-icon>
Contact support
</a>

<a class="ds-contact-block__link ds-contact-block__bug" href="https://github.com/sl-design-system/components/issues/new/choose" target="_blank">
<sl-icon name="far-bug"></sl-icon>
Submit an issue
</a>

</div>

</section>
