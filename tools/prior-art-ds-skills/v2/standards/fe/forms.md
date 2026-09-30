# Formularze i walidacja

Reguły dla formularzy: struktura artefaktów, przepływ danych, mapowanie błędów serwera, reużycie modelu między wariantami cyklu życia encji. Snippety są w TypeScript jako framework-neutralny pseudokod (`schema.*` oznacza dowolną bibliotekę walidacji schematem runtime, `TFormApi` — dowolny mechanizm formularzy); mapowanie na konkretny stack: ./angular.md. Feedback mutacji i macierz stanów widoku: ./errors.md. Blokada double-submit i inwalidacja cache po zapisie: ./data-and-state.md.

---

## FORM-1. Formularz = pięć artefaktów

**Reguła.** Każdy nietrywialny formularz składa się z pięciu osobnych, nazwanych artefaktów: (1) schema walidacji jako **fabryka** przyjmująca funkcję tłumaczeń i kontekst (np. uprawnienia), (2) wartości domyślne, (3) transformer form→API, (4) reverse-transformer API→form, (5) hook/serwis orkiestrujący z jawnie otypowanym interfejsem zwrotnym. Komponenty pól są głupie: nie znają transformacji, payloadów ani API.

**Dlaczego.** Każdy artefakt ma inny powód do zmiany (reguła walidacji ≠ kształt payloadu ≠ logika submitu) i inny sposób testowania (transformery to czyste funkcje — tanie unit testy, patrz ./testing.md). Schema jako fabryka — bo komunikaty walidacji to klucze i18n rozwiązywane w runtime (./conventions-and-tooling.md), a reguły bywają warunkowe względem kontekstu (uprawnienia, rola). Wciśnięcie wszystkiego w komponent daje god-component nie do przetestowania (./antipatterns.md).

**Przykład.** Struktura katalogu formularza tworzenia faktury:

```
invoice-create/
  form/
    form.schema.ts               # fabryka schemy + typ wartości formularza
    form.defaults.ts             # INVOICE_CREATE_FORM_DEFAULT_VALUES
    form.transformer.ts          # transformFormToPayload(values): TInvoiceCreateRequest
    form.reverse-transformer.ts  # transformInvoiceToFormValues(detail): TInvoiceFormValues
    use-invoice-form.hook.ts     # orkiestracja: submit, błędy serwera, nawigacja
  sections/
    client-section/
    items-section/
    summary-section/
```

```ts
// form.schema.ts — fabryka z tłumaczeniami i kontekstem
interface IInvoiceFormSchemaOptions {
  readonly t: TTranslateFn;
  readonly isDiscountAllowed: boolean; // reguła zależna od uprawnień
}

export const createInvoiceFormSchema = ({ t, isDiscountAllowed }: IInvoiceFormSchemaOptions) =>
  schema.object({
    clientId: schema.string().min(1, t('INVOICES.CREATE.VALIDATION.CLIENT_REQUIRED')),
    issueDate: schema.date({ message: t('INVOICES.CREATE.VALIDATION.ISSUE_DATE_REQUIRED') }),
    currency: schema.enum(CURRENCY),
    items: schema.array(invoiceItemSchema).min(1, t('INVOICES.CREATE.VALIDATION.ITEM_REQUIRED')),
    discountPercent: isDiscountAllowed
      ? schema.number().max(50, t('INVOICES.CREATE.VALIDATION.DISCOUNT_MAX'))
      : schema.custom<never>((v) => v === undefined),
    notes: schema.string(),
  });

export type TInvoiceFormValues = InferType<ReturnType<typeof createInvoiceFormSchema>>;
```

```ts
// form.transformer.ts — jawne mapowanie pole-po-polu, parametry addytywnie
export const transformFormToPayload = (values: TInvoiceFormValues): TInvoiceCreateRequest => ({
  client_id: values.clientId,
  issue_date: formatDateForApi(values.issueDate),
  currency: values.currency,
  items: values.items.map(itemToPayload),
  ...(values.discountPercent !== undefined && { discount_percent: values.discountPercent }),
  notes: values.notes || undefined,
});
```

```ts
// use-invoice-form.hook.ts — jawny, niemutowalny interfejs zwrotny
interface IUseInvoiceFormReturn {
  readonly form: TFormApi<TInvoiceFormValues>;
  readonly isSubmitting: boolean;
  readonly hasUnmappedErrors: boolean;
  readonly submitForm: () => void;
  readonly clearUnmappedErrors: () => void;
  readonly goBack: () => void;
}
```

Hook zwraca semantyczne akcje (`submitForm`), nie surowe settery stanu; komponenty sekcji renderują pola i wołają akcje — nic więcej.

**Wyjątki.** Formularz trywialny (1–2 pola, brak transformacji, np. pole wyszukiwania, zmiana nazwy) nie potrzebuje pięciu plików — wystarczy schema + inline submit. Pięć artefaktów to próg dla formularzy z payloadem do API i ≥3 polami.

---

