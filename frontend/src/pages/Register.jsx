import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Spin, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { useAuthContext } from '../context/AuthContext';
import './AuthPages.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { mutate: register, isPending } = useRegister();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    register({
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
    }, {
      onSuccess: (data) => {
        login(data.user, data.access_token);
        message.success('Registration successful!');
        navigate('/dashboard');
      },
      onError: (error) => {
        message.error(error.response?.data?.message || 'Registration failed');
      },
    });
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" title="Create Account">
        <Spin spinning={isPending}>
          <Form
            form={form}
            name="register"
            layout="vertical"
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please enter your first name' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="John" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter your last name' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Doe" />
            </Form.Item>

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
                { min: 8, message: 'Password must be at least 8 characters' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Sign Up
              </Button>
            </Form.Item>

            <Space style={{ width: '100%', justifyContent: 'center' }}>
              Already have an account? <Link to="/login">Sign In</Link>
            </Space>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default Register;
