---

name: "Svelte Development"
description: "Instructions for creating and modifying Svelte components"
applyTo: "**/*.svelte,**/*.svelte.js,**/*.svelte.ts"
---

# Svelte Development Rules

## Use Svelte 5

All newly written Svelte code should use modern Svelte 5 conventions.

Prefer:

```svelte
<script>
    let count = $state(0);
    const doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
    {count}
</button>
```

Avoid legacy patterns in new code:

```svelte
<script>
    export let count = 0;
    $: doubled = count * 2;
</script>

<button on:click={handleClick}>
```

Do not use legacy Svelte syntax in new code unless compatibility with an existing component requires it.

## Keep Svelte Components Focused on UI

Svelte components should primarily contain:

* markup
* component-specific state
* event handlers
* component-specific UI behavior
* imports from JavaScript modules

Keep business logic and reusable application logic outside the component whenever practical.

Prefer:

```text
.svelte
    ↓
UI + small component state
    ↓
.js modules
    ↓
Business/application logic
```

Do not put large amounts of business logic inside `<script>` blocks.

## JavaScript Modules

Use regular `.js` or `.ts` files for reusable logic.

Examples:

```text
src/
├── lib/
│   ├── scoring.js
│   ├── validation.js
│   ├── storage.js
│   ├── questions.js
│   └── utils.js
```

Move logic into `.js` modules when it:

* is reused by multiple components
* represents business rules
* performs calculations
* processes data
* handles validation
* handles persistence or storage
* can be tested independently of the UI

Example:

```js
// scoring.js

export function calculateCompatibility(questions) {
    let weightedScore = 0;
    let maximumScore = 0;

    for (const question of questions) {
        if (question.score == null) continue;

        weightedScore += question.score * question.weight;
        maximumScore += 10 * question.weight;
    }

    return maximumScore === 0
        ? 0
        : (weightedScore / maximumScore) * 100;
}
```

Then keep the Svelte component simple:

```svelte
<script>
    import { calculateCompatibility } from '$lib/scoring.js';

    let questions = $state([]);

    const compatibility = $derived(
        calculateCompatibility(questions)
    );
</script>

<h2>{compatibility.toFixed(1)}%</h2>
```

## Component State

Use `$state` for state that belongs to the component.

```svelte
<script>
    let isOpen = $state(false);
</script>
```

Do not create global application state for values that only one component needs.

Keep application-wide state in one dedicated reusable Svelte state module, such as `src/lib/state.svelte.js`, using Svelte 5 runes.

Persist the complete global state object as one JSON value in `localStorage`. Load it during client-side initialization, fall back to the default state when no valid saved JSON exists, and write the updated JSON whenever the global state changes. Do not split global state across multiple `localStorage` keys.

Access `localStorage` only in the browser, and handle read, parse, and write failures without preventing the application from starting or continuing to run.

Keep component-only state local; do not put state in the global object just to persist it.

## Derived Values

Use `$derived` for values calculated from reactive state.

Prefer:

```svelte
<script>
    let scores = $state([]);
    const total = $derived(
        scores.reduce((sum, score) => sum + score, 0)
    );
</script>
```

Do not use `$effect` to calculate values that can be represented with `$derived`.

## Effects

Use `$effect` only for genuine side effects.

Appropriate examples include:

* interacting with browser APIs
* synchronizing with external systems
* logging
* subscriptions
* operations that must happen because state changed

Do not use `$effect` as a replacement for ordinary JavaScript calculations.

## Props

Use `$props()` for component inputs.

Example:

```svelte
<script>
    let { title, score = 0 } = $props();
</script>
```

Keep component APIs small and understandable.

Do not pass large objects or unnecessary props when simpler data can be passed.

## Events

Prefer modern Svelte event attributes:

```svelte
<button onclick={handleClick}>
```

Avoid legacy event directives:

```svelte
<button on:click={handleClick}>
```

unless compatibility with an existing legacy component requires them.

## JavaScript Inside `<script>`

A `<script>` block is expected in Svelte components when component-specific JavaScript is required.

However:

* keep it small
* avoid duplicating business logic
* import reusable functions from `.js` modules
* avoid large static datasets
* avoid long calculations
* avoid deeply nested logic

A good component should be understandable by looking at its markup and a relatively small script.

## Data

Keep static application data outside Svelte components whenever practical.

For example:

```text
src/lib/data/questions.js
src/lib/data/categories.js
src/lib/data/constants.js
```

Avoid large arrays and configuration objects directly inside `.svelte` files.

## Business Logic

Business rules must be centralized.

For example, compatibility scoring should live in:

```text
src/lib/scoring/scoring.js
```

rather than being implemented separately in:

```text
Dashboard.svelte
QuestionCard.svelte
Result.svelte
Candidate.svelte
```

UI components should call shared functions rather than reproduce business calculations.

