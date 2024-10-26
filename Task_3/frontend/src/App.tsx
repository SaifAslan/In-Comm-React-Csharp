// Importing React and related libraries
import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"; // React Router components for routing
import { message } from "antd"; // Ant Design message component for displaying alerts

// Redux imports
import { useAppDispatch, useAppSelector } from "./Redux/hooks"; // Custom hooks for accessing Redux state and dispatch
import { setEnrollments } from "./Redux/features/Enrollments/enrollmentsSlice"; // Redux action to set enrolled courses

// Interfaces
import { IRole } from "./Interfaces/IUser"; // Role interface for user roles

// Page components
import AppLayout from "./Components/AppLayout"; // Layout component that wraps the application
import Login from "./Pages/Login"; // Login page component
import Register from "./Pages/Register"; // Registration page component
import Courses from "./Pages/Courses/Index"; // Courses listing page component
import CreateCourse from "./Pages/Courses/CreateCourse"; // Course creation page component
import Users from "./Pages/Users/Index"; // Users management page component
import CoursePage from "./Pages/Courses/Coursepage"; // Course detail page component
import NotFound from "./Pages/NotFound"; // 404 Not Found page component

// API
import axios from "axios"; // Axios for making HTTP requests

// Component to protect routes based on user authentication and role
const ProtectedRoute = ({
  children,
  requiredRoles,
}: {
  children: JSX.Element;
  requiredRoles: string[];
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  // Check if the user is authenticated and has one of the required roles
  const hasRequiredRole = user?.roles.some((role) =>
    requiredRoles.includes(role)
  );

  return isAuthenticated && hasRequiredRole ? children : <Navigate to="/" />;
};

function App() {
  const { user } = useAppSelector((state) => state.user); // Get the user from Redux state
  const dispatch = useAppDispatch(); // Get the dispatch function

  useEffect(() => {
    // Function to fetch enrolled courses for the authenticated student
    const fetchEnrolledCourses = async () => {
      if (user && user.roles.includes(IRole.Student)) {
        try {
          const response = await axios.get(
            `http://localhost:5197/api/enrollment/${user.id}/courses`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
          dispatch(setEnrollments(response.data)); // Dispatch action to set enrolled courses
        } catch (error) {
          console.error("Error fetching enrolled courses", error);
          message.error("Failed to fetch enrolled courses"); // Show error message
        }
      }
    };

    fetchEnrolledCourses(); // Call the function to fetch courses
  }, [dispatch, user]); // Dependency array includes dispatch and user

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Register />} /> {/* Home route */}
          <Route path="/login" element={<Login />} /> {/* Login route */}
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRoles={["Instructor", "Admin"]}>
                <Users />
              </ProtectedRoute>
            }
          /> {/* Protected route for Users */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute requiredRoles={["Instructor", "Student"]}>
                <Courses />
              </ProtectedRoute>
            }
          /> {/* Protected route for Courses */}
          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute requiredRoles={["Instructor", "Student"]}>
                <CoursePage />
              </ProtectedRoute>
            }
          /> {/* Protected route for Course Details */}
          <Route
            path="/courses/create-course"
            element={
              <ProtectedRoute requiredRoles={["Instructor", "Admin"]}>
                <CreateCourse />
              </ProtectedRoute>
            }
          /> {/* Protected route for creating courses */}
          <Route path="*" element={<NotFound />} /> {/* 404 Page */}
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
