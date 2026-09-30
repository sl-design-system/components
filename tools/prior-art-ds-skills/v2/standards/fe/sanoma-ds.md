# Sanoma Learning Design System — reguły specyficzne dla naszego stacku

Reguły dla pracy z `@sl-design-system/*` (SLDS) i konwencji Sanoma Learning DS. Wyprowadzone z incydentów geometrycznych (shadow-DOM padding override fails), niestabilności theme'ingu (CSS fallback values vs resolved tokens), i decyzji projektowych zespołu (max- prefix). Sformułowane jako rozszerzenie reguł generycznych z tego katalogu — gdy konflikt z generic + angular, reguły SDS-* mają pierwszeństwo dla projektów używających SLDS.

Indeks całego zestawu: [./README.md](./README.md). Mapowanie na Angular jako framework: [./angular.md](./angular.md). Generic reguły FE (zależności, layout, dane, błędy): pozostałe pliki tego katalogu.

---

## SDS-1 — SLDS Web Component Integration (register.js + CUSTOM_ELEMENTS_SCHEMA)

**Reguła.** SLDS v2 pakiety eksportują Web Components (LitElement), **nie Angular components**. Nie istnieje pakiet `@sl-design-system/angular` z Angular wrapperami. Jedyny wspierany wzorzec:
1. `import '@sl-design-system/<package>/register.js'` — side-effect import, rejestruje custom element globalnie. Bundler dedupluje automatycznie.
2. `schemas: [CUSTOM_ELEMENTS_SCHEMA]` w każdym `@Component` z `sl-*` tagami — patrz SDS-2.
3. `imports: []` dla sl-* — **zawsze puste**. Nigdy nie importuj TypeScript klas SLDS do `imports[]`.

**Dlaczego.** SLDS eksportuje LitElement Web Components. Próba importu jako Angular component → NG2012 compile error (`'SomeClass' is not a component`). `register.js` rejestruje custom element globalnie przez browser's Custom Elements API; `CUSTOM_ELEMENTS_SCHEMA` pozwala Angular template kompilatorowi zaakceptować `sl-*` tagi bez type-check'u.

**Przykład.**

```ts
// ŹLE — próba importu Angular wrappera (pakiet nie istnieje)
import { ButtonComponent } from '@sl-design-system/angular/button';  // ❌ pakiet nie istnieje
@Component({ imports: [ButtonComponent] })  // ❌ NG2012: class is not a component

// DOBRZE
import '@sl-design-system/button/register.js';  // ✅ side-effect — rejestruje <sl-button>
import '@sl-design-system/icon/register.js';    // ✅ jeden import per pakiet (dedupluje)

@Component({
  selector: 'max-hero',
  imports: [],                           // ✅ zawsze puste dla sl-* (Web Components)
  schemas: [CUSTOM_ELEMENTS_SCHEMA],     // ✅ wymagany — patrz SDS-2
  template: `<sl-button variant="primary">Kup</sl-button>`,
})
```

**Override condition.** Gdy `@sl-design-system/angular` zostanie wydany z właściwymi `@Component()` Angular wrapperami, zaktualizuj tę regułę. Patrz `context/foundation/sl-ds-lessons.md` → Expired: `slds-register-js-pattern`.

**Wyjątki.** Brak.

---

## SDS-2 — `CUSTOM_ELEMENTS_SCHEMA` jest WYMAGANY dla sl-* Web Components

**Reguła.** ZAWSZE dodawaj `schemas: [CUSTOM_ELEMENTS_SCHEMA]` do każdego `@Component` który zawiera w template `sl-*` tagi. Nie jest to "obejście" — to standard integration pattern dla SLDS v2+. Nie wymaga dokumentacji w decisions doc.

**Dlaczego.** `CUSTOM_ELEMENTS_SCHEMA` mówi Angular template kompilatorowi: "tagi których nie rozpoznaję w `imports[]` mogą być legalnymi Web Custom Elements — nie emituj NG8001". SLDS używa Custom Elements API (Web Components spec). Bez schema: NG8001 (`'sl-button' is not a known element`) → compilation fails.

