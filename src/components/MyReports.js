import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaTimes,
  FaFileAlt,
  FaBoxOpen,
  FaImage,
  FaInbox
} from "react-icons/fa";
import API from "../api/api";
import LoadingSpinner from "./LoadingSpinner";
import ToastMessage from "./ToastMessage";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(i, 8) * 0.05, duration: 0.5, ease: "easeOut" }
  })
};

function MyReports() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [lostReports, setLostReports] = useState([]);
  const [foundReports, setFoundReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalImage, setModalImage] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: ""
  });

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const [lostRes, foundRes] = await Promise.all([
        API.get(`/lost-items/my-reports/${user.email}`),
        API.get(`/found-items/my-reports/${user.email}`)
      ]);
      setLostReports(lostRes.data || []);
      setFoundReports(foundRes.data || []);
    } catch (err) {
      console.log(err);
      showToast("danger", "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  const sortedLostReports = useMemo(() => {
    const copy = [...lostReports];
    copy.sort((a, b) => {
      const dateA = new Date(a.dateLost || 0).getTime();
      const dateB = new Date(b.dateLost || 0).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return (b.id || 0) - (a.id || 0);
    });
    return copy;
  }, [lostReports]);

  const sortedFoundReports = useMemo(() => {
    const copy = [...foundReports];
    copy.sort((a, b) => {
      const dateA = new Date(a.dateFound || 0).getTime();
      const dateB = new Date(b.dateFound || 0).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return (b.id || 0) - (a.id || 0);
    });
    return copy;
  }, [foundReports]);

  const filteredLostReports = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sortedLostReports;
    return sortedLostReports.filter(
      (report) =>
        (report.itemName || "").toLowerCase().includes(term) ||
        (report.bagTagNumber || "").toLowerCase().includes(term) ||
        (report.ticketNumber || "").toLowerCase().includes(term)
    );
  }, [sortedLostReports, searchTerm]);

  const filteredFoundReports = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sortedFoundReports;
    return sortedFoundReports.filter(
      (report) =>
        (report.itemName || "").toLowerCase().includes(term) ||
        (report.bagTagNumber || "").toLowerCase().includes(term) ||
        (report.ticketNumber || "").toLowerCase().includes(term)
    );
  }, [sortedFoundReports, searchTerm]);

  const openImageModal = (imageBase64) => {
    setModalImage(imageBase64);
  };

  const closeImageModal = () => {
    setModalImage(null);
  };

  const statusBadgeStyle = (status) =>
    status === "Matched"
      ? { background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" }
      : { background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#78350f" };

  return (
    <div style={{ background: "linear-gradient(180deg, #f4f8ff 0%, #ffffff 30%)" }}>
      <div className="container py-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2"
        >
          <h2
            className="fw-bold mb-0"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(90deg, #1d4ed8, #2563eb, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            <FaFileAlt className="me-2" style={{ WebkitTextFillColor: "#2563eb" }} />
            My Lost Reports
          </h2>

          <span
            className="badge rounded-pill fs-6 px-3 py-2"
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff" }}
          >
            {filteredLostReports.length} of {lostReports.length} report
            {lostReports.length !== 1 ? "s" : ""}
          </span>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mb-4">
          <div className="input-group rounded-3 shadow-sm">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch color="#2563eb" size={14} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by Item Name, Bag Tag, or Ticket Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setSearchTerm("")}
              >
                <FaTimes />
              </button>
            )}
          </div>
        </motion.div>

        {loading && <LoadingSpinner text="Loading your reports..." />}

        {!loading && filteredLostReports.length === 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-center py-5 rounded-4 border"
            style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
          >
            <FaInbox size={56} color="#94a3b8" />
            <h4 className="mt-3 text-secondary">
              {lostReports.length === 0 ? "No reports found." : "No reports match your search."}
            </h4>
            <p className="text-muted mb-0">
              {lostReports.length === 0
                ? "Items you report as lost will appear here."
                : "Try a different keyword."}
            </p>
          </motion.div>
        )}

        {!loading &&
          filteredLostReports.map((report, i) => (
            <motion.div
              key={report.id}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i + 2}
              whileHover={{ y: -4, boxShadow: "0 16px 34px rgba(37,99,235,0.15)" }}
              className="card mb-4 border-0 rounded-4 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 24px rgba(15,23,42,0.06)"
              }}
            >
              <div className="row g-0">
                <div className="col-md-4 text-center p-3" style={{ background: "#f4f8ff" }}>
                  {report.imageBase64 ? (
                    <img
                      src={`data:image/jpeg;base64,${report.imageBase64}`}
                      alt={report.itemName}
                      role="button"
                      className="img-fluid rounded-3 shadow-sm"
                      style={{
                        maxHeight: "250px",
                        objectFit: "cover",
                        cursor: "pointer",
                        width: "100%"
                      }}
                      onClick={() => openImageModal(report.imageBase64)}
                    />
                  ) : (
                    <div
                      className="border rounded-3 d-flex flex-column justify-content-center align-items-center"
                      style={{
                        height: "250px",
                        background: "#ffffff"
                      }}
                    >
                      <FaImage size={40} color="#94a3b8" />
                      <h6 className="text-secondary mt-2 mb-0">No Image</h6>
                    </div>
                  )}
                </div>

                <div className="col-md-8">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                      <h3 className="fw-bold mb-0" style={{ color: "#1d4ed8" }}>
                        {report.itemName}
                      </h3>

                      <span
                        className="badge rounded-pill px-3 py-2"
                        style={statusBadgeStyle(report.status)}
                      >
                        {report.status || "Pending"}
                      </span>
                    </div>

                    <hr />

                    <p>
                      <strong>Description:</strong>
                      <br />
                      {report.itemDescription}
                    </p>

                    <div className="row">
                      <div className="col-sm-6 mb-2">
                        <strong>Airport:</strong> {report.airportName}
                      </div>
                      <div className="col-sm-6 mb-2">
                        <strong>Phone:</strong> {report.phone}
                      </div>
                      <div className="col-sm-6 mb-2">
                        <strong>Bag Tag:</strong> {report.bagTagNumber}
                      </div>
                      <div className="col-sm-6 mb-2">
                        <strong>Ticket Number:</strong> {report.ticketNumber}
                      </div>
                      <div className="col-sm-6 mb-2">
                        <strong>Date Lost:</strong> {report.dateLost}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

        <hr className="my-5" />

        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="fw-bold mb-4"
          style={{
            fontFamily: "'Poppins', sans-serif",
            background: "linear-gradient(90deg, #16a34a, #22c55e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          <FaBoxOpen className="me-2" style={{ WebkitTextFillColor: "#16a34a" }} />
          My Found Reports
        </motion.h2>

        {!loading && filteredFoundReports.length === 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="alert border-0 rounded-4"
            style={{ background: "#ecfdf5", color: "#166534" }}
          >
            No Found Reports.
          </motion.div>
        ) : (
          !loading &&
          filteredFoundReports.map((report, i) => (
            <motion.div
              key={report.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -4, boxShadow: "0 16px 34px rgba(22,163,74,0.15)" }}
              className="card mb-4 border-0 rounded-4"
              style={{
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 24px rgba(15,23,42,0.06)"
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <h4 className="fw-bold mb-0" style={{ color: "#16a34a" }}>
                    {report.itemName}
                  </h4>

                  <span
                    className="badge rounded-pill px-3 py-2"
                    style={statusBadgeStyle(report.status)}
                  >
                    {report.status || "Pending"}
                  </span>
                </div>

                <hr />

                <p>
                  <strong>Description:</strong>
                  <br />
                  {report.itemDescription}
                </p>

                <div className="row">
                  <div className="col-sm-6 mb-2">
                    <strong>Airport:</strong> {report.airportName}
                  </div>
                  <div className="col-sm-6 mb-2">
                    <strong>Owner:</strong> {report.ownerName}
                  </div>
                  <div className="col-sm-6 mb-2">
                    <strong>Bag Tag:</strong> {report.bagTagNumber}
                  </div>
                  <div className="col-sm-6 mb-2">
                    <strong>Ticket Number:</strong> {report.ticketNumber}
                  </div>
                  <div className="col-sm-6 mb-2">
                    <strong>Date Found:</strong> {report.dateFound}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}

        <AnimatePresence>
          {modalImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
              onClick={closeImageModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="modal-dialog modal-dialog-centered modal-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content border-0 rounded-4 overflow-hidden">
                  <div className="modal-header border-0">
                    <h5 className="modal-title">Item Photo</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeImageModal}
                    ></button>
                  </div>
                  <div className="modal-body text-center p-0">
                    <img
                      src={`data:image/jpeg;base64,${modalImage}`}
                      alt="Lost item preview"
                      className="img-fluid w-100"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ToastMessage
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}

export default MyReports;