## FORM-2. Jeden kanał danych formularza

**Reguła.** Jeśli formularz wystawia kontekst/provider, sekcje konsumują go w swoich hookach. Zakaz równoległego przekazywania propsami tego, co już jest w kontekście formularza (uchwyt formularza, błędy, wartości).

**Dlaczego.** Dwa kanały dla tych samych danych to dwie wersje prawdy: prop drilling przez warstwy pośredników, które danych nie używają, oraz ryzyko przekazania uchwytu innej instancji formularza niż ta w kontekście — błąd niewidoczny w typach, widoczny dopiero jako „walidacja nie działa w jednej sekcji".

**Przykład.**

```ts
// ŹLE — provider istnieje, a control/errors i tak wędrują propsami przez 3 warstwy
<FormProvider form={form}>
  <ClientSection control={form.control} errors={form.errors} />
  <ItemsSection control={form.control} errors={form.errors} />
</FormProvider>

// DOBRZE — sekcja sama sięga do kontekstu w swoim hooku
const useClientSection = () => {
  const { control, errors } = useFormContext<TInvoiceFormValues>();
  return { control, clientError: errors.clientId };
};
<FormProvider form={form}>
  <ClientSection />
  <ItemsSection />
</FormProvider>
```

W projekcie referencyjnym, z którego wyprowadzono te reguły, formularz wieloetapowy przekazywał `control`/`errors` propsami **obok** istniejącego providera — refactor na konsumpcję kontekstu w hookach sekcji usunął kilkanaście propsów z drzewa i odsłonił sekcje, które tych danych w ogóle nie potrzebowały.

**Wyjątki.** Komponent **współdzielony między feature'ami** (z biblioteki UI) nie konsumuje kontekstu formularza aplikacji — dostaje wartości i callbacki propsami, a cienki adapter po stronie feature robi bind (szczegóły: ./components.md — odcięcie komponentów współdzielonych od aplikacji). Próg: kontekst formularza ma sens od ~2 poziomów zagnieżdżenia; płaski formularz może podawać uchwyt wprost.

---

## FORM-3. Błędy walidacji serwera mapuj na pola deklaratywną mapą z whitelistą

**Reguła.** Każdy use-case formularza ma własny plik field-map: typowaną unię ścieżek formularza + mapę ścieżka-API→ścieżka-formularza, kolokowany z mutacją. Generyczny handler ustawia błędy per-pole wyłącznie dla ścieżek z whitelisty; wszystko nieprzemapowane (nieznane pole, pole niezamontowane, błąd globalny) zbiera do osobnej listy i **pokazuje** — nigdy nie gubi.

**Dlaczego.** Backend zwraca błędy walidacji w ścieżkach swojego kontraktu; bez jawnej mapy frontend albo ustawia błąd na nieistniejącym polu (znika bez śladu), albo wyświetla generyczny komunikat zjadający szczegóły. W projekcie referencyjnym generyczny snackbar „Coś poszło nie tak" połykał pełną odpowiedź walidacyjną serwera — użytkownik poprawiał formularz na ślepo; naprawą był właśnie transformer błędów z whitelistą i domenową klasą błędu walidacji (./errors.md — konwersja błędów transportowych na domenowe).

**Przykład.**

```ts
// invoice-create.field-map.ts — typowana unia ścieżek, w tym ścieżki tablicowe
export type TInvoiceCreateFormPath =
  | 'clientId'
  | 'issueDate'
  | 'currency'
  | 'discountPercent'
  | 'items'
  | 'items.*.description'
  | 'items.*.quantity'
  | 'items.*.unitPrice'
  | 'notes';

export const INVOICE_CREATE_FIELD_MAP: Readonly<Record<string, TInvoiceCreateFormPath>> = {
  client_id: 'clientId',
  issue_date: 'issueDate',
  currency: 'currency',
  discount_percent: 'discountPercent',
  items: 'items',
  'items.*.description': 'items.*.description',
  'items.*.quantity': 'items.*.quantity',
  'items.*.unit_price': 'items.*.unitPrice',
  notes: 'notes',
};
```

```ts
// generyczny handler (jeden na aplikację) — kontrakt wyniku wymusza obsługę resztek
interface IApplyServerErrorsResult {
  readonly hasUnmappedErrors: boolean;
  readonly unmappedErrors: readonly string[]; // do pokazania w banerze/alercie formularza
}

const applyServerErrors = <TForm>(options: {
  readonly error: unknown;
  readonly setFieldError: (path: TFormPath<TForm>, message: string) => void;
  readonly fieldMap: Readonly<Record<string, TFormPath<TForm>>>;
  readonly isFieldMounted?: (path: string) => boolean; // pole ukryte warunkowo ≠ pole istniejące
}): IApplyServerErrorsResult => { /* whitelist-only; reszta do unmappedErrors */ };
```

Użycie w hooku formularza (FORM-1):

