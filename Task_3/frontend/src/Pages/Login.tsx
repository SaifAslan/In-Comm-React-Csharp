// src/Login.tsx
import React from "react";
import { Form, Input, Button, message, Card, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { login } from "../Redux/features/user/userSlice"; // Adjust import based on your user slice
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios"; // Import axios

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For navigation after login

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      // Perform API call for login using axios
      const response = await axios.post("http://localhost:5197/api/account/login", values);

      // If the response is successful
      message.success("Login successful!"); // Show success message
      dispatch(login(response.data)); // Dispatch the login action with user data
      navigate("/"); // Redirect to home or desired route after login
    } catch (error: any) {
      // Handle errors
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.message || "Login failed! Please try again."); // Show error message
      } else {
        message.error("An unexpected error occurred.");
      }
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }} className="login-page">
      <Row justify="center" align="middle" style={{ width: "100%" }}>
        <Col lg={8} md={12} sm={24}>
          <Card title="Login">
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
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
                rules={[
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
