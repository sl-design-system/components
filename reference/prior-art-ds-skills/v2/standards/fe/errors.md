# Obsługa błędów i feedback

Zasada nadrzędna działu: **happy path to mniej niż połowa pracy**. Kod, który renderuje dane, ale nie ma zaprojektowanych stanów ładowania, błędu i pustki — oraz mutacja, która nie mówi użytkownikowi, czy się powiodła — są **niekompletne**, nie „prawie gotowe". To dwa empirycznie najczęściej pomijane elementy w kodzie pierwszego rzutu, także w kodzie generowanym przez AI.

Powiązane pliki zestawu: ./components.md (podział odpowiedzialności — kto renderuje który stan), ./data-and-state.md (inwalidacja po mutacji, blokada double-submit), ./forms.md (mapowanie błędów walidacji serwera na pola), ./testing.md (pokrycie macierzy stanów w testach), ./conventions-and-tooling.md (automatyzacja egzekwowania), ./angular.md (idiomy frameworka).

---

## ERR-1. Macierz 4 stanów: loading / error / empty / success

**Reguła.** Każdy komponent prezentujący dane z serwera obsługuje jawnie cztery stany: ładowanie, błąd, brak danych, sukces. Brak któregokolwiek = komponent niekompletny; macierz 4 stanów jest warunkiem ukończenia zadania (definition of done), nie usprawnieniem na później.

**Dlaczego.** Stany inne niż sukces nie są widoczne podczas dewelopmentu na szczęśliwej ścieżce, więc bez twardej reguły po prostu nie powstają — albo giną przy refactorze (szczegóły mechaniki: ./refactoring.md — inwentaryzacja stanów przed kasacją). Każdy ze stanów ma też własne wymagania jakościowe: loading dobrany do skali elementu (przycisk → spinner, sekcja/widok → skeleton zgodny z designem — źródłem prawdy jest design, nie nawyk programisty); empty to **projektowany** stan z wyjaśnieniem i wskazaniem następnego kroku, nie surowy tekst „Brak danych"; error pokazuje zrozumiały komunikat i akcję ponowienia, gdy operacja jest bezpiecznie powtarzalna.

**Przykład.** Szkielet sekcji z early-returnami (pseudokod komponentu, neutralny dla frameworka):

```tsx
// ŹLE — istnieje tylko happy path; błąd = pusty ekran, ładowanie = mignięcie pustki
const InvoiceListSection = () => {
  const { data } = useInvoicesQuery();
  return <InvoiceList invoices={data ?? []} />;
};

// DOBRZE — płaska kaskada czterech stanów, kolejność: loading → error → empty → success
const InvoiceListSection = () => {
  const { data, isLoading, error, refetch } = useInvoicesQuery();

  if (isLoading) {
    return <InvoiceListSkeleton data-testid={INVOICE_TEST_IDS.list.loading} />;
  }

  if (error) {
    return (
      <ErrorState
        data-testid={INVOICE_TEST_IDS.list.error}
        title={t('INVOICES.LIST.ERROR_TITLE')}
        onRetry={refetch}
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        data-testid={INVOICE_TEST_IDS.list.empty}
        title={t('INVOICES.LIST.EMPTY_TITLE')}
        description={t('INVOICES.LIST.EMPTY_HINT')} // co zrobić, by dane się pojawiły
        action={<CreateInvoiceButton />}
      />
    );
  }

  return <InvoiceList invoices={data} />;
};
```

Early-returny zamiast zagnieżdżonych warunków: brakująca gałąź jest wtedy widoczna na pierwszy rzut oka. Alternatywnie współdzielony komponent-bramka (`<QueryGate loading error empty>…`) czyni pominięcie gałęzi niemożliwym składniowo — w projekcie referencyjnym taki gate wprowadzono dopiero **po** regresji, w której refactor zgubił cały error-state widoku; naprawa kosztowała kilkaset linii i osobne wydanie.

**Wyjątki.** Komponenty czysto prezentacyjne (dostają dane propsami) nie obsługują stanów — robi to ich właściciel-sekcja (./components.md). Stan empty nie dotyczy zasobów, które z definicji istnieją (detal pobrany po ID — tam brak danych to błąd not-found, patrz ERR-3). Dane podrzędne osadzone w już wyrenderowanym widoku mogą mieć stany w skali mikro (inline spinner, placeholder), ale nadal wszystkie cztery.

---

