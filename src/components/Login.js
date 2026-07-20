import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Login({ setIsLoggedIn }) {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {

    try {

      const res = await API.post("/users/login", user);

      console.log("Response:", res.data);

      if (res.data.message === "Login Successful") {

        // Save logged-in user
        localStorage.setItem("user", JSON.stringify(res.data));

        // Save email separately (used by Notifications)
        localStorage.setItem("email", user.email);

        // If your backend returns user name, save it too
        if (res.data.name) {
          localStorage.setItem("name", res.data.name);
        }

        // Update login state
        setIsLoggedIn(true);

        alert("Login Successful");

        navigate("/dashboard");

      } else {

        alert("Invalid Email or Password");

      }

    } catch (err) {

      console.log(err);

      alert("Server Error");

    }

  };

  return (

    <div className="container mt-4">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow">

            <div className="card-body">

              <h2 className="text-center mb-4">
                Login
              </h2>

              <input
                type="email"
                className="form-control my-3"
                name="email"
                placeholder="Email"
                value={user.email}
                onChange={handleChange}
              />

              <input
                type="password"
                className="form-control my-3"
                name="password"
                placeholder="Password"
                value={user.password}
                onChange={handleChange}
              />

              <button
                className="btn btn-primary w-100"
                onClick={handleLogin}
              >
                Login
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Login;