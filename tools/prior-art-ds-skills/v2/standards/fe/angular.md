# Angular — mapowanie zestawu reguł na konkretny stack

Ten plik tłumaczy generyczne reguły zestawu (./README.md — indeks) na idiomatyczny, nowoczesny Angular. Reguły generyczne obowiązują w całości; tutaj rozpisujemy wyłącznie to, co w Angularze realizuje się **inaczej, niż podpowiada domyślna intuicja**, oraz podejmujemy decyzje narzędziowe, które zestaw generyczny celowo zostawia otwarte.

**Założony stack bazowy:** Angular 19/20+, standalone components (bez NgModules), signals, nowy control flow (`@if`/`@for`/`@switch`/`@defer`), zoneless change detection, typowane Reactive Forms, `inject()` zamiast constructor injection.

> **Uwaga o wersjach (ważne):** API wymienione niżej (`httpResource`, `resource`, `linkedSignal`, `provideZonelessChangeDetection`, adapter TanStack Query dla Angulara) były w momencie pisania na różnych etapach stabilności (część oznaczona jako experimental/developer preview). **Na dzień startu projektu zweryfikuj aktualny status i sygnatury w oficjalnej dokumentacji** — i zapisz wynik jako ADR (zob. ARCH-8 w ./architecture.md). Reguły poniżej są od tego niezależne: zmienia się co najwyżej nazwa funkcji, nie kierunek decyzji.

---

## NG-1. Fundament aplikacji: standalone + zoneless + OnPush wszędzie

**Reguła.** Cała aplikacja jest standalone (zero NgModules), z zoneless change detection od pierwszego commita i `ChangeDetectionStrategy.OnPush` wymuszonym lintem na każdym komponencie. Stan, od którego zależy widok, wyrażaj sygnałami — nie mutowanymi polami klasy.

**Dlaczego.** Zoneless + signals to model, w którym change detection jest konsekwencją jawnych zależności, a nie magii przechwytywania zdarzeń. Dołożenie tego później wymaga audytu każdego komponentu, który polega na niejawnym odświeżaniu po mutacji pola — czyli klasycznego kosztownego refactoru przekrojowego (por. ./refactoring.md, REF-7: zmiany mechaniczne osobno). Start od zera jest tani; migracja nigdy.

**Przykład.**

```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // zweryfikuj nazwę w wersji na dzień startu
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, apiErrorInterceptor])),
  ],
};
```

```ts
// ŹLE — mutowane pole, działa tylko dzięki zone.js:
export class InvoiceListComponent {
  invoices: IInvoice[] = [];
  refresh() { this.invoices.push(newInvoice); } // zoneless: widok się nie odświeży
}

// DOBRZE — sygnał, jawna zmiana referencji:
export class InvoiceListComponent {
  readonly invoices = signal<IInvoice[]>([]);
  refresh() { this.invoices.update((list) => [...list, newInvoice]); }
}
```

**Wyjątki.** Integracja z biblioteką third-party wymagającą zone.js — odizoluj ją w jednym adapterze i odnotuj w ADR; nie rezygnuj z zoneless globalnie z powodu jednej zależności.

---

## NG-2. Granice modułów: Nx z `enforce-module-boundaries` albo Sheriff — ale zawsze maszynowo

**Reguła.** Macierz warstw i kierunek zależności z ./architecture.md (ARCH-1, ARCH-2) egzekwuj narzędziem od pierwszego dnia. Domyślny wybór: **Nx workspace** z tagami `type:*`/`scope:*` i regułą `@nx/enforce-module-boundaries` jako error. Jeśli zespół świadomie nie chce Nx (mała aplikacja, jeden zespół, niechęć do narzutu monorepo), użyj **Sheriff** (`@softarc/sheriff-core`) — daje tagi i reguły zależności na zwykłych katalogach, bez generatorów i cache builda.

**Dlaczego.** Granica bez reguły egzekwowanej narzędziem jest fikcją — to fundament całego zestawu. Angular sam z siebie nie pilnuje żadnych granic importów; standalone components wręcz ułatwiają import czegokolwiek skądkolwiek.

**Przykład.** Tagi Nx dla domeny „faktury":

```jsonc
// libs/invoicing/feature-invoice-list/project.json
{ "tags": ["scope:invoicing", "type:feature"] }
// libs/invoicing/data-access-invoice/project.json
{ "tags": ["scope:invoicing", "type:data-access"] }
```

```js
// eslint.config — fragment macierzy (pełna macierz: ./architecture.md, ARCH-2)
'@nx/enforce-module-boundaries': ['error', {
  depConstraints: [
    { sourceTag: 'type:feature',
      onlyDependOnLibsWithTags: ['type:ui', 'type:data-access', 'type:util'] },
    { sourceTag: 'type:ui',
      onlyDependOnLibsWithTags: ['type:ui', 'type:util'] },
    { sourceTag: 'type:data-access',
      onlyDependOnLibsWithTags: ['type:util'] },
    { sourceTag: 'scope:invoicing',
      onlyDependOnLibsWithTags: ['scope:invoicing', 'scope:shared'] },
  ],
}],
```

