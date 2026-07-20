import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

function Navbar({ isLoggedIn, setIsLoggedIn }) {

  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {

    if (isLoggedIn) {

      loadUnreadCount();

    }

  }, [isLoggedIn]);

  const loadUnreadCount = async () => {

    try {

      const email = localStorage.getItem("email");

      if (!email) return;

      const res = await API.get(`/notifications/count/${email}`);

      setUnreadCount(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  const handleLogout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("email");

    setIsLoggedIn(false);

    alert("Logged Out Successfully");

    navigate("/");

  };

  return (

    <nav className="navbar navbar-dark bg-primary px-3">

      <span className="navbar-brand">
        ✈️ AirClaim BD
      </span>

      <div>

        <Link
          className="btn btn-light btn-sm mx-1"
          to="/"
        >
          Home
        </Link>

        {!isLoggedIn && (

          <>

            <Link
              className="btn btn-success btn-sm mx-1"
              to="/login"
            >
              Login
            </Link>

            <Link
              className="btn btn-warning btn-sm mx-1"
              to="/signup"
            >
              Sign Up
            </Link>

          </>

        )}

        {isLoggedIn && (

          <>

            <Link
              className="btn btn-secondary btn-sm mx-1"
              to="/dashboard"
            >
              Dashboard
            </Link>

            <Link
              className="btn btn-danger btn-sm mx-1"
              to="/lost"
            >
              Report Lost
            </Link>

            <Link
              className="btn btn-info btn-sm mx-1"
              to="/found"
            >
              Report Found
            </Link>

            <Link
              className="btn btn-warning btn-sm mx-1"
              to="/my-reports"
            >
              My Reports
            </Link>

            <Link
              className="btn btn-light btn-sm mx-1 position-relative"
              to="/notifications"
            >
              🔔

              {unreadCount > 0 && (

                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                >
                  {unreadCount}
                </span>

              )}

            </Link>

            <button
              className="btn btn-dark btn-sm mx-1"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>

        )}

      </div>

    </nav>

  );

}

export default Navbar;