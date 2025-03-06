import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-lg sm:text-xl font-bold tracking-wider hover:text-blue-200 transition-colors">
            Order Management
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="font-medium text-blue-100">Welcome, {userData?.name}</span>
                <Link to="/" className="hover:text-blue-200 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-blue-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="hover:text-blue-200 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-blue-700"
          >
            <div className="px-4 pt-2 pb-3 space-y-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-blue-100 font-medium border-b border-blue-600">
                    Welcome, {userData?.name}
                  </div>
                  <Link
                    to="/"
                    className="block px-3 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="w-full text-left px-3 py-2 text-red-100 bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
