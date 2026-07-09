import { useEffect, useState } from "react";
import API from "../api/api";

function MyReports() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [reports, setReports] = useState([]);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {

        try {

            const res = await API.get(
                `/lost-items/my-reports/${user.email}`
            );

            setReports(res.data);

        } catch (err) {

            console.log(err);

            alert("Failed to load reports.");

        }

    };

    return (

        <div className="container mt-4">

            <h2 className="mb-4">
                📄 My Lost Reports
            </h2>

            {reports.length === 0 ? (

                <div className="alert alert-warning">

                    No reports found.

                </div>

            ) : (

                reports.map((report) => (

                    <div
                        className="card shadow-lg mb-4"
                        key={report.id}
                    >

                        <div className="row g-0">

                            <div className="col-md-4 text-center p-3">

                                {report.imageBase64 ? (

                                    <img
                                        src={`data:image/jpeg;base64,${report.imageBase64}`}
                                        alt="Lost Item"
                                        className="img-fluid rounded"
                                        style={{
                                            maxHeight: "250px",
                                            objectFit: "cover"
                                        }}
                                    />

                                ) : (

                                    <div
                                        className="border rounded d-flex justify-content-center align-items-center"
                                        style={{
                                            height: "250px",
                                            background: "#f8f9fa"
                                        }}
                                    >
                                        <h5>No Image</h5>
                                    </div>

                                )}

                            </div>

                            <div className="col-md-8">

                                <div className="card-body">

                                    <h3 className="text-primary">

                                        {report.itemName}

                                    </h3>

                                    <hr />

                                    <p>
                                        <strong>Description :</strong><br />
                                        {report.itemDescription}
                                    </p>

                                    <p>
                                        <strong>Airport :</strong>
                                        {" "}
                                        {report.airportName}
                                    </p>

                                    <p>
                                        <strong>Phone :</strong>
                                        {" "}
                                        {report.phone}
                                    </p>

                                    <p>
                                        <strong>Bag Tag :</strong>
                                        {" "}
                                        {report.bagTagNumber}
                                    </p>

                                    <p>
                                        <strong>Ticket Number :</strong>
                                        {" "}
                                        {report.ticketNumber}
                                    </p>

                                    <p>
                                        <strong>Date Lost :</strong>
                                        {" "}
                                        {report.dateLost}
                                    </p>

                                    <h5>

                                        Status :

                                        {" "}

                                        <span
                                            className={
                                                report.status === "Matched"
                                                    ? "badge bg-success"
                                                    : "badge bg-warning text-dark"
                                            }
                                        >

                                            {report.status}

                                        </span>

                                    </h5>

                                </div>

                            </div>

                        </div>

                    </div>

                ))

            )}

        </div>

    );

}

export default MyReports;