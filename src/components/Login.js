import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaPlaneDeparture } from "react-icons/fa";
import API from "../api/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
  })
};

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    try {
      const res = await API.post("/users/login", user);

      console.log("Response:", res.data);

      if (res.data.message === "Login Successful") {
        // Save logged-in user
        localStorage.setItem("user", JSON.stringify(res.data));

        // Save email separately (used by Notifications)
        localStorage.setItem("email", user.email);

        // If your backend returns user name, save it too
        if (res.data.name) {
          localStorage.setItem("name", res.data.name);
        }

        // Update login state
        setIsLoggedIn(true);

        alert("Login Successful");

        navigate("/dashboard");
      } else {
        alert("Invalid Email or Password");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "90vh",
        background: "linear-gradient(180deg, #f4f8ff 0%, #ffffff 60%)"
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
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 20px 45px rgba(37,99,235,0.15)",
            border: "1px solid rgba(219,230,255,0.8)"
          }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="position-absolute d-none d-md-block"
            style={{ top: "-20px", right: "-20px", fontSize: "5rem", opacity: 0.08 }}
          >
            <FaPlaneDeparture color="#2563eb" />
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="text-center mb-4">
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)"
              }}
            >
              <FaPlaneDeparture size={22} color="#ffffff" />
            </div>
            <h2
              className="fw-bold mb-1"
              style={{
                fontFamily: "'Poppins', sans-serif",
                background: "linear-gradient(90deg, #1d4ed8, #2563eb, #38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Welcome Back
            </h2>
            <p className="text-secondary mb-0 small">Log in to AirClaim BD</p>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="mb-3">
            <div className="input-group rounded-3 overflow-hidden shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <FaEnvelope color="#2563eb" />
              </span>
              <input
                type="email"
                className="form-control border-start-0 py-2"
                name="email"
                placeholder="Email"
                value={user.email}
                onChange={handleChange}
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={3} className="mb-4">
            <div className="input-group rounded-3 overflow-hidden shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <FaLock color="#2563eb" />
              </span>
              <input
                type="password"
                className="form-control border-start-0 py-2"
                name="password"
                placeholder="Password"
                value={user.password}
                onChange={handleChange}
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={4}>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(37,99,235,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="btn w-100 text-white py-2 rounded-pill fw-semibold border-0"
              style={{ background: "linear-gradient(90deg, #2563eb, #1d4ed8)" }}
              onClick={handleLogin}
            >
              Login
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;