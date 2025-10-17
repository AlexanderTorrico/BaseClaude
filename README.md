# Skote - React Admin Dashboard (TypeScript + Vite)

A modern, scalable React admin dashboard template built with TypeScript, Vite, Redux Toolkit, and a layered modular architecture.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 📚 Documentation

- **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** - Complete architecture and development guide
- **[TESTING.md](./TESTING.md)** - Testing strategy and examples
- **[CLAUDE.md](./CLAUDE.md)** - AI assistant guidance (for Claude Code)
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - API integration patterns
- **[AUTH_CONFIG.md](./AUTH_CONFIG.md)** - Authentication configuration

## 🏗️ Architecture

This project follows a **layered modular architecture** for maximum scalability and maintainability:

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

### Reference Implementation

The **`Security/Users`** module ([src/modules/Security/Users/](./src/modules/Security/Users/)) is the reference implementation showcasing:
- ✅ Complete layered architecture
- ✅ TypeScript models with type safety
- ✅ Redux Toolkit slice with standard structure
- ✅ Controller with ControllerResponse pattern
- ✅ Adapter for API-to-UI mapping
- ✅ Hook with intelligent caching
- ✅ Comprehensive testing (unit, integration, API)
- ✅ AZ components integration (AzTable, AzHeaderCard)

## 🧪 Testing

Built with **Vitest** for fast, modern testing:

```bash
# Run all tests
npm run test

# Run with UI interface
npm run test:ui

# Watch mode
npm run test -- --watch

# Coverage report
npm run test:coverage
```

### Test Coverage Goals

| Layer | Test Type | Coverage Target |
|-------|-----------|-----------------|
| Adapters | Unit | 100% |
| Slices | Unit | 100% |
| Services | API | 90% |
| Controllers | Integration | 85% |
| Hooks | Integration | 80% |

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Redux Toolkit** - State management (manual dispatch)
- **React Router v6** - Navigation
- **Reactstrap + Bootstrap 5** - UI components
- **Vitest + React Testing Library** - Testing
- **MSW** - API mocking
- **i18next** - Internationalization
- **Formik + Yup** - Form handling

## 📖 Key Features

- 🎨 Modern, responsive admin dashboard
- 🏗️ Modular layered architecture
- 🧪 Comprehensive test coverage
- 🔐 Authentication & authorization
- 🌍 Multi-language support
- 📊 Advanced data tables (AzTable)
- 🎯 Type-safe with TypeScript
- ⚡ Fast development with Vite HMR

## 🔗 Related Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)

## 📝 License

This project is licensed under the MIT License.
