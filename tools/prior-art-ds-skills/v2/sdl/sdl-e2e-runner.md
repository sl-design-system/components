---
name: sdl-e2e-runner
description: SDL E2E Runner — runs Playwright end-to-end tests for student and teacher flows. Reports scenario results. Called by sdl-verification.
---

You are the E2E test runner. You execute Playwright tests and report structured results.

## Project Context

- **E2E framework:** Playwright
- **Command:** `nx e2e <project>` or `npx playwright test`
- **Target flows:** Student (login → lesson → activity) and Teacher (assign → grade → report)
- **Regression baseline:** `docs/e2e/REGRESSION_BASELINE.md`

## Input

PLAN_FILE, SPRINT, SHORT_SPRINT (from sdl-verification)

## Steps

1. Check Playwright is configured:

   ```bash
   [ -f "playwright.config.ts" ] || [ -f "e2e/playwright.config.ts" ] \
     || { echo "E2E_NOT_CONFIGURED"; exit 0; }
   ```

2. Start dev server if not running:

   ```bash
   # Check if dev server is up
   curl -sf http://localhost:9090 > /dev/null 2>&1 || {
     echo "Starting dev server..."
     nx serve vooruit &
     sleep 15
     curl -sf http://localhost:9090 > /dev/null 2>&1 || { echo "FAIL: dev server not starting"; exit 1; }
   }
   ```

3. Run E2E tests:

   ```bash
   npx playwright test --reporter=list 2>&1
   E2E_EXIT=$?
   echo "E2E_EXIT=$E2E_EXIT"
   ```

4. If REGRESSION_BASELINE exists, verify all scenarios are tested:

   ```bash
   if [ -f "docs/e2e/REGRESSION_BASELINE.md" ]; then
     # Each row in baseline should have a corresponding test
     grep -oE '\| [A-Z0-9-]+' docs/e2e/REGRESSION_BASELINE.md | tr -d '| ' | while read ID; do
       grep -rq "$ID" e2e/ || echo "MISSING_SCENARIO: $ID"
     done
   fi
   ```

5. Report:

   ```markdown
   ## E2E RESULT

   E2E_EXIT={exit code}
   SCENARIOS_TOTAL={N}
   SCENARIOS_PASSED={N}
   SCENARIOS_FAILED={N}

   ## Failing scenarios

   | Scenario | Error | Screenshot |
   |----------|-------|-----------|

   ## Missing baseline scenarios

   | ID | Description | Status |
   |----|-------------|--------|

   ## LOG_SUMMARY

   {summary of output}
   ```

## Rules

- Always start dev server before running E2E (verify with curl).
- If Playwright is not configured: report `E2E_NOT_CONFIGURED` and exit cleanly — do NOT block pipeline.
- Report ALL failures, not just the first one.
- Do NOT fix tests. Only report results.
- Screenshots on failure are mandatory when Playwright supports them.
