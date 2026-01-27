import React from 'react';
import { Layout, Card, Row, Col, Statistic } from 'antd';
import AppHeader from '../components/AppHeader';

const { Content } = Layout;

const Dashboard = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '24px' }}>
        <Card style={{ marginBottom: '24px' }}>
          <h1>Welcome to POS System</h1>
          <p>Dashboard - Manage your point of sale operations</p>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Sales"
                value={0}
                prefix="$"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Orders"
                value={0}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Customers"
                value={0}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Products"
                value={0}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
