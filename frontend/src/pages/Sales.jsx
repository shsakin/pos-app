import React, { useState } from 'react';
import {
  Layout,
  Button,
  Table,
  Card,
  Row,
  Col,
  Select,
  InputNumber,
  message,
  Spin,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useProducts } from '../hooks/useProducts';
import { useCreateSale, useSales } from '../hooks/useSales';
import AppHeader from '../components/AppHeader';

const { Content } = Layout;

const Sales = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { data: products = [] } = useProducts();
  const { data: sales = [], isLoading: salesLoading } = useSales();
  const { mutate: createSale, isPending } = useCreateSale();

  const handleAddToCart = () => {
    if (!selectedProductId || !selectedQuantity || selectedQuantity <= 0) {
      message.error('Please select a product and valid quantity');
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) {
      message.error('Product not found');
      return;
    }

    // Check if already in cart
    const existingItem = cartItems.find((item) => item.productId === selectedProductId);
    if (existingItem) {
      const newQuantity = existingItem.quantity + selectedQuantity;
      if (newQuantity > product.stock_quantity) {
        message.error(
          `Insufficient stock. Available: ${product.stock_quantity}, Requested: ${newQuantity}`
        );
        return;
      }
      setCartItems(
        cartItems.map((item) =>
          item.productId === selectedProductId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } else {
      if (selectedQuantity > product.stock_quantity) {
        message.error(
          `Insufficient stock. Available: ${product.stock_quantity}, Requested: ${selectedQuantity}`
        );
        return;
      }
      setCartItems([
        ...cartItems,
        {
          productId: selectedProductId,
          product,
          quantity: selectedQuantity,
          price: parseFloat(product.price),
        },
      ]);
    }

    // Clear inputs
    setSelectedProductId(null);
    setSelectedQuantity(1);
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.error('Cart is empty');
      return;
    }

    // Final validation
    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.productId);
      if (item.quantity > product.stock_quantity) {
        message.error(
          `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`
        );
        return;
      }
    }

    const saleData = {
      saleItems: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    createSale(saleData, {
      onSuccess: () => {
        message.success('Sale created successfully');
        setCartItems([]);
      },
      onError: (error) => {
        message.error(error.response?.data?.message || 'Failed to create sale');
      },
    });
  };

  const cartColumns = [
    {
      title: 'Product',
      dataIndex: ['product', 'name'],
      key: 'product',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (_, record) => `$${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveFromCart(record.productId)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const salesColumns = [
    {
      title: 'Sale ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `$${parseFloat(amount).toFixed(2)}`,
    },
    {
      title: 'Items',
      dataIndex: 'saleItems',
      key: 'items',
      render: (items) => items.length,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Create Sale" style={{ height: '100%' }}>
              <Spin spinning={isPending}>
                <div style={{ marginBottom: '20px' }}>
                  <Row gutter={16} style={{ marginBottom: '16px' }}>
                    <Col xs={24} sm={12}>
                      <Select
                        placeholder="Select Product"
                        style={{ width: '100%' }}
                        value={selectedProductId}
                        onChange={setSelectedProductId}
                        options={products.map((p) => ({
                          value: p.id,
                          label: `${p.name} (Stock: ${p.stock_quantity})`,
                        }))}
                      />
                    </Col>
                    <Col xs={24} sm={12}>
                      <InputNumber
                        min={1}
                        placeholder="Quantity"
                        style={{ width: '100%' }}
                        value={selectedQuantity}
                        onChange={setSelectedQuantity}
                      />
                    </Col>
                  </Row>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    block
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </div>

                {cartItems.length > 0 && (
                  <>
                    <Table
                      columns={cartColumns}
                      dataSource={cartItems}
                      pagination={false}
                      rowKey="productId"
                      size="small"
                      style={{ marginBottom: '16px' }}
                    />
                    <Card
                      style={{
                        background: '#f0f2f5',
                        marginBottom: '16px',
                        textAlign: 'right',
                      }}
                    >
                      <h3>Total: ${cartTotal.toFixed(2)}</h3>
                    </Card>
                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={handleCheckout}
                      disabled={cartItems.length === 0}
                    >
                      Checkout
                    </Button>
                  </>
                )}
              </Spin>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Recent Sales">
              <Table
                columns={salesColumns}
                dataSource={sales.slice(0, 10)}
                loading={salesLoading}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Sales;
