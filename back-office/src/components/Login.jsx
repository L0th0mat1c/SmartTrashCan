import React from "react";
import { Form, Button, Input, Row, message } from "antd";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const Login = () => {
  const { dispatchAPI } = useAuthContext();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const loginUser = async (body) => {
    try {
      await dispatchAPI("LOGIN", { ...body });
      navigate("/");
    } catch (error) {
      message.error(`Erreur serveur: ${error}`);
    }
  };
  const onFinish = (values) => {
    console.log(values);
    loginUser(values);
  };
  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item name="email" label="Email" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Mot de passe"
        rules={[{ required: true }]}
      >
        <Input.Password />
      </Form.Item>
      <Row justify="end">
        {/* <Form.Item>
          <Button htmlType="button" onClick={onReset}>
            Annuler
          </Button>
        </Form.Item> */}
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Se connecter
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};

export default Login;
