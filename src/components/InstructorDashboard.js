import React, { useState, useContext, useEffect, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";
import CourseCard from "./CourseCard"; // Assuming you have a CourseCard component for displaying courses
import { UserContext } from "../context/UserContext"; // Import the UserContext
import axios from "axios";

const InstructorDashboard = () => {
  const [activeSection, setActiveSection] = useState("createdCourses");
  const { user } = useContext(UserContext); // Access the user data from context
  const [createdCourses, setCreatedCourses] = useState([]); // State to store courses created by the instructor
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    tags: "",
    complexity: "",
    prerequisites: "",
    duration: "",
    rating: 0,
    image: null,
  }); // State for new course form
  const navigate = useNavigate();

  const fetchInstructorData = useCallback(async () => {
    try {
      const createdCoursesData = await Promise.all(
        user.coursesCreated.map(async (course) => {
          const response = await axios.get(
            `https://ignited-psi.vercel.app/api/courses/${course._id}`
          );
          return response.data;
        })
      );
      setCreatedCourses(createdCoursesData);
    } catch (err) {
      console.error("Failed to load course details. Please try again later.");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchInstructorData();
    }
  }, [user, fetchInstructorData]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    try {
      const courseData = {
        ...newCourse,
        tags: newCourse.tags.split(",").map((tag) => tag.trim()),
        prerequisites: newCourse.prerequisites
          .split(",")
          .map((prerequisite) => prerequisite.trim()),
        instructor: user._id,
      };

      delete courseData.image;

      if (newCourse.courseId) {
        courseData.courseId = newCourse.courseId;
      }

      const courseResponse = await axios.post(
        "https://ignited-psi.vercel.app/api/courses",
        courseData
      );

      if (courseResponse.status === 201) {
        const createdCourse = courseResponse.data;
        const courseId = createdCourse.courseId;

        const formData = new FormData();
        formData.append("image", newCourse.image);

        const uploadResponse = await axios.post(
          `https://ignited-psi.vercel.app/api/courses/courseId/${courseId}/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updatedCourseData = {
          ...createdCourse,
          image: uploadResponse.data.url,
        };

        const updateResponse = await axios.put(
          `https://ignited-psi.vercel.app/api/courses/courseId/${courseId}`,
          updatedCourseData
        );

        if (updateResponse.status === 200) {
          console.log("Course successfully updated with image.");
        }

        await fetchInstructorData();
        setActiveSection("createdCourses");
      }
    } catch (err) {
      console.error("Failed to create course:", err);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "createdCourses":
        return (
          <div className="content">
            <h2 className="section-title">Courses Created</h2>
            <div className="course-grid">
              {createdCourses.length > 0 ? (
                createdCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onClick={() => navigate(`/course/${course._id}`)}
                  />
                ))
              ) : (
                <p>You have not created any courses yet.</p>
              )}
            </div>
          </div>
        );
      case "createCourse":
        return (
          <div className="content">
            <h2 className="section-title" >Create Course</h2>
            <form onSubmit={handleCreateCourse} className="create-course-form">
              <div className="form-group ">
                <label>Course ID</label>
                <input
                  type="text"
                  value={newCourse.courseId || ""}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, courseId: e.target.value })
                  }
                  placeholder="Enter a unique Course ID"
                  required
                />
              </div>
              <div className="form-group">
                <label>Course Name</label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  placeholder="Enter the course name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  placeholder="Enter the course description"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newCourse.tags}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, tags: e.target.value })
                  }
                  placeholder="Enter tags (e.g., Python, Advanced)"
                  required
                />
              </div>
              <div className="form-group">
                <label>Complexity</label>
                <select
                  value={newCourse.complexity}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, complexity: e.target.value })
                  }
                  required
                >
                  <option value="">Select Complexity</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label>Prerequisites (comma-separated)</label>
                <input
                  type="text"
                  value={newCourse.prerequisites}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      prerequisites: e.target.value,
                    })
                  }
                  placeholder="Enter prerequisites (e.g., Basic Python, OOP)"
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={newCourse.duration}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, duration: e.target.value })
                  }
                  placeholder="Enter duration (e.g., 8 weeks)"
                  required
                />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <input
                  type="number"
                  value={newCourse.rating}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, rating: e.target.value })
                  }
                  placeholder="Enter rating (e.g., 4.5)"
                  min="0"
                  max="5"
                  step="0.1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, image: e.target.files[0] })
                  }
                  required
                />
              </div>
              <button type="submit" className="createButton">Create Course</button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="main-page">
      <div className="instructor-dashboard">
        <div className="sidebar">
          <h1>Instructor Dashboard</h1>
          <button
            className={activeSection === "createdCourses" ? "active" : ""}
            onClick={() => setActiveSection("createdCourses")}
          >
            Courses Created
          </button>
          <button
            className={activeSection === "createCourse" ? "active" : ""}
            onClick={() => setActiveSection("createCourse")}
          >
            Create Course
          </button>
        </div>
        <div className="main-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default InstructorDashboard;