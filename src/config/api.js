// API Configuration
// Configuración centralizada de APIs

// Configuración directa desde variables de entorno
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://192.168.1.155/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  useMock: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  authMethod: import.meta.env.VITE_APP_DEFAULTAUTH || 'fake',
  debug: import.meta.env.VITE_DEBUG_API === 'true',
};

// Configuración de autenticación por método
export const AUTH_ENDPOINTS = {
  fake: {
    login: '/post-fake-login',
    register: '/post-fake-register',
    forgotPassword: '/fake-forget-pwd',
    profile: '/post-fake-profile',
    social: '/social-login',
  },
  jwt: {
    login: '/post-jwt-login',
    register: '/post-jwt-register',
    forgotPassword: '/jwt-forget-pwd',
    profile: '/post-jwt-profile',
    social: '/social-login',
  },
  firebase: {
    // Firebase no usa endpoints HTTP tradicionales
  }
};

// Helper para obtener endpoint completo
export const getFullEndpoint = (endpoint) => {
  if (!API_CONFIG.baseURL) return endpoint;
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Log configuration in debug mode
if (API_CONFIG.debug) {
  //console.group('🔧 API Configuration');
  //console.log('Base URL:', API_CONFIG.baseURL);
  //console.log('Use Mock:', API_CONFIG.useMock);
  //console.log('Auth Method:', API_CONFIG.authMethod);
  //console.log('Timeout:', API_CONFIG.timeout + 'ms');
  //console.groupEnd();
}