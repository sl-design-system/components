# SLDS Tokens

This package contains the design tokens for the various products who use the Sanoma Learning Design System.

## Structure

Figma is the tool used for managing the design tokens. Figma is the one source of truth. Any chances made in Figma are synced to this repository in the `src/figma` folder.

Once the tokens in the figma folder have been updated, various files are generated from those using [style-dictionary](https://amzn.github.io/style-dictionary).

Every theme has its own separate folder. Each folder is then also published as a separate package, e.g. `@slds/sanoma-learning`. The `@slds/tokens` package is private and is itself not published.
