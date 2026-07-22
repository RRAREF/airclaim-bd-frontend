import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaSyncAlt, FaSuitcaseRolling, FaTrash, FaImage } from "react-icons/fa";
import API from "../api/api";
import LoadingSpinner from "./LoadingSpinner";
import ToastMessage from "./ToastMessage";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(i, 10) * 0.04, duration: 0.4, ease: "easeOut" }
  })
};

function AdminLostReports() {
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [modalImage, setModalImage] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const [confirmReport, setConfirmReport] = useState(null);

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
    setToast({
      show: true,
      type,
      message
    });
  };

  const loadReports = async () => {
    setLoading(true);

    try {
      const res = await API.get("/admin/lost-items");

      setReports(res.data || []);
    } catch (err) {
      console.log(err);

      showToast("danger", "Failed to load lost reports.");
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return reports;

    return reports.filter((report) => {
      return (
        (report.itemName || "").toLowerCase().includes(keyword) ||
        (report.passengerName || "").toLowerCase().includes(keyword) ||
        (report.bagTagNumber || "").toLowerCase().includes(keyword) ||
        (report.ticketNumber || "").toLowerCase().includes(keyword)
      );
    });
  }, [reports, searchTerm]);

  const requestDelete = (report) => {
    setConfirmReport(report);
  };

  const cancelDelete = () => {
    setConfirmReport(null);
  };

  const confirmDelete = async () => {
    if (!confirmReport) return;

    const id = confirmReport.id;

    setDeletingId(id);

    try {
      await API.delete(`/admin/lost-items/${id}`);

      setReports((prev) => prev.filter((r) => r.id !== id));

      showToast("success", "Lost report deleted successfully.");
    } catch (err) {
      console.log(err);

      showToast("danger", "Delete failed.");
    } finally {
      setDeletingId(null);

      setConfirmReport(null);
    }
  };

  const openImage = (image) => {
    setModalImage(image);
  };

  const closeImage = () => {
    setModalImage(null);
  };

  const statusBadgeStyle = (status) =>
    status === "Matched"
      ? { background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" }
      : { background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#78350f" };

  return (
    <div style={{ background: "linear-gradient(180deg, #fff5f5 0%, #ffffff 30%)" }}>
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
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(90deg, #dc2626, #ef4444)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            <FaSuitcaseRolling className="me-2" style={{ WebkitTextFillColor: "#dc2626" }} />
            Lost Reports
          </h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn text-white rounded-pill px-4 d-flex align-items-center gap-2 border-0"
            style={{ background: "linear-gradient(90deg, #ef4444, #dc2626)" }}
            onClick={loadReports}
          >
            <FaSyncAlt size={13} />
            Refresh
          </motion.button>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mb-4">
          <div className="input-group rounded-3 shadow-sm">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch color="#dc2626" size={14} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by Item Name, Passenger, Bag Tag or Ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {loading && <LoadingSpinner text="Loading Lost Reports..." />}

        {!loading && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="card border-0 rounded-4 overflow-hidden"
            style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}
          >
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ background: "linear-gradient(90deg, #fee2e2, #fef2f2)" }}>
                  <tr>
                    <th className="py-3">ID</th>
                    <th className="py-3">Image</th>
                    <th className="py-3">Passenger</th>
                    <th className="py-3">Item</th>
                    <th className="py-3">Airport</th>
                    <th className="py-3">Bag Tag</th>
                    <th className="py-3">Ticket</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 text-end">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center text-secondary py-4">
                        No reports found.
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report) => (
                      <tr key={report.id}>
                        <td>{report.id}</td>

                        <td>
                          {report.imageBase64 ? (
                            <img
                              src={`data:image/jpeg;base64,${report.imageBase64}`}
                              alt="item"
                              width="60"
                              className="rounded-3 shadow-sm"
                              style={{ cursor: "pointer", objectFit: "cover", height: "60px" }}
                              onClick={() => openImage(report.imageBase64)}
                            />
                          ) : (
                            <div
                              className="d-flex align-items-center justify-content-center rounded-3"
                              style={{ width: "60px", height: "60px", background: "#f8fafc" }}
                            >
                              <FaImage color="#94a3b8" />
                            </div>
                          )}
                        </td>

                        <td>{report.passengerName}</td>
                        <td>{report.itemName}</td>
                        <td>{report.airportName}</td>
                        <td>{report.bagTagNumber}</td>
                        <td>{report.ticketNumber}</td>

                        <td>
                          <span className="badge rounded-pill px-3 py-2" style={statusBadgeStyle(report.status)}>
                            {report.status}
                          </span>
                        </td>

                        <td className="text-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-sm rounded-3 d-inline-flex align-items-center gap-1 border-0"
                            style={{ background: "#fee2e2", color: "#dc2626" }}
                            disabled={deletingId === report.id}
                            onClick={() => requestDelete(report)}
                          >
                            {deletingId === report.id ? (
                              <span className="spinner-border spinner-border-sm" role="status" />
                            ) : (
                              <>
                                <FaTrash size={12} />
                                Delete
                              </>
                            )}
                          </motion.button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {modalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,.6)" }}
            onClick={closeImage}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="modal-dialog modal-lg modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content border-0 rounded-4 overflow-hidden">
                <div className="modal-header border-0">
                  <h5>Item Image</h5>
                  <button className="btn-close" onClick={closeImage}></button>
                </div>
                <div className="modal-body text-center p-0">
                  <img
                    src={`data:image/jpeg;base64,${modalImage}`}
                    alt="preview"
                    className="img-fluid w-100"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,.6)" }}
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content border-0 rounded-4">
                <div className="modal-header border-0">
                  <h5>Delete Report</h5>
                </div>
                <div className="modal-body">Are you sure you want to delete this report?</div>
                <div className="modal-footer border-0">
                  <button className="btn btn-secondary rounded-3" onClick={cancelDelete}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger rounded-3"
                    onClick={confirmDelete}
                    disabled={deletingId === confirmReport.id}
                  >
                    {deletingId === confirmReport.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastMessage
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            show: false
          }))
        }
      />
    </div>
  );
}

export default AdminLostReports;