Do not change business rules while refactoring UI code.

## Rendering

Keep complex logic out of markup when moving it into a JavaScript function or derived value improves readability.

Use Svelte control-flow features naturally:

```svelte
{#if condition}
    ...
{/if}

{#each items as item}
    ...
{/each}
```

Use stable keys for dynamic lists where appropriate.

## Component Design

Prefer composition over large monolithic components.

Create a component when it:

* is reused
* has meaningful internal behavior
* represents a recognizable UI element
* improves readability
* has a clear responsibility

Do not create a component for every small HTML fragment.

## Svelte + Bulma

Bulma is the primary UI and CSS framework.

Prefer Bulma classes directly in Svelte markup:

```svelte
<button class="button is-primary">
    Save
</button>
```

Before writing custom CSS, check whether Bulma already provides a suitable:

* component
* modifier
* helper
* spacing utility
* typography utility
* layout utility
* responsive utility

Prefer Bulma over custom CSS whenever possible.

Do not recreate Bulma functionality with custom CSS.

## Styling

Use this priority:

1. Existing Bulma class
2. Bulma utility/helper
3. Existing project-specific class
4. Scoped component CSS
5. Global CSS only when genuinely necessary
6. A primary color variable for the main application color resused across the application
7. A primary font variable for the main application font resused across the application

When custom CSS is required:

* keep it scoped to the component when possible
* avoid duplicating Bulma utilities
* avoid unnecessary nesting
* avoid `!important`
* avoid inline styles unless values must be dynamic

Do not create CSS for something Bulma already handles.

## Responsive Design

Design for:

* mobile phones
* tablets
* laptops
* desktop screens

prefer mobile-first design.

Use Bulma's responsive utilities before creating custom media queries.

Do not design desktop-first and attempt to fix responsiveness afterward.

## Forms

* Use semantic form elements.
* Always use bulma elements for form controls.
* Never use `<div>` elements for form controls.
* Ensure all validaion rules are applied consistently across all the elements on forms.
* For eg. Name field should have the same validation rules on all forms where it is used.

Prefer Svelte bindings where appropriate:

```svelte
<input bind:value={name}>
```

Keep validation rules in reusable JavaScript modules when they are non-trivial.

Example:

```text
src/lib/validation.js
```

The component should handle displaying validation state rather than containing all validation logic.

## Accessibility

Use semantic HTML.

Prefer:

```svelte
<button>
<a href="/...">
<nav>
<form>
<label>
```

Do not use clickable `<div>` elements when a button or link is appropriate.

Every form control should have an accessible label.

Ensure keyboard accessibility for interactive elements.

Use ARIA only when native HTML semantics are insufficient.

Maintain appropriate focus behavior for dialogs, menus, and other interactive components.

## Error Handling

Handle expected errors explicitly.

Do not silently swallow errors.

Keep technical error-handling logic in JavaScript modules where practical.

Svelte components should primarily be responsible for displaying the resulting error state.

## Performance

Prefer simple solutions.

Avoid unnecessary reactive state.

Use `$derived` for calculated values.

Do not use `$effect` when ordinary derived state is sufficient.

Do not add memoization, caching, or complex optimization without a demonstrated need.

## Dependencies

Do not introduce another UI framework.

Do not introduce:

* React
* Vue
* Angular
* Tailwind
* Bootstrap
* another CSS framework

unless explicitly requested.

Before adding a dependency, check whether the functionality can reasonably be handled by:

* Svelte
* Bulma
* browser APIs
* existing project utilities

Avoid dependencies for trivial functionality.

## Code Changes

Before modifying a component:

1. Inspect the existing component.
2. Inspect related JavaScript modules.
3. Reuse existing patterns.
4. Identify the smallest clean change.

Do not rewrite functioning components unnecessarily.

When adding logic, first decide whether it belongs in:

* the Svelte component
* a reusable `.js`/`.ts` module
* shared application state

Prefer `.js`/`.ts` modules for reusable or business logic.

## Testing and Validation

When modifying application logic:

* check for syntax errors
* check for type errors when TypeScript is used
* run available tests
* run the project build when practical

For important business logic, prefer independently testable JavaScript functions.

## Avoid

Do not:

* put business logic throughout Svelte components
* duplicate calculations across components
* put large datasets in `.svelte` files
* use legacy Svelte syntax for new code
* introduce another UI framework
* recreate Bulma utilities with custom CSS
* create unnecessary components
* create unnecessary dependencies
* use `$effect` for ordinary derived calculations
* use global state when local state is sufficient

## Guiding Principle

Keep the architecture simple:

```text
Svelte
    → UI and component behavior

JavaScript modules
    → Business logic, calculations, validation, data processing

Bulma
    → Styling and responsive layout
```

When deciding where code belongs, prefer the location that makes the logic reusable, testable, and independent from the UI.
