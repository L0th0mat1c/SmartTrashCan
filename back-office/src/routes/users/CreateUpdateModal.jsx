import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Form, Button, Input, InputNumber, Row, Select } from "antd";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const { Option } = Select;

const CreateUpdateModal = ({ data, visible, setVisible, onSubmit }) => {
  const [form] = Form.useForm();
  const role = ["ADMIN", "USER", "IOT"];

  const onFinish = (values) => {
    onSubmit(values);
  };

  const onReset = () => {
    form.resetFields();
    setVisible(!visible);
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  return (
    <Modal
      closable
      title="Edtion d'un utilisateur'"
      visible={visible}
      footer={null}
      onCancel={() => {
        setVisible(!visible);
      }}
    >
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="_id" noLabel hidden>
          <Input />
        </Form.Item>
        <Form.Item name="username" label="Nom" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        {!data && (
          <>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password_confirme"
              label="Confirmer password"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </>
        )}

        <Form.Item name="role" label="Rôle" rules={[{ required: true }]}>
          <Select>
            {role.map((ele) => (
              <Option key={ele} value={ele}>
                {ele}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row justify="space-around">
          <Form.Item>
            <Button htmlType="button" onClick={onReset}>
              Annuler
            </Button>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Sauvegarder
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
};

CreateUpdateModal.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object]),
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
CreateUpdateModal.defaultProps = {
  data: null,
};
export default CreateUpdateModal;
