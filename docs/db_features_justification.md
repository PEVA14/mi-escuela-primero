# Database Features: Implementation Decisions

## What We Implemented: Views

Four views were added to `backend/db/init.js` using `CREATE OR REPLACE VIEW`, which means they are created automatically alongside the schema and require no manual database intervention.

| View | Purpose |
|---|---|
| `Vista_Escuelas_Completa` | Full school profile with all catalogue labels resolved (municipio, modalidad, turno, sostenimiento) |
| `Vista_Propuestas_Detalle` | Full proposal detail with school, municipality, category, subcategory, status, and unit resolved |
| `Vista_Resumen_Propuestas_Por_Escuela` | Per-school aggregation: total proposals and counts by status |
| `Vista_Donaciones_Recientes` | Donation form responses enriched with school and proposal context, ordered most-recent first |

Views were the right choice for this project because they provide a real, tangible benefit (simplifying complex multi-table joins into reusable named queries) without introducing any behavioral side effects or maintenance risk. They are read-only, declarative, and perfectly aligned with how the application already accesses data.

---

## What We Did Not Implement: Triggers and Stored Procedures

### Decision Summary

Triggers and stored procedures were deliberately **not implemented**. This is not an omission driven by time or complexity — it is a deliberate architectural decision grounded in the specific characteristics of this project's stack and codebase.

---

### Triggers

#### What we could have implemented

The two most natural candidates for triggers in this schema would have been:

1. **Auto-updating a modification timestamp** — A `BEFORE UPDATE` trigger on `Propuesta` or `Escuela` that sets a `fecha_modificacion = NOW()` column automatically whenever a row is updated, ensuring the timestamp is always accurate regardless of what code path performs the update.

2. **Proposal status audit log** — An `AFTER UPDATE` trigger on `Propuesta` that inserts a record into a hypothetical `HistorialEstadoPropuesta` table whenever `id_estadoPropuesta` changes, creating a full audit trail of who changed what and when.

Both are textbook trigger use cases and technically trivial to implement in MySQL.

#### Why we chose not to

**1. The application already owns its own business logic.**
Every state transition in this system — approving a proposal, updating school data, recording a donation — is handled by an explicit route handler in the Node.js backend. Those handlers are the single source of truth for what happens when data changes. Introducing triggers would split that responsibility: some behavior would live in the JavaScript codebase, and some would live invisibly inside the database engine. This "action at a distance" pattern is widely recognized as a source of bugs and confusion because the trigger fires silently — developers reading the application code cannot see it happening.

**2. There are no timestamp or audit columns to maintain.**
The schema, as designed, does not include `fecha_modificacion` or any audit-log table. Adding a trigger to maintain a column that does not exist would require a schema change first, and if we are already making a schema change, the cleaner approach is to set the timestamp in the application layer where it is visible and testable. Creating tables exclusively to give triggers something to write to would introduce infrastructure with no consumer.

**3. Triggers are opaque to the ORM/driver layer.**
This project uses raw `mysql2/promise` queries with no abstraction layer that is trigger-aware. When a developer runs a unit test or seeds the database in a test environment, triggers fire silently and can produce unexpected side effects that are hard to isolate. Since triggers cannot be easily toggled off for testing, they can make test environments behave differently from controlled scenarios, introducing non-determinism.

**4. Debugging is significantly harder.**
When a trigger causes an unexpected behavior — a failed constraint, a locked row, a cascading write — the error surfaces in the application at the point of the original query, not at the trigger. Stack traces do not reference triggers. This makes diagnosing production issues substantially more difficult, particularly for a team that is not yet deeply familiar with MySQL internals.

**5. No concurrent write pressure justifies them.**
The primary scenario where triggers are genuinely valuable is when multiple independent systems write to the same database and you need guaranteed consistency regardless of which system performs the write. In this project, all writes flow through a single Node.js application. There is no external ETL process, no secondary service writing directly to the database, no situation where a trigger's "always fires, no matter what" guarantee provides something the application code cannot already provide.

