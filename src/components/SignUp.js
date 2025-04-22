import React, { useState, useContext } from "react";
import "../styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for API calls
import LoginImage from "../assets/login.jpg"; // Correctly import the image
import { UserContext } from "../context/UserContext"; // Import the UserContext

const Signup = () => {
  const { setUser, setUserType } = useContext(UserContext); // Access the setUser and setUserType functions from context
  const [isCodeSent, setIsCodeSent] = useState(false); // Track if the code has been sent
  const [userType, setLocalUserType] = useState("student"); // Default userType is "student"
  const [name, setFullName] = useState(""); // State for full name
  const [email, setEmail] = useState(""); // State for email
  const [verificationCode, setVerificationCode] = useState(""); // State for verification code
  const [message, setMessage] = useState(""); // State for success/error message
  const navigate = useNavigate(); // Hook for navigation

  // Update the global userType when the local userType changes
  const handleUserTypeChange = (type) => {
    setLocalUserType(type);
    setUserType(type); // Update the global userType in context
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const endpoint = "https://ignited-psi.vercel.app/api/auth/signup"; // Backend signup endpoint

    try {
      const response = await axios.post(endpoint, { name, email, userType });

      if (response.status === 200) {
        setMessage(response.data.message); // Message: "Verification code sent to your email."
        setIsCodeSent(true); // Now ask for the verification code
      }
    } catch (error) {
      setMessage("Signup failed. Please try again.");
      console.error("Error during signup:", error);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    const verifyEndpoint = "https://ignited-psi.vercel.app/api/auth/verify-code"; // Backend verification endpoint

    try {
      // Verify the code
      const verifyResponse = await axios.post(verifyEndpoint, {
        email,
        enteredCode: verificationCode,
      });

      if (verifyResponse.status === 200) {
        console.log("Code verification successful:", verifyResponse.data); // Log verification response
        setMessage(verifyResponse.data.message); // Message: "Code verified successfully!"

        const userEndpoint =
          userType === "student"
            ? `https://ignited-psi.vercel.app/api/students/email/${email}` // Pass email in the URL
            : `https://ignited-psi.vercel.app/api/instructors/email/${email}`; // Endpoint to fetch instructor data

        // Fetch the user data based on the email
        const userResponse = await axios.get(userEndpoint);

        if (userResponse.status === 200 && userResponse.data) {
          console.log("User data retrieved successfully:", userResponse.data); // Log user data
          setUser(userResponse.data); // Set the user data in the global context
          // Navigate to the appropriate dashboard based on user type
          if (userType === "student") {
            navigate("/StudentDashboard");
          } else if (userType === "instructor") {
            navigate("/InstructorDashboard");
          }
        } else {
          console.error("Failed to retrieve user data:", userResponse); // Log failure
          setMessage("Failed to retrieve user data. Please try again.");
        }
      } else {
        console.error("Code verification failed:", verifyResponse); // Log failure
        setMessage("Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during code verification or user retrieval:", error); // Log error
      setMessage("Invalid or expired code. Please try again.");
    }
  };

  return (
    <div>
      <div className="auth-page">
        <img className="auth-image" src={LoginImage} alt="Login" />

        <div className="auth-container">
          <h2>Signup</h2>

          {/* Radio Buttons for User Type */}
          <div className="user-type-radio">
            <div className="inline-flex rounded-lg">
              <input
                type="radio"
                name="userType"
                id="student"
                value="student"
                checked={userType === "student"}
                onChange={() => handleUserTypeChange("student")}
                hidden
              />
              <label
                htmlFor="student"
                className="radio text-center self-center py-2 px-4 rounded-lg cursor-pointer hover:opacity-75"
              >
                Student
              </label>
            </div>
            <div className="inline-flex rounded-lg">
              <input
                type="radio"
                name="userType"
                id="instructor"
                value="instructor"
                checked={userType === "instructor"}
                onChange={() => handleUserTypeChange("instructor")}
                hidden
              />
              <label
                htmlFor="instructor"
                className="radio text-center self-center py-2 px-4 rounded-lg cursor-pointer hover:opacity-75"
              >
                Instructor
              </label>
            </div>
          </div>

          {!isCodeSent ? (
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="auth-button">
                Signup as {userType === "student" ? "Student" : "Instructor"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode}>
              <div className="form-group">
                <label htmlFor="verificationCode">Verification Code</label>
                <input
                  type="text"
                  id="verificationCode"
                  placeholder="Enter the code sent to your email"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="auth-button">
                Verify Code
              </button>
            </form>
          )}

          {message && <p className="message">{message}</p>} {/* Display success/error message */}

          <div className="sep-line"></div>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;