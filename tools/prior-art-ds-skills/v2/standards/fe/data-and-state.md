# Dane i stan: stan serwera, stan UI, warstwa danych/API

Reguły framework-agnostic (mapowanie na Angular: ./angular.md). Zakres: gdzie mieszka który rodzaj stanu, jak modelować stany w typach oraz jak zbudować jedyną legalną drogę danych z i do API. Obsługa stanów loading/error/empty/success: ./errors.md (macierz 4 stanów). Formularze i walidacja wejścia użytkownika: ./forms.md.

Przykłady są w pseudokodzie TypeScript w neutralnej domenie (projekty / zadania / faktury / klienci / harmonogram zespołu). Tam, gdzie piszemy o „projekcie referencyjnym", chodzi o dojrzały projekt produkcyjny, z którego wyprowadzono te reguły.

---

## Część I — Stan serwera vs stan UI

### STATE-1. Stan serwera trzymaj w cache zapytań, nie w globalnym stanie

**Reguła.** Dane pochodzące z backendu (listy, detale, liczniki) żyją wyłącznie w dedykowanej bibliotece cache'u zapytań. Nie kopiuj ich do globalnego store'a klienckiego, nie synchronizuj ręcznie. Backend jest źródłem prawdy; frontend trzyma migawkę z metadanymi świeżości.

**Dlaczego.** Stan serwerowy ma inną naturę niż stan kliencki: wymaga inwalidacji, deduplikacji zapytań, retry, śledzenia świeżości i stanu pobierania. Globalny store tego nie daje — trzeba to dopisać ręcznie i utrzymywać. Pomylenie tych dwóch kategorii to jedna z najdroższych decyzji frontendowych: migracja błędnie zaadresowanego stanu serwera do cache'u zapytań w dużej aplikacji liczy się w miesiącach.

**Przykład.**

```ts
// ŹLE — ręczna kopia danych serwera w globalnym store:
store.dispatch(loadInvoices());            // efekt -> fetch -> reducer -> store
const invoices = store.select('invoices'); // kto i kiedy to odświeża? nikt nie wie

// DOBRZE — cache zapytań z kluczem i polityką świeżości:
const invoicesQuery = useQuery({
  key: invoiceKeys.list(filters),          // fabryka kluczy: DATA-4
  fetch: () => invoiceApi.getList(filters),
  staleTime: CACHE_POLICY.USER_CONTENT,    // polityki: DATA-5
});
```

**Wyjątki.** Dane czysto klienckie (motyw, stan sidebara, draft niezapisanego formularza) nie należą do cache'u zapytań — patrz STATE-2 i STATE-7.

---

### STATE-2. Trzy adresy stanu widoku: URL, storage, stan lokalny

**Reguła.** Stan semantyczny widoku — filtry, wybrany tydzień harmonogramu, zaznaczone wiersze, aktywna zakładka — trzymaj w URL (parametry wyszukiwania z per-parametrową serializacją). Preferencje prezentacji — zwinięcie panelu, gęstość tabeli — trzymaj w storage przeglądarki pod jawnym kluczem. Całą resztę trzymaj w stanie lokalnym, możliwie najniżej w drzewie.

**Dlaczego.** URL daje za darmo: link do udostępnienia, działający refresh, działający przycisk „wstecz" i wejście z zakładki. Storage daje trwałość preferencji między sesjami bez zaśmiecania URL. Stan lokalny nisko w drzewie minimalizuje zasięg re-renderów i sprzężenie. Każde z tych trzech miejsc źle obsłuży cudzą kategorię: filtry w stanie lokalnym znikają po refreshu, preferencje w URL psują linki, wszystko w globalnym store sprzęga niezależne widoki.

**Przykład.** Widok harmonogramu zespołu:

```ts
// stan semantyczny -> URL:    /schedule?week=2026-W23&members=u1,u2
// preferencja      -> storage: ui.schedule.sidebarCollapsed = true
// reszta           -> lokalnie: openedTooltipId wewnątrz komponentu wiersza
```

