import createDataContext from './createDataContext';
import api from '../api/api';

// Reducer
const SaveCVContext = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'SET_CV_TO_SAVE':
      return { ...state, cvToSave: action.payload };
    case 'FETCH_SAVED_CVS':
      return { ...state, savedCVs: action.payload, loading: false };
    default:
      return state;
  }
};

// Actions
const setCVToSave = dispatch => data => {
  dispatch({ type: 'SET_CV_TO_SAVE', payload: data });
};

const fetchSavedCVs = dispatch => async () => {
  dispatch({ type: 'LOADING' });
  const response = await api.get('/hr/saved-cv/saved-cvs');
  console.log('response from fetchSavedCVs', response);
  dispatch({ type: 'FETCH_SAVED_CVS', payload: response.data });
};

export const { Context, Provider } = createDataContext(
  SaveCVContext,
  {
    setCVToSave,
    fetchSavedCVs,
  },
  // Initial state
  {
    loading: false,
    cvToSave: null,
    savedCVs: [],
  }
);
