import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderForm = () => {
  const [serviceName, setServiceName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [agent, setAgent] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [cost, setCost] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [moreinfo, setMoreInfo] = useState("");
  const [status, setStatus] = useState("agreement");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct orderData with optional username and password
    const orderData = {
      serviceName,
      customerName,
      agent,
      deliveryDate,
      cost,
      paidAmount,
      birthdate,
      moreinfo,
      status,
      ...(username && { username }), // Add username if not empty
      ...(password && { password }), // Add password if not empty
    };

    try {
      const token = localStorage.getItem("authToken");

      await axios.post(
        `https://ordermanager-server-production.up.railway.app/orders`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order created successfully!");
      setServiceName("");
      setCustomerName("");
      setAgent("");
      setDeliveryDate("");
      setCost("");
      setPaidAmount("");
      setUsername("");
      setPassword("");
      setBirthdate("");
      setMoreInfo("");
      setStatus("agreement");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      toast.error("Failed to create order. Please try again.");
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* Toast Container */}
      <ToastContainer />

      <form
        className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-xl sm:p-10"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-700">
          Create Order
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Other fields */}
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Username <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* More Info */}
        {/* Submit Button */}
      </form>
    </div>
  );
};

export default OrderForm;
