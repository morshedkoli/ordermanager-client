import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import config from "../config"; // Adjust the path if needed
import { BsArrowRightSquareFill } from "react-icons/bs";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceNameFilter, setServiceNameFilter] = useState("");
  const [serviceNames, setServiceNames] = useState([]);
  const navigate = useNavigate();
  const statusSteps = [
    "agreement",
    "pending",
    "application done",
    "in progress",
    "done",
    "delivered",
  ];

  // Fetch Orders
  const fetchOrders = async (
    searchQuery = "",
    statusFilter = "",
    showAllOrders = false,
    serviceNameFilter = ""
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `https://ordermanager-server-production.up.railway.app/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let filteredOrders = response.data
        .filter((order) => {
          // Show all orders if "All Orders" is selected
          if (showAllOrders) return true;

          // Exclude "Delivered" and "Done" by default
          if (
            !statusFilter &&
            (order.status === "delivered" || order.status === "done")
          ) {
            return false;
          }

          // Apply search filter
          return (
            (order.customerName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
              order.serviceName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              order.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
              order.status.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (statusFilter
              ? order.status.toLowerCase() === statusFilter.toLowerCase()
              : true) &&
            (serviceNameFilter
              ? order.serviceName.toLowerCase() ===
                serviceNameFilter.toLowerCase()
              : true)
          );
        })
        // Sort by delivery date in ascending order (earliest first)
        .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));

      setOrders(filteredOrders);

      // Populate unique service names for the filter dropdown
      const uniqueServiceNames = [
        ...new Set(response.data.map((order) => order.serviceName)),
      ];
      setServiceNames(uniqueServiceNames);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleStatusChange = async (orderId, currentStatus) => {
    const currentIndex = statusSteps.indexOf(currentStatus);
    const nextStatus = statusSteps[currentIndex + 1];

    if (!nextStatus) {
      toast.warn("This order is already in the final status.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `${config.apiUrl}/orders/${orderId}/status`,
        { status: nextStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Order status updated to "${nextStatus}"`);
      fetchOrders(searchQuery, "", false, serviceNameFilter);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    fetchOrders(searchQuery, "", false, serviceNameFilter);
  };

  const handleStatusFilter = (status) => {
    fetchOrders(searchQuery, status, false, serviceNameFilter);
  };

  const handleShowAllOrders = () => {
    fetchOrders(searchQuery, "", true, serviceNameFilter);
  };

  const handleServiceNameFilter = (serviceName) => {
    setServiceNameFilter(serviceName);
    fetchOrders(searchQuery, "", false, serviceName);
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/create-order")}
        className="w-full sm:w-auto px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Create Order
      </motion.button>

      {/* Search Input */}
      <div className="mt-4 mb-4 flex flex-wrap items-center gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by customer name, service, agent, or status"
          className="flex-1 p-2 border border-gray-300 rounded shadow-md"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSearch}
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Search
        </motion.button>
      </div>

      {/* Service Name Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {serviceNames.map((serviceName) => (
          <motion.button
            key={serviceName}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleServiceNameFilter(serviceName)}
            className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600"
          >
            {serviceName.toUpperCase()}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleServiceNameFilter("")}
          className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500"
        >
          All Services
        </motion.button>
      </div>

      {/* Status Filter Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {statusSteps.map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleStatusFilter(status)}
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            {status.toUpperCase()}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShowAllOrders}
          className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500"
        >
          All Orders
        </motion.button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <motion.table
          className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border border-gray-300">Service Name</th>
              <th className="p-3 border border-gray-300">Customer Name</th>
              <th className="p-3 border border-gray-300 hidden sm:table-cell">
                Agent
              </th>
              <th className="p-3 border border-gray-300 hidden sm:table-cell">
                Delivery Date
              </th>
              <th className="p-3 border border-gray-300 hidden sm:table-cell">
                Birth Date
              </th>
              <th className="p-3 border border-gray-300 hidden sm:table-cell">
                Cost
              </th>
              <th className="p-3 border border-gray-300">Due</th>
              <th className="p-3 border border-gray-300">Status</th>
              <th className="p-3 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="p-3 border capitalize border-gray-300">
                  {order.serviceName}
                </td>
                <td className="p-3 border capitalize border-gray-300">
                  {order.customerName}
                </td>
                <td className="p-3 border capitalize border-gray-300 hidden sm:table-cell">
                  {order.agent}
                </td>
                <td className="p-3 border border-gray-300 hidden sm:table-cell">
                  {new Date(order.deliveryDate).toLocaleDateString()}
                </td>
                <td className="p-3 border border-gray-300 hidden sm:table-cell">
                  {new Date(order.birthdate).toLocaleDateString()}
                </td>
                <td className="p-3 border border-gray-300 hidden sm:table-cell">
                  {order.cost}
                </td>
                <td className="p-3 border border-gray-300">
                  {order.paidAmount
                    ? "Fully Paid"
                    : order.cost - order.paidAmount}
                </td>
                <td className="p-3 border border-gray-300">{order.status}</td>
                <td className="p-3 border border-gray-300 space-y-2 sm:space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block sm:inline px-2 py-1 capitalize text-white bg-green-500 rounded hover:bg-green-600"
                    onClick={() => handleStatusChange(order._id, order.status)}
                  >
                    {order.status} <BsArrowRightSquareFill />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block sm:inline px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => navigate(`/view-order/${order._id}`)}
                  >
                    View
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
};

export default Dashboard;