Wariant Sheriff (bez Nx): `sheriff.config.ts` z `tagging` per katalog `src/app/domains/*` i analogicznym `depRules` — semantyka ta sama, decyduje koszt narzędzia, nie siła gwarancji.

**Wyjątki.** Brak. Jedyny dopuszczalny jawny wyjątek w macierzy: pliki stories/testów mogą importować warstwę `type:mock` (zob. NG-16 i ARCH-7 w ./architecture.md).

---

## NG-3. Lazy loading i kompozycja routingu po stronie aplikacji

**Reguła.** Każda domena/feature wchodzi do routera przez `loadChildren`/`loadComponent` z publicznego indeksu liba; plik tras aplikacji jest jedynym miejscem sklejania infrastruktury z domenami (inwersja zależności — ARCH-5 w ./architecture.md). Parametry tras wstrzykuj przez `withComponentInputBinding()` — komponent feature'a dostaje parametr jako `input()`, nie grzebie w `ActivatedRoute` w głębi drzewa (COMP-10 w ./components.md). Guardy i wybór layoutu to odpowiedzialność definicji tras, nie ekranów.

**Przykład.**

```ts
// apps/web/src/app/app.routes.ts — jedyne miejsce kompozycji
export const routes: Routes = [
  {
    path: 'projects',
    canActivate: [authGuard],
    loadChildren: () => import('@org/projects/feature-shell').then((m) => m.projectRoutes),
  },
];

// libs/projects/feature-project-details/.../project-details.component.ts
export class ProjectDetailsComponent {
  // withComponentInputBinding: parametr trasy ląduje prosto w input()
  readonly projectId = input.required<string>();
}
```

**Wyjątki.** Trywialna aplikacja z 2–3 ekranami może mieć trasy eager — ale struktura „feature wystawia swoje trasy, aplikacja skleja" zostaje, bo to ona umożliwia późniejsze lazy.

---

## NG-4. Warstwa danych: cache zapytań — rekomendacja i alternatywy

**Reguła.** Stan serwera trzymaj w dedykowanym cache zapytań (./data-and-state.md — stan serwera vs UI). W Angularze rekomendacja brzmi: **adapter TanStack Query dla Angulara** (`@tanstack/angular-query-*` — zweryfikuj aktualną nazwę pakietu i status stabilności na dzień startu). Alternatywy oceniane i odrzucone jako domyślne:

| Opcja | Ocena |
|---|---|
| **TanStack Query (adapter Angular)** | **Rekomendacja.** Kompletny model: klucze hierarchiczne, inwalidacja, staleTime, retry, stany `isPending/isError`, mutacje z cyklem życia. Reguły zestawu (inwalidacja kaskadowa, polityki świeżości, blokada double-submit) mapują się 1:1. Ryzyko: status stabilności adaptera — sprawdź; sam rdzeń biblioteki jest dojrzały i framework-agnostic. |
| **`httpResource` / `resource` API** | Wbudowane, sygnałowe, ale (na moment pisania) eksperymentalne i **bez warstwy cache między komponentami, bez inwalidacji i bez mutacji** — pokrywa „pobierz i pokaż", nie pokrywa „unieważnij listę, licznik i historię po zapisie". Dobre jako mechanizm transportu pod własną cienką fasadą, nie jako pełna warstwa danych. |
| **Serwisy + RxJS + `shareReplay`** | Ręcznie budowany cache zapytań to dokładnie ścieżka, przed którą ostrzega projekt referencyjny: zespół najpierw pisze pół biblioteki cache, potem ją miesiącami migruje. Odrzucone jako domyślne; RxJS zostaje tam, gdzie jest niezastąpiony (strumienie zdarzeń, websockety, debounce wejścia). |

**Dlaczego.** Server-state ≠ client-state: świeżość, deduplikacja, inwalidacja i retry to problemy, których nie należy reimplementować. Wybór zapisz jako ADR z odrzuconymi alternatywami.

**Przykład.** Fabryki kluczy i zapytanie (klucze per zasób — zob. ./data-and-state.md, fabryki kontraktów):

```ts
// libs/invoicing/data-access-invoice/src/lib/invoice.keys.ts
export const invoiceKeys = {
  all: ['invoices'] as const,
  list: (filters: IInvoiceFilters) => [...invoiceKeys.all, 'list', filters] as const,
  detail: (id: string) => [...invoiceKeys.all, 'detail', id] as const,
};

// invoice-list.query.ts
export function injectInvoiceList(filters: Signal<IInvoiceFilters>) {
  const api = inject(InvoiceApiService);
  return injectQuery(() => ({
    queryKey: invoiceKeys.list(filters()),
    queryFn: () => api.getInvoices(filters()),
    staleTime: QUERY_STALE_TIME.REFERENCE_DATA, // polityki w jednym słowniku
  }));
}
```

