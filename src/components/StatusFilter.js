import React from "react";
import { motion } from "framer-motion";

const StatusFilter = ({ statusSteps, handleStatusFilter }) => {
  return (
    <div className="mt-6">
      <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Status
      </label>
      <motion.select
        id="statusFilter"
        onChange={(e) => handleStatusFilter(e.target.value)}
        className="w-full p-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        whileHover={{ scale: 1.01 }}
      >
        <option value="">All Statuses</option>
        {statusSteps.map((status) => (
          <option key={status} value={status}>
            {status.toUpperCase()}
          </option>
        ))}
      </motion.select>
    </div>
  );
};

export default StatusFilter;
