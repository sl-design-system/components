# Konwencje i narzędzia

Zakres: internacjonalizacja (i18n), automatyzacja egzekwowania reguł, dostępność (a11y), bezpieczeństwo frontendu, wydajność, zarządzanie zależnościami, proces git/PR. Reguły są framework-agnostic; mapowanie na konkretny stack: ./angular.md.

Zasada nadrzędna tego pliku: **konwencja niewymuszana maszynowo umiera**. Wszystko, co da się wyrazić statycznie, ma być regułą narzędzia (lint, kompilator, CI), nie akapitem w README. Review ludzkie zostaw na semantykę.

---

## I18N — internacjonalizacja

### I18N-1. Eksternalizacja tekstów od dnia zero

**Reguła:** Wszystkie teksty widoczne dla użytkownika trzymaj w plikach tłumaczeń od pierwszego komponentu — także w aplikacji, która „na pewno będzie tylko po polsku".

**Dlaczego:** Dodanie i18n później dotyka każdego komponentu w aplikacji — to jeden z najdroższych możliwych refactorów odłożonych na potem. Eksternalizacja od startu daje też darmowe korzyści niezależne od liczby języków: spójność copy (jedno miejsce do przeglądu), tani refactor komunikatów, możliwość ekstrakcji kluczy skryptem i wykrywania martwych tłumaczeń.

**Przykład:**

```ts
// ŹLE — tekst zaszyty w komponencie
<Button label="Zapisz fakturę" />

// DOBRZE — klucz od pierwszego dnia
<Button label={t('INVOICES.FORM.SUBMIT')} />
```

**Wyjątki:** Teksty czysto techniczne niewidoczne dla użytkownika (klucze logów, identyfikatory) nie przechodzą przez i18n.

### I18N-2. Klucze hierarchiczne; pary `.SUCCESS`/`.ERROR` dla mutacji

**Reguła:** Klucze buduj hierarchicznie wg domeny → feature → akcji (`INVOICES.CREATE.SUBMIT`). Każda mutacja ma parę kluczy feedbacku `.SUCCESS`/`.ERROR` — to część definicji ukończenia mutacji (szczegóły: ./errors.md — feedback mutacji jako warunek blokujący). Komunikaty walidacji formularzy także idą przez i18n: schemat walidacji jest fabryką przyjmującą funkcję tłumaczącą (szczegóły: ./forms.md).

**Dlaczego:** Hierarchia daje przewidywalność (klucz da się zgadnąć, a nie szukać), grupuje tłumaczenia per feature i pozwala wykrywać dziury (mutacja bez pary SUCCESS/ERROR jest widoczna w pliku tłumaczeń gołym okiem).

**Przykład:**

```jsonc
{
  "INVOICES": {
    "CREATE": {
      "SUBMIT": "Wystaw fakturę",
      "SUCCESS": "Faktura została wystawiona",
      "ERROR": "Nie udało się wystawić faktury"
    },
    "VALIDATION": {
      "DUE_DATE_REQUIRED": "Termin płatności jest wymagany"
    }
  }
}
```

```ts
// Schemat walidacji jako fabryka z funkcją tłumaczącą — nie zaszyte stringi
const createInvoiceSchema = (t: TTranslate) =>
  schema.object({
    dueDate: schema.date({ requiredMessage: t('INVOICES.VALIDATION.DUE_DATE_REQUIRED') }),
  });
```

**Wyjątki:** Mutacje w pełni odzwierciedlone natychmiastową, optymistyczną zmianą UI (np. toggle) mogą mieć tylko `.ERROR`.

### I18N-3. Klucze wyprowadzane konwencją z wartości domenowej, z type-guardem i fallbackiem

**Reguła:** Etykiety wartości słownikowych (statusy, role, typy) wyprowadzaj konwencją `PREFIX.${wartość}` zamiast utrzymywać ręczną mapę wartość→klucz. Konwencję zabezpiecz type-guardem i fallbackiem `UNKNOWN` na wypadek wartości spoza znanej unii.

**Dlaczego:** Ręczne mapy status→klucz to czysty szum: rosną liniowo z liczbą wartości, każda pozycja to okazja do literówki, a `default` w switchu maskuje brakujące przypadki. W projekcie referencyjnym, z którego wyprowadzono te reguły, 47-liniowy switch z literówkami w kluczach został zredukowany do jednej linii konwencji — i przy okazji zyskał jawny fallback, którego switch nie miał.

**Przykład:**

