import api from '../api/api';
import createDataContext from './createDataContext';
import socketService from '../services/socketService';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'STOP_LOADING':
      return { ...state, loading: false };
    case 'ADD_API_MESSAGE':
      return { ...state, apiMessage: action.payload, loading: false };
    case 'CLEAR_API_MESSAGES':
      return { ...state, apiMessage: '', loading: false };
    case 'ADD_ERROR':
      return { ...state, errorMessage: action.payload, loading: false };
    case 'CLEAR_ERROR_MESSAGE':
      return { ...state, errorMessage: '', loading: false };
    case 'SIGN_IN':
      return {
        ...state,
        errorMessage: '',
        token: action.payload,
        loading: false,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        token: null,
        user: null,
        errorMessage: '',
        loading: false,
        initLoginDone: false,
      };
    case 'FETCH_USER':
      return { ...state, user: action.payload, loading: false };
    case 'ENABLE_HR_DASHBOARD':
      return { ...state, user: action.payload, loading: false };
    case 'CREATE_USERS_DEVICE':
      return { ...state, usersDevice: action.payload };
    case 'SET_INTRO_AFFILIATE_CODE':
      return { ...state, introAffiliateCode: action.payload };
    case 'ADD_AFFILIATE_INFO':
      return { ...state, affiliateInfo: action.payload, loading: false };
    case 'CLEAR_AFFILIATE_INFO':
      return { ...state, affiliateInfo: action.payload };
    case 'ADD_AFFILIATES':
      return { ...state, affiliates: action.payload, loading: false };
    case 'CLEAR_AFFILIATES':
      return { ...state, affiliates: action.payload };
    case 'ADD_USERS_INFO_CONTENT':
      return { ...state, usersInfoContent: action.payload };
    case 'SET_HR_INTENT':
      return { ...state, HRIntent: action.payload };
    case 'ENABLE_HR_DASHBOARD':
      return { ...state, user: action.payload, loading: false };
    case 'SET_INIT_LOGIN_DONE':
      return { ...state, initLoginDone: action.payload };
    default:
      return state;
  }
};

const fetchUser = dispatch => async () => {
  dispatch({ type: 'LOADING' });
  try {
    const response = await api.get('/auth/user/fetch-user');
    if (response.data.error) {
      // If there's an authentication error, clear the state
      if (
        response.data.error === 'You must be logged in.' ||
        response.data.error === 'no user logged in'
      ) {
        dispatch({ type: 'SIGN_OUT' });
      } else {
        dispatch({ type: 'ADD_ERROR', payload: response.data.error });
      }
      return;
    } else {
      dispatch({ type: 'FETCH_USER', payload: response.data });
      return;
    }
  } catch (error) {
    console.log('Fetch user error:', error);
    // If it's an authentication error, clear the state
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      dispatch({ type: 'SIGN_OUT' });
    }
    return;
  }
};

const tryLocalSignin = dispatch => async () => {
  // For web app, we need to check if user is authenticated via cookie
  // We can do this by making a request to a protected endpoint
  try {
    const response = await api.get('/auth/user/fetch-user');
    if (response.data && !response.data.error) {
      dispatch({ type: 'SIGN_IN', payload: 'web-authenticated' });
      dispatch({ type: 'FETCH_USER', payload: response.data });

      // Authenticate with socket.io for real-time notifications
      if (response.data._id) {
        socketService.connect();
        socketService.authenticate(response.data._id);
      }
    } else if (response.data && response.data.error) {
      // Handle authentication errors
      if (
        response.data.error === 'You must be logged in.' ||
        response.data.error === 'no user logged in'
      ) {
        dispatch({ type: 'SIGN_OUT' });
      }
    }
  } catch (error) {
    // User is not authenticated, which is fine for initial load
    console.log(
      'tryLocalSignin - User not authenticated on initial load:',
      error
    );
    // If it's an authentication error, clear the state
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      dispatch({ type: 'SIGN_OUT' });
    }
  }
};

