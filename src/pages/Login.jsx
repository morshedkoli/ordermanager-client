import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import config from "../config"; // Adjust the path if needed

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in (authToken exists in localStorage)
    if (localStorage.getItem("authToken")) {
      navigate("/"); // Redirect to dashboard if logged in
    }

    // Load stored email and password if Remember Me was checked
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.apiUrl}/auth/login`, {
        email,
        password,
      });

      // Save the token in localStorage
      localStorage.setItem("authToken", response.data.token);

      // Optionally, store the user data (if returned from the server)
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Handle Remember Me functionality
      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("savedPassword", password);
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }

      login(response.data); // Update context or global state with user data

      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <motion.form
        className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-6 text-3xl font-semibold text-center text-gray-800">
          Login
        </h2>
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

        {/* Email Input */}
        <motion.input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        />

        {/* Password Input */}
        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        />

        {/* Remember Me Checkbox */}
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 text-sm text-gray-600 cursor-pointer"
          >
            Remember Me
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          className="w-full py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300"
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>

        {/* Registration Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline hover:text-indigo-800"
          >
            Register here
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