```ts
// ŹLE — ręczna mapa, 47 linii, każda linia to potencjalna literówka
function getProjectStatusLabelKey(status: TProjectStatus): string {
  switch (status) {
    case 'PLANNED':
      return 'PROJECTS.STATUS.PLANNED';
    case 'IN_PROGRESS':
      return 'PROJECTS.STATUS.IN_PROGRES'; // <- literówka, kompilator jej nie widzi
    case 'ON_HOLD':
      return 'PROJECTS.STATUS.ON_HOLD';
    case 'COMPLETED':
      return 'PROJECTS.STATUS.COMPLETED';
    case 'CANCELLED':
      return 'PROJECTS.STATUS.CANCELED'; // <- niespójna pisownia
    // ... i tak dalej dla każdej wartości, bez fallbacku
    default:
      return '';
  }
}
```

```ts
// DOBRZE — 1 linia konwencji + type-guard + fallback
const PROJECT_STATUSES = ['PLANNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'] as const;
type TProjectStatus = (typeof PROJECT_STATUSES)[number];

const isProjectStatus = (value: string): value is TProjectStatus =>
  (PROJECT_STATUSES as readonly string[]).includes(value);

const getProjectStatusLabelKey = (status: string): string =>
  `PROJECTS.STATUS.${isProjectStatus(status) ? status : 'UNKNOWN'}`;
```

Klucz `PROJECTS.STATUS.UNKNOWN` istnieje w plikach tłumaczeń — wartość spoza kontraktu degraduje się do czytelnej etykiety, nie do pustego stringa.

**Wyjątki:** Gdy etykiety tej samej wartości naprawdę różnią się per kontekst (ten sam status inaczej nazwany na liście i w raporcie), konwencja przegrywa z jawną mapą — wróć do mapy **lokalnie**, w miejscu rozbieżności, nie globalnie.

### I18N-4. Zakaz duplikowania identycznych tłumaczeń per kontekst

**Reguła:** Jeśli te same wartości tłumaczeń (np. etykiety statusów) miałyby istnieć w kilku sekcjach pliku tłumaczeń, trzymaj je w jednej wspólnej sekcji. Rozdzielaj dopiero przy pierwszej **realnej** różnicy treści, nie zapobiegawczo.

**Dlaczego:** Zduplikowane sekcje rozjeżdżają się po cichu — poprawka copy trafia do jednej z pięciu kopii. W projekcie referencyjnym pięć sekcji statusów o identycznych wartościach zostało scalonych do jednej płaskiej sekcji; różnice, których duplikacja miała „bronić na zapas", nigdy nie wystąpiły.

**Przykład:** ŹLE: `PROJECTS.LIST.STATUS.ACTIVE`, `PROJECTS.DETAIL.STATUS.ACTIVE`, `PROJECTS.REPORT.STATUS.ACTIVE` — trzy identyczne wartości. DOBRZE: jedna sekcja `PROJECTS.STATUS.ACTIVE` używana w trzech miejscach; współgra to z konwencją z I18N-3.

**Wyjątki:** Realna różnica treści per kontekst — wtedy rozdzielenie jest treścią, nie duplikacją.

### I18N-5. Nie tłumacz całej mapy, by użyć jednego klucza

**Reguła:** Funkcja/hook zwracający etykietę dla jednej wartości nie buduje przetłumaczonej mapy wszystkich wartości. Tłumacz dokładnie ten klucz, którego potrzebujesz, w miejscu użycia.

**Dlaczego:** Tłumaczenie całej mapy „na wszelki wypadek" wykonuje N tłumaczeń dla 1 potrzebnego, tworzy zbędną strukturę pośrednią i ukrywa prostą zależność wartość→klucz za warstwą abstrakcji.

**Przykład:**

```ts
// ŹLE — hook tłumaczy wszystkie statusy, żeby zwrócić jeden
const useStatusName = (status: TProjectStatus) => {
  const all = {
    PLANNED: t('PROJECTS.STATUS.PLANNED'),
    IN_PROGRESS: t('PROJECTS.STATUS.IN_PROGRESS'),
    // ...cała mapa
  };
  return all[status];
};

// DOBRZE — jedno tłumaczenie, w miejscu użycia
const label = t(getProjectStatusLabelKey(status)); // konwencja z I18N-3
```

**Wyjątki:** Gdy komponent faktycznie potrzebuje całej mapy (np. lista opcji selecta) — wtedy tłumaczenie wszystkich wartości jest treścią zadania.

---

## TOOL — automatyzacja egzekwowania reguł

### TOOL-1. Każdą statycznie wyrażalną konwencję zamieniaj w regułę narzędzia

