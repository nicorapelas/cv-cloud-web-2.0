import createDataContext from './createDataContext';
import api from '../api/api';

// Reducer
const ShareCVContext = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'ADD_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERRORS':
      return { ...state, error: null };
    case 'CREATE':
      return { ...state, shareCV: action.payload, loading: false };
    case 'SET_CV_TEMPLATE_SELECTED':
      return { ...state, cvTemplateSelected: action.payload };
    case 'FETCH_SHARE_CV':
      return { ...state, shareCV: action.payload, loading: false };
    case 'FETCH_SHARE_CV_TO_VIEW':
      return { ...state, shareCV_ToView: action.payload, loading: false };
    default:
      return state;
  }
};

// Actions
const createShareCV = dispatch => async formValues => {
  dispatch({ type: 'LOADING' });
  try {
    const response = await api.post('/api/share-cv', formValues);
    if (response.data.error) {
      dispatch({ type: 'ADD_ERROR', payload: response.data.error });
      return;
    }
    dispatch({ type: 'CREATE', payload: response.data });
    return response.data;
  } catch (error) {
    console.error('Error creating share CV:', error);
    dispatch({
      type: 'ADD_ERROR',
      payload: error.response?.data?.error || 'Failed to share CV',
    });
    throw error;
  }
};

const addError = dispatch => error => {
  dispatch({ type: 'ADD_ERROR', payload: error });
};

const clearShareCVErrors = dispatch => () => {
  dispatch({ type: 'CLEAR_ERRORS' });
  return;
};

const setCVTemplateSelected = dispatch => data => {
  dispatch({ type: 'SET_CV_TEMPLATE_SELECTED', payload: data });
};

const fetchShareCV = dispatch => async id => {
  dispatch({ type: 'LOADING' });
  try {
    const response = await api.get(`/api/share-cv/${id}`);
    dispatch({ type: 'FETCH_SHARE_CV', payload: response.data });
  } catch (error) {
    dispatch({
      type: 'ADD_ERROR',
      payload: error.response?.data?.error || 'Failed to fetch share CV',
    });
  }
};

const fetchShareCVByCurriculumVitaeId = dispatch => async curriculumVitaeId => {
  dispatch({ type: 'LOADING' });
  try {
    const response = await api.get(`/api/share-cv/by-cv-id/${curriculumVitaeId}`);
    dispatch({ type: 'FETCH_SHARE_CV', payload: response.data });
  } catch (error) {
    dispatch({
      type: 'ADD_ERROR',
      payload: error.response?.data?.error || 'Failed to fetch share CV',
    });
  }
};

const fetchShareCV_ToView = dispatch => async id => {
  dispatch({ type: 'LOADING' });
  try {
    const response = await api.post('/api/curriculum-vitae/view', { id });
    dispatch({ type: 'FETCH_SHARE_CV_TO_VIEW', payload: response.data });
  } catch (error) {
    dispatch({
      type: 'ADD_ERROR',
      payload: error.response?.data?.error || 'Failed to fetch share CV',
    });
  }
};

export const { Context, Provider } = createDataContext(
  ShareCVContext,
  {
    createShareCV,
    clearShareCVErrors,
    addError,
    setCVTemplateSelected,
    fetchShareCV,
    fetchShareCVByCurriculumVitaeId,
    fetchShareCV_ToView,
  },
  // Initial state
  {
    shareCV: null,
    error: null,
    loading: null,
    cvTemplateSelected: 'template01',
    shareCV_ToView: null,
  }
);
