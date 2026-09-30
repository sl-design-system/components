# Quality Scoring — Podział na 5 Grup

## Zasada

- Każda grupa: 0-100 (musi być ≥90 indywidualnie)
- Composite = średnia ważona wszystkich grup (musi być ≥95)
- Jeśli JAKAKOLWIEK grupa <90 → FAIL (niezależnie od composite)
- Jeśli composite <95 → auto-repair loop (max 3 cykle)

---

## Grupa 1: ARCHITECTURE & DECOMPOSITION (22%)

Jak kod jest zorganizowany strukturalnie.

Metryki:
- Smart/Dumb component separation
- Component granularity (LOC, inputs, responsibilities)
- Store pattern compliance (smart component → *.store.ts)
- Reusability ratio (shared vs jednorazowe komponenty)
- Composition depth (max nesting smart→dumb)
- Layer violations (NX boundaries)
- Circular dependencies (0 dozwolone)
- Dependency depth (max 5)
- Separation of concerns (logika vs prezentacja vs state)

---

## Grupa 2: CODE QUALITY (23%)

Jak kod jest napisany — ekspert Angular z 10+ lat doświadczenia.

Metryki:
- Type safety (zero `any`, zero `as`, strict mode)
- Complexity (cyclomatic ≤8, cognitive ≤12, nesting ≤4)
- Angular best practices (signals, inject(), standalone, @for, OnPush)
- Performance (lazy loading, trackBy, bundle size, zoneless)
- Size limits (method ≤30 LOC, file ≤300 LOC, template ≤30 bindings)
- Observable handling (takeUntilDestroyed, no naked subscribe)
- Error handling (Result pattern, no throw in domain)
- Modern patterns (signal inputs/outputs, control flow syntax)

---

## Grupa 3: VISUAL FIDELITY (25%)

Design z Figmy musi być 100% identyczny.

Metryki:
- Screenshot comparison (≤2% pixel diff)
- Layout spacing/alignment (≤4px tolerance)
- Correct SLDS components used (100% identity match)
- Correct props/variants applied (from CEM)
- Typography tokens (font-size, weight, line-height)
- Color tokens (zero hardcoded hex/rgb)
- Interaction states (hover, focus, disabled — match Figma variants)
- Responsive breakpoints (mobile/tablet/desktop match design)

---

## Grupa 4: ACCESSIBILITY (18%)

WCAG 2.2 AA (konfigurowalny standard).

Metryki:
- axe-core: 0 critical, 0 serious violations
- Keyboard navigation: 100% interactive elements reachable via Tab
- Focus management: trapped in modals, restored on close, logical after navigation
- ARIA coverage: all interactive elements have accessible name
- Semantic HTML: proper heading hierarchy, landmarks
- Color contrast: ≥4.5:1 normal text, ≥3:1 large text
- Live regions: dynamic content changes announced
- Navigation flow: logical journey for screen reader (a11y-navigator check)

---

## Grupa 5: DESIGN SYSTEM & MAINTAINABILITY (12%)

Prawidłowe użycie DS + utrzymywalność kodu.

Metryki:
- DS token usage: 0 hardcoded colors/spacing/typography
- CEM prop validity: 0 unknown properties on sl-* elements
- No draft components in production
- No inline styles on SLDS components
- Code coverage ≥80% statements, ≥70% branches
- Code duplication ≤2%
- Zero dead code (unused exports)
- JSDoc coverage ≥80% public API
- Zero TODO/FIXME in production code

---

## Scoring

```
COMPOSITE = (Arch×22 + CodeQ×23 + Visual×25 + A11y×18 + DS×12) / 100

PASS wymaga:
  1. Composite ≥ 95
  2. Architecture & Decomposition ≥ 90
  3. Code Quality ≥ 90
  4. Visual Fidelity ≥ 90
  5. Accessibility ≥ 90
  6. DS & Maintainability ≥ 90

FAIL jeśli:
  - Jakakolwiek grupa < 90 (niezależnie od composite)
  - Composite < 95 po 3 cyklach naprawy
```

---

## Auto-Repair Loop

```
Trigger: composite < 95 LUB jakakolwiek grupa < 90

REPAIR_LOOP:
  1. Identyfikuj najsłabszą grupę
  2. Sortuj issues w grupie po impact
  3. Napraw (max 3 cykle)
  4. Re-score
  5. Jeśli ≥95 → PASS
  6. Jeśli po 3 cyklach < 95 → ESCALATE do usera

Infinite loop guards:
  - Same issue fingerprint 2x → mark UNFIXABLE
  - Same file hash po fix → no-op → skip
  - Max 3 cykle (hard limit)
  - Token budget: 30K per cykl, 90K total
```

---

## Pytanie do usera

Pasuje ten podział? Chcesz:
1. Zmienić proporcje wag (22/23/25/18/12)?
2. Przesunąć metryki między grupami?
3. Dodać/usunąć coś?
4. Zaakceptować i przejść do konsolidacji w finalny dokument?