Mutacja z kaskadą inwalidacji (po zapisie unieważnij wszystkie dane pochodne):

```ts
export function injectApproveInvoice() {
  const api = inject(InvoiceApiService);
  const queryClient = inject(QueryClient);
  return injectMutation(() => ({
    mutationFn: (id: string) => api.approve(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all }); // listy, liczniki, historia
    },
  }));
}
```

**Wyjątki.** Jeśli na dzień startu adapter okaże się niedojrzały, dopuszczalny plan B: `resource`/`httpResource` + własna, świadomie minimalna fasada inwalidacji — ale decyzję i jej granice (czego fasada NIE robi) spisz w ADR.

---

## NG-5. Jedna brama I/O: serwis API + walidacja runtime schematem

**Reguła.** Każda odpowiedź HTTP przechodzi przez parse schematem runtime (np. zod) w serwisie API — fail-fast na granicy, reszta aplikacji widzi wyłącznie typ wyprowadzony ze schematu (`z.infer`). Tam też dzieje się mapowanie konwencji nazewniczych (snake→camel — jeśli ADR tak rozstrzygnął) i normalizacja typów. Komponenty i query-fabryki nigdy nie dotykają surowego `HttpClient`.

**Przykład.**

```ts
// invoice.schema.ts
export const invoiceSchema = z
  .object({
    id: z.number().transform(String),       // normalizacja: ID zawsze string
    client_name: z.string(),
    issued_at: z.iso.datetime(),             // data zostaje ISO stringiem (zob. ./data-and-state.md)
  })
  .transform((raw) => ({
    id: raw.id,
    clientName: raw.client_name,             // nudne, jawne, grep-owalne mapowanie
    issuedAt: raw.issued_at,
  }));
export type TInvoice = z.infer<typeof invoiceSchema>;

// invoice-api.service.ts
@Injectable({ providedIn: 'root' })
export class InvoiceApiService {
  private readonly http = inject(HttpClient);

  getInvoice(id: string): Promise<TInvoice> {
    return firstValueFrom(
      this.http.get(INVOICE_PATHS.detail(id)).pipe(map((res) => invoiceSchema.parse(res))),
    );
  }
}
```

`parse` rzuca przy złamanym kontrakcie → błąd ląduje w stanie `error` zapytania, nie w renderze zepsutych danych. ŹLE: `this.http.get<IInvoice>(...)` — rzutowanie typu bez walidacji to obietnica bez pokrycia.

**Wyjątki.** Endpointy o ekstremalnych payloadach (dziesiątki tysięcy rekordów) mogą walidować próbkując/lazy — decyzja jawna, z komentarzem przy schemacie.

---

## NG-6. Cross-cutting transportu: funkcyjne interceptory

**Reguła.** Auth, korekty URL, nagłówki, telemetria i konwersja błędów transportowych żyją w łańcuchu funkcyjnych `HttpInterceptorFn` rejestrowanych w `provideHttpClient(withInterceptors([...]))` — niewidocznym dla feature'ów. Feature woła zawsze serwis API; nigdy nie dokleja nagłówków ani nie łapie surowych `HttpErrorResponse` u siebie.

**Przykład.** Interceptor konwertujący błędy transportowe na klasy domenowe (ERR-3 w ./errors.md):

```ts
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 422 && isValidationErrorBody(err.error)) {
          return throwError(() => new ApiValidationError(err.error.errors));
        }
        if (err.status === 404) return throwError(() => new NotFoundError(req.url));
      }
      return throwError(() => err);
    }),
  );
```

**Wyjątki.** Pojedynczy endpoint o odmiennym kontrakcie (upload pliku, zewnętrzne API) — dedykowany `HttpContext`-token wyłączający dany interceptor, nie obejście przez drugiego klienta HTTP.

---

## NG-7. Trzy adresy stanu widoku — wydanie sygnałowe

**Reguła.** Jak w ./data-and-state.md: stan semantyczny widoku → **URL** (queryParams), preferencje prezentacji → **storage**, reszta → **lokalny `signal` możliwie nisko**. Stan serwera → cache zapytań (NG-4) — nigdy serwis-singleton z `BehaviorSubject` jako „store na dane z API". Derywacje wyrażaj `computed`; `effect` traktuj jako wyjście awaryjne do synchronizacji ze światem zewnętrznym (DOM, storage), nie jako mechanizm przepływu danych.

**Przykład.** Filtr listy zadań w URL, czytany jako sygnał:

