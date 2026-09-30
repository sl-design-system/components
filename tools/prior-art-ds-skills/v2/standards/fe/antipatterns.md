# Antywzorce — katalog do code review

Ten dokument opisuje 18 antywzorców frontendowych zaobserwowanych w projekcie referencyjnym — dojrzałej aplikacji produkcyjnej, z której wyprowadzono cały ten zestaw reguł. Każdy antywzorzec ma: sygnały rozpoznawcze (na co patrzeć w diffie), wyjaśnienie kosztu, opisany realny przypadek (przepisany na neutralną domenę: projekty, zadania, faktury, klienci, harmonogram zespołu), snippet ŹLE → DOBRZE tam, gdzie kod pomaga, oraz granicę — kiedy podobny kod antywzorcem NIE jest.

Plik jest pisany pod code review (ludzkie i agentowe): sygnały są sformułowane tak, by dało się je sprawdzić mechanicznie na diffie lub krótkim fragmencie kodu. Reguły pozytywne, na które wskazują odsyłacze, żyją w pozostałych plikach zestawu (./README.md — indeks).

---

## AP-1. God component / god root

**Jak rozpoznać (sygnały):**

- Komponent-root strony wywołuje więcej niż 1–2 hooki pobierające dane; zbiorczy `isLoading` sklejany z wielu flag (`a.isLoading || b.isLoading || ...`).
- Komponent layoutu przyjmuje kilkanaście propsów i tylko podaje je dalej (przekaźnik, nie konsument).
- Pojedynczy plik komponentu >200–250 linii łączący: stan UI, kilka mutacji, derywacje danych i render.

**Dlaczego boli:** wszystkie sekcje czekają na najwolniejsze zapytanie, choć większość mogłaby się już wyrenderować; każda zmiana dowolnej sekcji edytuje root (konflikty, regresje); testowanie wymaga zamockowania całego świata naraz.

**Przypadek z projektu referencyjnego:** root strony szczegółów projektu wywoływał 9 hooków zapytań (detal, lista zadań, historia, uczestnicy, załączniki, liczniki…) i składał `isLoading` z 9 flag — ekran był blank do czasu nadejścia ostatniej odpowiedzi. Po refactorze root pobiera wyłącznie zasób krytyczny (detal projektu), a każda sekcja fetchuje swoje dane i ma własny loading/error/empty. Drugi wariant tego samego antywzorca: 271-liniowa karta harmonogramu pracownika trzymała stan UI, 4 mutacje, derywacje i render w jednym pliku — mutacje wyjechały do hooka akcji, derywacje do hooka danych.

**ŹLE → DOBRZE:**

```ts
// ŹLE — root agreguje wszystko
function ProjectDetailsPage({ projectId }) {
  const details = useProjectDetails(projectId);
  const tasks = useProjectTasks(projectId);
  const history = useProjectHistory(projectId);
  const members = useProjectMembers(projectId);
  const isLoading = details.isLoading || tasks.isLoading
    || history.isLoading || members.isLoading;
  if (isLoading) return <PageSkeleton />;
  // ... 300 linii renderu wszystkich sekcji
}

// DOBRZE — root pobiera tylko zasób krytyczny, sekcje są autonomiczne
function ProjectDetailsPage({ projectId }) {
  const details = useProjectDetails(projectId); // krytyczne dla całego widoku
  if (details.isLoading) return <PageSkeleton />;
  if (details.error) return <PageError onRetry={details.refetch} />;
  return (
    <ProjectLayout data={details.data}>
      <TasksSection projectId={projectId} />     {/* fetchuje sama */}
      <HistorySection projectId={projectId} />   {/* fetchuje sama */}
    </ProjectLayout>
  );
}
```

**Kiedy to NIE jest antywzorzec:** dane realnie wspólne dla wielu sekcji (np. detal encji, od którego zależą wszystkie nagłówki) pobiera się raz w roocie i podaje w dół — to jest właśnie jego rola. Mała strona z jednym zapytaniem nie potrzebuje sekcjonowania.

**Powiązane reguły:** ./components.md (cienki root, kolokacja fetch z konsumentem, hooki akcji), ./errors.md (macierz 4 stanów per sekcja).

---

## AP-2. God-file dla kontraktów przekrojowych

**Jak rozpoznać (sygnały):**

- Jeden plik stałych ze ścieżkami endpointów / kluczami cache / ścieżkami pól formularzy dla **całej aplikacji**, rosnący z każdym featurem.
- Plik regularnie pojawia się w diffach niezwiązanych ze sobą zadań; częste konflikty merge na tym pliku.
- Niezależne use-case'y importują wspólną stałą „bo akurat pasuje".

**Dlaczego boli:** plik staje się magnesem konfliktów i pseudo-zależnością — każda domena „zależy" od każdej innej przez wspólny plik; nie widać, kto naprawdę czego używa; usunięcie czegokolwiek jest ryzykowne.

**Przypadek z projektu referencyjnego:** plik stałych API miał ~145 linii i ~50 endpointów wszystkich domen naraz; obok żył analogiczny zbiorczy plik kluczy cache oraz wspólny plik ścieżek pól dla **niezależnych** formularzy. Każda zmiana w dowolnej domenie edytowała te pliki. Rozbito je na typowane fabryki per zasób (`projectPaths.list()`, `projectKeys.detail(id)`, `invoicePaths...`), a na czas migracji zostawiono fasadę kompatybilności re-eksportującą stare nazwy.

