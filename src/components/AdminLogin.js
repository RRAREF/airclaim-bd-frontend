import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserShield, FaUser, FaLock } from "react-icons/fa";
import API from "../api/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
  })
};

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await API.post("/admin/login", formData);

      if (res.data.success) {
        localStorage.setItem("admin", JSON.stringify(res.data));

        alert("Admin Login Successful");

        navigate("/admin-dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Invalid Username or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "90vh",
        background: "linear-gradient(180deg, #f1f5f9 0%, #ffffff 60%)"
      }}
    >
      <div className="container">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mx-auto rounded-4 p-4 p-md-5 position-relative overflow-hidden"
          style={{
            maxWidth: "440px",
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 20px 45px rgba(15,23,42,0.18)",
            border: "1px solid rgba(203,213,225,0.7)"
          }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="position-absolute d-none d-md-block"
            style={{ top: "-20px", right: "-20px", fontSize: "5rem", opacity: 0.06 }}
          >
            <FaUserShield color="#1e293b" />
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="text-center mb-4">
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #334155, #1e293b)"
              }}
            >
              <FaUserShield size={24} color="#ffffff" />
            </div>
            <h2
              className="fw-bold mb-1"
              style={{
                fontFamily: "'Poppins', sans-serif",
                background: "linear-gradient(90deg, #1e293b, #334155, #64748b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Admin Login
            </h2>
            <p className="text-secondary mb-0 small">Restricted access — AirClaim BD administrators only</p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div variants={fadeUp} custom={2} className="mb-3">
              <div className="input-group rounded-3 overflow-hidden shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                  <FaUser color="#334155" />
                </span>
                <input
                  className="form-control border-start-0 py-2"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={3} className="mb-4">
              <div className="input-group rounded-3 overflow-hidden shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                  <FaLock color="#334155" />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 py-2"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={4}>
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02, boxShadow: "0 10px 25px rgba(30,41,59,0.35)" }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className="btn w-100 text-white py-2 rounded-pill fw-semibold border-0"
                style={{ background: "linear-gradient(90deg, #334155, #1e293b)" }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminLogin;