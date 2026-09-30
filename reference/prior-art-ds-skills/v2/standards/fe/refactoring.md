# Refactoring — mechanika bezpiecznej zmiany

Refactor to zachowanie zachowań plus delete. Nie jest to „przepisanie na ładniej" — to operacja na żywym systemie, która ma jawny plan weryfikacji, kończy się skasowaniem starych ścieżek i zostawia kod mniejszy, niż go zastała. Reguły poniżej wyprowadzono z analizy serii refactorów projektu referencyjnego — w tym z jednej kosztownej regresji, opisanej w REF-2.

Powiązane: macierz 4 stanów widoku (./errors.md), inwentaryzacja przez test-idy i mocki (./testing.md), granice modułów które czynią korektę kursu tanią (./architecture.md), progi abstrakcji (./components.md), katalog antywzorców przed/po (./antipatterns.md).

---

## REF-1. Plan weryfikacji ustalany PRZED zmianą

**Reguła**: Zanim dotkniesz kodu, spisz, jak udowodnisz, że zachowanie się nie zmieniło: które scenariusze przeklikasz, które testy muszą przejść, które stany widoku obejrzysz. Plan powstaje przed pierwszą edycją, nie po niej.

**Dlaczego**: Plan pisany po zmianie jest weryfikacją tego, co napisałeś, a nie tego, co było. Mózg sprawdza ścieżki, które właśnie zaimplementował — czyli happy path. Wszystko, czego nowy kod nie obsługuje, nie istnieje w głowie autora, więc nie trafi też do „weryfikacji po fakcie".

**Przykład** — plan dla refactoru sekcji listy faktur (przed pierwszą edycją):

```text
Scenariusze do weryfikacji po zmianie:
1. Lista z danymi: sort po terminie płatności działa, kwoty sformatowane.
2. Lista pusta: stan empty z guidance (nie goły tekst).
3. Błąd pierwszego ładowania: pełny error-state + retry.
4. Błąd odświeżenia przy istniejących danych: dane zostają, dyskretny sygnał.
5. Mutacja "oznacz jako opłaconą": feedback sukces/błąd, lista i licznik odświeżone.
Testy: istniejące testy integracyjne sekcji muszą przejść bez modyfikacji asercji.
```

Jeśli punktu nie da się spisać, bo nie wiesz, jak stary kod się zachowuje — to sygnał, że nie rozumiesz jeszcze kodu na tyle, by go refactorować.

**Wyjątki**: Zmiany czysto mechaniczne (rename, przeniesienie pliku, substytucja tokenów) — tam planem jest „kompiluje się + testy zielone + diff to czysta substytucja" (patrz REF-7).

---

## REF-2. Inwentaryzacja wszystkich stanów UI starego kodu przed kasacją

**Reguła**: Przed skasowaniem starego komponentu wypisz komplet jego stanów (loading / error / empty / success, plus stany blokad i odświeżania) i odhacz każdy w nowym kodzie. Każde zapytanie konsumowane w nowym kodzie musi mieć zagospodarowane `error` i `refetch`, nie tylko `data` i `loading`.

**Dlaczego**: Error-path jest niewidoczny na happy-path. Podczas przepisywania komponentu pracujesz na działającym backendzie i poprawnych danych — gałąź błędu nigdy się nie renderuje, więc „nie boli", gdy znika. Kompilator tego nie złapie, jeśli przy okazji odrzucisz `error`/`refetch` z destrukturyzacji wyniku zapytania. Review też tego nie łapie: recenzent widzi usunięte linie, ale nie wie, że nic ich nie zastępuje.

**Studium przypadku** (projekt referencyjny): duży refactor widoku kalendarzowego harmonogramu zespołu — konsolidacja dwóch zduplikowanych implementacji w komponowalny komponent — był wzorcowy pod każdym względem poza jednym: stary widok miał pełny error-state z możliwością ponowienia, a nowy kod odrzucił `error` i `refetch` z destrukturyzacji i nie wyrenderował żadnego zamiennika. Przy okazji ręczne przepisanie sygnatury zdegradowało typ domenowy do gołego `string` — i to też przeszło kompilację oraz review. Naprawa, wykonana pół godziny po wykryciu, kosztowała **więcej linii niż cały refactor zaoszczędził**: trzeba było przywrócić error-state z retry, wprowadzić komponent-bramkę loading/error/content i dodać test-idy stanów błędów, których wcześniej nie było (więc regresji nie dało się wykryć ani pokryć testem — szczegóły: ./testing.md, ./errors.md).

