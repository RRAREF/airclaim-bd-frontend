import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTimes, FaUsers, FaTrash, FaExclamationTriangle } from "react-icons/fa";
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

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: ""
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const loadUsers = async () => {
    setLoading(true);

    try {
      const res = await API.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.log(err);
      showToast("danger", "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return users;

    return users.filter((user) => {
      const name = (user.name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();

      return name.includes(term) || email.includes(term);
    });
  }, [users, searchTerm]);

  const requestDelete = (user) => {
    setConfirmUser(user);
  };

  const cancelDelete = () => {
    setConfirmUser(null);
  };

  const confirmDelete = async () => {
    if (!confirmUser) return;

    const id = confirmUser.id;
    setDeletingId(id);

    try {
      await API.delete(`/admin/users/${id}`);

      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("success", "User deleted successfully.");
    } catch (err) {
      console.log(err);
      showToast("danger", "Failed to delete user.");
    } finally {
      setDeletingId(null);
      setConfirmUser(null);
    }
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #f4f8ff 0%, #ffffff 30%)" }}>
      <div className="container py-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="rounded-4 p-4 p-md-5"
          style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 20px 45px rgba(37,99,235,0.1)"
          }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
            <h2
              className="fw-bold mb-0 d-flex align-items-center"
              style={{
                fontFamily: "'Poppins', sans-serif",
                background: "linear-gradient(90deg, #1d4ed8, #2563eb, #38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              <FaUsers className="me-2" style={{ WebkitTextFillColor: "#2563eb" }} />
              Manage Users
            </h2>

            <span
              className="badge rounded-pill fs-6 px-3 py-2"
              style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff" }}
            >
              {filteredUsers.length} of {users.length} user
              {users.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="mb-4">
            <div className="input-group rounded-3 shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch color="#2563eb" size={14} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by Name or Email..."
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
          </div>

          {loading && <LoadingSpinner text="Loading users..." />}

          {!loading && filteredUsers.length === 0 && (
            <div
              className="alert border-0 rounded-3 text-center mb-0 d-flex align-items-center justify-content-center gap-2"
              style={{ background: "#fef3c7", color: "#92400e" }}
            >
              <FaExclamationTriangle />
              {users.length === 0 ? "No users found." : "No users match your search."}
            </div>
          )}

          {!loading && filteredUsers.length > 0 && (
            <div className="table-responsive rounded-4 overflow-hidden" style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
              <table className="table table-hover align-middle mb-0">
                <thead style={{ background: "linear-gradient(90deg, #dbeafe, #eff6ff)" }}>
                  <tr>
                    <th scope="col" className="py-3">ID</th>
                    <th scope="col" className="py-3">Name</th>
                    <th scope="col" className="py-3">Email</th>
                    <th scope="col" className="text-end py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td className="text-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          className="btn btn-sm rounded-3 d-inline-flex align-items-center gap-1 border-0"
                          style={{ background: "#fee2e2", color: "#dc2626" }}
                          disabled={deletingId === user.id}
                          onClick={() => requestDelete(user)}
                        >
                          {deletingId === user.id ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status" />
                              Deleting...
                            </>
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
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {confirmUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
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
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <FaExclamationTriangle color="#dc2626" />
                    Confirm Deletion
                  </h5>
                  <button type="button" className="btn-close" onClick={cancelDelete}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    Are you sure you want to delete this user
                    {confirmUser.name ? ` (${confirmUser.name})` : ""}?
                  </p>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-3"
                    onClick={cancelDelete}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger rounded-3"
                    onClick={confirmDelete}
                    disabled={deletingId === confirmUser.id}
                  >
                    {deletingId === confirmUser.id ? "Deleting..." : "Yes, Delete"}
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
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}

export default AdminUsers;