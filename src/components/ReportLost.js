import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaPlaneDeparture,
  FaBoxOpen,
  FaTag,
  FaTicketAlt,
  FaCalendarAlt,
  FaCamera,
  FaExclamationTriangle
} from "react-icons/fa";
import BagTagSuggestions from "./BagTagSuggestions";
import TicketSuggestions from "./TicketSuggestions";
import LoadingSpinner from "./LoadingSpinner";
import ToastMessage from "./ToastMessage";
import ImagePreview from "./ImagePreview";
import API from "../api/api";

const AIRPORTS = [
  { value: "Dhaka Airport", label: "Hazrat Shahjalal International Airport" },
  { value: "Sylhet Airport", label: "Osmani International Airport" },
  { value: "Chattogram Airport", label: "Shah Amanat International Airport" },
  { value: "CoxBazar Airport", label: "Cox's Bazar Airport" },
  { value: "Saidpur Airport", label: "Saidpur Airport" }
];

const INITIAL_FORM = {
  airportName: "",
  phone: "",
  itemName: "",
  itemDescription: "",
  bagTagNumber: "",
  ticketNumber: "",
  dateLost: "",
  image: null
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" }
  })
};

const getLocalToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function ReportLost() {
  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: ""
  });

  const [bagSuggestions, setBagSuggestions] = useState([]);
  const [ticketSuggestions, setTicketSuggestions] = useState([]);

  const [bagDuplicate, setBagDuplicate] = useState(false);
  const [ticketDuplicate, setTicketDuplicate] = useState(false);

  const [searchingBag, setSearchingBag] = useState(false);
  const [searchingTicket, setSearchingTicket] = useState(false);

  const bagDebounceRef = useRef(null);
  const ticketDebounceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (bagDebounceRef.current) clearTimeout(bagDebounceRef.current);
      if (ticketDebounceRef.current) clearTimeout(ticketDebounceRef.current);
      if (preview) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showToast("danger", "Please select a valid image file.");
        return;
      }

      if (preview) URL.revokeObjectURL(preview);

      setFormData((prev) => ({
        ...prev,
        image: file
      }));

      setPreview(URL.createObjectURL(file));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);

    setFormData((prev) => ({
      ...prev,
      image: null
    }));

    setPreview(null);
  };

  const searchBagTag = (rawValue) => {
    const value = rawValue.toUpperCase();

    setFormData((prev) => ({
      ...prev,
      bagTagNumber: value
    }));

    setErrors((prev) => ({ ...prev, bagTagNumber: "" }));

    if (bagDebounceRef.current) clearTimeout(bagDebounceRef.current);

    if (value.trim().length < 3) {
      setBagSuggestions([]);
      setBagDuplicate(false);
      setSearchingBag(false);
      return;
    }

    bagDebounceRef.current = setTimeout(async () => {
      try {
        setSearchingBag(true);

        const [suggestRes, duplicateRes] = await Promise.all([
          API.get(`/lost-items/search-bag?keyword=${encodeURIComponent(value)}`),
          API.get(`/lost-items/check-bag?bagTag=${encodeURIComponent(value)}`)
        ]);

        setBagSuggestions(suggestRes.data || []);
        setBagDuplicate(Boolean(duplicateRes.data));
      } catch (err) {
        console.log(err);
        showToast("danger", "Failed to search bag tag.");
      } finally {
        setSearchingBag(false);
      }
    }, 400);
  };

  const searchTicket = (rawValue) => {
    const value = rawValue.toUpperCase();

    setFormData((prev) => ({
      ...prev,
      ticketNumber: value
    }));

    setErrors((prev) => ({ ...prev, ticketNumber: "" }));

    if (ticketDebounceRef.current) clearTimeout(ticketDebounceRef.current);

    if (value.trim().length < 3) {
      setTicketSuggestions([]);
      setTicketDuplicate(false);
      setSearchingTicket(false);
      return;
    }

    ticketDebounceRef.current = setTimeout(async () => {
      try {
        setSearchingTicket(true);

        const [suggestRes, duplicateRes] = await Promise.all([
          API.get(`/lost-items/search-ticket?keyword=${encodeURIComponent(value)}`),
          API.get(`/lost-items/check-ticket?ticket=${encodeURIComponent(value)}`)
        ]);

        setTicketSuggestions(suggestRes.data || []);
        setTicketDuplicate(Boolean(duplicateRes.data));
      } catch (err) {
        console.log(err);
        showToast("danger", "Failed to search ticket number.");
      } finally {
        setSearchingTicket(false);
      }
    }, 400);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.airportName.trim()) newErrors.airportName = "Airport is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.itemName.trim()) newErrors.itemName = "Item name is required.";
    if (!formData.itemDescription.trim()) newErrors.itemDescription = "Description is required.";
    if (!formData.bagTagNumber.trim()) newErrors.bagTagNumber = "Bag tag number is required.";
    if (!formData.ticketNumber.trim()) newErrors.ticketNumber = "Ticket number is required.";
    if (!formData.dateLost.trim()) newErrors.dateLost = "Date lost is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    if (preview) URL.revokeObjectURL(preview);

    setFormData(INITIAL_FORM);
    setPreview(null);
    setErrors({});
    setBagSuggestions([]);
    setTicketSuggestions([]);
    setBagDuplicate(false);
    setTicketDuplicate(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showToast("warning", "Please fill in all required fields.");
      return;
    }

    if (bagDuplicate || ticketDuplicate) {
      showToast("warning", "Please resolve duplicate bag tag / ticket number before submitting.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("airportName", formData.airportName.trim());
      data.append("passengerName", loggedInUser?.name || "");
      data.append("email", loggedInUser?.email || "");
      data.append("phone", formData.phone.trim());
      data.append("itemName", formData.itemName.trim());
      data.append("itemDescription", formData.itemDescription.trim());
      data.append("bagTagNumber", formData.bagTagNumber.trim().toUpperCase());
      data.append("ticketNumber", formData.ticketNumber.trim().toUpperCase());
      data.append("dateLost", formData.dateLost);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await API.post("/lost-items", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      showToast("success", "Lost item reported successfully!");
      resetForm();
    } catch (err) {
      console.log(err);
      showToast("danger", "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading || bagDuplicate || ticketDuplicate;

  return (
    <div style={{ background: "linear-gradient(180deg, #fff5f5 0%, #ffffff 35%)" }}>
      <div className="container py-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mx-auto rounded-4 p-4 p-md-5 position-relative overflow-hidden"
          style={{
            maxWidth: "760px",
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 20px 45px rgba(220,38,38,0.12)",
            border: "1px solid rgba(255,224,224,0.9)"
          }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="position-absolute d-none d-md-block"
            style={{ top: "-16px", right: "-10px", fontSize: "5rem", opacity: 0.06 }}
          >
            <FaBoxOpen color="#dc2626" />
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="mb-4">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: "52px",
                  height: "52px",
                  background: "linear-gradient(135deg, #ef4444, #dc2626)"
                }}
              >
                <FaBoxOpen size={22} color="#ffffff" />
              </div>
              <div>
                <h2
                  className="fw-bold mb-0"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    background: "linear-gradient(90deg, #dc2626, #ef4444)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  Report Lost Item
                </h2>
                <p className="text-secondary mb-0 small">
                  Tell us what you lost and we'll help you track it down
                </p>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} noValidate>
            <motion.div variants={fadeUp} custom={2} className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Passenger Name</label>
                <div className="input-group rounded-3 overflow-hidden shadow-sm">
                  <span className="input-group-text bg-white border-end-0">
                    <FaUser color="#dc2626" size={14} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 bg-light"
                    value={loggedInUser?.name || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <div className="input-group rounded-3 overflow-hidden shadow-sm">
                  <span className="input-group-text bg-white border-end-0">
                    <FaEnvelope color="#dc2626" size={14} />
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0 bg-light"
                    value={loggedInUser?.email || ""}
                    readOnly
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={3} className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <div className="input-group rounded-3 overflow-hidden shadow-sm">
                  <span className="input-group-text bg-white border-end-0">
                    <FaPhoneAlt color="#dc2626" size={14} />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-control border-start-0 ${errors.phone ? "is-invalid" : ""}`}
                    placeholder="e.g. 017XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone && <div className="text-danger small mt-1">{errors.phone}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Airport <span className="text-danger">*</span>
                </label>
                <div className="input-group rounded-3 overflow-hidden shadow-sm">
                  <span className="input-group-text bg-white border-end-0">
                    <FaPlaneDeparture color="#dc2626" size={14} />
                  </span>
                  <select
                    name="airportName"
                    className={`form-select border-start-0 ${errors.airportName ? "is-invalid" : ""}`}
                    value={formData.airportName}
                    onChange={handleChange}
                  >
                    <option value="">Select Airport</option>
                    {AIRPORTS.map((airport) => (
                      <option key={airport.value} value={airport.value}>
                        {airport.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.airportName && <div className="text-danger small mt-1">{errors.airportName}</div>}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="mb-3">
              <label className="form-label fw-semibold">
                Item Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="itemName"
                className={`form-control rounded-3 ${errors.itemName ? "is-invalid" : ""}`}
                placeholder="e.g. Black Backpack"
                value={formData.itemName}
                onChange={handleChange}
              />
              {errors.itemName && <div className="invalid-feedback">{errors.itemName}</div>}
            </motion.div>

            <motion.div variants={fadeUp} custom={5} className="mb-3">
              <label className="form-label fw-semibold">
                Item Description <span className="text-danger">*</span>
              </label>
              <textarea
                name="itemDescription"
                rows="3"
                className={`form-control rounded-3 ${errors.itemDescription ? "is-invalid" : ""}`}
                placeholder="Describe color, brand, contents, distinguishing marks..."
                value={formData.itemDescription}
                onChange={handleChange}
              />
              {errors.itemDescription && <div className="invalid-feedback">{errors.itemDescription}</div>}
            </motion.div>

            <motion.div variants={fadeUp} custom={6} className="row g-3 mb-2">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Bag Tag Number <span className="text-danger">*</span>
                </label>
                <div className="input-group rounded-3 overflow-hidden shadow-sm">
                  <span className="input-group-text bg-white border-end-0">
                    <FaTag color="#dc2626" size={14} />
                  </span>
                  <input
                    type="text"
                    className={`form-control border-start-0 ${
                      errors.bagTagNumber || bagDuplicate ? "is-invalid" : ""
                    }`}
                    placeholder="e.g. BG123456"
                    value={formData.bagTagNumber}
                    onChange={(e) => searchBagTag(e.target.value)}
                  />
                </div>
                {errors.bagTagNumber && <div className="text-danger small mt-1">{errors.bagTagNumber}</div>}

                {searchingBag && <LoadingSpinner text="Checking Bag Tag..." />}

                <BagTagSuggestions
                  suggestions={bagSuggestions}
                  value={formData.bagTagNumber}
                  duplicate={bagDuplicate}
                  onSelect={(tag) =>
                    setFormData((prev) => ({
                      ...prev,
                      bagTagNumber: tag.toUpperCase()
                    }))
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Ticket Number <span className="text-danger">*</span>
                </label>
                <div className="input-group rounded-3 overflow-hidden shadow-sm">
                  <span className="input-group-text bg-white border-end-0">
                    <FaTicketAlt color="#dc2626" size={14} />
                  </span>
                  <input
                    type="text"
                    className={`form-control border-start-0 ${
                      errors.ticketNumber || ticketDuplicate ? "is-invalid" : ""
                    }`}
                    placeholder="e.g. TK987654"
                    value={formData.ticketNumber}
                    onChange={(e) => searchTicket(e.target.value)}
                  />
                </div>
                {errors.ticketNumber && <div className="text-danger small mt-1">{errors.ticketNumber}</div>}

                {searchingTicket && <LoadingSpinner text="Checking Ticket Number..." />}

                <TicketSuggestions
                  suggestions={ticketSuggestions}
                  value={formData.ticketNumber}
                  duplicate={ticketDuplicate}
                  onSelect={(ticket) =>
                    setFormData((prev) => ({
                      ...prev,
                      ticketNumber: ticket.toUpperCase()
                    }))
                  }
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {(bagDuplicate || ticketDuplicate) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="alert alert-warning d-flex align-items-center rounded-3 mt-2"
                >
                  <FaExclamationTriangle className="me-2 flex-shrink-0" />
                  Please enter a unique Bag Tag Number and Ticket Number.
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={fadeUp} custom={7} className="mb-3 mt-2">
              <label className="form-label fw-semibold">
                Date Lost <span className="text-danger">*</span>
              </label>
              <div className="input-group rounded-3 overflow-hidden shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                  <FaCalendarAlt color="#dc2626" size={14} />
                </span>
                <input
                  type="date"
                  name="dateLost"
                  className={`form-control border-start-0 ${errors.dateLost ? "is-invalid" : ""}`}
                  value={formData.dateLost}
                  onChange={handleChange}
                  max={getLocalToday()}
                />
              </div>
              {errors.dateLost && <div className="text-danger small mt-1">{errors.dateLost}</div>}
            </motion.div>

            <motion.div variants={fadeUp} custom={8} className="mb-3">
              <label className="form-label fw-bold">
                <FaCamera className="me-1" color="#dc2626" />
                Upload Item Photo
              </label>
              <input
                type="file"
                name="image"
                className="form-control rounded-3"
                accept="image/*"
                onChange={handleChange}
              />

              <ImagePreview
                file={formData.image}
                preview={preview}
                onRemove={handleRemoveImage}
              />
            </motion.div>

            <motion.div variants={fadeUp} custom={9}>
              <motion.button
                type="submit"
                whileHover={{ scale: isSubmitDisabled ? 1 : 1.02, boxShadow: "0 10px 25px rgba(220,38,38,0.3)" }}
                whileTap={{ scale: isSubmitDisabled ? 1 : 0.97 }}
                className="btn w-100 text-white py-2 rounded-pill fw-semibold border-0 mt-2"
                style={{ background: "linear-gradient(90deg, #ef4444, #dc2626)" }}
                disabled={isSubmitDisabled}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Submitting...
                  </>
                ) : (
                  "Submit Lost Report"
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      <ToastMessage
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}

export default ReportLost;