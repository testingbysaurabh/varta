import React from 'react';

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 overflow-hidden">
      <div className="text-center">
        <div className="relative w-full">
          <h1 
            className="text-6xl md:text-8xl font-bold text-white"
            style={{ transform: 'perspective(500px) rotateX(15deg)' }}
          >
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ textShadow: '0 2px 2px rgba(0,0,0,0.2)' }}
            >
              VARTA
            </span>
          </h1>
        </div>
        <div 
          className="relative mt-4"
          style={{ transform: 'perspective(500px) rotateX(15deg)' }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white animate-pulse">
            Coming Soon
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Our new social media experience is under construction.
          </p>
        </div>
        <div className="mt-12 animate-bounce">
          <svg className="w-12 h-12 mx-auto text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </div>
    </div>
  );
};

export default Home;
