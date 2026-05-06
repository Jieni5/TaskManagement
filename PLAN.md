# Plan: Task Management → Film Production Logistics App

## Context
The project is a Linear-clone ("Mode") built with Next.js 15, React 19, TypeScript, Tailwind CSS, Drizzle ORM, and PostgreSQL (Neon). It has working auth and basic issue CRUD, but several bugs, incomplete features, and stub pages. The goal is:
1. **Phase 1**: Make it a complete, fully functional task management app (fix bugs + add core features)
2. **Phase 2**: Rebrand and extend for indie film production logistics

---

## Phase 1: Complete Task Management App — DONE

| # | Feature | Status |
|---|---------|--------|
| 1A | Bug fixes (mock delays, middleware, ownership checks) | ✅ Done |
| 1B | Complete edit issue page | ✅ Done |
| 1C | Due dates on issues | ✅ Done |
| 1D | Search, filter & sort on dashboard | ✅ Done |
| 1E | Stats bar on dashboard | ✅ Done |
| 1G | Assignees (single user) | ✅ Done |
| 1F | Comments | ⏭ Deferred |
| 1H | Labels/Tags | ⏭ Deferred |

---

## Phase 2: Rebrand to Film Production Logistics

**App name: "Slate"** (film clapperboard reference)

### 2A — Schema: Film Production Data Model — ✅ Done
- `projects` table (id, name, description, phase enum, startDate, endDate, ownerId)
- `production_phase` enum: pre_production, production, post_production
- `department` enum: camera, lighting, sound, art, costume, props, location, vfx, production, direction, general
- New columns on `issues`: projectId, department, shootDay

### 2B — Projects Feature — ✅ Done
- Pages: `/projects`, `/projects/new`, `/projects/[id]`, `/projects/[id]/edit`
- `app/actions/projects.ts` — create, update, delete with ownership gating
- `ProjectForm`, `DeleteProjectButton` components
- "Projects" nav link with Clapperboard icon

### 2C — Task Form Film Fields — ✅ Done
- Project selector (pre-selected when navigating from `/issues/new?projectId=X`)
- Department dropdown (11 film departments)
- Shoot Day number input
- Issue detail page shows Project (linked), Department, Shoot Day

### 2D — Crew Management — ⬜ Not started
- New pages: `/projects/[id]/crew`, `/projects/[id]/crew/new`
- New: `app/actions/crew.ts`, `CrewRoster.tsx`, `DepartmentBadge.tsx`

### 2E — Equipment Tracking — ⬜ Not started
- New pages: `/projects/[id]/equipment`, `/projects/[id]/equipment/new`
- New: `app/actions/equipment.ts`, `EquipmentList.tsx`

### 2F — Kanban Board View — ⬜ Not started
- New: `app/dashboard/board/page.tsx` or toggle on existing dashboard
- New: `KanbanBoard.tsx`, `KanbanColumn.tsx`, `KanbanTaskCard.tsx` — Client Components
- Needs `@dnd-kit/core` + `@dnd-kit/sortable`
- Start with static columns, add drag-drop later

### 2G — Call Sheets (Basic) — ⬜ Not started
- HTML print view with `@media print` CSS
- New page: `/projects/[id]/callsheet/page.tsx`
- Filter by shoot day, show scenes + crew + equipment for that day

### 2H — UI Rebrand — ⬜ Not started
- Rename app to "Slate" in `app/layout.tsx` metadata + `Navigation.tsx`
- Swap purple color palette → cinematic amber/gold in `tailwind.config.ts`
- Update color references in `Button.tsx`, `Badge.tsx`
- Update navigation labels: "New Issue" → "New Task"
- Add new Badge variants for departments

### Status Enum Migration — ⚠️ Risky, do LAST
- backlog → prep, todo → ready, in_progress → shooting, done → wrapped
- Postgres can't remove enum values without recreating the type
- Safer fallback: use `text` for status with Zod validation

---

## Implementation Order (Remaining)

```
Next up (recommended order):
  1. 2H — UI rebrand to "Slate"        (~30 min, high visual impact)
  2. 2F — Kanban board (static first)  (~1 hr, most exciting feature)
  3. 2D — Crew management              (additive)
  4. 2E — Equipment tracking           (additive)
  5. 2G — Call sheets                  (additive)
  6. Status enum migration             (risky, do last)

Deferred from Phase 1:
  - Comments (1F)
  - Labels/Tags (1H)
```

---

## Key Technical Notes
- **db:push is broken** on this network (port 5432 TCP blocked). Always run schema changes as raw SQL via `node migrate.mjs` using `@neondatabase/serverless` HTTP.
- **`'use cache'` with filters**: Don't use on DAL functions that take runtime filter params.
- **Ownership gating pattern**: `and(eq(table.id, id), eq(table.ownerId, user.id))` + `rowCount === 0` check.
- **`useSearchParams` in server pages**: Requires `<Suspense>` wrapper around client components.
- **Drizzle two relations to same table**: Requires `relationName` on both sides.
