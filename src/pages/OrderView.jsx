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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300"
    >
      <ToastContainer />
      <div className="p-8 bg-white rounded-lg capitalize shadow-lg w-full max-w-4xl relative">
        {/* Back Button at Top Right */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 p-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-transform transform hover:-translate-y-1"
        >
          Back
        </button>

        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Order Details
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Service Name
              </label>
              <span className="block p-3 bg-gray-200 rounded-lg">
                {order.serviceName}
              </span>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Customer Name
              </label>
              <span className="block p-3 bg-gray-200 rounded-lg">
                {order.customerName}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Agent
              </label>
              <span className="block p-3 bg-gray-200 rounded-lg">
                {order.agent}
              </span>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Delivery Date
              </label>
              <span className="block p-3 bg-gray-200 rounded-lg">
                {new Date(order.deliveryDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Birth Date
              </label>
              <span className="block p-3 bg-gray-200 rounded-lg">
                {new Date(order.birthdate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Status
              </label>
              <span className="block p-3 bg-gray-200 rounded-lg">
                {order.status}
              </span>
            </div>
          </div>
          {order.moreInfo && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                More Info
              </label>
              <span className="block p-3 bg-gray-200 rounded-lg">
                {order.moreInfo}
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Cost Amount
              </label>
              <span className="block p-3 bg-gray-200 rounded-lg">
                ${order.cost}
              </span>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Paid Amount
              </label>
              <span className="block p-3 bg-gray-200 rounded-lg">
                ${order.paidAmount}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-700 font-semibold">
              Username
            </label>
            <div className="flex items-center gap-2">
              <span className="block p-3 bg-gray-200 rounded-lg">
                {order.username}
              </span>
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
            <label className="block text-gray-700 font-semibold">
              Password
            </label>
            <div className="flex items-center gap-2">
              <span className="block p-3 bg-gray-200 rounded-lg">
                {order.password}
              </span>
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

        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold">
              More Info
            </label>
            <textarea
              placeholder={order.moreInfo || "Enter additional info"}
              value={updates.moreInfo}
              onChange={(e) =>
                setUpdates({ ...updates, moreInfo: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Increment Paid Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount to add"
              value={updates.incrementAmount}
              onChange={(e) =>
                setUpdates({ ...updates, incrementAmount: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="w-full py-3 mt-8 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-transform transform hover:-translate-y-1"
        >
          Update Order
        </button>
      </div>
    </motion.div>
  );
};

export default OrderView;
