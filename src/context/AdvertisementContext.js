import React, { useEffect, useContext } from 'react';
import api from '../api/api';
import createDataContext from './createDataContext';
import socketService from '../services/socketService';

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

const { Provider: BaseProvider, Context } = createDataContext(
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

// Custom Provider that adds Socket.IO real-time updates
export const Provider = ({ children }) => {
  return (
    <BaseProvider>
      <AdvertisementSocketListener>{children}</AdvertisementSocketListener>
    </BaseProvider>
  );
};

// Export Context so other components can use it
export { Context };

// Component that listens to Socket.IO events and updates context
const AdvertisementSocketListener = ({ children }) => {
  const { setBannerAdStripShow, setBannerAdFullShow } = useContext(Context);

  useEffect(() => {
    // Handle system settings updates from Socket.IO
    const handleSystemSettingsUpdate = (data) => {
      try {
        // Update banner ad strip show state
        if (typeof data.bannerAdStripShow === 'boolean') {
          setBannerAdStripShow(data.bannerAdStripShow);
        }
        
        // Update banner ad full show state
        if (typeof data.bannerAdFullShow === 'boolean') {
          setBannerAdFullShow(data.bannerAdFullShow);
        }
      } catch (error) {
        console.error('❌ Error handling system settings update in AdvertisementContext:', error);
      }
    };

    // Add Socket.IO event listener
    socketService.addEventListener('system-settings-updated', handleSystemSettingsUpdate);

    // Cleanup on unmount
    return () => {
      socketService.removeEventListener('system-settings-updated', handleSystemSettingsUpdate);
    };
  }, [setBannerAdStripShow, setBannerAdFullShow]);

  return <>{children}</>;
};
