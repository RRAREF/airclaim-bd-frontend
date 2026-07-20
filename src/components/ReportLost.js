import { useState, useEffect, useRef } from "react";
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
          API.get(`/lost-items/check-ticket?ticketNumber=${encodeURIComponent(value)}`)
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
    <div className="container mt-4 mb-5">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          <h2 className="mb-4 fw-bold text-danger">
            <i className="bi bi-bag-x me-2"></i>
            Report Lost Item
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Passenger Name</label>
                <input
                  type="text"
                  className="form-control rounded-3 bg-light"
                  value={loggedInUser?.name || ""}
                  readOnly
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control rounded-3 bg-light"
                  value={loggedInUser?.email || ""}
                  readOnly
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-control rounded-3 ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="e.g. 017XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Airport <span className="text-danger">*</span>
                </label>
                <select
                  name="airportName"
                  className={`form-select rounded-3 ${errors.airportName ? "is-invalid" : ""}`}
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
                {errors.airportName && <div className="invalid-feedback">{errors.airportName}</div>}
              </div>
            </div>

            <div className="mb-3">
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
            </div>

            <div className="mb-3">
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
            </div>

            <div className="row g-3 mb-2">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Bag Tag Number <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control rounded-3 ${
                    errors.bagTagNumber || bagDuplicate ? "is-invalid" : ""
                  }`}
                  placeholder="e.g. BG123456"
                  value={formData.bagTagNumber}
                  onChange={(e) => searchBagTag(e.target.value)}
                />
                {errors.bagTagNumber && <div className="invalid-feedback">{errors.bagTagNumber}</div>}

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
                <input
                  type="text"
                  className={`form-control rounded-3 ${
                    errors.ticketNumber || ticketDuplicate ? "is-invalid" : ""
                  }`}
                  placeholder="e.g. TK987654"
                  value={formData.ticketNumber}
                  onChange={(e) => searchTicket(e.target.value)}
                />
                {errors.ticketNumber && <div className="invalid-feedback">{errors.ticketNumber}</div>}

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
            </div>

            {(bagDuplicate || ticketDuplicate) && (
              <div className="alert alert-warning d-flex align-items-center rounded-3 mt-2">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Please enter a unique Bag Tag Number and Ticket Number.
              </div>
            )}

            <div className="mb-3 mt-2">
              <label className="form-label fw-semibold">
                Date Lost <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                name="dateLost"
                className={`form-control rounded-3 ${errors.dateLost ? "is-invalid" : ""}`}
                value={formData.dateLost}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
              />
              {errors.dateLost && <div className="invalid-feedback">{errors.dateLost}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                <i className="bi bi-camera me-1"></i>
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
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 rounded-3 py-2 fw-semibold mt-2"
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
            </button>
          </form>
        </div>
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