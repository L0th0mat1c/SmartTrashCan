import React from "react";
import { message, Row, Col, Image } from "antd";
import backgroundHome from "../../assets/backgroundHome.jpg";
import imageHome from "../../assets/imageHome.png";

const Home = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${backgroundHome})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Row justify="center">
        <Col
          style={{ textAlign: "center", marginTop: 100 }}
          span={12}
          offset={1}
        >
          <img src={imageHome} />
        </Col>
        <Col
          style={{
            marginTop: 50,
            border: "0.2px solid",
            backgroundColor: "white",
            alignContent: "center",
          }}
          span={12}
          offset={1}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: 25,
              fontWeight: "bold",
              color: "grey",
              marginTop: 5,
            }}
          >
            Espace administrateur
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
