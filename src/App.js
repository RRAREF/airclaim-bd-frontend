import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ReportLost from "./components/ReportLost";
import ReportFound from "./components/ReportFound";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import MyReports from "./components/MyReports";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("user") !== null
  );

  return (
    <BrowserRouter>

      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn
              ? <Dashboard />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        {/* Report Lost */}
        <Route
          path="/lost"
          element={
            isLoggedIn
              ? <ReportLost />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        {/* Report Found */}
        <Route
          path="/found"
          element={
            isLoggedIn
              ? <ReportFound />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        {/* My Reports */}
        <Route
          path="/my-reports"
          element={
            isLoggedIn
              ? <MyReports />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;