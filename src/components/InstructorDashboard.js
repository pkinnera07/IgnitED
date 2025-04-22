import React, { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../styles/StudentDashboard.css";
import CourseCard from "./CourseCard"; // Assuming you have a CourseCard component for displaying courses
import { UserContext } from "../context/UserContext"; // Import the UserContext
import axios from "axios";

const InstructorDashboard = () => {
  const [activeSection, setActiveSection] = useState("createdCourses");
  const { user } = useContext(UserContext); // Access the user data from context
  const [createdCourses, setCreatedCourses] = useState([]); // State to store courses created by the instructor
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors
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

  const fetchInstructorData = async () => {
    try {
      // Fetch courses created by the instructor
      const createdCoursesData = await Promise.all(
        user.coursesCreated.map(async (course) => {
          const response = await axios.get(
            `http://localhost:5000/api/courses/${course._id}`
          );
          return response.data;
        })
      );
      setCreatedCourses(createdCoursesData);
    } catch (err) {
      setError("Failed to load course details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInstructorData();
    }
  }, [user]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create the new course without the image
      const courseData = {
        ...newCourse,
        tags: newCourse.tags.split(",").map((tag) => tag.trim()), // Convert tags to an array
        prerequisites: newCourse.prerequisites
          .split(",")
          .map((prerequisite) => prerequisite.trim()), // Convert prerequisites to an array
        instructor: user._id, // Automatically set the logged-in instructor's ID
      };

      // Exclude the image from the course data
      delete courseData.image;

      console.log("Course Data:", courseData); // Log the course data for debugging

      // Include the courseId in the courseData if provided
      if (newCourse.courseId) {
        courseData.courseId = newCourse.courseId;
      }

      const courseResponse = await axios.post(
        "http://localhost:5000/api/courses",
        courseData
      );

      if (courseResponse.status === 201) {
        const createdCourse = courseResponse.data; // Get the created course data
        const courseId = createdCourse.courseId; // Extract the courseId (string)

        // Step 2: Upload the image using the courseId
        const formData = new FormData();
        formData.append("image", newCourse.image);

        const uploadResponse = await axios.post(
          `http://localhost:5000/api/courses/courseId/${courseId}/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Step 3: Update the course with the image URL
        const updatedCourseData = {
          ...createdCourse,
          image: uploadResponse.data.url, // Use the uploaded image URL
        };

        const updateResponse = await axios.put(
          `http://localhost:5000/api/courses/courseId/${courseId}`,
          updatedCourseData
        );

        if (updateResponse.status === 200) {
          console.log("Course successfully updated with image.");
        }

        // Step 4: Refresh the instructor data
        await fetchInstructorData(); // Refresh the instructor data to include the new course
        setActiveSection("createdCourses"); // Redirect to the created courses section
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
            <h2>Courses Created</h2>
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
            <h2>Create Course</h2>
            <form onSubmit={handleCreateCourse}>
              <div className="form-group">
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
                  required
                />
              </div>
              <div className="form-group">
                <label>Complexity</label>
                <input
                  type="text"
                  value={newCourse.complexity}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, complexity: e.target.value })
                  }
                  required
                />
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
              <button type="submit">Create Course</button>
            </form>
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
      <div className="instructor-dashboard">
        {/* Sidebar */}
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
            Create New Course
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default InstructorDashboard;