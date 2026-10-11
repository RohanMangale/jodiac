# Project Instructions

## Project Overview

This project is a modern web application built from scratch using:

* Svelte 5
* Vite
* Bulma CSS
* JavaScript

The application should prioritize simplicity, maintainability, responsive design, accessibility, and minimal custom CSS.

## General Development Rules

* Follow the existing project structure and coding conventions before introducing new patterns.
* Do not introduce a new library or dependency unless it is genuinely necessary.
* Prefer simple solutions over abstractions that add complexity.
* Do not modify unrelated files when implementing a feature or fixing a bug.
* Reuse existing components, utilities, constants, and styles whenever possible.
* Before creating a new component, check whether an existing component can reasonably be reused.
* Keep business logic separate from presentation logic when practical.
* Avoid duplicated logic.

## Svelte

* Use modern Svelte 5 syntax and patterns for all new code.
* Prefer Svelte 5 runes such as `$state`, `$derived`, `$effect`, and `$props`.
* Do not use legacy Svelte syntax such as `export let`, `$:`, or `on:click` in new code unless compatibility with an existing legacy component requires it.
* Prefer event attributes such as `onclick`, `oninput`, and `onsubmit`.
* Use component props explicitly and keep data flow predictable.
* Prefer one-way data flow from parent components to child components.
* Use `$bindable` only when two-way binding is genuinely required.
* Use `.svelte.js` files for reusable reactive logic when appropriate.
* Do not introduce Svelte stores for simple local or component state.
* Keep components focused on a clear responsibility.

## UI Framework: Bulma

Bulma is the primary UI and CSS framework.

### Bulma-first rule

Before writing custom CSS, check whether Bulma already provides a suitable:

* component
* modifier
* helper class
* spacing utility
* typography utility
* layout utility
* responsive utility

Prefer Bulma classes over custom CSS whenever possible.

Do not recreate Bulma functionality with custom CSS.

Prefer:

```html
<div class="container">
    <div class="columns">
        <div class="column">
            ...
        </div>
    </div>
</div>
```

instead of creating equivalent custom layout CSS.

### Custom CSS

Custom CSS is allowed only when:

1. Bulma does not provide the required styling.
2. The design requires application-specific visual behavior.
3. A small amount of CSS produces a substantially cleaner solution.

When custom CSS is necessary:

* Keep it scoped to the component whenever possible.
* Do not duplicate Bulma utility classes with custom CSS.
* Do not create large global CSS files for component-specific styling.
* Avoid excessive nesting.
* Avoid `!important` unless there is a strong technical reason.
* Avoid inline styles unless dynamic values genuinely require them.
* Always use a primary color variable for the main application color.
* Reuse the primary color variable for all application elements that require the primary color.

## Responsive Design

The application must work well on:

* mobile phones
* tablets
* laptops
* desktop screens

But the primary focus is on mobile-first design.

Use Bulma's responsive utilities and layout system before writing custom media queries.

Do not design only for desktop and attempt to make it responsive afterward.

For interactive elements, ensure that touch targets are sufficiently large for mobile use.

## HTML and Accessibility

Use semantic HTML whenever possible.

Prefer:

```html
<button>
<a>
<nav>
<header>
<main>
<section>
<article>
<form>
<label>
```

over unnecessary `<div>` elements.

Every form control should have an accessible label.

Use buttons for actions and links for navigation.

Do not use clickable `<div>` elements when a button or link is appropriate.

Use ARIA attributes only when native HTML semantics are insufficient.

Ensure interactive functionality is usable with keyboard navigation.

## Components

Use reusable components for repeated or meaningful UI patterns.

Example structure:

```text
src/
├── components/
│   ├── Button.svelte
│   ├── Modal.svelte
│   ├── QuestionCard.svelte
│   └── ScoreCard.svelte
├── lib/
│   ├── data/
│   ├── utils/
│   └── state/
├── pages/
└── App.svelte
```

Do not create a component merely because a section of HTML contains a few lines.

Create a component when it:

* is reused
* has meaningful internal logic
* represents a recognizable UI element
* improves readability of the parent component

## Data and Configuration

Keep static application data outside Svelte markup.

For example:

```text
src/lib/data/questions.js
src/lib/data/categories.js
src/lib/data/constants.js
```

Do not hardcode large arrays, questionnaires, configuration objects, or scoring rules directly inside a component unless the data is truly local to that component.

Business rules should be centralized so they can be changed without modifying multiple components.

## State Management

Use the simplest state mechanism appropriate for the problem.

Use local `$state` for component-specific state.

Lift state to a parent when multiple child components need to share it.

Use reusable reactive state modules when application state needs to be shared across unrelated components.

Keep application-wide state in one dedicated Svelte state module using Svelte 5 runes. Persist the complete global state object as one JSON value in `localStorage`, loading it during client-side initialization and writing the updated JSON whenever the state changes. Do not split global state across multiple `localStorage` keys.

Access `localStorage` only in the browser. Fall back to the default state when saved data is missing or invalid, and handle read or write failures without preventing the application from running.

Do not introduce global state management libraries unless the application actually requires one.

## JavaScript

Prefer simple, clear, readable code over clever code.

Use meaningful variable and function names.

Avoid deeply nested conditionals.

Prefer early returns when they improve readability.

Keep functions focused on one responsibility.

Avoid unnecessary comments.

Avoid complex loops and nested callbacks.

Comments should explain why something is done, not simply repeat what the code does.

Add a one-line comment above a block of code when it is not immediately clear what the code does.

Add a one line comment above each function.

Add a brief comment above a function when it is not immediately clear what the function does.

## Error Handling

Handle expected errors explicitly.

Do not silently swallow errors.

User-facing errors should be understandable and actionable.

Do not expose sensitive technical details to users.

Log useful debugging information only where appropriate.

## Performance

Prefer simple and efficient solutions.

Do not optimize prematurely.

Avoid unnecessary reactivity.

Avoid expensive calculations inside frequently rendered markup when the value can be derived once.

Use `$derived` for values that can be calculated from reactive state.

Do not add memoization or caching unless there is a demonstrated need.

## Dependencies

Before installing a dependency:

1. Check whether the functionality can reasonably be implemented using existing project capabilities.
2. Check whether Bulma or Svelte already solves the problem.
3. Avoid dependencies that add significant complexity for a small feature.

Do not replace Bulma with another CSS framework.

Do not introduce React, Vue, Angular, Tailwind, Bootstrap, or another UI framework unless explicitly requested.

## Code Changes

Before modifying code:

* Inspect the relevant files.
* Understand the existing implementation.
* Reuse existing patterns where possible.
* Identify the smallest clean change that solves the problem.

After making changes:

* Check for syntax and type errors.
* Run the project's available validation commands.
* Ensure the build still succeeds when practical.

Do not rewrite working code simply to make it stylistically different.

## Output Expectations

When generating code:

* Provide production-quality code.
* Prefer complete implementations over pseudo-code.
* Do not leave TODO placeholders unless explicitly requested.
* Do not create unnecessary files.
* Explain important architectural decisions briefly when they affect the implementation.
* When there are multiple reasonable approaches, prefer the simplest approach that fits the existing architecture.

## Priority Order

When instructions conflict, use this priority:

1. User's explicit request
2. Existing project architecture
3. These project instructions
4. General coding preferences

Do not make assumptions about product behavior when the existing code or requirements provide evidence to the contrary.
