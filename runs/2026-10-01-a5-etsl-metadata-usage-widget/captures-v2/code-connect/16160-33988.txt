# Code Connect map discrepancy

`mcp__figma__get_code_connect_map` on `S5QgDy8X9eqhvECPANSZMM` / `17214:103584` returned an
empty object `{}` (preserved verbatim in `figma-code-connect-map.json`). This was a successful
response, not a transient error — it was NOT retried as a failure.

However `get_design_context` on the same subtree DID return `<CodeConnectSnippet>` wrappers for
`sl-badge` and `sl-icon`, and returned Figma "Component descriptions" for `sl-button`,
`sl-icon`, `sl-badge` and `sl-avatar` with sanomalearning.design documentation links.

Conclusion: Code Connect mappings exist for this file but `get_code_connect_map` did not surface
them for the root node. The manifest's "Existing SLDS Components Used" table is therefore sourced
from the `get_design_context` CodeConnectSnippet blocks + component descriptions + `sl-*` node
names, not from the (empty) map response.

Snippets recovered from get_design_context:

- sl-badge -> <sl-badge color="orange" size="lg">Unused</sl-badge>
- sl-badge -> <sl-badge color="green"  size="lg"><sl-icon name="fas-backpack"></sl-icon>Success</sl-badge>
- sl-badge -> <sl-badge color="red"    size="lg"><sl-icon name="fas-backpack"></sl-icon>Failure</sl-badge>
- sl-icon -> <SlIcon ↕️Size="16160:33988" /> (parametric/no-template form)
