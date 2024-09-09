'use client';
import React, { useState, useEffect } from 'react';
import { FaCode, FaRobot, FaDatabase } from 'react-icons/fa';

const SVGShuffle = () => {
  const svgs = [
    <FaCode className="text-6xl text-blue-500" />,
    <FaRobot className="text-6xl text-green-500" />,
    <FaDatabase className="text-6xl text-red-500" />
  ];

  const [currentSvgIndex, setCurrentSvgIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentSvgIndex((prevIndex) => (prevIndex + 1) % svgs.length);
        setIsVisible(true);
      }, 500);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {svgs[currentSvgIndex]}
      </div>
    </div>
  );
};

export default SVGShuffle;
