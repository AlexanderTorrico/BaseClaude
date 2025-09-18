import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";
import * as apiAuth from "./realBackendAuth";
import { API_CONFIG } from "../config/api";

// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

// Check if Bearer token exists for external API authentication
const isExternalApiAuthenticated = () => {
  const bearerToken = apiAuth.getAuthToken();
  return bearerToken !== null && bearerToken !== undefined;
};

//is user is logged in
const isUserAuthenticated = () => {
  if (!API_CONFIG.useMock) {
    // For external API, check Bearer token
    return isExternalApiAuthenticated();
  }
  // For mock data, check local storage
  return getLoggedInUser() !== null;
};

// Register Method
const postFakeRegister = async (data) => {
  if (API_CONFIG.useMock) {
    return axios
      .post(url.POST_FAKE_REGISTER, data)
      .then(response => {
        if (response.status >= 200 || response.status <= 299) return response.data;
        throw response.data;
      })
      .catch(err => {
        let message;
        if (err.response && err.response.status) {
          switch (err.response.status) {
            case 404:
              message = "Sorry! the page you are looking for could not be found";
              break;
            case 500:
              message =
                "Sorry! something went wrong, please contact our support team";
              break;
            case 401:
              message = "Invalid credentials";
              break;
            default:
              message = err[1];
              break;
          }
        }
        throw message;
      });
  } else {
    try {
      return await apiAuth.postApiRegister(data);
    } catch (error) {
      console.warn('External API register failed, falling back to mock:', error.message);
      // Fallback to original mock behavior
      return axios.post(url.POST_FAKE_REGISTER, data);
    }
  }
};

// Mock users for development
const mockUsers = [
  {
    uid: 1,
    username: "admin",
    role: "admin",
    password: "123456",
    email: "admin@themesbrand.com",
  },
];

// Mock login function
const mockLogin = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const validUser = mockUsers.find(
        (usr) => usr.email === data.email && usr.password === data.password
      );
      
      if (validUser) {
        const { password, ...userWithoutPassword } = validUser;
        resolve(userWithoutPassword);
      } else {
        reject(new Error("Username and password are invalid. Please enter correct username and password"));
      }
    }, 500);
  });
};

// Login Method
const postFakeLogin = async (data) => {
  console.log('postFakeLogin called with:', data);
  
  // Check if we're using mock data or external API
  if (API_CONFIG.useMock) {
    // Use mock login
    console.log('Using mock login data');
    return mockLogin(data);
  } else {
    // Use external API through apiAuth
    console.log('Using external API authentication');
    
    try {
      return await apiAuth.postApiLogin(data);
    } catch (error) {
      // If external API fails, fallback to mock (for development)
      console.warn('External API failed, falling back to mock:', error.message);
      return mockLogin(data);
    }
  }
};

// postForgetPwd
const postFakeForgetPwd = async (data) => {
  if (API_CONFIG.useMock) {
    return post(url.POST_FAKE_PASSWORD_FORGET, data);
  } else {
    try {
      return await apiAuth.postApiForgotPassword(data);
    } catch (error) {
      console.warn('External API forgot password failed:', error.message);
      return post(url.POST_FAKE_PASSWORD_FORGET, data);
    }
  }
};

// Edit profile
const postJwtProfile = data => post(url.POST_EDIT_JWT_PROFILE, data);

const postFakeProfile = async (data) => {
  if (API_CONFIG.useMock) {
    return post(url.POST_EDIT_PROFILE, data);
  } else {
    try {
      return await apiAuth.postApiProfile(data);
    } catch (error) {
      console.warn('External API profile update failed:', error.message);
      return post(url.POST_EDIT_PROFILE, data);
    }
  }
};

// Register Method
const postJwtRegister = (url, data) => {
  return axios
    .post(url, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299) return response.data;
      throw response.data;
    })
    .catch(err => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
const postJwtLogin = data => post(url.POST_FAKE_JWT_LOGIN, data);

// postForgetPwd
const postJwtForgetPwd = data => post(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = data => post(url.SOCIAL_LOGIN, data);



export {
  getLoggedInUser,
  isUserAuthenticated,
  isExternalApiAuthenticated,
  postFakeRegister,
  postFakeLogin,
  postFakeProfile,
  postFakeForgetPwd,
  postJwtRegister,
  postJwtLogin,
  postJwtForgetPwd,
  postJwtProfile,
};