**Reguła:** Granice modułów, konwencje nazewnicze (kebab-case plików, prefiksy typów/interfejsów), sortowanie importów, kompletność zależności derywacji, zakaz `any`, zakaz logowania do konsoli, sufiksy ról plików — wszystko to wyrażaj jako reguły lintera/kompilatora włączone do CI, nie jako rozdział dokumentacji. Review ludzkie ma oceniać semantykę i design, nie pilnować formatowania.

**Dlaczego:** Konwencja z README jest przestrzegana do pierwszego deadline'u i pierwszego nowego członka zespołu. Reguła w CI jest przestrzegana zawsze, nie wymaga pamięci ani dobrej woli, i nie generuje dyskusji w review. Każda zautomatyzowana reguła to odzyskany budżet uwagi recenzenta.

**Przykład:** W projekcie referencyjnym macierz dozwolonych zależności między warstwami (szczegóły: ./architecture.md), prefiksy `I`/`T` typów, kebab-case nazw plików, sortowanie importów, kompletność zależności hooków i własna reguła wykrywająca niełapane błędy mutacji — wszystko żyło w konfiguracji lintera. README opisywało *dlaczego*, linter egzekwował *co*.

**Wyjątki:** Konwencje niewyrażalne statycznie (jakość nazwy, trafność abstrakcji, podział odpowiedzialności) — to domena review ludzkiego i ./antipatterns.md.

### TOOL-2. Iteruj precyzję reguł; docelowa severity to error, nie warning

**Reguła:** Nową konwencję zaczynaj od taniej reguły (zakaz składniowy, wzorzec tekstowy). Gdy generuje fałszywe alarmy — zainwestuj w pełną regułę z analizą zakresu/AST albo ją usuń. Docelowo każda reguła stoi na **error**: warning nie blokuje CI, więc jest ignorowany i eroduje.

**Dlaczego:** False positives erodują zaufanie do **całego** lintera, nie tylko do jednej reguły — zespół uczy się, że „lint marudzi" i przestaje czytać komunikaty. Warning to deklaracja „ta reguła nie jest ważna": skoro nie blokuje merge'a, nikt jej nie naprawia, a licznik warningów rośnie aż do momentu, gdy nikt już nie widzi nowych.

**Przykład:** W projekcie referencyjnym reguła wykrywająca mutacje bez obsługi błędu zaczęła jako prosty zakaz składniowy, który flagował także poprawny kod. Zamiast nauczyć zespół ignorowania warningów, została przepisana na pełną regułę z analizą zakresu (ok. 90 linii), bez fałszywych alarmów. Lekcja odwrotna z tego samego projektu: reguła pozostawiona na `warn` była systematycznie ignorowana — precyzyjna reguła na warning to wciąż reguła martwa.

**Wyjątki:** Okres przejściowy przy wdrażaniu reguły na istniejący kod: warning + jawny plan migracji z terminem podniesienia do error (albo lepiej: error + lista znanych wyjątków per plik, która może tylko maleć).

### TOOL-3. Komunikat reguły mówi, co zrobić

**Reguła:** Komunikat błędu lintera/reguły zawiera ścieżkę naprawy (co zrobić i gdzie), nie tylko diagnozę. Jeśli istnieje kilka legalnych napraw — wymień je.

**Dlaczego:** Reguła, która mówi tylko „to jest złe", przenosi koszt na każdego, kto na nią trafi (szukanie w dokumentacji, pytanie na kanale). Reguła z instrukcją naprawy amortyzuje koszt jednorazowo, przy pisaniu reguły. Dotyczy to też agentów AI — komunikat z instrukcją jest samonaprawialny.

**Przykład:**

```text
ŹLE:    "Unhandled promise from mutation."
DOBRZE: "Wywołanie mutacji może odrzucić obietnicę bez obsługi błędu.
         Opakuj wywołanie w try/catch albo przekaż handler onError.
         Feedback błędu jest wymagany — patrz reguła ERR-2 w errors.md."
```

**Wyjątki:** Brak.

### TOOL-4. Granicę i jej egzekwowanie wprowadzaj w tym samym PR

