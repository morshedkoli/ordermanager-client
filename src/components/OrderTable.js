import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const tableVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const OrderTable = ({ orders, handleStatusChange, statusSteps }) => {
  const navigate = useNavigate(); // Initialize the navigate hook

  return (
    <motion.div
      className="overflow-x-auto shadow-lg rounded-lg border border-gray-300"
      initial="hidden"
      animate="visible"
      variants={tableVariants}
    >
      <motion.table className="w-full border-collapse bg-white rounded-lg">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-3 text-left">Service Name</th>
            <th className="p-3 text-left">Customer Name</th>
            <th className="p-3 text-left sm:table-cell hidden">
              Delivery Date
            </th>
            <th className="p-3 text-left sm:table-cell hidden">Due</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <motion.tr
              key={order._id}
              variants={rowVariants}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100`}
            >
              <td className="p-3 border-b border-gray-200 capitalize">
                {order.serviceName}
              </td>
              <td className="p-3 border-b border-gray-200 capitalize">
                {order.customerName}
              </td>
              <td className="p-3 border-b border-gray-200 sm:table-cell hidden">
                {new Date(order.deliveryDate).toLocaleDateString()}
              </td>
              <td className="p-3 border-b border-gray-200 sm:table-cell hidden">
                {parseInt(order.paidAmount) === parseInt(order.cost) ? (
                  <span className="text-green-600 font-bold">Fully Paid</span>
                ) : (
                  order.cost - order.paidAmount
                )}
              </td>
              <td className="p-3 border-b border-gray-200 capitalize">
                {order.status}
              </td>
              <td className="p-3 border-b border-gray-200 text-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block sm:inline px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                  onClick={() => navigate(`/view-order/${order._id}`)} // Using navigate here
                >
                  View
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStatusChange(order._id, order.status)}
                  className="px-4 py-2 text-sm font-bold text-white bg-green-500 rounded hover:bg-green-600"
                >
                  Next Status
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default OrderTable;