## ERR-2. Każda mutacja daje jawny feedback sukcesu i błędu

**Reguła.** Każda operacja zapisu (utworzenie, edycja, usunięcie, zmiana statusu) kończy się jawnym sygnałem dla użytkownika: potwierdzeniem sukcesu i — obowiązkowo — komunikatem błędu z informacją, co poszło nie tak. Feedback jest **warunkiem blokującym merge**, nie nice-to-have.

**Dlaczego.** To najczęściej pomijany wzorzec w całym zbiorze reguł — pomijany konsekwentnie, bo na ścieżce deweloperskiej mutacje „po prostu działają". Użytkownik bez potwierdzenia klika ponownie (duplikaty zapisu), a bez komunikatu błędu jest przekonany, że zapis się udał — to korupcja danych z perspektywy biznesu. Feedback idzie w pakiecie z resztą protokołu mutacji: kaskadą inwalidacji danych pochodnych i blokadą double-submit (./data-and-state.md) oraz mapowaniem błędów walidacji na pola formularza (./forms.md).

**Przykład.**

```ts
// ŹLE — sukces niczym się nie objawia, błąd znika w pustym catch
const onSubmit = async (values: TTaskFormValues) => {
  try {
    await assignTaskMutation.mutateAsync(values);
  } catch {
    // "obsłużone"
  }
};

// DOBRZE — para komunikatów per mutacja, klucze i18n w konwencji .SUCCESS / .ERROR
const onSubmit = async (values: TTaskFormValues) => {
  try {
    await assignTaskMutation.mutateAsync(values);
    notify.success(t('TASKS.ASSIGN.SUCCESS'));
  } catch (error) {
    if (isHttp422ValidationError(error)) {
      applyFieldErrors(error, TASK_ASSIGN_FIELD_MAP, form); // szczegóły: ./forms.md
      return;
    }
    notify.error(t('TASKS.ASSIGN.ERROR'));
    logger.error(error);
  }
};
```

Konwencja par kluczy `.SUCCESS`/`.ERROR` dla każdej mutacji sprawia, że brakujący feedback widać już w pliku tłumaczeń (./conventions-and-tooling.md).

**Wyjątki.** Mutacje w pełni odzwierciedlone natychmiastową, oczywistą zmianą UI (np. przełącznik z aktualizacją optymistyczną) mogą sygnalizować wyłącznie błąd — sukces jest widoczny sam z siebie. Ścieżka błędu nie ma wyjątków nigdy.

---

## ERR-3. Błędy transportowe konwertuj na domenowe klasy na granicy danych

**Reguła.** Warstwa danych tłumaczy błędy transportowe (status HTTP + kształt odpowiedzi) na własne klasy błędów domenowych — zawsze z ustawionym `name` i parametryzowalnym `message`. UI dispatchuje po **typie** wyjątku (type-guard / `instanceof`), nigdy po kodzie HTTP. Nazwa type-guarda koduje pełny warunek, który sprawdza. Brak wymaganego argumentu (np. ID zasobu) to rzut wyjątku, nie ciche zwrócenie `undefined`.

**Dlaczego.** Kod HTTP to szczegół protokołu, który nie powinien wyciekać ponad granicę danych — ten sam status bywa różnymi błędami domenowymi, a backend miewa swoje pomysły. Klasa bez `name` loguje się jako anonimowy `Error` i jest nieodróżnialna w monitoringu (ERR-8). Type-guard sprawdzający tylko status (bez kształtu payloadu) przepuszcza odpowiedzi, których dalszy kod nie umie skonsumować; guard o nazwie nieoddającej warunku (`isValidationErrorResponse` sprawdzający status 422) wprowadza w błąd przy czytaniu call-site'ów. W projekcie referencyjnym klasa not-found bez ustawionego `name` i z mylącym, zahardkodowanym komunikatem przetrwała wiele miesięcy, fałszując logi — naprawiona dopiero przy dużym refactorze warstwy danych.

**Przykład.** Klasa błędu domenowego + type-guard:

```ts
// errors.ts — granica warstwy danych
export class ResourceNotFoundError extends Error {
  public constructor(message = 'Resource not found') {
    super(message);
    this.name = 'ResourceNotFoundError'; // bez tego logi widzą anonimowy "Error"
  }
}

export class ConcurrentEditError extends Error {
  public constructor(public readonly resourceId: string) {
    super(`Resource ${resourceId} was modified by another user`);
    this.name = 'ConcurrentEditError';
  }
}

// Type-guard: nazwa koduje PEŁNY warunek (status + kształt), nie tylko intencję
interface IServerFieldError {
  readonly path: readonly string[];
  readonly message: string;
}

const isServerFieldError = (item: unknown): item is IServerFieldError =>
  item !== null &&
  typeof item === 'object' &&
  'path' in item &&
  Array.isArray(item.path) &&
  'message' in item &&
  typeof item.message === 'string';

export const isHttp422ValidationError = (
  error: unknown
): error is { readonly response: { readonly status: 422; readonly data: readonly IServerFieldError[] } } => {
  if (
    error === null ||
    typeof error !== 'object' ||
    !('response' in error) ||
    typeof error.response !== 'object' ||
    error.response === null ||
    !('status' in error.response) ||
    error.response.status !== 422 ||
    !('data' in error.response) ||
    !Array.isArray(error.response.data)
  ) {
    return false;
  }
  return error.response.data.every(isServerFieldError);
};
```

Konsumpcja w UI — po typie, nie po kodzie:

```ts
// ŹLE — kod HTTP wyciekł do komponentu
if (error.response?.status === 404) { showMissingProject(); }

// DOBRZE — dispatch po typie wyjątku
if (error instanceof ResourceNotFoundError) { showMissingProject(); }
if (isHttp422ValidationError(error)) { applyFieldErrors(error, fieldMap, form); }
```

**Wyjątki.** Generyczny interceptor transportu (np. globalna obsługa 401 → wylogowanie) z natury operuje na kodach — to jedyna warstwa, której wolno. Nie twórz klasy per endpoint; klasy odpowiadają **kategoriom domenowym** (not-found, konflikt, walidacja, brak uprawnień), a kontekst niesie message/pola.

---

## ERR-4. Cicha odmowa to najgorszy UX

**Reguła.** Jeżeli system nie wykonuje akcji użytkownika — z powodu walidacji, uprawnień, stanu zasobu czy błędu — musi powiedzieć, że nie wykonał i dlaczego. Zakazane: zignorowanie kliknięcia, zamknięcie modala bez zapisu, „udany" wygląd po nieudanym zapisie.