```ts
// ŹLE — refactor "upraszcza" destrukturyzację i gubi dwa stany:
const { data, isLoading } = useTeamScheduleQuery(weekId);

// DOBRZE — komplet jest konsumowany, a brak gałęzi byłby widoczny:
const { data, isLoading, error, refetch } = useTeamScheduleQuery(weekId);
return (
  <SectionGate loading={isLoading} error={error} onRetry={refetch}>
    <ScheduleGrid days={data.days} />
  </SectionGate>
);
```

Komponent-bramka (gate) jest tu nie tylko DRY — czyni **brak** gałęzi widocznym strukturalnie: nieprzekazany props `error` rzuca się w oczy w review, w przeciwieństwie do niewyrenderowanego warunku.

**Wyjątki**: Brak. To najtańsza checklista o najwyższym zwrocie w całym zestawie.

---

## REF-3. Duży refactor tnij na kroki: ekstrakcja → przepięcie → kasacja

**Reguła**: Każdy krok zostawia system w stanie działającym i osobno recenzowalnym: (1) **ekstrakcja** — nowy kod powstaje obok starego, stary nietknięty; (2) **przepięcie** — konsumenci migrują na nowy kod, jeden po drugim; (3) **kasacja** — stary kod znika, razem ze swoim wpisem w publicznym API modułu.

**Dlaczego**: Jeden gigantyczny commit „przepisałem moduł" jest nierecenzowalny i nieodwracalny — przy regresji jedyną opcją jest revert całości. Kroki dają punkty kontrolne: po ekstrakcji można porównać nowy kod ze starym side-by-side; po przepięciu każdego konsumenta można zweryfikować jego scenariusze; kasacja jest wtedy trywialnym, czysto ujemnym diffem.

**Przykład** — konsolidacja dwóch rozjechanych implementacji listy zadań:

```text
Commit 1 (ekstrakcja):  TaskListBase powstaje w shared/ feature'a;
                        żaden konsument go jeszcze nie używa.
Commit 2 (przepięcie):  lista zadań aktywnych przechodzi na TaskListBase.
Commit 3 (przepięcie):  lista zadań zarchiwizowanych przechodzi na TaskListBase.
Commit 4 (kasacja):     obie stare implementacje + ich eksporty usunięte. Diff: −410 linii.
```

**Wyjątki**: Mały refactor (jeden plik, jeden konsument) nie wymaga ceremonii trzech kroków — ale nadal wymaga REF-1 i REF-2.

---

## REF-4. Migracja współdzielonych kontraktów przez fasadę kompatybilności (strangler)

**Reguła**: Gdy migrujesz kontrakt konsumowany przez wiele modułów (ścieżki endpointów, fabryki kluczy cache, stałe uprawnień), nie przepinaj wszystkich konsumentów naraz. Wystaw nową, docelową strukturę, a stare nazwy zachowaj jako cienką fasadę delegującą do nowej. Nowy kod pisze się wyłącznie przeciw nowemu API; fasada znika, gdy ostatni konsument zmigruje — i ma właściciela oraz termin.

**Dlaczego**: Big-bang na kontrakcie współdzielonym przez N modułów to PR dotykający N obszarów naraz — konflikt-magnet, nierecenzowalny, blokujący pracę zespołu. Fasada pozwala migrować konsument po konsumencie, w osobnych, małych PR-ach, bez zamrażania reszty repo.

**Przykład** — rozbicie jednego globalnego pliku ścieżek API na typowane obiekty per zasób:

```ts
// Nowe, docelowe API (per zasób):
export const invoicePaths = {
  list: () => '/invoices',
  detail: (id: string) => `/invoices/${id}`,
} as const;

// Fasada kompatybilności — stare nazwy delegują, nic nie duplikują:
/** @deprecated Migracja na invoicePaths — usunąć po przepięciu modułu rozliczeń. */
export const API_PATHS = {
  INVOICE_LIST: invoicePaths.list(),
  INVOICE_DETAIL: invoicePaths.detail,
};
```

**Wyjątki**: Kontrakt z 1–2 konsumentami — przepnij wprost, fasada to zbędny krok. Fasada bez planu kasacji nie jest strangler patternem, tylko drugim, równoległym API na stałe.

