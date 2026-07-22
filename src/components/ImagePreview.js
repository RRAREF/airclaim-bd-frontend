import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaTrash, FaFileImage } from "react-icons/fa";

function ImagePreview({ file, preview, onRemove }) {
  if (!file || !preview) return null;

  const fileSize = (file.size / 1024).toFixed(2);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.3 }}
        className="card border-0 rounded-4 overflow-hidden mb-3"
        style={{ boxShadow: "0 10px 25px rgba(15,23,42,0.1)" }}
      >
        <div
          className="card-header border-0 fw-semibold small text-uppercase d-flex align-items-center gap-2"
          style={{
            background: "linear-gradient(90deg, #334155, #1e293b)",
            color: "#ffffff",
            letterSpacing: "0.4px"
          }}
        >
          <FaCamera size={13} />
          Image Preview
        </div>

        <div className="card-body text-center">
          <motion.img
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            src={preview}
            alt="Preview"
            className="img-fluid rounded-3"
            style={{
              maxHeight: "280px",
              objectFit: "contain",
              boxShadow: "0 8px 20px rgba(15,23,42,0.12)"
            }}
          />

          <hr />

          <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
            <FaFileImage color="#64748b" size={14} />
            <span className="text-secondary">{file.name}</span>
          </div>

          <p className="mb-3 text-secondary small">{fileSize} KB</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="btn rounded-pill px-4 d-inline-flex align-items-center gap-2 border-0"
            style={{ background: "#fee2e2", color: "#dc2626" }}
            onClick={onRemove}
          >
            <FaTrash size={13} />
            Remove Image
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ImagePreview;