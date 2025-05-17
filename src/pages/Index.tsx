
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect the old Index page to our new LandingPage
  return <Navigate to="/" replace />;
};

export default Index;
