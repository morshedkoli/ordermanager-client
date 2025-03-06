import React from "react";
import { motion } from "framer-motion";

const ServiceFilter = ({ serviceNames, handleServiceNameFilter }) => {
  return (
    <div className="mt-6">
      <label htmlFor="serviceFilter" className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Service
      </label>
      <motion.select
        id="serviceFilter"
        onChange={(e) => handleServiceNameFilter(e.target.value)}
        className="w-full p-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        whileHover={{ scale: 1.01 }}
      >
        <option value="">All Services</option>
        {serviceNames.map((serviceName) => (
          <option key={serviceName} value={serviceName}>
            {serviceName.toUpperCase()}
          </option>
        ))}
      </motion.select>
    </div>
  );
};

export default ServiceFilter;
