# Style i design tokens

Reguły stylowania interfejsu: skąd biorą się wartości wizualne, gdzie żyją deklaracje stylów i jak utrzymać spójność, gdy projekt rośnie. Wspólny mianownik wszystkich reguł: **styl jest pochodną systemu (tokenów), nie decyzją podejmowaną ad-hoc w pliku komponentu.** Reguły są framework-agnostic — przykłady używają neutralnego pseudokodu CSS-in-TS/SCSS i tokenów jako CSS custom properties. Mapowanie na konkretny stack: ./angular.md.

Powiązane: ./architecture.md (warstwa design-system i theme jako moduły o zerowych zależnościach), ./components.md (granica komponent prezentacyjny vs logika), ./conventions-and-tooling.md (egzekwowanie reguł stylowania linterem, kontrast w tokenach), ./antipatterns.md (magic values i hexy w stylach), ./refactoring.md (zmiany mechaniczne osobnym commitem), ./checklist.md (tokeny od dnia zero).

---

## STYLE-1 — Gradient stylowania: cztery poziomy preferencji

**Reguła.** Stylując element, schodź po hierarchii i zatrzymaj się na pierwszym poziomie, który wystarcza: (1) design tokens / theme — docelowo zdecydowana większość stylu aplikacji; (2) goły komponent design-systemu bez żadnych nadpisań; (3) nazwany styled-wrapper czerpiący wartości z tokenów; (4) styl inline — wyłącznie dla trywialnych, jednorazowych przypadków. Zanim nadpiszesz wymiar lub odstęp komponentu design-systemu, **najpierw usuń nadpisanie i sprawdź default** — często nadpisanie powiela to, co theme i tak by dał.

