import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaCheckCircle, FaInbox } from "react-icons/fa";
import API from "../api/api";
import LoadingSpinner from "./LoadingSpinner";

const fadeSlide = {
  hidden: { opacity: 0, x: -24 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: Math.min(i, 10) * 0.05, duration: 0.4, ease: "easeOut" }
  }),
  exit: { opacity: 0, x: 24, transition: { duration: 0.2 } }
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("email");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await API.get(`/notifications/${email}`);

      setNotifications(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);

      loadNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Notifications..." />;
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ background: "linear-gradient(180deg, #f4f8ff 0%, #ffffff 30%)", minHeight: "60vh" }}>
      <div className="container py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4"
        >
          <h2
            className="fw-bold mb-0 d-flex align-items-center"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(90deg, #1d4ed8, #2563eb, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            <FaBell className="me-2" style={{ WebkitTextFillColor: "#2563eb" }} />
            Notifications
          </h2>

          {unreadCount > 0 && (
            <span
              className="badge rounded-pill px-3 py-2"
              style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff" }}
            >
              {unreadCount} unread
            </span>
          )}
        </motion.div>

        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-5 rounded-4 border"
            style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
          >
            <FaInbox size={56} color="#94a3b8" />
            <h4 className="mt-3 text-secondary">No notifications available.</h4>
          </motion.div>
        ) : (
          <AnimatePresence>
            {notifications.map((notification, i) => (
              <motion.div
                key={notification.id}
                custom={i}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
                layout
                whileHover={{ y: -3, boxShadow: "0 14px 30px rgba(37,99,235,0.14)" }}
                className="card mb-3 border-0 rounded-4 position-relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 6px 20px rgba(15,23,42,0.06)",
                  borderLeft: notification.read ? "4px solid transparent" : "4px solid #2563eb"
                }}
              >
                {!notification.read && (
                  <span
                    className="position-absolute rounded-circle"
                    style={{
                      width: "10px",
                      height: "10px",
                      top: "14px",
                      right: "14px",
                      background: "#2563eb",
                      boxShadow: "0 0 0 4px rgba(37,99,235,0.15)"
                    }}
                  />
                )}

                <div className="card-body">
                  <div className="d-flex justify-content-between flex-wrap gap-2">
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                        {notification.title}
                      </h5>

                      <p className="mb-1 text-secondary">{notification.message}</p>

                      <small className="text-muted">
                        {notification.createdAt.replace("T", " ")}
                      </small>
                    </div>

                    {!notification.read && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-sm text-white rounded-pill px-3 align-self-start d-flex align-items-center gap-1 border-0"
                        style={{ background: "linear-gradient(90deg, #2563eb, #1d4ed8)" }}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <FaCheckCircle size={12} />
                        Mark as Read
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default Notifications;