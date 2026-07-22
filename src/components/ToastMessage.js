import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

const TYPE_CONFIG = {
  success: {
    icon: FaCheckCircle,
    gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
    label: "Success!"
  },
  danger: {
    icon: FaTimesCircle,
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    label: "Error!"
  },
  warning: {
    icon: FaExclamationTriangle,
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    label: "Warning!"
  },
  info: {
    icon: FaInfoCircle,
    gradient: "linear-gradient(135deg, #38bdf8, #0284c7)",
    label: "Info!"
  }
};

function ToastMessage({ show, type = "success", message, onClose }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const Icon = config.icon;

  return (
    <div
      className="position-fixed"
      style={{ bottom: "24px", right: "24px", zIndex: 1080, maxWidth: "360px" }}
    >
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            role="alert"
            className="d-flex align-items-start gap-3 rounded-4 p-3 text-white"
            style={{
              background: config.gradient,
              boxShadow: "0 14px 34px rgba(15,23,42,0.25)"
            }}
          >
            <Icon size={20} className="flex-shrink-0 mt-1" />

            <div className="flex-grow-1">
              <strong className="d-block">{config.label}</strong>
              <span style={{ opacity: 0.95 }}>{message}</span>
            </div>

            <button
              type="button"
              className="btn-close btn-close-white mt-1"
              onClick={onClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ToastMessage;