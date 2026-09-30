# Komponenty i podział odpowiedzialności

Reguły podziału komponentów, przepływu danych przez drzewo widoku i kryteriów reużywalności. Framework-agnostic — snippety to TypeScript z pseudokodem komponentów (składnia JSX-podobna jest tu tylko notacją drzewa widoku). Mapowanie na konkretny stack: ./angular.md. Granice warstw, w których komponenty żyją: ./architecture.md. Macierz stanów loading/error/empty/success, do której reguły się odwołują: ./errors.md.

Wspólny mianownik wszystkich reguł: **komponent ma jedną oś odpowiedzialności** (orkiestracja ALBO układ ALBO dane ALBO prezentacja jednego elementu), a dane płyną najkrótszą drogą do konsumenta — nie przez wszystkie piętra drzewa.

---

## COMP-1. Cienki root-orkiestrator; pobieranie danych kolokuj z konsumentem

**Reguła**
Komponent-root strony pobiera wyłącznie zasób krytyczny dla całego widoku (zwykle jeden) i komponuje sekcje. Każda niezależna sekcja sama pobiera swoje dane i sama obsługuje własne stany loading/error/empty.

**Dlaczego**
Root agregujący N zapytań i N flag ładowania blokuje render sekcji już gotowych, zamienia każdą zmianę dowolnej sekcji w edycję roota (konflikt-magnet) i produkuje nieczytelne warunki typu `isLoading = a || b || c || ...`. W projekcie referencyjnym, z którego wyprowadzono te reguły, root jednego widoku detalu trzymał 9 zapytań i flagę ładowania składaną z 9 wartości — po refaktorze został 1 hook, a sekcje pobierają dane same.

**Przykład**

```tsx
// ŹLE — root zna wszystkie dane wszystkich sekcji
function ProjectDetailsPage({ projectId }: { projectId: string }) {
  const project = useProjectQuery(projectId);
  const tasks = useProjectTasksQuery(projectId);
  const members = useProjectMembersQuery(projectId);
  const invoices = useProjectInvoicesQuery(projectId);
  const history = useProjectHistoryQuery(projectId);

  const isLoading =
    project.isLoading || tasks.isLoading || members.isLoading ||
    invoices.isLoading || history.isLoading;

  if (isLoading) return <PageSkeleton />; // blokuje WSZYSTKO do czasu najwolniejszego zapytania

  return (
    <Layout
      header={<ProjectHeader project={project.data} />}
      tasks={<TaskSection tasks={tasks.data} />}
      members={<MemberSection members={members.data} />}
      invoices={<InvoiceSection invoices={invoices.data} />}
      history={<HistorySection entries={history.data} />}
    />
  );
}
```

```tsx
// DOBRZE — root pobiera tylko zasób krytyczny; sekcje są samowystarczalne
function ProjectDetailsPage({ projectId }: { projectId: string }) {
  const project = useProjectQuery(projectId); // jedyny zasób, bez którego widok nie istnieje

  if (project.isLoading) return <PageSkeleton />;
  if (project.isError) return <PageError onRetry={project.refetch} />;

  return (
    <Layout
      header={<ProjectHeader project={project.data} />}
      tasks={<TaskSection projectId={projectId} />}      // pobiera same, własny loading/error/empty
      members={<MemberSection projectId={projectId} />}
      invoices={<InvoiceSection projectId={projectId} />}
      history={<HistorySection projectId={projectId} />}
    />
  );
}
```

**Wyjątki**
Dane realnie współdzielone przez wiele sekcji (np. obiekt projektu konsumowany przez nagłówek i dwie sekcje) pobierz raz wyżej i podaj w dół — kolokacja nie oznacza N duplikatów tego samego zapytania w rodzeństwie; przy bibliotece cache'u zapytań deduplikacja po kluczu i tak rozwiązuje to drugie (szczegóły: ./data-and-state.md).

---

## COMP-2. Layout to szkielet przestrzenny, nie magistrala danych

