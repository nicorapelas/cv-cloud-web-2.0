import api from '../api/api';
import createDataContext from './createDataContext';

// Reducer
const AdvertisementReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BANNER_AD_STRIP_SELECTED':
      return { ...state, bannerAdStripSelected: action.payload };
    case 'SET_BANNER_AD_FULL_SELECTED':
      return { ...state, bannerAdFullSelected: action.payload };
    case 'SET_BANNER_AD_FULL_SHOW':
      return { ...state, bannerAdFullShow: action.payload };
    case 'SET_BANNER_AD_STRIP_SHOW':
      return { ...state, bannerAdStripShow: action.payload };
    case 'FETCH_SETTINGS':
      return {
        ...state,
        bannerAdStripShow: action.payload.bannerAdStripShow,
        bannerAdFullShow: action.payload.bannerAdFullShow,
      };
    default:
      return state;
  }
};

// Actions
const setBannerAdStripSelected = dispatch => data => {
  dispatch({ type: 'SET_BANNER_AD_STRIP_SELECTED', payload: data });
};

const setBannerAdFullSelected = dispatch => data => {
  dispatch({ type: 'SET_BANNER_AD_FULL_SELECTED', payload: data });
};

const setBannerAdFullShow = dispatch => data => {
  dispatch({ type: 'SET_BANNER_AD_FULL_SHOW', payload: data });
};

const setBannerAdStripShow = dispatch => data => {
  dispatch({ type: 'SET_BANNER_AD_STRIP_SHOW', payload: data });
};

// Fetch system settings from the server
const fetchSystemSettings = dispatch => async () => {
  try {
    const response = await api.get('/api/system-settings');
    dispatch({ type: 'FETCH_SETTINGS', payload: response.data });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    // Keep default settings on error
  }
};

export const { Provider, Context } = createDataContext(
  AdvertisementReducer,
  {
    setBannerAdStripSelected,
    setBannerAdFullSelected,
    setBannerAdFullShow,
    setBannerAdStripShow,
    fetchSystemSettings,
  },
  {
    bannerAdStripSelected: 'bannerAdStrip1',
    bannerAdFullSelected: 'bannerAdFull1',
    bannerAdFullShow: true,
    bannerAdStripShow: true,
  }
);
