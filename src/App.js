import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // Import the UserProvider
import LandingPage from "./components/LandingPage";
import Layout from "./components/Layout"; // Import the Layout component
import ExplorePage from "./components/ExplorePage";
import StudentDashboard from "./components/StudentDashboard";
import InstructorDashboard from "./components/InstructorDashboard";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import CourseDetailsPage from "./components/CourseDetailsPage";
import "./styles/App.css";

function App() {
  return (
    <UserProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/StudentDashboard" element={<StudentDashboard />} />
            <Route path="/InstructorDashboard" element={<InstructorDashboard />} />
            {/* Add other routes as needed */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/course/:courseId" element={<CourseDetailsPage />} />
          </Routes>
        </Layout>
      </Router>
    </UserProvider>
  );
}

export default App;
