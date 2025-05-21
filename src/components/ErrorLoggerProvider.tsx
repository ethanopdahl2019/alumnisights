
import React from 'react';
import ErrorLogger from './ErrorLogger';

export const ErrorLoggerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <ErrorLogger />
    </>
  );
};

export default ErrorLoggerProvider;