```ts
export class TaskListComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly statusFilter = toSignal(
    this.route.queryParamMap.pipe(map((p) => parseStatusFilter(p.get('status')))),
    { initialValue: 'all' as const },
  );

  setFilter(status: TTaskStatusFilter): void {
    this.router.navigate([], {
      queryParams: { status: status === 'all' ? null : status },
      queryParamsHandling: 'merge',
    });
  }
}
```

ŹLE: `readonly statusFilter = signal('all')` dla filtra, który użytkownik chce zalinkować/odświeżyć — refresh i „wstecz" gubią stan. Stany wzajemnie wykluczające się modeluj unią dyskryminowaną w jednym sygnale, nie kilkoma booleanami:

```ts
type TDialogState =
  | { kind: 'closed' }
  | { kind: 'confirm-delete'; taskId: string }
  | { kind: 'reassign'; taskId: string };
readonly dialog = signal<TDialogState>({ kind: 'closed' });
```

**Wyjątki.** Stan wrażliwy (tokeny, dane osobowe) nigdy w URL.

---

## NG-8. Smart/presentational: `input()`/`output()`/`model()` i zero wstrzykiwania w komponentach prezentacyjnych

**Reguła.** Komponent prezentacyjny: wyłącznie `input()`/`output()`/`model()`, zero `inject()` serwisów danych, routera i stanu aplikacji; renderuje i emituje semantyczne zdarzenia. Komponent smart (root sekcji/strony): wstrzykuje query/mutacje, podejmuje decyzje, podaje w dół minimalny kontrakt (COMP-1, COMP-2, COMP-8 w ./components.md). Dwukierunkowe wiązanie prostych wartości UI — `model()`, nie para input+output pisana ręcznie.

**Przykład.**

```ts
// ŹLE — „prezentacyjny" komponent wstrzykuje pół aplikacji:
export class TaskRowComponent {
  private readonly api = inject(TaskApiService);     // mutacja w prezentacji
  private readonly router = inject(Router);          // zna URL-e
}

// DOBRZE:
@Component({ selector: 'app-task-row', changeDetection: ChangeDetectionStrategy.OnPush, ... })
export class TaskRowComponent {
  readonly task = input.required<TTask>();
  readonly disabled = input(false);
  readonly accepted = output<string>();   // semantyczne zdarzenie, nie "click"
  readonly expanded = model(false);       // dwukierunkowy stan UI
}
```

**Wyjątki.** Wstrzykiwanie czysto prezentacyjnych zależności (np. serwisu formatowania dat z warstwy utils) w komponencie prezentacyjnym jest legalne — granicą jest I/O i stan aplikacji, nie samo `inject()`.

---

## NG-9. Kompozycja zamiast flag: `ng-content`, dyrektywy-sloty i kontekst rodzica przez DI

**Reguła.** Warianty zachowań wyrażaj kompozycją (COMP-5 w ./components.md). W Angularze: sloty przez `ng-content select`, „render prop" przez `ng-template` + `TemplateRef`, a wzorzec compound-component przez **opcjonalne wstrzyknięcie rodzica**: dziecko robi `inject(ParentComponent, { optional: true })` i degraduje się do trybu standalone, gdy rodzica brak. Komponent współdzielony nigdy nie wstrzykuje serwisów/kontekstów feature'a — bind robi cienki adapter po stronie feature'a, komponent dostaje wartości inputami.

**Przykład.** Grupa akordeonów harmonogramu zespołu:

```ts
@Component({ selector: 'ui-accordion-group', ... })
export class AccordionGroupComponent {
  private readonly openId = signal<string | null>(null);
  isOpen(id: string) { return this.openId() === id; }
  toggle(id: string) { this.openId.update((cur) => (cur === id ? null : id)); }
}

@Component({ selector: 'ui-accordion-item', ... })
export class AccordionItemComponent {
  readonly itemId = input.required<string>();
  private readonly group = inject(AccordionGroupComponent, { optional: true });
  private readonly localOpen = signal(false); // tryb standalone
  readonly open = computed(() =>
    this.group ? this.group.isOpen(this.itemId()) : this.localOpen(),
  );
}
```

ŹLE: `<ui-accordion [grouped]="true" [items]="..." [openId]="..." (openIdChange)="...">` — monolit z flagami rośnie wykładniczo. Antywzorzec „introspekcja dzieci" (rodzic czytający stan dzieci przez `ContentChildren` + rzutowania na konkretne klasy w poszukiwaniu danych domenowych) ma to samo rozwiązanie: dziecko rejestruje się u rodzica przez DI, albo rodzic dostaje listę id inputem.

**Wyjątki.** Jedna binarna opcja czysto prezentacyjna może zostać inputem.

---

## NG-10. Cztery stany widoku w nowym control flow; mutacja w toku blokuje akcje

