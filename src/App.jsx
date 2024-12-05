import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // AuthContext provider
import Login from "./pages/Login"; // Your Login page
import Dashboard from "./pages/Dashboard"; // Your Dashboard page
import ProtectedRoute from "./components/ProtectedRoute"; // The ProtectedRoute component
import OrderForm from "./pages/OrderForm";
import Navbar from "./components/Navbar";
import OrderView from "./pages/OrderView";
import Register from "./pages/Register";

function App() {
  document.title = "Order Management Portal"; // Set the page title here

  return (
    <AuthProvider>
      <Router>
        <Navbar /> {/* Add Navbar here */}
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-order"
              element={
                <ProtectedRoute>
                  <OrderForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/view-order/:id"
              element={
                <ProtectedRoute>
                  <OrderView />
                </ProtectedRoute>
              }
            />

            {/* Add other routes here */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
