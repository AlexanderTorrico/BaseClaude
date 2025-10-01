/**
 * Test file para verificar el flujo de autenticación
 * Usar solo para debugging - eliminar en producción
 */

// Test para verificar si el token está en localStorage
export const testTokenInStorage = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('authUser');

  console.log('🧪 Test Auth Token:', {
    hasToken: !!token,
    tokenExists: token !== null,
    tokenLength: token?.length || 0,
    tokenPreview: token ? `${token.substring(0, 30)}...` : 'No token found',
    hasUser: !!user,
    userExists: user !== null,
    allStorageKeys: Object.keys(localStorage),
    timestamp: new Date().toISOString()
  });

  return {
    hasToken: !!token,
    token: token,
    hasUser: !!user
  };
};

// Test para verificar manualmente si el Bearer se está enviando
export const testManualBearerCall = async () => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    console.error('❌ No hay token para testear');
    return;
  }

  try {
    const response = await fetch('/rrhh/by_company_id/1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({})
    });

    console.log('🧪 Manual Bearer Test:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      tokenUsed: `${token.substring(0, 30)}...`
    });

    return response;
  } catch (error) {
    console.error('❌ Error en test manual:', error);
  }
};

// Función para simular un login y guardar token de prueba
export const setTestToken = (testToken: string = 'test-bearer-token-123456789') => {
  localStorage.setItem('authToken', testToken);
  localStorage.setItem('authUser', JSON.stringify({
    id: '1',
    name: 'Test User',
    email: 'test@test.com'
  }));

  console.log('🧪 Test token guardado:', testToken);
};

// Para usar en consola del navegador:
// import { testTokenInStorage, testManualBearerCall, setTestToken } from './testAuth';