**Reguła.** Macierz loading/error/empty/success (ERR-1 w ./errors.md) wyrażaj płaską kaskadą `@if/@else if/@else` w szablonie — kolejność: loading → error → empty → success. Błąd odświeżenia przy istniejących danych nie zrzuca widoku do error-state (ERR-5). Mutacja w toku blokuje **wszystkie** akcje na zasobie, nie tylko klikany przycisk; `@defer` stosuj do ciężkich, niekrytycznych sekcji.

**Przykład.**

```html
@if (invoicesQuery.isPending()) {
  <app-invoice-list-skeleton data-testid="invoice-list-loading" />
} @else if (invoicesQuery.isError() && !invoicesQuery.data()) {
  <app-error-state data-testid="invoice-list-error"
    [message]="invoicesQuery.error() | errorMessage" (retry)="invoicesQuery.refetch()" />
} @else if (invoicesQuery.data()!.length === 0) {
  <app-empty-state data-testid="invoice-list-empty"
    [headline]="'INVOICES.EMPTY.HEADLINE' | transloco" />
} @else {
  @for (invoice of invoicesQuery.data(); track invoice.id) {
    <app-invoice-row [invoice]="invoice" [disabled]="approveMutation.isPending()" />
  }
}
```

`track` w `@for` jest obowiązkowy i kompilator go wymusza — to angularowy odpowiednik stabilizacji tożsamości elementów listy (COMP-9). Brakujący stan jest w tej strukturze widoczny gołym okiem na review — to celowe.

**Wyjątki.** Lista osadzona w sekcji, która już obsłużyła loading/error, obsługuje tylko empty/success.

---

## NG-11. Formularze: typowane Reactive Forms + pięć artefaktów

**Reguła.** Wyłącznie Reactive Forms, zawsze typowane i `nonNullable` tam, gdzie pole ma default. Pięć artefaktów formularza (FORM-1 w ./forms.md) w wydaniu angularowym: **(1)** schema walidacji runtime (fabryka parametryzowana funkcją tłumaczeń), **(2)** defaults, **(3)** transformer form→API, **(4)** reverse-transformer API→form, **(5)** zamiast hooka — **wstrzykiwalna fabryka/serwis formularza** z jawnym interfejsem zwrotnym, orkiestrująca grupę, submit i mapowanie błędów. Komponenty pól są głupie: dostają `FormControl`/`FormGroup` i nie znają transformacji ani API. Jeden kanał danych: zagnieżdżone sekcje dostają swój `FormGroup` inputem albo przez `ControlContainer` — nigdy ten sam control równolegle dwiema drogami (FORM-2).

**Przykład.** Szkielet `use-case'u` „utwórz fakturę":

```ts
// invoice-create.form.ts — typ + defaults
export interface IInvoiceCreateForm {
  clientId: FormControl<string>;
  dueDate: FormControl<string>;        // ISO string aż do prezentacji
  items: FormArray<FormGroup<IInvoiceItemForm>>;
}
export function buildInvoiceCreateForm(fb: NonNullableFormBuilder): FormGroup<IInvoiceCreateForm> {
  return fb.group<IInvoiceCreateForm>({
    clientId: fb.control(''),
    dueDate: fb.control(defaultDueDate()),
    items: fb.array<FormGroup<IInvoiceItemForm>>([]),
  });
}

// invoice-create.form-store.ts — artefakt nr 5 (odpowiednik hooka orkiestrującego)
@Injectable()
export class InvoiceCreateFormStore {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly form = buildInvoiceCreateForm(this.fb);
  private readonly createMutation = injectCreateInvoice();
  readonly isSubmitting = computed(() => this.createMutation.isPending());

  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    try {
      await this.createMutation.mutateAsync(toCreateInvoicePayload(this.form.getRawValue()));
    } catch (e) {
      if (e instanceof ApiValidationError) {
        applyServerErrors(this.form, e.errors, INVOICE_CREATE_FIELD_MAP);
      } else { throw e; }
    }
  }
}
```

Serwis jest providowany **na komponencie feature'a** (`providers: [InvoiceCreateFormStore]`), więc żyje i umiera z formularzem — to angularowy odpowiednik kolokacji stanu.

**Wyjątki.** Pojedyncze pole wyszukiwania nie potrzebuje pięciu artefaktów — ale potrzebuje ich każdy formularz z submitem do API.

---

## NG-12. Błędy 422 na pola: mapa per use-case + `setErrors`

**Reguła.** Błędy walidacji serwera mapuj deklaratywną, typowaną mapą ścieżek API→ścieżki formularza, osobną per use-case (FORM-3 w ./forms.md, NAME-4 w ./architecture.md); generyczny helper ustawia `setErrors({ server: ... })` na kontrolce, a nieprzemapowane komunikaty zbiera i pokazuje zbiorczo — nigdy nie gubi.

**Przykład.**

