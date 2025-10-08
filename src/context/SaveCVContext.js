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
    case 'FETCH_SAVED_CV_TO_VIEW':
      return { 
        ...state, 
        savedCV_ToView: action.payload.curriculumVitae,
        cvTemplateSelected: action.payload.cvTemplate,
        savedCVInfo: action.payload.savedCVInfo,
        loading: false 
      };
    case 'UPDATE_SAVED_CV_NOTES':
      return { 
        ...state, 
        savedCVInfo: { ...state.savedCVInfo, notes: action.payload } 
      };
    case 'UPDATE_SAVED_CV_RANK':
      return { 
        ...state, 
        savedCVInfo: { ...state.savedCVInfo, rank: action.payload } 
      };
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
  dispatch({ type: 'FETCH_SAVED_CVS', payload: response.data });
};

const fetchSavedCVToView = dispatch => async (curriculumVitaeID) => {
  dispatch({ type: 'LOADING' });
  const response = await api.get(`/hr/saved-cv/${curriculumVitaeID}`);
  dispatch({ type: 'FETCH_SAVED_CV_TO_VIEW', payload: response.data });
};

const addNoteToSavedCV = dispatch => async (curriculumVitaeID, content) => {
  const response = await api.put(`/hr/saved-cv/${curriculumVitaeID}/notes`, { content });
  dispatch({ type: 'UPDATE_SAVED_CV_NOTES', payload: response.data.notes });
  return response.data;
};

const updateSavedCVRank = dispatch => async (curriculumVitaeID, rank) => {
  const response = await api.put(`/hr/saved-cv/${curriculumVitaeID}/rank`, { rank });
  dispatch({ type: 'UPDATE_SAVED_CV_RANK', payload: response.data.rank });
  return response.data;
};

const deleteNoteFromSavedCV = dispatch => async (curriculumVitaeID, noteId) => {
  const response = await api.delete(`/hr/saved-cv/${curriculumVitaeID}/notes/${noteId}`);
  dispatch({ type: 'UPDATE_SAVED_CV_NOTES', payload: response.data.notes });
  return response.data;
};

export const { Context, Provider } = createDataContext(
  SaveCVContext,
  {
    setCVToSave,
    fetchSavedCVs,
    fetchSavedCVToView,
    addNoteToSavedCV,
    updateSavedCVRank,
    deleteNoteFromSavedCV,
  },
  // Initial state
  {
    loading: false,
    cvToSave: null,
    savedCVs: [],
    savedCV_ToView: null,
    cvTemplateSelected: 'template01',
    savedCVInfo: null,
  }
);
