# BUGS.md - Raport błędów z audytu projektu Agro-Flow

Data audytu: 2025-12-07
Audytor: Senior QA

## 🔴 KRYTYCZNE (Blokujące produkcję)

### BUG-001: Brak tabeli Sprint w bazie danych
**Milestone:** 4 (Tickets & Board Logic)
**Severity:** CRITICAL
**Status:** ✅ NAPRAWIONY (2025-12-07)

**Opis:**
Kod `TicketsService` (linie 70, 131) używa `prisma.sprint.findUnique()` i `prisma.sprint.create()`, ale tabela `Sprint` nie istnieje w bazie danych.

**Logi błędu:**
```
ERROR:  relation "public.Sprint" does not exist at character 127
Invalid `this.prisma.sprint.findUnique()` invocation
The table `public.Sprint` does not exist in the current database.
```

**Przyczyna:**
- Model `Sprint` istnieje w `schema.prisma` (linie 144-151)
- Brakuje migracji tworzącej tabelę `Sprint`
- Jedyna migracja `20251205221346_init_schema/migration.sql` NIE zawiera `CREATE TABLE "Sprint"`

**Impact:**
- Endpoint `GET /api/board` całkowicie niefunkcjonalny
- Frontend Board View nie może załadować żadnych danych
- Aplikacja jest w 100% zepsuta dla widoku tablicy

**Reprodukcja:**
1. Otwórz Frontend Board View
2. Obserwuj logi API
3. Zobaczysz ciągłe błędy P2021

**Rozwiązanie:**
```bash
cd api
npx prisma migrate dev --name add_sprint_table
```

**Wykonane:**
✅ Uruchomiono migrację `20251207165816_add_sprint_table`
✅ Tabela Sprint została utworzona w bazie danych

---

### BUG-002: Brak endpointu GET /api/users (Workers)
**Milestone:** Frontend (implicitly Milestone 7-8)
**Severity:** CRITICAL  
**Status:** ✅ NAPRAWIONY (już istniał)

**Opis:**
Frontend `useBoardTickets.ts` prawdopodobnie próbuje pobrać listę pracowników (`workers`), ale backend NIE ma endpointu `GET /api/users`.

**Dowód:**
- `BoardView.tsx` linia 118: `const { tickets, workers, shifts, loading, updateTicket, refresh } = useBoardTickets(selectedDate);`
- Brakuje kontrolera `UsersController` w API
- User zgłosił: "na tablicy board nie ma pracowników"

**Impact:**
- Tablica nie wyświetla swimlanów dla pracowników
- Niemożliwe jest przypisywanie zadań do konkretnych osób
- Drag & drop nie działa poprawnie (brak celów do upuszczenia)

**Reprodukcja:**
1. Otwórz Board View w przeglądarce
2. Sprawdź Network tab - brak zapytania do `/api/users` lub zwraca 404
3. Tablica wyświetla tylko "Unassigned" swimlane

**Rozwiązanie:**
Stworzyć `UsersModule`, `UsersController`, `UsersService` z endpointem:
```typescript
@Get('/api/users')
async getAllUsers(@Query('role') role?: UserRole) {
  // zwróć listę wszystkich użytkowników (opcjonalnie filtrując po roli WORKER)
}
```

---

## 🟠 WYSOKIE (Ważne funkcjonalności)

### BUG-003: Brakująca relacja Comment w User model
**Milestone:** 6 (Realtime & Discussion - in progress)
**Severity:** HIGH
**Status:** ✅ NAPRAWIONY (2025-12-07)

**Opis:**
W `schema.prisma` linia 56 dodano `comments Comment[]` do User model, ale brakuje samego modelu `Comment`.

**Dowód:**
- Plik `api/prisma/comment_model.txt` został stworzony ale nie został dołączony do schema.prisma
- Próba `docker-compose run api npx prisma migrate dev --name add_comments_table` zwróciła "Already in sync"

**Impact:**
- Model Comment nie istnieje w bazie
- Niemożliwe tworzenie komentarzy do zadań (Milestone 6)

