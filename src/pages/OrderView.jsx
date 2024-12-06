import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import Font Awesome for icons
import { FaCopy } from "react-icons/fa";

const OrderView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState({
    serviceName: "",
    customerName: "",
    agent: "",
    deliveryDate: "",
    cost: "",
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
    incrementAmount: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://ordermanager-server-production.up.railway.app/orders/${id}`,
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

      // Calculate new paid amount
      const increment = parseFloat(updates.incrementAmount);
      if (isNaN(increment)) {
        toast.error("Please enter a valid number for paid amount increment.");
        return;
      }
      const newPaidAmount = order.paidAmount + increment;

      // Prepare updated data
      const updatedData = {
        username: updates.username || order.username,
        password: updates.password || order.password,
        moreInfo: updates.moreInfo || order.moreInfo,
        paidAmount: newPaidAmount,
      };

      // Send the update request
      await axios.put(
        `https://ordermanager-server-production.up.railway.app/orders/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update state
      setOrder((prev) => ({
        ...prev,
        ...updatedData,
      }));

      // Clear input fields
      setUpdates({
        username: "",
        password: "",
        moreInfo: "",
        incrementAmount: "",
      });

      toast.success("Order updated successfully!");
      navigate("/");
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
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
          Order Details
        </h2>

        {/* Order Information */}
        <div className="space-y-4">
          <p>
            <span className="font-bold">Service Name:</span> {order.serviceName}
          </p>
          <p>
            <span className="font-bold">Customer Name:</span>{" "}
            {order.customerName}
          </p>
          <p>
            <span className="font-bold">Agent:</span> {order.agent}
          </p>
          <p>
            <span className="font-bold">Delivery Date:</span>{" "}
            {new Date(order.deliveryDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-bold">Birth Date:</span>{" "}
            {new Date(order.birthdate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-bold">Status:</span> {order.status}
          </p>
          <p>
            <span className="font-bold">Cost Amount:</span> ${order.cost}
          </p>
          <p>
            <span className="font-bold">Paid Amount:</span> ${order.paidAmount}
          </p>
        </div>

        {/* Editable Fields */}
        <div className="mt-6 space-y-4">
          {/* Username */}
          <div>
            <label className="block font-bold">Username</label>
            {order.username ? (
              <div className="flex items-center gap-2">
                <span className="block p-2 bg-gray-200 rounded-lg">
                  {order.username}
                </span>
                <button
                  onClick={() => handleCopy(order.username)}
                  className="p-2 text-blue-500 rounded hover:text-blue-600"
                  title="Copy Username"
                >
                  <FaCopy size={20} />
                </button>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Enter username"
                value={updates.username}
                onChange={(e) =>
                  setUpdates({ ...updates, username: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block font-bold">Password</label>
            {order.password ? (
              <div className="flex items-center gap-2">
                <span className="block p-2 bg-gray-200 rounded-lg">
                  {order.password}
                </span>
                <button
                  onClick={() => handleCopy(order.password)}
                  className="p-2 text-blue-500 rounded hover:text-blue-600"
                  title="Copy Password"
                >
                  <FaCopy size={20} />
                </button>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Enter password"
                value={updates.password}
                onChange={(e) =>
                  setUpdates({ ...updates, password: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
            )}
          </div>

          {/* More Info */}
          <div>
            <label className="block font-bold">More Info</label>
            <textarea
              placeholder={order.moreInfo || "Enter additional info"}
              value={updates.moreInfo}
              onChange={(e) =>
                setUpdates({ ...updates, moreInfo: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Increment Paid Amount */}
          <div>
            <label className="block font-bold">Increment Paid Amount</label>
            <input
              type="number"
              placeholder="Enter amount to add"
              value={updates.incrementAmount}
              onChange={(e) =>
                setUpdates({ ...updates, incrementAmount: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          className="w-full py-2 mt-6 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-transform transform hover:-translate-y-1"
        >
          Update Order
        </button>
      </div>
    </motion.div>
  );
};

export default OrderView;
