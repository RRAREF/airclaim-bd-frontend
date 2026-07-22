import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  FaChartBar,
  FaSyncAlt,
  FaUsers,
  FaSuitcaseRolling,
  FaMapMarkerAlt,
  FaHome,
  FaCheckCircle,
  FaHourglassHalf
} from "react-icons/fa";
import API from "../api/api";
import LoadingSpinner from "./LoadingSpinner";
import ToastMessage from "./ToastMessage";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" }
  })
};

const QUICK_ACTIONS = [
  { to: "/admin/users", label: "Manage Users", icon: FaUsers, color: "#2563eb" },
  { to: "/admin/lost-reports", label: "Lost Reports", icon: FaSuitcaseRolling, color: "#dc2626" },
  { to: "/admin/found-items", label: "Found Reports", icon: FaMapMarkerAlt, color: "#16a34a" },
  { to: "/", label: "Home", icon: FaHome, color: "#475569" }
];

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalLostReports: 0,
    totalFoundReports: 0,
    matchedReports: 0,
    pendingReports: 0
  });

  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: ""
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const response = await API.get("/dashboard/stats");

      setDashboard(response.data);
    } catch (error) {
      console.error(error);

      setToast({
        show: true,
        type: "danger",
        message: "Failed to load dashboard."
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Dashboard..." />;
  }

  const STAT_CARDS = [
    {
      key: "totalUsers",
      label: "Total Users",
      icon: FaUsers,
      color: "#2563eb"
    },
    {
      key: "totalLostReports",
      label: "Total Lost Reports",
      icon: FaSuitcaseRolling,
      color: "#dc2626"
    },
    {
      key: "totalFoundReports",
      label: "Total Found Reports",
      icon: FaMapMarkerAlt,
      color: "#16a34a"
    },
    {
      key: "matchedReports",
      label: "Matched Reports",
      icon: FaCheckCircle,
      color: "#0284c7"
    },
    {
      key: "pendingReports",
      label: "Pending Reports",
      icon: FaHourglassHalf,
      color: "#d97706"
    }
  ];

  return (
    <div style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 30%)" }}>
      <div className="container py-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4"
        >
          <h2
            className="fw-bold mb-0 d-flex align-items-center"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#1e293b" }}
          >
            <FaChartBar className="me-2" color="#334155" />
            Admin Dashboard
          </h2>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn rounded-pill px-4 d-flex align-items-center gap-2"
            style={{ background: "#1e293b", color: "#ffffff", border: "none" }}
            onClick={loadDashboard}
          >
            <FaSyncAlt size={13} />
            Refresh
          </motion.button>
        </motion.div>

        <div className="row g-3 mb-4">
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <div className="col-6 col-md-3" key={action.to}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={i + 1}
                  whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(15,23,42,0.1)" }}
                >
                  <Link
                    to={action.to}
                    className="d-flex flex-column align-items-center justify-content-center text-decoration-none rounded-4 p-3"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      minHeight: "100px",
                      boxShadow: "0 2px 10px rgba(15,23,42,0.05)"
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle mb-2"
                      style={{ width: "40px", height: "40px", background: `${action.color}1a` }}
                    >
                      <Icon size={17} color={action.color} />
                    </div>
                    <span className="fw-semibold text-center small" style={{ color: "#334155" }}>
                      {action.label}
                    </span>
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </div>

        <div className="row g-3">
          {STAT_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <div className="col-md-4" key={card.key}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={i + 5}
                  whileHover={{ y: -4, boxShadow: "0 14px 30px rgba(15,23,42,0.1)" }}
                  className="card h-100 border-0 rounded-4 p-4"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 10px rgba(15,23,42,0.05)"
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{ width: "48px", height: "48px", background: `${card.color}1a` }}
                    >
                      <Icon size={20} color={card.color} />
                    </div>
                    <div>
                      <p className="mb-1 text-secondary small text-uppercase" style={{ letterSpacing: "0.5px" }}>
                        {card.label}
                      </p>
                      <h2 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
                        <CountUp end={dashboard[card.key] || 0} duration={1.5} />
                      </h2>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <ToastMessage
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() =>
          setToast({
            ...toast,
            show: false
          })
        }
      />
    </div>
  );
}

export default AdminDashboard;