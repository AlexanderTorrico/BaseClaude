import { Result } from '../types/registerTypes';

export const saveRegisteredUserToStorage = (userData: any): Result<void> => {
  try {
    localStorage.setItem('registeredUser', JSON.stringify(userData));
    console.log('✅ Storage - Registered user saved to localStorage');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Storage Error - Failed to save registered user:', error);
    return {
      success: false,
      error: 'Failed to save user data to storage'
    };
  }
};

export const getRegisteredUserFromStorage = (): Result<any> => {
  try {
    const userData = localStorage.getItem('registeredUser');
    if (userData) {
      const parsedData = JSON.parse(userData);
      console.log('✅ Storage - Retrieved registered user from localStorage');
      return { success: true, data: parsedData };
    }
    return { success: true, data: null };
  } catch (error: any) {
    console.error('❌ Storage Error - Failed to retrieve registered user:', error);
    return {
      success: false,
      error: 'Failed to retrieve user data from storage'
    };
  }
};

export const clearRegisteredUserFromStorage = (): Result<void> => {
  try {
    localStorage.removeItem('registeredUser');
    console.log('✅ Storage - Registered user cleared from localStorage');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Storage Error - Failed to clear registered user:', error);
    return {
      success: false,
      error: 'Failed to clear user data from storage'
    };
  }
};