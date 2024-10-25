import React from "react";
import { Layout, Menu, theme, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Updated import
import { useAppDispatch } from "../Redux/hooks";
import { logout } from "../Redux/features/user/userSlice";

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
  const handleLogout = () => {
    dispatch(logout()); //removes the user from the Redux store to logs them out
  };

  return (
    <Layout hasSider>
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
          <Menu.Item key="2">
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
      <Layout style={{ marginInlineStart: 200 }}>
        <Header style={{ padding: 0, background: colorBgContainer }} />
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
