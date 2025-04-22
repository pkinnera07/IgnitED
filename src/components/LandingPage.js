import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import s1 from "../assets/s1.png"; // Correctly import the image
import s2 from "../assets/s2.png"; // Correctly import the image

const LandingPage = () => {
  const [animate, setAnimate] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation when the component is mounted
    setAnimate(true);
  }, []);

  const handleNavigation = (path) => {
    // Trigger exit animation
    setExitAnimation(true);

    // Wait for the animation to complete before navigating
    setTimeout(() => {
      navigate(path);
    }, 1000); // Match the duration of the CSS transition
  };

  return (
    <div className="main-page">
      <div className="landing-page">
        <div
          className={`landing-content ${
            animate ? "slide-in-left" : ""
          } ${exitAnimation ? "slide-out-left" : ""}`}
        >
          <h1>Welcome to IgnitED</h1>
          <p>"Learning never exhausts the mind." -Leonardo da Vinci</p>
          <div className="button-container">
            <button
              className="explore-btn"
              onClick={() => handleNavigation("/explore")}
            >
              Explore Courses
            </button>
          </div>
        </div>
        <div
          className={`landing-image ${
            animate ? "slide-in-right" : ""
          } ${exitAnimation ? "slide-out-right" : ""}`}
        >
          <img className="student-img1" src={s2} alt="Students" />
          <img className="student-img2" src={s1} alt="Students" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
