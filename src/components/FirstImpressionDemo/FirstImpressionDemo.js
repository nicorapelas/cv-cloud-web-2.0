import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './FirstImpressionDemo.css';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const deriveCloudinaryMp4 = (url) => {
  if (!url || typeof url !== 'string') return null;
  if (!url.includes('res.cloudinary.com') || !url.includes('/video/upload/')) {
    return null;
  }

  // Prefer Cloudinary format transform for maximum compatibility
  // Example:
  // https://res.cloudinary.com/<cloud>/video/upload/<version>/<path>.mov
  // -> https://res.cloudinary.com/<cloud>/video/upload/f_mp4/<version>/<path>.mov
  if (url.includes('/video/upload/f_mp4/')) return url;

  return url.replace('/video/upload/', '/video/upload/f_mp4/');
};

const FirstImpressionDemo = () => {
  const query = useQuery();
  const src = query.get('src');

  // URLSearchParams already decodes percent-encoding; decoding again can break valid URLs.
  const demoUrl = src || null;
  const demoMp4Url = React.useMemo(() => deriveCloudinaryMp4(demoUrl), [demoUrl]);

  return (
    <div className="fi-demo-page">
      <div className="fi-demo-card">
        <div className="fi-demo-header">
          <img src="/logo-h79.png" alt="CV Cloud" className="fi-demo-logo" />
          <div>
            <h1 className="fi-demo-title">First Impression — Sample Video</h1>
            <p className="fi-demo-subtitle">
              Watch a 30-second candidate introduction.
            </p>
          </div>
        </div>

        {!demoUrl ? (
          <div className="fi-demo-error">
            <h2>Demo link not available</h2>
            <p>
              This link is missing the video source. Please return to the email
              and click the button again.
            </p>
          </div>
        ) : (
          <>
            <div className="fi-demo-video-wrap">
              <video className="fi-demo-video" controls playsInline>
                {demoMp4Url ? (
                  <source src={demoMp4Url} type="video/mp4" />
                ) : null}
                <source src={demoUrl} type="video/quicktime" />
                <source src={demoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="fi-demo-actions">
              {/* <a
                className="fi-demo-btn fi-demo-btn-primary"
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open video in new tab
              </a> */}
              <Link className="fi-demo-btn fi-demo-btn-secondary" to="/hr-introduction">
                Learn more for HR
              </Link>
            </div>

            <p className="fi-demo-footnote">
              If the video doesn’t play in your browser, use “Open video in new
              tab”.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FirstImpressionDemo;

