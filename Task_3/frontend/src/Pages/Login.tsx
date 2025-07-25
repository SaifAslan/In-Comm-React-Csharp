// Importing React and related libraries
import React, { useEffect } from "react";
import { Form, Input, Button, message, Card, Row, Col } from "antd"; // Ant Design components
import { useDispatch } from "react-redux"; // Redux dispatch hook
import { Link, useNavigate } from "react-router-dom"; // React Router for navigation
import axios from "axios"; // Axios for making HTTP requests
import { useAppSelector } from "../Redux/hooks"; // Custom hook for accessing Redux state

// Redux imports
import { login } from "../Redux/features/user/userSlice"; // Import login action from user slice

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For navigation after login
  const { isAuthenticated } = useAppSelector((state) => state.user); // Select authentication state

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      // Perform API call for login using axios
      const response = await axios.post(
        "http://localhost:5197/api/account/login",
        values
      );

      // If the response is successful
      message.success("Login successful!"); // Show success message
      dispatch(login(response.data)); // Dispatch the login action with user data
      navigate("/courses"); // Redirect to home or desired route after login
    } catch (error: any) {
      // Handle errors
      if (axios.isAxiosError(error)) {
        message.error(
          error.response?.data?.message || "Login failed! Please try again."
        ); // Show error message
      } else {
        message.error("An unexpected error occurred.");
      }
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/courses"); // Redirect to home if already authenticated
    }
  }, [isAuthenticated]);

  return (
    <div style={{ padding: "20px" }} className="login-page">
      <Row justify="center" align="middle" style={{ width: "100%" }}>
        <Col lg={8} md={12} sm={24}>
          <Card title="Login">
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Email"
                name="email"
                rules={[ // Validation rules for email field
                  {
                    required: true,
                    type: "email",
                    message: "Please input a valid email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[ // Validation rules for password field
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
              <Form.Item>
                <p>
                  Don't have an account?{" "}
                  <Link to="/register" style={{ fontWeight: "bold" }}>
                    Register
                  </Link>
                </p>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
