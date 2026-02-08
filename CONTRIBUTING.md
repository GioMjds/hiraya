# Contributing to Next.js Frontend

Thank you for your interest in contributing to Next.js Frontend. This document outlines the process for contributing to the frontend application.

## Getting Started

1. Fork the repository to your GitHub account
2. Clone your forked repository locally
3. Install dependencies with `pnpm install`
4. Create a new branch for your feature or fix

## Branch Naming Convention

Use descriptive branch names following this format:

- `feature/short-description` - For new features
- `fix/short-description` - For bug fixes
- `refactor/short-description` - For code refactoring
- `docs/short-description` - For documentation updates
- `style/short-description` - For styling changes
- `test/short-description` - For adding or updating tests

Examples:

- `feature/add-currency-converter`
- `fix/login-redirect-issue`
- `refactor/optimize-dashboard-queries`
- `docs/update-readme`

## Creating a New Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

## Making Changes

1. Make your changes in the new branch
2. Follow the existing code style and conventions
3. Keep changes focused and atomic
4. Test your changes locally with `pnpm run dev`
5. Ensure the build passes with `pnpm run build`
6. Run linting with `pnpm run lint`

## Commit Message Guidelines

Write clear and descriptive commit messages:

```list
type: short description

Longer description if needed explaining what and why.
```

Types:

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `docs` - Documentation changes
- `style` - Formatting, styling changes
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

Example:

```list
feat: add live currency converter to hero section

Integrated FastForex API to display real-time USD/PHP exchange rates.
Added auto-refresh every 60 seconds with last updated timestamp.
```

## Creating a Pull Request

1. Push your branch to your forked repository:

```bash
git push origin feature/your-feature-name
```

2. Go to the original repository on GitHub

3. Click "New Pull Request"

4. Select your branch as the compare branch

5. Fill out the pull request template with:
   - A clear and descriptive title
   - Summary of changes made
   - Related issue number if applicable
   - Screenshots for UI changes
   - Testing steps performed

## Pull Request Description Template

```list
## Summary
Brief description of what this PR does.

## Changes Made
- Change 1
- Change 2
- Change 3

## Related Issues
Fixes #123 (if applicable)

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation update
- [ ] Style/UI change

## Testing
Describe the tests you performed:
1. Step 1
2. Step 2
3. Step 3

## Screenshots
(If applicable, add screenshots of UI changes)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Changes have been tested locally
- [ ] Build passes without errors
- [ ] No new linting warnings
- [ ] Documentation updated if needed
```

## Code Review Process

1. All pull requests require at least one approval before merging
2. Address all review comments and suggestions
3. Keep the PR focused on a single feature or fix
4. Respond to feedback promptly

## Development Guidelines

### File Structure

- Components go in `components/` directory
- API clients go in `repositories/` directory
- Types go in `types/` directory
- Utility functions go in `lib/` directory
- Per folder, it has an `index.ts` for barrel export and `types.ts` per types being used

### Code Standards

- Use TypeScript for all new files
- Follow existing naming conventions
- Keep components under 200-300 lines
- Extract reusable logic into separate files
- Use meaningful variable and function names

### Testing

- Test your changes manually before submitting
- Add unit tests for new utilities
- Ensure existing tests pass

## Questions

If you have questions about contributing, open an issue for discussion before starting work on large changes.