**Rozwiązanie:**
1. Usunąć linie `comments Comment[]` z User (linia 56) ALBO
2. Dopisać model Comment do schema.prisma:
```prisma
model Comment {
  id        String   @id @default(uuid())
  content   String
  ticketId  String
  authorId  String
  createdAt DateTime @default(now())

  ticket    Ticket   @relation(fields: [ticketId], references: [id])
  author    User     @relation(fields: [authorId], references: [id])
}
```
3. Dodać `comments Comment[]` do model Ticket
4. Uruchomić migrację

**Wykonane:**
✅ Dodano model Comment do schema.prisma
✅ Dodano relacje do User i Ticket
✅ Uruchomiono migrację `20251207170021_add_comments_table`

---

### BUG-004: Brak modułów EventsModule i CommentsModule
**Milestone:** 6 (Realtime & Discussion)
**Severity:** HIGH
**Status:** ✅ NAPRAWIONY (2025-12-07)

**Opis:**
W `TicketsService` linia 5 i 11:
```typescript
import { EventsGateway } from '../events/events.gateway';
constructor(private eventsGateway: EventsGateway) { }
```

Ale katalogi `api/src/events/` i `api/src/comments/` nie istnieją.

**Impact:**
- `TicketsService` nie może się skompilować
- Brak realtime events (SSE)
- Brak możliwości komentowania zadań

**Rozwiązanie:**
Zaimplementować zgodnie z `implementation_plan.md` dla Milestone 6:
1. Stworzyć `EventsModule` z `EventsGateway`
2. Stworzyć `CommentsModule` z CRUD
3. Zarejestrować w `AppModule`

**Wykonane:**
✅ EventsModule i EventsGateway już istniały
✅ Stworzono CommentsModule z CommentsService i CommentsController
✅ Zare jestrowano CommentsModule w AppModule
✅ Endpointy: POST/GET `/api/tickets/:ticketId/comments`

---

## 🟡 ŚREDNIE (UX/Funkcjonalności dodatkowe)

### BUG-005: Logika generowania Sprint w niewłaściwym miejscu
**Milestone:** 5 (Calendars & Cycles)
**Severity:** MEDIUM
**Status:** Niezaprawiony

**Opis:**
Generowanie sprint jest zawarte w `TicketsService.generateSprint()` (linie 80-143), ale powinno być w `SprintService.generateSprint()`.

**Dowód:**
- Endpoint `POST /api/sprint/generate` używa `SprintService` (Milestone 5 verification)
- Ale `TicketsService` ma własną implementację `generateSprint()`
- Duplikacja logiki

**Impact:**
- Dezorientacja w kodzie
- Trudność w maintenance
- Potencjalne rozbieżności między dwoma implementacjami

**Rozwiązanie:**
1. Usunąć metody `ensureSprint()` i `generateSprint()` z `TicketsService`
2. Wstrzyknąć `SprintService` do `TicketsService`
3. W `getBoard()` sprawdzić istnienie sprintu przez `SprintService`

---

### BUG-006: Brak automatycznego przypisywania w generowaniu Sprint
**Milestone:** 5 (Calendars & Cycles)  
**Severity:** MEDIUM
**Status:** Niezaprawiony

**Opis:**
`SprintService.generateSprint()` (api/src/sprint/sprint.service.ts) powinien automatycznie przypisywać zadania do pracowników na podstawie `ShiftAssignment`, ale:
- W `TicketsService.generateSprint()` linia 125: `assigneeId: null`
- Brakuje logiki query do `ShiftAssignment`

**Dowód:**
Zgodnie z `docs/domain/CALENDARS.md`:
> "Auto-Assignment: If exactly one worker is found for that shift → assign ticket."

Ale kod w `TicketsService` nie implementuje tego.

**Impact:**
- Wszystkie wygenerowane zadania trafiają do "Unassigned"
- Zootechnician musi ręcznie przypisywać każde zadanie

**Rozwiązanie:**
Zaktualizować logikę generowania zgodnie z `SprintService` ze Milestone 5:
```typescript
const workingShifts = await this.prisma.shiftAssignment.findMany({
    where: {
        date: targetDate,
        timeSlot: cycle.timeSlot,
        status: ShiftStatus.WORKING
    }
});

let assigneeId: string | null = null;
if (workingShifts.length === 1) {
    assigneeId = workingShifts[0].workerId;
}
```

