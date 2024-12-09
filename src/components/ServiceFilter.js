import React from "react";
import { motion } from "framer-motion";

const ServiceFilter = ({ serviceNames, handleServiceNameFilter }) => (
  <div className="flex flex-wrap gap-3 mt-6">
    {serviceNames.map((serviceName) => (
      <motion.button
        key={serviceName}
        onClick={() => handleServiceNameFilter(serviceName)}
        whileHover={{
          scale: 1.1,
          backgroundColor: "#4F46E5",
          color: "#FFF",
        }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 font-semibold shadow-md transition-all hover:bg-blue-500 hover:text-white"
      >
        {serviceName.toUpperCase()}
      </motion.button>
    ))}
    <motion.button
      onClick={() => handleServiceNameFilter("")}
      whileHover={{
        scale: 1.1,
        backgroundColor: "#4F46E5",
        color: "#FFF",
      }}
      whileTap={{ scale: 0.95 }}
      className="px-4 py-2 rounded-lg bg-gray-400 text-gray-800 font-semibold shadow-md transition-all hover:bg-blue-500 hover:text-white"
    >
      All Services
    </motion.button>
  </div>
);

export default ServiceFilter;
