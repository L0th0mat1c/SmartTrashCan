import React from "react";

import { Row, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

const useColumns = (setDataToModal, setVisible) => {
  return [
    {
      title: "Nom",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Code",
      dataIndex: "code",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "state",
      sorter: true,
    },
    {
      title: "Adresse",
      key: "adresse",
      sorter: true,
      render: (text, record) => (text ? "Ok" : null),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Row justify="space-around">
          <Button
            onClick={() => {
              setDataToModal(record);
              setVisible(true);
            }}
            icon={<EditOutlined />}
          />
        </Row>
      ),
    },
  ];
};

export default useColumns;
