import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  FaPlaneDeparture,
  FaSuitcaseRolling,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaHourglassHalf
} from "react-icons/fa";
import { MdOutlineTravelExplore } from "react-icons/md";
import API from "../api/api";
import LoadingSpinner from "./LoadingSpinner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
  })
};

const AIRPORTS = [
  { code: "DAC", name: "Dhaka", full: "Hazrat Shahjalal International Airport" },
  { code: "ZYL", name: "Sylhet", full: "Osmani International Airport" },
  { code: "CGP", name: "Chattogram", full: "Shah Amanat International Airport" },
  { code: "CXB", name: "Cox's Bazar", full: "Cox's Bazar Airport" },
  { code: "SPD", name: "Saidpur", full: "Saidpur Airport" }
];

function Home() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalLostReports: 0,
    totalFoundReports: 0,
    matchedReports: 0,
    pendingReports: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const [recentReports, setRecentReports] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadRecentReports();
  }, []);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const res = await API.get("/dashboard/stats");

      setStats({
        totalLostReports: res.data.totalLostReports || 0,
        totalFoundReports: res.data.totalFoundReports || 0,
        matchedReports: res.data.matchedReports || 0,
        pendingReports: res.data.pendingReports || 0
      });
    } catch (err) {
      console.log(err);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadRecentReports = async () => {
    setRecentLoading(true);
    try {
      const [lostRes, foundRes] = await Promise.all([
        API.get("/lost-items"),
        API.get("/found-items")
      ]);

      const lost = (lostRes.data || []).map((r) => ({
        id: `lost-${r.id}`,
        sortId: r.id || 0,
        kind: "Lost",
        itemName: r.itemName,
        airportName: r.airportName,
        status: r.status
      }));

      const found = (foundRes.data || []).map((r) => ({
        id: `found-${r.id}`,
        sortId: r.id || 0,
        kind: "Found",
        itemName: r.itemName,
        airportName: r.airportName,
        status: r.status
      }));

      const combined = [...lost, ...found].sort((a, b) => b.sortId - a.sortId);

      setRecentReports(combined.slice(0, 4));
    } catch (err) {
      console.log(err);
    } finally {
      setRecentLoading(false);
    }
  };

  const STAT_CARDS = [
    { key: "totalLostReports", label: "Lost Items" },
    { key: "totalFoundReports", label: "Found Items" },
    { key: "matchedReports", label: "Recovered" }
  ];

  return (
    <div style={{ background: "linear-gradient(180deg, #f4f8ff 0%, #ffffff 35%)" }}>
      <div className="container py-4">
        {/* HERO */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="position-relative overflow-hidden text-center rounded-4 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #eaf1ff 0%, #dce8ff 50%, #f5f9ff 100%)",
            padding: "4.5rem 1.5rem"
          }}
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="position-absolute d-none d-md-block"
            style={{ top: "18%", left: "6%", fontSize: "2.5rem", opacity: 0.35 }}
          >
            <FaSuitcaseRolling color="#2563eb" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="position-absolute d-none d-md-block"
            style={{ top: "65%", right: "8%", fontSize: "2rem", opacity: 0.3 }}
          >
            <FaPlaneDeparture color="#1d4ed8" />
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <span
              className="badge rounded-pill px-3 py-2 mb-3"
              style={{ background: "rgba(37, 99, 235, 0.1)", color: "#1d4ed8", fontWeight: 500 }}
            >
              <MdOutlineTravelExplore className="me-1" />
              Smart Lost & Found Network
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={2}
            className="fw-bold mb-3"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "2.75rem",
              background: "linear-gradient(90deg, #1d4ed8, #2563eb, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            AirClaim BD
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={3}
            className="text-secondary mb-4 mx-auto"
            style={{ maxWidth: "560px", fontSize: "1.05rem" }}
          >
            Smart Airport Lost &amp; Found Management System for Bangladesh — report,
            search, and recover lost items across every major airport.
          </motion.p>

          <motion.div variants={fadeUp} custom={4} className="d-flex justify-content-center gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(37,99,235,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="btn text-white px-4 py-2 rounded-pill fw-semibold border-0"
              style={{ background: "linear-gradient(90deg, #2563eb, #1d4ed8)" }}
              onClick={() => navigate("/lost")}
            >
              Report Lost Item
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(37,99,235,0.15)" }}
              whileTap={{ scale: 0.97 }}
              className="btn px-4 py-2 rounded-pill fw-semibold"
              style={{ background: "#ffffff", color: "#1d4ed8", border: "1px solid #dbe6ff" }}
              onClick={() => navigate("/found")}
            >
              Report Found Item
            </motion.button>
          </motion.div>
        </motion.div>

        {/* SUPPORTED AIRPORTS */}
        <motion.h4
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-5 mb-3 fw-bold"
          style={{ color: "#1e293b" }}
        >
          Supported Airports
        </motion.h4>

        <div className="row g-3">
          {AIRPORTS.map((airport, i) => (
            <div className="col-md-6 col-lg-4" key={airport.code}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6, boxShadow: "0 14px 30px rgba(37,99,235,0.15)" }}
                className="card h-100 text-center border-0 rounded-4 p-4"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 16px rgba(15,23,42,0.06)",
                  transition: "box-shadow 0.3s ease"
                }}
              >
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "56px",
                    height: "56px",
                    background: "linear-gradient(135deg, #dbeafe, #eff6ff)"
                  }}
                >
                  <FaPlaneDeparture size={22} color="#2563eb" />
                </div>
                <h5 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                  {airport.name}
                </h5>
                <p className="text-secondary mb-0 small">{airport.full}</p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* STATS */}
        <motion.h4
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-5 mb-3 fw-bold"
          style={{ color: "#1e293b" }}
        >
          Our Impact
        </motion.h4>

        {statsLoading ? (
          <LoadingSpinner text="Loading live statistics..." />
        ) : (
          <div className="row g-3 text-center">
            {STAT_CARDS.map((stat, i) => (
              <div className="col-md-4" key={stat.key}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -6 }}
                  className="card h-100 border-0 rounded-4 p-4"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#ffffff",
                    boxShadow: "0 10px 25px rgba(37,99,235,0.25)"
                  }}
                >
                  <h3 className="fw-bold mb-1" style={{ fontSize: "2.25rem" }}>
                    <CountUp end={stats[stat.key]} duration={2} />
                  </h3>
                  <p className="mb-0 opacity-75">{stat.label}</p>
                </motion.div>
              </div>
            ))}
          </div>
        )}

        {/* RECENT REPORTS */}
        <motion.h4
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-5 mb-3 fw-bold"
          style={{ color: "#1e293b" }}
        >
          Recent Reports
        </motion.h4>

        {recentLoading ? (
          <LoadingSpinner text="Loading recent reports..." />
        ) : recentReports.length === 0 ? (
          <div className="alert alert-light border rounded-4">No recent reports yet.</div>
        ) : (
          <div className="d-flex flex-column gap-3 mb-4">
            {recentReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                whileHover={{ x: 4 }}
                className="card border-0 rounded-4 p-3 d-flex flex-row align-items-center gap-3"
                style={{ boxShadow: "0 4px 16px rgba(15,23,42,0.06)" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    background: report.kind === "Found" ? "#fef3c7" : "#fee2e2"
                  }}
                >
                  {report.kind === "Found" ? (
                    <FaMapMarkerAlt color="#b45309" />
                  ) : (
                    <FaSuitcaseRolling color="#b91c1c" />
                  )}
                </div>
                <div className="flex-grow-1">
                  <div className="fw-semibold" style={{ color: "#1e293b" }}>
                    {report.itemName} {report.kind === "Found" ? "found" : "lost"} at {report.airportName}
                  </div>
                  <div className="d-flex gap-2 mt-1">
                    <span
                      className="badge rounded-pill"
                      style={
                        report.kind === "Found"
                          ? { background: "#fef3c7", color: "#b45309" }
                          : { background: "#fee2e2", color: "#b91c1c" }
                      }
                    >
                      {report.kind}
                    </span>
                    <span
                      className="badge rounded-pill d-flex align-items-center gap-1"
                      style={
                        report.status === "Matched"
                          ? { background: "#dcfce7", color: "#16a34a" }
                          : { background: "#f1f5f9", color: "#64748b" }
                      }
                    >
                      {report.status === "Matched" ? (
                        <FaCheckCircle size={11} />
                      ) : (
                        <FaHourglassHalf size={11} />
                      )}
                      {report.status || "Pending"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;