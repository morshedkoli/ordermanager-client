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
    "cancelled"
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
      let filteredOrders = response.data.filter(order => order.status !== 'delivered' && order.status !== 'cancelled' && parseInt(order.paidAmount) < parseInt(order.cost));
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
    <div className="p-2 sm:p-4 md:p-8 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">Dashboard Overview</h1>
        <Statistics orders={orders} statusSteps={statusSteps} />
      </div>

      <div className="flex flex-col gap-4 px-2 mb-6 sm:mb-8">
        <motion.button
          onClick={() => navigate("/create-order")}
          className="w-full sm:w-auto btn bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:from-green-600 hover:to-emerald-700 hover:shadow-xl font-semibold text-sm sm:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Create New Order
        </motion.button>

        <div className="w-full">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 px-2 mb-6">
        <div className="w-full">
          <ServiceFilter
            serviceNames={serviceNames}
            handleServiceNameFilter={handleServiceNameFilter}
          />
        </div>
        <div className="w-full">
          <StatusFilter
            statusSteps={statusSteps}
            handleStatusFilter={handleStatusFilter}
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow mx-2">
        <OrderTable
          orders={currentOrders}
          handleStatusChange={handleStatusChange}
          statusSteps={statusSteps}
        />
      </div>

      <div className="mt-4 sm:mt-6 px-2">
        <Pagination
          totalOrders={orders.length}
          ordersPerPage={ordersPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Dashboard;
