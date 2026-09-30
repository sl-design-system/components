Agent completed. agent_id: duplication-analysis, agent_type: research, status: completed, description: FE duplication exceptions analysis, elapsed: 361s, total_turns: 0, duration: 357s

Now I have everything I need. I've read the full quality metrics system, the actual form directive implementations (including real structural duplication in `TextFieldDirective` vs `NumberFieldDirective`), the mixin/controller architecture, and the scoring model. Let me produce the definitive analysis.

---

# When Quality Rules Have Valid Exceptions: A Staff Engineer's Guide for AI Quality Agents

> **Context:** This document governs rule interpretation for the AI code-generation quality pipeline targeting Angular 21 + `@sl-design-system/*` web components. Rules are defined in `QUALITY_GROUPS.md` and `QUALITY_METRICS.md`. Every section produces a **machine-readable decision rule** the agent can apply programmatically.

---

## Part 1: When Code Duplication Is Acceptable (and Preferred)

> **Base rule (M1):** `jscpd --min-lines 5 --min-tokens 50` → duplication ratio ≤ 2%.  
> **Override:** Any case below overrides that threshold for specific, detectable contexts.

---

### Case 1 — DDD Bounded Contexts: Same-Looking Model/Service in Different Domains

#### Why duplication is correct

A bounded context owns its own language, its own model, and its own lifecycle. Sharing a `User` type between an `admin` context and a `profile` context seems like an obvious win until the admin context adds `roles: string[]` and `auditLog: AuditEntry[]` and the profile context adds `preferences: UserPreference`. Now you have a single god-type that has the full union of both domains' concerns — or you have conditional fields with comments saying "only used in admin". Both outcomes are worse than duplication.

The *coupling* introduced by sharing is more expensive than the duplication. A change in the admin domain bleeds into the profile domain and vice versa; test isolation becomes impossible without mocking the shared module.

#### Example — what it looks like in this codebase's application layer

```typescript
// feature-admin/models/user.model.ts
// @quality-exception: bounded-context
export interface User {
  id: string;
  email: string;
  displayName: string;
  roles: Role[];                    // admin-context concept
  auditLog: AuditEntry[];          // admin-context concept
  lastLoginAt: Date;
}

// feature-profile/models/user.model.ts
// @quality-exception: bounded-context
export interface User {
  id: string;
  email: string;
  displayName: string;
  preferences: UserPreferences;     // profile-context concept
  theme: ThemeKey;                  // profile-context concept
}
```

Both interfaces share `id`, `email`, `displayName` — five identical lines. `jscpd` will flag them. They are **intentionally identical on those three fields** and will deliberately **diverge** as the domains evolve. The duplication is the protection mechanism, not the problem.

The same pattern applies to services:

```typescript
// feature-admin/services/user-http.service.ts
// @quality-exception: bounded-context
@Injectable({ providedIn: 'root' })
export class AdminUserHttpService {
  readonly #http = inject(HttpClient);
  
  getUsers(): Observable<Result<User[], ApiError>> {
    return this.#http.get<ApiUser[]>('/api/admin/users').pipe(
      map(users => Ok(users.map(mapToAdminUser))),
      catchError(err => of(Err(mapApiError(err))))
    );
  }
}

// feature-profile/services/user-http.service.ts
// @quality-exception: bounded-context
@Injectable({ providedIn: 'root' })
export class ProfileUserHttpService {
  readonly #http = inject(HttpClient);
  
  getUser(id: string): Observable<Result<User, ApiError>> {
    return this.#http.get<ApiUser>(`/api/profile/users/${id}`).pipe(
      map(user => Ok(mapToProfileUser(user))),
      catchError(err => of(Err(mapApiError(err))))
    );
  }
}
```

The `catchError/map/pipe` scaffold looks identical. Abstracting them into a shared `BaseUserService` would create a cross-boundary dependency — exactly what DDD forbids.

#### How to distinguish good duplication from bad

| Signal | Good (Bounded Context) | Bad (Accidental) |
|--------|------------------------|------------------|
| File paths | `feature-A/models/X` + `feature-B/models/X` | `feature-A/models/X` + `feature-A/components/X` |
| Type names match but semantics differ | `admin/User` vs `profile/User` | `user/User` (duplicate in same context) |
| Different endpoints / mapping functions | `/api/admin/users` vs `/api/profile/users` | Same endpoint, same mapper |
| Different `@NgModule` / NX library boundary | Separate NX library per feature | Same library |
| Will diverge over time | YES — expected | NO — both must be updated together |

#### Rule for the AI agent

```
SKIP_DUPLICATION_WARNING when ALL of the following are true:
  1. Duplicated blocks are in different NX library paths
     (e.g. libs/feature-admin/* vs libs/feature-profile/*)
  2. OR file paths contain different bounded-context directory segments
     (admin|cms|billing|profile|auth|reporting|classroom|assessment)
  3. AND the type names are domain model types (User, Order, Product, Course)
     NOT utility types (Result, Paginated, ApiError)
  4. OR annotation: // @quality-exception: bounded-context is present
```

---

### Case 2 — Component Variants: Structurally Similar But Semantically Separate

#### Why duplication is correct

This is the most common false positive in Angular codebases. `UserCardAdminComponent` and `UserCardPublicComponent` often share 70% of their template. The temptation is to create `UserCardComponent` with so many conditional `@if` blocks that it becomes untestable and unmaintainable.

The real criterion is: **do they have different accessibility requirements, different interaction models, or different permission models?** If yes, they are not the same component and should not share an implementation.

Crucially: a component shared between admin and public contexts is implicitly a cross-boundary dependency. Changing the admin card to show an "impersonate" button would force you to add `@if(isAdmin)` to the shared component — now your public component has admin logic in its bundle.

#### Example

```typescript
// feature-admin/components/user-card/user-card.component.ts
// @quality-exception: component-variant
@Component({
  selector: 'app-admin-user-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-card>
      <span slot="header">{{ user().displayName }}</span>
      <p>{{ user().email }}</p>
      <p>Roles: {{ user().roles.join(', ') }}</p>
      <sl-button-bar slot="footer">
        <sl-button variant="primary" (click)="onEdit()">Edit</sl-button>
        <sl-button variant="danger" (click)="onSuspend()">Suspend</sl-button>
        <sl-button variant="ghost" (click)="onImpersonate()">Impersonate</sl-button>
      </sl-button-bar>
    </sl-card>
  `
})
export class AdminUserCardComponent {
  readonly user = input.required<AdminUser>();
  readonly edit = output<AdminUser>();
  readonly suspend = output<AdminUser>();
  readonly impersonate = output<AdminUser>();
  
  protected onEdit(): void { this.edit.emit(this.user()); }
  protected onSuspend(): void { this.suspend.emit(this.user()); }
  protected onImpersonate(): void { this.impersonate.emit(this.user()); }
}

