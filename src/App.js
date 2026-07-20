import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ReportLost from "./components/ReportLost";
import ReportFound from "./components/ReportFound";
import MyReports from "./components/MyReports";
import Notifications from "./components/Notifications";

import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminUsers from "./components/AdminUsers";
import AdminLostReports from "./components/AdminLostReports";
import AdminFoundReports from "./components/AdminFoundReports";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("user") !== null
  );

  const isAdminLoggedIn =
    localStorage.getItem("admin") !== null;

  return (

    <BrowserRouter>

      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <Routes>

        {/* ================= Home ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ================= User Authentication ================= */}

        <Route
          path="/login"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* ================= User Dashboard ================= */}

        <Route
          path="/dashboard"
          element={
            isLoggedIn
              ? <Dashboard />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        <Route
          path="/lost"
          element={
            isLoggedIn
              ? <ReportLost />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        <Route
          path="/found"
          element={
            isLoggedIn
              ? <ReportFound />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        <Route
          path="/my-reports"
          element={
            isLoggedIn
              ? <MyReports />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        <Route
          path="/notifications"
          element={
            isLoggedIn
              ? <Notifications />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        {/* ================= Admin ================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin-dashboard"
          element={
            isAdminLoggedIn
              ? <AdminDashboard />
              : <AdminLogin />
          }
        />

        <Route
          path="/admin/users"
          element={
            isAdminLoggedIn
              ? <AdminUsers />
              : <AdminLogin />
          }
        />

        <Route
          path="/admin/lost-reports"
          element={
            isAdminLoggedIn
              ? <AdminLostReports />
              : <AdminLogin />
          }
        />

        <Route
          path="/admin/found-items"
          element={
            isAdminLoggedIn
              ? <AdminFoundReports />
              : <AdminLogin />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;