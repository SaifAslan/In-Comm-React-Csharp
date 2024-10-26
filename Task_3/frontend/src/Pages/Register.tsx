import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  RadioChangeEvent,
  Card,
  Row,
  Col,
  Flex,
  Avatar,
  Segmented,
} from "antd";
import { IUser } from "../Interfaces/IUser"; // Import your AppUser model
import { useDispatch } from "react-redux";
import { login } from "../Redux/features/user/userSlice"; // Adjust import based on your user slice
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "antd";
import {  SegmentedValue } from "antd/es/segmented";
import axios from "axios";
import { useAppSelector } from "../Redux/hooks";


const Register: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [role, setRole] = useState<string>("Student"); // Default role
  const { Text } = Typography;
  const navigate = useNavigate(); // For navigation after login
  const { isAuthenticated } = useAppSelector((state) => state.user);

  const onRoleChange = (e: RadioChangeEvent) => {
    setRole(e.target.value);
  };

  const onFinish = async (values: IUser) => {
    //  an API call to register the user
    try {
      axios
        .post("http://localhost:5197/api/account/register", { ...values, role })
        .then((response) => {
          message.success("User registered successfully!"); // Show success message
          console.log(response.data);
          dispatch(login(response.data));
        })
        .catch((e) => {
          console.error({ e });
        });
      // Dispatch the login action if needed (adjust based on your API response)
      dispatch(login(values));
    } catch (error) {
      message.error("Registration failed!"); // Show error message
    }
  };

  const handleRoleChange = (e: SegmentedValue) => {
    setRole(e as string);
  };


  useEffect(() => {
    if (isAuthenticated) {
      navigate("/courses");
    } // Redirect to home if already authenticated
  }, [isAuthenticated]);

  return (
    <div style={{ padding: "20px" }} className="register-page">
      <Flex gap="middle" align="center" vertical justify="center">
        <Row justify="center" align="middle" style={{ width: "100%" }}>
          <Col lg={8} md={12} sm={24}>
            <Card style={{}} title="Register">
              <Segmented
                onChange={handleRoleChange}
                value={role}
                style={{ width: "100%", marginBottom: "1rem" }}
                defaultValue="Student"
                options={[
                  {
                    label: (
                      <div style={{ padding: 4 }}>
                        <Avatar
                          src="https://api.dicebear.com/9.x/open-peeps/svg?backgroundColor=b6e3f4&face=smile&skinColor=ffdbb4&head=pomp&clothingColor=e279c7"
                          style={{ backgroundColor: "#f56a00" }}
                        ></Avatar>
                        <div>Student</div>
                      </div>
                    ),
                    value: "Student",
                  },
                  {
                    label: (
                      <div style={{ padding: 4 }}>
                        <Avatar
                          src="https://api.dicebear.com/9.x/open-peeps/svg?accessories=glasses3&backgroundColor=c0aede&face=smile&accessoriesProbability=100&clothingColor=fdea6b"
                          style={{ backgroundColor: "#fdea6b" }}
                        />
                        <div>Instructor</div>
                      </div>
                    ),
                    value: "Instructor",
                  },
                ]}
              />
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ role: "Student" }}
              >
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your first name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    { required: true, message: "Please input your last name!" },
                  ]}
                >
                  <Input />
                </Form.Item>

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
                  label="Phone"
                  name="PhoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Date of Birth"
                  name="dateOfBirth"
                  rules={[
                    {
                      required: true,
                      message: "Please select your date of birth!",
                    },
                  ]}
                >
                  <Input type="date" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="ConfirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The two passwords do not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Register
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Text>
                    Have an account? {"  "}
                    <Link to="/login" style={{ fontWeight: "bold" }}>
                      Login
                    </Link>
                  </Text>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Flex>
    </div>
  );
};

export default Register;
