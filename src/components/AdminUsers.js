import { useEffect, useMemo, useState } from "react";
import API from "../api/api";
import LoadingSpinner from "./LoadingSpinner";
import ToastMessage from "./ToastMessage";

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
    <div className="container mt-4 mb-5">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
            <h2 className="fw-bold text-primary mb-0">
              <i className="bi bi-people-fill me-2"></i>
              Manage Users
            </h2>

            <span className="badge bg-primary rounded-pill fs-6">
              {filteredUsers.length} of {users.length} user
              {users.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="mb-4">
            <div className="input-group rounded-3 shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search"></i>
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
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>

          {loading && <LoadingSpinner text="Loading users..." />}

          {!loading && filteredUsers.length === 0 && (
            <div className="alert alert-warning rounded-3 text-center mb-0">
              <i className="bi bi-exclamation-circle me-2"></i>
              {users.length === 0 ? "No users found." : "No users match your search."}
            </div>
          )}

          {!loading && filteredUsers.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover align-middle rounded-3 overflow-hidden">
                <thead className="table-primary">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col" className="text-end">
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
                        <button
                          type="button"
                          className="btn btn-danger btn-sm rounded-3"
                          disabled={deletingId === user.id}
                          onClick={() => requestDelete(user)}
                        >
                          {deletingId === user.id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-trash me-1"></i>
                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {confirmUser && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={cancelDelete}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>
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
          </div>
        </div>
      )}

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