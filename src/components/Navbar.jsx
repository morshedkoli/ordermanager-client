import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if authToken exists in localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user)); // You might want to decode the token to extract user details
    }
  }, []);
  return (
    <nav className="flex items-center justify-between p-4 bg-blue-500 text-white">
      <Link to="/" className="text-xl font-bold">
        Order Management by Murshed
      </Link>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="font-medium">Welcome, {userData.name} </span>{" "}
            {/* Display full name */}
            <Link to="/" className="hover:underline">
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