```ts
// invoice-create.field-map.ts — whitelist ścieżek TEGO formularza
export const INVOICE_CREATE_FIELD_MAP = {
  client_id: 'clientId',
  due_date: 'dueDate',
} as const satisfies Record<string, TInvoiceCreateFormPath>;

// apply-server-errors.ts — generyczny, współdzielony
export function applyServerErrors(
  form: FormGroup, errors: IApiFieldError[], map: Record<string, string>,
): string[] {
  const unmapped: string[] = [];
  for (const err of errors) {
    const path = map[err.field];
    const control = path ? form.get(path) : null;
    if (control) control.setErrors({ ...control.errors, server: err.message });
    else unmapped.push(err.message);
  }
  return unmapped; // pokaż zbiorczo, np. nad przyciskiem submit
}
```

Studium z projektu referencyjnego, z którego wyprowadzono te reguły: generyczny toast „Coś poszło nie tak" połykał szczegóły 422, a mapa pól skopiowana z formularza tworzenia do edycji mapowała błędy na nieistniejące pola. Stąd dwa twarde wymagania: mapa per use-case i kanał dla nieprzemapowanych komunikatów.

**Wyjątki.** Brak.

---

## NG-13. Style: komponentowy SCSS + CSS custom properties jako tokeny

**Reguła.** Tokeny design systemu to **CSS custom properties** definiowane w jednym miejscu (`styles/tokens.scss` na `:root`); komponenty mają własny SCSS (domyślna enkapsulacja emulowana) i konsumują wyłącznie `var(--ds-*)` — zero surowych hexów, px-ów odstępów i magicznych wartości (STYLE-1, STYLE-2 w ./styling.md). `ViewEncapsulation.None` tylko w warstwie theme/design-system, nigdy w feature'ach. `::ng-deep` zakazany lintem; do stylowania wnętrza komponentów DS służą ich własne tokeny/`@mixin`-y.

**Przykład.**

```scss
/* styles/tokens.scss — jedyne źródło wartości wizualnych */
:root {
  --ds-color-primary: #3355cc;        /* hex legalny TYLKO tutaj */
  --ds-spacing-2: 0.5rem;
  --ds-spacing-4: 1rem;
  --ds-radius-md: 8px;
}
```

```scss
/* ŹLE — task-card.component.scss */
.card { padding: 16px; background: #e6ecff; border-radius: 8px; }

/* DOBRZE */
.card {
  padding: var(--ds-spacing-4);
  background: var(--ds-color-surface-highlight);
  border-radius: var(--ds-radius-md);
}
```

**Angular Material vs własny DS — kryteria (decyzja = ADR):** bierz Material, gdy zespół jest mały, design nie jest silnie brandowany, a a11y „za darmo" (focus trap, role, klawiatura w overlay/dialog) ma wysoką wartość — i wtedy themuj wyłącznie przez oficjalne API tokenów (system M3), nie przez nadpisywanie wewnętrznych klas. Buduj własny DS, gdy design odbiega od Materiala na tyle, że walka z nadpisaniami kosztuje więcej niż budowa — ale wtedy **CDK zostaje**: `@angular/cdk` (overlay, focus-trap, a11y, drag-drop) to warstwa, której nie opłaca się pisać samemu niemal nigdy. Hybryda (CDK + własne komponenty na tokenach) jest najczęściej trafnym środkiem.

**Wyjątki.** Jednorazowy, trywialny styl strukturalny (np. `display: flex` kontenera) nie wymaga tokenu — token musi nieść semantykę, nie zastępować każdej liczby.

---

## NG-14. i18n: Transloco zamiast `$localize` przy runtime language switch

**Reguła.** Jeśli wymaganiem jest zmiana języka w runtime (lub wartości tłumaczeń z API), wybierz **Transloco** (ew. inną bibliotekę runtime — decyzja w ADR). Wbudowane i18n (`$localize`/atrybut `i18n`) kompiluje tłumaczenia do osobnych buildów per locale — zmiana języka oznacza przeładowanie aplikacji z innego bundla; wybieraj je tylko, gdy języków jest mało, są statyczne, a SEO/rozmiar bundla są priorytetem. Reszta reguł i18n bez zmian (./conventions-and-tooling.md): eksternalizacja od dnia zero, klucze hierarchiczne, pary `.SUCCESS`/`.ERROR` dla mutacji, klucze komunikatów walidacji w schemach.

**Przykład.** Schema-fabryka z tłumaczeniami (komunikaty jako klucze, nie gotowe stringi):

```ts
export function createProjectFormSchema(t: TranslocoService) {
  return z.object({
    name: z.string().min(1, t.translate('PROJECT.FORM.ERRORS.NAME_REQUIRED')),
  });
}
```

Klucz z konwencji zamiast ręcznej mapy status→klucz:

```ts
const KNOWN = ['DRAFT', 'ACTIVE', 'ARCHIVED'] as const;
export function taskStatusKey(status: string): string {
  return (KNOWN as readonly string[]).includes(status)
    ? `TASK.STATUS.${status}` : 'TASK.STATUS.UNKNOWN';
}
```

