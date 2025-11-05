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
- **React 18** with TypeScript and Vite for build tooling
- **Redux Toolkit** for state management (manual dispatch, NO createAsyncThunk)
- **React Router v6** for navigation
- **Reactstrap + Bootstrap 5** for UI components
- **i18next** for internationalization
- **Formik + Yup** for form handling and validation
- **Vitest + React Testing Library** for testing
- **MSW (Mock Service Worker)** for API mocking in tests

### Modular Architecture

The project follows a **layered modular architecture** for scalability:

```
src/modules/[Area]/[Module]/
├── components/          # UI components (Header, ContentTable, etc.)
├── hooks/              # Custom hooks (state + controller calls)
├── controllers/        # Business logic + Redux dispatch
├── services/           # HTTP calls (Axios)
├── adapters/           # API ↔ UI data mapping
├── models/             # TypeScript interfaces
├── slices/             # Redux state slices
├── config/             # Configuration files
└── __tests__/          # Tests (unit, integration, api)
```

### Data Flow Pattern

```
UI Component → Hook → Controller → [Service, Adapter, Slice] → Redux Store
```

**Complete architecture documentation:** [PROJECT_GUIDE.md](./PROJECT_GUIDE.md)

### Directory Structure
- `src/modules/` - Feature modules organized by business domain
  - Example: `Security/Users/` - User management module
- `src/components/` - Reusable UI components
  - `aziende/` - Custom high-level components (AzTable, AzHeader, AzFilterSummary)
  - `VerticalLayout/` and `HorizontalLayout/` - Main layout components
  - `Common/` - Shared components like Breadcrumb, TableContainer, Spinner
- `src/shared/` - Shared utilities and types
  - `controllers/` - Shared controller utilities (ControllerResponse)
  - `__tests__/` - Shared test utilities and MSW mocks
- `src/pages/` - Page components (legacy structure, migrating to modules)
- `src/store/` - Redux store configuration
- `src/routes/` - Route configuration with protected and public routes
- `src/helpers/` - Utility functions including API helpers and authentication
- `src/assets/` - Static assets including SCSS files and images

### State Management
- **Redux Toolkit** with manual dispatch (NO createAsyncThunk)
- Controllers handle async logic and dispatch to slices
- Hooks provide sync access to state via `useSelector`
- Each module has its own slice with standard structure: `{ list, loading, error }`

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

### Creating New Modules

Follow the modular architecture pattern (see [PROJECT_GUIDE.md](./PROJECT_GUIDE.md)):

1. **Structure**: Create module in `src/modules/[Area]/[Module]/`
2. **Layers**: Implement all layers (components, hooks, controllers, services, adapters, models, slices)
3. **Testing**: Add tests in `__tests__/` (unit, integration, api)
4. **Components**: Use AZ components (AzHeaderCard, AzTable, AzFilterSummary)
5. **Data Flow**: Follow UI → Hook → Controller → [Service, Adapter, Slice] → Redux

### Reference Implementation

The **`Security/Users`** module is the reference implementation showcasing:
- ✅ Complete layered architecture
- ✅ TypeScript models (UserModel, WorkStationModel)
- ✅ Redux Toolkit slice with standard structure
- ✅ Controller with ControllerResponse pattern
- ✅ Adapter for API-to-UI mapping
- ✅ Hook with intelligent caching
- ✅ Comprehensive testing (unit, integration, API)
- ✅ AZ components integration (AzTable, AzHeaderCard)

### Best Practices

1. **Type Safety**: Use TypeScript interfaces for all models
2. **Separation of Concerns**: Each layer has a single responsibility
3. **Testing**: Aim for 80%+ coverage on business logic
4. **Components**: Use AZ components for tables and headers
5. **State Management**: Use Redux slices with manual dispatch
6. **Imports**: Use `@/` alias for absolute imports
7. **Layout & Scrolling**: To avoid double horizontal scroll, apply `style={{ overflowX: 'hidden' }}` to the main Container fluid in module index files. The AzTable component handles its own scrolling internally.
8. **Mock Data for Development**: Use mock data in controllers during development. Set `USE_MOCK_DATA = true` in the controller and import from `data/mockFile.ts`. Switch to `false` for production API calls.

The codebase follows React functional component patterns with hooks and uses modern TypeScript/ES6+ features throughout.

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

### Example Test Structure (Users Module)

```typescript
// Unit Test (adapter)
describe('userAdapter', () => {
  it('debe mapear correctamente usuario del API', () => {
    const result = adaptUserResponseToUserModel(mockApiUser);
    expect(result.fullName).toBe('Juan Pérez');
  });
});

// Integration Test (controller)
describe('UserController', () => {
  it('debe obtener usuarios y actualizar Redux', async () => {
    const response = await UserController.getUsersByCompany(1);
    expect(response.success).toBe(true);
    expect(store.getState().users.list).toHaveLength(2);
  });
});
```

**For complete testing documentation, see [TESTING.md](./TESTING.md)**