**Przykład.**

```ts
// ŹLE — brak CUSTOM_ELEMENTS_SCHEMA przy sl-* tagach
@Component({
  imports: [],
  // brak schemas → NG8001: 'sl-button' is not a known element ❌
  template: `<sl-button>X</sl-button>`,
})

// DOBRZE
@Component({
  selector: 'max-hero',
  imports: [],                           // ✅ zawsze puste dla sl-*
  schemas: [CUSTOM_ELEMENTS_SCHEMA],     // ✅ wymagany dla sl-* Web Components
  template: `<sl-button>X</sl-button>`,
})
```

**Wyjątki.** Brak. Każdy komponent z sl-* tagami potrzebuje tego schema.

---

## SDS-3 — Komponenty DS z shadow-DOM (sl-card, sl-dialog) NIGDY jako kontenery layoutu

**Reguła.** `<sl-card>`, `<sl-dialog>`, `<sl-tabs>` itp. — komponenty SLDS z internal shadow DOM padding/margin — są dla **pojedynczych elementów semantycznych** (jeden produkt, jeden notification, jeden dialog). Nigdy nie używaj ich jako wrappera grid/flex layoutu z wieloma children. Dla layoutu kontenera: zwykły `<div class="...">` z własnym CSS.

**Dlaczego.** Shadow DOM komponentu SLDS zawiera własne padding (np. `sl-card` ma `padding: 16px` w `:host` shadow root). Z zewnątrz NIE da się go nadpisać bez `::part()` ścieżek (które SLDS nie zawsze eksponuje). Rezultat: dziecko 1392×987 w Figmie kończy jako 1360×955 w przeglądarce — geometric verify (`/sl-ds-verify` ±2px tolerancja) failuje. Powtarzający się incydent w `teacher-dashboard` Q1 i Q2 2026.

**Przykład.**

```html
<!-- ŹLE — sl-card jako 3-kolumnowy grid layout -->
<sl-card>
  <max-hero />
  <max-insights />
  <max-actions />
</sl-card>

<!-- DOBRZE — div jako kontener; sl-card dla pojedynczego elementu wewnątrz -->
<div class="dashboard-grid">
  <max-hero />
  <max-insights />
  <max-actions />
  <sl-card>  <!-- ✅ jeden element promocyjny w gridzie -->
    <h3>Twoja klasa</h3>
    <p>3A — 24 uczniów</p>
  </sl-card>
</div>
```

**Heurystyka:** jeśli komponent ma 3+ direct children które tworzą layout (grid/flex) → kontener musi być `<div>`, nie `<sl-*>`. `/sl-ds-plan` Step 3 (DS component mapping) wymusza tę klasyfikację.

**Wyjątki.** `<sl-card>` z 1-2 dzieci które są CONTENT (heading + text + button) — to legalne użycie, nie layout. Granica: czy children pozycjonują się względem siebie (= layout) czy są semantycznie pojedynczym blokiem (= card content).

---

## SDS-4 — Selector prefix `max-` dla custom komponentów Sanoma teacher-portal

**Reguła.** Wszystkie nasze custom komponenty (poza routem root i `sl-*` z SLDS) używają selektora w formacie `max-<feature>-<role>` (np. `max-hero-section`, `max-insights-panel`, `max-groups-panel`). Wyjątki: `app-root` (legacy, OK), komponenty z bibliotek third-party (`<router-outlet>` itp.).

**Dlaczego.** Prefix `max-` jest konwencją Sanoma Maximus (teacher-portal v2+). Daje szybki wzrokowy podział: `<sl-*>` = SLDS, `<max-*>` = nasz custom, `<app-*>` = stare/root, inne = third-party. Bez prefix'u — namespace collision z bibliotekami DS i confusion przy review.

**Przykład.**

```ts
// ŹLE — bez prefixu, kolizja możliwa
@Component({ selector: 'hero-section', ... })  // ❌

// ŹLE — błędny prefix
@Component({ selector: 'sl-hero-section', ... })  // ❌ wygląda jak SLDS, nim nie jest

// DOBRZE
@Component({ selector: 'max-hero-section', ... })  // ✅
```

