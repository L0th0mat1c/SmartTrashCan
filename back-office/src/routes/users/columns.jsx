import React from "react";

import { Row, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const useColumns = (setDataToModal, setVisible, removeUser) => {
  return [
    {
      title: "Nom",
      dataIndex: "username",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Rôle",
      dataIndex: "role",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Row justify="center">
          <Button
            style={{ marginRight: 20 }}
            disabled={record.role === "ADMIN"}
            onClick={() => {
              setDataToModal(record);
              setVisible(true);
            }}
            icon={<EditOutlined />}
          />
          <Button
            type="danger"
            disabled={record.role === "ADMIN"}
            onClick={() => removeUser(record)}
            icon={<DeleteOutlined />}
          />
        </Row>
      ),
    },
  ];
};

export default useColumns;
