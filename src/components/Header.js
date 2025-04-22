import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import { BsPersonCircle } from "react-icons/bs";
import { BsHouseFill } from "react-icons/bs";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { UserContext } from "../context/UserContext"; // Import the UserContext

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, setUser, userType, setUserType } = useContext(UserContext); // Access the user data and setUser function from context
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    setUser(null); // Clear the user data
    setUserType(null); // Clear the user type
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>IgnitED</h1>
        <input
          className="search-bar"
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="button-board">
          <Link to="/" className="link-button">
            <BsHouseFill /> Home
          </Link>
        </div>
        <div className="button-board">
          <Link to="/explore" className="link-button">
            <BsFillGrid3X3GapFill /> Explore
          </Link>
        </div>
      </div>
      <div className="header-right">
        {!user ? (
          <>
            <div className="button-board">
              <Link to="/login" className="link-button">Login</Link>
            </div>
            <div className="button-board">
              <Link to="/signup" className="link-button">Sign Up</Link>
            </div>
          </>
        ) : (
          <>
            <div className="button-board">
              <Link
                to={userType === "student" ? "/StudentDashboard" : "/InstructorDashboard"}
                className="link-button"
              >
                Dashboard
              </Link>
            </div>
            <div className="profile-dropdown button-board">
              <button className="link-button">
                <BsPersonCircle /> {user.name}
              </button>
              <div className="dropdown-menu">
                <button onClick={handleLogout} className="dropdown-item">
                  Log Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
