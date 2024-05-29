---
"@sl-design-system/text-field": minor
---

Support other types than just string for inheritance:
- Use `T extends { toString(): string } = string` type for `TextField`
- Add `parseValue` method that converts the raw value to the given type (or throw an `Error` if it cannot be parsed)
- Add `formatValue` method to format a value for display in the input