const register =
  dispatch =>
  async ({
    fullName,
    email,
    password,
    password2,
    introAffiliateCode,
    HRIntent,
    cvToSave,
    termsAccepted,
  }) => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await api.post('/auth/user/register', {
        fullName,
        email,
        password,
        password2,
        affiliatceIntroCode: introAffiliateCode,
        HRIntent,
        cvToSave,
        termsAccepted,
      });
      dispatch({ type: 'STOP_LOADING' });
      if (response.data.error)
        dispatch({ type: 'ADD_ERROR', payload: response.data.error });
      if (response.data.success)
        dispatch({ type: 'ADD_API_MESSAGE', payload: response.data });
    } catch (err) {
      dispatch({ type: 'STOP_LOADING' });
      dispatch({
        type: 'ADD_ERROR',
        payload: err.response.data,
      });
    }
  };

const signin =
  dispatch =>
  async ({ email, password, HRIntent, cvToSave }) => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await api.post('/auth/user/login-web', {
        email,
        password,
        HRIntent,
        cvToSave,
      });

      if (response.data.error) {
        dispatch({ type: 'ADD_ERROR', payload: response.data.error });
        return;
      }

      // For web login, we don't need to store token in localStorage as it's in HTTP-only cookie
      // But we still need to track authentication state
      dispatch({ type: 'SIGN_IN', payload: 'web-authenticated' });
      // Fetch user data after successful login
      const fetchUserAction = fetchUser(dispatch);
      const userData = await fetchUserAction();

      // Authenticate with socket.io for real-time notifications
      if (userData && userData._id) {
        socketService.connect();
        socketService.authenticate(userData._id);
      }
    } catch (err) {
      dispatch({ type: 'STOP_LOADING' });
      dispatch({
        type: 'ADD_ERROR',
        payload: err.response?.data || 'Login failed',
      });
    }
  };

const signout = dispatch => async () => {
  try {
    // Call the logout endpoint to clear the HTTP-only cookie
    await api.post('/auth/user/logout');
  } catch (error) {
    console.log('Logout endpoint error:', error);
    // Continue with local logout even if server call fails
  }

  // Disconnect from socket.io
  socketService.disconnect();

  // Clear the local state
  dispatch({ type: 'SIGN_OUT' });
};

const forgotPassword =
  dispatch =>
  async ({ email }) => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await api.post('/auth/user/forgot', { email });

      if (response.data.error) {
        dispatch({ type: 'ADD_ERROR', payload: response.data.error });
        throw new Error(
          response.data.error.email ||
            response.data.error.warn ||
            'Failed to send password reset email'
        );
      }

      if (response.data.success) {
        dispatch({ type: 'ADD_API_MESSAGE', payload: response.data });
      }
    } catch (error) {
      dispatch({
        type: 'ADD_ERROR',
        payload: {
          email:
            error.message ||
            'Failed to send password reset email. Invalid email address. Please try again.',
        },
      });
      throw error;
    }
  };

const resetPassword =
  dispatch =>
  async ({ password, password2, token }) => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await api.post('/auth/user/reset', {
        password,
        password2,
        token,
      });

      if (response.data.error) {
        dispatch({ type: 'ADD_ERROR', payload: response.data.error });
        throw new Error(
          response.data.error.password ||
            response.data.error.password2 ||
            response.data.error.token ||
            'Failed to reset password'
        );
      }

      if (response.data.success) {
        dispatch({ type: 'ADD_API_MESSAGE', payload: response.data });
        return response.data;
      }
    } catch (error) {
      dispatch({
        type: 'ADD_ERROR',
        payload: {
          password:
            error.message || 'Failed to reset password. Please try again.',
        },
      });
      throw error;
    }
  };

const handleAuthError = dispatch => () => {
  // Clear authentication state when cookie expires or authentication fails
  dispatch({ type: 'SIGN_OUT' });
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'CLEAR_ERROR_MESSAGE' });
};

