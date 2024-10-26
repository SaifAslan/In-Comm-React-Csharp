import "./App.css";
import { useAppDispatch, useAppSelector } from "./Redux/hooks";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Register from "./Pages/Register";
import AppLayout from "./Components/AppLayout";
import Courses from "./Pages/Courses/Index";
import CreateCourse from "./Pages/Courses/CreateCourse";
import Users from "./Pages/Users/Index";
import CoursePage from "./Pages/Courses/Coursepage";
import { useEffect } from "react";
import { IRole } from "./Interfaces/IUser";
import axios from "axios";
import { setEnrollments } from "./Redux/features/Enrollments/enrollmentsSlice";
import { message } from "antd";
import NotFound from "./Pages/NotFound";

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
  const { user } = useAppSelector((state) => state.user);
  const { courses } = useAppSelector((state) => state.enrollment);

  const dispatch = useAppDispatch();
  console.log(user);
  console.log(courses);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (user && user.roles.includes(IRole.Student)) {
        axios
          .get(`http://localhost:5197/api/enrollment/${user.id}/courses`, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          .then((response) => {
            dispatch(setEnrollments(response.data));
          })
          .catch((error) => {
            console.error("Error fetching enrolled courses", error);
            message.error("Failed to fetch enrolled courses");
          });
      }
    };

    fetchEnrolledCourses();
  }, [dispatch, user]);
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRoles={["Instructor", "Admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute requiredRoles={["Instructor", "Student"]}>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute requiredRoles={["Instructor", "Student"]}>
                <CoursePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/create-course"
            element={
              <ProtectedRoute requiredRoles={["Instructor", "Admin"]}>
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
