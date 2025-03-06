import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Statistics = () => {
  const [orders, setOrders] = useState([]);

  const statusSteps = [
    "agreement",
    "pending",
    "application done",
    "in progress",
    "done",
    "delivered",
  ];

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST_LINK}/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateStatistics = () => {
    const stats = {};
    statusSteps.forEach((status) => {
      stats[status] = orders.filter((order) => order.status === status).length;
    });
    return stats;
  };

  const statistics = calculateStatistics();

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-br from-red-400 to-red-600 text-white shadow hover:from-red-500 hover:to-red-700";
      case "application done":
        return "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow hover:from-orange-500 hover:to-orange-700";
      case "in progress":
        return "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow hover:from-blue-500 hover:to-blue-700";
      case "done":
        return "bg-gradient-to-br from-green-400 to-green-600 text-white shadow hover:from-green-500 hover:to-green-700";
      case "delivered":
        return "bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow hover:from-purple-500 hover:to-purple-700";
      default:
        return "bg-gradient-to-br from-indigo-400 to-indigo-600 text-white shadow hover:from-indigo-500 hover:to-indigo-700";
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 px-2">
      {statusSteps.map((status) => (
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1 * statusSteps.indexOf(status),
          }}
          whileHover={{ scale: 1.02 }}
          className={`p-2 sm:p-3 rounded-lg ${getStatusStyles(status)}`}
        >
          <h3 className="text-xs sm:text-sm font-semibold capitalize truncate">{status}</h3>
          <p className="text-xl sm:text-2xl font-bold mt-1">
            {statistics[status] || 0}
          </p>
          <motion.div
            className="mt-2 h-1 bg-white bg-opacity-30 rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: `${(statistics[status] / (orders.length || 1)) * 100}%`,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Statistics;