---

### Stored Procedures

#### What we could have implemented

The most natural candidates given this schema would have been:

1. **`ObtenerPropuestasPorEscuela(p_id_escuela INT)`** — A procedure encapsulating the multi-join query that retrieves all proposals for a school with their full category, status, and unit labels. It would accept the school ID as a parameter and return the enriched result set.

2. **`ResumenDonacionesPorMunicipio()`** — A procedure that aggregates donation form responses by donor municipality, grouping totals and types to produce a statistical summary for the admin panel.

3. **`ActualizarEstadoPropuesta(p_id_propuesta INT, p_nuevo_estado INT)`** — A procedure wrapping the status update in a transaction with a validation check, ensuring the new status ID exists in `EstadoPropuesta` before committing.

All three are coherent, useful, and implementable in an afternoon.

#### Why we chose not to

**1. This project uses no abstraction layer that benefits from procedures.**
Stored procedures provide the most value when multiple applications or services share the same database and need to call the same complex logic without duplicating SQL. In this project, there is exactly one consumer of the database: the Node.js backend. Every query is already centralized in one codebase. There is no duplication problem to solve.

**2. The application layer is already the logic layer.**
The route handlers in `backend/index.js` are where queries are constructed, parameters are validated, and results are transformed. Moving that logic into a stored procedure would mean maintaining two parallel implementations of the same behavior — one in JavaScript (for validation, error formatting, API response shaping) and one in SQL (for the actual data retrieval). This duplication creates a synchronization problem: when business rules change, the developer must remember to update both.

**3. Stored procedures are significantly harder to version and review.**
This project uses Git for version control. JavaScript source files are diffable, reviewable, and lintable. A stored procedure lives inside the database engine — it cannot be linted, it cannot be type-checked, and its history is only visible if it was explicitly stored in a migration script. Since this project does not use a migration framework (it uses a single `init.js` initialization script), stored procedures would either have to be re-created from scratch on every deployment (which is fragile) or managed manually in the database (which defeats version control entirely).

**4. Parameter handling and error propagation are more complex.**
When a stored procedure encounters an error — a constraint violation, a null reference, a type mismatch — the error must be explicitly handled inside the procedure using MySQL's condition handlers, or it surfaces as a generic MySQL error to the calling application. In the Node.js layer, error handling is native, expressive, and already integrated with the HTTP response pipeline. Adding a stored procedure layer would require duplicating error-handling logic in SQL with a more limited toolset.

**5. There is no performance problem to solve.**
Stored procedures can offer a performance advantage by reducing network round-trips and allowing the database engine to cache execution plans. However, this project's queries are not complex enough to benefit from plan caching — they are straightforward joins on properly indexed foreign keys. There is no measured performance problem, and premature optimization through stored procedures would add maintenance complexity without a measurable gain.

**6. Local development and onboarding complexity.**
Any developer joining this project can clone the repository, run `npm install`, and have a fully functional environment. If stored procedures were part of the design, they would need to be loaded into the local MySQL instance separately from the application code — or managed through the `init.js` script, which is not designed as a migration system. This raises the barrier to entry for new contributors and makes the development environment harder to reproduce consistently.

---

### Conclusion

The decision not to implement triggers and stored procedures is not a shortcut — it is the result of evaluating each feature against the actual needs and constraints of this project. Both features solve real problems in database-centric architectures where logic must be enforced at the database level regardless of what application calls it. That is not the situation here.

This project has a single application layer that already enforces all business rules, a raw SQL driver that provides full flexibility without requiring database-side logic, and a development team working in a Git-based workflow where code visibility and testability are paramount. Under these conditions, triggers and stored procedures would add complexity, reduce transparency, and create maintenance burden without providing any benefit that the existing architecture does not already deliver.

The four views that were implemented represent the appropriate use of a database feature in this context: they are purely declarative, produce no side effects, simplify legitimate query complexity, and are fully version-controlled alongside the rest of the schema.
