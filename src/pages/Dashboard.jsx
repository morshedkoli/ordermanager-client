import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion"; // Import framer-motion for animation
import "react-toastify/dist/ReactToastify.css";
import Statistics from "../components/Statistics";
import SearchBar from "../components/SearchBar";
import ServiceFilter from "../components/ServiceFilter";
import StatusFilter from "../components/StatusFilter"; // Import the new StatusFilter component
import OrderTable from "../components/OrderTable";
import Pagination from "../components/Pagination";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [serviceNameFilter, setServiceNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceNames, setServiceNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;
  const navigate = useNavigate();

  const statusSteps = [
    "agreement",
    "pending",
    "application done",
    "in progress",
    "done",
    "delivered",
  ];

  // Use useCallback to memoize fetchOrders so that it's not recreated on every render
  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST_LINK}/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let filteredOrders = response.data;

      // Apply search query filter
      if (searchQuery) {
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.serviceName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            order.customerName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            order.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply service name filter
      if (serviceNameFilter) {
        filteredOrders = filteredOrders.filter(
          (order) => order.serviceName === serviceNameFilter
        );
      }

      // Apply status filter
      if (statusFilter) {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === statusFilter
        );
      }

      setOrders(filteredOrders);
      setServiceNames([
        ...new Set(response.data.map((order) => order.serviceName)),
      ]);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  }, [searchQuery, serviceNameFilter, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, currentPage]);

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
        `${process.env.REACT_APP_API_HOST_LINK}/orders/${orderId}/status`,
        { status: nextStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Order status updated to "${nextStatus}"`);
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const handleSearch = () => {
    fetchOrders(); // Trigger fetch orders based on the search query
  };

  const handleServiceNameFilter = (serviceName) => {
    setServiceNameFilter(serviceName); // Update filter
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status); // Update the status filter
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <Statistics orders={orders} statusSteps={statusSteps} />

      {/* Animated Create Order button */}
      <motion.button
        onClick={() => navigate("/create-order")}
        className="btn bg-green-500 text-white py-2 px-4 rounded-lg shadow-md transform transition-all duration-300 ease-in-out hover:bg-green-600 hover:scale-105"
        whileHover={{ scale: 1.05 }} // Scale up on hover using framer-motion
        whileTap={{ scale: 0.95 }} // Scale down when clicked
      >
        Create Order
      </motion.button>

      {/* Search Bar Component */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* Filters */}
      <ServiceFilter
        serviceNames={serviceNames}
        handleServiceNameFilter={handleServiceNameFilter}
      />
      <StatusFilter
        statusSteps={statusSteps}
        handleStatusFilter={handleStatusFilter} // Pass the filter handler to the new component
      />

      {/* Order Table */}
      <OrderTable
        orders={currentOrders}
        handleStatusChange={handleStatusChange}
        statusSteps={statusSteps}
      />

      {/* Pagination */}
      <Pagination
        totalOrders={orders.length}
        ordersPerPage={ordersPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Dashboard;
