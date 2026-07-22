import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTag, FaTimesCircle } from "react-icons/fa";

function BagTagSuggestions({ suggestions, value, duplicate, onSelect }) {
  if (suggestions.length === 0 && !duplicate) {
    return null;
  }

  return (
    <div className="mb-3">
      {/* Duplicate Warning */}
      <AnimatePresence>
        {duplicate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="alert d-flex align-items-center gap-2 rounded-3 py-2 mt-2 border-0"
            style={{ background: "#fee2e2", color: "#dc2626" }}
          >
            <FaTimesCircle className="flex-shrink-0" />
            This Bag Tag Number has already been submitted.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="card border-0 rounded-3 overflow-hidden mt-2"
            style={{ boxShadow: "0 8px 20px rgba(15,23,42,0.08)" }}
          >
            <div
              className="card-header border-0 fw-semibold small text-uppercase"
              style={{
                background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                letterSpacing: "0.4px"
              }}
            >
              Existing Bag Tag Numbers
            </div>

            <ul className="list-group list-group-flush">
              {suggestions.map((tag, index) => (
                <motion.li
                  key={index}
                  whileHover={{ backgroundColor: "#eff6ff" }}
                  className={`list-group-item d-flex align-items-center gap-2 ${
                    tag === value ? "fw-semibold" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    background: tag === value ? "#dbeafe" : "transparent",
                    color: tag === value ? "#1d4ed8" : "#1e293b",
                    border: "none",
                    borderTop: index === 0 ? "none" : "1px solid #f1f5f9"
                  }}
                  onClick={() => onSelect(tag)}
                >
                  <FaTag size={12} color="#2563eb" />
                  {tag}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BagTagSuggestions;