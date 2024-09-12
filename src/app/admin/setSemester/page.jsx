'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

const SemesterSelection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [currentSemester, setCurrentSemester] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (semester) => {
    setSelectedSemester(semester);
    setIsOpen(false);
  };

  const handleSet = () => {
    if (selectedSemester) {
      setShowConfirmation(true);
    }
  };

  const confirmSet = () => {
    setCurrentSemester(selectedSemester);
    setShowConfirmation(false);
  };

  const cancelSet = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Semester Selection</h1>
        
        {currentSemester && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gray-100 rounded-md text-center"
          >
            <p className="text-lg font-semibold">Current Semester: <span className="text-blue-600">{currentSemester}</span></p>
          </motion.div>
        )}

        <div className="relative mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleDropdown}
            className="w-full p-4 text-left bg-gray-100 rounded-lg shadow-md flex justify-between items-center"
          >
            <span className="text-gray-700">{selectedSemester || 'Select Semester'}</span>
            <FaChevronDown className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
          </motion.button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg"
              >
                {['Even', 'Odd'].map((semester) => (
                  <motion.li
                    key={semester}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    onClick={() => handleSelect(semester)}
                    className="p-4 cursor-pointer text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {semester}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSet}
          className="w-full p-4 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
        >
          Set
        </motion.button>

        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[11]"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-lg p-6 w-full max-w-sm"
              >
                <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                <p className="mb-6">Do you want to set the semester to {selectedSemester}?</p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelSet}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmSet}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                  >
                    Confirm
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SemesterSelection;