---

## REF-5. Refactor kończy się delete; ujemny diff netto jako sygnał zdrowia

**Reguła**: Refactor jest skończony, gdy stare ścieżki kodu są skasowane — razem z eksportami, tłumaczeniami, stylami i test-idami, które obsługiwały tylko je. Ujemny diff netto traktuj jako domyślne oczekiwanie i sygnał zdrowia; dodatni diff w PR opisanym jako „refactor" wymaga uzasadnienia w opisie.

**Dlaczego**: Refactor bez kasacji to duplikacja: dwie implementacje, z których „stara już nieużywana" — do czasu, aż ktoś ją znajdzie i użyje. W projekcie referencyjnym stara wersja komponentu wyboru wielokrotnego przeżyła usunięcie swojej następczyni właśnie dlatego, że kasację odłożono; równoległe duplikaty (dwa komponenty statusu, dwie listy, dwa kalendarze) za każdym razem zaczynały się od „skopiuję na chwilę". Wskaźnik liczbowy nie jest dogmatem, ale działa jak alarm: refactor, który dodał 800 linii, prawie na pewno czegoś nie skasował albo zbudował abstrakcję na zapas.

**Przykład**: Konsolidacja kalendarza z REF-2 zamknęła się diffem ok. −500 linii — to był poprawny sygnał. Ale uwaga na drugą stronę medalu: naprawa zgubionych stanów dodała potem ~+600 linii **zasadnie**. Ujemny diff jest sygnałem zdrowia tylko razem z kompletną inwentaryzacją stanów — kasacja gałęzi błędu też daje ujemny diff.

**Wyjątki**: Refactor, którego celem jest *dopisanie* brakujących stanów lub testów do istniejącego kodu, ma z natury dodatni diff — nazwij go wtedy uczciwie w opisie PR.

---

## REF-6. Martwy kod usuwasz osobnym commitem — nigdy nie migrujesz

**Reguła**: Gdy podczas refactoru znajdziesz kod nieużywany (funkcję bez wywołań, props nieprzekazywany, mutację bez konsumenta), nie przenoś go do nowej struktury. Usuń go osobnym, czysto ujemnym commitem przed właściwym refactorem.