```ts
catch (error) {
  if (isValidationError(error)) {
    const { hasUnmappedErrors, unmappedErrors } = applyServerErrors({
      error, setFieldError: form.setError, fieldMap: INVOICE_CREATE_FIELD_MAP,
    });
    if (hasUnmappedErrors) showFormAlert(unmappedErrors); // nigdy nie gub
  } else {
    throw error; // nie-walidacyjne błędy idą standardową ścieżką (./errors.md)
  }
}
```

Field-map jest **per use-case**, nawet gdy create i edit wyglądają identycznie. W projekcie referencyjnym stała ścieżek formularza tworzenia została skopiowana do mutacji **edycji** — błędy walidacji edycji mapowały się na pola, których formularz edycji nie miał, i znikały. Naprawą był dedykowany field-map edycji (komplet artefaktów per use-case: ./architecture.md).

**Wyjątki.** Gdy kontrakt API i model formularza są strukturalnie identyczne (rzadkie przy mapowaniu konwencji nazw), handler może przyjąć `pathPrefix` zamiast pełnej mapy — ale lista nieprzemapowanych i tak obowiązuje. Formularz bez walidacji serwerowej (czysto kliencki) field-mapy nie potrzebuje.

---

## FORM-4. Jeden model formularza dla create/duplicate/edit

**Reguła.** Warianty cyklu życia encji (tworzenie, duplikacja, edycja, edycja szkicu) reużywają **jeden** model wartości formularza i jedną schemę; różnią się wyłącznie punktem wejścia — czyli reverse-transformerem dostarczającym wartości początkowe — oraz mutacją na wyjściu. Formularz wynoś do modułu wspólnego dopiero, gdy pojawia się drugi konsument.

**Dlaczego.** Dwa równoległe modele „bo edit ma o jedno pole mniej" rozjeżdżają się przy pierwszej zmianie domeny: nowe pole trafia do create, edit milczy, duplikacja gubi dane. Jeden model + N reverse-transformerów skaluje się liniowo: nowy wariant (np. „utwórz na podstawie szablonu") to jeden nowy reverse-transformer, zero zmian w sekcjach i schemie.

**Przykład.**

```ts
// jeden typ TInvoiceFormValues, trzy punkty wejścia:
const createDefaults  = INVOICE_FORM_DEFAULT_VALUES;                       // create
const duplicateValues = transformInvoiceToFormValues(source, { resetNumber: true }); // duplicate
const editValues      = transformInvoiceToFormValues(invoice);             // edit

// hook orkiestrujący przyjmuje initialValues i nie wie, skąd pochodzą
const { form, submitForm } = useInvoiceForm({
  initialValues: editValues,
  onSubmit: updateInvoice, // mutacja per use-case, field-map per use-case (FORM-3)
});
```

Reverse-transformer odwraca też normalizacje transformera (ISO string → obiekt daty, identyfikatory liczbowe → string), tak by sekcje pól widziały zawsze ten sam kształt — niezależnie czy dane przyszły z defaults, z duplikatu czy z detalu encji.

**Wyjątki.** Gdy warianty różnią się **strukturą i zachowaniem** (np. edycja pozwala zmienić 2 pola z 15 i ma inny przepływ zatwierdzania), to są dwa formularze ze wspólnymi sekcjami-klockami — nie jeden model z flagami `isEditMode` rozsianymi po drzewie (analogiczna zasada dla komponentów: ./components.md). Nie wynoś formularza do shared przy jednym konsumencie „na zapas".

---

## FORM-5. Walidacja formularza to granica wejścia użytkownika — tu reguły biznesowe są na miejscu

**Reguła.** W schemie formularza waliduj reguły domenowe wejścia użytkownika (wymagalność, zakresy, długości, spójność pól między sobą) z komunikatami jako kluczami i18n. Nie myl tej granicy z granicą danych: walidacja odpowiedzi API sprawdza tylko kształt i typy (./data-and-state.md). Frontend waliduje dla UX; serwer pozostaje ostatecznym arbitrem — dlatego obsługa błędów 4xx per-pole (FORM-3) jest obowiązkowa nawet przy pełnej walidacji klienckiej.

**Dlaczego.** Bez walidacji klienckiej każdy błąd kosztuje round-trip i frustrację; bez obsługi błędów serwera walidacja kliencka daje fałszywe poczucie kompletności — serwer zna reguły, których klient znać nie może (unikalność numeru faktury, limity konta).

**Przykład.**

```ts
// spójność między polami — w schemie, nie w komponencie
schema.object({ issueDate: schema.date(), dueDate: schema.date() })
  .refine((v) => v.dueDate >= v.issueDate, {
    path: ['dueDate'],
    message: t('INVOICES.CREATE.VALIDATION.DUE_DATE_BEFORE_ISSUE'),
  });
```

**Wyjątki.** Reguł wymagających danych serwera (unikalność, dostępność zasobu) nie dubluj spekulacyjnie w kliencie — to domena FORM-3; ewentualna walidacja asynchroniczna pojedynczego pola jest dopuszczalna, gdy API wystawia do tego dedykowany, tani endpoint.
