import React, { useState } from "react";
import "../styles/CourseCard.css";
import CImage from "../assets/login.jpg"; // Correctly import the image

const CourseCard = ({ course, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="course-card" 
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Section */}
      <div className="course-image-container">
        <img
          src={course.image || CImage}
          alt={course.name || "Course"}
          className="course-image"
        />
        <h2 className={`course-title ${hovered ? "hovered" : ""}`}>
          {course.name || "Unknown Course"}
        </h2>
        <div className={`course-description ${hovered ? "visible" : ""}`}>
          <p>{course.description || "No description available."}</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="course-info">
        <p className="complexity">
          <strong>Level</strong> <tr> </tr>{course.complexity || "N/A"}
        </p>
        <p className="instructor">
          <strong>Instructor</strong> <tr> </tr> {course.instructor.name || "Unknown"}
        </p>
      </div>
    </div>
  );
};

export default CourseCard;