const clearApiMessage = dispatch => () => {
  dispatch({ type: 'CLEAR_API_MESSAGES' });
};

const createUsersDevice = dispatch => async deviceInfo => {
  try {
    const response = await api.post('/api/devices', deviceInfo);
    dispatch({ type: 'CREATE_USERS_DEVICE', payload: response.data });
  } catch (err) {
    console.log(err);
  }
};

const setIntroAffiliateCode = dispatch => code => {
  dispatch({ type: 'SET_INTRO_AFFILIATE_CODE', payload: code });
};

const addAffiliateInfo = dispatch => async () => {
  dispatch({ type: 'LOADING' });
  try {
    const response = await api.get('/api/affiliate/info');
    dispatch({ type: 'ADD_AFFILIATE_INFO', payload: response.data });
  } catch (err) {
    dispatch({ type: 'STOP_LOADING' });
  }
};

const clearAffiliateInfo = dispatch => () => {
  dispatch({ type: 'CLEAR_AFFILIATE_INFO', payload: null });
};

const addAffiliates = dispatch => async () => {
  dispatch({ type: 'LOADING' });
  try {
    const response = await api.get('/api/affiliate');
    dispatch({ type: 'ADD_AFFILIATES', payload: response.data });
  } catch (err) {
    dispatch({ type: 'STOP_LOADING' });
  }
};

const clearAffiliates = dispatch => () => {
  dispatch({ type: 'CLEAR_AFFILIATES', payload: [] });
};

const addUsersInfoContent = dispatch => content => {
  dispatch({ type: 'ADD_USERS_INFO_CONTENT', payload: content });
};

const setHRIntent = dispatch => value => {
  dispatch({ type: 'SET_HR_INTENT', payload: value });
};

const enableHRDashboard = dispatch => async data => {
  dispatch({ type: 'LOADING' });
  try {
    const response = await api.post('/auth/user/enable-hr-dashboard', {
      data,
    });
    dispatch({ type: 'ENABLE_HR_DASHBOARD', payload: response.data.user });
  } catch (err) {
    dispatch({ type: 'STOP_LOADING' });
    dispatch({
      type: 'ADD_ERROR',
      payload: err.response?.data?.error || 'Failed to enable HR dashboard',
    });
  }
};

const setInitLoginDone = dispatch => value => {
  dispatch({ type: 'SET_INIT_LOGIN_DONE', payload: value });
};

const acceptTermsAndConditions = dispatch => async privacyAccepted => {
  try {
    const response = await api.post('/auth/user/accept-terms', {
      privacyAccepted,
    });
    if (response.data.error) {
      dispatch({ type: 'ADD_ERROR', payload: response.data.error });
    } else {
      dispatch({ type: 'ADD_API_MESSAGE', payload: response.data });
    }
  } catch (err) {
    dispatch({
      type: 'ADD_ERROR',
      payload: err.response?.data || 'Failed to accept terms',
    });
  }
};

export const { Context, Provider } = createDataContext(
  authReducer,
  {
    fetchUser,
    tryLocalSignin,
    register,
    signin,
    signout,
    forgotPassword,
    resetPassword,
    handleAuthError,
    clearErrorMessage,
    clearApiMessage,
    createUsersDevice,
    setIntroAffiliateCode,
    addAffiliateInfo,
    clearAffiliateInfo,
    addAffiliates,
    clearAffiliates,
    addUsersInfoContent,
    setHRIntent,
    enableHRDashboard,
    setInitLoginDone,
    acceptTermsAndConditions,
  },
  {
    token: null,
    user: null,
    initLoginDone: false,
    errorMessage: '',
    apiMessage: '',
    loading: false,
    usersDevice: null,
    introAffiliateCode: null,
    affiliateInfo: null,
    affiliates: [],
    usersInfoContent: null,
    HRIntent: false,
  }
);
