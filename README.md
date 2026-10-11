# Svelte + Vite

# Jodiac

A Svelte 5 application for guiding meaningful conversations and keeping track of dates. Profile and date information is stored locally in the browser.
## Development

```sh
npm ci
npm run dev
```

Node.js 22 is used for the automated deployment build.

## Production build

```sh
npm run build
npm run preview
```

## Deployment

The GitHub Actions workflow builds and deploys the site to GitHub Pages whenever changes are pushed to `main`. In the repository settings, configure **Pages** to use **GitHub Actions** as the deployment source.

The project site URL will be:

`https://<owner>.github.io/jodiac/`

Replace `<owner>` with the GitHub account that owns the repository.

## Source layout

- `src/pages/` contains the landing, profile setup, home, questionnaire, and report views.
- `src/components/` contains reusable interface components.
- `src/lib/state.svelte.js` owns application state and persists it in browser local storage.
- `src/assets/` contains assets imported and bundled by Vite.
- `src/styles.css` contains application styles; Bulma provides the base UI framework.
