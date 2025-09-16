# Refactoring Guidelines for Agents

When refactoring code, always follow these principles:

- **DRY (Don't Repeat Yourself):** Extract repeated logic into functions or helpers.
- **SRP (Single Responsibility Principle):** Each function/module should do one thing well.
- **Clear Naming:** Use descriptive, intent-revealing names for functions, variables, and files.
- **Robust Error Handling:** Validate all inputs, handle edge cases, and provide clear error messages.
- **Separation of Concerns:** Keep parsing, validation, business logic, and I/O (e.g., DB, API) in separate functions.
- **No Breaking Changes:** Refactor without changing the external behavior unless explicitly requested.
- **Comment Complex Logic:** Add comments for non-obvious code or business rules.

All agents and LLMs must apply these rules when asked to refactor, unless the user specifies otherwise.

2Do not run the dev server as it is already being run manually.
Do not commit changes until explicitly told to do so.