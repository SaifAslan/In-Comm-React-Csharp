import React from "react";
import { Layout, Menu, theme, Button } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons"; // Import TeamOutlined for users
import { useNavigate, useLocation } from "react-router-dom"; // Updated import to include useLocation
import { useAppDispatch, useAppSelector } from "../Redux/hooks"; // Import hooks for dispatch and selector
import { logout } from "../Redux/features/user/userSlice";
import { IRole } from "../Interfaces/IUser";

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

const AppLayout: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const dispatch = useAppDispatch(); // Use the useAppDispatch hook to dispatch actions
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const { user } = useAppSelector((state) => state.user); // Get user from Redux store

  const handleLogout = () => {
    dispatch(logout()); // Removes the user from the Redux store to log them out
  };

  // Check if the current path is either login or home
  const isAuthPath = location.pathname === "/" || location.pathname === "/login";

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isAuthPath && ( // Render Sider only if not on auth paths
        <Sider style={siderStyle}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" mode="inline">
            <Menu.Item
              key="1"
              icon={<UserOutlined />}
              onClick={() => navigate("/courses")}
            >
              Courses
            </Menu.Item>
            {/* Render Users menu item only if user is Instructor or Admin */}
            {(user?.roles.includes(IRole.Instructor) || user?.roles.includes(IRole.Admin)) && (
              <Menu.Item
                key="2"
                icon={<TeamOutlined />}
                onClick={() => navigate("/users")} // Navigate to users page
              >
                Users
              </Menu.Item>
            )}
            <Menu.Item key="3">
              <Button
                type="primary"
                onClick={handleLogout}
                style={{ width: "100%" }}
              >
                Logout
              </Button>
            </Menu.Item>
          </Menu>
        </Sider>
      )}
      <Layout style={{ marginInlineStart: isAuthPath ? 0 : 200 }}>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          In Comm ©{new Date().getFullYear()} Created with ❤️ by Saif
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