**Wyjątki.** Aplikacja jednojęzyczna na zawsze (rzadkie i zwykle nieprawdziwe założenie) — eksternalizacja kluczy i tak obowiązuje, bo to także spójność copy i tani refactor komunikatów.

---

## NG-15. Globalna obsługa błędów: `ErrorHandler` + klasy domenowe + dispatch po typie

**Reguła.** Trzy piętra: **(1)** interceptor konwertuje transport na klasy domenowe (NG-6), **(2)** kod feature'owy dispatchuje po typie wyjątku (`instanceof`), nigdy po kodzie HTTP, **(3)** własny globalny `ErrorHandler` łapie wszystko nieobsłużone: loguje przez produkcyjny logger (sanityzacja PII, batching — ERR-8 w ./errors.md) i pokazuje generyczny komunikat. Klasy błędów zawsze z ustawionym `name`; `console.log` w handlerach zakazany lintem.

**Przykład.**

```ts
export class ApiValidationError extends Error {
  override readonly name = 'ApiValidationError';
  constructor(readonly errors: IApiFieldError[]) { super('Validation failed'); }
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(AppLogger);
  private readonly toast = inject(ToastService);
  handleError(error: unknown): void {
    this.logger.error(error);                       // PII-safe, z batchingiem
    this.toast.error('COMMON.ERRORS.UNEXPECTED');   // użytkownik nigdy nie widzi ciszy
  }
}
// app.config.ts: { provide: ErrorHandler, useClass: GlobalErrorHandler }
```

Globalny handler to siatka bezpieczeństwa, nie strategia: każda mutacja nadal ma własny, jawny feedback sukces/błąd (ERR-2) — `mutateAsync` bez `catch` wykrywa reguła lintera (NG-17).

**Wyjątki.** Brak dla pięter 1 i 3; piętro 2 bywa zbędne, gdy feedback w całości obsługuje warstwa mutacji.

---

## NG-16. Testy: testing-library + harnessy + MSW + Storybook

**Reguła.** Piramida: **unit** (Vitest/Jest) dla czystych funkcji — transformery, schematy, mappery błędów, utils dat (TEST-6 w ./testing.md); **komponentowe/integracyjne** przez `@testing-library/angular` (zapytania po roli/tekście, nie po klasach CSS), z **component harnesses** (`@angular/cdk/testing`) do interakcji z komponentami Material/CDK i własnymi komponentami DS (napisz harness razem z komponentem DS); **scenariuszowe** jako stories Storybooka dla Angulara z funkcjami `play` i wariantami per rola. Sieć we wszystkich poziomach integracyjnych mockuje **MSW** — handlery behawioralne (filtrowanie/sort/paginacja/delay na wspólnych danych bazowych), fabryki stanów brzegowych, spójne ID między ekranami (TEST-2…4). Test-idy z jednej biblioteki helperów, jako stałe per feature, używane też w stanach błędów (TEST-1, ERR-7).

**Przykład.**

```ts
// test-idy: jeden helper, hierarchiczne stałe
export const INVOICE_LIST_TEST_IDS = createFeatureTestIds('invoice-list', {
  row: 'row', emptyState: 'empty', errorState: 'error', retryButton: 'retry',
});

// komponent: <button [attr.data-testid]="testIds.retryButton">

// test (@testing-library/angular):
it('po błędzie pokazuje retry i ponawia zapytanie', async () => {
  server.use(invoiceHandlers.listError());           // fabryka stanu brzegowego (MSW)
  await render(InvoiceListComponent, { providers: testProviders() });
  await screen.findByTestId(INVOICE_LIST_TEST_IDS.errorState);
  server.use(invoiceHandlers.list());                // świat wraca do zdrowia
  await userEvent.click(screen.getByTestId(INVOICE_LIST_TEST_IDS.retryButton));
  expect(await screen.findAllByTestId(INVOICE_LIST_TEST_IDS.row)).not.toHaveLength(0);
});
```

Angularowa pułapka, której nie ma w innych stackach: w testach zoneless/OnPush nie polegaj na ręcznym `fixture.detectChanges()` rozsianym po teście — testing-library i harnessy stabilizują widok same; jeśli test wymaga ręcznego pompowania CD, to zwykle sygnał, że komponent mutuje stan poza sygnałami (złamane NG-1).

**Wyjątki.** Czyste funkcje nie potrzebują TestBed w ogóle — i to jest pożądane (testowalność przez wynoszenie logiki z komponentów).

---

## NG-17. Lint: angular-eslint + reguły szablonów + własne reguły

**Reguła.** Każda konwencja wyrażalna statycznie idzie do ESLint jako **error** (warning eroduje — zob. ./conventions-and-tooling.md). Minimum angularowe ponad zestaw generyczny:

