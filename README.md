# Nao-in

Nao-in is a mini project blog application built with Next.js and Supabase. The project features a distinct modern industrial sci-fi game aesthetic, providing a unique and immersive user interface.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Database & Authentication**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) with React Testing Library

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v20 or higher recommended)
- A Supabase account and project

## Installation and Setup

1. **Navigate to the project directory**:
   ```bash
   cd nao-in
   ```

2. **Install the dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   The project requires Supabase credentials to function properly. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and configure your Supabase URL and anonymous key:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Testing

The project utilizes Vitest for unit and integration testing.

- Run all tests:
  ```bash
  npm run test
  ```

- Run tests in watch mode for development:
  ```bash
  npm run test:watch
  ```

## Design Philosophy

The user interface is heavily inspired by modern industrial sci-fi games. This design language involves specific color palettes, typography, and interactive elements tailored to fit the industrial sci-fi aesthetic. When contributing to the user interface, please ensure components adhere to these design guidelines.

## Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to analyze the code for potential errors.
- `npm run test`: Executes the test suite via Vitest.