**Wyjątki.** `app-root` (legacy, niemodyfikowany). Komponent test-only w `*.spec.ts` może użyć `test-*`. Komponent w shared lib może użyć `sanoma-shared-*` (na granicy biblioteki).

---

## SDS-5 — Wartości tokenów tylko z `tokens-verified.json`, nigdy z CSS fallback values

**Reguła.** CSS custom properties użyte w `.scss`/`.css` muszą mieć WARTOŚCI pobrane z `.sl-ds-cache/sl-ds-impl/tokens-verified.json` (wynik `/sl-ds-tokens` Step 7 — verified resolved values z `get_variable_defs` Figma MCP). Wartości z `get_design_context` w postaci `var(--name, #fallback)` — TYLKO sygnał że taki token istnieje; **fallback hex MOŻE BYĆ wartością domyślnego theme'u**, nie aktywnego.

**Dlaczego.** Theme override w Figma podmienia wartość. CSS fallback w `get_design_context` to często wartość *original theme*, nie *active theme*. Skopiowanie do kodu daje "wygląda OK w Figmie, źle w przeglądarce z innym theme'em". Klasyczna pułapka — patrz STYLE-2 z tego katalogu i ERR-4 (cicha odmowa).

**Przykład.**

```css
/* ŹLE — wartość z CSS fallback (default theme), nie z active theme */
.hero {
  color: #1727b6;  /* ❌ to original theme; active theme to #0a6165 */
  background: var(--color-surface, #f5f5f5);  /* ❌ inline fallback duplikuje token */
}

/* DOBRZE — wartość pochodzi z tokens-verified.json */
:root {
  --color-foreground-primary-bold: #0a6165;  /* z get_variable_defs (active theme) */
  --color-background-surface-default: #ffffff;
}

.hero {
  color: var(--color-foreground-primary-bold);  /* ✅ */
  background: var(--color-background-surface-default);  /* ✅ */
}
```

**Reguła pochodna:** w generowanym `styles.scss` (Step 4 `/sl-ds-implement`) zmienne CSS są wprowadzone POJEDYNCZO na podstawie `tokens-verified.json`. Komponentowe `.scss` ich tylko KONSUMUJĄ przez `var(--token-name)` — nigdy nie definiują ponownie ani nie używają hex literali.

**Wyjątki.** `transparent`, `currentColor`, `inherit` — legalne wartości nie-tokenowe. Komentarze i debug values w dev-only — fine, ale `/sl-ds-verify` patterns check je flaguje (info severity).

---

## SDS-6 — Aktywne i18n: WSZYSTKIE user-facing strings przez `I18NextPipe` (lub configured pipe)

**Reguła.** Gdy `.sl-ds-config.yaml` deklaruje `i18n.active: true` z konfigurowanym `pipe_name` (np. `I18NextPipe` dla `angular-i18next`, `TranslatePipe` dla `@ngx-translate/core`) — KAŻDY user-facing string w template'cie i w typescript musi przejść przez ten pipe. Hard-coded "Nauczyciel", "Klasa", "Zaloguj" itp. → fail.

**Dlaczego.** Sanoma Maximus jest wielo-językowy (PL/EN/SE/FI). Hard-coded stringi nie tłumaczone → bug raportowany przez non-PL teachers. Wykryto incydent 2025-Q4: cart screen miał 12 hard-coded PL strings, anglojęzyczni nauczyciele zobaczyli mieszanke EN UI + PL teksty → confusion + tickets.

**Przykład.**

```ts
// ŹLE
template: `<h1>Witaj, nauczycielu</h1>`  // ❌ hard-coded

// DOBRZE — Angular template z I18NextPipe (angular-i18next)
template: `<h1>{{ 'dashboard.greeting' | i18nextEager }}</h1>`  // ✅

// DOBRZE — Angular template z TranslatePipe (@ngx-translate/core)
template: `<h1>{{ 'dashboard.greeting' | translate }}</h1>`  // ✅

// DOBRZE — string w typescript przez serwis
private i18n = inject(I18NextService);
title = computed(() => this.i18n.t('dashboard.greeting'));  // ✅
```

