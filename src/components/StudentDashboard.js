import React, { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom"; // Import Navigate for redirection
import "../styles/StudentDashboard.css";
import CourseCard from "./CourseCard"; // Assuming you have a CourseCard component for displaying courses
import { UserContext } from "../context/UserContext"; // Import the UserContext
import axios from "axios"; // Import Axios for API calls

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const { user } = useContext(UserContext); // Access the user data from context
  const [fullCourseData, setFullCourseData] = useState([]); // State to store full course details
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (user?.enrolledCourses?.length > 0) {
        try {
          const courseDetails = await Promise.all(
            user.enrolledCourses.map(async (course) => {
              const response = await axios.get(
                `https://ignited-psi.vercel.app/api/courses/name/${course.name}`
              );
              return response.data; // Return the full course data
            })
          );
          setFullCourseData(courseDetails); // Set the full course data
        } catch (err) {
          setError("Failed to load course details. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (user) {
      fetchCourseDetails();
    }
  }, [user]);

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="content">
            <h2>Overview</h2>
            <p>Welcome to your dashboard, {user?.name || "Student"}!</p>
            <p>Here is an overview of your courses:</p>
            <ul>
              {user?.enrolledCourses?.length > 0 ? (
                user.enrolledCourses.map((course) => (
                  <li key={course._id}>{course.name}</li>
                ))
              ) : (
                <p>You are not enrolled in any courses yet.</p>
              )}
            </ul>
          </div>
        );
      case "courses":
        if (loading) {
          return <p>Loading enrolled courses...</p>;
        }

        if (error) {
          return <p style={{ color: "red" }}>{error}</p>;
        }

        return (
          <div className="content">
            <h2>Enrolled Courses</h2>
            <div className="course-grid">
              {fullCourseData.length > 0 ? (
                fullCourseData.map((course) => (
                  <CourseCard key={course._id} course={course} 
                  onClick={() => navigate(`/course/${course._id}`)}/>
                ))
              ) : (
                <p>You are not enrolled in any courses yet.</p>
              )}
            </div>
          </div>
        );
      case "grades":
        return (
          <div className="content">
            <h2>Grades</h2>
            <ul>
              <li>Course 1: A</li>
              <li>Course 2: B+</li>
              <li>Course 3: A-</li>
            </ul>
          </div>
        );
      case "certificates":
        return (
          <div className="content">
            <h2>Certificates</h2>
            <ul>
              <li>Course 1: Certificate of Completion</li>
              <li>Course 3: Certificate of Completion</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  // Redirect to home if the user is not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="main-page">
      <div className="student-dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          <h1>My Dashboard</h1>
          <button
            className={activeSection === "overview" ? "active" : ""}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </button>
          <button
            className={activeSection === "courses" ? "active" : ""}
            onClick={() => setActiveSection("courses")}
          >
            Courses Enrolled
          </button>
          <button
            className={activeSection === "grades" ? "active" : ""}
            onClick={() => setActiveSection("grades")}
          >
            Grades
          </button>
          <button
            className={activeSection === "certificates" ? "active" : ""}
            onClick={() => setActiveSection("certificates")}
          >
            Certificates
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;