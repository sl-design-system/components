# Checklist startowy nowego projektu

Wykonywalny checklist „dnia zero": fundamenty, które muszą stać **przed pierwszym feature'em**, plus reguły pracy zespołowej do wklejenia do standardów zespołu i instrukcji agenta AI, plus gotowy szablon Definition of Done do PR template.

Jak używać:

- Skopiuj sekcję CHK-1 do issue/epica „Project setup" i odhaczaj — każdy punkt to jedna decyzja lub jedna konfiguracja, z odsyłaczem do pliku z pełną regułą (Dlaczego/Przykład/Wyjątki).
- Sekcję CHK-2 wklej do dokumentu standardów zespołu **i** do pliku instrukcji agenta AI — to reguły obowiązujące przy każdej zmianie, nie jednorazowy setup.
- Sekcję CHK-3 wklej do szablonu opisu PR w repozytorium.
- Mapowanie punktów na konkretny stack i narzędzia: ./angular.md.

Zasada nadrzędna kolejności: wszystko z CHK-1 jest tanie w dniu zero i drogie po N feature'ach (i18n, tokeny, granice modułów dotykają później *każdego* pliku). W projekcie referencyjnym, z którego wyprowadzono te reguły, odłożona migracja na design tokens kosztowała mechaniczną edycję ~60 plików, a koszt rósł liniowo z każdym kolejnym komponentem — to samo dotyczy każdego punktu poniżej.

---

## CHK-1 — Dzień 0: fundamenty przed pierwszym feature'em

### Architektura i struktura

- [ ] Wybierz podział struktury świadomie wg driverów (czas życia projektu, doświadczenie zespołu, liczba zespołów): projekt na lata → podział per domena biznesowa; duża niepewność → per feature z planem migracji; decyzję zapisz jako ADR-001. → ./architecture.md (cięcie po subdomenach) (szczegóły procesu decyzyjnego: ./architecture.md ARCH-1, ARCH-8)
- [ ] Zdefiniuj warstwy (feature / ui / data-access / utils / mock) i JEDEN kierunek zależności, a macierz „kto może importować kogo" zakoduj w konfiguracji lintera z severity **error** w CI — w tym samym PR, który wprowadza strukturę. → ./architecture.md ARCH-2
- [ ] Ustal, że publiczne API modułu to jeden plik indeksu na granicy, a wewnątrz modułu obowiązują importy bezpośrednie (zakaz wewnętrznych re-eksportów zbiorczych). → ./architecture.md ARCH-6
- [ ] Załóż katalog `docs/adr/` z szablonem Context → Decision → Alternatives → Consequences i regułą: każda niebanalna, trudno odwracalna decyzja (w tym „kupić vs zbudować") = ADR. → ./architecture.md ARCH-8
- [ ] Konwencje nazewnicze (kebab-case plików, sufiksy ról typu `.component` / `.hook` / `.schema` / `.types`, prefiksy typów) wyraź jako reguły lintera, nie akapit w README — konwencja niewymuszana maszynowo umiera. → ./architecture.md (nazewnictwo), ./conventions-and-tooling.md (każda konwencja wyrażalna statycznie = reguła narzędzia)

### Warstwa danych i stan

- [ ] Stan serwera trzymaj w dedykowanej bibliotece cache'u zapytań, nie w globalnym stanie aplikacji — zapisz to jako ADR, bo pomyłka kosztuje miesiące migracji. → ./data-and-state.md STATE-1
- [ ] Załóż jeden moduł kontraktów per zasób: typowane fabryki ścieżek endpointów i kluczy cache (`invoices.list()`, `invoices.detail(id)`), zero literałów rozsianych po kodzie. → ./data-and-state.md (fabryki paths/keys per zasób)
- [ ] Każda odpowiedź API przechodzi przez walidację runtime na granicy danych (fail-fast do stanu błędu), a decyzję „mapować konwencje nazw API↔frontend czy wyrównać kontrakt z backendem" podejmij jawnie i zapisz jako ADR. → ./data-and-state.md (brama I/O)
- [ ] Daty w warstwie danych wyłącznie jako ISO string z jawną strefą; formatowanie per locale tylko w prezentacji, przez jeden współdzielony moduł dat. → ./data-and-state.md (daty i strefy)
- [ ] Zdefiniuj domenowe klasy błędów (zawsze z ustawionym `name`) i type-guardy na granicy danych — UI rozróżnia błędy po typie wyjątku, nie po kodzie HTTP. → ./errors.md (klasy domenowe na granicy danych)
- [ ] Zapisz regułę trzech adresów stanu widoku: filtry/nawigacja/selekcja → URL (z lib-em serializacji parametrów), preferencje prezentacji → storage z kluczem, reszta → stan lokalny możliwie nisko; stan wrażliwy nigdy w URL. → ./data-and-state.md STATE-2
- [ ] Autoryzację UI buduj na uprawnieniach, nie rolach: jedna mapa rola→uprawnienia w jednym module + deklaratywny komponent gate'ujący z fallbackiem; definiuj tylko różnice między rolami. → ./components.md (gate'owanie widoczności sekcji), ./architecture.md ARCH-4 (czysta logika uprawnień w utils)