W projekcie referencyjnym serializację parametrów URL ujęto w mały współdzielony moduł (rejestr filtrów, każdy filtr deklaruje własną serializację/deserializację), a klucz storage był jawnym parametrem providera panelu — dzięki temu dwa różne panele nie nadpisywały sobie preferencji.

**Wyjątki.** Stan wrażliwy (tokeny, dane osobowe) nigdy nie trafia do URL. Stan efemeryczny o dużej częstotliwości zmian (pozycja drag&drop w trakcie przeciągania) zostaje lokalny nawet, jeśli jest „semantyczny".

---

### STATE-3. Wzajemnie wykluczające się stany modeluj unią dyskryminowaną, nie booleanami + nullable

**Reguła.** Gdy kilka flag boolean i nullable payload opisują jeden stan, który ma N legalnych wariantów, zamień je na pojedynczą unię dyskryminowaną z polem `type`. Rozróżnianie wariantów rób type-guardem, nie porównaniem strukturalnym („skoro ma pole `uploadProgress`, to pewnie świeży plik").

**Dlaczego.** Trzy booleany to 8 kombinacji, z których legalne są zwykle 2–3 — reszta to stany niemożliwe, które kompilator przepuszcza, a runtime produkuje. Unia dyskryminowana czyni stany niemożliwe niewyrażalnymi, redukuje liczbę handlerów i daje wyczerpujące sprawdzanie `switch` przez kompilator.

**Przykład.** Wiersz dnia wolnego w harmonogramie zespołu, z dwoma modalami (ustaw / usuń dzień wolny):

```ts
// ŹLE — 3 niezależne pola stanu + 4 handlery; możliwe „oba modale otwarte naraz”
let isSetModalOpen = false;
let isRemoveModalOpen = false;
let modalDate: string | null = null; // null „obowiązuje”, gdy oba zamknięte… chyba

function openSetModal(date: string)    { isSetModalOpen = true;  modalDate = date; }
function openRemoveModal(date: string) { isRemoveModalOpen = true; modalDate = date; }
function closeSetModal()               { isSetModalOpen = false; modalDate = null; }
function closeRemoveModal()            { isRemoveModalOpen = false; modalDate = null; }

// DOBRZE — jedna wartość, trzy legalne stany, payload tylko tam, gdzie ma sens
type TDayOffModalState =
  | { type: 'closed' }
  | { type: 'set'; date: string }
  | { type: 'remove'; date: string };

let modal: TDayOffModalState = { type: 'closed' };

function openModal(next: Exclude<TDayOffModalState, { type: 'closed' }>) { modal = next; }
function closeModal() { modal = { type: 'closed' }; }

// render: switch po modal.type — brak gałęzi = błąd kompilacji
```

W projekcie referencyjnym ten refaktor zmniejszył komponent o ~20 linii i usunął klasę bugów „dwa modale naraz". Drugi przypadek z tej samej rodziny: lista załączników faktury mieszała pliki świeżo wybrane (`tmpId`, postęp uploadu) i już zapisane (`id` z serwera) w jednym luźnym typie — porównania strukturalne myliły `id` z `tmpId`. Unia `IUploadFile | IStoredFile` z type-guardem `isStoredFile()` naprawiła realny bug przy okazji porządkowania typów.

**Wyjątki.** Pojedyncza, naprawdę niezależna flaga (np. `isExpanded`) to nadal boolean — unia jednoelementowa to przerost.

---

### STATE-4. Filtrowanie: klient vs serwer — reguła warunkowa

**Reguła.** Mały, wspólny, niestronicowany zbiór danych + N wariantów filtra → **jedno zapytanie i selekcja w pamięci** (memoizowane czyste selektory). Zbiór duży, stronicowany lub sortowany po stronie serwera → **filtr jako parametr zapytania i część klucza cache**. Decyzję podejmuj per widok, świadomie — to reguła dwuwarunkowa, nie dogmat „zawsze serwer".

**Dlaczego.** N zapytań różniących się tylko parametrem po tym samym małym zbiorze to eksplozja stanu: N× loading, N× error, N× refetch do skoordynowania. Z drugiej strony filtrowanie dużych, stronicowanych list w kliencie nie skaluje się i kłamie (filtrujesz tylko pobraną stronę).

**Przykład.**

```ts
// Przypadek A — harmonogram zespołu (kilkudziesięciu ludzi, jeden zbiór, 3 sekcje per rola):
// ŹLE: 3× useQuery({ key: scheduleKeys.list({ role }) }) — 3 requesty, 3 spinnery, 3 error-y
// DOBRZE: jedno zapytanie + czysty selektor
const schedule = useQuery({ key: scheduleKeys.list(week), fetch: ... });
const managers   = filterByRole(schedule.data, 'MANAGER');   // czysta funkcja, memoizowana
const developers = filterByRole(schedule.data, 'DEVELOPER');

// Przypadek B — lista faktur (tysiące rekordów, paginacja i sort na serwerze):
// DOBRZE: filtr jest parametrem zapytania i częścią klucza cache
useQuery({
  key: invoiceKeys.list({ status, clientId, page }),
  fetch: () => invoiceApi.getList({ status, clientId, page }),
});
```

**Wyjątki.** Wpisane w treść reguły — graniczne przypadki (średni zbiór, rzadkie filtry) rozstrzygaj na korzyść prostszego wariantu i zapisz dlaczego.

---

### STATE-5. Po zapisie unieważnij wszystkie dane pochodne (kaskada inwalidacji)

**Reguła.** Każda mutacja kończy się kaskadą inwalidacji wszystkich zapytań, których wynik mogła zmienić: detal, listy, liczniki, historia zmian. Inwaliduj przez te same fabryki kluczy, których używają zapytania (DATA-4) — nigdy przez literały. Akcja „odśwież" na agregacie = inwalidacja całego klastra kluczy zasobu, nie pojedynczego zapytania.

**Dlaczego.** Najczęstszy bug tej klasy wygląda tak: użytkownik zmienia termin zadania, detal się aktualizuje, ale licznik na liście i panel historii pokazują stare dane — bo ktoś unieważnił tylko to zapytanie, które miał przed oczami. Dane pochodne nie odświeżają się same; brakująca inwalidacja jest niewidoczna w code review i na happy-path dewelopera, który patrzy na jeden ekran.

**Przykład.**

```ts
const acceptTask = useMutation({
  mutate: (taskId: string) => taskApi.accept(taskId),
  onSuccess: (_, taskId) => {
    invalidate(taskKeys.detail(taskId));
    invalidate(taskKeys.lists());        // wszystkie warianty list (prefiks hierarchiczny)
    invalidate(taskKeys.statusCounters());
    invalidate(taskKeys.history(taskId));
  },
});
```

W projekcie referencyjnym zgłoszony przez QA bug „historia nie odświeża się po zmianie terminu" był dokładnie tą luką — i powracał, dopóki lista inwalidowanych kluczy nie stała się obowiązkowym punktem review każdej mutacji.

**Wyjątki.** Dane, których mutacja na pewno nie dotyka, nie wymagają inwalidacji — ale „na pewno" oceniaj po stronie kontraktu (czy backend przelicza pochodne?), nie po intuicji.

---

### STATE-6. Mutacja w toku blokuje wszystkie akcje na tym samym zasobie

**Reguła.** Podczas trwającej mutacji zablokuj nie tylko przycisk submit, lecz wszystkie operacje mogące zmienić ten sam zasób (dodanie pozycji, usunięcie, zmiana statusu). Każdy przycisk akcji ma loader w jednym schemacie obowiązującym w całej aplikacji (tekst bazowy + spinner) i ochronę przed double-submit.

**Dlaczego.** Empiryka z projektu referencyjnego: rejestr bugów zawierał wprost „można dodać pozycję podczas zapisu" i „można kliknąć wiele razy" — czyli wyścigi i zduplikowane rekordy. Pojedyncza flaga `disabled` na przycisku submit nie chroni reszty ekranu.

**Przykład.**

```ts
// Feature wystawia jeden sygnał blokady dla całego widoku zasobu:
const { isMutating } = useTaskActionsBlocked(); // provider na szczycie feature

<ActionButton disabled={isMutating} loading={isAccepting}>Akceptuj</ActionButton>
<ActionButton disabled={isMutating} loading={isRejecting}>Odrzuć</ActionButton>
<AddItemButton disabled={isMutating} />   // też! — to ta sama encja
```

**Wyjątki.** Akcje na rozłącznych zasobach (inny rekord listy) nie muszą się wzajemnie blokować. Mutacje idempotentne z optimistic update (STATE-8) mogą zamiast blokady stosować deduplikację żądań.

---

### STATE-7. Globalny stan kliencki — tylko z uzasadnieniem, jako wąskie providery

**Reguła.** Globalny stan UI (sesja, motyw, flagi funkcji) wprowadzaj wyłącznie jako mały, dedykowany provider z wąskim, semantycznym API — nigdy jako jeden worek „app state". Hook dostępu jest fail-fast: rzuca wyjątek poza providerem. Tam, gdzie nieobecność providera jest legalna (komponent współdzielony używany w dwóch kontekstach), dostarcz jawny wariant `useXxxOptional`.

**Dlaczego.** Worek „app state" przyciąga wszystko, sprzęga niezależne feature'y i zabija lazy loading (każdy moduł zależy od całości). Fail-fast zamienia błąd konfiguracji (brak providera) w natychmiastowy, czytelny wyjątek zamiast cichego `undefined` propagującego się przez pół drzewa. Wariant optional jest jawną deklaracją „tu wolno nie być w kontekście" — bez niego ludzie osłabiają wersję podstawową do nullable i tracą fail-fast wszędzie.

**Przykład.**

```ts
function useSession(): ISession {
  const ctx = readContext(SessionContext);
  if (ctx === undefined) {
    throw new Error('useSession must be used within <SessionProvider>');
  }
  return ctx;
}

function useSessionOptional(): ISession | undefined {
  return readContext(SessionContext); // legalnie undefined — konsument MUSI to obsłużyć
}
```

W projekcie referencyjnym każdy globalny koncern miał osobny provider (sesja, flagi funkcji, stan panelu bocznego) i parę hooków fail-fast/optional tam, gdzie była potrzebna.

**Wyjątki.** Stan serwera nigdy (STATE-1). Stan jednego feature'a nie jest globalny — provider feature'a montuj na szczycie feature'a, nie aplikacji.

---

### STATE-8. Optymistyczne aktualizacje: tylko z rollbackiem i inwalidacją

**Reguła.** Optimistic update stosuj wyłącznie, gdy prawdopodobieństwo sukcesu jest wysokie, a rollback tani i wizualnie zrozumiały (toggle, zaznaczenie). Zawsze implementuj komplet: zapis migawki → aktualizacja optymistyczna → rollback przy błędzie → inwalidacja po rozstrzygnięciu. Przy edycji współbieżnej preferuj wykrywanie konfliktu (wersja rekordu / etag) nad „ostatni zapis wygrywa".

**Dlaczego.** Połowiczny optimistic update (bez rollbacku albo bez końcowej inwalidacji) to UI kłamiące po błędzie sieci — gorsze niż spinner. Konflikt edycji bez detekcji wersji po cichu kasuje cudzą pracę.

**Przykład.**

```ts
const toggleDayOff = useMutation({
  mutate: (input) => scheduleApi.toggleDayOff(input),
  onMutate: (input) => {
    const previous = cache.get(scheduleKeys.list(input.week));   // migawka
    cache.set(scheduleKeys.list(input.week), applyToggle(previous, input));
    return { previous };
  },
  onError: (_err, input, ctx) => {
    cache.set(scheduleKeys.list(input.week), ctx.previous);      // rollback
    notifyError('SCHEDULE.TOGGLE_DAY_OFF.ERROR');                // feedback: ./errors.md
  },
  onSettled: (_d, _e, input) => invalidate(scheduleKeys.list(input.week)), // prawda z serwera
});
```

**Wyjątki.** Operacje o niskiej przewidywalności wyniku (walidacja serwerowa, reguły uprawnień) i operacje nieodwracalne wizualnie (usunięcie z animacją) — tam czekaj na odpowiedź i blokuj akcje (STATE-6). Mutacja w pełni odzwierciedlona natychmiastową zmianą UI może sygnalizować tylko błąd, bez snackbara sukcesu.

---

## Część II — Warstwa danych/API

### DATA-1. Jedna brama I/O: walidacja runtime + mapowanie kontraktu + normalizacja w jednym kroku

**Reguła.** Każda odpowiedź API przechodzi na granicy przez parse schematem runtime (fail-fast: niezgodność kontraktu staje się stanem błędu, nie renderem zepsutych danych). W tym samym kroku wykonaj mapowanie konwencji nazewniczych (snake→camel) i normalizację typów (np. liczbowe ID → string). Reszta aplikacji widzi wyłącznie typ wyprowadzony ze schematu. Czy w ogóle mapować konwencje nazw, to jawna, udokumentowana decyzja architektoniczna całego projektu — nie odruch per plik; najpierw spróbuj wyrównać kontrakt z backendem.

**Dlaczego.** Bez walidacji runtime błąd kontraktu (backend zmienił pole) objawia się jako `undefined` trzy warstwy dalej, w losowym komponencie. Brama w jednym miejscu daje: jeden punkt diagnozy, jedną definicję typu (schemat = typ), zero ręcznej duplikacji interfejsów i gwarancję, że dane „za bramą" są już znormalizowane.

**Przykład.**

```ts
// invoice.schema.ts — jedyne miejsce, które zna surowy kształt API
const invoiceSchema = schema.object({
  id: numericIdAsString(),        // 123 -> '123' (normalizacja na granicy)
  issued_at: isoDateTimeString(), // zostaje stringiem ISO (DATA-9)
  client_name: schema.string(),
  net_amount: schema.number(),
}).transform((raw) => ({
  id: raw.id,
  issuedAt: raw.issued_at,
  clientName: raw.client_name,
  netAmount: raw.net_amount,
}));

type TInvoice = InferOutput<typeof invoiceSchema>; // jedyny typ widoczny dla aplikacji

// invoice.api.ts
async function getInvoice(id: string): Promise<TInvoice> {
  const response = await httpClient.get(invoicePaths.detail(id));
  return invoiceSchema.parse(response); // fail-fast: rzut -> stan błędu zapytania
}
```

**Wyjątki.** Payloady wychodzące buduj jawnym mapowaniem literałami (DATA-3), nie odwróconym automatem. Strumienie/binaria (pliki) przechodzą bez parsowania treści, ale przez tę samą bramę transportu (DATA-8).

---

### DATA-2. Waliduj kształt i typy, nie reguły biznesowe; bądź liberalny na wejściu

**Reguła.** Na granicy danych sprawdzaj strukturę i typy: pola obecne, typy zgodne, nieznane pola odcinane. Nie sprawdzaj tam długości, zakresów ani reguł domenowych — frontend nie dubluje walidacji biznesowej backendu. Akceptuj nadmiarowe dane wejściowe (odcinając je), bądź ścisły w danych wyjściowych.

**Dlaczego.** Walidacja biznesowa na granicy danych dubluje logikę backendu i rozjeżdża się z nią po cichu — wtedy frontend odrzuca dane, które backend uznał za legalne, i aplikacja wybucha na poprawnej odpowiedzi. Liberalne wejście pozwala backendowi dodawać pola bez łamania frontendu.

**Przykład.**

```ts
// ŹLE — reguła biznesowa w schemacie odpowiedzi:
schema.object({ net_amount: schema.number().min(0).max(1_000_000) })
// backend wprowadza korekty ujemne -> frontend odrzuca poprawną odpowiedź

// DOBRZE — kształt i typ, nieznane pola odcięte:
schema.object({ net_amount: schema.number() }).stripUnknown()
```

**Wyjątki.** Formularze to inna granica: tam walidujesz wejście użytkownika i reguły biznesowe są na miejscu (szczegóły: ./forms.md). Wartości o zamkniętej dziedzinie kontraktu (enum statusów) waliduj jako unię — to nadal kształt, nie biznes.

---

### DATA-3. Jawne mapowanie zamiast type-level magii

**Reguła.** Preferuj nudne, grep-owalne mapowanie pole-po-polu nad generyczną automatykę na poziomie typów. Parametry zapytań buduj addytywnie (dodawaj tylko zdefiniowane pola). Rozjazdy nazw UI↔API trzymaj w jawnej, lokalnej mapie wyjątków. Abstrakcję pomocniczą współdziel dopiero, gdy jest mała, stabilna i bez dziur w typach.

**Dlaczego — studium przypadku.** W projekcie referencyjnym istniał 264-liniowy moduł rekurencyjnych typów warunkowych: automat konwertujący konwencje nazw między API a aplikacją na poziomie systemu typów, z `any` w punktach, których typy nie domykały. Skutki: nieczytelne, wielostronicowe błędy kompilacji przy każdej zmianie modelu; mapowanie niewidoczne w kodzie (nie do znalezienia grep-em po nazwie pola); debugging praktycznie niemożliwy. Cały automat usunięto na rzecz jawnych transformacji per schemat (jak w DATA-1) — z 264 linii magii zostały 4 mikro-helpery (~15 linii). Koszt: kilkanaście „nudnych" linii na model. Zysk: każda transformacja jest widoczna, wyszukiwalna i lokalnie zrozumiała.

**Przykład.**

```ts
// ŹLE — automat: type SnakeToCamel<T> = { [K in keyof T as CamelCase<K & string>]: ... }
//        + runtime'owa rekurencja po kluczach z rzutowaniami

// DOBRZE — jawnie, addytywnie, z lokalną mapą wyjątków:
const SORT_FIELD_MAP: Record<TInvoiceSortField, string> = {
  issuedAt: 'issued_at',
  clientName: 'client_display_name', // rozjazd nazw: jawny, w jednym miejscu
};

function buildListParams(filters: IInvoiceFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.status !== undefined) params.status = filters.status;
  if (filters.sortField !== undefined) params.order_by = SORT_FIELD_MAP[filters.sortField];
  return params; // tylko zdefiniowane pola — bez `undefined` w query stringu
}
```

**Wyjątki.** Drobne, domknięte typowo helpery (np. `numericIdAsString()`) są w porządku — to klocki, nie automat. Generyczne koperty odpowiedzi: DATA-6.

---

### DATA-4. Endpointy i klucze cache jako typowane fabryki per zasób

**Reguła.** Ścieżki API i klucze cache (oraz inne kontrakty przekrojowe) definiuj jako typowane obiekty per zasób z metodami (`list`, `detail`, ...), współdzielone przez zapytania i mutacje. Klucze buduj hierarchicznie (prefiks zasobu → wariant → parametry). Zakaz literałów ścieżek i kluczy w kodzie feature'ów; zakaz jednego globalnego pliku-słownika dla wszystkich zasobów.

**Dlaczego.** Literał klucza rozjeżdża inwalidację po cichu (mutacja inwaliduje `'invoice'`, zapytanie słucha `'invoices'` — i nic się nie dzieje). Hierarchia kluczy daje precyzyjną inwalidację klastrami (STATE-5). Globalny plik wszystkich endpointów to magnes na konflikty i pseudo-zależność każdego z każdym — w projekcie referencyjnym taki plik urósł do ~50 endpointów wszystkich domen i każdy PR go dotykał, zanim rozbito go na fabryki per zasób.

**Przykład.**

```ts
// invoice.paths.ts
export const invoicePaths = {
  list: () => '/api/invoices',
  detail: (id: string) => `/api/invoices/${id}`,
  history: (id: string) => `/api/invoices/${id}/history`,
} as const;

// invoice.keys.ts — hierarchia: prefiks -> wariant -> parametry
export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters: IInvoiceFilters) => [...invoiceKeys.lists(), filters] as const,
  detail: (id: string) => [...invoiceKeys.all, 'detail', id] as const,
};

// inwalidacja klastra: invalidate(invoiceKeys.lists()) trafia we wszystkie warianty list
```

**Wyjątki.** W trakcie dużej migracji fasada agregująca stare nazwy jest legalna (wzorzec dusiciela) — ale nowy kod pisze się wyłącznie przeciw fabrykom per zasób (mechanika: ./refactoring.md).

---

### DATA-5. Polityki cache i transportu jako nazwany słownik kategorii semantycznych

**Reguła.** Czasy świeżości cache, retry, rozmiary stron, timeouty definiuj w jednym module jako słownik nazwany według **rodzaju danych** („dane referencyjne", „liczniki", „treść użytkownika"), nie według miejsca użycia ani gołych liczb rozsianych po zapytaniach.

**Dlaczego.** Rozproszone literały (`staleTime: 30000` w 14 plikach) uniemożliwiają świadomą zmianę polityki i nie niosą intencji. Nazwa semantyczna dokumentuje, dlaczego wartość jest taka, jaka jest. Lekcja z projektu referencyjnego: słownik polityk z czasem zerodował z czterech kategorii do jednej — ale dzięki centralizacji erozja była widoczna w jednym pliku i jednym diffie, a nie rozsmarowana po kodzie. Wniosek: reguła centralizacji jest trwała, konkretne wartości żyją — traktuj je jako migawkę z datą.

**Przykład.**

```ts
// cache-policy.const.ts
export const CACHE_POLICY = {
  REFERENCE_DATA: { staleTime: 60 * 60_000 }, // słowniki: waluty, role, statusy
  COUNTERS:       { staleTime: 30_000 },      // liczniki na listach
  USER_CONTENT:   { staleTime: 0 },           // edytowalne dane biznesowe
} as const;

useQuery({ key: clientKeys.dictionary(), staleTime: CACHE_POLICY.REFERENCE_DATA.staleTime });
```

**Wyjątki.** Jednostkowa, lokalnie uzasadniona wartość (np. polling co 5 s na jednym ekranie monitoringu) może być lokalna — ale z komentarzem dlaczego nie pasuje do żadnej kategorii.

---

### DATA-6. Powtarzalne koperty odpowiedzi opakowuj generycznym schematem

**Reguła.** Strukturalne koperty powtarzające się w całym API — paginacja, koperta błędu — zdefiniuj raz jako generyczną fabrykę schematu parametryzowaną schematem elementu. To jedyna legalna „automatyka" w warstwie schematów (por. DATA-3): mała, stabilna, bez dziur typów.

**Dlaczego.** Koperta paginacji przepisywana per zasób to dziesiątki identycznych bloków, które rozjeżdżają się przy pierwszej zmianie kontraktu paginacji.

**Przykład.**

```ts
const createPaginatedSchema = <TItem>(itemSchema: TSchema<TItem>) =>
  schema.object({
    items: schema.array(itemSchema),
    total: schema.number(),
    page: schema.number(),
    page_size: schema.number(),
  }).transform((raw) => ({
    items: raw.items,
    total: raw.total,
    page: raw.page,
    pageSize: raw.page_size,
  }));

const invoiceListSchema = createPaginatedSchema(invoiceSchema);
```

**Wyjątki.** Koperta użyta przez jeden zasób nie jest jeszcze kopertą — poczekaj na drugiego konsumenta.

---

### DATA-7. Integrację third-party z warstwą danych opakuj w jeden adapter

**Reguła.** Gdy zewnętrzny komponent (grid z infinite scroll, edytor, mapa) ma własny protokół pobierania danych, napisz jeden adapter tłumaczący ten protokół na twoją warstwę danych — z tą samą walidacją schematem i tymi samymi fabrykami kluczy/ścieżek. Logika integracji nie rozlewa się po komponentach feature'ów.

**Dlaczego.** Bez adaptera każdy ekran z gridem reimplementuje paginację, mapowanie sortowania i obsługę błędów po swojemu — a odpowiedzi grida omijają bramę I/O (DATA-1), więc walidacja kontraktu znika dokładnie tam, gdzie danych jest najwięcej.

**Przykład.**

```ts
// invoice-list.data-source.ts — jedyne miejsce znające protokół grida
function createInvoiceDataSource(): IGridDataSource {
  return {
    async getRows({ startRow, endRow, sortModel }) {
      const params = buildListParams({
        page: toPage(startRow, endRow),
        sortField: fromGridSort(sortModel), // mapowanie protokołu grida -> nasz kontrakt
      });
      const data = await httpClient.get(invoicePaths.list(), { params });
      return invoiceListSchema.parse(data); // ta sama brama I/O co zwykłe zapytania
    },
  };
}
```

**Wyjątki.** Komponent third-party konsumujący zwykłą tablicę propsów nie potrzebuje adaptera — karm go danymi z normalnego zapytania.

---

### DATA-8. Cross-cutting transportu w łańcuchu interceptorów, niewidocznym dla feature'ów

**Reguła.** Koncerny przekrojowe transportu — autoryzacja (nagłówki, odświeżanie tokenu), bazowy URL/proxy, normalizacja ścieżek, obsługa uploadu, mapowanie błędów transportowych na klasy domenowe — implementuj jako łańcuch interceptorów jednego klienta HTTP. Feature woła zawsze to samo: `httpClient.get(paths.x())` — i nie wie o żadnym z tych mechanizmów.

**Dlaczego.** Token doklejany ręcznie w 40 miejscach to 40 okazji do pominięcia; mapowanie błędów per wywołanie gwarantuje niespójność. Interceptory dają jedno miejsce zmiany (rotacja schematu auth, zmiana proxy) i symetrię z bramą I/O po stronie danych.

**Przykład.**

```ts
const httpClient = createHttpClient({
  interceptors: [
    baseUrlInterceptor(config.apiUrl),
    authInterceptor(tokenSource),         // nagłówek + odświeżenie przy 401
    trailingSlashInterceptor(),           // normalizacja konwencji ścieżek
    errorMappingInterceptor(toDomainError), // transport -> klasy domenowe: ./errors.md
  ],
});
```

**Wyjątki.** Logika specyficzna dla jednego endpointu (specjalny nagłówek eksportu) nie jest cross-cutting — zostaje przy tym endpoincie, jawnie.

---

### DATA-9. Daty: w warstwie danych wyłącznie ISO string z jawną strefą

**Reguła.** W warstwie danych i w cache trzymaj daty jako stringi ISO 8601 z jawną strefą — bez konwersji na obiekty daty na granicy. Konwersję i formatowanie per locale rób dopiero w warstwie prezentacji, przez jeden współdzielony moduł dat. Nigdy nie porównuj dat jako sformatowanych stringów lokalnych.

**Dlaczego.** Obiekt daty utworzony na granicy natychmiast wciąga strefę przeglądarki — „termin płatności 2026-06-09" potrafi zmienić dzień u użytkownika w innej strefie. ISO string jest serializowalny (cache, URL, storage bez niespodzianek), porównywalny leksykograficznie w obrębie jednej strefy i bezstratny. Jedno przejście string→obiekt, w prezentacji, jest audytowalne; dziesiątki rozsianych konwersji nie są.

**Przykład.**

```ts
// warstwa danych — string ISO przechodzi nietknięty:
schema.object({ due_date: isoDateTimeString() })  // walidacja formatu, NIE konwersja
// ŹLE: schema.object({ due_date: coerceToDate() }) — strefa przeglądarki wchodzi do cache

// warstwa prezentacji — jedyne miejsce konwersji, przez wspólny moduł dat:
<DueDateLabel value={formatDate(invoice.dueDate, locale)} />
```

**Wyjątki.** Logika kalendarzowa wymagająca arytmetyki dat (harmonogram tygodnia) może operować na obiektach dat **wewnątrz** czystych funkcji współdzielonego modułu dat — wejście i wyjście tych funkcji to nadal ISO stringi.

---

## Powiązania

- Macierz stanów loading/error/empty/success i feedback mutacji: ./errors.md
- Granice warstw (warstwa danych nie zna UI, czysta logika w utils): ./architecture.md
- Pięć artefaktów formularza i mapowanie błędów walidacji serwera na pola: ./forms.md
- Mocki behawioralne symulujące semantykę API (filtry, paginacja, spójne ID): ./testing.md
- Antywzorce z tej kategorii (booleany+nullable, N zapytań po małym zbiorze, god-file kontraktów, type-level magia): ./antipatterns.md
- Idiomy Angulara dla tych reguł (klient HTTP, interceptory, sygnały vs cache zapytań): ./angular.md
