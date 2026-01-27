import React, { useState } from 'react';
import { Layout, Button, Table, Space, Popconfirm, message, Input, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import ProductForm from '../components/ProductForm';
import AppHeader from '../components/AppHeader';

const { Content } = Layout;

const Products = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const { data: products = [], isLoading } = useProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleCreateClick = () => {
    setSelectedProductId(null);
    setIsModalVisible(true);
  };

  const handleEditClick = (record) => {
    setSelectedProductId(record.id);
    setIsModalVisible(true);
  };

  const handleDeleteClick = (id) => {
    deleteProduct(id, {
      onSuccess: () => {
        message.success('Product deleted successfully');
      },
      onError: (error) => {
        message.error(error.response?.data?.message || 'Failed to delete product');
      },
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      sorter: (a, b) => a.sku.localeCompare(b.sku),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
      sorter: (a, b) => a.stock_quantity - b.stock_quantity,
      render: (quantity) => (
        <span style={{ color: quantity <= 10 ? '#ff4d4f' : '#52c41a' }}>
          {quantity}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteClick(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '24px' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12}>
            <Input
              placeholder="Search by name or SKU"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={handleCreateClick}
            >
              Add Product
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          loading={isLoading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Content>

      <ProductForm
        productId={selectedProductId}
        isModalVisible={isModalVisible}
        onSuccess={() => {
          setIsModalVisible(false);
          setSelectedProductId(null);
        }}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedProductId(null);
        }}
      />
    </Layout>
  );
};

export default Products;
