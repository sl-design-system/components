# Zestaw reguł dobrych praktyk Frontend

Indeks i instrukcja użycia całego zestawu. Czytaj ten plik jako pierwszy — zawiera filozofię, mapę plików oraz konwencję ID reguł.

---

## 1. Czym jest ten zestaw i skąd pochodzi

Zestaw to destylat z analizy **dojrzałego projektu produkcyjnego** (dalej: „projekt referencyjny"): kilkunastu miesięcy historii refactorów, kilkunastu udokumentowanych decyzji architektonicznych, spisanych standardów zespołu i konfiguracji narzędzi egzekwujących konwencje. Reguły wyprowadzono z **różnic między kodem pierwszego rzutu a kodem po review i refactorach** — każda była opłacona realnym kosztem (bugiem, regresją, miesiącami spłacanego długu albo udanym refactorem).

Dokumenty są **samowystarczalne**: nie wymagają dostępu do żadnego repozytorium źródłowego. Przykłady osadzono w neutralnej domenie biznesowej (projekty, zadania, faktury, klienci, użytkownicy, harmonogram zespołu).

Reguły generyczne (wszystkie pliki poza `./angular.md`) są **framework-agnostic** — nie zakładają konkretnego frameworka ani bibliotek. Mapowanie na konkretny stack tego projektu (Angular) zawiera wyłącznie `./angular.md`.

---

## 2. Zasady nadrzędne (filozofia)

Te siedem zasad spina wszystkie reguły szczegółowe. Gdy reguła szczegółowa nie pokrywa Twojego przypadku, rozstrzygaj zgodnie z nimi.

1. **Architektura to seria trudno odwracalnych decyzji.** Podejmuj je świadomie, dokumentuj (ADR z odrzuconymi alternatywami), a niezmienniki przenoś z dyscypliny programisty do systemu typów i narzędzi (lint, kompilator, CI). Konwencja niewymuszana maszynowo umiera.
2. **Jeden kierunek zależności, jawne granice, jawne reguły.** Granica bez reguły egzekwowanej narzędziem jest fikcją — degeneruje się z powrotem do monolitu importów.
3. **Abstrakcja jest płatna.** Wprowadzaj ją przy drugim–trzecim realnym konsumencie (1 użycie → nie; 2 → może; 3+ → prawdopodobnie; 5+ → tak). Błędną generalizację miej odwagę cofnąć — ekstrakcja do biblioteki współdzielonej nie jest dogmatem.
4. **Kompletność stanów ponad happy path.** Każdy widok danych ma 4 stany (loading / error / empty / success), każda mutacja daje jawny feedback. To dwa najczęściej pomijane elementy kodu pierwszego rzutu — także generowanego przez AI.
5. **Nudne i jawne > sprytne i automatyczne.** Grep-owalne mapowanie pole-po-polu wygrywa z setkami linii typów warunkowych. Magia oszczędza kilkanaście linii per model, a kosztuje nieczytelne błędy i niemożliwy debugging.
6. **Refactor = zachowanie zachowań + delete.** Ma plan weryfikacji ustalony przed zmianą, inwentaryzację stanów starego kodu, kończy się skasowaniem starych ścieżek, a ujemny diff netto jest sygnałem zdrowia.
7. **Standardy wyprowadzaj z diffów i utrzymuj jako żywe.** Destyluj reguły z różnic „pierwszy rzut vs po review", wersjonuj je, podawaj kiedy NIE obowiązują, formułuj gradientowo, nie binarnie (absolutne „NIGDY" zwykle jest przestrzelone).

---

## 3. Mapa zestawu

| Plik | Zakres | ID reguł |
| --- | --- | --- |
| `./architecture.md` | Granice modułów, warstwy, kierunek zależności, struktura katalogów, nazewnictwo; diagram warstw i przykładowe drzewo katalogów | ARCH-1…ARCH-8, NAME-1…NAME-5 |
| `./components.md` | Podział komponentów i odpowiedzialności: orkiestrator vs sekcje, layout, kompozycja vs flagi, granica biblioteki współdzielonej, routing | COMP-1…COMP-10 |
| `./data-and-state.md` | Stan serwera vs stan UI, trzy adresy stanu widoku, warstwa danych/API, klucze cache, inwalidacja, polityki, daty | STATE-1…STATE-8, DATA-1…DATA-9 |
| `./styling.md` | Gradient stylowania, design tokens, nazwane style, filtrowanie propsów, RWD | STYLE-1…STYLE-5 |
| `./forms.md` | Formularze: pięć artefaktów, kanał danych, mapowanie błędów serwera na pola, modele create/edit, granica walidacji | FORM-1…FORM-5 |
| `./errors.md` | Macierz 4 stanów, feedback mutacji, domenowe klasy błędów, cicha odmowa, błąd ładowania vs odświeżenia, logger | ERR-1…ERR-8 |
| `./testing.md` | Test-idy jako kontrakt, dublery behawioralne, fabryki stanów brzegowych, testy integracyjne per rola, unit testy, weryfikacja refactoru | TEST-1…TEST-7 |
| `./conventions-and-tooling.md` | i18n, automatyzacja egzekwowania reguł, dostępność, bezpieczeństwo, wydajność, zależności, proces git/PR | I18N-1…I18N-5, TOOL-1…TOOL-5, A11Y-1…A11Y-4, SEC-1…SEC-4, PERF-1…PERF-4, DEPS-1…DEPS-2, GIT-1…GIT-4 |
| `./antipatterns.md` | Katalog antywzorców z przykładami przed/po + instrukcja użycia w code review | AP-1…AP-18 |
| `./refactoring.md` | Mechanika bezpiecznego refactoru: plan, inwentaryzacja stanów, strangler, delete, lekcje | REF-1…REF-10 |
| `./checklist.md` | Checklist startowy nowego projektu: dzień 0, reguły pracy zespołowej, Definition of Done | CHK-1…CHK-3 |
| `./angular.md` | Mapowanie reguł na Angulara: konkretny stack, idiomy, rekomendacje narzędzi, tabela decyzji domyślnych (TL;DR) | NG-1…NG-18 |
| `./sanoma-ds.md` | Sanoma Learning Design System (SLDS): reguły dla `@sl-design-system/*` imports, layout-vs-DS shadow-DOM, max- prefix, token consumption no-fallback, i18n active discipline. Specjalizacja dla projektów używających SLDS — dopisana 2026-06-09 przez Sanoma Learning DS skill suite. | SDS-1…SDS-7 |

