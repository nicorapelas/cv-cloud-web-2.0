import React from 'react';

const HRDashboard = () => {
  console.log('HRDashboard component is rendering!');
  return (
    <div className="hr-dashboard">
      <h1>HR Dashboard Test</h1>
      <p>This is a test to see if the HRDashboard component renders.</p>
      <p>Current URL: {window.location.pathname}</p>
    </div>
  );
};

export default HRDashboard;
