# Form Builder Engine with Conditional Branching

This project implements a robust, schema-driven Form Builder, inspired by the Server-Driven UI approaches like Valibot Schema Driven UI. It allows users to dynamically build complex, multi-page forms with conditional logic evaluation happening in real-time.

## Architecture

The project is split into three main logical parts:
1. **The Schema Definition (`src/schema/form.ts`)**: A strict structure mapping what a Form, Page, Field, Option, and Logic Rule looks like. This serves as the single source of truth for both the Builder and the Preview Engine.
2. **The Builder (`src/components/builder/`)**: A visual drag-and-drop-esque environment where users construct the JSON schema. It communicates with a global Zustand store (`src/store/useFormStore.ts`).
3. **The Preview Engine (`src/components/preview/`)**: A real-time state machine that takes the JSON schema and user inputs, evaluating conditional logic rules to determine whether a field should be seamlessly shown or hidden.

## Data & Form Configuration

The output of the builder is a deeply nested, executable JSON schema. The schema dictates the structure to render and inherently contains logic rules.

Example snippet of a conditional rule:
```json
{
  "rules": [
    {
      "id": "abc1234",
      "fieldId": "xyz987",
      "operator": "equals",
      "value": "Yes"
    }
  ]
}
```

## Preview Engine & Core Logic

The Preview Component uses an internal hashmap mechanism `responses: Record<string, any>` to keep track of user input. 
As the user inputs data, `isFieldVisible(field)` runs through every field's attached dependency rules against the `responses` state.
If `isFieldVisible()` returns true, standard React re-rendering instantly displays the field without any flashes or layout thrashing.
Conversely, if the condition becomes false, it disappears.

## Setup & Running

This is a Next.js App Router project leveraging Tailwind CSS and shadcn/ui.

1. Ensure you have Node installed (v18+).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Key Technologies
- **Next.js**: Core framework
- **Zustand**: Global state management
- **Valibot**: Schema declarations
- **Tailwind CSS + shadcn/ui**: Styling & UI components
- **Lucide React**: Iconography
# flow-automate
