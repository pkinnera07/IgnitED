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
  const [recommendations, setRecommendations] = useState([]); // State to store course recommendations
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

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const enrolledCourseIds = user?.enrolledCourses?.map((course) => course._id) || [];

        if (user?.enrolledCourses?.length > 0) {
          // Fetch recommendations for the first enrolled course
          const courseId = user.enrolledCourses[0]._id;
          const response = await axios.get(
            `https://course-recommendations-api.vercel.app/recommendations/${courseId}`
          );

          let recommendedCourses = response.data || [];

          // Filter out enrolled courses from recommendations
          recommendedCourses = recommendedCourses.filter(
            (course) => !enrolledCourseIds.includes(course._id)
          );

          if (recommendedCourses.length > 0) {
            setRecommendations(recommendedCourses); // Set recommendations if available
          } else {
            // Fetch two random courses as fallback
            const randomCoursesResponse = await axios.get(
              "https://ignited-psi.vercel.app/api/courses/random?count=2"
            );
            const randomCourses = randomCoursesResponse.data.filter(
              (course) => !enrolledCourseIds.includes(course._id)
            );
            setRecommendations(randomCourses);
          }
        } else {
          // Fetch two random courses as fallback if no enrolled courses
          const randomCoursesResponse = await axios.get(
            "https://ignited-psi.vercel.app/api/courses/random?count=2"
          );
          setRecommendations(randomCoursesResponse.data);
        }
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError("Failed to load recommendations. Please try again later.");
      }
    };

    fetchRecommendations();
  }, [user]);

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="content">
            <h2 className="section-title">Overview</h2>
            <h1>Welcome to your dashboard, {user?.name || "Student"}!</h1>
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
            <h3 className="section-subtitle">Recommended for you</h3>
            <div className="course-grid">
              {recommendations.length > 0 ? (
                recommendations.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onClick={() => navigate(`/course/${course._id}`)}
                  />
                ))
              ) : (
                <p>No recommendations available at the moment.</p>
              )}
            </div>
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
            <h2 className="section-title">Enrolled Courses</h2>
            <div className="course-grid">
              {fullCourseData.length > 0 ? (
                fullCourseData.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onClick={() => navigate(`/course/${course._id}`)}
                  />
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
            <h2 className="section-title">Grades</h2>
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
            <h2 className="section-title">Certificates</h2>
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
            className= {activeSection === "overview" ? "active sidebar-btn" : "sidebar-btn"}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </button>
          <button
            className={activeSection === "courses" ? "active sidebar-btn" : "sidebar-btn"}
            onClick={() => setActiveSection("courses")}
          >
            Courses Enrolled
          </button>
          <button
            className={activeSection === "grades" ? "active sidebar-btn" : "sidebar-btn"}
            onClick={() => setActiveSection("grades")}
          >
            Grades
          </button>
          <button
            className={activeSection === "certificates" ? "active sidebar-btn" : "sidebar-btn"}
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