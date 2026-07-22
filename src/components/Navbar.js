import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlaneDeparture,
  FaHome,
  FaTachometerAlt,
  FaSuitcaseRolling,
  FaMapMarkerAlt,
  FaFileAlt,
  FaBell,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle
} from "react-icons/fa";
import API from "../api/api";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (isLoggedIn) {
      loadUnreadCount();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const email = localStorage.getItem("email");

      if (!email) return;

      const res = await API.get(`/notifications/count/${email}`);
      setUnreadCount(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("email");

    setIsLoggedIn(false);

    alert("Logged Out Successfully");

    navigate("/");
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;

    return (
      <Link to={to} className="text-decoration-none position-relative px-2 py-1 mx-1 d-flex align-items-center">
        <motion.div
          whileHover={{ y: -2 }}
          className="d-flex align-items-center gap-1"
          style={{ color: scrolled ? "#1e293b" : "#ffffff", fontWeight: 500, fontSize: "0.92rem" }}
        >
          <Icon size={14} />
          <span>{label}</span>
        </motion.div>
        {isActive && (
          <motion.div
            layoutId="nav-underline"
            className="position-absolute"
            style={{
              bottom: "-4px",
              left: 0,
              right: 0,
              height: "2px",
              background: scrolled ? "#2563eb" : "#ffffff",
              borderRadius: "2px"
            }}
          />
        )}
      </Link>
    );
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="d-flex align-items-center justify-content-between px-3 px-md-4 py-2 sticky-top flex-wrap"
      style={{
        background: scrolled ? "rgba(255,255,255,0.75)" : "linear-gradient(90deg, #2563eb, #1d4ed8)",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        boxShadow: scrolled ? "0 4px 20px rgba(15,23,42,0.08)" : "none",
        transition: "all 0.35s ease",
        zIndex: 1030
      }}
    >
      <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
        <motion.div
          whileHover={{ rotate: -8, scale: 1.1 }}
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: "38px",
            height: "38px",
            background: scrolled ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "rgba(255,255,255,0.2)"
          }}
        >
          <FaPlaneDeparture color="#ffffff" size={16} />
        </motion.div>
        <span
          className="fw-bold"
          style={{
            fontFamily: "'Poppins', sans-serif",
            color: scrolled ? "#1d4ed8" : "#ffffff",
            fontSize: "1.1rem"
          }}
        >
          AirClaim BD
        </span>
      </Link>

      <div className="d-flex align-items-center flex-wrap gap-1">
        <NavItem to="/" icon={FaHome} label="Home" />

        {!isLoggedIn && (
          <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="btn btn-sm rounded-pill mx-1 px-3 d-flex align-items-center gap-1"
                style={{ background: "#22c55e", color: "#fff", border: "none" }}
              >
                <FaSignInAlt size={13} />
                Login
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="btn btn-sm rounded-pill mx-1 px-3 d-flex align-items-center gap-1"
                style={{ background: "#f59e0b", color: "#fff", border: "none" }}
              >
                <FaUserPlus size={13} />
                Sign Up
              </Link>
            </motion.div>
          </>
        )}

        {isLoggedIn && (
          <>
            <NavItem to="/dashboard" icon={FaTachometerAlt} label="Dashboard" />
            <NavItem to="/lost" icon={FaSuitcaseRolling} label="Report Lost" />
            <NavItem to="/found" icon={FaMapMarkerAlt} label="Report Found" />
            <NavItem to="/my-reports" icon={FaFileAlt} label="My Reports" />

            <Link to="/notifications" className="position-relative mx-2 text-decoration-none">
              <motion.div
                whileHover={{ scale: 1.15, rotate: [0, -12, 12, -6, 0] }}
                transition={{ duration: 0.4 }}
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "36px",
                  height: "36px",
                  background: scrolled ? "rgba(37,99,235,0.1)" : "rgba(255,255,255,0.15)"
                }}
              >
                <FaBell color={scrolled ? "#2563eb" : "#ffffff"} size={16} />
              </motion.div>

              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="position-absolute badge rounded-pill"
                    style={{
                      top: "-4px",
                      right: "-4px",
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: "0.65rem"
                    }}
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <div
              className="d-flex align-items-center justify-content-center rounded-circle mx-1"
              style={{
                width: "34px",
                height: "34px",
                background: scrolled ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "rgba(255,255,255,0.2)"
              }}
              title={user?.name || ""}
            >
              {user?.name ? (
                <span className="fw-bold text-white small">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <FaUserCircle color="#ffffff" size={20} />
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-sm rounded-pill mx-1 px-3 d-flex align-items-center gap-1"
              style={{ background: "#1e293b", color: "#fff", border: "none" }}
              onClick={handleLogout}
            >
              <FaSignOutAlt size={13} />
              Logout
            </motion.button>
          </>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;