# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: website/tests/website_a11y.spec.ts >> Limited to <main> test on other pages >> A11y test on \_data/custom-elements/custom-elements/
- Location: website/tests/website_a11y.spec.ts:76:7

# Error details

```
Error: frame.evaluate: Error: No elements found for include in page Context
    at validateContext (eval at evaluate (:303:30), <anonymous>:18986:15)
    at new Context (eval at evaluate (:303:30), <anonymous>:18967:7)
    at Object._getFrameContexts (eval at evaluate (:303:30), <anonymous>:19008:22)
    at eval (eval at evaluate (:303:30), <anonymous>:4:27)
    at UtilityScript.evaluate (<anonymous>:305:16)
    at UtilityScript.<anonymous> (<anonymous>:1:44)
```

# Page snapshot

```yaml
- generic [ref=e2]: Not Found
```