Najważniejsze cross-referencje między plikami: macierz 4 stanów (`./errors.md`, ERR-1) jest warunkiem ukończenia z `./checklist.md` (CHK-3); inwentaryzacja stanów przed refactorem łączy `./testing.md` (TEST-7) z `./refactoring.md`; antywzorce z `./antipatterns.md` wskazują reguły pozytywne, które łamią; SDS-3 (shadow-DOM layout) wzmacnia COMP-2 (layout=szkielet) i STYLE-3 (nazwane style).

---

## 4. Jak używać

### Ludzie

- **Start nowego projektu / modułu** → `./checklist.md` (CHK-1: fundamenty dnia 0, zanim powstanie pierwszy feature).
- **Projektowanie struktury i granic** → `./architecture.md`, potem decyzje stackowe z `./angular.md`.
- **Code review** → `./antipatterns.md` (sekcja końcowa „Jak używać tego katalogu w review") + Definition of Done z `./checklist.md` (CHK-3).
- **Planowanie refactoru** → `./refactoring.md` + TEST-7 z `./testing.md`.
- W dyskusjach i PR powołuj się na **stabilne ID reguł** (np. „to łamie STATE-3, użyj unii dyskryminowanej"), nie na parafrazy.

### Agenci AI

1. **Zawsze czytaj ten README** na początku pracy — daje filozofię i mapę; nie wczytuj całego zestawu na raz.
2. **Sięgaj do plików tematycznych według zadania**: implementacja komponentu → `./components.md` + `./styling.md`; praca z API/stanem → `./data-and-state.md` + `./errors.md`; formularz → `./forms.md`; testy → `./testing.md`; teksty/lint/CI/proces → `./conventions-and-tooling.md`.
3. **Przy code review** obowiązkowo `./antipatterns.md` — porównuj kod z katalogiem AP-1…AP-18 i cytuj ID znalezionych antywzorców.
4. **Przy starcie projektu lub modułu** wykonuj `./checklist.md` punkt po punkcie i raportuj pokrycie.
5. **Przy decyzjach implementacyjnych w Angularze** (wybór biblioteki, idiom, API frameworka) rozstrzygaj według `./angular.md` — zaczynając od tabeli „Skrót decyzyjny (TL;DR)".
6. Konflikty rozstrzygaj tak: reguła szczegółowa > zasada nadrzędna > własny osąd. Jeśli świadomie odstępujesz od reguły, wskaż jej ID i uzasadnij — sekcja **Wyjątki** każdej reguły mówi, kiedy odstępstwo jest legalne.

---

## 5. Konwencja ID reguł i utrzymanie zestawu

### Format reguły

Każda reguła ma stabilny identyfikator `PREFIKS-N` (np. `ARCH-3`, `STATE-5`) oraz stałą strukturę: **Reguła** (1–3 zdania, imperatyw) → **Dlaczego** → **Przykład** (kod ŹLE → DOBRZE albo mini-studium z projektu referencyjnego) → **Wyjątki** (kiedy nie stosować).

### Stabilność ID

- ID są **trwałe**: raz nadane, nie zmieniają znaczenia. Wycofaną regułę oznaczaj jako *deprecated* z uzasadnieniem — nie usuwaj wpisu i **nie nadawaj jej numeru ponownie**.
- Nowe reguły dopisuj na koniec sekwencji prefiksu (kolejny wolny numer), nawet jeśli tematycznie pasują „w środek".

### Utrzymanie (pętla uczenia)

1. **Dopisuj reguły z diffów po review.** Gdy review lub regresja ujawnia powtarzalny problem nieobjęty zestawem, destyluj go do reguły: imperatyw + dlaczego + przykład + wyjątki. Jedna obserwacja to kandydat; reguła powstaje przy powtórzeniu.
2. **Wersjonuj zmiany merytoryczne.** Zmianę treści reguły opisuj w jej obrębie z datą i powodem („zaostrzono po incydencie…", „złagodzono — false positives").
3. **Wartości-migawki oznaczaj datą.** Konkretne liczby (progi linii, polityki świeżości cache, budżety bundla) erodują szybciej niż zasady — oznaczaj je jako migawkę z datą i trzymaj w jednym miejscu, gdzie erozja jest przynajmniej widoczna. Sama reguła („centralizuj polityki jako nazwany słownik") żyje dłużej niż jej wartości.
4. **Automatyzuj, co się da.** Każda reguła wyrażalna statycznie powinna docelowo stać się regułą lintera/CI o severity *error* (szczegóły: `./conventions-and-tooling.md`, TOOL-1…TOOL-4); dokument pozostaje źródłem „dlaczego", narzędzie — egzekutorem „co".
5. **Formułuj gradientowo.** Preferuj hierarchie i progi („najpierw X, potem Y, inline tylko dla trywialnych") nad binarne zakazy — binarne „NIGDY" jest łamane po cichu i uczy ignorowania całego zestawu.