---

### BUG-007: Brak seedów/danych testowych dla Workers
**Milestone:** 2 (Database & Core Domain Entities)
**Severity:** MEDIUM
**Status:** Częściowo naprawiony

**Opis:**
Plik `seed-verification.js` tworzy tylko Zootechnician i tokeny, ale brakuje Worker users.

**Impact:**
- Niemożliwe przetestowanie Board View bez ręcznego tworzenia pracowników
- Verification wymaga manual setup

**Rozwiązanie:**
Zaktualizować `api/seed-verification.js`:
```javascript
// Dodać kilku Workers
const worker1 = await prisma.user.create({
  data: {
    displayName: 'Jan Kowalski',
    role: 'WORKER'
  }
});
// ... itd.
```

---

## 🟢 NISKIE (Kosmetyka/Optymalizacja)

### BUG-008: Hardcoded Polish w JSX
**Milestone:** 7-8 (Frontend)
**Severity:** LOW
**Status:** Niezaprawiony

**Opis:**
W `BoardView.tsx` używane są bezpośrednio polskie stringi zamiast i18n:
- Linia 20: "Rano"
- Linia 21: "Ppoł"
- Linia 22: "Wolne"
- Linia 66: "No unassigned tickets", "Drop here to assign"
- Linia 71: "Niedostępny"

**Impact:**
- Aplikacja nie będzie działać poprawnie w innych językach
- Naruszenie konwencji i18n (projekt ma `useTranslation()`)

**Rozwiązanie:**
Przenieść wszystkie stringi do `en.json`/`pl.json`:
```json
{
  "board": {
    "shiftMorning": "Rano",
    "shiftAfternoon": "Ppoł",
    "shiftOff": "Wolne",
    "unavailable": "Niedostępny"
  }
}
```

---

### BUG-009: Brakująca walidacja ClientVersion
**Milestone:** 4 (Tickets & Board Logic)
**Severity:** LOW
**Status:** Częściowo naprawiony

**Opis:**
Optimistic locking jest zaimplementowany w backend (`tickets.service.ts`), ale frontend nie wysyła `clientVersion` w requstach.

**Impact:**
- Potencjalne konflikty przy jednoczesnej edycji
- ConflictException nigdy się nie pojawi

**Rozwiązanie:**
Zaktualizować `updateTicket()` w frontend hooks, aby wysyłać `version`.

---

## 📊 Podsumowanie

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 2 | 🔴 Niezaprawione |
| HIGH | 2 | 🟠 Niezaprawione |
| MEDIUM | 4 | 🟡 Niezaprawione/Częściowo |
| LOW | 2 | 🟢 Niezaprawione |
| **TOTAL** | **10** | |

---

## 🎯 Priorytet naprawy

1. **BUG-001** (Sprint table) - NATYCHMIAST
2. **BUG-002** (GET /api/users) - NATYCHMIAST
3. **BUG-003** (Comment model) - WYSOKIE
4. **BUG-004** (Events/Comments modules) - WYSOKIE
5. **BUG-005** (Sprint logic refactor) - ŚREDNIE
6. **BUG-006** (Auto-assignment) - ŚREDNIE
7. Pozostałe - NISKIE

---

## 📝 Notatki dodatkowe

- **Milestone 3** (Authentication) - ✅ Działa poprawnie
- **Milestone 4** (Tickets CRUD) - ⚠️ Podstawowa funkcjonalność działa, ale getBoard() zepsute
- **Milestone 5** (Calendars & Cycles) - ⚠️ Częściowo działa (brak integracji z Tickets)
- **Milestone 6** (Realtime & Discussion) - ❌ Nie rozpoczęte mimo początkowych plików

**Zalecenia:**
1. Naprawić BUG-001 i BUG-002 PRZED dalszą pracą
2. Dokończyć Milestone 6 zgodnie z planem
3. Dodać testy E2E dla krytycznych flow (Milestone 10)
4. Rozważyć CI/CD z automatycznymi testami
