import React from 'react';
import { Layout, Button, Dropdown, Space, Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: `${user?.firstName} ${user?.lastName}`,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        background: '#001529',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h1 style={{ color: 'white', margin: 0 }}>POS System</h1>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <Button type="primary" icon={<UserOutlined />}>
          {user?.email}
        </Button>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
