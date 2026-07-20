import { useEffect, useMemo, useState } from "react";
import API from "../api/api";
import LoadingSpinner from "./LoadingSpinner";
import ToastMessage from "./ToastMessage";

function AdminFoundReports() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState(null);

    const [toast, setToast] = useState({
        show: false,
        type: "",
        message: ""
    });

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {

        setLoading(true);

        try {

            const res = await API.get("/admin/found-items");

            setReports(res.data);

        } catch (err) {

            console.log(err);

            setToast({
                show: true,
                type: "danger",
                message: "Failed to load found reports."
            });

        } finally {

            setLoading(false);

        }

    };

    const filteredReports = useMemo(() => {

        return reports.filter(report => {

            const airport = (report.airport || "").toLowerCase();
            const owner = (report.ownerName || "").toLowerCase();
            const bag = (report.bagTagNumber || "").toLowerCase();

            return (
                airport.includes(search.toLowerCase()) ||
                owner.includes(search.toLowerCase()) ||
                bag.includes(search.toLowerCase())
            );

        });

    }, [reports, search]);

    const deleteReport = async (id) => {

        if (!window.confirm("Delete this report?")) return;

        setDeleteId(id);

        try {

            await API.delete(`/admin/found-items/${id}`);

            setReports(reports.filter(r => r.id !== id));

            setToast({
                show: true,
                type: "success",
                message: "Found report deleted successfully."
            });

        } catch (err) {

            console.log(err);

            setToast({
                show: true,
                type: "danger",
                message: "Delete failed."
            });

        } finally {

            setDeleteId(null);

        }

    };

    if (loading) {

        return <LoadingSpinner text="Loading Found Reports..." />;

    }

    return (

        <div className="container mt-4">

            <h2 className="mb-4">
                🎒 Manage Found Reports
            </h2>

            <input
                className="form-control mb-3"
                placeholder="Search..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
            />

            <div className="table-responsive">

                <table className="table table-bordered table-hover">

                    <thead className="table-warning">

                        <tr>

                            <th>ID</th>
                            <th>Owner</th>
                            <th>Airport</th>
                            <th>Bag Tag</th>
                            <th>Status</th>
                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                    {filteredReports.map(report=>(

                        <tr key={report.id}>

                            <td>{report.id}</td>
                            <td>{report.ownerName}</td>
                            <td>{report.airportName}</td>
                            <td>{report.bagTagNumber}</td>
                            <td>{report.status}</td>

                            <td>

                                <button
                                    className="btn btn-danger btn-sm"
                                    disabled={deleteId===report.id}
                                    onClick={()=>deleteReport(report.id)}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

            <ToastMessage
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() =>
                    setToast({
                        ...toast,
                        show:false
                    })
                }
            />

        </div>

    );

}

export default AdminFoundReports;