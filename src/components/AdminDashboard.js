import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import LoadingSpinner from "./LoadingSpinner";
import ToastMessage from "./ToastMessage";

function AdminDashboard() {

    const [dashboard, setDashboard] = useState({
        totalUsers: 0,
        totalLostReports: 0,
        totalFoundReports: 0,
        matchedReports: 0,
        pendingReports: 0
    });

    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState({
        show: false,
        type: "",
        message: ""
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        setLoading(true);

        try {

            const response = await API.get("/dashboard/stats");

            setDashboard(response.data);

        } catch (error) {

            console.error(error);

            setToast({
                show: true,
                type: "danger",
                message: "Failed to load dashboard."
            });

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <LoadingSpinner text="Loading Dashboard..." />;

    }

    return (

        <div className="container mt-4 mb-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="fw-bold">
                    📊 Admin Dashboard
                </h2>

                <button
                    className="btn btn-primary"
                    onClick={loadDashboard}
                >
                    🔄 Refresh
                </button>

            </div>

            {/* Quick Actions */}

            <div className="row g-3 mb-4">

                <div className="col-md-3">
                    <Link
                        to="/admin/users"
                        className="btn btn-success w-100"
                    >
                        👥 Manage Users
                    </Link>
                </div>

                <div className="col-md-3">
                    <Link
                        to="/admin/lost-reports"
                        className="btn btn-danger w-100"
                    >
                        📦 Lost Reports
                    </Link>
                </div>
                

                <div className="col-md-3">
                    <Link
                        to="/admin/found-items"
                        className="btn btn-warning w-100"
                    >
                        🎒 Found Reports
                    </Link>
                </div>

                <div className="col-md-3">
                    <Link
                        to="/"
                        className="btn btn-secondary w-100"
                    >
                        🏠 Home
                    </Link>
                </div>

            </div>

            {/* Statistics */}

            <div className="row">

                <div className="col-md-4 mb-3">

                    <div className="card shadow text-center h-100">

                        <div className="card-body">

                            <h5>Total Users</h5>

                            <h2 className="text-primary">
                                {dashboard.totalUsers}
                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-4 mb-3">

                    <div className="card shadow text-center h-100">

                        <div className="card-body">

                            <h5>Total Lost Reports</h5>

                            <h2 className="text-danger">
                                {dashboard.totalLostReports}
                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-4 mb-3">

                    <div className="card shadow text-center h-100">

                        <div className="card-body">

                            <h5>Total Found Reports</h5>

                            <h2 className="text-success">
                                {dashboard.totalFoundReports}
                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-6 mb-3">

                    <div className="card shadow text-center h-100">

                        <div className="card-body">

                            <h5>Matched Reports</h5>

                            <h2 className="text-success">
                                {dashboard.matchedReports}
                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-6 mb-3">

                    <div className="card shadow text-center h-100">

                        <div className="card-body">

                            <h5>Pending Reports</h5>

                            <h2 className="text-warning">
                                {dashboard.pendingReports}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>

            <ToastMessage
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() =>
                    setToast({
                        ...toast,
                        show: false
                    })
                }
            />

        </div>

    );

}

export default AdminDashboard;