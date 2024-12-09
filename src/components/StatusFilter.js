import React from "react";
import { motion } from "framer-motion";

const StatusFilter = ({ statusSteps, handleStatusFilter }) => {
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {statusSteps.map((status) => (
        <motion.button
          key={status}
          onClick={() => handleStatusFilter(status)}
          whileHover={{
            scale: 1.1,
            backgroundColor: "#4F46E5",
            color: "#FFF",
          }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 font-semibold shadow-md transition-all hover:bg-blue-500 hover:text-white"
        >
          {status.toUpperCase()}
        </motion.button>
      ))}
      <motion.button
        onClick={() => handleStatusFilter("")} // Clear the filter
        whileHover={{
          scale: 1.1,
          backgroundColor: "#4F46E5",
          color: "#FFF",
        }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 rounded-lg bg-gray-400 text-gray-800 font-semibold shadow-md transition-all hover:bg-blue-500 hover:text-white"
      >
        All Statuses
      </motion.button>
    </div>
  );
};

export default StatusFilter;
