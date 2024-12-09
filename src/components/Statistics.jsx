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
        return "bg-red-500 text-white";
      case "application done":
        return "bg-orange-400 text-white";
      case "in progress":
        return "bg-gradient-to-r from-red-400 to-green-400 text-white";
      case "done":
        return "bg-green-500 text-white";
      case "delivered":
        return "bg-white text-black border border-gray-300";
      default:
        return "bg-blue-200 text-black";
    }
  };

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
      {statusSteps.map((status) => (
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1 * statusSteps.indexOf(status),
          }}
          whileHover={{ scale: 1.05 }}
          className={`p-6 rounded-lg shadow-xl ${getStatusStyles(status)}`}
        >
          <h3 className="text-xl font-bold capitalize">{status}</h3>
          <p className="text-4xl font-extrabold mt-2">
            {statistics[status] || 0}
          </p>
          <motion.div
            className="mt-4 h-2 bg-opacity-30 rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: `${(statistics[status] / (orders.length || 1)) * 100}%`,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ backgroundColor: "white" }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Statistics;
