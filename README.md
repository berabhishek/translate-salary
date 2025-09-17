# Translate Salary

A web application to help you understand and compare salaries across different countries by calculating estimated taxes based on progressive tax brackets.

## Project Purpose

This tool helps users determine what salary they should target in another country to maintain the same level of savings after taxes and expenses. Whether you're considering an international job offer, planning a relocation, or exploring opportunities abroad, this application takes into account:

- **Tax differences** between countries using progressive tax brackets
- **Lifestyle expenses** (housing, food, entertainment, travel, shopping, etc.)
- **Unexpected costs** (medical expenses, insurance, and other surprises)
- **Currency conversions** to provide accurate comparisons

The core use case is answering the question: "If I want to save the same amount of money in [target country] as I do in [current country], what salary do I need to negotiate?"

## Features

-   **Salary Comparison:** Compare salaries between a source and target country.
-   **Tax Calculation:** Calculates pre-tax salary for the source country using a progressive tax system.
-   **Dynamic UI:** The interface is built with React and Redux for a responsive user experience.
-   **Searchable Dropdowns:** Easily search and select countries and currencies.
-   **Monetary Input Formatting:** Salary and expense inputs are automatically formatted with commas for readability.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/)
-   **UI Library:** [React](https://reactjs.org/)
-   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
-   **Database:** [Turso](https://turso.tech/) (with `@libsql/client`)
-   **Styling:** Plain CSS

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18 or later)
-   [pnpm](https://pnpm.io/) (or npm/yarn)
-   A [Turso](https://turso.tech/) account and the [Turso CLI](https://docs.turso.tech/cli/installation).

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/translate-salary.git
cd translate-salary
```

### 2. Install Dependencies

This project uses `pnpm`. You can also use `npm` or `yarn`.

```bash
pnpm install
```

### 3. Set Up the Database

This project uses Turso for its database.

1.  **Create a new database:**

    ```bash
    turso db create translate-salary-db
    ```

2.  **Get the database URL:**

    ```bash
    turso db show translate-salary-db --url
    ```

3.  **Create an auth token:**

    ```bash
    turso db tokens create translate-salary-db
    ```

### 4. Configure Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables.

```
TURSO_DATABASE_URL="your-turso-database-url"
TURSO_AUTH_TOKEN="your-turso-auth-token"
```

Replace the placeholder values with your actual Turso database URL and auth token.

### 5. Set Up the Database Schema

Connect to your database and run the following SQL command to create the `tax_brackets` table. You can use the Turso shell (`turso db shell translate-salary-db`) to do this.

```sql
CREATE TABLE tax_brackets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_code TEXT NOT NULL,
  min_income REAL NOT NULL,
  max_income REAL,
  rate_percent REAL NOT NULL
);
```

### 6. Populate the Database

Here is some example data for the United States (US) and Germany (DE). You will need to add data for the countries you want to support.

```sql
-- United States (US) - Example progressive tax brackets
INSERT INTO tax_brackets (country_code, min_income, max_income, rate_percent) VALUES
('US', 0, 11000, 10),
('US', 11000, 44725, 12),
('US', 44725, 95375, 22),
('US', 95375, 182100, 24),
('US', 182100, 231250, 32),
('US', 231250, 578125, 35),
('US', 578125, NULL, 37);

-- Germany (DE) - Example progressive tax brackets
INSERT INTO tax_brackets (country_code, min_income, max_income, rate_percent) VALUES
('DE', 0, 10908, 0),
('DE', 10908, 62809, 14),
('DE', 62809, 277825, 42),
('DE', 277825, NULL, 45);
```

### 7. Run the Development Server

Now you can start the development server.

```bash
pnpm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Available Scripts

-   `pnpm run dev`: Starts the development server.
-   `pnpm run build`: Builds the application for production.
-   `pnpm run start`: Starts the production server.

## API Endpoints

### `POST /api/calculate-tax`

Calculates the tax for a given salary and country.

**Request Body:**

```json
{
  "sourceCode": "US",
  "salary": 100000
}
```

**Success Response (200):**

```json
{
  "tax": 17400.5
}
```

**Error Response (404):**

If no tax brackets are found for the country.

```json
{
  "error": "No tax brackets found for country"
}
```

## Future Work

-   Integrate a real-time exchange rate API.
-   Incorporate Purchasing Power Parity (PPP) data for more accurate comparisons.
-   Add more comprehensive tax data for more countries.
-   Implement user authentication to save comparisons.
