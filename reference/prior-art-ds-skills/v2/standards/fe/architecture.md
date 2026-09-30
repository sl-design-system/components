# Architektura i granice modułów

Reguły cięcia aplikacji na moduły, warstwy i katalogi oraz nazewnictwa plików. Wyprowadzone z analizy dojrzałego projektu produkcyjnego ("projekt referencyjny"); sformułowane framework-agnostycznie. Mapowanie na konkretny stack: ./angular.md. Indeks całego zestawu: ./README.md.

Zasada nadrzędna rozdziału: **granica bez reguły egzekwowanej narzędziem jest fikcją**. Każda granica opisana niżej ma istnieć jednocześnie w dwóch miejscach: w strukturze katalogów i w konfiguracji lintera/CI.

---

## Diagram warstw i kierunek zależności

Zależności płyną wyłącznie w dół. Strzałka = "może importować".

```
┌─────────────────────────────────────────────────────────────┐
│ apps (kompozycja: sklejenie routingu, providerów, modułów)   │
│   — jedyna warstwa, która widzi WSZYSTKO, w tym mock         │
└──────┬───────────────────────────────────────────────────────┘
       ▼
┌──────────────┐   ┌──────────────┐
│ feature      │──▶│ ui           │      feature = strona/use-case z routingiem
│ (per domena) │   │ (per domena) │      ui      = klocki widoku domeny
└──────┬───────┘   └──────┬───────┘
       │                  │
       ▼                  ▼
┌──────────────────────────────┐
│ data-access (per domena)     │   API, cache zapytań, schematy odpowiedzi
└──────┬───────────────────────┘
       ▼
┌──────────────────────────────┐
│ utils (czysta logika, 0 I/O) │   uprawnienia, daty, fabryki ścieżek/kluczy
└──────────────────────────────┘

Poziomo, dostępne dla feature i ui (nigdy odwrotnie):
┌────────────┐  ┌────────────────┐  ┌────────┐
│ shared-ui  │─▶│ design-system  │─▶│ theme  │   trzy piętra reużywalności UI:
└────────────┘  └────────────────┘  └────────┘   komponenty złożone → prymitywy → tokeny

Obok, poza grafem produkcyjnym:
┌────────────┐
│ mock       │  importowalny WYŁĄCZNIE przez apps i testy (egzekwowane lintem)
└────────────┘
```

Niezmienniki: `utils`, `design-system` i `theme` nie zależą od niczego; `data-access` nie zna komponentów; `shared-*` nie zna żadnej domeny; żadna warstwa nie importuje warstwy nad sobą.

## Przykładowe drzewo katalogów (neutralna domena: faktury / projekty / harmonogram zespołu)

```
apps/
  web/                          # cienka aplikacja: routing, providery, kompozycja
    src/app/router/routes/      # sklejenie ekranów z trasami (patrz ARCH-5)
docs/
  adr/                          # decyzje architektoniczne (patrz ARCH-8)
libs/
  invoices/                     # subdomena biznesowa
    feature-invoice-list/
    feature-invoice-create/
    data-access-invoice/        # warstwa danych: schematy, zapytania, mutacje
    ui-invoice-status/
    mock-invoice/               # dublery — osobny moduł (patrz ARCH-7)
  projects/
    feature-project-board/
    data-access-project/        # layer:core (słownik domeny projektów)
    data-access-project-team/   # layer:context — może importować core (ARCH-3)
  team-schedule/
    feature-schedule/
    data-access-schedule/
  shared/
    ui/
      data-table/               # komponenty współdzielone, odcięte od domen
      collapsible-section/
    utils/
      api/                      # fabryki ścieżek i kluczy cache per zasób
      permission/               # czysta logika uprawnień (ARCH-4)
      date/
      router/                   # infrastruktura routingu + rejestr (ARCH-5)
      test-id/
    design-system/
    theme/
```

---

## ARCH-1 — Tnij po subdomenach biznesowych, nie po typie technicznym

