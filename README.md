# IgnitED

IgnitED is a modern web application designed to provide an interactive and engaging platform for students and instructors. It allows students to explore, enroll in, and manage courses, while instructors can create, manage, and share their courses with ease. The application is built using the latest web technologies and follows a modular and scalable architecture.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Features](#features)
3. [Folder Structure](#folder-structure)
4. [Implementation Details](#implementation-details)
5. [Setup and Installation](#setup-and-installation)
6. [API Endpoints](#api-endpoints)
7. [Screenshots](#screenshots)
8. [Future Enhancements](#future-enhancements)

---

## Tech Stack

### Frontend
- **React.js**: A JavaScript library for building user interfaces.
- **React Router**: For managing navigation and routing.
- **Axios**: For making HTTP requests to the backend API.
- **CSS**: Custom stylesheets for responsive and visually appealing UI.
- **React Icons**: For adding icons to the UI.

### Backend
- **Node.js**: Backend runtime environment (API hosted externally).
- **Express.js**: RESTful API framework (API hosted externally).

### Database
- **MongoDB**: NoSQL database for storing user, course, and enrollment data (API hosted externally).

### Deployment
- **Vercel**: Hosting platform for the frontend.
- **External API**: Backend API hosted on a separate server.

---

## Features

### For Students
- Explore available courses with search functionality.
- Enroll in courses and view enrolled courses.
- Access course content and modules.
- View grades and certificates.

### For Instructors
- Create new courses with detailed information.
- Upload course modules and content (PDFs).
- Manage created courses (edit or delete).
- View enrolled students.

### General
- User authentication with email verification.
- Role-based access for students and instructors.
- Responsive design for mobile and desktop users.


## Implementation Details

### 1. **Authentication**
- **Signup**: Users can sign up as either a student or an instructor. A verification code is sent to their email for account activation.
- **Login**: Users log in using their email and a verification code.
- **Context API**: The `UserContext` manages global state for user data and authentication.

### 2. **Role-Based Dashboards**
- **Student Dashboard**:
  - Displays enrolled courses.
  - Shows course recommendations based on enrolled courses.
  - Allows access to grades and certificates.
- **Instructor Dashboard**:
  - Displays courses created by the instructor.
  - Provides a form to create new courses.
  - Allows uploading of course modules and content.

### 3. **Course Management**
- **Explore Page**: Lists all available courses with a search bar for filtering.
- **Course Details Page**:
  - Displays detailed information about a course.
  - Allows students to enroll or unenroll.
  - Allows instructors to upload modules or delete the course.

### 4. **Styling**
- Custom CSS stylesheets are used for a consistent and responsive design.
- Media queries ensure the application is mobile-friendly.

### 5. **API Integration**
- **Axios** is used to interact with the backend API for:
  - User authentication.
  - Fetching course data.
  - Enrolling/unenrolling in courses.
  - Uploading course content.

---

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ignited.git
   cd ignited
```

---

## API Endpoints

### Authentication
- **POST** `/api/auth/signup`: Register a new user.
- **POST** `/api/auth/login`: Log in a user.
- **POST** `/api/auth/verify-code`: Verify the email verification code.

### Courses
- **GET** `/api/courses`: Fetch all available courses.
- **GET** `/api/courses/:courseId`: Fetch details of a specific course.
- **POST** `/api/courses`: Create a new course (instructor only).
- **DELETE** `/api/courses/:courseId`: Delete a course (instructor only).

### Enrollment
- **POST** `/api/students/:studentId/enroll`: Enroll in a course.
- **DELETE** `/api/students/:studentId/unenroll`: Unenroll from a course.
```