**Dlaczego**: Przeniesienie martwego kodu do nowej struktury **legitymizuje go**: dostaje nową ścieżkę, świeży import, pozorny powód istnienia — i następny czytelnik założy, że skoro go zmigrowano, to żyje. Osobny commit kasujący jest poza tym trywialny w review („nikt tego nie woła" da się sprawdzić w minutę) i trywialny w revercie, gdyby założenie o martwości okazało się błędne.

**Przykład**: W projekcie referencyjnym, podczas reorganizacji warstwy danych, kilkudziesięcioliniowa mutacja resetu zadania nie miała żadnego konsumenta. Pokusa: przenieść ją razem z resztą mutacji do nowego katalogu („może się przyda"). Wykonano zamiast tego osobny commit `chore: remove unused task-reset mutation` — i właściwy refactor stał się mniejszy i czytelniejszy.

**Wyjątki**: Kod nieużywany, ale będący częścią świadomie zaprojektowanego publicznego API biblioteki współdzielonej (kontrakt na przyszłość) — to decyzja projektowa, nie martwy kod; powinna mieć udokumentowane uzasadnienie.

---

## REF-7. Zmiany mechaniczne osobno od semantycznych

**Reguła**: Substytucje 1:1 (rename, przeniesienie plików, zamiana literałów na tokeny, formatowanie, sort importów) commituj osobno od zmian zachowania. Czysty rename rób narzędziem VCS tak, by historia i wykrywanie podobieństwa przetrwały.

**Dlaczego**: Review zmiany mechanicznej to skan wzorca: 150 linii „literał px → token" sprawdza się w dwie minuty, *pod warunkiem*, że nic innego się tam nie ukrywa. Jedna semantyczna zmiana wciśnięta w mechaniczny diff jest praktycznie niewykrywalna — recenzent przestawił już mózg na tryb wzorca. Odwrotnie też: refactor logiki zaśmiecony rename'ami 40 plików zakopuje istotne 30 linii.

**Przykład** — migracja na design tokens jako przygotowanie pod RWD (./styling.md):

```text
Commit 1: chore(theme): zamiana literałów spacing na tokeny (substytucja, zero logiki)
          148 plusów / 148 minusów — diff czysto symetryczny, review w 2 minuty.
Commit 2: feat(schedule): breakpointy w siatce harmonogramu (semantyka, mały diff)
```

W projekcie referencyjnym ta dyscyplina była warunkiem wykonalności: migracja tokenów dotykała ~60 plików i tylko jako osobny, mechaniczny commit dała się rzetelnie zrecenzować.

**Wyjątki**: Rename będący *konsekwencją* zmiany roli (komponent robi teraz co innego, więc nazywa się inaczej) należy do commita semantycznego — rozdzielenie go zakłamałoby historię.

---

## REF-8. Korekta kursu w trakcie jest tania — pod warunkiem egzekwowanych granic

**Reguła**: Gdy w połowie refactoru widzisz, że przyjęty podział jest zły (moduł wylądował w złej warstwie, granica przebiega w poprzek spójnego pojęcia), cofnij go w tym samym PR zamiast doprowadzać zły plan do końca. Warunkiem taniości tej operacji są maszynowo egzekwowane granice modułów (./architecture.md) — to one gwarantują, że przesunięcie kodu nie zerwie ukrytych zależności.

**Dlaczego**: Koszt zmiany decyzji rośnie skokowo po merge'u: dochodzą konsumenci, przyzwyczajenia, importy w cudzych branchach. W trakcie PR koszt to godzina przesuwania plików. „Skoro już zacząłem, dokończę" to sunk cost fallacy zamieniona w architekturę.

**Przykład** (projekt referencyjny): słownik statusów domenowych najpierw wyjechał do osobnego mikro-modułu „na statusy" — w trakcie PR okazało się, że to sztuczny byt bez własnej tożsamości. Zamiast brnąć, statusy wróciły do modułu rdzeniowego warstwy danych, a współdzielenie z sąsiednim modułem tej samej warstwy rozwiązano jawną, jednokierunkową relacją core←context zapisaną w regułach lintera. Ponieważ wszystkie zależności były egzekwowane statycznie, przesunięcie sprowadziło się do poprawienia importów, które wskazał linter — korekta kursu kosztowała ułamek tego, co kosztowałoby utrzymywanie złego podziału.

**Wyjątki**: Korekta, która zmienia *zakres* PR (z refactoru sekcji robi się refactor warstwy) — wtedy zamknij PR w spójnym stanie pośrednim i otwórz nowy z nowym planem (REF-1).

---

## REF-9. Odwaga cofania błędnej generalizacji

**Reguła**: Gdy komponent wyniesiony do biblioteki współdzielonej zaczyna obrastać parametrami obsługującymi potrzeby jednego konsumenta, cofnij ekstrakcję: przenieś go z powrotem do feature'a, który go faktycznie używa. Deekstrakcja jest pełnoprawnym refactorem, nie porażką.

**Dlaczego**: Błędna generalizacja jest droższa niż duplikacja: każdy konsument płaci złożonością parametrów, których nie potrzebuje, a każda zmiana wymaga negocjacji między rozjeżdżającymi się potrzebami. Progi abstrakcji (ekstrakcja przy 2–3 realnych konsumentach — ./components.md) działają w obie strony: gdy liczba *prawdziwych* konsumentów spada do jednego albo ich potrzeby przestają być wspólne, podstawa ekstrakcji znika.

**Przykład** (projekt referencyjny): komponent nawigacji po zakresach dat został wyniesiony do biblioteki współdzielonej razem z większym widokiem zespołowym. Po kilku tygodniach potrzeby jedynego realnie aktywnego konsumenta rozjechały się z „uniwersalnym" API komponentu. Zamiast dokładać flagi konfiguracyjne, komponent selektywnie wrócił do feature'a — reszta wyniesionej biblioteki została, bo jej akurat dotyczyły wspólne potrzeby. Lekcja: generalizacja nie jest dogmatem i nie musi być cofana w całości.

```text
ŹLE:    DateRangeNavigator zostaje w shared i dostaje
        props "mode: 'week' | 'sprint' | 'custom'" + 4 callbacki opcjonalne,
        z których każdy konsument używa innego podzbioru.
DOBRZE: DateRangeNavigator wraca do feature-team-schedule;
        shared zachowuje tylko prymitywy faktycznie wspólne.
```

**Wyjątki**: Komponent w bibliotece publikowanej na zewnątrz zespołu — tam cofnięcie to breaking change i wymaga procesu deprecjacji (fasada z REF-4).

---

## REF-10. Typowanie domykane w tym samym PR

**Reguła**: Ekstrakcja lub przepisanie kodu nie może obniżać jakości typów: żadnych `any`, `// TODO: types`, degradacji typu domenowego do prymitywu ani nieużywanych propsów „na przyszłość". Jeśli presja czasu wymusza skróty, domknięcie typów jest zadaniem w *tym samym* PR — nie biletem do backlogu.

**Dlaczego**: `any` wprowadzone „na chwilę" w świeżo wydzielonym module staje się fundamentem, na którym buduje każdy kolejny konsument — i koszt domknięcia rośnie z każdym dniem. Degradacja typu domenowego do `string`/`number` jest gorsza niż jawny `any`, bo wygląda na otypowaną: kompilator i review przepuszczą ją bez mrugnięcia (dokładnie to stało się w studium z REF-2 — `string` w miejscu unii literałów dni wolnych).

**Przykład** (projekt referencyjny): generyczna baza listy wydzielona pod presją czasu zawierała `readonly gridRef: any` z komentarzem TODO oraz parę nieużywanych propsów odświeżania. Oba skróty przeszły do main i czekały na „kiedyś". Poprawna wersja tego samego ruchu:

```ts
// ŹLE — ekstrakcja "na szybko":
interface ITaskListBaseProps {
  readonly gridRef: any; // TODO: types
  readonly onRefresh?: () => void;   // nikt nie przekazuje
}

// DOBRZE — typ z biblioteki źródłowej, props dopiero gdy istnieje konsument:
interface ITaskListBaseProps {
  readonly gridRef: RefObject<GridApi>;
}
```

**Wyjątki**: Granica z nietypowaną biblioteką zewnętrzną — tam `unknown` + zawężenie type-guardem na własnej granicy modułu, nigdy `any` propagowane w głąb.

---

## Lekcje z refactorów projektu referencyjnego

Tabela destyluje serię realnych refactorów do formy: sytuacja → problem → rozwiązanie → reguła. Przykłady przepisano na neutralną domenę; reguły spoza tego pliku wskazują właściwy dokument.

| Sytuacja | Problem | Rozwiązanie | Reguła |
|---|---|---|---|
| Monolityczny moduł warstwy danych (faktury + użytkownicy + role + uprawnienia, indeks publiczny 600+ linii) | Każda zmiana w dowolnej subdomenie tykała wszystko: konflikty, pseudo-zależności, wolny build | Podział na moduły per subdomena, z macierzą dozwolonych zależności w linterze w tym samym PR | ./architecture.md — tnij po subdomenach, granice w CI |
| Automat typów mapujący konwencje nazewnicze API (260+ linii rekurencyjnych typów warunkowych z `any`) | Nieczytelne błędy kompilacji, ukryte mapowanie, niemożliwy debugging | Skasowany w całości na rzecz jawnych transformacji pole-po-polu; z automatu zostały 4 mikro-helpery | ./data-and-state.md — nudne jawne mapowanie > magia; tu: REF-5 (kasacja) |
| Stała mapowania błędów formularza *tworzenia* użyta w mutacji *edycji* (copy-paste) | Błędy walidacji edycji mapowane na pola nieistniejące w tym formularzu | Per-use-case komplet artefaktów z typowaną unią ścieżek | ./forms.md, ./architecture.md |
| Globalny plik-śmietnik ścieżek API i kluczy cache | Konflikt-magnet, każda domena edytowała wspólny plik | Typowane fabryki per zasób + fasada kompatybilności na czas migracji konsument-po-konsumencie | REF-4; ./data-and-state.md |
| Słownik statusów wyniesiony do osobnego mikro-modułu | Sztuczny byt; podział okazał się zły jeszcze w trakcie PR | Powrót do modułu rdzeniowego + jawna relacja core←context w linterze; korekta w tym samym PR | REF-8 |
| Root widoku szczegółów projektu z 9 zapytaniami i loadingiem złożonym z 9 flag | God root blokował render gotowych sekcji, nieutrzymywalny | Kolokacja pobierania danych przy sekcjach; root pobiera tylko zasób krytyczny | ./components.md; kroki wg REF-3 |
| Dwa zduplikowane widoki kalendarza harmonogramu + monolityczna karta osoby (270+ linii: stan + mutacje + render) | Implementacje rozjeżdżały się; flagi boolean na monolicie | Komponowalny komponent + hooki akcji, stan widoku do URL; diff ok. −500 linii | ./components.md, ./data-and-state.md; REF-5 |
| Ten sam refactor kalendarza zgubił cały error-state i zdegradował typ domenowy do `string` | Error-path niewidoczny na happy-path; przeszło kompilację i review | Naprawa (~+600 linii): error-state z retry, komponent-bramka loading/error/content, test-idy stanów błędów | REF-2, REF-10; ./errors.md, ./testing.md |
| Trzy booleany + nullable payload sterujące dwoma modalami dnia wolnego | Reprezentowalne stany niemożliwe; 4 handlery do utrzymania | Unia dyskryminowana `closed \| set \| remove`; −21 linii | ./data-and-state.md; REF-5 (mały refactor też kończy się ujemnym diffem) |
| 6+ równoległych implementacji znacznika statusu, w tym kopia bajt-w-bajt i wersja z literałami kolorów | Każda poprawka × 6, rozjazd wizualny | Jedno źródło: zamknięta unia + type-guard + wyczerpujący `Record` (brak wpisu = błąd kompilacji) | ./antipatterns.md; REF-5 |
| Rejestr modułów zbudowany, gdy istniał jeden wariant (N=1) | Spekulatywna abstrakcja: 70+ linii infrastruktury bez drugiego konsumenta | Usunięty na rzecz prostej konfiguracji; rejestr wrócił zasadnie dopiero przy ponad 20 wariantach | REF-9; ./components.md — progi abstrakcji |
| Dwie kopie komponentu załączników + 200-liniowy martwy hook + pomylone identyfikatory `id`/`tmpId` | Duplikaty rozjechane, realny bug identyfikatorów | Deduplikacja; unia dyskryminowana plik-nowy/plik-istniejący z type-guardem; rozróżnienie id na poziomie typów | ./data-and-state.md; REF-6 (martwy hook usunięty, nie migrowany) |
| Nawigator zakresu dat wyniesiony do shared; potrzeby jedynego konsumenta rozjechały się z „uniwersalnym" API | Komponent współdzielony obrastał parametrami jednego klienta | Selektywne cofnięcie ekstrakcji — komponent wrócił do feature'a, reszta biblioteki została | REF-9 |
| Nieużywana mutacja resetu zadania znaleziona podczas reorganizacji warstwy danych | Pokusa przeniesienia do nowej struktury legitymizowałaby martwy kod | Skasowana osobnym, czysto ujemnym commitem przed właściwym refactorem | REF-6 |
| Setki literałów px w ~60 plikach blokujące pracę nad RWD | Koszt odkładania rósł liniowo z liczbą plików | Mechaniczna migracja na design tokens jako osobne commity bez zmian logiki | REF-7; ./styling.md |
| Generyczna baza listy wydzielona pod presją czasu z `any` i nieużywanymi propsami | „Domkniemy typy później" — później nie nadeszło samo | Typowanie i czyszczenie propsów jako warunek merge'u tego samego PR | REF-10 |
| Słownik 4 polityk świeżości cache zerodował po kilku miesiącach do 1 wpisu | Wartości polityk żyją krócej niż reguła centralizacji | Centralizacja została (erozja przynajmniej widoczna w jednym pliku); wartości oznaczane datą migawki | ./data-and-state.md; meta-lekcja: rozróżniaj trwałość reguły od trwałości wartości |

---

## Minimalny rytuał refactoru (TL;DR)

1. **Przed**: plan weryfikacji (REF-1) + inwentaryzacja stanów starego kodu (REF-2).
2. **W trakcie**: kroki ekstrakcja → przepięcie → kasacja (REF-3); kontrakty współdzielone przez fasadę (REF-4); mechaniczne osobno od semantycznych (REF-7); martwy kod osobnym commitem (REF-6); zły podział cofaj od razu (REF-8).
3. **Po**: stare ścieżki skasowane, diff netto ujemny albo uzasadniony (REF-5), typy domknięte (REF-10), plan weryfikacji z punktu 1 odhaczony co do stanu.