**Dlaczego.** Binarny zakaz („NIGDY inline") jest niewykonalny i eroduje — w projekcie referencyjnym, z którego wyprowadzono te reguły, spisany standard zespołu sam musiał zostać zmieniony z absolutnego zakazu na gradient, bo praktyka go łamała na każdym kroku. Gradient daje za to jednoznaczny tryb decyzji: im wyżej w hierarchii rozwiążesz problem, tym taniej projekt skaluje się wizualnie (zmiana w theme = zmiana wszędzie; zmiana w inline = polowanie grep-em). Cel kierunkowy: rząd 95% decyzji wizualnych w samym theme.

**Przykład.**

```ts
// ŹLE — poziom 4 użyty tam, gdzie wystarczał poziom 1/2:
// nadpisanie wysokości pola, które theme i tak definiuje
<SearchInput style={{ height: 40, borderColor: '#cccccc' }} />

// DOBRZE — poziom 2: goły komponent DS, defaulty z theme wystarczają
<SearchInput />

// DOBRZE — poziom 3: realna potrzeba odstępstwa → nazwany wrapper z tokenów
const InvoiceFilterInput = styled(SearchInput)`
  max-width: var(--size-filter-input-max);
  margin-inline-end: var(--spacing-sm);
`;

// AKCEPTOWALNE — poziom 4: trywialny, jednorazowy przypadek bez semantyki
<Spacer style={{ flexGrow: 1 }} />
```

Mini-studium: w projekcie referencyjnym refactor jednego z widoków detalu obejmował m.in. inline'owe `height: 40` na polach formularza — zamiast przenosić wartość do wrappera, nadpisanie po prostu **usunięto**, bo default komponentu z theme dawał identyczny wynik. Najtańszy styl to ten, którego nie ma.

**Wyjątki.** Poziom 4 pozostaje legalny dla styli czysto mechanicznych i lokalnych (np. `flexGrow`, jednorazowy `textAlign`), które nie niosą wartości projektowych (kolorów, wymiarów, typografii). Jeśli inline zawiera kolor, rozmiar w pikselach lub font — to sygnał, że jesteś na złym poziomie gradientu.

---

## STYLE-2 — Zero surowych wartości wizualnych; token musi nieść semantykę

**Reguła.** Kolory, odstępy, typografia, promienie, cienie — wyłącznie z tokenów. Brakuje wariantu typografii? Użyj najbliższego istniejącego, nie dodawaj wartości ad-hoc (a jeśli najbliższy systematycznie nie wystarcza — rozszerz theme, czyli wróć na poziom 1 gradientu). Symetrycznie: **nie tokenizuj mechanicznie** wartości, dla których token nie ma sensu semantycznego. Style deklaruj zawsze jako funkcję theme/tokenów, nawet jeśli dziś żadnego tokenu nie używasz — to utrzymuje otwarte drzwi bez przepisywania sygnatur.

**Dlaczego.** Surowa wartość to decyzja projektowa zakopana w pliku: niewidoczna dla design-systemu, niemożliwa do globalnej zmiany, gwarantowany rozjazd z paletą. W projekcie referencyjnym surowy hex koloru sukcesu wpisany w jednym z paneli po cichu rozjechał się z paletą i został wykryty dopiero przy refactorze unifikującym statusy; z kolei komentarze w stylu `// todo: move to theme` przy surowych wartościach były „spłacane" miesiącami. Druga strona medalu: token spacingu użyty jako szerokość kolumny layoutu fałszuje semantykę — czytelnik myśli, że to odstęp w skali rytmu, a to wymiar strukturalny.

**Przykład.**

```scss
/* Tokeny — jedno źródło prawdy (CSS custom properties): */
:root {
  --color-status-success: #008000;   /* jedyne miejsce z hexem */
  --color-surface-info: #e6f0fa;
  --spacing-sm: 8px;
  --spacing-lg: 24px;
  --size-side-panel-width: 320px;    /* wymiar layoutu = własny token, nie spacing */
}
```

```ts
// ŹLE — surowe wartości + dług zakopany w komentarzu:
const TaskSummaryCard = styled.div`
  background-color: #e6f0fa; /* todo: move to theme */
  gap: 24px;
  color: #008000;
`;

// ŹLE w drugą stronę — token bez semantyki (nadgorliwa tokenizacja):
width: calc(var(--spacing-lg) * 13.3); /* "320px" wymuszone ze spacingu */

// DOBRZE:
const TaskSummaryCard = styled.div`
  background-color: var(--color-surface-info);
  gap: var(--spacing-lg);
  color: var(--color-status-success);
`;
const ClientSidePanel = styled.aside`
  width: var(--size-side-panel-width);
`;
```

Egzekwowanie: zakaz literałów kolorów (`#`, `rgb(`) i jednostek px poza plikami tokenów wyrażaj regułą statyczną na poziomie error, nie konwencją w README (szczegóły: ./conventions-and-tooling.md). Kontrast walidujesz raz, na poziomie palety tokenów — nie per użycie.

**Wyjątki.** Wartości bez tożsamości projektowej: `0`, `1px` na border/hairline, `100%`, `auto`, proporcje (`flex: 1`). Prototyp/spike może łamać regułę, ale nie przechodzi przez review do głównej gałęzi z surowymi wartościami.

---

## STYLE-3 — Style nazwane i współlokowane; granica styl-vs-komponent

**Reguła.** Każdy styled-wrapper ma nazwę dokumentującą **intencję**, nie efekt (`StyledErrorTitle`, nie „kontener z marginesem"). Style żyją obok komponentu, który stylują: prosty komponent (poniżej ~200 linii łącznie) może trzymać style w tym samym pliku; złożony — w sąsiednim pliku styles. Granica twarda: **jeśli „styl" potrzebuje propsów logicznych, tłumaczeń albo children — to jest komponent** i należy mu się własny plik z rolą komponentu. Odstępy deklaruj na elemencie docelowym, nie przez dodatkowy wrapper-przekładkę.

**Dlaczego.** Anonimowy odstęp (`margin-bottom: 18px` gdzieś w drzewie) nie mówi, czemu służy i czy wolno go zmienić; nazwany styl jest grep-owalny i recenzowalny. Wrapper-przekładka tylko po to, by nadać sąsiadowi margines, dokłada węzeł do drzewa i rozprasza odpowiedzialność za rytm pionowy. Komponenty przemycone do pliku styles łamią konwencję „sufiks pliku deklaruje rolę" (./architecture.md) — w projekcie referencyjnym takie wrzutki zostały wycofane w review, bo plik styles przestawał być bezpieczny do mechanicznych zmian.

**Przykład.**

```ts
// ŹLE — wrapper-przekładka + anonimowy styl:
<div style={{ marginBottom: 18 }}>
  <Divider />
</div>

// DOBRZE — odstęp na elemencie docelowym, nazwa niesie intencję:
const SectionDivider = styled(Divider)`
  margin-block-end: var(--spacing-md);
`;

// ŹLE — "styl" z logiką i tłumaczeniem to nie styl:
// project-list.styles.ts
export const EmptyHint = ({ onCreate }) => (
  <HintBox>
    {translate('PROJECT.LIST.EMPTY_HINT')}
    <Button onClick={onCreate}>{translate('PROJECT.LIST.CREATE')}</Button>
  </HintBox>
);

// DOBRZE — awansuje na komponent z własnym plikiem:
// project-list-empty-hint.component.ts  (+ HintBox zostaje w styles)
```

**Wyjątki.** Style generyczne, używane przez wiele feature'ów, należą do warstwy design-systemu, nie do kolokacji przy pojedynczym konsumencie — ale ekstrakcja dopiero przy realnym drugim/trzecim konsumencie (progi abstrakcji: ./architecture.md).

---

## STYLE-4 — Propsy konfiguracyjne nie wyciekają do warstwy niższej

**Reguła.** Parametry sterujące wyglądem wrappera (warianty, flagi gęstości, poziomy wcięcia itp.) filtruj, zanim element trafi do warstwy niższej — do DOM-u lub do bazowego komponentu, który ich nie rozumie. Mechanizm filtrowania (whitelist/blocklist propsów przekazywanych dalej) ustal raz, w design-systemie, i stosuj we wszystkich wrapperach.

**Dlaczego.** Props konfiguracyjny przepuszczony do DOM ląduje jako nieznany atrybut HTML: ostrzeżenia w konsoli, śmieci w markupie, w skrajnym przypadku kolizja z prawdziwym atrybutem (`size`, `color`, `title`). Przepuszczony do bazowego komponentu — zmienia jego zachowanie w nieprzewidziany sposób albo cicho czeka, aż biblioteka doda props o tej nazwie. Każdy z tych błędów jest niewidoczny na happy-path i wychodzi w najmniej spodziewanym momencie.

**Przykład.**

```ts
// ŹLE — `isOverdue` i `density` przeciekają do <li> jako atrybuty DOM:
const TaskListItem = styled.li`
  color: ${({ isOverdue }) =>
    isOverdue ? 'var(--color-status-error)' : 'var(--color-text-primary)'};
  padding-block: ${({ density }) =>
    density === 'compact' ? 'var(--spacing-xs)' : 'var(--spacing-sm)'};
`;
// → <li isoverdue="true" density="compact"> w markupie

// DOBRZE — propsy konfiguracyjne zatrzymane na granicy:
const TaskListItem = styled.li.withConfigProps(['isOverdue', 'density'])`
  /* ...te same style; do DOM idą tylko standardowe atrybuty */
`;
```

W konwencjach bez mechanizmu filtrowania (czyste SCSS + klasy) odpowiednikiem reguły jest: konfiguracja → klasa modyfikatora lub atrybut `data-*` (`data-density="compact"`), nigdy wymyślony atrybut.

**Wyjątki.** Propsy będące legalnym kontraktem warstwy niższej (np. `disabled`, `aria-*`, `data-*`) przepuszczaj świadomie — to nie konfiguracja wrappera, tylko API elementu docelowego.

---

## STYLE-5 — RWD planuj od tokenów; migracja na tokeny jako osobny, mechaniczny commit

**Reguła.** Responsywność buduj wyłącznie na breakpointach i tokenach z theme — zero literałów `@media (max-width: 900px)` w komponentach. Jeśli kod zawiera surowe wartości wizualne, **migracja na tokeny jest warunkiem wstępnym RWD** i wykonuj ją jako czysto mechaniczną substytucję: osobny commit (typ chore), zero zmian logiki, diff czytelny jako 1:1 podmiana literał→token.

**Dlaczego.** RWD na literałach to mnożenie magii: każdy breakpoint i każdy wymiar pojawia się w N plikach i natychmiast się rozjeżdża. W projekcie referencyjnym setki literałów px w kilkudziesięciu plikach trzeba było zmigrować na tokeny, zanim w ogóle dało się zacząć prace nad responsywnością — a koszt tej migracji rósł liniowo z liczbą plików, czyli każdy miesiąc odkładania dopisywał do rachunku. Oddzielenie migracji od zmian logiki jest kluczowe dla review: commit, który jest w 100% substytucją, recenzuje się w minuty i bez ryzyka; commit mieszający substytucję z refactorem ukrywa regresje (mechanika: ./refactoring.md).

**Przykład.**

```scss
/* Tokeny breakpointów i wymiarów — jedno źródło: */
:root {
  --breakpoint-md: 768px;
  --breakpoint-lg: 1200px;
  --size-schedule-column-min: 160px;
}

/* ŹLE — literały rozsiane po komponentach: */
.schedule-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
@media (max-width: 768px) { .schedule-grid { grid-template-columns: 1fr; } }

/* DOBRZE — wymiar z tokenu, breakpoint przez współdzielony mechanizm
   (mixin / helper theme), nie literał per plik: */
.schedule-grid {
  grid-template-columns:
    repeat(auto-fill, minmax(var(--size-schedule-column-min), 1fr));
}
@include below(md) {
  .schedule-grid { grid-template-columns: 1fr; }
}
```

Proces migracji istniejącego kodu: (1) commit A — definicja brakujących tokenów; (2) commit B — mechaniczna substytucja literał→token, bez żadnej innej zmiany (idealnie symetryczny diff +N/−N); (3) dopiero kolejne commity — właściwe zmiany RWD. Każdy krok osobno kompilowalny i osobno recenzowalny.

**Wyjątki.** Jednorazowy media-query dla konkretnego artefaktu (np. styl druku faktury) może być lokalny — ale wartości wymiarów w nim nadal pochodzą z tokenów.

---

## Skrót decyzyjny

| Pytanie | Odpowiedź |
| --- | --- |
| Skąd wziąć kolor/odstęp/font? | Z tokenu; brak tokenu → najbliższy istniejący lub rozszerz theme (STYLE-2) |
| Czy nadpisać komponent DS? | Najpierw usuń nadpisanie i sprawdź default (STYLE-1) |
| Inline czy wrapper? | Inline tylko bez wartości projektowych; reszta → nazwany wrapper z tokenów (STYLE-1, STYLE-3) |
| Styl potrzebuje logiki/i18n/children? | To komponent — własny plik, rola komponentu (STYLE-3) |
| Props wariantu wrappera | Filtruj przed DOM/komponentem bazowym (STYLE-4) |
| Zaczynamy RWD, a w kodzie literały | Najpierw mechaniczna migracja na tokeny, osobnym commitem (STYLE-5) |