**Reguła**
Komponent layoutu rozmieszcza sekcje w przestrzeni i przekazuje co najwyżej minimalny kontrakt (główny obiekt lub identyfikator). Decyzje przekrojowe — uprawnienia, ładowanie, widoczność — podejmuje komponent, którego dotyczą, nie layout.

**Dlaczego**
Layout-przekaźnik z kilkunastoma propsami trzeba edytować przy każdej zmianie dowolnej sekcji, a jego sygnatura kłamie: sugeruje, że layout „wie" o uprawnieniach i stanach, choć tylko je przepycha. W projekcie referencyjnym layout widoku detalu urósł do ~20 propsów; po refaktorze przyjmuje jeden obiekt danych, a każda sekcja sama owija się w bramkę uprawnień.

**Przykład**

```tsx
// ŹLE — layout jako magistrala: propsy każdej sekcji przechodzą przez niego
<DetailsLayout
  project={project}
  tasks={tasks} tasksLoading={tasksLoading} canEditTasks={canEditTasks}
  members={members} canManageMembers={canManageMembers}
  invoices={invoices} invoicesError={invoicesError} onInvoiceRetry={retry}
/>
```

```tsx
// DOBRZE — layout dostaje gotowe sekcje jako sloty; sekcje same decydują o sobie
<DetailsLayout
  main={<TaskSection projectId={project.id} />}
  side={
    <Restricted to={PERMISSIONS.MEMBERS_MANAGE}>
      <MemberSection projectId={project.id} />
    </Restricted>
  }
  footer={<InvoiceSection projectId={project.id} />}
/>
```

**Wyjątki**
Brak. Jeśli layout „musi" znać dane, to znaczy, że sekcja powinna być przekazana jako slot (patrz COMP-5) albo dane należą do sekcji, nie do layoutu.

---

## COMP-3. Różnica tylko w danych ⇒ jeden komponent + N wywołań; różnica w strukturze ⇒ dwa komponenty

**Reguła**
Wariant różniący się wyłącznie danymi (inna rola, inny status, inny zasób tego samego kształtu) modeluj parametrem jednego komponentu, nie kopią pliku. Wariant różniący się **strukturą i zachowaniem** modeluj jako dwa komponenty współdzielące mniejsze klocki — nie jako jeden komponent z flagami rozsianymi po drzewie. Generyczny rdzeń (tabela, pasek filtrów) wydzielaj dopiero przy drugim realnym konsumencie.

**Dlaczego**
Kopia pliku „bo inna rola" rozjeżdża się przy pierwszej zmianie i mnoży miejsca do naprawy buga. Z drugiej strony jeden komponent obsługujący dwa strukturalnie różne widoki przez `if (variant === ...)` w pięciu miejscach skaluje się wykładniczo. W projekcie referencyjnym trzy bliźniacze sekcje członków zespołu (różne role, identyczna struktura) zwinięto do jednego komponentu wywołanego trzykrotnie; jednocześnie listę aktywną i zarchiwizowaną (inne kolumny, inne akcje, inny pusty stan) rozdzielono na dwa komponenty nad wspólną bazą — a flagę `isArchived` usunięto z drzewa.

**Przykład**

```tsx
// ŹLE — trzy pliki różniące się wyłącznie parametrem zapytania
// managers-section.tsx, developers-section.tsx, testers-section.tsx
function ManagersSection({ projectId }) {
  const members = useMembersQuery(projectId, { role: 'MANAGER' });
  return <MemberList title={t('MEMBERS.MANAGERS')} members={members} />;
}
// ...dwie niemal identyczne kopie obok
```

```tsx
// DOBRZE — jeden komponent, trzy wywołania
function MemberSection({ projectId, role }: { projectId: string; role: TRole }) {
  const members = useMembersQuery(projectId, { role });
  return <MemberList title={t(`MEMBERS.${role}`)} members={members} />;
}

<MemberSection projectId={id} role="MANAGER" />
<MemberSection projectId={id} role="DEVELOPER" />
<MemberSection projectId={id} role="TESTER" />
```

