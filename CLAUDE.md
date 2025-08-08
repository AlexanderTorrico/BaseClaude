# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Skote - a React admin dashboard template built with Vite. It's a starter kit that provides a complete admin dashboard with authentication, CRUD operations, and multiple layout options.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

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