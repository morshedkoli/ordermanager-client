import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderForm = () => {
  const [serviceName, setServiceName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [agent, setAgent] = useState("  ");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [cost, setCost] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [username, setUsername] = useState("  ");
  const [password, setPassword] = useState("  ");
  const [birthdate, setBirthdate] = useState("");
  const [moreinfo, setMoreInfo] = useState("  ");
  const [status, setStatus] = useState("agreement");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      serviceName,
      customerName,
      agent,
      deliveryDate,
      cost,
      paidAmount,
      username,
      password,
      birthdate,
      moreinfo,
      status,
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
          {/* Service Name */}
          <div>
            <label
              htmlFor="serviceName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Service Name
            </label>
            <select
              id="serviceName"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select One</option>
              <option value="new Nid">New NID</option>
              <option value="nid Correction">NID Correction</option>
              <option value="new Passport">New Passport</option>
              <option value="passport Correction">Passport Correction</option>
              <option value="birth Certificate">Birth Certificate</option>
            </select>
          </div>

          {/* Customer Name */}
          <div>
            <label
              htmlFor="customerName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Customer Name
            </label>
            <input
              type="text"
              id="customerName"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Agent */}
          <div>
            <label
              htmlFor="agent"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Agent
            </label>
            <input
              type="text"
              id="agent"
              placeholder="Enter agent name"
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Delivery Date */}
          <div>
            <label
              htmlFor="deliveryDate"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Delivery Date
            </label>
            <input
              type="date"
              id="deliveryDate"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cost */}
          <div>
            <label
              htmlFor="cost"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Cost
            </label>
            <input
              type="number"
              id="cost"
              placeholder="Enter cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Paid Amount */}
          <div>
            <label
              htmlFor="paidAmount"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Paid Amount
            </label>
            <input
              type="number"
              id="paidAmount"
              placeholder="Enter paid amount"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Username
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
              Password
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

          {/* Birthdate */}
          <div>
            <label
              htmlFor="birthdate"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Birthdate
            </label>
            <input
              type="date"
              id="birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="agreement">Agreement</option>
              <option value="pending">Pending</option>
              <option value="application done">Application Done</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* More Info */}
        <div className="mt-4">
          <label
            htmlFor="moreinfo"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Additional Info
          </label>
          <textarea
            id="moreinfo"
            placeholder="Enter additional information"
            value={moreinfo}
            onChange={(e) => setMoreInfo(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-transform duration-300 transform hover:-translate-y-1"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