### Style, i18n, design

- [ ] Design tokens / theme od pierwszego komponentu: zakaz surowych wartości wizualnych (hex, px „z palca"), style zawsze deklarowane jako funkcja theme. → ./styling.md (zero surowych wartości)
- [ ] Spisz gradient stylowania jako standard zespołu: (1) tokeny/theme → (2) goły komponent design-systemu → (3) nazwany styled-wrapper z tokenów → (4) inline tylko trywialne i jednorazowe. → ./styling.md STYLE-1
- [ ] i18n od dnia zero, nawet w aplikacji jednojęzycznej: klucze hierarchiczne per domena/feature/akcja, pary `.SUCCESS`/`.ERROR` dla mutacji, ekstrakcja kluczy skryptem w CI. → ./conventions-and-tooling.md (i18n)

### Testowalność i jakość

- [ ] Test-idy od pierwszego komponentu: jedna biblioteka helperów generująca identyfikatory + per-feature hierarchiczne stałe konsumowane przez komponenty i testy; stany błędów też dostają id. → ./testing.md (test-idy jako kontrakt), ./errors.md (test-idy stanów błędu)
- [ ] Mocki jako osobna warstwa z granicą w lincie (importowalna tylko przez warstwę kompozycji i testy), behawioralne (filtrowanie/sort/paginacja/opóźnienie na wspólnych danych), z fabrykami stanów brzegowych i spójnymi ID między ekranami. → ./testing.md (mocki behawioralne), ./architecture.md ARCH-7
- [ ] Lint dodatkowo: kompletność zależności derywacji jako **error**, zakaz `console.*` w kodzie produkcyjnym, sort importów, zakaz `any`, reguła wykrywająca API gubiące błędy (docelowo error, nie warning — warning nie blokuje CI i eroduje). → ./conventions-and-tooling.md (automatyzacja egzekwowania), ./errors.md (API gubiące błędy)
- [ ] CI od pierwszego commita: typecheck, lint, testy, budżet rozmiaru bundla; lokalnie pre-commit hooki z tym samym zestawem. → ./conventions-and-tooling.md (tooling, wydajność)
- [ ] Logger produkcyjny z transportami, batchingiem i sanityzacją PII oraz plan dekodowania sourcemap z produkcji — zanim wydarzy się pierwszy incydent. → ./errors.md (logger produkcyjny)

### A11y i bezpieczeństwo

- [ ] A11y w fundamencie: lint dostępności w CI, kontrast walidowany na poziomie tokenów theme, wzorzec modala (pułapka fokusa, Escape, zwrot fokusa po zamknięciu) w design-systemie od pierwszej implementacji. → ./conventions-and-tooling.md (a11y)
- [ ] Bezpieczeństwo: jawna decyzja (ADR ze świadomym ryzykiem) o przechowywaniu tokenów sesji, zakaz renderowania nieoczyszczonego HTML, zero sekretów w bundlu (config kliencki jest publiczny z definicji). → ./conventions-and-tooling.md (bezpieczeństwo)

---

## CHK-2 — Reguły pracy zespołowej (do standardów zespołu i instrukcji agenta AI)

Te punkty obowiązują przy **każdej** zmianie — wklej je do dokumentu standardów i do pliku instrukcji agenta AI w repozytorium.

- [ ] Każdy widok danych implementuje 4 stany: loading / error / empty / success — komponent bez któregokolwiek jest niekompletny i nie przechodzi review. → ./errors.md (macierz 4 stanów)
- [ ] Każda mutacja: jawny feedback sukces/błąd, kaskada inwalidacji wszystkich danych pochodnych (detal, listy, liczniki, historia) przez fabryki kluczy, blokada double-submit i równoległych akcji na tym samym zasobie, mapowanie błędów walidacji serwera per-pole. → ./errors.md (feedback mutacji), ./data-and-state.md (inwalidacja, blokada mutacji), ./forms.md (mapy błędów serwera)
- [ ] Progi abstrakcji: ekstrakcja współdzielonego kodu przy 3+ użyciach (2 = może, 1 = nie, chyba że fragment >200 linii); podkatalog przy ≥2 plikach jednego bytu; grupowanie wewnątrz katalogu od ~10 plików; komponent >200 linii → dziel. → ./components.md (progi i podział), ./architecture.md (struktura katalogów), ./antipatterns.md (spekulatywna abstrakcja dla N=1)
- [ ] Refactor: plan weryfikacji ustalony PRZED zmianą; inwentaryzacja wszystkich stanów UI starego kodu (najczęściej gubiony jest error-path, bo niewidoczny na happy-path); małe kompilowalne commity (struktura → logika → typy); zmiany mechaniczne osobno od semantycznych; kończy się skasowaniem starych ścieżek; martwy kod usuwany osobnym commitem, nie przenoszony. → ./refactoring.md (mechanika bezpiecznego refactoru), ./testing.md (plan weryfikacji refactoru)
- [ ] Praca z agentem AI: najpierw plan i potwierdzenie, potem kod; fazy kończące się działającym stanem (kontrakty i typy najpierw); nie zgaduj wersji ani API bibliotek — weryfikuj przed użyciem; kompletne pliki bez placeholderów; jakość specyfikuj kanonicznym przykładem kodu, nie przymiotnikami. → ./README.md (instrukcja użycia zestawu przez agentów)
- [ ] Pętla uczenia: po większych zmianach porównuj diff „pierwszy rzut vs po review", destyluj z różnic reguły, wersjonuj je z datą i warunkami „kiedy NIE stosować"; co wyrażalne statycznie — przenoś do lintera zamiast do dokumentu. → ./conventions-and-tooling.md (automatyzacja egzekwowania)
- [ ] Proces git/PR: małe tematyczne commity w konwencji, czyste rename'y (zachowanie historii), PR o rozmiarze recenzowalnym, automatyczny reviewer jako siatka bezpieczeństwa — nie zamiennik review ludzkiego. → ./conventions-and-tooling.md (proces git/PR)

---

## CHK-3 — Definition of Done feature'a (szablon do PR template)

Gotowy blok do wklejenia w szablon opisu PR. W projekcie referencyjnym, z którego wyprowadzono te reguły, dwa najczęściej pomijane elementy kodu pierwszego rzutu (także generowanego przez AI) to brakujące stany widoku i brak feedbacku mutacji — dlatego stoją na początku i są warunkiem blokującym, nie nice-to-have.

```markdown
## Definition of Done

### Stany widoku (→ ./errors.md — macierz 4 stanów)
- [ ] Loading dobrany do skali (przycisk = spinner, widok = skeleton wg designu)
- [ ] Error z prawdziwym komunikatem + retry, gdy operacja bezpiecznie powtarzalna
- [ ] Błąd pierwszego ładowania ≠ błąd odświeżenia (pełny error-state vs dyskretny sygnał przy zachowanych danych)
- [ ] Empty jako zaprojektowany stan z guidance, nie goły tekst „Brak danych"
- [ ] Success — i żadna gałąź nie renderuje zepsutych/niezwalidowanych danych

### Mutacje (→ ./errors.md, ./data-and-state.md, ./forms.md)
- [ ] Jawny feedback sukces/błąd na każdej mutacji (pary kluczy i18n .SUCCESS/.ERROR)
- [ ] Kaskada inwalidacji wszystkich danych pochodnych (detal, listy, liczniki, historia) przez fabryki kluczy
- [ ] Blokada double-submit i równoległych akcji na tym samym zasobie podczas zapisu
- [ ] Błędy walidacji serwera mapowane per-pole; nieprzemapowane komunikaty pokazane, nie zgubione

### Kontrakty i jakość
- [ ] Test-idy z biblioteki helperów na nowych elementach, w tym na stanach błędów (→ ./testing.md)
- [ ] Wszystkie teksty przez i18n, klucze hierarchiczne, zero literałów w komponentach (→ ./conventions-and-tooling.md)
- [ ] A11y: obsługa klawiatury, poprawne role, fokus w modalach/overlayach (→ ./conventions-and-tooling.md)
- [ ] Style wyłącznie z tokenów/theme, zero surowych wartości wizualnych (→ ./styling.md)
- [ ] Typecheck, lint i testy zielone lokalnie; nowa czysta logika pokryta unit testami (→ ./testing.md)
- [ ] Jeśli PR zawiera refactor: stare ścieżki skasowane, stany starego kodu zinwentaryzowane (→ ./refactoring.md)
```
