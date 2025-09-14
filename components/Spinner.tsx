
import React from 'react';

interface SpinnerProps {
  message: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/50 rounded-lg">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
      <p className="text-lg font-semibold text-indigo-700">{message}</p>
    </div>
  );
};

export default Spinner;
