import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/CourseDetailsPage.css";
import axios from "axios";
import { UserContext } from "../context/UserContext"; // Import UserContext
import CImage from "../assets/login.jpg"; // Correctly import the image

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const { user, setUser, userType } = useContext(UserContext); // Access the user data from context
  const [course, setCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false); // Track enrollment status
  const [isCreator, setIsCreator] = useState(false); // Track if the user is the course creator
  const [showUnenrollPrompt, setShowUnenrollPrompt] = useState(false); // Track unenroll prompt visibility
  const [showAddSectionForm, setShowAddSectionForm] = useState(false); // Track add section form visibility
  const [newSection, setNewSection] = useState({ section: "", pdf: null }); // State for new section form
  const [showDeletePrompt, setShowDeletePrompt] = useState(false); // Track delete course prompt visibility
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`https://ignited-psi.vercel.app/api/courses/${courseId}`);
        setCourse(response.data);
      } catch (err) {
        console.error("Failed to load course details:", err);
      }
    };


    const checkEnrollmentOrCreator = () => {
      if (user) {
        console.log("User context:", user);

        // Check if the user is enrolled in the course
        if (user.enrolledCourses) {
          const enrolledCourseIds = user.enrolledCourses.map((course) =>
            typeof course === "object" ? course._id : course
          );
          setIsEnrolled(enrolledCourseIds.includes(courseId));
        }

        // Check if the user is the creator of the course
        if (userType === "instructor" && user.coursesCreated) {
          const createdCourseIds = user.coursesCreated.map((course) =>
            typeof course === "object" ? course._id : course
          );
          setIsCreator(createdCourseIds.includes(courseId));
        }
      }
    };

    fetchCourse();
    checkEnrollmentOrCreator();
  }, [courseId, user, userType]); // Add userType to the dependency array

  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`https://ignited-psi.vercel.app/api/courses/courseId/${course.courseId}`);
      
      // Fetch the updated user data from the backend
      const updatedUserResponse = await axios.get(`https://ignited-psi.vercel.app/api/instructors/${user._id}`);
      const updatedUser = updatedUserResponse.data;

      // Update the user data in the UserContext
      setUser(updatedUser);
      
      setShowDeletePrompt(false); // Close the prompt
      navigate("/InstructorDashboard"); // Redirect to the instructor dashboard after deletion
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  const handleEnroll = async () => {
    try {
      await axios.post(`https://ignited-psi.vercel.app/api/students/${user._id}/enroll`, { courseId });

      setIsEnrolled(true); // Update enrollment status after successful enrollment
      // Fetch the updated user data from the backend
      const updatedUserResponse = await axios.get(`https://ignited-psi.vercel.app/api/students/${user._id}`);
      const updatedUser = updatedUserResponse.data;

      // Update the user data in the UserContext
      setUser(updatedUser);
    } catch (err) {
      console.error("Failed to enroll in course:", err);
    }
  };

  const handleUnenroll = async () => {
    try {
      await axios.delete(`https://ignited-psi.vercel.app/api/students/${user._id}/unenroll`, {
        data: { courseId },
      });

      setIsEnrolled(false); // Update enrollment status after successful unenrollment
      // Fetch the updated user data from the backend
      const updatedUserResponse = await axios.get(`https://ignited-psi.vercel.app/api/students/${user._id}`);
      const updatedUser = updatedUserResponse.data;

      // Update the user data in the UserContext
      setUser(updatedUser);
      setShowUnenrollPrompt(false); // Close the prompt
    } catch (err) {
      console.error("Failed to unenroll from course:", err);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("section", newSection.section);
      formData.append("pdf", newSection.pdf);
      console.log("course data",course);
      console.log("course id",course.courseId);

      const response = await axios.post(
        `https://ignited-psi.vercel.app/api/courses/courseId/${course.courseId}/modules`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        // Refresh the course data to include the new section
        const updatedCourse = await axios.get(`https://ignited-psi.vercel.app/api/courses/${courseId}`);
        setCourse(updatedCourse.data);
        setShowAddSectionForm(false); // Close the form
        setNewSection({ section: "", pdf: null }); // Reset the form
      }
    } catch (err) {
      console.error("Failed to add section:", err);
    }
  };

  if (!course) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="course-details-page">
      {/* Sidebar (only if user is logged in and either enrolled or the creator) */}
      {user && (isEnrolled || isCreator) && (
        <div className="sidebar">
          <h2
            className={selectedSection === null ? "active" : ""}
            onClick={() => setSelectedSection(null)} // Reset to default view
          >
            {course.name}
          </h2>
          <ul>
            {course.modules.map((module, index) => (
              <li
                key={module._id}
                className={selectedSection === index ? "active" : ""}
                onClick={() => setSelectedSection(index)}
              >
                {module.section}
              </li>
            ))}
          </ul>
          {/* Unenroll Button (only if the user is enrolled and not the creator) */}
          {isEnrolled && !isCreator && (
            <button
              className="unenroll-button"
              onClick={() => setShowUnenrollPrompt(true)} // Show the unenroll prompt
            >
              Unenroll
            </button>
          )}

          {/* Upload Content Button (only if the user is the creator) */}
          {isCreator && (
            <>
              <button
                className="unenroll-button"
                onClick={() => setShowAddSectionForm(true)} // Show the add section form
              >
                Upload Content
              </button>
              <button
                className="unenroll-button"
                onClick={() => setShowDeletePrompt(true)} // Show the delete course prompt
              >
                Delete Course
              </button>
            </>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className={`main-content ${!user || (!isEnrolled && !isCreator) ? "full-width" : ""}`}>
        {selectedSection === null ? (
          <div className="course-details">
            <div className="course-detail-main">
              <img src={course.image || CImage} alt={course.name} className="course-detail-image" />
              <div className="course-detail-side">
                <h1 className="course-detail-title">{course.name}</h1>
                <p><strong>Instructor:</strong> {course.instructor.name}</p>
                <p><strong>Level:</strong> {course.complexity}</p>
                <p><strong>Duration:</strong> {course.duration}</p>
                <p><strong>Prerequisites:</strong> {course.prerequisites.join(", ")}</p>
                <p><strong>Rating:</strong> {course.rating} / 5</p>
                <p>[{course.tags.join(", ")}]</p>
              </div>
            </div>
            <h4 className="description">{course.description}</h4>

            {/* Login or Enroll Prompt */}
            {!user ? (
              <div className="login-prompt">
                <h2>You need to log in to access this course.</h2>
                <Link to="/login" className="login-link">Go to Login</Link>
              </div>
            ) : !isEnrolled && !isCreator ? (
              <div className="enroll-prompt">
                <h2>You are not enrolled in this course.</h2>
                <button onClick={handleEnroll} className="enroll-button">Enroll Now</button>
              </div>
            ) : null}
          </div>
        ) : (
          <iframe
            src={course.modules[selectedSection].fileUrl}
            title={course.modules[selectedSection].section}
            className="pdf-viewer"
          />
        )}
      </div>

      {/* Add Section Form (only if the user is the creator) */}
      {showAddSectionForm && (
        <div className="prompt">
          <div className="prompt-content">
          <h2>Add New Module</h2>
          <form onSubmit={handleAddSection}>
            <div className="form-group">
              <label>Module Name</label>
              <input
                type="text"
                value={newSection.section}
                onChange={(e) => setNewSection({ ...newSection, section: e.target.value })}
                placeholder="Enter Module name"
                required
              />
            </div>
            <div className="form-group">
              <label>PDF File</label>
              <input
                type="file"
                onChange={(e) => setNewSection({ ...newSection, pdf: e.target.files[0] })}
                required
              />
            </div>
            <button className="prompt-button" type="submit">Upload</button>
            <button className="prompt-button" type="button" onClick={() => setShowAddSectionForm(false)}>
              Cancel
            </button>
          </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Prompt */}
      {showDeletePrompt && (
        <div className="prompt">
          <div className="prompt-content">
            <h2>Are you sure you want to delete this course?</h2>
            <button className="confirm-button prompt-button" onClick={handleDeleteCourse}>
              Yes, Delete
            </button>
            <button className="cancel-button prompt-button" onClick={() => setShowDeletePrompt(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Unenroll Confirmation Prompt */}
      {showUnenrollPrompt && (
        <div className="prompt">
          <div className="prompt-content">
            <h2>Are you sure you want to unenroll from this course?</h2>
            <button className="confirm-button prompt-button" onClick={handleUnenroll}>
              Yes, Unenroll
            </button>
            <button className="cancel-button prompt-button" onClick={() => setShowUnenrollPrompt(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;