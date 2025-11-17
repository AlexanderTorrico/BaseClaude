import axios from "axios";
import accessToken from "./jwt-token-access/accessToken";
import { API_CONFIG } from "../config/api";
import { getAuthToken } from "./realBackendAuth";

//pass new generated access token here
const token = accessToken;

const axiosApi = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

// Add request interceptor for debugging
if (API_CONFIG.debug) {
  axiosApi.interceptors.request.use((config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Data:', config.data);
    return config;
  });
}

// Set default authorization header
axiosApi.defaults.headers.common["Authorization"] = token;

// Add request interceptor to include Bearer token for external API
axiosApi.interceptors.request.use(
  (config) => {
    // If using external API (not mock), use Bearer token
    if (!API_CONFIG.useMock) {
      const bearerToken = getAuthToken();
      if (bearerToken) {
        config.headers.Authorization = `Bearer ${bearerToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized responses
    if (error.response && error.response.status === 401 && !API_CONFIG.useMock) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('bearerToken');
      localStorage.removeItem('user');
      // Optionally trigger logout action
      console.warn('Bearer token expired or invalid, clearing authentication');
    }
    return Promise.reject(error);
  }
);

export async function get(url, config = {}) {
  return await axiosApi
    .get(url, { ...config })
    .then((response) => response.data);
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data);
}

export async function postFormData(url, formData, config = {}) {
  return axiosApi
    .post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    })
    .then((response) => response.data);
}
