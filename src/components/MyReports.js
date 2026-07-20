import { useEffect, useMemo, useState } from "react";
import API from "../api/api";
import LoadingSpinner from "./LoadingSpinner";
import ToastMessage from "./ToastMessage";

function MyReports() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [lostReports, setLostReports] = useState([]);
  const [foundReports, setFoundReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalImage, setModalImage] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: ""
  });

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const [lostRes, foundRes] = await Promise.all([
        API.get(`/lost-items/my-reports/${user.email}`),
        API.get(`/found-items/my-reports/${user.email}`)
      ]);
      setLostReports(lostRes.data || []);
      setFoundReports(foundRes.data || []);
    } catch (err) {
      console.log(err);
      showToast("danger", "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  const sortedLostReports = useMemo(() => {
    const copy = [...lostReports];
    copy.sort((a, b) => {
      const dateA = new Date(a.dateLost || 0).getTime();
      const dateB = new Date(b.dateLost || 0).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return (b.id || 0) - (a.id || 0);
    });
    return copy;
  }, [lostReports]);

  const sortedFoundReports = useMemo(() => {
    const copy = [...foundReports];
    copy.sort((a, b) => {
      const dateA = new Date(a.dateFound || 0).getTime();
      const dateB = new Date(b.dateFound || 0).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return (b.id || 0) - (a.id || 0);
    });
    return copy;
  }, [foundReports]);

  const filteredLostReports = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sortedLostReports;
    return sortedLostReports.filter(
      (report) =>
        (report.itemName || "").toLowerCase().includes(term) ||
        (report.bagTagNumber || "").toLowerCase().includes(term) ||
        (report.ticketNumber || "").toLowerCase().includes(term)
    );
  }, [sortedLostReports, searchTerm]);

  const filteredFoundReports = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sortedFoundReports;
    return sortedFoundReports.filter(
      (report) =>
        (report.itemName || "").toLowerCase().includes(term) ||
        (report.bagTagNumber || "").toLowerCase().includes(term) ||
        (report.ticketNumber || "").toLowerCase().includes(term)
    );
  }, [sortedFoundReports, searchTerm]);

  const openImageModal = (imageBase64) => {
    setModalImage(imageBase64);
  };

  const closeImageModal = () => {
    setModalImage(null);
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h2 className="fw-bold text-primary mb-0">
          <i className="bi bi-file-earmark-text me-2"></i>
          My Lost Reports
        </h2>

        <span className="badge bg-primary rounded-pill fs-6">
          {filteredLostReports.length} of {lostReports.length} report
          {lostReports.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mb-4">
        <div className="input-group rounded-3 shadow-sm">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search by Item Name, Bag Tag, or Ticket Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setSearchTerm("")}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      {loading && <LoadingSpinner text="Loading your reports..." />}

      {!loading && filteredLostReports.length === 0 && (
        <div className="text-center py-5 rounded-4 bg-light border">
          <i className="bi bi-inbox display-1 text-secondary"></i>
          <h4 className="mt-3 text-secondary">
            {lostReports.length === 0
              ? "No reports found."
              : "No reports match your search."}
          </h4>
          <p className="text-muted mb-0">
            {lostReports.length === 0
              ? "Items you report as lost will appear here."
              : "Try a different keyword."}
          </p>
        </div>
      )}

      {!loading &&
        filteredLostReports.map((report) => (
          <div className="card shadow-sm mb-4 border-0 rounded-4 overflow-hidden" key={report.id}>
            <div className="row g-0">
              <div className="col-md-4 text-center p-3 bg-light">
                {report.imageBase64 ? (
                  <img
                    src={`data:image/jpeg;base64,${report.imageBase64}`}
                    alt={report.itemName}
                    role="button"
                    className="img-fluid rounded-3 shadow-sm"
                    style={{
                      maxHeight: "250px",
                      objectFit: "cover",
                      cursor: "pointer",
                      width: "100%"
                    }}
                    onClick={() => openImageModal(report.imageBase64)}
                  />
                ) : (
                  <div
                    className="border rounded-3 d-flex flex-column justify-content-center align-items-center"
                    style={{
                      height: "250px",
                      background: "#f8f9fa"
                    }}
                  >
                    <i className="bi bi-image text-secondary fs-1"></i>
                    <h6 className="text-secondary mt-2 mb-0">No Image</h6>
                  </div>
                )}
              </div>

              <div className="col-md-8">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <h3 className="text-primary fw-bold mb-0">{report.itemName}</h3>

                    <span
                      className={
                        report.status === "Matched"
                          ? "badge bg-success rounded-pill px-3 py-2"
                          : "badge bg-warning text-dark rounded-pill px-3 py-2"
                      }
                    >
                      {report.status || "Pending"}
                    </span>
                  </div>

                  <hr />

                  <p>
                    <strong>Description:</strong>
                    <br />
                    {report.itemDescription}
                  </p>

                  <div className="row">
                    <div className="col-sm-6 mb-2">
                      <strong>Airport:</strong> {report.airportName}
                    </div>
                    <div className="col-sm-6 mb-2">
                      <strong>Phone:</strong> {report.phone}
                    </div>
                    <div className="col-sm-6 mb-2">
                      <strong>Bag Tag:</strong> {report.bagTagNumber}
                    </div>
                    <div className="col-sm-6 mb-2">
                      <strong>Ticket Number:</strong> {report.ticketNumber}
                    </div>
                    <div className="col-sm-6 mb-2">
                      <strong>Date Lost:</strong> {report.dateLost}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

      <hr className="my-5" />

      <h2 className="fw-bold text-success mb-4">
        <i className="bi bi-box-seam me-2"></i>
        My Found Reports
      </h2>

      {!loading && filteredFoundReports.length === 0 ? (
        <div className="alert alert-info">No Found Reports.</div>
      ) : (
        !loading &&
        filteredFoundReports.map((report) => (
          <div className="card shadow-sm mb-4 border-0 rounded-4" key={report.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <h4 className="text-success fw-bold mb-0">{report.itemName}</h4>

                <span
                  className={
                    report.status === "Matched"
                      ? "badge bg-success rounded-pill px-3 py-2"
                      : "badge bg-warning text-dark rounded-pill px-3 py-2"
                  }
                >
                  {report.status || "Pending"}
                </span>
              </div>

              <hr />

              <p>
                <strong>Description:</strong>
                <br />
                {report.itemDescription}
              </p>

              <div className="row">
                <div className="col-sm-6 mb-2">
                  <strong>Airport:</strong> {report.airportName}
                </div>
                <div className="col-sm-6 mb-2">
                  <strong>Owner:</strong> {report.ownerName}
                </div>
                <div className="col-sm-6 mb-2">
                  <strong>Bag Tag:</strong> {report.bagTagNumber}
                </div>
                <div className="col-sm-6 mb-2">
                  <strong>Ticket Number:</strong> {report.ticketNumber}
                </div>
                <div className="col-sm-6 mb-2">
                  <strong>Date Found:</strong> {report.dateFound}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {modalImage && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={closeImageModal}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 overflow-hidden">
              <div className="modal-header border-0">
                <h5 className="modal-title">Item Photo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeImageModal}
                ></button>
              </div>
              <div className="modal-body text-center p-0">
                <img
                  src={`data:image/jpeg;base64,${modalImage}`}
                  alt="Lost item preview"
                  className="img-fluid w-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastMessage
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}

export default MyReports;