**Reguła:** Nowa granica architektoniczna (nowa warstwa, nowy moduł, nowa relacja „kto może importować kogo") i reguła narzędzia, która ją egzekwuje, wchodzą w jednym PR. Granica bez egzekwowania nie istnieje.

**Dlaczego:** Odstęp między „ustaliliśmy granicę" a „linter jej pilnuje" to okno, w którym powstają naruszenia — a każde naruszenie zastane przy włączaniu reguły staje się argumentem za jej rozmiękczeniem. Wprowadzenie obu naraz oznacza zero okresu bezprawia i zmusza autora granicy do sprawdzenia, czy jest w ogóle wyrażalna narzędziem.

**Przykład:** W projekcie referencyjnym rozbicie monolitycznej warstwy danych na cztery moduły weszło w jednym PR razem z tagami warstw i regułami lintera definiującymi dozwolone zależności — kolejny commit łamiący granicę nie przeszedł CI od pierwszego dnia.

**Wyjątki:** Brak. Jeśli granicy nie da się egzekwować narzędziem, zapisz to jawnie w decyzji architektonicznej wraz z planem ręcznej kontroli — ale traktuj to jako dług.

### TOOL-5. Nowy moduł = pełny szkielet od pierwszego commita

**Reguła:** Nowy moduł powstaje kompletny: konfiguracja builda, testów i lintera, tagi warstwy/zakresu dla reguł zależności, publiczny indeks, README z jednym zdaniem celu. Żadnych modułów „na razie bez testów, dodamy później".

**Dlaczego:** Braki w szkielecie są niewidoczne (moduł działa!) i dlatego nigdy nie są uzupełniane — aż do dnia, gdy ktoś chce dodać pierwszy test i odkrywa, że konfiguracji nie ma. Kompletny szkielet kosztuje minuty przy tworzeniu (zwykle: generator) i jest warunkiem działania reguł z TOOL-4.

**Przykład:** Mini-studium: w projekcie referencyjnym moduły tworzone generatorem miały komplet (build, test, lint, tagi) zawsze; jedyne moduły z dziurami konfiguracyjnymi to te tworzone ręcznie przez kopiowanie sąsiada — kopiowany był kod, nie konfiguracja.

**Wyjątki:** Brak.

---

## A11Y — dostępność

### A11Y-1. Semantyczny HTML przed ARIA

**Reguła:** Najpierw właściwy element (`button`, `nav`, `table`, `label`+pole, nagłówki w hierarchii), dopiero gdy semantyki brakuje — atrybuty ARIA. Klikalny `div` z rolą i obsługą klawiatury dopisaną ręcznie to ostateczność, nie wzorzec.

**Dlaczego:** Natywne elementy dają fokusowalność, obsługę klawiatury, semantykę dla czytników i stany za darmo; każda warstwa ARIA na nie-semantycznym elemencie to lista rzeczy do ręcznego utrzymania, która z czasem się rozjeżdża. Pierwsza reguła ARIA brzmi: nie używaj ARIA, jeśli istnieje element natywny.

**Przykład:**

```html
<!-- ŹLE — div udający przycisk: brak fokusa, brak Enter/Space, brak semantyki -->
<div class="action" onclick="archiveProject()">Archiwizuj projekt</div>

<!-- DOBRZE -->
<button type="button" onclick="archiveProject()">Archiwizuj projekt</button>
```

**Wyjątki:** Komponenty bez natywnego odpowiednika (combobox z filtrowaniem, grid z selekcją) — tam ARIA i obsługa klawiatury wg opublikowanych wzorców praktyk autorskich dla ARIA są obowiązkowe, nie opcjonalne.

### A11Y-2. Modal ma jeden kanoniczny wzorzec zachowania

**Reguła:** Każdy modal w aplikacji: pułapka fokusa wewnątrz, zamykanie klawiszem Escape, zwrot fokusa do elementu wywołującego po zamknięciu, fokus na sensownym elemencie po otwarciu. Wzorzec implementuj **raz**, w bazowym komponencie modala design-systemu — nie per użycie.

**Dlaczego:** Modal to najczęściej psuty wzorzec a11y, a przy własnym design-systemie nikt nie naprawi go za was. Implementacja per użycie gwarantuje rozjazd; implementacja w bazowym komponencie czyni poprawność domyślną.

**Przykład:** Mini-studium: jeśli w projekcie istnieją modale potwierdzenia (usunięcie zadania, anulowanie faktury) tworzone przez kopiowanie poprzedniego modala, kopiowany jest też każdy brak — pułapka fokusa dodana w jednym z nich nigdy nie trafia do pozostałych. Jeden `BaseModal` z kompletem zachowań + sloty na treść kończy problem strukturalnie (podział komponentów: ./components.md).

**Wyjątki:** Brak dla aplikacji; wyjątki zachowań (np. modal nie do zamknięcia Escape podczas zapisu) jako jawne propsy bazowego komponentu.

### A11Y-3. Kontrast walidowany na poziomie tokenów

**Reguła:** Pary kolorów (tekst/tło) definiuj i waliduj pod kątem kontrastu w theme/tokenach (szczegóły: ./styling.md), nie per komponent. Własny design system = własna odpowiedzialność za kontrast — żadna biblioteka tego nie załatwi.

**Dlaczego:** Kontrast sprawdzany per ekran to walka z hydrą; sprawdzany przy definicji tokenu — jednorazowy koszt. Skoro reguły stylowania zakazują surowych wartości kolorów poza tokenami, walidacja tokenów pokrywa całą aplikację.

**Przykład:** Token `color.status.warning.text` definiowany razem z `color.status.warning.background` jako para z wymaganym współczynnikiem kontrastu, sprawdzanym testem jednostkowym theme — nowy kolor statusu, który nie spełnia progu, nie przechodzi CI.

**Wyjątki:** Elementy dekoracyjne nieniosące informacji.

### A11Y-4. Lint a11y w CI

**Reguła:** Włącz statyczne reguły dostępności (alt obrazków, label pól, role, obsługa klawiatury przy handlerach myszy) do lintera jako error, od dnia zero. Uzupełniaj automatycznym audytem na poziomie testów integracyjnych dla kluczowych widoków.

**Dlaczego:** To samo co TOOL-1: a11y z checklisty w README umiera, a11y w CI żyje. Lint łapie klasę błędów najtańszych do naprawy w momencie pisania i najdroższych do znalezienia później.

**Przykład:** Reguła lintera flagująca `onClick` na elemencie niefokusowalnym bez odpowiednika klawiaturowego wymusza decyzję (użyj `button` / dodaj obsługę) w momencie pisania — zamiast zgłoszenia od użytkownika klawiatury pół roku później.

**Wyjątki:** Pojedyncze, uzasadnione tłumienia reguły inline z komentarzem dlaczego — nigdy wyłączenie reguły globalnie z powodu jednego przypadku.

---

## SEC — bezpieczeństwo frontendu

### SEC-1. Nie renderuj nieoczyszczonego HTML

**Reguła:** Treść z zewnątrz (API, użytkownik, CMS) renderuj jako tekst. Jeśli renderowanie HTML jest wymaganiem (treść redakcyjna), przepuszczaj przez sanityzator z białą listą tagów — w jednym, nazwanym miejscu, nie ad hoc per komponent.

**Dlaczego:** Wstrzyknięcie skryptu przez treść to najtańszy do popełnienia i najdroższy w skutkach błąd frontendu; każde użycie mechanizmu „wstaw surowy HTML" to potencjalny wektor. Centralizacja sanityzacji czyni ją audytowalną — grep po jednym module zamiast po całym repo.

**Przykład:**

```ts
// ŹLE — opis zadania z API prosto do DOM
container.innerHTML = task.description;

// DOBRZE — domyślnie tekst; HTML tylko przez nazwany sanityzator
render(task.description);                       // jako tekst
render(sanitizeRichText(task.description));     // świadomie, z białą listą
```

**Wyjątki:** Treść w 100% statyczna, zaszyta w repo (nie z API) — ale wtedy zwykle nie potrzebujesz surowego HTML.

### SEC-2. Tokeny sesji świadomie, najlepiej poza zasięgiem skryptów

**Reguła:** Preferuj mechanizmy sesji niedostępne dla kodu JS (np. ciasteczka httpOnly zarządzane przez backend). Jeśli architektura wymusza przechowywanie tokenu w pamięci dostępnej skryptom, podejmij tę decyzję jawnie (zapis decyzji architektonicznej z opisem ryzyka), minimalizuj czas życia tokenu i nigdy nie umieszczaj tokenów w URL.

**Dlaczego:** Token dostępny dla skryptów jest dostępny także dla każdego skryptu wstrzykniętego (SEC-1 ogranicza, ale nie zeruje tego ryzyka). „Świadomie odnotowane ryzyko" różni się od „nikt o tym nie pomyślał" tym, że ma właściciela i warunki rewizji.

**Przykład:** Mini-studium: w projekcie referencyjnym przechowywanie tokenu w magazynie przeglądarki zostało wybrane jawnie, z udokumentowanymi alternatywami i ryzykiem — dzięki czemu kolejni programiści wiedzieli, że to decyzja, a nie przeoczenie, i znali warunki, przy których należy ją zmienić.

**Wyjątki:** Brak — reguła sama w sobie jest gradientowa (preferencja + świadoma decyzja).

### SEC-3. Sekrety nie istnieją w bundlu

**Reguła:** Wszystko, co trafia do bundla frontendu (w tym zmienne „środowiskowe" wstrzykiwane przy buildzie), jest z definicji publiczne. Klucze API z uprawnieniami, sekrety podpisów, dane dostępowe — wyłącznie po stronie backendu/proxy.

**Dlaczego:** Bundle jest pobierany przez każdą przeglądarkę i trywialnie czytelny; „zaciemnienie" nie jest zabezpieczeniem. Konfiguracja frontendu to konfiguracja publiczna — to kryterium decyzji, co może w niej być.

**Przykład:** Klient mapowy wymaga klucza z limitem per domena (publiczny z założenia) — OK w bundlu. Klucz do API płatności z uprawnieniami do operacji — wyłącznie za własnym backendem, frontend woła własny endpoint.

**Wyjątki:** Brak.

### SEC-4. Sanityzacja PII w logach i błędach

**Reguła:** Logger produkcyjny i raportowanie błędów mają wbudowaną sanityzację danych osobowych (e-maile, nazwiska, identyfikatory klientów, treści formularzy) jako regułę warstwy logowania, nie jako pamięć programisty przy każdym wywołaniu. Nigdy nie loguj pełnych payloadów żądań/odpowiedzi na produkcji.

**Dlaczego:** Logi żyją dłużej i podróżują dalej niż dane, które opisują (zewnętrzne narzędzia, eksporty, dostęp supportu). Sanityzacja per wywołanie zawodzi statystycznie; sanityzacja w transporcie loggera zawodzi tylko, gdy ma dziurę — którą można testować.

**Przykład:**

```ts
// ŹLE — błąd zapisu klienta z pełnym payloadem do loga
logger.error('client save failed', { payload: clientFormData });

// DOBRZE — identyfikatory techniczne tak, dane osobowe nie
logger.error('client save failed', { clientId: client.id, errorCode: error.code });
```

Powiązane: zakaz logowania do konsoli w kodzie produkcyjnym egzekwowany lintem (TOOL-1); architektura loggera i obsługa błędów: ./errors.md.

**Wyjątki:** Środowiska deweloperskie mogą logować pełniej — pod jawną flagą środowiska, nigdy domyślnie.

---

## PERF — wydajność

### PERF-1. Code-splitting per domena/route

**Reguła:** Każda domena/feature ładuje się jako osobny chunk na granicy routingu. Architektura modułowa z jednokierunkowymi zależnościami (./architecture.md) ma to umożliwiać strukturalnie — to jeden z powodów zakazu globalnego stanu sprzęgającego domeny (./data-and-state.md).

**Dlaczego:** Użytkownik modułu fakturowania nie powinien płacić transferem i czasem parsowania za moduł harmonogramu zespołu. Splitting per domena jest tani, gdy granice modułów są czyste — i praktycznie niemożliwy, gdy wszystko zależy od wspólnego worka stanu.

**Przykład:** Mini-studium: ekran logowania ładujący cały bundle aplikacji (bo „wspólny stan" importuje każdą domenę) to klasyczny symptom — koszt naprawy rośnie z każdym sprzęgnięciem. Przy czystych granicach splitting to konfiguracja routingu, nie refactor.

**Wyjątki:** Bardzo mała aplikacja (kilka ekranów) — koszt dodatkowych żądań może przewyższyć zysk; ale utrzymuj strukturę, która splitting umożliwi.

### PERF-2. Budżet bundla pilnowany w CI

**Reguła:** Zdefiniuj budżet rozmiaru bundla (initial + per chunk) i włącz go do CI jako bramkę. Przekroczenie budżetu = czerwone CI = świadoma decyzja (podnieś budżet jawnym commitem z uzasadnieniem albo zmniejsz bundle), nie cichy dryf.

**Dlaczego:** Rozmiar bundla eroduje identycznie jak warning lintera (TOOL-2): nikt nie zauważa pojedynczej zależności +80 KB, wszyscy zauważają aplikację, która ładuje się 8 sekund — rok później. Budżet w CI zamienia erozję ciągłą w serię jawnych decyzji.

**Przykład:** Dodanie biblioteki wykresów do modułu raportów przekracza budżet chunka → CI czerwone → decyzja: lazy loading wykresów (PERF-4), lżejsza alternatywa, albo jawne podniesienie budżetu w tym samym PR z uzasadnieniem w opisie.

**Wyjątki:** Brak — budżet może być hojny, ale musi istnieć.

### PERF-3. Wirtualizacja długich list

**Reguła:** Listy/tabele o nieograniczonej liczbie wierszy (wyniki wyszukiwania, historie operacji, listy zadań) renderuj z wirtualizacją (tylko widoczne wiersze w DOM) — kupioną razem z komponentem grida albo własną. Decyzję podejmuj przy projektowaniu listy, nie po zgłoszeniu „lista 2000 faktur wiesza przeglądarkę".

**Dlaczego:** Koszt renderu rośnie liniowo z liczbą wierszy, a dane produkcyjne zawsze są większe niż deweloperskie. Dorabianie wirtualizacji do gotowej listy z bogatymi wierszami to refactor; wybranie jej na starcie to parametr.

**Przykład:** Lista zadań projektu: na środowisku deweloperskim 20 wierszy, u największego klienta 4000. Bez wirtualizacji: 4000 × (kilkadziesiąt węzłów DOM) przy każdym renderze. Z wirtualizacją: ~30 wierszy w DOM niezależnie od rozmiaru danych.

**Wyjątki:** Listy z twardym, małym limitem domenowym (np. maks. 12 członków zespołu) — wirtualizacja to wtedy zbędna złożoność.

### PERF-4. Lazy loading ciężkich, rzadkich widoków i zależności

**Reguła:** Funkcje ciężkie i rzadko używane (edytor tekstu sformatowanego, generator PDF, wykresy, eksporty) ładuj dopiero przy pierwszym użyciu — poniżej granicy route'a z PERF-1, na granicy konkretnej akcji.

**Dlaczego:** Mediana użytkowników nigdy nie klika „eksportuj do PDF" — nie powinna płacić za bibliotekę PDF przy każdym wejściu. To uzupełnienie PERF-1: splitting per route nie pomoże, gdy ciężar siedzi w często odwiedzanym widoku, ale za rzadką akcją.

**Przykład:** Przycisk „Pobierz raport PDF" w widoku faktur importuje moduł generatora dynamicznie przy kliknięciu (z loaderem na przycisku — stany akcji: ./errors.md), zamiast statycznie na górze pliku widoku.

**Wyjątki:** Funkcje rdzeniowe ścieżki krytycznej — tam lazy loading tylko pogarsza odczuwaną szybkość.

---

## DEPS — zarządzanie zależnościami

### DEPS-1. Aktualizacje narzędziem migracyjnym; lockfile w repo

**Reguła:** Wersje zależności podbijaj narzędziem migracyjnym ekosystemu (uruchamiającym skrypty migracji kodu), nie ręczną edycją manifestu. Lockfile zawsze w repo; instalacje w CI z lockfile'a w trybie ścisłym.

**Dlaczego:** Ręczne podbicie wersji omija migracje kodu, które autorzy bibliotek przygotowali — i zamienia 10-minutowy upgrade w dzień debugowania. Brak lockfile'a = każdy build potencjalnie inny; „u mnie działa" jako architektura.

**Przykład:** Mini-studium: w projekcie referencyjnym standardem było narzędzie migracyjne monorepo zamiast ręcznych podbić — aktualizacje frameworka przechodziły z automatycznymi przepisaniami kodu, a odstępstwa od tej ścieżki były źródłem niespójnych wersji.

**Wyjątki:** Paczki bez migracji i bez powiązań (np. czysta biblioteka dat) można podbić ręcznie — po przeczytaniu changeloga.

### DEPS-2. Nie zgaduj wersji ani API bibliotek; audytuj podatności okresowo

**Reguła:** Przed użyciem API biblioteki zweryfikuj je dla **zainstalowanej** wersji (lockfile/kod w `node_modules`), nie z pamięci — dotyczy szczególnie pracy z agentami AI, które chętnie generują API z innej epoki. Audyt podatności zależności uruchamiaj cyklicznie w CI, z jawną listą zaakceptowanych wyjątków.

**Dlaczego:** API bibliotek zmieniają się między wersjami głównymi; kod napisany „z pamięci" pod inną wersję czasem nawet się kompiluje i błędnie działa. Podatności bez cyklicznego audytu wykrywa dopiero incydent.

**Przykład:** Przed napisaniem adaptera do komponentu grida: sprawdź wersję w lockfile i sygnatury w zainstalowanym pakiecie; nie implementuj z przykładu z internetu bez sprawdzenia, której wersji dotyczy.

**Wyjątki:** Brak.

---

## GIT — proces git/PR

### GIT-1. Małe, tematyczne commity; struktura → logika → typy

**Reguła:** Commit ma jeden temat wyrażalny jednym zdaniem konwencjonalnego komunikatu. Większą zmianę tnij na sekwencję kompilowalnych kroków: najpierw zmiany struktury (przeniesienia, podziały plików), potem logika, potem domknięcie typów. Każdy krok zostawia projekt w działającym stanie (mechanika refactoru: ./refactoring.md).

**Dlaczego:** Commit „wszystko naraz" jest nierecenzowalny i nieodwracalny punktowo (revert cofa też to, co było dobre). Sekwencja kroków pozwala recenzentowi czytać każdy krok innym trybem uwagi i bisectować regresje do małego diffa.

**Przykład:** Refactor sekcji listy zadań: commit 1 — podział pliku na Section/List/Item bez zmian zachowania; commit 2 — wyniesienie sortowania do czystej funkcji; commit 3 — domknięcie typów interfejsów propsów. Trzy szybkie recenzje zamiast jednej niemożliwej.

**Wyjątki:** Trywialna zmiana (literówka, jeden styl) nie wymaga ceremonii.

### GIT-2. Zmiany mechaniczne osobno od semantycznych

**Reguła:** Masowe substytucje (formatowanie, migracja literałów na tokeny, zmiana nazwy w N plikach, sort importów) commituj osobno od zmian zachowania — najlepiej jako commity oznaczone jako techniczne, o których recenzent wie, że może je skanować, nie czytać.

**Dlaczego:** Zmiana semantyczna ukryta w 60-plikowym diffie mechanicznym jest niewidoczna — to najskuteczniejszy sposób przemycenia buga przez review. Rozdzielenie pozwala zrecenzować mechaniczny diff w minutę (spot-check + zaufanie do narzędzia), a semantyczny z pełną uwagą.

**Przykład:** W projekcie referencyjnym migracja setek literałów pikselowych na design tokens w kilkudziesięciu plikach (./styling.md) została wykonana jako czysta substytucja w osobnych commitach technicznych, bez żadnej zmiany logiki — diff o setkach linii, recenzja w minuty, zero regresji.

**Wyjątki:** Mikrozmiana mechaniczna w pliku i tak zmienianym semantycznie (poprawka literówki obok) — dopuszczalna, jeśli nie zaciemnia diffa.

### GIT-3. Czyste rename'y

**Reguła:** Zmianę nazwy/ścieżki pliku rób przez operację rename systemu kontroli wersji, w commicie bez równoczesnych dużych zmian treści tego pliku — tak, by narzędzie wykryło podobieństwo i zachowało historię.

**Dlaczego:** Rename połączony z przepisaniem treści wygląda dla narzędzi jak „usunięto plik A, dodano niepowiązany plik B" — ginie historia, blame i kontekst decyzji. Historia pliku to dokumentacja, której nikt nie pisze, ale wszyscy czytają.

**Przykład:** Zmiana `task-list.component.ts` → `assignment-list.component.ts` plus przepisanie wnętrza: commit 1 — sam rename; commit 2 — zmiany treści. Blame nadal prowadzi do oryginalnych decyzji.

**Wyjątki:** Plik kilkulinijkowy — utrata historii bywa akceptowalna; decyzja świadoma, nie domyślna.

### GIT-4. PR o rozmiarze recenzowalnym; automatyczny reviewer jako siatka, nie zamiennik

**Reguła:** PR ma być recenzowalny w jednym posiedzeniu (orientacyjnie do ~400 linii zmian semantycznych; mechaniczne liczone osobno — GIT-2). Większy zakres tnij na łańcuch PR-ów (możliwa fasada kompatybilności na czas migracji — ./refactoring.md). Automatyczne narzędzia recenzji traktuj jako dodatkową siatkę na klasy błędów, nie jako zamiennik recenzji ludzkiej. Unikaj cherry-picków duplikujących commity między długo żyjącymi gałęziami.

**Dlaczego:** Jakość recenzji spada nieliniowo z rozmiarem — po pewnym progu recenzent przestaje czytać i zaczyna akceptować. Zduplikowane commity z cherry-picków produkują konflikty i fałszywą historię. Automat znajduje literówki i wzorce; nie oceni, czy abstrakcja jest trafna.

**Przykład:** Mini-studium: w projekcie referencyjnym największe regresje (zgubiony stan błędu widoku — ./refactoring.md) przechodziły przez review właśnie w dużych PR-ach refactorowych — recenzent nie miał szansy zauważyć **braku** kodu w wielkim diffie. Mniejsze kroki + checklista inwentaryzacji stanów to odpowiedź procesowa.

**Wyjątki:** Niedzielne masowe migracje narzędziowe (jeden temat, ogromny mechaniczny diff) mogą przekraczać limit — bo recenzuje się metodę substytucji, nie każdą linię.
