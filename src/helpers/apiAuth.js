import { post, get, put, del } from "./api_helper";

// Token management
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('bearerToken', token);
  } else {
    localStorage.removeItem('bearerToken');
  }
};

export const setProfile = (data) => {
  const profileTemplate = {
    "uid": data.id || 1,
    "username": data.name || data.username,
    "role": data.role || "user",
    "email": data.email
  };

  localStorage.setItem('authUser', JSON.stringify(profileTemplate));
};

export const getAuthToken = () => {
  return localStorage.getItem('bearerToken');
};

export const clearAuthToken = () => {
  localStorage.removeItem('bearerToken');
  localStorage.removeItem('authUser');
};

// Authentication endpoints for external API server
export const postApiLogin = async (data) => {
  try {
    console.log(data);
    const response = await post("/login", data);
    
    // Store bearer token if login successful
    console.log("SUCCESS");
    console.log(response);
    console.log(response.status);
    if(response.status == 200){
      console.log("with auth");
      setAuthToken(response.data.access_token);
      setProfile(response.data.data);
    }
    
    return response;
  } catch (error) {
    console.error('❌ API Login Error:', error);
    throw error;
  }
};

export const postApiRegister = async (data) => {
  try {
    const response = await post("/api/auth/register", data);
    return response;
  } catch (error) {
    console.error('❌ API Register Error:', error);
    throw error;
  }
};

export const postApiForgotPassword = async (data) => {
  try {
    const response = await post("/api/auth/forgot-password", data);
    return response;
  } catch (error) {
    console.error('❌ API Forgot Password Error:', error);
    throw error;
  }
};

export const postApiProfile = async (data) => {
  try {
    const response = await put("/api/auth/profile", data);
    return response;
  } catch (error) {
    console.error('❌ API Profile Update Error:', error);
    throw error;
  }
};

export const getApiProfile = async () => {
  try {
    const response = await get("/api/auth/profile");
    return response;
  } catch (error) {
    console.error('❌ API Get Profile Error:', error);
    throw error;
  }
};

export const postApiLogout = async () => {
  try {
    const response = await post("/auth/logout");
    
    // Clear bearer token on successful logout
    clearAuthToken();
    
    return response;
  } catch (error) {
    console.error('❌ API Logout Error:', error);
    // Clear token even if logout request fails
    clearAuthToken();
    throw error;
  }
};

export const postApiSocialLogin = async (data, loginType) => {
  try {
    const response = await post(`/api/auth/social/${loginType}`, data);
    
    // Store bearer token if social login successful
    if (response && response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  } catch (error) {
    console.error('❌ API Social Login Error:', error);
    throw error;
  }
};

// Utility functions
export const refreshApiToken = async () => {
  try {
    const response = await post("/api/auth/refresh-token");
    
    // Update stored token if refresh successful
    if (response && response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  } catch (error) {
    console.error('❌ API Refresh Token Error:', error);
    // Clear token if refresh fails
    clearAuthToken();
    throw error;
  }
};

export const validateApiToken = async (token) => {
  try {
    const response = await post("/api/auth/validate-token", { token });
    return response;
  } catch (error) {
    console.error('❌ API Validate Token Error:', error);
    throw error;
  }
};