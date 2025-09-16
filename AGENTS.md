# Repository Guidelines

## Project Structure & Modules
- `src/`: App source (React 18 + Redux Toolkit).
  - `components/`: Reusable UI (e.g., `SearchableSelect.jsx`, `IdealTargetCard.jsx`).
  - `pages/`: Route-level views (e.g., `TranslateSalary.jsx`).
  - `store/`: State (`formSlice.js`, `index.js`).
  - `utils/`: Helpers (`numberFormat.js`).
  - `hooks/`: Custom hooks (`useMonetaryInput.js`).
  - `lib/`: Integrations (`lib/blob.js`).
- `index.html`: Vite entry; `vite.config.js`: build config.
- `dist/`: Production output (generated).

## Build, Test, and Development
- Install: `npm install` (pnpm supported: `pnpm install`).
- Dev: `npm run dev` — start Vite locally.
- Build: `npm run build` — output to `dist/`.
- Preview: `npm run preview` — serve the production build.

## Coding Style & Naming
- Indentation: 2 spaces; single quotes; prefer no semicolons (match file style).
- Components: PascalCase filenames (`MyComponent.jsx`).
- Hooks: `useX.js`; Slices: `thingSlice.js`; Utilities: lowerCamel (`numberFormat.js`).
- Keep modules small, single-responsibility; colocate helpers near usage when practical.

## Testing Guidelines
- Preferred stack: Vitest + React Testing Library + jsdom.
- Location: `src/__tests__/` or co-located `*.test.jsx`.
- Coverage target: ≥ 80% lines/branches for utilities (`utils/`) and hooks.
- Examples:
  - Unit: number formatting (`numberFormat.formatWithCommas`).
  - Component: keyboard/search behavior in `SearchableSelect`.

## Commit & Pull Requests
- Conventional Commits recommended: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `chore:` (see history: `feat:`, `refactor:` used).
- PRs: clear description, linked issues, before/after screenshots for UI, and testing notes. Keep PRs focused and small.

## Security & Configuration
- Secrets: use `.env.local` (gitignored). Example: `BLOB_READ_WRITE_TOKEN=...` for `lib/blob.js`.
- Do not expose tokens in client builds; use read-only or proxy backend when possible.
- Avoid committing `dist/`, editor settings, or local caches.


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

---
## Notes for Agents
- Do not run the dev server (it may already be running).
- Do not commit changes unless explicitly asked.
