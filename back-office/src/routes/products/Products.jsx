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

const Products = () => {
  const [garbages, setGarbages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [dataToModal, setDataToModal] = useState();
  const { dispatchAPI } = useAuthContext();
  const column = useColumns(setDataToModal, setVisible);

  const GetCatalog = async () => {
    try {
      const { data } = await dispatchAPI("GET", { url: "/garbages" });
      setGarbages(data);
    } catch (error) {
      message.error(`Erreur serveur: ${error}`);
    }
  };

  const updateGarbages = async (body) => {
    try {
      await dispatchAPI("PATCH", { url: `/garbages/update/${body._id}`, body });
    } catch (error) {
      message.error(`Erreur serveur: ${error}`);
    }
  };

  const createGarbages = async (body) => {
    try {
      await dispatchAPI("POST", { url: `/garbages/create`, body });
    } catch (error) {
      message.error(`Erreur serveur: ${error}`);
    }
  };

  const handleSubmit = (values) => {
    if (values._id) {
      updateGarbages(values);
    } else {
      createGarbages(values);
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
          title="Poubelles"
          extra={[
            <Button
              type="primary"
              icon={<PlusOutlined />}
              key="3"
              onClick={() => setVisible(true)}
            >
              Ajouter
            </Button>,
            // <Button key="2">Operation</Button>,
            // <Button key="1" type="primary">
            //   Primary
            // </Button>,
          ]}
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="Total">
              <span style={{ fontWeight: "bold" }}>
                <Tag color="green">{garbages.length}</Tag>
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Ramassage">
              {garbages.filter((ele) => ele.state === "Empty").length > 0 ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  En attente
                </Tag>
              ) : (
                <Tag icon={<SyncOutlined spin />} color="processing">
                  Ramassage en cours
                </Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </>
      <Table columns={column} dataSource={garbages} />
      <CreateUpdateModal
        data={dataToModal}
        visible={visible}
        setVisible={setVisible}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Products;
