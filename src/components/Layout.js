import React from "react";
import Header from "./Header"; // Import the Header component
import "../styles/Loader.css"; // Import the loader styles

const Layout = ({ children, isLoading }) => {
  return (
    <div className="main-page">
      <Header /> {/* Header will always be present */}
      <div className="page-content">
        {isLoading ? (
          <div className="loader">
            <div className="line"></div> {/* Spinner for loading state */}
            <p>Loading...</p> {/* Loading text */}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default Layout;