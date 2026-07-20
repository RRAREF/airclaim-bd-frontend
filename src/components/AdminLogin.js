import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function AdminLogin() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await API.post(
                "/admin/login",
                formData
            );

            if (res.data.success) {

                localStorage.setItem(
                    "admin",
                    JSON.stringify(res.data)
                );

                alert("Admin Login Successful");

                navigate("/admin-dashboard");

            } else {

                alert(res.data.message);

            }

        } catch (err) {

            console.log(err);

            alert("Invalid Username or Password");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="text-center mb-4">
                                Admin Login
                            </h2>

                            <form onSubmit={handleSubmit}>

                                <input
                                    className="form-control mb-3"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    type="password"
                                    className="form-control mb-3"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    className="btn btn-dark w-100"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Logging in..."
                                        : "Login"}

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AdminLogin;