```tsx
// ŹLE — różna struktura upchnięta w jeden komponent flagą
function InvoiceList({ archived }: { archived: boolean }) {
  return (
    <Table columns={archived ? ARCHIVED_COLUMNS : ACTIVE_COLUMNS}>
      {archived ? null : <BulkActions />}
      {/* ...kolejne rozgałęzienia po `archived` w toolbarze, wierszu, pustym stanie */}
    </Table>
  );
}

// DOBRZE — dwa komponenty + wspólna baza wydzielona przy N=2
function ActiveInvoiceList() {
  return <InvoiceListBase columns={ACTIVE_COLUMNS} toolbar={<BulkActions />} />;
}
function ArchivedInvoiceList() {
  return <InvoiceListBase columns={ARCHIVED_COLUMNS} emptyState={<ArchiveEmpty />} />;
}
```

**Wyjątki**
Nie wydzielaj generycznego rdzenia przy jednym konsumencie „na zapas" — w projekcie referencyjnym rejestr wariantów zbudowany dla N=1 został w całości usunięty; baza listy wydzielona przy N=2 przetrwała. Próg abstrakcji: ./antipatterns.md.

---

## COMP-4. Listowe UI: Section → List → Item; czyste transformacje poza komponentem

**Reguła**
Widok listy tnij na trzy odpowiedzialności: **Section** (pobranie danych, obudowa, stan loading/error), **List** (stan empty, sortowanie/iteracja), **Item** (render jednego elementu). Sortowanie, grupowanie i mapowanie wynoś jako czyste funkcje modułowe poza komponent.

**Dlaczego**
Monolit listy miesza cztery osie zmian w jednym pliku — w projekcie referencyjnym ponad-100-liniowa sekcja historii zawierała dwie **identyczne** gałęzie warunku, czego nikt nie zauważał, bo plik był nieczytelny. Czyste funkcje poza komponentem są testowalne jednostkowo bez renderowania czegokolwiek (./testing.md).

**Przykład**

```tsx
// ŹLE — wszystko w jednym: fetch, sort inline, empty, iteracja, kształt elementu
function TaskHistorySection({ taskId }) {
  const { data, isLoading } = useTaskHistoryQuery(taskId);
  if (isLoading) return <Spinner />;
  const sorted = [...(data ?? [])].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <Card title={t('HISTORY.TITLE')}>
      {sorted.length === 0
        ? <Text>{t('HISTORY.EMPTY')}</Text>
        : sorted.map((e) => (
            <Row key={e.id}>
              <Avatar name={e.author} /> <Text>{formatChange(e)}</Text> {/* + 30 linii */}
            </Row>
          ))}
    </Card>
  );
}
```

```ts
// DOBRZE — trzy pliki + czysta funkcja
// history.utils.ts
export const sortNewestFirst = (entries: IHistoryEntry[]): IHistoryEntry[] =>
  [...entries].sort((a, b) => b.date.localeCompare(a.date));
```

```tsx
// history-section.tsx — dane + obudowa + loading/error
function TaskHistorySection({ taskId }) {
  const { data, isLoading, isError, refetch } = useTaskHistoryQuery(taskId);
  return (
    <CollapsibleSection title={t('HISTORY.TITLE')} loading={isLoading}
                        error={isError} onRetry={refetch}>
      <HistoryList entries={data ?? []} />
    </CollapsibleSection>
  );
}

// history-list.tsx — empty + iteracja
function HistoryList({ entries }: { entries: IHistoryEntry[] }) {
  if (entries.length === 0) return <NoData message={t('HISTORY.EMPTY')} />;
  return sortNewestFirst(entries).map((e) => <HistoryItem key={e.id} entry={e} />);
}

// history-item.tsx — jeden element
function HistoryItem({ entry }: { entry: IHistoryEntry }) { /* ... */ }
```

**Wyjątki**
Lista trywialna (kilka linii, brak stanów pośrednich, brak logiki elementu) nie wymaga trzech plików — podział stosuj, gdy którakolwiek z trzech odpowiedzialności przestaje być jednolinijkowa.

---

## COMP-5. Warianty zachowań przez kompozycję (sloty / komponenty złożone), nie flagi boolean na monolicie

**Reguła**
Rdzeń o wielu wariantach modeluj jako rodzinę komponowalnych części (sloty, compound components), a zachowania grupowe (selekcja, akordeon, synchronizacja) — kontekstem rodzica, który dziecko wykrywa i bez którego degraduje się do trybu standalone. Każda kolejna flaga boolean na monolicie to sygnał do dekompozycji.

**Dlaczego**
Flagi skalują się wykładniczo (2^n kombinacji, większość nietestowana), kompozycja liniowo. W projekcie referencyjnym monolityczny kalendarz z flagami `canEditX`/`canEditY` zastąpiono rodziną `Calendar.Header` / `Calendar.Toggles` / `Calendar.Grid` z opcjonalnym rodzicem grupującym — diff refaktoru był ujemny.

Rozróżnienie (ważne): **kontekst wewnętrzny rodziny compound-componentu jest częścią jej API i jest legalny; konsumpcja kontekstu aplikacji/feature'a wewnątrz komponentu współdzielonego jest zakazana** — bind robi cienki adapter po stronie feature'a, a komponent dostaje wartości i callbacki propsami (patrz COMP-6).

**Przykład**

```tsx
// ŹLE — monolit sterowany flagami; każdy nowy wariant = nowa flaga i nowe ify w środku
<SchedulePanel
  showHeader
  showAbsenceToggles={canEditAbsence}
  showHourEditor={canEditHours}
  compactMode={isInGroup}
  hideWeekends
/>
```

```tsx
// DOBRZE — kompozycja: konsument składa dokładnie to, czego potrzebuje
<Schedule member={member}>
  <Schedule.Header />
  {canEditAbsence && <Schedule.AbsenceToggles />}
  <Schedule.Grid hideWeekends />
</Schedule>

// zachowanie grupowe przez rodzica; dziecko działa też samodzielnie
<ScheduleGroup selectedIds={selected} onSelect={setSelected}>
  <Schedule member={alice}>...</Schedule>
  <Schedule member={bob}>...</Schedule>
</ScheduleGroup>
```

Antywzorzec pokrewny: rodzic czytający propsy dzieci przez introspekcję (`child.props.memberId`) — kruche, łamie się przy każdym wrapperze; dzieci rejestrują się przez kontekst rodziny albo rodzic dostaje listę identyfikatorów propem (./antipatterns.md).

**Wyjątki**
Jedna binarna opcja czysto prezentacyjna (np. `dense`) może pozostać propsem — kompozycja jest odpowiedzią na *mnożenie się* wariantów, nie na pierwszy z nich.

---

## COMP-6. Komponent trafia do biblioteki współdzielonej dopiero, gdy jest odcięty od aplikacji

**Reguła**
Warunki ekstrakcji do biblioteki współdzielonej: (1) własny **minimalny model UI** — mapowanie typu z warstwy danych na model komponentu robi konsument, nie komponent; (2) teksty, formaty dat, stany ładowania wchodzą przez propsy lub sloty, nigdy przez import zasobów aplikacji; (3) zero zależności od warstwy danych i kontekstów feature'a — granica wymuszona lintem (./architecture.md); (4) jawne, otypowane publiczne API. Nie generalizuj na zapas — i miej odwagę **cofnąć ekstrakcję**, gdy potrzeby konsumentów się rozjadą.

**Dlaczego**
Komponent „współdzielony", który importuje typy API, klucze tłumaczeń i kontekst aplikacji, jest współdzielony tylko z nazwy: nie da się go użyć w drugim miejscu ani przetestować w izolacji, a każda zmiana aplikacji go łamie. W projekcie referencyjnym komponent przeglądu obciążenia zespołu wszedł do biblioteki z własnym modelem `ITeamMember` i mapperem po stronie feature'a — i przetrwał; nawigator dat wyekstrahowany przedwcześnie wrócił do feature'a, gdy wymagania konsumentów się rozjechały. Cofnięcie było tanie, bo granice były jawne.

