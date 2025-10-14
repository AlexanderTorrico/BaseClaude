# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Skote - a React admin dashboard template built with Vite. It's a starter kit that provides a complete admin dashboard with authentication, CRUD operations, and multiple layout options.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally
- `npm run test` - Run all tests with Vitest
- `npm run test:ui` - Run tests with visual UI interface
- `npm run test:coverage` - Run tests and generate coverage report

## Architecture

### Core Stack
- **React 18** with Vite for build tooling
- **Redux + Redux Saga** for state management
- **React Router v6** for navigation
- **Reactstrap + Bootstrap 5** for UI components
- **i18next** for internationalization
- **Formik + Yup** for form handling and validation

### Directory Structure
- `src/components/` - Reusable UI components
  - `VerticalLayout/` and `HorizontalLayout/` - Main layout components
  - `Common/` - Shared components like Breadcrumb, TableContainer, Spinner
  - `CommonForBoth/` - Components used across layouts (TopbarDropdown, RightSidebar)
- `src/pages/` - Page components organized by feature
- `src/store/` - Redux store configuration with feature-based modules (auth, layout)
- `src/routes/` - Route configuration with protected and public routes
- `src/helpers/` - Utility functions including API helpers and authentication
- `src/assets/` - Static assets including SCSS files and images

### State Management
The application uses Redux with Redux Saga for side effects:
- Store modules are organized by feature (auth/login, auth/register, auth/profile, layout)
- Each module contains actionTypes, actions, reducer, and saga files
- Main store configuration in `src/store/index.js`

### Authentication
- Uses fake backend authentication by default (`fakeBackend()` in App.jsx)
- Firebase authentication is available but commented out
- Protected routes wrapped with `Authmiddleware` component
- JWT token handling available in `src/helpers/jwt-token-access/`

### Layout System
The app supports multiple layouts:
- Vertical Layout (default) - Traditional sidebar navigation
- Horizontal Layout - Top navigation bar
- Layout switching controlled via Redux store

### Styling
- SCSS-based theming system in `src/assets/scss/`
- Bootstrap 5 with custom overrides
- Supports RTL layouts
- Dark/light theme variables available

### Key Features
- Multi-language support (English, German, Italian, Russian, Spanish)
- CRUD operations with modern and basic implementations
- Authentication pages (login, register, forgot password)
- Responsive design with mobile support
- Toast notifications via react-toastify

## Working with This Codebase

When adding new features:
1. Follow the existing folder structure and naming conventions
2. Use the established Redux patterns for state management
3. Leverage existing components from `src/components/Common/`
4. Follow the route protection patterns in `src/routes/`
5. Use Reactstrap components for consistent UI
6. Add new translations to locale files if needed

The codebase follows React functional component patterns with hooks and uses modern JavaScript/ES6+ features throughout.

## Testing Architecture

### Testing Stack
- **Vitest** - Fast unit test framework optimized for Vite
- **React Testing Library** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking for integration tests
- **@vitest/ui** - Visual test interface
- **@vitest/coverage-v8** - Code coverage reporting

### Test Organization
Tests are organized by module following this structure:
```
src/modules/{Module}/
└── __tests__/
    ├── fixtures/          # Mock data and test fixtures
    ├── unit/              # Unit tests (adapters, slices)
    ├── integration/       # Integration tests (controllers, hooks)
    └── api/               # API tests with MSW
```

### Shared Test Utilities
Located in `src/shared/__tests__/`:
- `setup/vitest.setup.ts` - Global test configuration
- `utils/renderWithProviders.tsx` - Helper for rendering with Redux + Router
- `utils/createMockStore.ts` - Redux store factory for tests
- `utils/testHelpers.ts` - Common testing utilities
- `mocks/` - MSW handlers and server configuration

### Test Configurations
Multiple Vitest configurations in `/test` directory:
- `vitest.config.ts` - Base configuration
- `vitest.unit.config.ts` - Unit tests only
- `vitest.integration.config.ts` - Integration tests only
- `vitest.api.config.ts` - API tests only

### Running Specific Test Types
```bash
# Run all tests
npm run test

# Run only unit tests
vitest --config test/vitest.unit.config.ts

# Run only integration tests
vitest --config test/vitest.integration.config.ts

# Run only API tests
vitest --config test/vitest.api.config.ts

# Watch mode
npm run test -- --watch

# Generate coverage
npm run test:coverage
```

### Testing Guidelines
1. **Unit Tests**: Test pure functions in isolation (adapters, reducers)
2. **Integration Tests**: Test modules working together (controllers with Redux, hooks)
3. **API Tests**: Test HTTP calls with MSW interceptors (services)
4. **Coverage Goals**: Aim for 80%+ coverage on business logic layers
5. **Test Naming**: Use `.test.ts` extension for all test files
6. **Fixtures**: Store mock data in `__tests__/fixtures/` within each module

For detailed testing documentation, see [TESTING.md](./TESTING.md).