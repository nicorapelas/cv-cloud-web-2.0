import React, { useContext } from 'react';
import { Context as AuthContext } from '../../../context/AuthContext';
import { Context as AdvertisementContext } from '../../../context/AdvertisementContext';
import GenericAd from './ads/GenericAd';
import './AdBanner.css';

const AdBanner = () => {
  const {
    state: { user },
  } = useContext(AuthContext);

  const {
    state: { bannerAdStripShow, bannerAdStripSelected },
  } = useContext(AdvertisementContext);

  // Don't show ads if:
  // 1. User is premium tier
  // 2. Context has ads disabled
  if (user?.tier === 'premium') return null;
  if (!bannerAdStripShow) return null;

  // Render selected ad content
  const renderAdContent = () => {
    switch (bannerAdStripSelected) {
      case 'bannerAdStrip1':
      case 'generic':
      default:
        return <GenericAd />;
    }
  };

  return (
    <div className="ad-banner-container">
      <div className="ad-banner-content">{renderAdContent()}</div>
    </div>
  );
};

export default AdBanner;

