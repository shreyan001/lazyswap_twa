// components/Loader.js
import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="loader border-8 border-t-8 border-gray-200 border-t-black rounded-full w-12 h-12 animate-spin"></div>
    </div>
  );
};

export default Loader;
