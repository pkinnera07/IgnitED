import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
import "../styles/ExplorePage.css";
import axios from "axios"; // Import Axios for API calls
import { UserContext } from "../context/UserContext";
import loadingImage from "../assets/load.gif"; // Import loading image


const ExplorePage = () => {
  const [courses, setCourses] = useState([]);
  const { searchTerm } = useContext(UserContext); // Access searchTerm from context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://ignited-psi.vercel.app/api/courses");
        setCourses(response.data); // Set the fetched courses
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <img src={loadingImage} alt="Loading..." className="loading-image" />
      </div>
      );
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="main-page">
      <div className="explore-page">
        {/* <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        /> */}
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onClick={() => navigate(`/course/${course._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
