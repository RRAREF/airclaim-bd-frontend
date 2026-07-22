import React from "react";
import { motion } from "framer-motion";

function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center my-4" role="status">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "4px solid #dbeafe",
          borderTopColor: "#2563eb"
        }}
      />

      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="mt-3 fw-semibold"
        style={{ color: "#475569", fontSize: "0.9rem" }}
      >
        {text}
      </motion.div>

      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;