**Przykład**

```tsx
// ŹLE — „współdzielony" komponent przyspawany do aplikacji
import { TApiScheduleEntry } from '@app/data-access-schedule'; // typ z warstwy danych
import { useMemberFilter } from '@app/feature-team';            // kontekst feature'a
import { t } from '@app/i18n';                                  // zasoby aplikacji

export function TeamCapacity({ entries }: { entries: TApiScheduleEntry[] }) {
  const { isEnabled } = useMemberFilter();
  return <Header title={t('TEAM.CAPACITY')} /> /* ... */;
}
```

```tsx
// DOBRZE — własny model UI + wszystko przez propsy; mapper i adapter w feature
// biblioteka:
export interface ICapacityMember { id: string; label: string; hours: number; }
export function TeamCapacity(props: {
  members: ICapacityMember[];
  title: string;
  isMemberEnabled: (id: string) => boolean;
  onToggleMember: (id: string) => void;
  loading?: boolean;
}) { /* ... */ }

// feature (adapter — kontekst zostaje tutaj):
const members = mapScheduleToCapacityMembers(schedule); // API → model UI
const { isEnabled, toggle } = useMemberFilter();
<TeamCapacity members={members} title={t('TEAM.CAPACITY')}
              isMemberEnabled={isEnabled} onToggleMember={toggle} />
```

**Wyjątki**
Generalizacja nie jest dogmatem: pierwszy adres deduplikacji to katalog wspólny **wewnątrz** feature'a; biblioteka współdzielona dopiero przy realnym konsumencie z innego feature'a (próg N≥2, COMP-3).

---

## COMP-7. Gałęzie danych zamiast gałęzi widoku; płaska kaskada stanów

**Reguła**
Gdy wszystkie gałęzie warunku renderują tę samą strukturę, przenieś warunek na wyliczenie **wartości** i renderuj strukturę raz. Stany komponentu obsługuj płaską kaskadą early-returnów, nie zagnieżdżonymi warunkami.

**Dlaczego**
Powielona struktura w gałęziach to N miejsc na rozjazd (klasa zmieniona w jednej gałęzi, test-id w drugiej) i nieczytelny diff. W projekcie referencyjnym komponent pola informacyjnego miał trzy early-returny z **identycznym** szkieletem różniącym się jedną wartością — zwinięto je do jednej zmiennej `displayValue` i pojedynczego renderu.

**Przykład**

```tsx
// ŹLE — trzy kopie tej samej struktury
function FieldValue({ value, unit }: { value?: number; unit?: string }) {
  if (value === undefined) {
    return <Text variant="body" testId={ids.value}>—</Text>;
  }
  if (unit) {
    return <Text variant="body" testId={ids.value}>{`${value} ${unit}`}</Text>;
  }
  return <Text variant="body" testId={ids.value}>{String(value)}</Text>;
}
```

```tsx
// DOBRZE — gałęzie wyliczają wartość, struktura renderowana raz
function FieldValue({ value, unit }: { value?: number; unit?: string }) {
  const displayValue =
    value === undefined ? '—' :
    unit ? `${value} ${unit}` :
    String(value);

  return <Text variant="body" testId={ids.value}>{displayValue}</Text>;
}
```

Kaskada stanów — płasko, w stałej kolejności (pełna macierz: ./errors.md):

```tsx
if (isLoading) return <SectionSkeleton />;
if (isError)   return <SectionError onRetry={refetch} />;
if (items.length === 0) return <NoData message={t('TASKS.EMPTY')} />;
return <TaskList items={items} />;
```

**Wyjątki**
Gdy gałęzie różnią się strukturą realnie (inny układ, inne komponenty), warunek na widoku jest właściwy — reguła dotyczy gałęzi *pozornie* różnych.

---

## COMP-8. Mutacje poza komponentami prezentacyjnymi; semantyczne akcje zamiast setterów

