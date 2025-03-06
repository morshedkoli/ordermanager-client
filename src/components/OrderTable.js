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
      <motion.table className="min-w-full border-collapse bg-white rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <tr>
            <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold tracking-wider">Service</th>
            <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold tracking-wider">Customer</th>
            <th className="hidden lg:table-cell p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold tracking-wider">
              Delivery
            </th>
            <th className="hidden sm:table-cell p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold tracking-wider">Due</th>
            <th className="p-2 sm:p-4 text-left text-xs sm:text-sm font-semibold tracking-wider">Status</th>
            <th className="p-2 sm:p-4 text-center text-xs sm:text-sm font-semibold tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <motion.tr
              key={order._id}
              variants={rowVariants}
              className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
            >
              <td className="p-2 sm:p-3 border-b border-gray-200 text-xs sm:text-sm capitalize">
                {order.serviceName}
              </td>
              <td className="p-2 sm:p-3 border-b border-gray-200 text-xs sm:text-sm capitalize">
                {order.customerName}
              </td>
              <td className="hidden lg:table-cell p-2 sm:p-3 border-b border-gray-200 text-xs sm:text-sm">
                {new Date(order.deliveryDate).toLocaleDateString()}
              </td>
              <td className="hidden sm:table-cell p-2 sm:p-3 border-b border-gray-200 text-xs sm:text-sm">
                {parseInt(order.paidAmount) === parseInt(order.cost) ? (
                  <span className="text-green-600 font-bold">Paid</span>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-red-600 font-bold">${order.cost - order.paidAmount} Due</span>
                    <span className="text-gray-500 text-xs">${order.paidAmount}/${order.cost}</span>
                  </div>
                )}
              </td>
              <td className="p-2 sm:p-3 border-b border-gray-200 text-xs sm:text-sm capitalize">
                {order.status}
              </td>
              <td className="p-2 sm:p-3 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-2 sm:px-3 py-1 sm:py-1.5 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-medium"
                    onClick={() => navigate(`/view-order/${order._id}`)}
                  >
                    View
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStatusChange(order._id, order.status)}
                    className="w-full sm:w-auto px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Next
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default OrderTable;