**ŹLE → DOBRZE:**

```ts
// ŹLE — jeden słownik-śmietnik dla całej aplikacji
export const API_PATHS = {
  PROJECT_LIST: '/projects/',
  PROJECT_DETAIL: '/projects/:id/',
  INVOICE_LIST: '/invoices/',
  CLIENT_SEARCH: '/clients/search/',
  // ... ~50 kolejnych, wszystkie domeny
};

// DOBRZE — fabryka per zasób, we własnym module
export const projectPaths = {
  list: () => '/projects/',
  detail: (id: string) => `/projects/${id}/`,
};
export const projectKeys = {
  all: ['projects'] as const,
  list: (filters: TProjectFilters) => [...projectKeys.all, 'list', filters] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
};
```

**Kiedy to NIE jest antywzorzec:** centralizacja per zasób jest pożądana — antywzorcem jest centralizacja **wszystkich zasobów w jednym pliku**. Fasada agregująca stare API jest legalna tymczasowo, w trakcie migracji typu strangler.

**Powiązane reguły:** ./data-and-state.md (fabryki ścieżek i kluczy per zasób, hierarchiczne klucze cache), ./architecture.md (granice modułów).

---

## AP-3. Type-level cleverness

**Jak rozpoznać (sygnały):**

- Rekurencyjne typy warunkowe / mapped types automatyzujące transformacje (np. konwencje nazewnicze API↔frontend) zamiast jawnego mapowania.
- `any` wewnątrz „sprytnego" generyka jako plaster na nieskończony typ.
- Błędy kompilacji, których nikt w zespole nie umie przeczytać; debugowanie transformacji wymaga czytania typów, nie kodu.

**Dlaczego boli:** ukryte mapowanie nie jest grep-owalne (szukasz `client_name`, a w kodzie istnieje tylko `clientName` wyprodukowany typem); koszt utrzymania magii wielokrotnie przekracza kilkanaście zaoszczędzonych linii per model; `any` w środku unieważnia gwarancje, dla których typy w ogóle powstały.

**Przypadek z projektu referencyjnego:** moduł pomocniczy walidacji miał 264 linie rekurencyjnych typów warunkowych z `any`, automatycznie konwertujących konwencję nazw między API a frontendem. Efekt: nieczytelne błędy kompilacji, niemożliwy debugging, mapowanie niewidoczne w kodzie. Usunięto go **w całości** na rzecz jawnych transformacji pole-po-polu w schematach odpowiedzi; z automatu przeżyły 4 mikro-helpery (15 linii).

**ŹLE → DOBRZE:**

```ts
// ŹLE — automat typów; skąd się bierze `clientName`? Z magii.
type CamelizeDeep<T> = { [K in keyof T as Camelize<K & string>]:
  T[K] extends object ? CamelizeDeep<T[K]> : T[K] };
const project = camelizeDeep<CamelizeDeep<TApiProject>>(response);

// DOBRZE — nudne, jawne, grep-owalne
const projectSchema = apiProjectSchema.transform((raw) => ({
  id: String(raw.id),
  clientName: raw.client_name,
  dueDate: raw.due_date,
}));
```

**Kiedy to NIE jest antywzorzec:** mała, stabilna, w pełni typowana abstrakcja bez dziur (`any`) dla naprawdę powtarzalnej koperty — np. generyczny schemat odpowiedzi stronicowanej — jest w porządku. Granica: czy junior przeczyta błąd kompilacji i czy transformacja jest widoczna w kodzie.

**Powiązane reguły:** ./data-and-state.md (jawne mapowanie na granicy I/O), ./refactoring.md (odwaga cofnięcia złej generalizacji).

---

## AP-4. Copy-paste use-case'ów i plików

**Jak rozpoznać (sygnały):**

- Stała/mapa nazwana po jednym use-case (`...CREATE...`) importowana w innym (`edit`, `duplicate`).
- Pliki o nazwach-artefaktach edytora: `* copy.tsx`, `*2.ts`, `*-old.ts`, `*-final.ts` — zwłaszcza scommitowane i importowane.
- Nowy modal/formularz powstał przez skopiowanie pliku sąsiada i podmianę kilku stringów.

**Dlaczego boli:** współdzielona-przez-przypadek stała staje się bugiem przy pierwszej rozbieżności; kopie plików rozjeżdżają się cicho i obie wersje trzeba potem utrzymywać; nazwa kłamiąca o przeznaczeniu (CREATE w edycji) myli każdego kolejnego czytelnika.

**Przypadek z projektu referencyjnego:** mapa ścieżek pól formularza **tworzenia** użytkownika została użyta (przez copy-paste) w mutacji **edycji** — błędy walidacji serwera z edycji mapowały się na pola formularza tworzenia i częściowo ginęły. Naprawa: dedykowana mapa pól per use-case. Osobno: plik `*-modal.component copy.tsx` (z dosłowną spacją w nazwie — artefakt edytora) został scommitowany i był importowany przez kilka kolejnych zmian, zanim ktoś go zauważył.

**ŹLE → DOBRZE:**

