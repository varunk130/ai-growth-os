# Contributing

Thanks for your interest in contributing! This project welcomes issues, suggestions, and pull requests.

## Ways to contribute

- **Report a bug** - open an issue describing what you tried, what you expected, and what happened.
- **Suggest a feature** - open an issue describing the problem and your proposed solution.
- **Improve the docs** - typo fixes, clarifications, and new examples are always welcome.
- **Write code** - pick up an open issue or propose a small change first so we can align on scope.

## Pull request workflow

1. Fork the repo and create a feature branch from `main`:
   `git checkout -b feat/short-description` (or `fix/`, `docs/`, `chore/`).
2. Keep changes focused - one logical change per PR.
3. Add or update tests where it makes sense.
4. Use [Conventional Commits](https://www.conventionalcommits.org/) where possible
   (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`).
5. Open a PR against `main` and link the related issue.

## Local setup

Compound is a Next.js app that runs entirely locally - no API keys and no external
model calls are required.

```bash
npm install
npm run dev
```

Then open the local URL printed by the dev server.

## Checks before opening a PR

- `npm run lint` - lint the codebase.
- `npm run typecheck` - type-check without emitting.
- `npm test` - run the test suite.
- `npm run seed` - regenerate the synthetic dataset.
- `npm run build` - production build.

## Code style

- Be consistent with surrounding code - match the style you find.
- Keep components small and well-named.
- Comment **why**, not **what**, where context isn't obvious.
- Keep the synthetic-data boundary intact: no real customer data in this repo.

## Reporting bugs

When opening an issue, please include:

- What you tried (steps to reproduce)
- What you expected to happen
- What actually happened (paste any error output)
- Your environment (OS, Node version, project commit SHA)

## Code of conduct

Participants are expected to be respectful and constructive. See `CODE_OF_CONDUCT.md`.

## Questions?

Open a GitHub Discussion (if enabled) or an issue with the `question` label. Thanks for helping make this project better.