- `@angular-eslint/prefer-on-push-component-change-detection` — error (NG-1),
- `@angular-eslint/prefer-standalone`, zakaz NgModules w nowym kodzie,
- prefiksy selektorów per scope (`app-`, `ui-`) — `component-selector`/`directive-selector`,
- szablony: komplet reguł `@angular-eslint/template/*` dla a11y (alt-text, click-events-have-key-events, interactive-supports-focus, label-has-associated-control…) — error,
- zakaz `::ng-deep` i `ViewEncapsulation.None` poza warstwą theme (no-restricted-syntax),
- granice modułów: `@nx/enforce-module-boundaries` albo Sheriff (NG-2),
- nazewnictwo plików kebab-case z sufiksami ról (`.component.ts`, `.service.ts`, `.schema.ts`, `.keys.ts`, `.field-map.ts`…) — zob. NAME-1 w ./architecture.md,
- własne reguły dla API gubiących błędy (np. `mutateAsync` bez obsługi odrzucenia) — zaczynaj od taniego zakazu składniowego, inwestuj w analizę zakresu, gdy pojawią się false positives; komunikat reguły mówi, **co zrobić**, nie tylko co jest źle.

**Przykład.** Studium z projektu referencyjnego: reguła wykrywająca niezłapane odrzucenia mutacji powstała jako prosty zakaz składniowy, generowała fałszywe alarmy, została przepisana na pełną analizę zakresu — ale pozostawiona na severity `warn` przestała blokować cokolwiek i była ignorowana. Wniosek wpisany tu na stałe: docelowe severity to zawsze `error`.

**Wyjątki.** Reguła generująca false positives, której nie umiesz jeszcze doprecyzować — lepiej wyłączyć całkiem niż trzymać jako warning uczący ignorowania lintera.

---

## NG-18. Rejestry i inwersja zależności: `InjectionToken` + exhaustive `Record`

**Reguła.** Gdy infrastruktura i domena wzajemnie się potrzebują (ARCH-5 w ./architecture.md), w Angularze punktem rejestracji jest typowany `InjectionToken` (często z `multi: true`), a kompletność map wariantów pilnuje `satisfies Record<TUnion, ...>` — brak wpisu = błąd kompilacji, nie cichy fallback.

**Przykład.** Renderery typów pozycji na osi czasu projektu:

```ts
export type TTimelineEntryKind = 'milestone' | 'task' | 'invoice';

export const TIMELINE_ENTRY_COMPONENTS = {
  milestone: MilestoneEntryComponent,
  task: TaskEntryComponent,
  invoice: InvoiceEntryComponent,
} as const satisfies Record<TTimelineEntryKind, Type<unknown>>;
// dodanie 'meeting' do unii bez wpisu w mapie → błąd kompilacji
```

```html
<ng-container *ngComponentOutlet="components[entry().kind]; inputs: { entry: entry() }" />
```

**Wyjątki.** 2–3 warianty bez perspektywy wzrostu — zwykły `@switch` w szablonie wystarczy (a `@switch` po unii z wyczerpaniem gałęzi też jest formą exhaustive-check na review).

---

## Skrót decyzyjny (TL;DR dla startu projektu)

| Obszar | Decyzja domyślna | Gdzie szczegóły |
|---|---|---|
| Fundament | standalone + zoneless + OnPush + signals | NG-1 |
| Granice | Nx + enforce-module-boundaries (alt.: Sheriff) | NG-2, ./architecture.md |
| Routing | lazy per domena, `withComponentInputBinding`, kompozycja w app | NG-3 |
| Dane z serwera | TanStack Query (adapter Angular); zod na granicy; interceptory | NG-4…6, ./data-and-state.md |
| Stan UI | sygnały lokalnie; filtry w URL; preferencje w storage | NG-7 |
| Komponenty | smart/presentational, `input()/output()/model()`, kompozycja przez DI | NG-8, NG-9, ./components.md |
| Widoki | 4 stany w `@if`-kaskadzie, `track` w `@for` | NG-10, ./errors.md |
| Formularze | typowane Reactive Forms + 5 artefaktów + field-mapy 422 | NG-11, NG-12, ./forms.md |
| Style | SCSS + CSS custom properties; Material/CDK wg kryteriów | NG-13, ./styling.md |
| i18n | Transloco (runtime switch) | NG-14 |
| Błędy | interceptor → klasy domenowe → globalny ErrorHandler | NG-15, ./errors.md |
| Testy | testing-library + harnessy + MSW + Storybook | NG-16, ./testing.md |
| Lint | angular-eslint + template a11y + własne reguły, wszystko error | NG-17 |
| Rejestry | InjectionToken + exhaustive Record | NG-18 |

Checklist startowy nowego projektu (kolejność wdrażania dnia zero): ./checklist.md. Antywzorce, których ten stack nie unieważnia: ./antipatterns.md.
