import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  FaSuitcaseRolling,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaUserCircle
} from "react-icons/fa";
import API from "../api/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
  })
};

const STAT_CARDS = [
  {
    key: "totalLostReports",
    label: "Total Lost Reports",
    icon: FaSuitcaseRolling,
    gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)"
  },
  {
    key: "totalFoundReports",
    label: "Total Found Reports",
    icon: FaMapMarkerAlt,
    gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)"
  },
  {
    key: "matchedReports",
    label: "Matched Reports",
    icon: FaCheckCircle,
    gradient: "linear-gradient(135deg, #22c55e, #16a34a)"
  },
  {
    key: "pendingReports",
    label: "Pending Reports",
    icon: FaHourglassHalf,
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
  }
];

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalLostReports: 0,
    totalFoundReports: 0,
    matchedReports: 0,
    pendingReports: 0
  });

  useEffect(() => {
    if (user?.email) {
      loadStats();
    }

    // eslint-disable-next-line
  }, []);

  const loadStats = async () => {
    try {
      const res = await API.get(`/dashboard/stats/${user.email}`);

      console.log(res.data);

      setStats({
        totalLostReports: res.data.totalLostReports || 0,
        totalFoundReports: res.data.totalFoundReports || 0,
        matchedReports: res.data.matchedReports || 0,
        pendingReports: res.data.pendingReports || 0
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load dashboard statistics.");
    }
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #f4f8ff 0%, #ffffff 35%)" }}>
      <div className="container py-4">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <h2
            className="fw-bold mb-1"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(90deg, #1d4ed8, #2563eb, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            ✈️ AirClaim BD Dashboard
          </h2>
          <p className="text-secondary mb-4">Welcome back, {user?.name}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          whileHover={{ y: -4 }}
          className="card border-0 rounded-4 p-4 mb-4 d-flex flex-row align-items-center gap-3"
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 25px rgba(15,23,42,0.08)"
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)"
            }}
          >
            <FaUserCircle size={32} color="#ffffff" />
          </div>
          <div>
            <h5 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
              {user?.name}
            </h5>
            <p className="text-secondary mb-0 small">{user?.email}</p>
            <p className="text-secondary mb-0 small">User ID: {user?.id}</p>
          </div>
        </motion.div>

        <div className="row g-3">
          {STAT_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <div className="col-sm-6 col-lg-3" key={card.key}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={i + 2}
                  whileHover={{ y: -6, boxShadow: "0 16px 32px rgba(37,99,235,0.25)" }}
                  className="card h-100 text-center border-0 rounded-4 p-4"
                  style={{
                    background: card.gradient,
                    color: "#ffffff",
                    boxShadow: "0 10px 25px rgba(37,99,235,0.2)"
                  }}
                >
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "rgba(255,255,255,0.2)"
                    }}
                  >
                    <Icon size={20} color="#ffffff" />
                  </div>
                  <p className="mb-1 opacity-75 small text-uppercase" style={{ letterSpacing: "0.5px" }}>
                    {card.label}
                  </p>
                  <h2 className="fw-bold mb-0">
                    <CountUp end={stats[card.key]} duration={1.5} />
                  </h2>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;