**Reguła**
Komponent prezentacyjny nie wywołuje mutacji i nie zna API. Mutacje i derywacje żyją w dedykowanych hookach/serwisach akcji z jawnie otypowanym, niemutowalnym interfejsem zwrotnym. Na zewnątrz wystawiaj **semantyczne akcje** (`approveInvoice`, `openTooltip`), nigdy surowe settery stanu (`setStatus`, `setTooltipOpen`).

**Dlaczego**
Mutacja w komponencie prezentacyjnym uniemożliwia jego reużycie i testowanie w izolacji oraz rozmywa odpowiedzialność za feedback i inwalidację cache'u (./data-and-state.md, ./errors.md). Surowy setter to przeniesienie decyzji na każdego konsumenta — semantyczna akcja trzyma niezmienniki w jednym miejscu. W projekcie referencyjnym z 271-liniowej karty harmonogramu wyjęto 4 mutacje do hooka akcji; osobno `setTooltipOpen` zastąpiono parą `handleTooltipOpen`/`handleTooltipClose`.

**Przykład**

```tsx
// ŹLE — karta renderuje I mutuje I eksponuje setter
function InvoiceCard({ invoice }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const approve = useApproveInvoiceMutation();
  const send = useSendInvoiceMutation();

  return (
    <Card>
      <InvoiceSummary invoice={invoice} />
      <Button onClick={() => approve.mutate(invoice.id)}>{t('INVOICE.APPROVE')}</Button>
      <Menu open={menuOpen} setOpen={setMenuOpen} /> {/* surowy setter w API */}
    </Card>
  );
}
```

```ts
// DOBRZE — hook akcji z jawnym, niemutowalnym kontraktem
interface IUseInvoiceActionsReturn {
  readonly approve: () => Promise<void>;
  readonly send: () => Promise<void>;
  readonly isBusy: boolean; // blokuje WSZYSTKIE akcje na zasobie podczas mutacji
}
export function useInvoiceActions(invoiceId: string): IUseInvoiceActionsReturn { /* mutacje, feedback, inwalidacja */ }
```

```tsx
// komponent prezentacyjny — czysty: dane i callbacki z zewnątrz
function InvoiceCard(props: {
  invoice: IInvoice;
  onApprove: () => void;
  onSend: () => void;
  actionsDisabled: boolean;
}) { /* sam render */ }

// spięcie piętro wyżej
const actions = useInvoiceActions(invoice.id);
<InvoiceCard invoice={invoice} onApprove={actions.approve}
             onSend={actions.send} actionsDisabled={actions.isBusy} />
```

**Wyjątki**
Trywialny lokalny stan UI (toggle rozwinięcia, hover) zostaje w komponencie — wynoszenie go do hooka to ceremonia bez zysku. Granica: stan dotyka serwera lub więcej niż jednego komponentu → wynieś.

---

## COMP-9. Stabilizuj tożsamość wartości przekraczających granicę komponentu; nie memoizuj rytualnie

**Reguła**
Memoizuj dwie rzeczy: referencje (obiekty, tablice, funkcje) przekazywane w dół jako propsy/wejścia oraz realnie kosztowne obliczenia. Każda derywacja deklaruje komplet swoich wejść — egzekwowane lintem jako error. Czyste helpery definiuj poza komponentem, bez żadnej memoizacji.

**Dlaczego**
Niestabilna referencja w propsach unieważnia optymalizacje dziecka i potrafi zapętlić efekty zależne od wejść. Ale memoizacja „wszystkiego na wszelki wypadek" to szum zaciemniający te miejsca, gdzie tożsamość faktycznie ma znaczenie. W projekcie referencyjnym znaleziono memoizowaną derywację **zwracającą funkcję** czystego helpera formatującego inicjały — usunięto ją, helper wyjechał poza komponent jako zwykła funkcja modułowa.

**Przykład**

