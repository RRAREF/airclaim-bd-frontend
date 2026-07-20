import { useState, useEffect, useRef } from "react";
import BagTagSuggestions from "./BagTagSuggestions";
import TicketSuggestions from "./TicketSuggestions";
import LoadingSpinner from "./LoadingSpinner";
import ToastMessage from "./ToastMessage";
import API from "../api/api";

const AIRPORTS = [
  { value: "Dhaka Airport", label: "Hazrat Shahjalal International Airport" },
  { value: "Sylhet Airport", label: "Osmani International Airport" },
  { value: "Chattogram Airport", label: "Shah Amanat International Airport" },
  { value: "CoxBazar Airport", label: "Cox's Bazar Airport" },
  { value: "Saidpur Airport", label: "Saidpur Airport" }
];

const INITIAL_FORM = {
  ownerName: "",
  airportName: "",
  itemName: "",
  itemDescription: "",
  bagTagNumber: "",
  ticketNumber: "",
  dateFound: ""
};

function ReportFound() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
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
    };
  }, []);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
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
          API.get(`/found-items/search-bag?keyword=${encodeURIComponent(value)}`),
          API.get(`/found-items/check-bag?bagTag=${encodeURIComponent(value)}`)
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
          API.get(`/found-items/search-ticket?keyword=${encodeURIComponent(value)}`),
          API.get(`/found-items/check-ticket?ticketNumber=${encodeURIComponent(value)}`)
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

    if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required.";
    if (!formData.airportName.trim()) newErrors.airportName = "Airport is required.";
    if (!formData.itemName.trim()) newErrors.itemName = "Item name is required.";
    if (!formData.itemDescription.trim()) newErrors.itemDescription = "Description is required.";
    if (!formData.bagTagNumber.trim()) newErrors.bagTagNumber = "Bag tag number is required.";
    if (!formData.ticketNumber.trim()) newErrors.ticketNumber = "Ticket number is required.";
    if (!formData.dateFound.trim()) newErrors.dateFound = "Date found is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
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
      const payload = {
        ownerName: formData.ownerName.trim(),
        email: user?.email,
        airportName: formData.airportName.trim(),
        itemName: formData.itemName.trim(),
        itemDescription: formData.itemDescription.trim(),
        bagTagNumber: formData.bagTagNumber.trim().toUpperCase(),
        ticketNumber: formData.ticketNumber.trim().toUpperCase(),
        dateFound: formData.dateFound,
        status: "Pending"
      };

      await API.post("/found-items", payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      showToast("success", "Found item reported successfully!");
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
          <h2 className="mb-4 fw-bold text-success">
            <i className="bi bi-geo-alt me-2"></i>
            Report Found Item
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Owner Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="ownerName"
                className={`form-control rounded-3 ${
                  errors.ownerName ? "is-invalid" : ""
                }`}
                placeholder="Enter your name"
                value={formData.ownerName}
                onChange={handleChange}
              />
              {errors.ownerName && (
                <div className="invalid-feedback">
                  {errors.ownerName}
                </div>
              )}
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

            <div className="row g-3 mb-3 mt-2">
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

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Date Found <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="dateFound"
                  className={`form-control rounded-3 ${errors.dateFound ? "is-invalid" : ""}`}
                  value={formData.dateFound}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.dateFound && <div className="invalid-feedback">{errors.dateFound}</div>}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 rounded-3 py-2 fw-semibold mt-2"
              disabled={isSubmitDisabled}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Submitting...
                </>
              ) : (
                "Submit Found Report"
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

export default ReportFound;