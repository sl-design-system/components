# Testowanie, test-idy, mocki

Zasada nadrzędna działu: testowalność jest driverem architektury, nie czynnością „po kodzie". Selektory, dublery i scenariusze projektuje się razem z feature'em — koszt dodania ich później rośnie liniowo z liczbą komponentów, a luki (najczęściej: nieprzetestowane stany błędów) ujawniają się dopiero jako regresje na produkcji.

Powiązania: warstwa mocków jako osobny moduł z granicą w linterze — ./architecture.md; macierz 4 stanów widoku — ./errors.md; wynoszenie logiki z komponentów — ./components.md; egzekwowanie konwencji narzędziami — ./conventions-and-tooling.md; weryfikacja refactoru — ./refactoring.md.

---

## TEST-1. Selektory testowe to współdzielony kontrakt kod ↔ testy ↔ QA

**Reguła**: Identyfikatory testowe generuj jedną współdzieloną biblioteką helperów, która wymusza spójny format (prefiks feature'a, hierarchiczne człony, lowercase, separator). Każdy feature definiuje jeden obiekt stałych test-idów, konsumowany i przez komponenty, i przez testy, i przez QA. Zero stringów selektorów inline — ani w komponencie, ani w teście.

**Dlaczego**: Selektor wpisany ręcznie w dwóch miejscach to dwie wersje prawdy — rozjeżdżają się po pierwszym rename. Gdy id jest stałą importowaną z jednego modułu, zmiana nazwy jest refactorem narzędziowym (kompilator znajduje wszystkich konsumentów), a QA dostaje kompletny, przeszukiwalny katalog selektorów zamiast grepowania po DOM. Format wymuszony kodem (nie konwencją w README) nie eroduje.

**Przykład** — generator i stałe per feature:

```ts
// shared/test-id/create-test-ids.ts — jedna biblioteka dla całej aplikacji
export const createFeatureTestId =
  (featurePrefix: string) =>
  (...parts: string[]): string =>
    [featurePrefix, ...parts].join('-').toLowerCase();

// wariant dla elementów dynamicznych (wiersze list, opcje selectów)
export const createDynamicTestId =
  (featurePrefix: string, ...baseParts: string[]) =>
  (id: string | number): string =>
    [featurePrefix, ...baseParts, id].join('-').toLowerCase();
```

```ts
// invoice-list.test-ids.ts — jedyne źródło selektorów feature'a
const tid = createFeatureTestId('invoice-list');

export const INVOICE_LIST_TEST_IDS = {
  container: tid('container'),
  header: { title: tid('header', 'title') },
  filterBar: {
    clientSelect: tid('filter-bar', 'client-select'),
    statusSelect: tid('filter-bar', 'status-select'),
  },
  grid: {
    container: tid('grid', 'container'),
    row: createDynamicTestId('invoice-list', 'grid', 'row'), // row('42') → 'invoice-list-grid-row-42'
  },
  // stany niesukcesu też dostają id — patrz ./errors.md
  errorState: { container: tid('error-state'), retryButton: tid('error-state', 'retry-button') },
  emptyState: tid('empty-state'),
} as const;
```

ŹLE: `getByTestId('invoiceList_row42')` w teście i `data-testid="invoice-row-42"` w komponencie — selektor „działał", dopóki ktoś nie poprawił literówki po jednej stronie.
DOBRZE: obie strony importują `INVOICE_LIST_TEST_IDS.grid.row(invoice.id)`.

Uzupełnienia praktyczne: (a) dodaj test jednostkowy unikalności — spłaszcz wszystkie obiekty `*_TEST_IDS` i assertuj brak duplikatów między feature'ami; (b) stany błędów i puste stany mają test-idy obowiązkowo — w projekcie referencyjnym, z którego wyprowadzono te reguły, test-idy error-state'ów dodano dopiero po regresji, w której refactor po cichu skasował widok błędu, a żaden test nie mógł go znaleźć (szczegóły: ./refactoring.md).

**Wyjątki**: Testy czystych funkcji nie potrzebują selektorów. W testach integracyjnych dopuszczalne są zapytania po roli/etykiecie dostępności tam, gdzie testują one właśnie semantykę a11y — ale to uzupełnienie kontraktu test-idów, nie jego zamiennik.

---

## TEST-2. Dublery behawioralne, nie statyczne fixtury

**Reguła**: Mock endpointu symuluje semantykę zależności: czyta parametry żądania i implementuje filtrowanie, sortowanie, paginację oraz realistyczne opóźnienie na wspólnym zbiorze danych bazowych. Statyczny JSON zwracany niezależnie od parametrów jest dublerem tylko z nazwy.

**Dlaczego**: UI list to w większości logika sterowana parametrami zapytania (filtry → klucz cache → refetch → render). Statyczna fixtura testuje wyłącznie „czy komponent renderuje JSON" — nie wykryje, że filtr nie trafia do żądania, że paginacja resetuje się przy zmianie sortowania, ani że spinner nie pojawia się wcale (zerowe opóźnienie maskuje brak stanu loading). Mock behawioralny pozwala testom integracyjnym klikać w prawdziwe scenariusze: „przefiltruj po kliencie, posortuj po kwocie, przejdź na stronę 2".

**Przykład** — behawioralny handler (pseudokod na bazie biblioteki przechwytującej żądania na poziomie sieci):

```ts
// ŹLE — fixture ignoruje żądanie
mockGet('/api/invoices', () => json({ items: THREE_INVOICES, total: 3 }));

// DOBRZE — handler implementuje kontrakt endpointu na wspólnych danych
export const invoiceListHandler = mockGet('/api/invoices', async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const page = Number(params.get('page') ?? '1');
  const limit = Number(params.get('limit') ?? '20');
  const search = params.get('search');
  const clientIds = params.getAll('client_id');
  const sortField = params.get('sort_by');
  const sortDir = params.get('sort_dir');

  let result = [...mockInvoices]; // wspólny świat danych — patrz TEST-4

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (inv) => inv.number.toLowerCase().includes(q) || findClient(inv.clientId)?.name.toLowerCase().includes(q)
    );
  }
  if (clientIds.length > 0) {
    result = result.filter((inv) => clientIds.includes(String(inv.clientId)));
  }

  const sorted = applySorting(result, sortField, sortDir); // reużywalne, czyste utilsy mocka
  const pageData = applyPagination(sorted, page, limit);  // (same mają unit testy — TEST-6)

  await delay(networkDelay()); // konfigurowalne; >0, żeby stan loading był obserwowalny

  return json({ items: pageData.items, total: pageData.total, page, limit });
});
```

Helpery `applySorting`/`applyPagination`/`applyXxxFilters` wydziel jako czyste funkcje współdzielone między handlerami — to one czynią mocki tanimi w utrzymaniu i samymi w sobie testowalnymi.

**Wyjątki**: Endpoint słownikowy bez parametrów (lista statusów, konfiguracja) może zwracać stałą odpowiedź — tam nie ma semantyki do symulowania. Jednorazowa fixtura przy spec-pliku unit testu jest legalna (patrz ./architecture.md o granicy warstwy mocków).

---

## TEST-3. Stany brzegowe jako fabryki handlerów

**Reguła**: Każdy zamockowany zasób wystawia, obok handlera domyślnego, fabryki stanów brzegowych: pusta lista, błąd serwera (z parametryzowalnym statusem), nieskończone ładowanie, błąd walidacji per-pole dla mutacji. Test/scenariusz nadpisuje handler domyślny fabryką — nie buduje odpowiedzi ręcznie.

**Dlaczego**: Macierz 4 stanów (./errors.md) da się pokryć testami tylko wtedy, gdy każdy stan da się tanio wywołać. Jeśli wywołanie stanu „error" wymaga ręcznego sklecenia odpowiedzi w każdym teście, stany niesukcesu po prostu nie są testowane — i znikają niezauważone przy refactorach.

**Przykład**:

```ts
export const createInvoiceListEmptyHandler = () =>
  mockGet('/api/invoices', () => json({ items: [], total: 0, page: 1, limit: 20 }));

export const createInvoiceListErrorHandler = (status = 500) =>
  mockGet('/api/invoices', () => json({ error: 'Internal server error' }, { status }));

export const createInvoiceListLoadingHandler = () =>
  mockGet('/api/invoices', async () => { await delay('infinite'); });

// mutacja: błąd walidacji per-pole — żeby przetestować mapowanie na formularz (./forms.md)
export const createInvoiceCreateValidationErrorHandler = () =>
  mockPost('/api/invoices', () =>
    json(
      { error: 'Validation Error', details: { client_id: ['This field is required.'], due_date: ['Date must be in the future.'] } },
      { status: 422 }
    )
  );
```

Macierz do pokrycia fabrykami per zasób: empty / error / loading / sukces z brakującymi polami opcjonalnymi (null-e i undefined są osobnym stanem brzegowym!) / odpowiedzi specyficzne per rola.

**Wyjątki**: Stanu „loading infinite" nie ma sensu wystawiać dla mutacji typu fire-and-forget; fabryk błędów nie potrzebują endpointy, których błąd jest obsługiwany identycznie jak innego zasobu w tym samym widoku — ale to musi być świadoma decyzja, nie przeoczenie.

---

## TEST-4. Spójny świat danych między ekranami

**Reguła**: Dane bazowe mocków to jeden współdzielony, wewnętrznie spójny zbiór: to samo ID faktury działa na liście, w detalu, w historii i w licznikach; relacje (faktura → klient, zadanie → przypisany użytkownik) wskazują na istniejące rekordy. Handlery różnych endpointów czytają z tego samego źródła, nie z prywatnych kopii.

**Dlaczego**: Scenariusz integracyjny „kliknij wiersz na liście → zobacz detal → cofnij" wymaga, by detal znał ID z listy. Przy rozłącznych fixturach każdy taki test kończy się na 404 albo — gorzej — przechodzi na danych, które nie mogłyby współistnieć, maskując bugi w nawigacji i inwalidacji cache. Spójny świat pozwala też mockom mutacji faktycznie modyfikować stan (utworzona faktura pojawia się na liście), co czyni testowalnymi kaskady odświeżeń.

**Przykład** — mini-studium: w projekcie referencyjnym dane bazowe żyją w plikach `*.data.ts` (rekordy domenowe z relacjami przez ID), a handlery listy, detalu i liczników statusów liczą odpowiedzi z tego samego zbioru. Dzięki temu jeden scenariusz przechodzi przez trzy ekrany bez specjalnych przygotowań, a licznik „12 zaległych" na dashboardzie zgadza się z liczbą wierszy po przefiltrowaniu listy — rozjazd między nimi byłby bugiem mocka, który test by ujawnił, a nie cechą fixtur, którą trzeba obchodzić.

**Wyjątki**: Test jednostkowy czystej funkcji może mieć własne minimalne dane wejściowe przy spec-pliku — świat współdzielony obowiązuje warstwę mocków endpointów, nie każdy literał w testach.

---

## TEST-5. Testy integracyjne na żywych scenariuszach per rola

**Reguła**: Główne pokrycie feature'a to testy integracyjne odgrywające scenariusze użytkownika (render widoku + interakcje + asercje na UI) na mockach behawioralnych, z deklaratywnie ustawianym kontekstem: rola/uprawnienia użytkownika, stan routera, zestaw handlerów. Każdy wariant uprawnień, który zmienia widok lub dostępne akcje, ma własny scenariusz. Duże feature'y tnij na pliki scenariuszy tematycznie (lista / filtry / akcje / stany błędów), nie jeden plik-kobyłę.

**Dlaczego**: Logika frontendu materializuje się na przecięciu: dane × rola × stan routera × stan cache. Unit testy nie widzą tych przecięć, a testowanie ról „przy okazji" jednym scenariuszem admina zostawia ścieżki pozostałych ról martwe — to tam żyją bugi typu „użytkownik bez uprawnienia widzi przycisk, który zwraca 403". Deklaratywny setup (parametry zamiast imperatywnego boilerplate'u) sprawia, że dodanie wariantu roli kosztuje kilka linii, więc faktycznie się go dodaje.

**Przykład** — szkic scenariusza (pseudokod frameworka testów komponentowych):

```ts
// invoice-list.accountant.scenario — rola z pełnymi akcjami
scenario('accountant filters and opens invoice', {
  context: { user: userWith(ROLE.ACCOUNTANT), route: '/invoices', handlers: defaultHandlers },
  play: async ({ screen, user }) => {
    await user.click(screen.getByTestId(IDS.filterBar.clientSelect));
    await user.click(screen.getByTestId(IDS.filterBar.clientOption('acme')));
    await user.click(screen.getByTestId(IDS.grid.row('42')));
    await expect(screen.getByTestId(INVOICE_DETAIL_TEST_IDS.container)).toBeVisible(); // świat spójny: TEST-4
  },
});

// invoice-list.viewer.scenario — rola tylko-do-odczytu: asercja na NIEOBECNOŚĆ akcji
scenario('viewer cannot create invoice', {
  context: { user: userWith(ROLE.VIEWER), route: '/invoices', handlers: defaultHandlers },
  play: async ({ screen }) => {
    await expect(screen.queryByTestId(IDS.filterBar.createButton)).not.toBeInTheDocument();
  },
});

// invoice-list.error.scenario — fabryka stanu brzegowego z TEST-3
scenario('shows retry on load failure', {
  context: { user: userWith(ROLE.ACCOUNTANT), route: '/invoices', handlers: [createInvoiceListErrorHandler()] },
  play: async ({ screen, user }) => {
    await user.click(screen.getByTestId(IDS.errorState.retryButton));
  },
});
```

**Wyjątki**: Czysta logika (transformacje, selektory, guardy) nie potrzebuje scenariusza przez UI — to domena TEST-6; dublowanie jej testami integracyjnymi to wolne i kruche pokrycie tej samej gałęzi.

---

## TEST-6. Unit testy: czyste funkcje i kontrakty; testowalność przez wynoszenie logiki

**Reguła**: Unit testami pokrywaj czyste transformacje (mappery API↔model, transformery formularzy, selektory/filtry, utils dat, mappery błędów), hooki/serwisy z logiką decyzyjną oraz kontrakty wewnętrzne (guardy typów, mapy uprawnień, unikalność test-idów). Kod projektuj tak, by ta logika dawała się testować bez renderowania: wynoś ją z komponentów do funkcji modułowych i dedykowanych hooków/serwisów (./components.md). Spec-pliki kolokuj przy źródłach.

**Dlaczego**: Logika zakopana w komponencie jest testowalna wyłącznie przez UI — czyli wolno, krucho i zwykle wcale. Wyniesiona funkcja czysta testuje się tabelą przypadków w milisekundach. To ten sam ruch architektoniczny, który poprawia czytelność komponentu — testowalność jest jego darmowym produktem ubocznym, i odwrotnie: opór materii przy pisaniu unit testu („muszę zamockować pół świata") to sygnał, że logika siedzi w złym miejscu.

**Przykład**:

```ts
// ŹLE — sortowanie i podsumowanie zaszyte w komponencie; test wymaga renderu i mocków danych
function InvoiceSummarySection({ invoices }) {
  const overdue = invoices.filter((i) => isPast(i.dueDate) && i.status !== 'paid')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const total = overdue.reduce((sum, i) => sum + i.amount, 0);
  return /* render overdue + total */;
}

// DOBRZE — czysta funkcja obok komponentu + tabelaryczny spec
// select-overdue.utils.ts
export const selectOverdue = (invoices: IInvoice[], today: string): IOverdueSummary => { /* ... */ };

// select-overdue.utils.spec.ts (kolokowany)
it.each([
  ['empty input', [], { items: [], total: 0 }],
  ['paid invoices excluded', [paidInvoice], { items: [], total: 0 }],
  ['due today is not overdue', [dueToday], { items: [], total: 0 }],
])('selectOverdue: %s', (_, input, expected) => {
  expect(selectOverdue(input, '2025-01-15')).toEqual(expected);
});
```

Komponent po zmianie tylko woła `selectOverdue` — jego test integracyjny (TEST-5) sprawdza już wyłącznie sklejenie, nie arytmetykę.

**Wyjątki**: Trywialnych przekazań (komponent renderujący props bez logiki) nie testuj jednostkowo — pokrycie bez asercji o wartości to balast. Nie unit-testuj implementacji bibliotek zewnętrznych, tylko własne adaptery do nich.

---

## TEST-7. Refactor ma plan weryfikacji ustalony PRZED zmianą i inwentaryzację stanów

**Reguła**: Zanim zaczniesz refactor, spisz: (1) inwentarz wszystkich stanów UI starego kodu — w szczególności error, empty i refetch, bo nie widać ich na happy-path; (2) plan weryfikacji — które scenariusze/testy muszą przejść po zmianie i czym pokryjesz stany dziś nietestowane. Każde zapytanie konsumowane w nowym kodzie musi mieć zagospodarowane `error` i `refetch`, nie tylko `data`/`loading`. Mechanika krojenia refactoru i pełna checklista: ./refactoring.md.

**Dlaczego**: Refactor gubi przede wszystkim to, czego nie widać podczas ręcznego przeklikania — czyli stany niesukcesu. W projekcie referencyjnym duży refactor widoku harmonogramu zespołu skasował cały error-state (i wyrzucił `error`/`refetch` z destrukturyzacji wyniku zapytania); kompilacja i review przeszły, a naprawa, wykonana pół godziny po wykryciu, kosztowała kilkaset linii — wraz z dopisaniem brakujących test-idów stanów błędów (TEST-1), bez których regresji nie dało się nawet pokryć testem. Plan ustalony przed zmianą jest tani; plan rekonstruowany po regresji — nie.

**Przykład** — checklista przed kasacją starego komponentu:

```text
[ ] wypisane stany: loading / error (+retry?) / empty / success / partial (refetch z danymi)
[ ] każdy stan ma test-id i scenariusz (fabryki z TEST-3 pokrywają error/empty/loading)
[ ] dla każdego zapytania w nowym kodzie: kto konsumuje error? kto wywołuje refetch?
[ ] scenariusze per rola (TEST-5) przechodzą na nowym kodzie przed usunięciem starego
[ ] diff kończy się skasowaniem starych ścieżek (nie „na razie zostawiam")
```

**Wyjątki**: Czysto mechaniczne zmiany bez zmiany zachowania (rename, podmiana literałów na tokeny) nie wymagają inwentaryzacji stanów — ale właśnie dlatego rób je osobnymi commitami, żeby reszta refactoru pozostała weryfikowalna (./refactoring.md).
