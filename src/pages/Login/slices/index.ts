// Barrel exports for Login slices
export {
  default as userReducer,
  loginStart,
  loginSuccess,
  loginFailure,
  updateUserProfile,
  clearError,
  setLoading,
  initializeUser,
  resetUserState,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectLastLogin,
  selectUserDisplayName,
  selectUserInitials,
  selectIsUserActive
} from './userSlice';