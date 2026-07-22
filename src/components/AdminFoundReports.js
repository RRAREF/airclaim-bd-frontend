import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaMapMarkerAlt, FaTrash } from "react-icons/fa";
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

function AdminFoundReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: ""
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);

    try {
      const res = await API.get("/admin/found-items");

      setReports(res.data);
    } catch (err) {
      console.log(err);

      setToast({
        show: true,
        type: "danger",
        message: "Failed to load found reports."
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const airport = (report.airport || "").toLowerCase();
      const owner = (report.ownerName || "").toLowerCase();
      const bag = (report.bagTagNumber || "").toLowerCase();

      return (
        airport.includes(search.toLowerCase()) ||
        owner.includes(search.toLowerCase()) ||
        bag.includes(search.toLowerCase())
      );
    });
  }, [reports, search]);

  const deleteReport = async (id) => {
    if (!window.confirm("Delete this report?")) return;

    setDeleteId(id);

    try {
      await API.delete(`/admin/found-items/${id}`);

      setReports(reports.filter((r) => r.id !== id));

      setToast({
        show: true,
        type: "success",
        message: "Found report deleted successfully."
      });
    } catch (err) {
      console.log(err);

      setToast({
        show: true,
        type: "danger",
        message: "Delete failed."
      });
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Found Reports..." />;
  }

  const statusBadgeStyle = (status) =>
    status === "Matched"
      ? { background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" }
      : { background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#78350f" };

  return (
    <div style={{ background: "linear-gradient(180deg, #f0fdf6 0%, #ffffff 30%)" }}>
      <div className="container py-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2"
        >
          <h2
            className="fw-bold mb-0 d-flex align-items-center"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(90deg, #16a34a, #22c55e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            <FaMapMarkerAlt className="me-2" style={{ WebkitTextFillColor: "#16a34a" }} />
            Manage Found Reports
          </h2>

          <span
            className="badge rounded-pill px-3 py-2"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" }}
          >
            {filteredReports.length} of {reports.length} report
            {reports.length !== 1 ? "s" : ""}
          </span>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mb-4">
          <div className="input-group rounded-3 shadow-sm">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch color="#16a34a" size={14} />
            </span>
            <input
              className="form-control border-start-0"
              placeholder="Search by owner, airport, or bag tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

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
              <thead style={{ background: "linear-gradient(90deg, #dcfce7, #f0fdf4)" }}>
                <tr>
                  <th className="py-3">ID</th>
                  <th className="py-3">Owner</th>
                  <th className="py-3">Airport</th>
                  <th className="py-3">Bag Tag</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.ownerName}</td>
                    <td>{report.airportName}</td>
                    <td>{report.bagTagNumber}</td>
                    <td>
                      <span className="badge rounded-pill px-3 py-2" style={statusBadgeStyle(report.status)}>
                        {report.status || "Pending"}
                      </span>
                    </td>
                    <td className="text-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-sm rounded-3 d-inline-flex align-items-center gap-1 border-0"
                        style={{ background: "#fee2e2", color: "#dc2626" }}
                        disabled={deleteId === report.id}
                        onClick={() => deleteReport(report.id)}
                      >
                        {deleteId === report.id ? (
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
                ))}

                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-secondary py-4">
                      No found reports match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
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

export default AdminFoundReports;