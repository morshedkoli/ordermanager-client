import React from "react";
import { motion } from "framer-motion"; // Import framer-motion for animation

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => (
  <div className="mt-4 mb-4 flex flex-wrap items-center gap-4">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)} // This updates the search query state in the parent
      placeholder="Search by customer name, service, agent, or status"
      className="flex-1 p-2 border border-gray-300 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <motion.button
      onClick={handleSearch} // Call handleSearch when the button is clicked
      className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transform transition-all duration-300 ease-in-out hover:bg-blue-600 hover:scale-110 focus:outline-none"
      whileHover={{
        scale: 1.1, // Scale up on hover
        rotate: 5, // Slight rotation on hover
      }}
      whileTap={{ scale: 0.95 }} // Scale down on tap
      transition={{ type: "spring", stiffness: 300, damping: 20 }} // Smooth spring animation
    >
      Search
    </motion.button>
  </div>
);

export default SearchBar;
