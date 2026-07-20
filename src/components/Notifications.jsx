import { useEffect, useState } from "react";
import API from "../api/api";
import LoadingSpinner from "./LoadingSpinner";

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const email = localStorage.getItem("email");

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {

        try {

            const response = await API.get(`/notifications/${email}`);

            setNotifications(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const markAsRead = async (id) => {

        try {

            await API.put(`/notifications/read/${id}`);

            loadNotifications();

        } catch (error) {

            console.log(error);

        }

    };

    if (loading) {

        return <LoadingSpinner text="Loading Notifications..." />;

    }

    return (

        <div className="container mt-4">

            <h2 className="mb-4">
                🔔 Notifications
            </h2>

            {

                notifications.length === 0 ?

                    (

                        <div className="alert alert-info">

                            No notifications available.

                        </div>

                    )

                    :

                    notifications.map(notification => (

                        <div
                            key={notification.id}
                            className={`card mb-3 shadow-sm ${notification.read ? "" : "border-primary"}`}
                        >

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <h5>

                                            {notification.title}

                                        </h5>

                                        <p>

                                            {notification.message}

                                        </p>

                                        <small className="text-muted">

                                            {notification.createdAt.replace("T", " ")}

                                        </small>

                                    </div>

                                    {

                                        !notification.read &&

                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => markAsRead(notification.id)}
                                        >

                                            Mark as Read

                                        </button>

                                    }

                                </div>

                            </div>

                        </div>

                    ))

            }

        </div>

    );

}

export default Notifications;