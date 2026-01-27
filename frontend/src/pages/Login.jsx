import React from 'react';
import { Form, Input, Button, Card, message, Spin, Space } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { useAuthContext } from '../context/AuthContext';
import './AuthPages.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { mutate: loginMutation, isPending } = useLogin();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    loginMutation({
      email: values.email,
      password: values.password,
    }, {
      onSuccess: (data) => {
        login(data.user, data.access_token);
        message.success('Login successful!');
        navigate('/dashboard');
      },
      onError: (error) => {
        message.error(error.response?.data?.message || 'Login failed');
      },
    });
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" title="Sign In">
        <Spin spinning={isPending}>
          <Form
            form={form}
            name="login"
            layout="vertical"
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="john@example.com" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Sign In
              </Button>
            </Form.Item>

            <Space style={{ width: '100%', justifyContent: 'center' }}>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </Space>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default Login;
