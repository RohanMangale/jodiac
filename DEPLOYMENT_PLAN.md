# Jodiac GitHub Pages Deployment Plan

## Goal

Publish Jodiac from a new public GitHub repository named `jodiac`, with GitHub Actions building and deploying the site to GitHub Pages.

Expected site URL: `https://<owner>.github.io/jodiac/`

## Checklist

- [ ] **Check the local Git state.** Review the working tree, current branch, and configured remotes. Preserve existing history and unrelated changes; initialize Git only if this directory is not already a repository.
- [ ] **Make the app work under the Pages path.** Configure Vite to use `/jodiac/` for production builds and `/` for local development. Update the root-relative home link in `src/components/AppHeader.svelte` and the illustration paths in `src/pages/UserDetailsPage.svelte` to use Vite's base URL.
- [ ] **Add automatic Pages deployment.** Create `.github/workflows/deploy.yml` to install dependencies with `npm ci`, run `npm run build`, upload `dist`, and deploy it to Pages on pushes to `main`. Include manual dispatch and use the minimum required permissions.
- [ ] **Update project documentation.** Replace the leftover Vite starter content in `README.md` with Jodiac's description, local development/build commands, and GitHub Pages deployment details.
- [ ] **Verify the production build locally.** Run `npm run build`. Check that the generated scripts, styles, and public illustrations resolve beneath `/jodiac/`, while local development continues to use `/`.
- [ ] **Create and connect the GitHub repository.** Create a public repository named `jodiac` under the intended GitHub account. Check existing remotes before adding or changing `origin`; commit only the intended project changes and push the `main` branch.
- [ ] **Enable Pages and verify the live site.** Select GitHub Actions as the Pages source if GitHub prompts for it. Confirm the Actions deployment succeeds, then visit `https://<owner>.github.io/jodiac/` and test initial load, profile illustrations, primary navigation, and refresh.

## Decisions and Scope

- Deployment target is a new public repository named `jodiac`, using GitHub Actions.
- The repository owner's GitHub name is not yet specified and must be substituted into the site URL.
- The app switches views using component state in `src/App.svelte`; it does not use URL routing, so a deep-link fallback is not part of this plan.
- Existing local-storage behavior stays unchanged. No backend, custom domain, analytics, redesign, or new dependency is planned.
- `.gitignore` already excludes `node_modules` and `dist`.