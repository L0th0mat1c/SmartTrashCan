import React, { useState, useEffect } from "react";
import { Table, PageHeader, Button, Descriptions, Tag, message } from "antd";
import {
  PlusOutlined,
  SyncOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import useAuthContext from "../../contexts/AuthContext";
import useColumns from "./columns";
import CreateUpdateModal from "./CreateUpdateModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [dataToModal, setDataToModal] = useState();
  const { dispatchAPI } = useAuthContext();
  const GetCatalog = async () => {
    try {
      const { data } = await dispatchAPI("GET", { url: "/users" });
      setUsers(data);
    } catch (error) {
      message.error(`Erreur serveur: ${error}`);
    }
  };
  const removeUsers = async (body) => {
    try {
      await dispatchAPI("DELETE", { url: `/users/${body._id}` });
      GetCatalog();
    } catch (error) {
      message.error(`Erreur serveur: ${error}`);
    }
  };
  const column = useColumns(setDataToModal, setVisible, removeUsers);

  const updateUsers = async (body) => {
    try {
      await dispatchAPI("PATCH", { url: `/users/${body._id}`, body });
    } catch (error) {
      message.error(`Erreur serveur: ${error}`);
    }
  };

  const createUsers = async (body) => {
    try {
      await dispatchAPI("REGISTER", { ...body });
    } catch (error) {
      message.error(`Erreur serveur: ${error}`);
    }
  };

  const handleSubmit = (values) => {
    if (values._id) {
      updateUsers(values);
    } else {
      createUsers(values);
    }
    GetCatalog();
    setVisible(false);
  };

  useEffect(() => {
    GetCatalog();
  }, []);
  return (
    <>
      <>
        <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Utilisateurs"
          extra={[
            <Button
              type="primary"
              icon={<PlusOutlined />}
              key="3"
              onClick={() => setVisible(true)}
            >
              Ajouter
            </Button>,
          ]}
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item
              label={
                <span style={{ fontSize: 18, fontWeight: "bold" }}>
                  Total utilisateurs
                </span>
              }
            >
              <span style={{ fontWeight: "bold" }}>
                <Tag color="green">{users.length}</Tag>
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Nombre d'utilisateur IOT">
              <span style={{ fontWeight: "bold" }}>
                <Tag color="green">
                  {users.filter((ele) => ele.role === "IOT").length}
                </Tag>
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Nombre d'utilisateurs normaux">
              <span style={{ fontWeight: "bold" }}>
                <Tag color="green">
                  {users.filter((ele) => ele.role === "USER").length}
                </Tag>
              </span>
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </>
      <Table columns={column} dataSource={users} />
      <CreateUpdateModal
        data={dataToModal}
        visible={visible}
        setVisible={setVisible}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Users;
