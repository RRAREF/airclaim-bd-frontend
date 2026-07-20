import { useEffect, useState } from "react";
import API from "../api/api";

function Dashboard() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [stats, setStats] = useState({
        totalLostReports: 0,
        totalFoundReports: 0,
        matchedReports: 0,
        pendingReports: 0
    });

    useEffect(() => {

        if (user?.email) {
            loadStats();
        }

        // eslint-disable-next-line
    }, []);

    const loadStats = async () => {

        try {

            const res = await API.get(`/dashboard/stats/${user.email}`);

            console.log(res.data);

            setStats({
                totalLostReports: res.data.totalLostReports || 0,
                totalFoundReports: res.data.totalFoundReports || 0,
                matchedReports: res.data.matchedReports || 0,
                pendingReports: res.data.pendingReports || 0
            });

        } catch (error) {

            console.log(error);

            alert("Failed to load dashboard statistics.");

        }

    };

    return (

        <div className="container mt-4">

            <h2 className="mb-3">✈️ AirClaim BD Dashboard</h2>

            <h4 className="mb-4">
                Welcome, {user?.name}
            </h4>

            <div className="card p-3 mb-4 shadow">

                <h5>Name : {user?.name}</h5>
                <h5>Email : {user?.email}</h5>
                <h5>User ID : {user?.id}</h5>

            </div>

            <div className="row">

                <div className="col-md-3 mb-3">

                    <div className="card text-center shadow">

                        <div className="card-body">

                            <h5>Total Lost Reports</h5>

                            <h2>{stats.totalLostReports}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card text-center shadow">

                        <div className="card-body">

                            <h5>Total Found Reports</h5>

                            <h2>{stats.totalFoundReports}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card text-center shadow">

                        <div className="card-body">

                            <h5>Matched Reports</h5>

                            <h2>{stats.matchedReports}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3 mb-3">

                    <div className="card text-center shadow">

                        <div className="card-body">

                            <h5>Pending Reports</h5>

                            <h2>{stats.pendingReports}</h2>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;