import createDataContext from './createDataContext';
import api from '../api/api';

// Reducer
const PublicCVReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'FETCH_STATUS':
      return {
        ...state,
        isListed: action.payload.isListed,
        publicCV: action.payload.publicCV,
        loading: false,
      };
    case 'TOGGLE_SUCCESS':
      return {
        ...state,
        isListed: action.payload.isListed,
        publicCV: action.payload.publicCV,
        loading: false,
      };
    case 'FETCH_BROWSE_CVS':
      return {
        ...state,
        browseCVs: action.payload,
        loading: false,
      };
    case 'SAVE_PUBLIC_CV_SUCCESS':
      return {
        ...state,
        browseCVs: state.browseCVs.map(cv =>
          cv.curriculumVitaeID === action.payload.curriculumVitaeID
            ? { ...cv, isSaved: true }
            : cv
        ),
      };
    case 'ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Actions
const fetchPublicCVStatus = dispatch => async () => {
  try {
    dispatch({ type: 'LOADING' });
    const response = await api.get('/api/public-cv/status');
    dispatch({ type: 'FETCH_STATUS', payload: response.data });
  } catch (error) {
    dispatch({
      type: 'ERROR',
      payload: error.response?.data?.error || 'Failed to fetch CV status',
    });
  }
};

const togglePublicCV = dispatch => async (industries = [], cvTemplate = 'template01') => {
  try {
    dispatch({ type: 'LOADING' });
    const response = await api.post('/api/public-cv/toggle', { industries, cvTemplate });
    dispatch({ type: 'TOGGLE_SUCCESS', payload: response.data });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || 'Failed to toggle CV visibility';
    dispatch({
      type: 'ERROR',
      payload: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

const fetchBrowseCVs = dispatch => async () => {
  try {
    dispatch({ type: 'LOADING' });
    const response = await api.get('/api/public-cv/browse');
    dispatch({ type: 'FETCH_BROWSE_CVS', payload: response.data });
  } catch (error) {
    dispatch({
      type: 'ERROR',
      payload: error.response?.data?.error || 'Failed to fetch public CVs',
    });
  }
};

const savePublicCV = dispatch => async curriculumVitaeID => {
  try {
    const response = await api.post(`/api/public-cv/save/${curriculumVitaeID}`);
    dispatch({
      type: 'SAVE_PUBLIC_CV_SUCCESS',
      payload: { curriculumVitaeID },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to save CV';
    dispatch({
      type: 'ERROR',
      payload: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

const clearError = dispatch => () => {
  dispatch({ type: 'CLEAR_ERROR' });
};

export const { Context, Provider } = createDataContext(
  PublicCVReducer,
  {
    fetchPublicCVStatus,
    togglePublicCV,
    fetchBrowseCVs,
    savePublicCV,
    clearError,
  },
  // Initial state
  {
    loading: false,
    isListed: false,
    publicCV: null,
    browseCVs: [],
    error: null,
  }
);
