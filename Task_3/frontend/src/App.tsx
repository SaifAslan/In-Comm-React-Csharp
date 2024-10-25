import "./App.css";
import { useAppSelector } from "./Redux/hooks";
import {
  BrowserRouter,
  Navigate,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Register from "./Pages/Register";
import AppLayout from "./Components/AppLayout";
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: JSX.Element;
  requiredRole: string;
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  return isAuthenticated && user?.roles[0].toString() === requiredRole ? (
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
            path="/courses"
            element={
              <ProtectedRoute requiredRole="Instructor">
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
