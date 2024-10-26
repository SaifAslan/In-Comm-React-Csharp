import "./App.css";
import { useAppSelector } from "./Redux/hooks";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Register from "./Pages/Register";
import AppLayout from "./Components/AppLayout";
import Courses from "./Pages/Courses/Index";
import CreateCourse from "./Pages/Courses/CreateCourse";
import Users from "./Pages/Users/Index";
import CoursePage from "./Pages/Courses/Coursepage";

const ProtectedRoute = ({
  children,
  requiredRoles,
}: {
  children: JSX.Element;
  requiredRoles: string[];
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  
  // Check if the user is authenticated and has one of the required roles
  const hasRequiredRole = user?.roles.some(role => requiredRoles.includes(role));
  
  return isAuthenticated && hasRequiredRole ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

function App() {
  console.log(useAppSelector((state) => state.user));
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
              <ProtectedRoute  requiredRoles={["Instructor", "Student"]}>
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
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
