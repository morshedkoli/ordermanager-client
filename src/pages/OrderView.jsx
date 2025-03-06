import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCopy } from "react-icons/fa";

const OrderView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState({
    serviceName: "",
    customerName: "",
    agent: "",
    deliveryDate: "",
    cost: 0,
    paidAmount: 0,
    username: "",
    password: "",
    moreInfo: "",
    status: "",
    birthdate: "",
  });

  const [updates, setUpdates] = useState({
    username: "",
    password: "",
    moreInfo: "",
    incrementAmount: 0,
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST_LINK}/orders/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        toast.error("Failed to fetch order details.");
      }
    };

    fetchOrder();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const increment = parseFloat(updates.incrementAmount);
      if (isNaN(increment)) {
        toast.error("Please enter a valid number for paid amount increment.");
        return;
      }
      const newPaidAmount = order.paidAmount + increment;

      const updatedData = {
        username: updates.username || order.username,
        password: updates.password || order.password,
        moreInfo: updates.moreInfo || order.moreInfo,
        paidAmount: increment,
      };

      await axios.put(
        `${process.env.REACT_APP_API_HOST_LINK}/orders/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const latestData = {
        username: updates.username || order.username,
        password: updates.password || order.password,
        moreInfo: updates.moreInfo || order.moreInfo,
        paidAmount: newPaidAmount,
      };

      setOrder((prev) => ({
        ...prev,
        ...latestData,
      }));

      setUpdates({
        username: "",
        password: "",
        moreInfo: "",
        incrementAmount: 0,
      });

      toast.success("Order updated successfully!");
      navigate(`/view-order/${id}`);
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error("Failed to update the order.");
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };
  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `${process.env.REACT_APP_API_HOST_LINK}/orders/${id}/status`,
        { status: "cancelled" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Order has been cancelled");
      navigate("/");
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error("Failed to cancel the order.");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-2 sm:p-4"
    >
      <ToastContainer />
      <div className="p-4 sm:p-8 bg-white rounded-lg shadow-lg w-full max-w-4xl relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Order Details
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-transform transform hover:-translate-y-1"
            >
              Back
            </button>
            {order.status !== "cancelled" && order.status !== "delivered" && (
              <button
                onClick={handleCancel}
                className="px-3 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-transform transform hover:-translate-y-1"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Service Name</label>
            <span className="block p-3 bg-gray-200 rounded-lg capitalize">{order.serviceName}</span>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Customer Name</label>
            <span className="block p-3 bg-gray-200 rounded-lg capitalize">{order.customerName}</span>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Agent</label>
            <span className="block p-3 bg-gray-200 rounded-lg capitalize">{order.agent}</span>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Delivery Date</label>
            <span className="block p-3 bg-gray-200 rounded-lg">
              {new Date(order.deliveryDate).toLocaleDateString()}
            </span>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Birth Date</label>
            <span className="block p-3 bg-gray-200 rounded-lg">
              {new Date(order.birthdate).toLocaleDateString()}
            </span>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Status</label>
            <span className="block p-3 bg-gray-200 rounded-lg capitalize">{order.status}</span>
          </div>
        </div>

        {order.moreInfo && (
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">More Info</label>
            <span className="block p-3 bg-gray-200 rounded-lg whitespace-pre-wrap">{order.moreInfo}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Cost Amount</label>
            <span className="block p-3 bg-gray-200 rounded-lg">${order.cost}</span>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Paid Amount</label>
            <span className="block p-3 bg-gray-200 rounded-lg">${order.paidAmount}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Username</label>
            <div className="flex items-center gap-2">
              <span className="block flex-1 p-3 bg-gray-200 rounded-lg overflow-x-auto">{order.username}</span>
              <button
                onClick={() => handleCopy(order.username)}
                className="p-3 text-blue-500 rounded hover:text-blue-600"
                title="Copy Username"
              >
                <FaCopy size={20} />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <div className="flex items-center gap-2">
              <span className="block flex-1 p-3 bg-gray-200 rounded-lg overflow-x-auto">{order.password}</span>
              <button
                onClick={() => handleCopy(order.password)}
                className="p-3 text-blue-500 rounded hover:text-blue-600"
                title="Copy Password"
              >
                <FaCopy size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">More Info</label>
            <textarea
              placeholder={order.moreInfo || "Enter additional info"}
              value={updates.moreInfo}
              onChange={(e) => setUpdates({ ...updates, moreInfo: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Increment Paid Amount</label>
            <input
              type="number"
              placeholder="Enter amount to add"
              value={updates.incrementAmount}
              onChange={(e) => setUpdates({ ...updates, incrementAmount: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <motion.button
          onClick={handleUpdate}
          className="w-full py-3 mt-6 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Update Order
        </motion.button>
      </div>
    </motion.div>
  );
};

export default OrderView;
