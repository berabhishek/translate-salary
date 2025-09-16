# Copilot Instructions for AI Agents

## Refactoring Guidelines for Agents

When refactoring code, always follow these principles:

- **DRY (Don't Repeat Yourself):** Extract repeated logic into functions or helpers.
- **SRP (Single Responsibility Principle):** Each function/module should do one thing well.
- **Clear Naming:** Use descriptive, intent-revealing names for functions, variables, and files.
- **Robust Error Handling:** Validate all inputs, handle edge cases, and provide clear error messages.
- **Separation of Concerns:** Keep parsing, validation, business logic, and I/O (e.g., DB, API) in separate functions.
- **No Breaking Changes:** Refactor without changing the external behavior unless explicitly requested.
- **Comment Complex Logic:** Add comments for non-obvious code or business rules.

All agents and LLMs must apply these rules when asked to refactor, unless the user specifies otherwise.

# Copilot Instructions for AI Agents

## Project Overview
- **Purpose:** Compare salaries across countries/currencies with live formatting and fast country/currency selection.
- **Stack:** React 18, Redux Toolkit, Vite. Modern, minimal UI.
- **Structure:**
  - `src/components/`: Reusable UI (e.g., `SearchableSelect.jsx`, `IdealTargetCard.jsx`).
  - `src/pages/`: Route-level views (e.g., `TranslateSalary.jsx`).
  - `src/store/`: Redux slices (`formSlice.js`).
  - `src/utils/`: Formatting helpers (`numberFormat.js`).
  - `src/hooks/`: Custom hooks (`useMonetaryInput.js`).
  - `src/lib/`: Integrations (e.g., `blob.js`).

## Developer Workflows
 **Dev server:** `pnpm run dev` (Vite, port 5173)
 **Build:** `pnpm run build` (outputs to `dist/`)
 **Preview:** `pnpm run preview`
## Coding Conventions
- **Indent:** 2 spaces, single quotes, avoid semicolons (match file style).
- **Naming:**
  - Components: PascalCase (`MyComponent.jsx`)
  - Hooks: `useX.js`
  - Slices: `thingSlice.js`
  - Utilities: lowerCamel (`numberFormat.js`)
- **Modules:** Keep small, single-responsibility. Colocate helpers near usage when practical.

## Integration & Data Flow
- **Country/currency data:** `src/countries.js` (ISO codes, currency, flags)
- **Salary formatting:** `src/utils/numberFormat.js`, `useMonetaryInput.js`
- **State:** Redux slice in `src/store/formSlice.js`
- **UI:** Main logic in `src/App.jsx`, selects in `src/components/SearchableSelect.jsx`

## Security & Configuration
- **Secrets:** Use `.env.local` (gitignored). Example: `BLOB_READ_WRITE_TOKEN=...` for `lib/blob.js`.
- **Do not expose secrets in client builds.**
- **Do not commit `dist/`, editor settings, or local caches.**

## Commit & PRs
- **Commits:** Use Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.)
- **PRs:** Clear description, linked issues, before/after UI screenshots, and testing notes. Keep PRs focused/small.


## Agent-Specific Notes
- **Do not run the dev server (it may already be running).**
- **Do not commit changes unless explicitly asked.**
- **Reference key files when describing patterns.**
- **Document only discoverable, enforced patterns.**
- **Always clean up after yourself: If you create any temporary or helper files for intermediate steps (e.g., SQL scripts, data dumps), delete them when they are no longer needed for the end product. Only leave files that are part of the final deliverable.**

## Examples
- **Formatting:** See `numberFormat.js` and `useMonetaryInput.js` for salary input logic.
- **Searchable selects:** See `SearchableSelect.jsx` for keyboard/search behavior.
- **Redux usage:** See `formSlice.js` for state management.

---
If any section is unclear or missing, please ask for feedback to iterate.
