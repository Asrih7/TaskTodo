import React from 'react';

const CustomSplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white z-50">
      <img 
        src="assets/splash.png" 
        alt="Tasks Todo"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default CustomSplashScreen;