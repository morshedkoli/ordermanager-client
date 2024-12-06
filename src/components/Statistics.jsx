import React from "react";

const Statistics = ({ orders, statusSteps }) => {
  // Calculate statistics based on statuses
  const calculateStatistics = () => {
    const stats = {};
    statusSteps.forEach((status) => {
      stats[status] = orders.filter((order) => order.status === status).length;
    });
    return stats;
  };

  const statistics = calculateStatistics();

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statusSteps.map((status) => (
        <div
          key={status}
          className="p-4 bg-blue-100 border border-blue-300 rounded shadow-md"
        >
          <h3 className="text-lg font-bold capitalize text-blue-700">
            {status}
          </h3>
          <p className="text-2xl font-semibold">{statistics[status] || 0}</p>
        </div>
      ))}
    </div>
  );
};

export default Statistics;
