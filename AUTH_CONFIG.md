# Authentication Configuration Guide

> **Nota**: Este documento cubre la configuración de autenticación global del template. Para información completa sobre variables de entorno y configuración de APIs, consulta [API_CONFIGURATION.md](./API_CONFIGURATION.md). Para la arquitectura modular de features, consulta [CLAUDE.md](./CLAUDE.md).

## Overview

The authentication system now supports multiple modes:

1. **Mock Data** (Default) - For development and demos
2. **MockAdapter** - Using axios-mock-adapter for fake backend
3. **External API** - Real API server calls

## Configuration Options

### Environment Variables (.env.local)

```env
# Use mock data (true/false)
VITE_USE_MOCK_DATA=true

# External API base URL (optional)
VITE_API_BASE_URL=https://your-api-server.com/api

# Authentication method
VITE_APP_DEFAULTAUTH=fake
```

## Usage Scenarios

### 1. Development with Mock Data (Current Default)

```env
VITE_USE_MOCK_DATA=true
```

- Uses local JavaScript simulation
- No HTTP requests made
- Instant response
- Credentials: `admin@themesbrand.com` / `123456`

### 2. Using MockAdapter (Fake Backend)

```env
VITE_USE_MOCK_DATA=false
```

- Makes HTTP requests to MockAdapter
- Intercepts axios calls locally
- Simulates real HTTP behavior
- Same credentials as mock data

### 3. External API Server

```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://your-api-server.com/api
```

- Makes real HTTP requests
- Full URL: `https://your-api-server.com/api/post-fake-login`
- Fallback to mock if API fails

## Default Credentials

For mock and fake backend modes:

- **Email**: `admin@themesbrand.com`
- **Password**: `123456`

## Implementation Details

The system works with this flow:

1. Check `VITE_USE_MOCK_DATA` flag
2. If `true` → Use local mock simulation
3. If `false` → Try real API call
4. If API fails → Fallback to mock (development safety)

## Files Modified

- `src/helpers/fakebackend_helper.jsx` - Main login logic
- `src/helpers/AuthType/fakeBackend.jsx` - MockAdapter setup
- `.env.local` - Configuration variables