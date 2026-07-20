import { useEffect, useMemo, useState } from "react";
import API from "../api/api";
import LoadingSpinner from "./LoadingSpinner";
import ToastMessage from "./ToastMessage";

function AdminLostReports() {

    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");

    const [modalImage, setModalImage] = useState(null);

    const [deletingId, setDeletingId] = useState(null);

    const [confirmReport, setConfirmReport] = useState(null);

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
        setToast({
            show: true,
            type,
            message
        });
    };

    const loadReports = async () => {

        setLoading(true);

        try {

            const res = await API.get("/admin/lost-items");

            setReports(res.data || []);

        } catch (err) {

            console.log(err);

            showToast(
                "danger",
                "Failed to load lost reports."
            );

        } finally {

            setLoading(false);

        }

    };

    const filteredReports = useMemo(() => {

        const keyword = searchTerm
            .trim()
            .toLowerCase();

        if (!keyword) return reports;

        return reports.filter((report) => {

            return (

                (report.itemName || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (report.passengerName || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (report.bagTagNumber || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (report.ticketNumber || "")
                    .toLowerCase()
                    .includes(keyword)

            );

        });

    }, [reports, searchTerm]);

    const requestDelete = (report) => {

        setConfirmReport(report);

    };

    const cancelDelete = () => {

        setConfirmReport(null);

    };

    const confirmDelete = async () => {

        if (!confirmReport) return;

        const id = confirmReport.id;

        setDeletingId(id);

        try {

            await API.delete(
                `/admin/lost-items/${id}`
            );

            setReports(prev =>
                prev.filter(r => r.id !== id)
            );

            showToast(
                "success",
                "Lost report deleted successfully."
            );

        } catch (err) {

            console.log(err);

            showToast(
                "danger",
                "Delete failed."
            );

        } finally {

            setDeletingId(null);

            setConfirmReport(null);

        }

    };

    const openImage = (image) => {

        setModalImage(image);

    };

    const closeImage = () => {

        setModalImage(null);

    };
        return (

        <div className="container mt-4 mb-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="fw-bold">
                    Lost Reports
                </h2>

                <button
                    className="btn btn-primary"
                    onClick={loadReports}
                >
                    Refresh
                </button>

            </div>

            <div className="mb-4">

                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Item Name, Passenger, Bag Tag or Ticket..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                />

            </div>

            {loading && (
                <LoadingSpinner
                    text="Loading Lost Reports..."
                />
            )}

            {!loading && (

                <div className="table-responsive">

                    <table className="table table-bordered table-hover">

                        <thead className="table-dark">

                        <tr>

                            <th>ID</th>

                            <th>Image</th>

                            <th>Passenger</th>

                            <th>Item</th>

                            <th>Airport</th>

                            <th>Bag Tag</th>

                            <th>Ticket</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                        </thead>

                        <tbody>

                        {filteredReports.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="9"
                                    className="text-center"
                                >
                                    No reports found.
                                </td>

                            </tr>

                        ) : (

                            filteredReports.map(report => (

                                <tr key={report.id}>

                                    <td>{report.id}</td>

                                    <td>

                                        {report.imageBase64 ? (

                                            <img

                                                src={`data:image/jpeg;base64,${report.imageBase64}`}

                                                alt="item"

                                                width="70"

                                                style={{
                                                    cursor: "pointer"
                                                }}

                                                onClick={() =>
                                                    openImage(report.imageBase64)
                                                }

                                            />

                                        ) : (

                                            "No Image"

                                        )}

                                    </td>

                                    <td>
                                        {report.passengerName}
                                    </td>

                                    <td>
                                        {report.itemName}
                                    </td>

                                    <td>
                                        {report.airportName}
                                    </td>

                                    <td>
                                        {report.bagTagNumber}
                                    </td>

                                    <td>
                                        {report.ticketNumber}
                                    </td>

                                    <td>

                                        <span

                                            className={
                                                report.status === "Matched"
                                                    ? "badge bg-success"
                                                    : "badge bg-warning text-dark"
                                            }

                                        >

                                            {report.status}

                                        </span>

                                    </td>

                                    <td>

                                        <button

                                            className="btn btn-danger btn-sm"

                                            disabled={
                                                deletingId === report.id
                                            }

                                            onClick={() =>
                                                requestDelete(report)
                                            }

                                        >

                                            {deletingId === report.id
                                                ? "Deleting..."
                                                : "Delete"}

                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                        </tbody>

                    </table>

                </div>

            )}

            {modalImage && (

                <div

                    className="modal fade show d-block"

                    style={{
                        backgroundColor: "rgba(0,0,0,.6)"
                    }}

                    onClick={closeImage}

                >

                    <div

                        className="modal-dialog modal-lg modal-dialog-centered"

                        onClick={(e) =>
                            e.stopPropagation()
                        }

                    >

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5>
                                    Item Image
                                </h5>

                                <button

                                    className="btn-close"

                                    onClick={closeImage}

                                ></button>

                            </div>

                            <div className="modal-body text-center">

                                <img

                                    src={`data:image/jpeg;base64,${modalImage}`}

                                    alt="preview"

                                    className="img-fluid"

                                />

                            </div>

                        </div>

                    </div>

                </div>

            )}

            {confirmReport && (

                <div

                    className="modal fade show d-block"

                    style={{
                        backgroundColor: "rgba(0,0,0,.6)"
                    }}

                    onClick={cancelDelete}

                >

                    <div

                        className="modal-dialog modal-dialog-centered"

                        onClick={(e) =>
                            e.stopPropagation()
                        }

                    >

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5>

                                    Delete Report

                                </h5>

                            </div>

                            <div className="modal-body">

                                Are you sure you want to delete this report?

                            </div>

                            <div className="modal-footer">

                                <button

                                    className="btn btn-secondary"

                                    onClick={cancelDelete}

                                >

                                    Cancel

                                </button>

                                <button
                                        className="btn btn-danger"
                                        onClick={confirmDelete}
                                        disabled={deletingId === confirmReport.id}
                                    >
                                        {deletingId === confirmReport.id
                                            ? "Deleting..."
                                            : "Delete"}

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

            <ToastMessage

                show={toast.show}

                type={toast.type}

                message={toast.message}

                onClose={() =>
                    setToast(prev => ({
                        ...prev,
                        show: false
                    }))
                }

            />

        </div>

    );

}

export default AdminLostReports;