**Reguła:** Moduły (warstwę danych i feature'y) dziel według obszarów domeny biznesowej, nie według rodzaju kodu. Sygnały, że czas na podział: publiczny indeks modułu przekracza setki linii eksportów albo konsumenci jednej subdomeny importują rzeczy z obcego obszaru "przy okazji".

**Dlaczego:** Monolityczny moduł danych sprzęga niezależne subdomeny — każda zmiana w jednej domenie unieważnia cache builda, poszerza review i zaciąga zbędne zależności do wszystkich konsumentów. Podział per domena umożliwia też code-splitting per obszar.

**Przykład:**

```
ŹLE — jeden moduł danych na wszystko (indeks 600+ linii eksportów):
libs/core/data-access/        # faktury + klienci + użytkownicy + uprawnienia

DOBRZE — cięcie po subdomenach + wyniesienie czystej logiki:
libs/invoices/data-access-invoice/
libs/clients/data-access-client/
libs/shared/utils/api/          # fabryki ścieżek/kluczy (wspólna infrastruktura)
libs/shared/utils/permission/   # czysta logika uprawnień (patrz ARCH-4)
```

W projekcie referencyjnym, z którego wyprowadzono te reguły, dokładnie taki rozpad jednego modułu danych na trzy domenowe plus dwa utils był największym pojedynczym refactorem strukturalnym — i został wykonany w jednym PR razem z regułami lintera chroniącymi nowe granice (patrz ARCH-2, mechanika: ./refactoring.md).

**Wyjątki:** Mały projekt/MVP — podział per feature wystarcza, dopóki subdomeny się nie wyklarują. Nie wydzielaj domen na zapas; przenoś kod, gdy granice stają się widoczne (tania korekta jest możliwa właśnie dzięki ARCH-2).

---

## ARCH-2 — Macierz dozwolonych zależności egzekwowana w CI

**Reguła:** Każdy moduł deklaruje swój typ warstwy (feature / ui / data-access / utils / mock / shared-ui / design-system / theme) i zakres domenowy (scope) jako tagi. Relacja "kto może importować kogo" jest zakodowana w konfiguracji lintera jako błąd (nie ostrzeżenie) i uruchamiana w CI. Nową granicę i regułę ją egzekwującą wprowadzaj w tym samym PR.

**Dlaczego:** Podział na moduły bez maszynowej egzekucji degeneruje się z powrotem do monolitu importów — wystarczy jeden "tymczasowy" import pod presją terminu. Macierz w CI sprawia też, że przesunięcie kodu między modułami jest bezpieczne: kompilator i linter natychmiast pokazują wszystkich poszkodowanych.

**Przykład (pseudokonfiguracja lintera reguł granic):**

```ts
// ŹLE: granice tylko w README → nikt ich nie pilnuje
// DOBRZE: macierz jako konfiguracja, severity: error
const DEP_CONSTRAINTS = [
  { sourceTag: 'type:feature',     onlyDependOnLibsWithTags: ['type:ui', 'type:data-access', 'type:utils', 'type:shared-ui', 'type:design-system'] },
  { sourceTag: 'type:ui',          onlyDependOnLibsWithTags: ['type:data-access', 'type:utils', 'type:shared-ui', 'type:design-system'] },
  { sourceTag: 'type:data-access', onlyDependOnLibsWithTags: ['type:utils'] },
  { sourceTag: 'type:utils',       onlyDependOnLibsWithTags: [] },
  { sourceTag: 'scope:invoices',   onlyDependOnLibsWithTags: ['scope:invoices', 'scope:shared'] },
];
// Wyjątki jawne i wąskie, np. pliki testów integracyjnych mogą importować type:mock.
```

**Wyjątki:** Brak — to fundament. Rośnie jedynie skala narzędzia wraz z projektem. Dopuszczalne są pojedyncze, jawnie nazwane wyjątki (np. pliki scenariuszy testowych → mocki), nigdy wyjątki "per zgłoszenie".

---

## ARCH-3 — Współdzielenie wewnątrz warstwy przez jawną relację core/context

**Reguła:** Gdy dwa moduły tej samej warstwy (np. dwa moduły danych jednej domeny) muszą współdzielić słownik domenowy — statusy, enumy, typy bazowe — wprowadź jednokierunkową relację: moduł rdzeniowy (`layer:core`) nie zna nikogo, moduły kontekstowe (`layer:context`) mogą importować core. Relację egzekwuj tagiem w linterze, jak w ARCH-2.

**Dlaczego:** Alternatywy są gorsze: duplikacja słownika rozjeżdża się po cichu, a mikro-moduł "na same statusy" to sztuczny byt bez właściciela. Relacja core/context daje legalny import bez cyklu i bez rozmywania granic.

**Przykład:**

```ts
// libs/projects/data-access-project (layer:core) — właściciel słownika
export const PROJECT_STATUSES = ['DRAFT', 'ACTIVE', 'ARCHIVED'] as const;
export type TProjectStatus = (typeof PROJECT_STATUSES)[number];

// libs/projects/data-access-project-team (layer:context) — legalny import w dół
import { TProjectStatus } from '@workspace/projects/data-access-project';
```

W projekcie referencyjnym słownik statusów najpierw wyjechał do osobnego mini-modułu, po czym jeszcze w trakcie tego samego PR wrócił do modułu rdzeniowego z relacją core/context — korekta kursu w trakcie review była tańsza niż forsowanie złego podziału. Egzekwowane granice (ARCH-2) czynią taki zwrot bezpiecznym.

**Wyjątki:** Jeśli słownik jest potrzebny także warstwom wyżej/niżej (np. komponentom współdzielonym), to kandydat do warstwy utils (ARCH-4), nie do core.

---

## ARCH-4 — Czysta logika bez I/O nie należy do warstwy danych

**Reguła:** Logikę pozbawioną efektów ubocznych — uprawnienia, mappery, słowniki, operacje na datach — wydzielaj do warstwy utils o zerowych zależnościach. Warstwa danych zawiera wyłącznie to, co dotyczy komunikacji: schematy odpowiedzi, zapytania, mutacje, klucze cache.

**Dlaczego:** Feature nie powinien zaciągać całej warstwy danych (klient HTTP, cache, schematy) po samą stałą czy funkcję sprawdzającą uprawnienie. Czysta logika w utils jest trywialna w testach jednostkowych (./testing.md) i dostępna dla każdej warstwy bez łamania macierzy zależności.

**Przykład:**

```ts
// ŹLE: sprawdzenie uprawnień zakopane w module danych faktur
// libs/invoices/data-access-invoice/permissions.ts  ← konsument UI ciągnie cały moduł I/O

// DOBRZE: czysta funkcja w utils, zero zależności
// libs/shared/utils/permission/src/can.ts
export const can = (userPermissions: readonly TPermission[], required: TPermission): boolean =>
  userPermissions.includes(required);
```

**Wyjątki:** Logika nierozerwalnie związana z kształtem odpowiedzi API (transformery schematów, normalizacja pól) zostaje przy endpointach w warstwie danych (szczegóły: ./data-and-state.md).

---

## ARCH-5 — Inwersja zależności przez typowany rejestr

**Reguła:** Gdy infrastruktura (np. routing) i domena (ekrany) wzajemnie się potrzebują, infrastruktura wystawia typowany punkt rejestracji, a kompozycję wykonuje najwyższa warstwa (aplikacja). Mapy wariantów (typ → implementacja) deklaruj tak, by brak wpisu był błędem kompilacji (exhaustive check).

**Dlaczego:** Eliminuje cykle moduł-infrastruktura↔moduł-domena, stringi-z-palca i switche po typie rozsiane po kodzie. Kompilator pilnuje kompletności — nowy wariant bez implementacji nie przejdzie builda, zamiast wybuchnąć w runtime.

**Przykład:**

```ts
// shared/utils/router — infrastruktura definiuje kontrakt, nie zna ekranów
export type TRouteId = 'INVOICE_LIST' | 'INVOICE_CREATE' | 'PROJECT_BOARD';
export const registerRouteComponent = (id: TRouteId, cmp: TLazyComponent): void => { /* ... */ };

// apps/web/src/app/router/routes — TYLKO aplikacja skleja domenę z infrastrukturą
registerRouteComponent('INVOICE_LIST', () => import('@workspace/invoices/feature-invoice-list'));

// Mapa wariantów z kompletnością pilnowaną przez typy:
const REPORT_WIDGETS = {
  REVENUE: RevenueWidget,
  OVERDUE: OverdueWidget,
  WORKLOAD: WorkloadWidget,
} satisfies Record<TReportType, TWidgetComponent>;
// dodanie 'FORECAST' do TReportType bez wpisu w mapie = błąd kompilacji
```

**Wyjątki:** 2–3 warianty bez perspektywy wzrostu — zwykły warunek wystarczy. Rejestr zbudowany przy jednym wariancie to spekulatywna abstrakcja (./antipatterns.md); w projekcie referencyjnym taki przedwczesny rejestr usunięto, a wrócił zasadnie dopiero przy ponad 20 wariantach.

---

## ARCH-6 — Publiczne API modułu = jeden indeks; zakaz wewnętrznych barreli

**Reguła:** Każdy moduł ma dokładnie jeden plik indeksu definiujący jego świadomie minimalne publiczne API. Wewnątrz modułu importuj bezpośrednio z plików źródłowych — żadnych pośrednich plików re-eksportujących. Usuwając byt, usuń jego eksport z indeksu w tym samym commicie.

**Dlaczego:** Wewnętrzne barrele tworzą cykle importów, psują tree-shaking i udają "publiczne API" tam, gdzie go nie ma. Jeden indeks na granicy to jednocześnie kontrakt i miejsce świadomej decyzji "co wystawiamy".

**Przykład:**

```ts
// ŹLE: wewnętrzny barrel w podkatalogu
// libs/invoices/feature-invoice-create/src/sections/index.ts
export * from './payment-section.component';
export * from './client-section.component';

// DOBRZE: import bezpośredni wewnątrz modułu...
import { PaymentSection } from './sections/payment-section.component';

// ...a re-eksport tylko na granicy modułu, minimalny:
// libs/invoices/feature-invoice-create/src/index.ts
export { InvoiceCreatePage } from './lib/invoice-create-page.component';
```

**Wyjątki:** Brak w monorepo z modułami.

---

## ARCH-7 — Mocki to osobna warstwa poza produkcyjną warstwą danych

**Reguła:** Dane testowe i symulacje endpointów żyją w dedykowanych modułach `mock-*` (tag `type:mock`), nigdy w warstwie danych. Importować je może wyłącznie warstwa kompozycji (aplikacja w trybie deweloperskim) i testy — granica egzekwowana lintem jak w ARCH-2.

**Dlaczego:** Mock w warstwie danych przecieka do bundla produkcyjnego i sprzęga kontrakt API z fikcją testową; zmiana mocków zaczyna unieważniać build kodu produkcyjnego.

**Przykład:**

```
ŹLE:   libs/invoices/data-access-invoice/src/mocks/invoice.fixtures.ts
DOBRZE: libs/invoices/mock-invoice/   # type:mock, importowany tylko przez apps + testy
```

Mocki projektuj behawioralnie (symulują filtrowanie/sort/paginację, nie zwracają statycznych fixtur) — szczegóły: ./testing.md.

**Wyjątki:** Jednorazowe fixtury unit-testu mogą leżeć przy pliku spec.

---

## ARCH-8 — Każda niebanalna decyzja architektoniczna = ADR

**Reguła:** Decyzje trudne do odwrócenia (podział struktury, biblioteka cache'u zapytań, mapowanie konwencji nazewniczych API, przechowywanie tokenów sesji, "kupno vs budowa" komponentu) zapisuj jako ADR w `docs/adr/` według szablonu: Kontekst → Decyzja → Rozważone alternatywy → Konsekwencje. Dopisuj ADR-y wraz z ewolucją projektu, nie tylko na starcie.

**Dlaczego:** Bez zapisu z alternatywami zespół po roku nie odróżnia decyzji świadomej od przypadku i podważa albo cargo-kultuje obie tak samo. Rozstrzygnięcia "kupno vs budowa" bez ADR wracają jak bumerang przy każdej rotacji w zespole.

**Przykład (mini-studium):** W projekcie referencyjnym płatny komponent tabeli danych kupiono (potrzebny był zaawansowany wariant master-detail), a logger i warstwę auth zbudowano (specyficzne wymagania) — oba kierunki uzasadnione w ADR-ach z odrzuconymi alternatywami. Daty kolejnych ADR-ów rozciągały się na miesiące: rejestr decyzji żył razem z kodem.

**Wyjątki:** Decyzje trywialnie odwracalne (nazwa katalogu, kolejność propsów) nie potrzebują ADR.

---

## NAME-1 — Sufiks pliku deklaruje rolę

**Reguła:** Jeden plik = jedna odpowiedzialność, zakodowana sufiksem w nazwie (kebab-case): `.component`, `.hook`, `.styles`, `.schema`, `.query`, `.mutation`, `.const`, `.types`, `.transform`, `.field-map`, `.test-ids`, `.spec`. Konwencję egzekwuj regułą lintera, nie dokumentem (./conventions-and-tooling.md).

**Dlaczego:** Rola widoczna w nazwie pliku czyni strukturę grep-owalną i samodokumentującą; recenzent widzi z listy zmienionych plików, czy PR dotyka schematów, mutacji czy stylów. Wymusza też rozdział odpowiedzialności — "to nie mieści się w żadnym sufiksie" to sygnał, że plik robi za dużo.

**Przykład:**

```
ŹLE:    invoice.ts                  # model? stała? walidacja? nie wiadomo
DOBRZE: invoice.schema.ts           # schemat walidacji odpowiedzi
        invoice-status.const.ts     # stałe
        invoice.types.ts            # typy
        use-invoice-form.hook.ts    # logika formularza
        invoice-row.component.tsx   # komponent
```

W projekcie referencyjnym masowe rename'y `*.model.ts → *.schema.ts` / `*.const.ts` były częścią dużego refactoru — niejednoznaczny sufiks "model" maskował różnicę między schematem walidacji a zwykłą stałą.

**Wyjątki:** Brak.

---

## NAME-2 — Powtarzający się prefiks nazw plików = brakujący katalog

**Reguła:** Kontekst niesie ścieżka, nie prefiks nazwy. Podkatalog twórz przy ≥2 plikach jednego bytu; grupowanie wewnątrz katalogu od ~10 plików. Katalogi rosną wraz z liczbą plików — nie twórz ich wyprzedzająco.

**Dlaczego:** Prefiksy w nazwach to ręczna emulacja hierarchii, którą system plików daje za darmo; długie nazwy zaciemniają listingi i diffy. Z drugiej strony katalog z jednym plikiem to szum nawigacyjny.

**Przykład:**

```
ŹLE (prefiks dubluje kontekst):
  tasks/task-accept.mutation.ts
  tasks/task-reject.mutation.ts
  tasks/task-reassign.mutation.ts

DOBRZE (kontekst w ścieżce):
  tasks/mutations/accept.mutation.ts
  tasks/mutations/reject.mutation.ts
  tasks/mutations/reassign.mutation.ts

ALE: trywialna sekcja z jednym plikiem zostaje płasko:
  sections/summary-section.component.tsx   # bez katalogu summary-section/
```

**Wyjątki:** Brak.

---

## NAME-3 — Grupuj po feature/sekcji, nie po typie artefaktu

**Reguła:** Wewnątrz feature'a nie zakładaj zbiorczych katalogów `hooks/`, `context/`, `utils/`. Hook, kontekst czy helper leży obok swojego jedynego konsumenta, a hierarchia katalogów odwzorowuje hierarchię własności w UI (layout → sekcje → elementy).

**Dlaczego:** Katalog-po-typie rozrywa kohezję: zmiana jednej sekcji rozsiewa się po trzech katalogach, a usunięcie sekcji zostawia sieroty w `hooks/`. Struktura po własności czyni zasięg i koszt usunięcia widocznym na pierwszy rzut oka.

**Przykład:**

```
ŹLE:
  feature-project-board/src/
    hooks/use-overdue-warning.hook.ts      # używany tylko przez baner ostrzeżeń
    context/board-actions-blocked.context.ts

DOBRZE:
  feature-project-board/src/
    layout/
      warning-bar/
        use-overdue-warning.hook.ts
        warning-bar.component.tsx
      context/
        board-actions-blocked.context.ts   # własność layoutu, nie globalna
    sections/
      backlog-section/
      timeline-section/
    shared/                                # klocki używane przez ≥2 sekcje
```

**Wyjątki:** `shared/` wewnątrz feature'a dla klocków używanych przez co najmniej dwie sekcje — to jawnie nazwane współdzielenie, nie worek.

---

## NAME-4 — Każdy use-case dostaje własny komplet artefaktów

**Reguła:** Create / edit / delete mają osobne podkatalogi z własną schemą, mapą pól (mapowanie błędów walidacji serwera) i mutacją. Nie współdziel stałych między use-case'ami "bo dziś wyglądają tak samo".

**Dlaczego:** Pożyczona stała zamienia się w bug przy pierwszej rozbieżności — i to bug cichy, bo kompilacja przechodzi. Komplet artefaktów per use-case czyni różnice między wariantami jawnymi i lokalnymi.

**Przykład (mini-studium):** W projekcie referencyjnym mapa ścieżek pól formularza *tworzenia* użytkownika została przez copy-paste użyta w mutacji *edycji* — błędy walidacji serwera dla edycji mapowały się na pola nieistniejące w tym formularzu i znikały. Naprawa: dedykowany plik mapy dla edycji.

```
DOBRZE:
  clients/
    create/
      client-create.schema.ts
      client-create.field-map.ts
      create.mutation.ts
    edit/
      client-edit.schema.ts
      client-edit.field-map.ts      # osobny, nawet jeśli dziś identyczny
      edit.mutation.ts
```

(Pełny zestaw artefaktów formularza: ./forms.md; mapowanie błędów 422: ./errors.md.)

**Wyjątki:** Fragment faktycznie wspólny wynieś do nazwanego modułu wspólnego (np. `clients/shared/`), na który oba use-case'y jawnie wskazują — nie "pożyczaj" od sąsiada.

---

## NAME-5 — Nazwy podążają za rolą; pojęcie domenowe zamiast wyliczania przypadków

**Reguła:** Po każdej zmianie roli komponentu/interfejsu popraw nazwę. Gdy nazwa wylicza warianty, brakuje pojęcia — nazwij je. Literówki naprawiaj przy okazji (rename'em w VCS, z zachowaniem historii). Nazwy-artefakty ("copy", "2", "old", "final") nie przechodzą przez commit.

**Dlaczego:** Nieaktualna nazwa to kłamstwo w kodzie — kosztuje przy każdym czytaniu. Nazwa-wyliczanka rozjedzie się przy pierwszym nowym wariancie. Pliki "copy"/"2" sygnalizują niedokończoną deduplikację i mają tendencję do przeżywania oryginału.

**Przykład:**

```
ŹLE → DOBRZE:
  task-developer-designer-tester.permissions.ts → task-contributor.permissions.ts
    # nazwij pojęcie ("wykonawca zadania") zamiast wyliczać role

  interface IClientSectionProps  → ILeftColumnProps
    # komponent zmienił rolę na generyczną kolumnę layoutu — nazwa propsów za nim

  schedule-remove-modal.component copy.tsx → (usunięty)
  Dropdown2                                → (usunięty po deduplikacji)
```

W projekcie referencyjnym plik z " copy" w nazwie (artefakt edytora, ze spacją) został scommitowany, importowany i naprawiony dopiero kilka commitów później; bliźniaczy komponent z sufiksem "2" przeżył usunięcie oryginału. Oba przypadki wyłapałby prosty lint na wzorce nazw (./conventions-and-tooling.md; katalog antywzorców: ./antipatterns.md).

**Wyjątki:** Brak.
