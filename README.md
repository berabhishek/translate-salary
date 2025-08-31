% Translate Salary

A lightweight, Vite + React app to help compare salaries across countries and currencies. Type an annual salary and the input formats with thousands separators automatically (e.g., 1234567.89 → 1,234,567.89). Pick source and target countries with fast, searchable dropdowns.

## Features
- Live formatting: Adds commas to the salary as you type; preserves decimals and cursor position.
- Searchable selects: Type to filter countries and currency codes.
- Sensible defaults: Currency defaults to the source country’s currency but can be changed.
- Clean UI: Dark-friendly, minimal styling.
- Modern stack: React 18 + Vite for fast dev and prod builds.

## Getting Started
- Prerequisites: Node.js 18+ and npm.
- Install: `npm install`
- Dev server: `npm run dev` (opens on `http://localhost:5173`)
- Production build: `npm run build` (outputs to `dist/`)
- Preview build: `npm run preview`

## Project Structure
- `src/App.jsx`: Main UI and salary formatting logic.
- `src/components/SearchableSelect.jsx`: Reusable searchable dropdown.
- `src/countries.js`: Country list with ISO codes and currencies, plus flag helper.
- `src/styles.css`: App styling.
- `vite.config.js`: Vite configuration.
- `index.html`: App entry.

## Salary Formatting Details
- Accepts digits and at most one decimal point.
- Automatically inserts commas in the integer part as you type.
- Keeps a trailing decimal point while typing (e.g., `12.` stays as-is).
- Maintains caret position so editing feels natural.
- Copy/paste of formatted numbers (with commas) is supported.

## Notes
- Security advisories: `npm audit` may report low-severity transitive advisories from tooling. You can try `npm audit fix`. Using `--force` may upgrade major versions and require code changes.
- Exchange rates: The UI is prepared for currency selection, but does not fetch rates yet. See Future Work below.

## Future Work Ideas
- Integrate exchange rates API and purchasing power parity (PPP) signals.
- Add cost-of-living and taxation adjustments.
- Form validation and helpful error states.
- Keyboard and screen reader refinements for selects.
- Unit tests for formatting and component interactions.

## Contributing
Issues and pull requests are welcome. For local development, use Node 18+, run `npm install`, and `npm run dev`.