// feature-profile/components/user-card/user-card.component.ts  
// @quality-exception: component-variant
@Component({
  selector: 'app-profile-user-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sl-card>
      <span slot="header">{{ user().displayName }}</span>
      <p>{{ user().email }}</p>
      <p>Member since: {{ user().createdAt | date }}</p>
      <sl-button-bar slot="footer">
        <sl-button variant="primary" (click)="onEdit()">Edit Profile</sl-button>
      </sl-button-bar>
    </sl-card>
  `
})
export class ProfileUserCardComponent {
  readonly user = input.required<ProfileUser>();
  readonly edit = output<ProfileUser>();
  
  protected onEdit(): void { this.edit.emit(this.user()); }
}
```

The `sl-card` scaffold, the `slot="header"` pattern, the `sl-button-bar`, and the `onXxx` pattern repeat. `jscpd` will flag this. The components have **different input types, different outputs, and different template content** — they share structural scaffolding, not logic.

#### How to distinguish good duplication from bad

| Signal | Good (Variant) | Bad (Accidental) |
|--------|----------------|-----------------|
| Input types are different | `AdminUser` vs `ProfileUser` | Same `User` type |
| Output events differ | different actions | same actions |
| Template shows admin-only UI (impersonate, audit, roles) | YES | NO |
| Components live in different feature paths | YES | Same feature, same route |
| One component has >30% unique template content vs the other | YES | Nearly identical |

#### Rule for the AI agent

```
SKIP_DUPLICATION_WARNING when:
  1. Duplicated components have different @Input / input() types (by TypeScript type name)
  2. OR components are in different feature directories AND component class names differ only by context prefix
     (Admin*, Public*, *Admin, *Public, *Preview, *Detail, *Summary, *Compact)
  3. AND shared content is structural (sl-card wrapper, slot patterns, button-bar)
     NOT business logic (validation, calculation, state management)
  4. OR annotation: // @quality-exception: component-variant
```

---

### Case 3 — Test Setup Code: Repeated `arrange` Across Test Files

#### Why duplication is correct

DRY in tests is the enemy of test clarity. A failing test must be **self-diagnosable** — a developer reading only that test's file should understand exactly what the test verifies and why it fails. Tests that import shared helpers from `test-utils/` require the developer to navigate to that file to understand what `createMockUser()` returns today — which may have changed since the test was written.

Furthermore, test helpers create hidden coupling: changing `createMockUser()` to add a required field breaks 30 tests that weren't related to that change.

The rule of thumb from the DAMP (Descriptive And Meaningful Phrases) principle: test code should be **DAMP, not DRY**.

#### Example — real pattern from this codebase

```typescript
// text-field.spec.ts
describe('TextFieldDirective', () => {
  let el: NativeTestElement;
  
  beforeEach(async () => {
    // This fixture setup repeats across form directive specs — intentionally
    // @quality-exception: test-setup-damp
    el = await fixture(html`
      <form>
        <sl-text-field name="email" required></sl-text-field>
      </form>
    `);
  });
  
  it('should return required error when empty', () => {
    expect(el.validity.valueMissing).toBe(true);
  });
});

// number-field.spec.ts  
describe('NumberFieldDirective', () => {
  let el: NativeTestElement;

  beforeEach(async () => {
    // Same fixture pattern, same form wrapper — DAMP duplication
    // @quality-exception: test-setup-damp
    el = await fixture(html`
      <form>
        <sl-number-field name="amount" required min="0" max="100"></sl-number-field>
      </form>
    `);
  });

  it('should return rangeUnderflow when below min', async () => {
    el.formValue = -1;
    await el.updateComplete;
    expect(el.validity.rangeUnderflow).toBe(true);
  });
});
```

These `beforeEach` blocks are nearly identical structurally. They should NOT be extracted into `createFormFixture()` because the HTML differs meaningfully, and extracting it would hide the test's precondition.

#### Rule for the AI agent

```
SKIP_DUPLICATION_WARNING when:
  1. File path matches *.spec.ts, *.test.ts, or __tests__/**
  2. AND duplicated block is inside beforeEach(), beforeAll(), describe(), or it()/test() body
  3. AND the block is ≤ 20 lines
  4. OR annotation: // @quality-exception: test-setup-damp
  
NEVER skip when:
  - Duplicated block is a utility function or class shared between test files
    (that's actually bad — use test helpers for utilities, just not for fixture setup)
```

---

### Case 4 — Template Patterns: Repeated HTML Structures That Shouldn't Be Abstracted

#### Why duplication is correct

Not every repeated template is an abstraction opportunity. Abstracting too aggressively creates:
- Components with dozens of `@Input()` for every possible variation
- Components where the "abstraction" is harder to understand than the original duplication
- Premature API commitments for one-off structural patterns

The threshold question is: **would an abstraction require more than 3 `@Input()` properties to cover the current two usages?** If yes, the abstraction costs more than it saves.

#### Example — form field grouping pattern

```html
<!-- In registration-page.component.html -->
<!-- @quality-exception: template-structural -->
<sl-form-field>
  <sl-label>Email</sl-label>
  <sl-text-field name="email" type="email" required></sl-text-field>
  <sl-hint>We'll use this to contact you</sl-hint>
</sl-form-field>

<!-- In profile-edit-page.component.html -->  
<!-- @quality-exception: template-structural -->
<sl-form-field>
  <sl-label>Email</sl-label>
  <sl-text-field name="email" type="email" required></sl-text-field>
  <sl-hint>Your login email address</sl-hint>
</sl-form-field>
```

The structure is identical — the hint text differs. Building `<app-email-field [hint]="..." />` for two usages is overengineering.

But compare this to **actual bad duplication**:

```html
<!-- BAD: This SHOULD be abstracted — same thing 6 times in same file -->
<div class="stat-card">
  <span class="stat-card__label">Total Users</span>
  <span class="stat-card__value">{{ totalUsers() }}</span>
</div>
<div class="stat-card">
  <span class="stat-card__label">Active Today</span>
  <span class="stat-card__value">{{ activeToday() }}</span>
</div>
<!-- × 4 more identical structures — EXTRACT THIS -->
```

#### How to distinguish good duplication from bad

| Signal | Good (Don't Abstract) | Bad (Extract) |
|--------|----------------------|---------------|
| Occurs in different feature files | YES | NO — same file |
| Structure is DS component scaffolding | sl-form-field + sl-label + sl-* | Custom `<div class>` pattern |
| Abstraction would need >3 inputs | YES | NO — clean 1-2 input API possible |
| Repetition count | 2–3 times across features | 4+ times in same file/component |
| Content differs (labels, hints, names) | YES — intentionally different | NO — copy-paste |

#### Rule for the AI agent

```
SKIP_DUPLICATION_WARNING when:
  1. Duplicated block is in *.html template files in DIFFERENT component directories
  2. AND the block consists primarily of SLDS component tags (sl-form-field, sl-card, sl-button-bar)
     rather than custom div/span class structures
  3. AND repetition count across different files is ≤ 3
  4. OR annotation: // @quality-exception: template-structural
  
FLAG_FOR_EXTRACTION when:
  - Repetition count ≥ 4 in same file
  - OR identical custom class-based HTML (not SLDS tags) repeated ≥ 3 times
```

---

### Case 5 — Migration / Parallel Implementations: Old + New Code Co-existing

#### Why duplication is correct

The strangler-fig migration pattern deliberately keeps the old implementation running while the new one is built. You cannot delete the old code until all consumers are migrated, and you cannot prove the new code is safe until it's running in production. This is not duplication as a design decision — it's duplication as a migration strategy with a bounded lifespan.

#### Example — migrating from `@Input()` to signal inputs

```typescript
// user-card.component.ts
// @quality-exception: migration-parallel
// MIGRATION: Signal inputs (new) coexists with @Input() (legacy) during migration sprint
// TODO(migration): Remove @Input() variants after all consumers updated — tracked in #4521

@Component({
  selector: 'app-user-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class UserCardComponent {
  // NEW: Signal-based input (Angular 17+)
  readonly user = input<User>();
  
  // LEGACY: @Input() kept for backward compat during migration
  // @quality-exception: migration-parallel
  @Input() set legacyUser(value: User) {
    // Bridge: write into writable signal for legacy callers
    this.#userOverride.set(value);
  }
  
  readonly #userOverride = signal<User | undefined>(undefined);
  readonly effectiveUser = computed(() => this.#userOverride() ?? this.user());
}
```

#### How to distinguish good duplication from bad

| Signal | Good (Migration) | Bad (Permanent) |
|--------|-----------------|----------------|
| Issue/ticket reference in comment | YES — `#4521` | NO |
| One variant clearly marked as legacy/deprecated | YES | NO |
| Code has a finite end state | YES — remove after migration | NO — both variants permanent |
| Approaches are structurally identical | YES (old API bridge) | Diverged implementations |

#### Rule for the AI agent

```
SKIP_DUPLICATION_WARNING and ADD_WARNING_NOTE when:
  1. Annotation // @quality-exception: migration-parallel is present
  2. AND there is a corresponding issue reference (# or JIRA ticket)
  3. AND one of the duplicated blocks has @deprecated JSDoc or 'legacy' in its identifier name
  
ADDITIONAL_ACTION: Log to quality report:
  "MIGRATION_DUPLICATION detected in {file}. Expected removal tracked in {ticket}.
   If ticket older than 60 days → escalate as stale migration."
```

---

### Case 6 — Configuration / Constants: Values That Must NOT Be Shared

#### Why duplication is correct

This is the most counter-intuitive case. Constants that look identical across modules should often remain separate because sharing them creates inappropriate **semantic coupling** and **deployment coupling**.

Consider: `MAX_PAGE_SIZE = 50` in an API service and `MAX_PAGE_SIZE = 50` in a UI pagination component. They happen to be 50 today. But:
- The API limit is determined by the backend contract
- The UI limit is a UX decision (what looks good on screen)

Sharing them with `export const MAX_PAGE_SIZE = 50` in a shared constants file means the next backend engineer who changes the API contract to 100 will also change the UI behavior. These are different concerns.

#### Example

```typescript
// feature-courses/api/courses.api.ts
// @quality-exception: config-coupling-risk
// NOTE: This limit is enforced by the API contract. Changes require backend coordination.
const API_PAGE_SIZE = 20;

export class CoursesApiService {
  getCourses(page: number): Observable<Result<CoursePage, ApiError>> {
    return this.#http.get<ApiCoursePage>('/api/courses', {
      params: { page: page.toString(), pageSize: API_PAGE_SIZE.toString() }
    }).pipe(/* ... */);
  }
}

// feature-courses/components/course-list/course-list.component.ts
// @quality-exception: config-coupling-risk  
// NOTE: This is a UX decision — how many courses look good in the list view.
// Different from API_PAGE_SIZE — UI can paginate differently than the API.
const VISIBLE_PAGE_SIZE = 20;

@Component({ /* ... */ })
export class CourseListComponent {
  readonly pageSize = signal(VISIBLE_PAGE_SIZE);
}
```

Both are `20`. They must stay separate because the *reason* they are `20` is different.

#### How to distinguish good duplication from bad

| Signal | Good (Keep Separate) | Bad (Share) |
|--------|---------------------|------------|
| Same value, different reason | Different concepts that happen to be equal | Same concept used in two places |
| Changing one should NOT change the other | YES | NO — they always change together |
| One is an API contract, one is a UX decision | YES | Both are UX or both are API |
| Constants are in different architectural layers | YES — API layer vs UI layer | Same layer |

#### Rule for the AI agent

```
SKIP_DUPLICATION_WARNING when:
  1. Duplicated tokens are constant/enum declarations (not function bodies or class definitions)
  2. AND they are in different architectural layers:
     (api|http|services) vs (components|pages|containers)
  3. AND constant names suggest different concerns:
     API_*, BACKEND_*, CONTRACT_* vs UI_*, DISPLAY_*, VISIBLE_*
  4. OR annotation: // @quality-exception: config-coupling-risk
     
FLAG_AS_GENUINE_DUPLICATION when:
  - Same constant name AND same layer AND same semantic meaning
  - Abstraction would require importing from same package/library (not cross-boundary)
```

---

### Case 7 — Protocol / Interface Implementations: Required Structural Identity

#### Why duplication is correct

This is a pattern from your own codebase. Look at `packages/angular/src/forms/`:

```typescript
// text-field.directive.ts (lines 6-19)     packages/angular:src/forms/text-field.directive.ts:6-19
// number-field.directive.ts (lines 6-19)   packages/angular:src/forms/number-field.directive.ts:6-19
```

Both have **identical `providers: []` blocks** registering `NG_VALUE_ACCESSOR` and `NG_VALIDATORS`. This is required by Angular's dependency injection protocol — the `forwardRef` must reference the specific class being decorated. You cannot extract this into a shared function because `forwardRef(() => TextFieldDirective)` must name the specific class. Abstracting it would require either code generation or complex meta-programming.

More broadly: when implementing a protocol (an interface, a framework contract, a wire format), the structure is dictated by the protocol, not by your design choices. Angular form directives, NgRx effects, HTTP interceptors, Route guards — all follow prescribed patterns that will appear similar across many implementations.

#### Example — real pattern from this codebase

```typescript
// text-field.directive.ts
// @quality-exception: protocol-implementation
@Directive({
  selector: 'sl-text-field',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldDirective),  // ← must name THIS class
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextFieldDirective),  // ← must name THIS class
      multi: true
    }
  ]
})
export class TextFieldDirective extends FormControlElementDirective<TextField> {
  // ... validate() is unique per field type
}

// number-field.directive.ts
// @quality-exception: protocol-implementation  
@Directive({
  selector: 'sl-number-field',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberFieldDirective),  // ← must name THIS class
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumberFieldDirective),  // ← must name THIS class
      multi: true
    }
  ]
})
export class NumberFieldDirective extends FormControlElementDirective<NumberField> {
  // ... validate() is unique per field type
}
```

Duplicate? Yes. Avoidable? No — `forwardRef` is self-referential. The `validate()` methods are entirely different business logic. The scaffold is protocol noise.

#### Rule for the AI agent

```
SKIP_DUPLICATION_WARNING when:
  1. Duplicated block is a providers[] array containing NG_VALUE_ACCESSOR and/or NG_VALIDATORS
  2. OR duplicated block contains forwardRef(() => ClassName) patterns
  3. OR duplicated block is an Angular lifecycle hook implementation (ngOnInit, ngOnDestroy)
     following the identical protocol structure
  4. OR duplicated block is an NgRx effects registration, HTTP interceptor pattern,
     or Route guard return structure
  5. OR annotation: // @quality-exception: protocol-implementation
```

---

### Case 8 — Generated / Declarative Code That Must Be Explicit

#### Why duplication is correct

Some code categories are inherently repetitive because the repetition carries semantic weight. Route definitions, NgRx action/reducer/selector triads, and OpenAPI-generated types will always look structurally similar. Extracting the pattern would require a meta-programming approach that makes the code harder to statically analyze, harder to grep, and harder for other tools (NX boundary checker, `ts-prune`, IDE "Find Usages") to process.

```typescript
// routes.ts — intentionally declarative and repetitive
// @quality-exception: declarative-routes
export const ROUTES: Routes = [
  {
    path: 'courses',
    loadComponent: () => import('./pages/courses-page/courses-page.component')
      .then(m => m.CoursesPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'assignments',
    loadComponent: () => import('./pages/assignments-page/assignments-page.component')
      .then(m => m.AssignmentsPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'grades',
    loadComponent: () => import('./pages/grades-page/grades-page.component')
      .then(m => m.GradesPageComponent),
    canActivate: [authGuard]
  }
];
```

Each route entry is 6 lines. 30 routes = 180 lines of duplication by `jscpd`'s metric. This code is **not duplicated** — it is **declarative**. The structure is the same; the semantic content (path, component, guard composition) is different per route.

#### Rule for the AI agent

```
SKIP_DUPLICATION_WARNING when:
  1. File path is *.routes.ts or contains 'routing' in path
  2. OR duplicated block is inside a Routes array, reducers map, or effects class
  3. OR all duplicated lines are configuration object literals (no function calls, no logic)
  4. AND the variation between blocks is the actual values (path, component reference, guard list)
     NOT an identical copy with no variation
  5. OR annotation: // @quality-exception: declarative-config
```

---

## Part 2: Other Quality Rules With Valid Exceptions

---

### Rule A — File Size (S3: ≤ 300 LOC)

**General rule:** Production `.ts` files ≤ 300 lines. From `sdl-quality.md` §7 — WARNING trigger.

**When exceeding is correct:**

| Scenario | Example | Why it's valid |
|----------|---------|----------------|
| **Form mixin** implementing a complex protocol | `form-control-mixin.ts` — 538 lines | A Mixin implementing `ControlValueAccessor + Validator + OnInit + OnDestroy + 6 custom methods` cannot be meaningfully split. Splitting would create import chains and break the cohesion of the single mixin contract. |
| **Complex data-access service** with many typed endpoints | `course-api.service.ts` — 450 lines | A service with 20 typed API methods (one per endpoint) is cohesive — all methods have the same dependency (`HttpClient`) and same concern (HTTP transport). Splitting by resource type creates cross-boundary imports. |
| **Configuration object** or **token map** | `theme-tokens.map.ts` — 600 lines | A lookup table of 200 token mappings is 600 lines. It has 0 cyclomatic complexity. LOC is not the right metric here. |
| **Generated file** | `custom-elements.d.ts` — 2000+ lines | Generated. Never count generated files. |

**How to detect valid exception:**

```
DOWNGRADE_FILE_SIZE_WARNING_TO_NOTE when:
  1. File is a mixin (class name ends in Mixin, file contains "Mixin" in name)
     AND cyclomatic complexity per method is ≤ 8
  2. OR file is a *-api.service.ts, *-http.service.ts
     AND method count * average-method-length ≈ file-length (high method density)
  3. OR file is a *.map.ts, *.constants.ts, *.tokens.ts  
     AND branch_density ≤ 1% (mostly assignments, no logic)
  4. OR file path contains 'generated' or begins with a generation comment

CALCULATE: adjusted_complexity = cyclomatic_per_method_avg × branch_density
  If adjusted_complexity ≤ 2.0 AND file > 300 LOC → VALID_EXCEPTION
  If adjusted_complexity > 2.0 AND file > 300 LOC → GENUINE_VIOLATION
```

**Suggested AI agent approach:**

Use LOC as a *trigger for deeper analysis*, not as a standalone gate. When LOC > 300: check `branch_density`, `method_complexity_avg`, and whether the file has a single cohesive concern. Report as:
- `SIZE_WARNING_JUSTIFIED` — LOC high but complexity low, single concern
- `SIZE_WARNING_GENUINE` — LOC high AND complexity high → split this

---

### Rule B — Cyclomatic Complexity (C1: ≤ 8 per method)

**General rule:** CC ≤ 8 per method, from `QUALITY_METRICS.md §1.1 C1`.

**When exceeding is correct:**

| Scenario | Example | Why it's valid |
|----------|---------|----------------|
| **Exhaustive type narrowing** | `getLocalizedValidationMessage()` in `form-control-mixin.ts` — `if(badInput) / if(patternMismatch) / if(valueMissing) / ...` | ValidityState has 10 boolean properties. Mapping all 10 → localized message requires 10 `if` branches. This is not accidental complexity — the `ValidityState` type IS a 10-branch enumeration. A switch statement would have the same CC. |
| **Finite-state machine dispatch** | A component `#onKeydown()` handler dispatching on `event.key` | Keyboard handlers typically have 6-10 cases (ArrowUp, ArrowDown, Home, End, Enter, Space, Escape, Tab). Each case is a single action. CC = 8 is artificial — the real complexity of the interaction model requires all cases. |
| **Data transformation with multiple formats** | `nativeFormValue` getter in `form-control-mixin.ts` — checks for `null | undefined | File | FormData | string | boolean | number | object` | This is exhaustive type discrimination of a union type. The `FormValue` type has 7 members. CC = 7 is structurally forced by the type system. |
| **Security/validation logic** | Permission checking with role + context + feature-flag conditions | Some security policies are inherently multi-condition. Splitting into sub-predicates can hide the security logic across files and make auditing harder. |

**How to detect valid exception:**

```
DOWNGRADE_COMPLEXITY_WARNING when:
  1. High-CC method is a type narrowing function (uses instanceof, typeof, validity.*, enum checks)
     AND each branch is ≤ 3 lines (mostly return statements)
     → REASON: "Exhaustive type discrimination"
  2. OR high-CC method name matches: *onKey*, *handleKey*, *processKey*, *onKeydown*
     AND branches correspond to keyboard key constants (ArrowUp, Enter, Escape, etc.)
     → REASON: "Keyboard event dispatch — inherent to interaction model"
  3. OR high-CC method maps to an external type with known cardinality:
     (ValidityState → 10 properties) (HttpErrorCode → N codes) (RouteEvent → N types)
     → REASON: "Mapping external enumeration — CC forced by input type"
  4. OR the method has 0 nested branches (all branches at same depth)
     AND each branch body is ≤ 5 lines
     → this is "flat fan-out complexity" not "deep nesting complexity"

TREAT_AS_GENUINE_VIOLATION when:
  - Nested ifs (depth > 2) inside each branch — this is combinatorial complexity
  - Mixed concerns (validation + transformation + side effects) in same branch
  - CC > 12 (absolute ceiling regardless of exception pattern)
```

---

### Rule C — Input Count (S5: ≤ 5 inputs per dumb component)

**General rule:** Presentational components ≤ 5 `input()` signals/`@Input()` decorators.

**When exceeding is correct:**

| Scenario | Example | Why it's valid |
|----------|---------|----------------|
| **Generic display component** | `<app-data-table [columns] [rows] [sortable] [pageable] [selectable] [emptyMessage] [loading]>` — 7 inputs | A data table IS inherently multi-configured. The inputs ARE the component's API. Splitting into multiple components breaks composition and the calling template becomes more complex, not less. |
| **SLDS wrapper component** | An Angular wrapper for an `sl-*` web component passes through all the host's public properties | If `sl-select` has 12 properties, the Angular wrapper needs ≥ 12 inputs for full feature parity. |
| **Configuration object that cannot be split** | `[tableConfig]` would group everything, but TypeScript `strictTemplates` prevents using generic `object` inputs | If the grouped-config pattern requires `any` or loses type safety, keep individual typed inputs. |

**How to detect valid exception:**

```
DOWNGRADE_INPUT_COUNT_WARNING when:
  1. Component name suggests a generic/reusable table, list, or chart:
     (*Table*, *Grid*, *List*, *Chart*, *Tree*)
     AND inputs include data + display config (loading, emptyMessage, pageable)
     → inputs are CONFIGURATION, not BUSINESS LOGIC
  2. OR component is an Angular wrapper for an SLDS web component
     (component selector uses same name as sl-* element)
     AND input count ≈ CEM-declared property count for that element
  3. OR inputs can be grouped as:
     [dataInputs] + [configInputs] + [behaviorInputs]
     AND each group is conceptually cohesive
     AND no single input group has >5 inputs

SUGGEST_REFACTOR when:
  - Input count > 8 AND inputs include callbacks/handlers (should be outputs)
  - Input count > 8 AND inputs can be grouped into a plain config interface
    without losing type safety
  - Input count > 10 (absolute ceiling)
```

---

### Rule D — Smart/Dumb Compliance (A4: No service injection in dumb components)

**General rule:** Presentational components MUST NOT inject services (except utilities). From `QUALITY_METRICS.md §1.3 A4`.

**When injecting a service in a "dumb" component is correct:**

| Scenario | What it looks like | Why it's valid |
|----------|--------------------|----------------|
| **Pure utility services** | `inject(DatePipe)`, `inject(DecimalPipe)`, `inject(TranslatePipe)` | Format/transform utilities with no state and no HTTP. They are deterministic pure functions accessed via DI. Their presence in a component does not constitute a business logic dependency. |
| **Router for navigation-only** | `inject(Router).navigate(...)` in a `UserCardComponent.onCardClick()` | A component that emits navigation as a side effect of user interaction is not a "smart" component. Emitting an `output()` for every navigation intent and bubbling it up to the page creates unnecessary indirection for trivial cases. |
| **Logger/telemetry** | `inject(AnalyticsService).track('card_clicked')` | Observability is cross-cutting infrastructure, not business logic. A "dumb" component tracking interaction events is following SRP for observability, not violating smart/dumb separation. |
| **Feature flags** | `inject(FeatureFlagService).isEnabled('new-card-design')` | Feature flags affect presentation. A presentational component checking whether to render a new design variant is not performing business logic. |
| **SLDS config** | `inject(SLDSConfigService)` for theme/config lookups | Design system configuration is presentation infrastructure. |

**How to detect valid exception:**

```
DOWNGRADE_SERVICE_INJECTION_WARNING when:
  1. Injected service is a pipe (ends in Pipe) or formatter (ends in Formatter, Formatter)
     → pure transform utility, no state
  2. OR injected service is Router AND usage is ONLY router.navigate() or router.createUrlTree()
     → navigation utility, no data fetching or state management
  3. OR injected service name contains: Logger, Analytics, Telemetry, Monitoring, FeatureFlag, Config
     → cross-cutting infrastructure
  4. OR injected service is HttpClient AND component name is *Directive (Angular wrapper, not component)

TREAT_AS_GENUINE_VIOLATION when:
  - Injected service performs HTTP calls (has get/post/put/delete methods)
  - Injected service manages application state (has signals/observables exposing domain state)
  - Component has >1 service injection (cumulative = design smell regardless of individual service type)
```

---

### Rule E — Store Pattern Compliance (A5: Smart components → `*.store.ts`)

**General rule:** Smart components with state must use a `*.store.ts`. From `QUALITY_METRICS.md §1.3 A5`.

**When a dedicated store is WRONG:**

| Scenario | Example | Why it's valid without a store |
|----------|---------|-------------------------------|
| **Ephemeral UI state** | `isDropdownOpen = signal(false)` | Toggle state that doesn't need to survive navigation, doesn't drive URL, and isn't shared is pure UI state. A store for open/close state of a dropdown is overengineering. |
| **Form state managed by Angular Forms** | `FormGroup` with reactive forms | Angular's `FormGroup` IS a store for form state. Creating a `FormStore` that wraps a `FormGroup` adds indirection without benefit. |
| **Single-page leaf route with no sharing** | A static information page that loads one resource and displays it | If the component fetches one resource, displays it, and navigates away — no component shares that state. The resource loading is the entire state. A store adds a file and a DI token for no benefit. |
| **State that is derived from parent** | `@if (user.isAdmin)` — admin state comes from auth store above | Don't create a store for state that is a selector of another store. Use `inject(AuthStore).isAdmin` directly in the smart component template. |

**How to detect valid exception:**

```
ALLOW_INLINE_STATE_WITHOUT_STORE when:
  1. Component has ≤ 2 signals that represent UI state (not domain state):
     - Open/close, loading spinner, active tab, collapsed/expanded
     → REASON: "Ephemeral UI state — store overhead not justified"
  2. OR component is a leaf route with a single data dependency:
     - One resource fetch, displayed locally, not shared with siblings/parents
     → REASON: "Single-fetch leaf — store pattern adds indirection without benefit"
  3. OR all component state is derived from a parent store via injection:
     - Component injects AuthStore, SettingsStore etc. and derives display state via computed()
     → REASON: "State is already in stores — component is a derived view"
  4. OR annotation: // @quality-exception: no-store-ephemeral-state

REQUIRE_STORE when:
  - Component has ≥ 3 signals representing domain state
  - OR state must survive route navigation (shared in module or app level)
  - OR same state is accessed by multiple components (sibling or parent-child)
  - OR state requires loading/error handling (async resource pattern)
```

---

### Rule F — Observable Handling (ANG5: `takeUntilDestroyed` or async pipe)

**General rule:** Every `.subscribe()` in a component must be guarded. From `QUALITY_METRICS.md §1.8 ANG5`.

**When manual subscription is correct:**

```typescript
// @quality-exception: subscribe-one-shot
// This subscription fires once on init and self-completes.
// takeUntilDestroyed would be misleading — there's nothing to unsubscribe from.
ngOnInit(): void {
  this.#route.queryParams.pipe(
    take(1),          // ← self-completing: no leak possible
    map(params => params['page'] ?? 1)
  ).subscribe(page => this.loadPage(page));
}
```

```typescript
// @quality-exception: subscribe-imperative-action
// This subscription is triggered by a user action and must execute an imperative side effect.
// async pipe cannot trigger navigation. toSignal() cannot handle router.navigate().
onSubmit(): void {
  this.#authService.login(this.form.value).pipe(
    take(1)
  ).subscribe({
    next: () => this.#router.navigate(['/dashboard']),
    error: err => this.handleError(err)
  });
}
```

#### Rule for the AI agent

```
SKIP_SUBSCRIPTION_WARNING when:
  1. Observable chain includes take(1) OR first() OR single()
     → self-completing; no leak possible
  2. OR subscription is inside an event handler (on*, handle*) AND wraps take(1)
     → imperative action, can't use async pipe
  3. OR subscription is inside ngOnInit AND resolves a one-time initialization value
     AND chain includes take(1)
     
TREAT_AS_GENUINE_VIOLATION when:
  - .subscribe() with no take(1)/first() AND no takeUntilDestroyed()
  - .subscribe() in a component that implements OnDestroy but doesn't unsubscribe
```

---

### Rule G — `any` Type Zero Tolerance

**General rule:** ZERO `any` in production code. BLOCKER from `sdl-quality.md §1.1`.

**When `any` is the least-evil option:**

This is one of the very few rules where the threshold should be almost never exceeded — but "almost" acknowledges real cases:

| Scenario | Pattern | Why |
|----------|---------|-----|
| **Third-party library type holes** | `(window as any).someVendorLib.init()` | Vendor library has no TypeScript types and can't be typed in the project scope. |
| **Truly polymorphic discriminated union escape hatch** | Internal adapter code receiving unknown server responses before validation | A Zod schema input is `unknown`, output is typed. The `any` lives only in the adapter boundary. |
| **Legacy code bridge during migration** | Adapter layer between old JS modules and new TS code | Temporary, annotated, tracked by ticket. |

```typescript
// @quality-exception: any-third-party-untyped
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const vendorSDK = (window as any).__VendorSDK;
// Tracking: vendor types request → #vendor-types-4892
```

#### Rule for the AI agent

```
DOWNGRADE_ANY_BLOCKER_TO_WARNING when ALL of the following:
  1. // eslint-disable-next-line @typescript-eslint/no-explicit-any is present on previous line
  2. AND // @quality-exception: any-{reason} annotation is present
  3. AND valid reason is one of: any-third-party-untyped, any-legacy-bridge, any-unsafe-adapter
  4. AND there is a tracking ticket reference in a nearby comment
  5. AND the `any` usage is isolated (not in a function that returns `any` or propagates it)

KEEP_AS_BLOCKER when:
  - No eslint-disable comment
  - No exception annotation  
  - `any` appears in a return type, input type, or interface definition
  - `any` is used more than once in the same file without distinct reasons
```

---

### Rule H — Zero `throw` in Domain Code

**General rule:** No `throw` in domain/application services. BLOCKER from `sdl-quality.md §1.3`.

**When `throw` is correct:**

| Scenario | Example | Why |
|----------|---------|-----|
| **Angular DI guards** | Constructor asserting required injection | Angular itself throws in guards; following the same pattern for custom injection guards is idiomatic. |
| **Programmer errors** (not runtime errors) | `if (!this.#formControlElement) throw new Error('must call setFormControlElement first')` — from `form-control-mixin.ts:193` | Throwing on incorrect API usage (programming error) during development is correct. It will never fire in correctly written production code. |
| **Abstract method stub** | `throw new Error('Not implemented')` in abstract base | Framework-required pattern. |

```typescript
// form-control-mixin.ts:188-193
get formControlElement(): FormControlElement {
  if (this.#formControlElement) {
    return this.#formControlElement;
  } else {
    // @quality-exception: throw-programmer-error
    // This throw guards incorrect API usage (missing setFormControlElement() call).
    // It is a development-time programmer error, not a runtime/domain error.
    // The Result<T,E> pattern does not apply to programming errors.
    throw new Error('A formControlElement must be set for the FormControlMixin to work');
  }
}
```

#### Rule for the AI agent

```
DOWNGRADE_THROW_BLOCKER_TO_WARNING when:
  1. throw is inside an abstract getter or method (programmer-error guard)
  2. OR throw message contains "must be", "should be", "not implemented", "abstract"
     → these are programmer-error guards, not domain errors
  3. OR // @quality-exception: throw-programmer-error annotation is present

KEEP_AS_BLOCKER when:
  - throw is in a service method handling user-facing operations
  - throw is in an HTTP response handler
  - throw contains business rule error messages (not API contract violations)
```

---

## Part 3: Exception Detection Strategy

### 3.1 The Exception Classification System

A quality exception has three valid origins. The AI agent must distinguish them:

```
EXCEPTION ORIGIN TAXONOMY:
  TYPE-1: STRUCTURAL — The code structure forces the pattern
          (protocol implementation, forwardRef, generated code)
          Detection: static analysis alone sufficient
          Action: auto-suppress warning
          
  TYPE-2: ARCHITECTURAL — A design decision forces the pattern
          (bounded context, component variant, config coupling)
          Detection: path analysis + annotation
          Action: suppress warning, note in report
          
  TYPE-3: TEMPORAL — A transient state during evolution
          (migration, parallel implementation, technical debt)
          Detection: annotation + ticket reference required
          Action: suppress warning, track expiry, escalate if stale
```

---

### 3.2 Annotation System

Every valid exception should be annotatable. The annotation is the **explicit declaration of intent** — it transforms an accidental pattern into a deliberate decision.

#### Annotation vocabulary

```typescript
// ─────────────────────────────────────────────────────────────────
// @quality-exception: EXCEPTION_TYPE
// REASON: human-readable explanation
// TRACKING: issue/ticket reference (required for TYPE-3 temporal)
// EXPIRES: sprint or date (required for TYPE-3 temporal)
// ─────────────────────────────────────────────────────────────────

// Examples from the taxonomy:

// TYPE-1: Structural (no ticket required)
// @quality-exception: protocol-implementation
// REASON: forwardRef requires self-reference — cannot be extracted

// TYPE-2: Architectural (no expiry required)
// @quality-exception: bounded-context
// REASON: Admin and Profile contexts must evolve independently

// @quality-exception: component-variant
// REASON: AdminUserCard and PublicUserCard have different permission models

// @quality-exception: config-coupling-risk
// REASON: API_PAGE_SIZE is a backend contract; VISIBLE_PAGE_SIZE is UX decision

// TYPE-3: Temporal (ticket + expiry required)
// @quality-exception: migration-parallel
// TRACKING: #4521 — Signal input migration sprint
// EXPIRES: Sprint 24.3
```

#### In HTML templates

```html
<!-- @quality-exception: template-structural -->
<!-- REASON: sl-form-field scaffold repeated across features — abstraction needs >3 inputs -->
<sl-form-field>
  <sl-label>Email</sl-label>
  <sl-text-field name="email" type="email"></sl-text-field>
</sl-form-field>
```

#### In SCSS

```scss
/* @quality-exception: hardcoded-border */
/* REASON: 1px border is a zero-value reset, not a design token value */
border: 1px solid var(--sl-color-border-plain);
```

---

### 3.3 Auto-Detection Heuristics (No Annotation Required)

These can be detected purely by static analysis — no annotation needed:

```
AUTO_DETECT_EXCEPTION table:

RULE M1 (Duplication):
  Auto-suppress if:
    - All duplicated lines are in *.spec.ts / *.test.ts
    - OR duplicated block is providers[] with NG_VALUE_ACCESSOR
    - OR duplicated block is forwardRef(() => ClassName) pattern
    - OR duplicated block is Routes[] array entries (config objects)
    - OR duplicated block is inside different NX library boundaries
    
RULE S3 (File Size):
  Auto-suppress if:
    - File path contains 'generated' OR file starts with generation comment
    - OR file is *.constants.ts / *.map.ts with branch_density < 1%
    - OR file is *-mixin.ts with avg CC per method < 5
    
RULE C1 (Cyclomatic Complexity):
  Auto-suppress if:
    - Method is type narrowing (uses instanceof/typeof/validity.*)
      AND all branches are ≤ 3 lines each
    - OR method name matches *onKey* and branches are keyboard constants
    
RULE S5 (Input Count):
  Auto-suppress if:
    - Component name contains Table, Grid, List, Tree, Chart
    - OR component selector matches an sl-* element
    
RULE A4 (Smart/Dumb):
  Auto-suppress if:
    - Injected service name ends in Pipe, Formatter
    - OR injected service is Router with only navigate() usage
    - OR injected service name contains Logger, Analytics, FeatureFlag
    
RULE ANG7 (No throw):
  Auto-suppress if:
    - throw is inside an abstract getter (no concrete implementation)
    - OR throw message is "not implemented" or "must call ... first"
```

---

### 3.4 Exception Scoring Policy

**Critical design question:** Should exceptions count against the score?

The answer depends on exception type:

```
SCORING POLICY:

TYPE-1 (Structural):
  → EXCLUDE from duplication ratio calculation
  → RATIONALE: Protocol noise inflates the metric artificially.
               Counting it penalizes correct patterns.
  → EXAMPLE: forwardRef blocks in Angular form directives

TYPE-2 (Architectural):
  → EXCLUDE from duplication ratio calculation
  → BUT INCLUDE in architectural commentary
  → RATIONALE: The decision is deliberate. Penalizing it discourages
               good DDD. But it should be visible in the report.
  → EXAMPLE: Bounded context models

TYPE-3 (Temporal):
  → INCLUDE at 50% weight for the first sprint
  → INCLUDE at 100% weight if EXPIRES date is passed
  → RATIONALE: Migration debt is real debt. It should create
               pressure to complete the migration on schedule.
  → EXAMPLE: @Input() → signal migration parallel implementations

Unannotated duplication that matches AUTO_DETECT_EXCEPTION:
  → EXCLUDE from score
  → ADD NOTE in quality report: "N lines auto-suppressed (protocol/structural)"
  → If suppressed lines > 5% of total → ADD WARNING: "High structural duplication ratio"

Unannotated duplication that DOESN'T match any exception heuristic:
  → COUNT at full weight
  → ADD to repair loop
```

---

### 3.5 Exception Registry and Governance

For enterprise teams, exceptions should be centrally registered, not scattered in code comments. Propose an `exceptions.json` at the project root (managed by the AI agent automatically):

```json
{
  "schema": "1.0",
  "project": "sl-design-system-angular-generated",
  "exceptions": [
    {
      "id": "exc-001",
      "type": "TYPE-2",
      "rule": "M1-duplication",
      "pattern": "bounded-context",
      "paths": [
        "libs/feature-admin/src/models/user.model.ts",
        "libs/feature-profile/src/models/user.model.ts"
      ],
      "reason": "Admin and Profile bounded contexts must remain independent.",
      "registeredAt": "2024-11-01",
      "registeredBy": "ai-agent-v3",
      "approvedBy": "architecture-team",
      "expiresAt": null
    },
    {
      "id": "exc-002",
      "type": "TYPE-3",
      "rule": "M1-duplication",
      "pattern": "migration-parallel",
      "paths": [
        "libs/shared/ui/src/components/user-card/user-card.component.ts"
      ],
      "reason": "Signal input migration. Legacy @Input() kept for backward compat.",
      "trackingIssue": "#4521",
      "registeredAt": "2024-11-15",
      "registeredBy": "ai-agent-v3",
      "expiresAt": "2025-01-31",
      "status": "active"
    }
  ],
  "staleExceptions": []
}
```

The AI agent's quality runner should:
1. Before scoring: load `exceptions.json`
2. Mark TYPE-3 exceptions as `stale` if `expiresAt` < today
3. Stale exceptions → full weight AND escalation to human reviewer
4. Auto-register new TYPE-1 exceptions detected heuristically
5. Require human approval (via PR review) for TYPE-2 exceptions

---

### 3.6 Decision Tree for the AI Quality Agent

```
FOR EACH quality violation detected:

┌─────────────────────────────────────────────────────────────────┐
│ 1. CHECK exceptions.json registry                                │
│    → Found matching exception? → Apply scoring policy for type  │
│    → Not found? → continue                                      │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. CHECK inline annotation (// @quality-exception: ...)         │
│    → Found with valid type? → Register in exceptions.json       │
│                              → Apply scoring policy for type    │
│    → Found with invalid type? → COUNT AS VIOLATION              │
│                                 → "Unknown exception type"      │
│    → Not found? → continue                                      │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. RUN AUTO_DETECT_EXCEPTION heuristics                         │
│    → Match found? → EXCLUDE from score                          │
│                  → ADD to report as "auto-suppressed"           │
│    → No match? → continue                                       │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. APPLY FULL RULE                                              │
│    → Count violation at 100% weight                             │
│    → Add to repair loop                                         │
│    → Report as: GENUINE_VIOLATION                               │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.7 Quality Report Format for Exceptions

In `quality_report_${SPRINT}.md`, the agent should document exceptions explicitly:

```markdown
## Exception Summary

### Auto-Suppressed (Structural/Protocol — TYPE-1): 47 lines
| Rule | File | Lines | Reason |
|------|------|-------|--------|
| M1-duplication | forms/text-field.directive.ts | 6-19 | forwardRef protocol pattern |
| M1-duplication | forms/number-field.directive.ts | 6-19 | forwardRef protocol pattern |
| M1-duplication | courses-page.routes.ts | 12-67 | Route declarative config |

### Annotated Exceptions (Architectural — TYPE-2): 3 registered
| ID | Rule | Files | Reason | Approved |
|----|------|-------|--------|----------|
| exc-001 | M1-duplication | admin/user + profile/user | Bounded context | Yes |
| exc-003 | S3-file-size | form-control-mixin.ts | Protocol mixin cohesion | Yes |
| exc-005 | C1-complexity | getLocalizedValidationMessage | Exhaustive ValidityState map | Yes |

### Active Temporal Exceptions (Migration — TYPE-3): 1 active
| ID | Rule | File | Ticket | Expires | Days Remaining |
|----|------|------|--------|---------|----------------|
| exc-002 | M1-duplication | user-card.component.ts | #4521 | 2025-01-31 | 62 |

### Stale Exceptions (ESCALATE): 0
```

---

## Summary: Master Exception Reference Card

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ QUICK REFERENCE: When to Skip Quality Warnings                                 │
├────────────────────────────────┬───────────────────────────────────────────────┤
│ M1: Duplication                │ Skip when:                                    │
│                                │  • *.spec.ts / *.test.ts files               │
│                                │  • Different NX library paths                 │
│                                │  • forwardRef() provider blocks               │
│                                │  • Routes[] declarative config                │
│                                │  • @quality-exception: bounded-context        │
│                                │  • @quality-exception: component-variant      │
│                                │  • @quality-exception: protocol-implementation│
│                                │  • @quality-exception: config-coupling-risk   │
│                                │  • @quality-exception: template-structural    │
│                                │  • @quality-exception: migration-parallel +   │
│                                │    ticket reference                           │
├────────────────────────────────┼───────────────────────────────────────────────┤
│ S3: File > 300 LOC             │ Skip when:                                    │
│                                │  • *-mixin.ts AND avg CC ≤ 5                 │
│                                │  • *.constants.ts / *.map.ts AND density < 1%│
│                                │  • Generated files                            │
├────────────────────────────────┼───────────────────────────────────────────────┤
│ C1: Cyclomatic Complexity > 8  │ Skip when:                                    │
│                                │  • Exhaustive type narrowing (each branch ≤3L)│
│                                │  • *onKey* keyboard dispatch                  │
│                                │  • Mapping external enum (ValidityState etc.) │
├────────────────────────────────┼───────────────────────────────────────────────┤
│ S5: Input Count > 5            │ Skip when:                                    │
│                                │  • *Table* *Grid* *List* *Tree* *Chart*       │
│                                │  • Angular wrappers for sl-* elements         │
├────────────────────────────────┼───────────────────────────────────────────────┤
│ A4: Service in dumb component  │ Skip when:                                    │
│                                │  • *Pipe, *Formatter (pure transform)         │
│                                │  • Router (navigate only)                     │
│                                │  • *Logger *Analytics *FeatureFlag *Config    │
├────────────────────────────────┼───────────────────────────────────────────────┤
│ A5: Store pattern required     │ Skip when:                                    │
│                                │  • ≤ 2 ephemeral UI signals (open/loading)    │
│                                │  • Leaf route, single fetch, not shared       │
│                                │  • State is derived from parent store         │
├────────────────────────────────┼───────────────────────────────────────────────┤
│ ANG7: throw in domain code     │ Skip when:                                    │
│                                │  • Abstract getter / "not implemented"        │
│                                │  • Programmer-error guard (API misuse)        │
├────────────────────────────────┼───────────────────────────────────────────────┤
│ T1: any type usage             │ Downgrade to WARNING only when:               │
│                                │  • eslint-disable + @quality-exception        │
│                                │  • + valid reason + tracking ticket           │
│                                │  • + any not in return/interface types        │
└────────────────────────────────┴───────────────────────────────────────────────┘
```

---

## Citations from Codebase

All examples and structural patterns in this document are grounded in the actual repository:

- `packages/angular:src/forms/text-field.directive.ts:6-19` — structural `forwardRef` duplication
- `packages/angular:src/forms/number-field.directive.ts:6-19` — identical protocol scaffold
- `packages/angular:src/forms/form-control-element.directive.ts:1-80` — shared base eliminating real duplication
- `packages/components/form:src/form-control-mixin.ts:97-538` — 538-line mixin validating the LOC exception
- `packages/components/form:src/form-control-mixin.ts:445-471` — `getLocalizedValidationMessage()` validating CC exception
- `packages/components/form:src/form-control-mixin.ts:188-194` — `throw` programmer-error guard
- `packages/components/select:src/select.ts:63-66` — ObserveAttributesMixin + FormControlMixin + ScopedElementsMixin nesting
- `agents/QUALITY_GROUPS.md` — scoring model (Group 5: Duplication ≤ 2%)
- `agents/QUALITY_METRICS.md:26-174` — all metric thresholds referenced
- `agents/sdl-quality.md:19-43` — BLOCKER vs WARNING classification