```tsx
// ŹLE — rytualna memoizacja czystego helpera...
function MemberAvatar({ member }: { member: IMember }) {
  const getInitials = memo(
    () => (name: string) => name.split(' ').map((p) => p[0]).join(''),
    [],
  ); // memoizacja zwracająca funkcję — czysty szum
  return <Avatar label={getInitials(member.name)} />;
}

// ...i jednocześnie NIEstabilna referencja tam, gdzie boli:
function TaskBoard({ tasks }) {
  return <TaskFilterBar
    options={tasks.map(toFilterOption)}        // nowa tablica co render
    onChange={(f) => applyFilter(f)}           // nowa funkcja co render
  />;
}
```

```tsx
// DOBRZE — czysty helper poza komponentem; stabilizacja tylko na granicy
const getInitials = (name: string): string =>
  name.split(' ').map((p) => p[0]).join('');

function MemberAvatar({ member }: { member: IMember }) {
  return <Avatar label={getInitials(member.name)} />;
}

function TaskBoard({ tasks }) {
  const options = memo(() => tasks.map(toFilterOption), [tasks]); // przekracza granicę
  const handleFilterChange = stableCallback((f: TFilter) => applyFilter(f));
  return <TaskFilterBar options={options} onChange={handleFilterChange} />;
}
```

**Wyjątki**
Frameworki z reaktywnością drobnoziarnistą lub kompilatorem optymalizującym (mapowanie: ./angular.md) zmieniają mechanikę, ale nie zasadę: jawne, kompletne wejścia derywacji i czysta logika poza komponentem obowiązują wszędzie.

---

## COMP-10. Parametry routingu czytaj raz, na szczycie feature'a

**Reguła**
Parametry URL (id zasobu, segmenty ścieżki) czytaj wyłącznie na granicy feature'a (root strony) i przekazuj w głąb jako zwykłe, zwalidowane propsy. Komponenty poniżej roota nie znają URL-i ani routera. Wybór layoutu i guardy dostępu to odpowiedzialność warstwy routingu, nie komponentów ekranu.

**Dlaczego**
Komponent czytający URL w głębi drzewa jest nierenderowalny poza konkretną trasą — nie do reużycia, nie do pokazania w katalogu komponentów, nie do testu bez stawiania routera. W projekcie referencyjnym pełna ścieżka trasy była zahardcodowana w ponad trzech sekcjach tego samego widoku; po refaktorze parametr czytany jest raz w roocie i płynie w dół jako props `projectId`. Stan widoku (filtry, wybrany zakres) w URL to osobny temat: ./data-and-state.md.

**Przykład**

```tsx
// ŹLE — głęboka sekcja sama sięga do routera
function TaskSection() {
  const { projectId } = useRouteParams('/projects/$projectId/details'); // ścieżka-literał w głębi
  const tasks = useProjectTasksQuery(projectId);
  /* ... */
}
// ta sama ścieżka powtórzona w member-section.tsx, invoice-section.tsx...
```

```tsx
// DOBRZE — odczyt raz, walidacja na granicy, dalej zwykłe propsy
function ProjectDetailsRoute() {
  const { projectId } = useRouteParams(); // jedyne miejsce kontaktu z routerem
  return <ProjectDetailsPage projectId={projectId} />;
}

function TaskSection({ projectId }: { projectId: string }) {
  const tasks = useProjectTasksQuery(projectId);
  /* ... */
}
```

**Wyjątki**
Globalna nawigacja (menu, breadcrumby) z natury zna trasy — ale konsumuje je przez typowane fabryki ścieżek, nie literały (./architecture.md). Komponent biblioteki współdzielonej nie zna tras nigdy (COMP-6).

---

## Powiązania

- Granice warstw i to, skąd komponent może importować: ./architecture.md
- Stan serwera, inwalidacja po mutacji, stan widoku w URL: ./data-and-state.md
- Macierz 4 stanów i feedback mutacji: ./errors.md
- Style nazwane i współlokowane przy komponencie: ./styling.md
- Testowalność jako pochodna podziału (czyste funkcje, test-idy): ./testing.md
- Rozkład god-componentów krok po kroku: ./refactoring.md, przykłady przed/po: ./antipatterns.md
- Idiomy docelowego frameworka dla każdej z reguł: ./angular.md
