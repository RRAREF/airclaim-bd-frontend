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

        // Update login state
        setIsLoggedIn(true);

        alert("Login Successful");

        // Go to dashboard
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

      <h2>Login</h2>

      <input
        className="form-control my-2"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        className="form-control my-2"
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <button
        className="btn btn-primary"
        onClick={handleLogin}
      >
        Login
      </button>

    </div>

  );

}

export default Login;