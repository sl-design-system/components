# Deprecated tokens

In the release of December 4th we deprecated a large number of css-tokens. These tokens with our old setup had been removed from our components a while before from most components, so we felt safe to remove them from the theme as well.

With this action we removed the old tokens from the default CSS files, and moved all legacy tokens to a separate file. If you have components in your application that are not updated yet to the version that uses the new tokens, the styling will be broken if you don't take action after using this version of the theme. To support these older component versions you can include `light-deprecated.css` in all places where you now include `light.css` until all components are updated and you can remove the legacy file. (`light.css` is taken as an example, this of course goes for all files, also `dark`, `base` and the `scss` files)

If you're using component versions **older** than the versions listed below, you need to include the deprecated CSS files (`light-deprecated.css`, `dark-deprecated.css`) for backward compatibility. These files maintain the legacy token structure that was replaced by the contextual token system.

|Component|version|
|---|---|
|accordion | v1.2.0|
|avatar | v1.2.0|
|badge | v1.1.0|
|breadcrumbs | v1.1.0|
|button | v1.2.0|
|button-bar | v1.2.0|
|checkbox | v2.1.0|
|combobox | v0.1.0|
|dialog | v2.0.0|
|editor | v0.1.0|
|emoji | v0.0.9|
|form | v1.2.0|
|grid | v0.5.0|
|icon | v1.4.1|
|inline-message | v1.1.0|
|listbox | v0.1.0|
|menu | v0.2.7|
|message-dialog | v1.1.0|
|number-field | v0.1.0|
|paginator | v0.2.2|
|panel | v0.2.0|
|popover | v1.2.2|
|progress-bar | v0.1.4|
|radio-group | v1.1.0|
|scrollbar | v0.1.0|
|search-field | v0.1.0|
|select | v2.0.0|
|skeleton | v1.1.0|
|spinner | v2.0.0|
|switch | v1.1.0|
|tabs | v1.1.0|
|tag | v0.1.8|
|text-area | v1.1.0|
|text-field | v1.6.0|
|toggle-button | v0.0.11|
|toggle-group | v0.0.11|
|tooltip | v1.1.4|
|tree | v0.1.2|