**Dlaczego.** Cicha odmowa jest gorsza niż brzydki komunikat błędu, bo użytkownik buduje fałszywy model świata: jest przekonany, że zmiana zaszła, i podejmuje na tej podstawie decyzje. Zgłoszenia takich bugów są też najdroższe w diagnozie („czasem nie działa", brak śladu w logach). W projekcie referencyjnym klasyczne zgłoszenie z tej kategorii brzmiało: „zmiana terminu zadania na wcześniejszy — system nie zmienia wartości i nie pokazuje żadnego błędu"; przyczyną była walidacja serwera, której wynik front połykał.

**Przykład.** Mini-studium: formularz edycji harmonogramu zespołu odrzucał datę spoza dozwolonego zakresu — serwer zwracał błąd walidacji, generyczny handler pokazywał… nic, bo szczegóły odpowiedzi nie pasowały do jego oczekiwań. Naprawa: handler z whitelistą mapowanych pól, a **wszystko nieprzemapowane** zbierane i wyświetlane jako komunikat ogólny — nigdy gubione (./forms.md — macierz pól). Reguła operacyjna: każda gałąź `catch`/`else`, która nie kończy się komunikatem, logiem ani rethrow, jest podejrzana w review.

**Wyjątki.** Akcje idempotentne, których ponowienie jest niewidoczne i nieszkodliwe (drugie kliknięcie „zapisz" w trakcie blokady double-submit), mogą być ciche — ale wtedy element ma widoczny stan zablokowania (spinner, disabled), więc odmowa nie jest cicha, tylko zakomunikowana stanem.

---

## ERR-5. Rozróżniaj błąd pierwszego ładowania od błędu odświeżenia

**Reguła.** Błąd przy pustym widoku (brak wcześniej pobranych danych) → pełny error-state z akcją ponowienia. Błąd odświeżenia, gdy dane już są na ekranie → zachowaj dane i zasygnalizuj problem dyskretnie (toast / dyskretny pasek „dane mogą być nieaktualne"), nie zastępuj działającego widoku ekranem błędu.

**Dlaczego.** Te dwa przypadki mają różny koszt dla użytkownika: przy pierwszym ładowaniu nie ma nic do stracenia; przy odświeżeniu zburzenie widoku (utrata scrolla, zaznaczenia, rozwiniętych wierszy) z powodu chwilowego błędu sieci jest karą nieproporcjonalną do problemu. Naiwne `if (error) return <ErrorState/>` traktuje oba przypadki identycznie.

**Przykład.**

```tsx
// ŹLE — chwilowy błąd refetchu kasuje widoczną listę klientów
if (error) return <ErrorState onRetry={refetch} />;

// DOBRZE — decyzja zależy od tego, czy mamy już co pokazać
const hasData = clients !== undefined && clients.length > 0;

if (error && !hasData) {
  return <ErrorState data-testid={CLIENT_TEST_IDS.list.error} onRetry={refetch} />;
}

return (
  <>
    {error && <StaleDataNotice onRetry={refetch} />} {/* dane zostają, sygnał dyskretny */}
    <ClientList clients={clients ?? []} />
  </>
);
```

W projekcie referencyjnym współdzielony komponent listy sprawdzał w tym celu, czy tabela ma już wiersze — dopiero pusty grid + błąd dawał pełny error-state.

**Wyjątki.** Jeżeli pokazywane dane mogłyby być groźnie mylące jako nieaktualne (np. saldo, status płatności faktury przed akcją finansową), błąd odświeżenia może zasadnie eskalować do pełnej blokady widoku — decyzja domenowa, podjęta świadomie.

---

## ERR-6. API gubiące błędy wykrywaj regułą statyczną o severity error

**Reguła.** Jeżeli używane API ma wariant, który gubi błędy (zwraca odrzucony promise wymagający `catch`, callback błędu opcjonalny itp.), preferuj wariant bezpieczny; tam gdzie wariant niebezpieczny jest potrzebny, wymuś obsługę błędu regułą statyczną (lint) z prawdziwą analizą zakresu (bez false positives) i ustaw ją na **error**, nie warning.

**Dlaczego.** Konwencja niewymuszana maszynowo umiera, a warning nie blokuje CI — warningi erodują do szumu, który wszyscy ignorują (./conventions-and-tooling.md — iterowanie precyzji reguł). Niezłapany rejected promise to dokładnie cicha odmowa z ERR-4, tylko wprowadzana systemowo: każda nowa mutacja pisana „na szybko" gubi błąd domyślnie. W projekcie referencyjnym napisano w tym celu dedykowaną regułę (~90 linii, analiza zakresu, komunikaty z instrukcją naprawy — komunikat reguły mówi *co zrobić*, nie tylko co jest źle); lekcja negatywna: pozostawiono ją na severity warning i wykrywane przypadki dalej trafiały do main.

**Przykład.**

```ts
// ŹLE — wariant promise bez catch: błąd zapisu projektu znika jako unhandled rejection
const handleArchive = () => {
  archiveProjectMutation.mutateAsync(projectId);
};

// DOBRZE (a) — wariant API z wbudowanymi callbackami, błąd niemożliwy do zgubienia
archiveProjectMutation.mutate(projectId, {
  onSuccess: () => notify.success(t('PROJECTS.ARCHIVE.SUCCESS')),
  onError: () => notify.error(t('PROJECTS.ARCHIVE.ERROR')),
});

// DOBRZE (b) — wariant promise dozwolony tylko z obsługą, egzekwowane lintem na "error"
try {
  await archiveProjectMutation.mutateAsync(projectId);
  notify.success(t('PROJECTS.ARCHIVE.SUCCESS'));
} catch (error) {
  notify.error(t('PROJECTS.ARCHIVE.ERROR'));
  logger.error(error);
}
```

**Wyjątki.** Zanim zainwestujesz w pełną regułę z analizą zakresu, tani zakaz składniowy bywa wystarczający — ale gdy zacznie generować fałszywe alarmy, popraw precyzję albo usuń: reguła z false positives uczy zespół ignorować cały linter. Severity warning jest dopuszczalne wyłącznie przejściowo, na czas spłaty istniejących naruszeń, z datą eskalacji do error.

---

## ERR-7. Stany błędów też dostają test-idy

**Reguła.** Każdy stan błędu (error-state widoku, pasek nieaktualnych danych, komunikat błędu mutacji) ma identyfikator testowy z tej samej, centralnej struktury test-idów co reszta feature'u — od pierwszej implementacji, nie po pierwszej regresji.

**Dlaczego.** Stan bez selektora jest praktycznie nietestowalny, więc nie powstaje dla niego test, więc jego zniknięcie przy refactorze nie łamie niczego — błędy giną „legalnie". To domyka ERR-1: macierz 4 stanów musi być wyrażalna w testach, a mocki muszą umieć te stany wyprodukować (fabryki stanów brzegowych — ./testing.md). W projekcie referencyjnym test-idy error-state'ów dodano dopiero **po** regresji, w której refactor skasował obsługę błędów całego widoku niezauważenie — gdyby istniał test zaczepiony o selektor błędu, regresja nie przeszłaby przez CI.

**Przykład.**

```ts
// test-idy feature'u: stany błędów są pełnoprawnymi wpisami obok happy path
export const SCHEDULE_TEST_IDS = createFeatureTestIds('schedule', {
  grid: ['root', 'loading', 'empty', 'error', 'errorRetryButton', 'staleDataNotice'],
  saveDialog: ['root', 'submitButton', 'submitError'],
});
```

Test integracyjny scenariusza błędu staje się jednolinijkowy: zasymuluj odpowiedź 500 fabryką mocka, oczekuj `SCHEDULE_TEST_IDS.grid.error`, kliknij `errorRetryButton`, oczekuj danych.

**Wyjątki.** Brak. Jeśli stan błędu wydaje się „zbyt mały" na test-id, zwykle znaczy to, że nie został zaprojektowany (ERR-1).

---

## ERR-8. Logger produkcyjny: transporty, batching, sanityzacja PII, sourcemapy

**Reguła.** Aplikacja produkcyjna ma dedykowany logger z architekturą transportów (konsola na dev, zdalny kolektor na prod), batchowaniem wysyłki, sanityzacją danych wrażliwych **przed** opuszczeniem przeglądarki oraz zaplanowaną od początku możliwością dekodowania zminifikowanych stack-trace'ów przez sourcemapy. `console.log`/`console.error` w kodzie produkcyjnym (zwłaszcza w handlerach błędów) jest zakazane lintem.

**Dlaczego.** Błąd, którego nikt nie widzi po stronie zespołu, to ERR-4 w wersji dla developerów: użytkownik dostał komunikat, ale nikt nie naprawi przyczyny. `console.*` na produkcji to logi donikąd plus realne ryzyko wycieku danych do konsoli użytkownika; bez sanityzacji do kolektora płyną tokeny, e-maile i dane osobowe z payloadów (obowiązek prawny, nie estetyka — patrz też ./conventions-and-tooling.md, sekcja bezpieczeństwa); bez sourcemap stack-trace z produkcji (`t.js:1:48211`) jest bezużyteczny — a decyzję, jak bezpiecznie udostępnić sourcemapy zespołowi bez publikowania ich światu, trzeba podjąć przed pierwszym incydentem, nie w jego trakcie. W projekcie referencyjnym debugowe `console.log` przeciekały do handlerów błędów nawet w commitach porządkujących — dopóki nie zablokowano ich regułą lintera; do dekodowania stacków utrzymywano osobne wewnętrzne narzędzie.

**Przykład.** Kontrakt loggera (interfejs, nie implementacja):

```ts
interface ILogger {
  error(error: unknown, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
}

// transporty wymienne per środowisko; batching i sanityzacja w transporcie zdalnym
const logger = createLogger({
  transports: isProduction
    ? [createRemoteTransport({ batchSize: 20, flushIntervalMs: 5000, sanitize: stripPii })]
    : [createConsoleTransport()],
});

// ŹLE — w handlerze produkcyjnym
catch (error) {
  console.log('[error]', error); // donikąd + potencjalny wyciek payloadu
}

// DOBRZE — domenowy błąd (ERR-3) ma name, więc jest grupowalny w kolektorze
catch (error) {
  notify.error(t('CLIENTS.UPDATE.ERROR'));
  logger.error(error, { clientId }); // ID tak, dane osobowe klienta — nie
}
```

`stripPii` działa whitelistą pól kontekstu (identyfikatory tak, treści i dane osobowe nie) — whitelisty nie starzeją się tak niebezpiecznie jak blacklisty.

**Wyjątki.** Narzędzia developerskie i skrypty budowania mogą używać `console.*`. Mały projekt może zacząć od gotowej usługi monitoringu zamiast własnego loggera — ale wymagania (sanityzacja, sourcemapy, grupowanie po `name` błędu) pozostają te same i należy je świadomie skonfigurować, nie założyć, że „usługa załatwia".