**Reguła pochodna:** klucze translacji follow konwencji `<feature>.<element>.<state>` (np. `teacher-dashboard.hero.title`, `cart.actions.checkout`). Pure-static strings w accessibility attrs (`aria-label="loading"`) — też tłumaczone jeśli i18n active.

**Wyjątki.** Branded names ("Sanoma Maximus", "SLDS" itp.) — nie tłumaczyć. Numeric formatters obsługiwane przez `Intl.*`, nie przez i18n pipe. Test fixtures w `*.spec.ts` mogą używać hard-coded strings.

---

## SDS-7 — `/sl-ds-setup` musi wykryć i zapisać SLDS version + framework version do `.sl-ds-config.yaml`

**Reguła.** `.sl-ds-config.yaml` zawsze deklaruje aktualne wersje:
- `slds_version` (z `node_modules/@sl-design-system/button/package.json` lub `not-installed`)
- `angular_version` (z `node_modules/@angular/core/package.json`)

Te wartości czytane przez wszystkie downstream skille: `/sl-ds-plan` używa SLDS version do wybrania właściwego API surface (SLDS 2.0+ vs legacy 1.x); `/sl-ds-verify` do scriptów `check-modern-angular.js`.

**Dlaczego.** SLDS major version bumps zmieniają API komponentów (np. `sl-button` dostał `variant="primary-tonal"` w 2.1, nie istniał w 2.0). Bez wersji w configu — kod generowany może używać API niedostępnego w danej instalacji. Manualne sprawdzanie przy każdym screen'ie = błąd.

**Przykład.**

```yaml
# DOBRZE — .sl-ds-config.yaml po /sl-ds-setup
sl-ds-agents:
  framework: angular
  slds_version: "2.1.0"          # wykryte z node_modules
  angular_version: "19.2.1"      # wykryte
  project:
    nx_enabled: true
    target_scope: apps/teacher-dashboard
```

**Reguła pochodna:** zmiana wersji wymaga `/sl-ds-setup --reset` przed kolejnym screen'em (kod cache nie powinien zakładać starych API). `/sl-ds-verify` warning gdy SLDS upgraded od ostatniego `pipeline-state.json`.

**Wyjątki.** SLDS not installed (custom mode) → `slds_version: null` jest legalne. Skill `/sl-ds-implement` w custom mode produkuje plain CSS bez DS imports.

---

## Skrót decyzyjny (TL;DR dla AI agent w czystym kontekście)

| Sytuacja | Reguła | Akcja |
|---|---|---|
| `<sl-button>` w template, brak `register.js` importu | SDS-1 | Dodaj `import '@sl-design-system/button/register.js'` + `schemas: [CUSTOM_ELEMENTS_SCHEMA]`; usuń `ButtonComponent` z `imports[]` |
| `sl-*` w template, brak `CUSTOM_ELEMENTS_SCHEMA` | SDS-2 | Dodaj `schemas: [CUSTOM_ELEMENTS_SCHEMA]` do `@Component` |
| `<sl-card>` z 3+ children w layoutie | SDS-3 | Zamień na `<div>`, sl-card użyj dla single item |
| Custom komponent bez prefiksu `max-` | SDS-4 | Rename selector do `max-<feature>-<role>` |
| Hex literal `#0a6165` w `.scss` | SDS-5 | Sprawdź czy odpowiednik jest w tokens-verified.json; zastąp `var(--color-...)` |
| Hard-coded string i18n.active=true | SDS-6 | Przekonwertuj na `{{ 'key' \| translate }}` lub odpowiedni pipe |
| `.sl-ds-config.yaml` bez `slds_version` | SDS-7 | Re-run `/sl-ds-setup` |

Patrz [./README.md](./README.md) §3 mapa zestawu dla generic FE rules. Patrz `_shared/lessons-format.md` w `.agents/skills/` dla team-specific overrides którymi mogą rozciągać te SDS-*.