```ts
// ŹLE — edycja "pożycza" mapę od tworzenia
import { USER_CREATE_FIELD_MAP } from '../create/user-create.field-map';
export function useUserEditMutation() {
  return useMutationWithFieldErrors(USER_CREATE_FIELD_MAP /* kłamstwo */);
}

// DOBRZE — każdy use-case ma własny komplet artefaktów
// edit/user-edit.field-map.ts
export const USER_EDIT_FIELD_MAP = {
  'profile.full_name': 'fullName',
  'profile.email': 'email',
} as const satisfies Record<string, TUserEditFormPath>;
```

**Kiedy to NIE jest antywzorzec:** fragment **faktycznie** wspólny dla create/edit wynosi się do nazwanego modułu wspólnego (`shared/user-form.field-map.ts`) — różnica polega na tym, że wspólność jest jawna i nazwana, a nie „pożyczona od sąsiada".

**Powiązane reguły:** ./architecture.md (komplet artefaktów per use-case, nazwy podążają za rolą), ./forms.md (mapy pól błędów walidacji), ./conventions-and-tooling.md (lint nazw plików).

---

## AP-5. Równoległe duplikaty implementacji

**Jak rozpoznać (sygnały):**

- Dwa (lub więcej) komponenty o niemal identycznej odpowiedzialności w różnych miejscach drzewa; czasem jeden nosi sufiks `2`.
- Kopia bajt-w-bajt lub kopia z drobnym dryfem (inne kolory, inna obsługa edge-case'a).
- Bugfix trzeba „przy okazji" powtórzyć w drugim miejscu.

**Dlaczego boli:** duplikaty rozjeżdżają się zawsze — naprawy i zmiany designu trafiają do jednej kopii; użytkownik widzi niespójne UI (np. dwa różne wyglądy tego samego statusu); koszt rośnie z każdym dniem życia kopii.

**Przypadek z projektu referencyjnego:** w jednym momencie istniały równolegle: 2 implementacje kalendarza harmonogramu (widok zespołu i widok pracownika — rozjechały się), **6+** implementacji znacznika statusu zadania (w tym jedna kopia bajt-w-bajt i jedna z kolorami zaszytymi hexami, niezgodna z paletą), 2 multiselecty (nowszy nazwany sufiksem „2"), 2 komponenty statusu uploadu pliku, 2 listy w sidebarze i 3 bliźniacze sekcje członków zespołu różniące się tylko rolą. Deduplikacja statusów dała jedno źródło w design-systemie; sekcje ról zredukowano do jednego komponentu wywołanego trzykrotnie z parametrem. Lekcja poboczna: po usunięciu starego multiselecta jego następca **zachował** sufiks „2" — sprzątanie nazw też jest częścią deduplikacji.

**ŹLE → DOBRZE:**

```tsx
// ŹLE — trzy pliki różniące się tylko rolą
<ManagerSection members={managers} />
<DeveloperSection members={developers} />
<TesterSection members={testers} />

// DOBRZE — jeden komponent, wariant jako parametr
<TeamMemberSection role="manager" />
<TeamMemberSection role="developer" />
<TeamMemberSection role="tester" />
```

**Kiedy to NIE jest antywzorzec:** dwa warianty różniące się **strukturą i zachowaniem** (np. lista aktywna vs zarchiwizowana z innym zestawem akcji) to legalnie dwa komponenty zbudowane ze wspólnych klocków — lepsze niż jeden komponent z flagami rozsianymi po drzewie (patrz AP-8). Krótkotrwała kopia w trakcie migracji strangler jest dopuszczalna, jeśli ma datę śmierci.

**Powiązane reguły:** ./components.md (różnica tylko w danych ⇒ jeden komponent + N wywołań), ./refactoring.md (refactor kończy się delete).

---

## AP-6. Spekulatywna abstrakcja dla N=1

**Jak rozpoznać (sygnały):**

- Rejestr / plugin-system / generyczny „base component" z dokładnie jednym wpisem lub konsumentem.
- Konfiguracja, której wszystkie pola mają jedną, stałą wartość.
- Uzasadnienie w PR brzmi „na przyszłość", „kiedyś będzie więcej".

**Dlaczego boli:** abstrakcja jest płatna — każdy czytelnik płaci za pośrednictwo, którego nic nie uzasadnia; spekulacyjny kształt prawie nigdy nie trafia w realne przyszłe wymagania, więc przy N=2 i tak trzeba go przerabiać, tylko teraz z większym kosztem.

**Przypadek z projektu referencyjnego:** 72-liniowy rejestr typów widżetów raportu zbudowano, gdy istniał **jeden** typ widżetu — usunięto go na rzecz prostego configu. Rejestr wrócił zasadnie dopiero, gdy typów było ponad 20 (z mapą wariantów pilnowaną przez kompilator: brak wpisu = błąd kompilacji). Kontrprzykład pozytywny z tego samego repo: generyczny rdzeń listy wydzielono dokładnie w momencie pojawienia się **drugiego** konsumenta — i to był właściwy moment.

**Progi praktyczne:** 1 użycie → nie abstrahuj; 2 → może; 3+ → prawdopodobnie; 5+ → tak.

**Kiedy to NIE jest antywzorzec:** abstrakcja przy N=1 bywa zasadna, gdy (a) drugi konsument jest pewny i bliski (jest w planie sprintu, nie w wyobraźni), albo (b) chodzi o granicę architektoniczną (np. punkt rejestracji odwracający zależność infrastruktura↔domena), a nie o generalizację kodu domenowego.

**Powiązane reguły:** ./architecture.md (progi abstrakcji, inwersja zależności rejestrem), ./refactoring.md (cofanie błędnej generalizacji).

---

## AP-7. Booleany + nullable zamiast unii dyskryminowanej

**Jak rozpoznać (sygnały):**

- Kilka flag boolean + pole nullable opisujących łącznie jeden stan (`isEditOpen`, `isRemoveOpen`, `selectedDate`), z których część kombinacji jest „niemożliwa, ale typ na to pozwala".
- Komentarze/asercje typu „to nigdy nie wystąpi razem".
- 3–4 handlery ustawiające flagi w skoordynowany sposób.

**Dlaczego boli:** typ dopuszcza stany niemożliwe (`isEditOpen && isRemoveOpen`), więc kompilator nie chroni; każdy nowy wariant mnoży kombinacje; logika otwierania/zamykania rozsiana po handlerach.

**Przypadek z projektu referencyjnego:** wiersz przełączników nieobecności w harmonogramie zespołu trzymał 3 zmienne stanu i 4 handlery do obsługi dwóch modali. Zamiana na pojedynczą unię dyskryminowaną dała −21 linii i wyeliminowała stany niemożliwe. Analogicznie: pliki „świeżo wgrany" vs „istniejący na serwerze" modelowano porównaniami strukturalnymi — unia z type-guardem przy okazji ujawniła realnego buga (mylone `id` zasobu z tymczasowym `tmpId` uploadu).

**ŹLE → DOBRZE:**

```ts
// ŹLE — 3 zmienne, stany niemożliwe reprezentowalne
const [isSetModalOpen, setSetModalOpen] = useState(false);
const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);
const [selectedDate, setSelectedDate] = useState<string | null>(null);

// DOBRZE — jedna unia dyskryminowana
type TAbsenceModal =
  | { type: 'closed' }
  | { type: 'set'; date: string }
  | { type: 'remove'; date: string };
const [modal, setModal] = useState<TAbsenceModal>({ type: 'closed' });
```

**Kiedy to NIE jest antywzorzec:** pojedyncza, naprawdę niezależna flaga (np. `isExpanded`) to nadal zwykły boolean — unia z jednym wariantem to przerost.

**Powiązane reguły:** ./data-and-state.md (modelowanie stanów wykluczających się unią).

---

## AP-8. Flagi boolean na monolicie zamiast kompozycji

**Jak rozpoznać (sygnały):**

- Współdzielony komponent przyjmuje rosnący zestaw flag włączających/wyłączających fragmenty (`canEditX`, `showY`, `hideZ`, `variant`).
- Wewnątrz komponentu gęstnieją warunki `if (props.canEditX)`.
- Każdy nowy konsument dokłada własną flagę.

**Dlaczego boli:** liczba ścieżek rośnie wykładniczo z liczbą flag (każda kombinacja to inny render do przetestowania); komponent zna wszystkie konteksty użycia naraz; konsument nie widzi z miejsca wywołania, co właściwie dostanie.

**Przypadek z projektu referencyjnego:** monolityczny kalendarz harmonogramu obrastał flagami w stylu `canEditAbsence` / `canEditWorkingHours` — każdy widok (zespół, pracownik, admin) potrzebował innej kombinacji. Refactor na compound component odwrócił kierunek: konsument **składa** kalendarz z części, a uprawnienie jest lokalnym propsem części, nie flagą monolitu. Skala złożoności spadła z wykładniczej do liniowej.

**ŹLE → DOBRZE:**

```tsx
// ŹLE — flagi na monolicie, 2^n kombinacji
<ScheduleCalendar
  showHeaders showAbsenceToggles={false}
  canEditAbsence={isManager} canEditHours={false}
/>

// DOBRZE — kompozycja; konsument składa to, czego potrzebuje
<ScheduleCalendar week={week}>
  <ScheduleCalendar.DayHeaders />
  <ScheduleCalendar.AbsenceToggles canEdit={isManager} />
  <ScheduleCalendar.Grid />
</ScheduleCalendar>
```

**Kiedy to NIE jest antywzorzec:** jedna binarna opcja czysto prezentacyjna (`dense`, `withBorder`) może zostać propsem — kompozycja jest odpowiedzią na **mnożenie się** wariantów zachowań, nie na pierwszą opcję.

**Powiązane reguły:** ./components.md (warianty przez kompozycję/sloty, compound components), ./architecture.md (komponent współdzielony odcięty od aplikacji).

---

## AP-9. Magic values i surowe kolory w stylach

**Jak rozpoznać (sygnały):**

- Literały hex (`'#006400'`), surowe px (`gap: 24`, `height: 40`) w kodzie komponentów.
- Komentarze `// TODO move to theme` (które nigdy nie są spłacane „przy okazji").
- Style niebędące funkcją theme — bez dostępu do tokenów nawet wtedy, gdy będą potrzebne.

**Dlaczego boli:** kolor ad-hoc rozjeżdża się z paletą (i z trybem dark/kontrastem); zmiana skali odstępów lub rebranding wymagają dotknięcia każdego pliku; responsywność (RWD) na surowych wartościach jest praktycznie nie do zrobienia — koszt późniejszej migracji jest liniowy względem liczby zaniedbanych plików.

**Przypadek z projektu referencyjnego:** zielony hex wpisany na sztywno w panelu administracyjnym rozjechał się z paletą i wymagał osobnej naprawy; literały odstępów (`gap: 24` itp.) rozsiane po ~60 plikach trzeba było wyczyścić mechaniczną migracją na tokeny (setki podmian) — jako **warunek wstępny** prac nad RWD. Komentarz „todo move to theme" wisiał w kodzie miesiącami. Przy okazji refactorów usuwano też nadpisania wymiarów, które okazywały się równe wartości domyślnej komponentu (`height: 40` ← default i tak był taki).

**ŹLE → DOBRZE:**

```ts
// ŹLE
const card = { backgroundColor: '#ddeeff' /* todo move to theme */, gap: 24 };

// DOBRZE — semantyczny token, styl jako funkcja theme
const card = (theme: TTheme) => ({
  backgroundColor: theme.palette.info.surface,
  gap: theme.spacing(3),
});
```

**Kiedy to NIE jest antywzorzec:** nie podmieniaj liczby na token mechanicznie tam, gdzie token nie niesie sensu (np. szerokość konkretnego layoutu, która nie jest wielokrotnością skali odstępów) — token ma nieść semantykę, nie być rytuałem.

**Powiązane reguły:** ./styling.md (gradient stylowania, zero surowych wartości, RWD od tokenów), ./refactoring.md (zmiany mechaniczne osobnym commitem).

---

## AP-10. Połykanie błędów

**Jak rozpoznać (sygnały):**

- Generyczny komunikat („Coś poszło nie tak") w handlerze, który **ma dostęp** do szczegółów błędu walidacji per-pole i je ignoruje.
- `console.log`/`console.error` jako jedyna obsługa błędu w kodzie produkcyjnym.
- Wywołanie mutacji w wariancie rzucającym wyjątek bez `catch` (unhandled rejection).
- Parsowanie/przypisanie odpowiedzi, której nikt dalej nie konsumuje.

**Dlaczego boli:** użytkownik dostaje formularz, który „nie działa", choć serwer precyzyjnie powiedział, które pole jest złe; błędy znikają w konsoli, do której nikt nie patrzy; unhandled rejection to crash-loteria zależna od środowiska.

**Przypadek z projektu referencyjnego:** generyczny snackbar błędu zjadał szczegółową odpowiedź walidacji 422 — serwer zwracał błędy per-pole, a użytkownik widział tylko ogólnik. W innym handlerze jedyną reakcją na błąd było `console.log('[error]')` — w produkcji. Naprawa: transformer błędów z mapą pól (whitelistą) ustawiający błędy na konkretnych polach formularza, domenowa klasa `ValidationError`, dispatch po **typie** wyjątku; nieprzemapowane komunikaty zbierane i pokazywane osobno — nigdy gubione. Konwencję „mutacja w wariancie async musi mieć obsługę błędu" zamieniono w regułę statycznej analizy.

**ŹLE → DOBRZE:**

```ts
// ŹLE — szczegóły 422 giną, console.log w produkcji
onError: (error) => {
  console.log('[error]', error);
  showSnackbar(t('COMMON.GENERIC_ERROR'));
}

// DOBRZE — dispatch po typie, błędy per-pole, reszta widoczna
onError: (error) => {
  if (isHttp422ValidationError(error)) {
    applyFieldErrors(error, INVOICE_EDIT_FIELD_MAP, form);
    showUnmappedErrors(error); // nieprzemapowane NIE giną
    return;
  }
  showSnackbar(t('INVOICE.EDIT.ERROR'));
}
```

**Kiedy to NIE jest antywzorzec:** świadome zignorowanie błędu jest legalne wyjątkowo — np. best-effort prefetch albo telemetria — ale musi być jawne i skomentowane („celowo ignorujemy: …"), nie domyślne.

**Powiązane reguły:** ./errors.md (feedback każdej mutacji, domenowe klasy błędów, cicha odmowa), ./forms.md (mapowanie błędów 422 na pola), ./conventions-and-tooling.md (reguła lintera na API gubiące błędy, zakaz console.log).

---

## AP-11. Refactor gubiący stany

**Jak rozpoznać (sygnały):**

- W diffie refactoru znika gałąź `if (error)` / komponent error-state bez zamiennika po nowej stronie.
- Z destrukturyzacji wyniku zapytania wypadają `error`/`refetch` (nowy kod konsumuje tylko `data` i `isLoading`).
- Ręcznie przepisana sygnatura degraduje typ (np. precyzyjna unia → `string`) — kompiluje się, więc nikt nie zauważa.

**Dlaczego boli:** error-path jest niewidoczny na happy-path — przeklikanie aplikacji po refactorze niczego nie wykaże; regresja ujawnia się dopiero u użytkownika przy pierwszej awarii sieci/serwera, czyli w najgorszym momencie.

**Przypadek z projektu referencyjnego:** duży, skądinąd udany refactor kalendarza harmonogramu (−492 linie) skasował cały error-state widoku bez zamiennika i odrzucił `error`/`refetch` z destrukturyzacji; przy okazji ręczne przepisanie sygnatury zdegradowało precyzyjny typ rodzaju nieobecności do `string` — wszystko przeszło kompilację i review. Naprawa pół godziny po wykryciu kosztowała +589 linii: przywrócenie error-state z retry, wprowadzenie komponentu-bramki loading/error/content (który czyni **brak** gałęzi strukturalnie widocznym) i test-idy stanów błędów.

**Mechanika zapobiegania:** przed kasacją starego kodu zinwentaryzuj wszystkie jego stany UI (loading/error/empty/success + warianty); każde zapytanie konsumowane po nowej stronie musi mieć zagospodarowane `error` i `refetch`, nie tylko `data`/`isLoading`; plan weryfikacji ustal **przed** zmianą.

**Kiedy to NIE jest antywzorzec:** świadome uproszczenie obsługi stanu (np. sekcja drugorzędna degraduje się do ukrycia zamiast pełnego error-state) jest legalne, jeśli jest decyzją zapisaną w PR, a nie przeoczeniem.

**Powiązane reguły:** ./refactoring.md (inwentaryzacja stanów, plan weryfikacji przed zmianą), ./errors.md (macierz 4 stanów, błąd pierwszego ładowania vs refetchu), ./testing.md (test-idy stanów błędów).

---

## AP-12. Introspekcja propsów dzieci

**Jak rozpoznać (sygnały):**

- Rodzic iteruje po dzieciach i czyta ich propsy przez rzutowanie (`(child.props as X).userId`).
- Logika rodzica łamie się, gdy dziecko zostanie owinięte w jakikolwiek wrapper (memo, error boundary, własny adapter).

**Dlaczego boli:** to ukryty, nietypowany kontrakt zależny od kształtu drzewa, nie od API; każda warstwa pośrednia (wrapper, HOC, slot) cicho psuje zachowanie; nie da się tego wyrazić w typach publicznego API komponentu.

**Przypadek z projektu referencyjnego:** komponent grupujący karty harmonogramu wyciągał `userId` z propsów swoich dzieci przez rzutowanie, żeby koordynować selekcję. Wystarczyło owinąć kartę w dodatkowy komponent, by grupa przestała widzieć identyfikatory. Poprawne kierunki: dzieci **rejestrują się** w kontekście rodzica (legalny, wewnętrzny kontrakt rodziny compound componentu) albo rodzic dostaje listę identyfikatorów zwykłym propsem.

**ŹLE → DOBRZE:**

```tsx
// ŹLE — rodzic grzebie w propsach dzieci
const userIds = childrenOf(group).map(
  (child) => (child as TElement<{ userId: string }>).props.userId);

// DOBRZE — jawny props…
<MemberCardGroup userIds={members.map((m) => m.id)}>{cards}</MemberCardGroup>
// …albo rejestracja dziecka w kontekście grupy
function MemberCard({ userId }) {
  useGroupRegistration(userId); // no-op poza grupą (tryb standalone)
  // ...
}
```

**Kiedy to NIE jest antywzorzec:** kontekst wewnętrzny rodziny compound componentu (grupa↔element) jest częścią jej projektowanego API i jest w porządku — antywzorcem jest czytanie propsów dzieci „od zewnątrz", poza jawnym kontraktem.

**Powiązane reguły:** ./components.md (compound components, kontrakt przez propsy/kontekst rodziny).

---

## AP-13. Inline duplikowanie kształtu danych w feature

**Jak rozpoznać (sygnały):**

- Feature deklaruje lokalnie typ/interfejs strukturalnie identyczny z typem już wystawianym przez warstwę danych.
- Po zmianie kontraktu API kompilator nie wskazuje wszystkich miejsc do poprawy (bo część używa lokalnej kopii typu).

**Dlaczego boli:** złamane single source of truth — kopia typu cicho rozjeżdża się z kontraktem; zgodność strukturalna maskuje dryf do momentu, gdy pola przestają się pokrywać i błąd wychodzi w runtime.

**Przypadek z projektu referencyjnego:** mapper w featurze przepisał lokalnie strukturalny typ użytkownika zamiast zaimportować typ wyprowadzony ze schematu w warstwie danych. Typy były „takie same" — do pierwszej zmiany kontraktu.

**ŹLE → DOBRZE:**

```ts
// ŹLE — lokalna kopia kształtu
interface IMappedUser { id: string; fullName: string; role: string }
function toOption(user: IMappedUser) { /* ... */ }

// DOBRZE — import jedynego źródła prawdy; zawężenie przez Pick, nie kopię
import type { TUser } from '@app/data/users';
function toOption(user: Pick<TUser, 'id' | 'fullName'>) { /* ... */ }
```

**Kiedy to NIE jest antywzorzec:** komponent współdzielony **celowo** definiuje własny, minimalny model UI niezależny od warstwy danych (mapowanie robi konsument) — to świadome odcięcie od aplikacji, nie przypadkowa kopia. Różnica: kierunek zależności i intencja, nie sama obecność drugiego typu.

**Powiązane reguły:** ./data-and-state.md (typ wyprowadzony ze schematu jako jedyne źródło), ./components.md (własny model UI komponentu współdzielonego), ./architecture.md (granice warstw).

---

## AP-14. `any` + „TODO types" pod presją czasu

**Jak rozpoznać (sygnały):**

- `any` (lub `as unknown as`) w świeżo wydzielonym, **współdzielonym** kodzie, z komentarzem `// TODO types`.
- Nieużywane propsy w nowym publicznym API (zaprojektowane „na zaś", nikt ich nie podpiął).

**Dlaczego boli:** `any` w kodzie współdzielonym zaraża wszystkich konsumentów (wyłącza sprawdzanie na całej ścieżce); „TODO później" w praktyce znaczy „nigdy" — kolejne PR-y budują na dziurze i koszt domknięcia typów rośnie; martwe propsy w API to obietnice, których nikt nie dotrzymuje, a każdy czytelnik musi je rozszyfrować.

**Przypadek z projektu referencyjnego:** podczas ekstrakcji generycznego rdzenia listy pod presją czasu referencja do API grida dostała typ `any` z adnotacją TODO, a w publicznym interfejsie wylądowały nieużywane propsy `onRefresh`/`isRefreshing`. Oba braki trzeba było domykać osobnymi zmianami — drożej niż w PR ekstrakcji, bo doszli już konsumenci. Reguła: typowanie domykasz **w tym samym PR**, w którym wydzielasz; propsy bez konsumenta usuwasz przed merge.

**Kiedy to NIE jest antywzorzec:** `any`/`unknown` na **granicy** z nietypowaną biblioteką third-party, natychmiast zawężone type-guardem lub schematem w jednym miejscu adaptera — to kontrolowana śluza, nie dziura. `unknown` > `any` zawsze, gdy się da.

**Powiązane reguły:** ./conventions-and-tooling.md (zakaz `any` w lincie), ./refactoring.md (refactor tnij na kroki, ale każdy krok kompletny), ./data-and-state.md (adapter third-party w jednym miejscu).

---

## AP-15. Przenoszenie martwego kodu w refactorze

**Jak rozpoznać (sygnały):**

- W diffie przenosin (move/rename) wędrują funkcje/komponenty, których nikt nie wywołuje.
- Eksporty bez konsumenta przeżywają migrację do nowej struktury.

**Dlaczego boli:** przeniesienie legitymizuje martwy kod („skoro ktoś go przeniósł, to chyba jest potrzebny") i resetuje jego licznik podejrzliwości; nowa struktura rodzi się już zaśmiecona; review przenosin jest trudniejsze, bo miesza relokację z oceną zasadności.

**Przypadek z projektu referencyjnego (uniknięty):** podczas rozbicia monolitycznej warstwy danych 38-liniowa mutacja resetu zadania okazała się nigdzie nieużywana — zamiast przemigrować ją do nowej struktury, skasowano ją **osobnym commitem** przed przenosinami. Osobny commit czyni kasację widoczną i tanio odwracalną, a diff przenosin zostaje czysty.

**Mechanika:** przed move/rename przejdź po eksportach i sprawdź konsumentów; martwe usuwaj osobnym commitem „chore: remove dead code" PRZED relokacją; ujemny diff netto refactoru to sygnał zdrowia.

**Kiedy to NIE jest antywzorzec:** kod chwilowo nieużywany, ale będący częścią publicznego kontraktu w trakcie migracji strangler (stara fasada), wolno przenieść — z jawną adnotacją i datą/warunkiem usunięcia.

**Powiązane reguły:** ./refactoring.md (refactor = zachowanie zachowań + delete, małe tematyczne commity), ./conventions-and-tooling.md (proces git/PR).

---

## AP-16. N równoległych zapytań różniących się parametrem po małym zbiorze

**Jak rozpoznać (sygnały):**

- Ten sam hook zapytania wywołany kilkukrotnie w jednym widoku z różnym filtrem (`useTeamSchedule('manager')`, `useTeamSchedule('developer')`, …).
- Zwielokrotnione stany: N loadingów, N errorów, N refetchy do skoordynowania; sklejanie flag jak w AP-1.

**Dlaczego boli:** eksplozja stanu i ruchu sieciowego dla danych, które serwer i tak zwróciłby w jednej odpowiedzi; spójność między „kawałkami" tego samego zbioru nie jest gwarantowana (różne momenty pobrania).

**Przypadek z projektu referencyjnego:** widok harmonogramu zespołu wykonywał 3 zapytania o ten sam tygodniowy harmonogram — po jednym na rolę — co dawało 3 requesty, 3 loadingi i 3 niezależne error-state'y. Zamieniono to na **jedno** zapytanie + czyste, memoizowane selektory filtrujące w pamięci. Uwaga: w innym miejscu tego samego systemu (duża, stronicowana lista) filtr roli słusznie pozostał **parametrem zapytania** i częścią klucza cache — wybór zależy od rozmiaru zbioru.

**ŹLE → DOBRZE:**

```ts
// ŹLE — 3 requesty o ten sam mały zbiór
const managers = useTeamSchedule({ role: 'manager' });
const developers = useTeamSchedule({ role: 'developer' });
const testers = useTeamSchedule({ role: 'tester' });

// DOBRZE — jedno zapytanie + selekcja w pamięci
const schedule = useTeamSchedule({ week });
const byRole = useMemo(() => groupByRole(schedule.data), [schedule.data]);
```

**Kiedy to NIE jest antywzorzec:** zbiór duży, stronicowany lub sortowany serwerowo → filtr **musi** być parametrem zapytania (i kluczem cache); filtrowanie dużych list w kliencie nie skaluje się. To reguła dwuwarunkowa — szczegóły: ./data-and-state.md (filtrowanie klient vs serwer).

**Powiązane reguły:** ./data-and-state.md (reguła warunkowa filtrowania, klucze cache), ./components.md (kolokacja fetch — ale nie kosztem multiplikacji zapytań o ten sam zbiór).

---

## AP-17. `shared` jako śmietnik i globalny stan „na skróty"

**Jak rozpoznać (sygnały):**

- Do `shared/` trafiają rzeczy, dla których po prostu nie było pomysłu na lokalizację (jeden konsument, nazwa domenowa w „shared").
- Współdzielenie danych między ekranami realizowane przez globalny store/kontekst aplikacyjny zamiast cache zapytań lub URL.
- `shared` importuje cokolwiek z modułów domenowych.

**Dlaczego boli:** `shared`-śmietnik staje się zależnością wszystkich od wszystkiego — koniec modularności i lazy loadingu (wszystko ciągnie wszystko); globalny stan „bo dwa ekrany potrzebują tych samych danych" duplikuje odpowiedzialność cache zapytań i wprowadza drugi, rozjeżdżający się obieg prawdy; w projekcie referencyjnym właśnie ta presja („wrzućmy do shared / do globalnego stanu, będzie szybciej") była stałym zagrożeniem trzymanym w ryzach wyłącznie regułami granic w lincie.

**Mechanika decyzji:** zanim coś trafi do `shared`, policz konsumentów (≥2 realnych, z różnych modułów) i sprawdź, że rzecz nie zna domeny; dane serwera współdziel przez cache zapytań (ten sam klucz = ten sam wpis), stan widoku przez URL, preferencje przez storage — globalny stan kliencki tylko dla wąskich, nazwanych providerów (sesja, motyw, flagi) z uzasadnieniem.

**ŹLE → DOBRZE (przepływ, nie kod):** „ekran A i B potrzebują listy klientów" → ŹLE: lista w globalnym store, A zapisuje, B czyta. DOBRZE: oba ekrany wołają to samo zapytanie z tym samym kluczem cache; biblioteka cache'u deduplikuje request i utrzymuje świeżość.

**Kiedy to NIE jest antywzorzec:** `shared` z jasnym kontraktem (design-system, utils dat, helpery test-idów) jest fundamentem, nie śmietnikiem — różnica to brak wiedzy domenowej i realna liczba konsumentów. Mały, dedykowany provider globalnego stanu UI (motyw, sesja) jest legalny.

**Powiązane reguły:** ./architecture.md (granice modułów, kierunek zależności, kryteria wejścia do shared), ./data-and-state.md (stan serwera w cache zapytań, trzy adresy stanu widoku).

---

## AP-18. Hardcodowana ścieżka route'a w głębokich komponentach

**Jak rozpoznać (sygnały):**

- Pełna ścieżka route'a (`'/projects/$projectId/tasks'`) powtórzona literałem w wielu plikach, w tym w komponentach prezentacyjnych.
- Komponent czyta parametry URL głęboko w drzewie — i przez to jest nierenderowalny poza konkretnym route'em (testy, katalog komponentów, reużycie wymagają mockowania routera).

**Dlaczego boli:** zmiana struktury URL to polowanie po całym repo; komponenty prezentacyjne zyskują ukrytą zależność od infrastruktury routingu; literały ścieżek rozjeżdżają się po cichu (jedna literówka = martwy link).

**Przypadek z projektu referencyjnego:** pełna ścieżka route'a szczegółów była zahardcodowana w 3+ sekcjach strony, a parametry URL czytano w głębi drzewa. Po refactorze parametr czytany jest **raz**, na szczycie feature'a, walidowany i przekazywany w głąb jako zwykły props (`projectId`); ścieżki nawigacji pochodzą z typowanych fabryk, nie z literałów.

**ŹLE → DOBRZE:**

```tsx
// ŹLE — głęboka sekcja zna URL
function TaskRow({ task }) {
  const { projectId } = useRouteParams('/projects/$projectId/tasks');
  return <Link to={`/projects/${projectId}/tasks/${task.id}`}>{task.name}</Link>;
}

// DOBRZE — parametr czytany raz na szczycie, ścieżki z fabryki
function ProjectTasksPage() {
  const { projectId } = useValidatedRouteParams(); // jedyne miejsce
  return <TaskList projectId={projectId} />;
}
function TaskRow({ projectId, task }) {
  return <Link to={routes.task.detail(projectId, task.id)}>{task.name}</Link>;
}
```

**Kiedy to NIE jest antywzorzec:** komponent będący z definicji częścią warstwy routingu (route component, guard, layout route'owy) zna URL — to jego rola. Antywzorcem jest wiedza o URL w komponentach prezentacyjnych i sekcjach.

**Powiązane reguły:** ./components.md (zależność od routingu czytana raz, na granicy feature), ./data-and-state.md (stan semantyczny widoku w URL — ale przez warstwę serializacji, nie literały), ./architecture.md (fabryki ścieżek).

---

## Jak używać tego katalogu w review

1. Przejdź sygnały AP-1…AP-18 po diffie — większość jest wykrywalna bez kontekstu całego repo (flagi boolean na współdzielonym komponencie, literały hex, znikające `error`/`refetch`, pliki `* copy`, `any` z TODO).
2. Każde trafienie konfrontuj z sekcją „Kiedy to NIE jest antywzorzec" — te reguły są gradientowe, nie binarne; zgłoszenie bez sprawdzenia granicy to false positive, a false positives erodują zaufanie do całego review (./conventions-and-tooling.md).
3. W komentarzu review podawaj ID antywzorca i kierunek naprawy (wzorzec DOBRZE), nie tylko diagnozę.
4. Co da się wyrazić statycznie — zgłaszaj jako kandydata na regułę lintera, żeby następnym razem złapała to maszyna (./conventions-and-tooling.md — automatyzacja egzekwowania).
