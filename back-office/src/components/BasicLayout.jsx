import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Layout, Menu, Row, message } from "antd";
import styled from "styled-components";
import { UserOutlined, HomeOutlined, ShopOutlined } from "@ant-design/icons";
import useHandleResize from "../utils/HandleResize";
import Logo from "../assets/logo.png";
import useAuthContext from "../contexts/AuthContext";

const { Header, Sider, Content, Footer } = Layout;

const StyledLayout = styled.div`
  height: 100vh;
`;

const StyledSider = styled.div`
  min-height: 100vh;
  z-index: 10;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  overflow-x: hidden;
  position: fixed;
  left: 0;
`;

const LogoDiv = styled.div`
  position: relative;
  height: 150px;
  margin-top: 5px;
  padding-left: 0px;
  overflow: hidden;
  line-height: 64px;
  transition: all 0.3s;
  z-index: 900;
  display: flex;
  justify-content: center;
  img {
    display: inline-block;
    height: 70px;
    vertical-align: middle;
  }
`;

const StyledContent = styled.div`
  margin: 0px 0px 0px 255px;
  // padding-right: 4px;
  overflow-x: hidden;
  overflow-y: auto;
  @media (max-width: 992px) {
    margin-left: 100px;
  }

  @media (max-width: 576px) {
    margin-left: 24px;
  }
`;

const StyledFooter = styled.footer`
  padding: 8px 25px;
  text-align: center;
  margin-left: 255px;
  background-color: #c4c4c4;
  color: var(--textColor);
  box-shadow: 0 -1px 4px var(--borderColor);

  a {
    color: var(--textColor);
    font-weight: bold;
  }

  @media (max-width: 992px) {
    margin-left: 80px;
  }

  @media (max-width: 576px) {
    margin-left: 0;
  }
`;
const BasicLayout = ({ children, path }) => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 992);
  const { width, height } = useHandleResize();
  const { user, dispatchAPI } = useAuthContext();
  const [collapseWidth, setCollapseWidth] = useState(
    window.innerWidth < 576 ? 0 : 80
  );
  let location = useLocation();
  console.log(location);
  const logout = () => {
    dispatchAPI("LOGOUT");
    message.success("Déconnexion réussie !");
  };

  const onCollapse = (newCollapsed) => {
    setCollapsed(newCollapsed);
  };
  useEffect(() => {
    if (width < 576) {
      setCollapseWidth(0);
    } else {
      setCollapseWidth(80);
    }
  }, [width, height]);

  useEffect(() => {
    window.scroll(0, 0);
  }, [path]);

  return (
    <StyledLayout as={Layout}>
      <StyledSider
        as={Sider}
        width={256}
        breakpoint="lg"
        trigger={null}
        collapsible
        collapsedWidth={collapseWidth}
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <LogoDiv>
          <Link to="/">
            <img
              style={{ marginTop: 50 }}
              alt="Logo"
              src={width > 992 && Logo}
            />
          </Link>
        </LogoDiv>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <NavLink to={"/"}>Accueil</NavLink>
          </Menu.Item>
          {user.role === "ADMIN" && (
            <Menu.Item key="/users" icon={<UserOutlined />}>
              <NavLink to={"/users"}>Utilisateurs</NavLink>
            </Menu.Item>
          )}

          <Menu.Item key="/garbages" icon={<ShopOutlined />}>
            <NavLink to={"/garbages"}>Poubelles</NavLink>
          </Menu.Item>
        </Menu>
      </StyledSider>
      <Layout>
        <Header style={{ zIndex: 1, width: "100%" }}>
          {/* {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: onCollapse,
            }
          )} */}
          <Row justify="end">
            <span style={{ marginRight: 50, fontSize: 20, color: "white" }}>
              {user.username}
            </span>
            {/* <span style={{ marginRight: 50, fontSize: 20, color: "white" }}>
              Déconnection
            </span> */}
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["10"]}>
              {/* <Menu.Item key="10">nom</Menu.Item> */}
              {/* <Menu.Item key="20">Profil</Menu.Item> */}
              <Menu.Item key="30" onClick={() => logout()}>
                Déconnection
              </Menu.Item>
            </Menu>
          </Row>
        </Header>
        <StyledContent as={Content}>{children}</StyledContent>
        <StyledFooter as={Footer}>
          <p>Smart Trash CAN</p>
        </StyledFooter>
      </Layout>
    </StyledLayout>
  );
};
export default BasicLayout;
