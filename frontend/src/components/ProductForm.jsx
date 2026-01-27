import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, Modal, message, Spin } from 'antd';
import { useCreateProduct, useUpdateProduct, useProduct } from '../hooks/useProducts';

const ProductForm = ({ productId, onSuccess, onCancel, isModalVisible }) => {
  const [form] = Form.useForm();
  const { data: product, isLoading: productLoading } = useProduct(productId);
  const { mutate: createProduct, isPending: createLoading } = useCreateProduct();
  const { mutate: updateProduct, isPending: updateLoading } = useUpdateProduct();

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        sku: product.sku,
        price: parseFloat(product.price),
        stock_quantity: product.stock_quantity,
      });
    } else {
      form.resetFields();
    }
  }, [product, form]);

  const onFinish = (values) => {
    if (productId) {
      updateProduct(
        { id: productId, data: values },
        {
          onSuccess: () => {
            message.success('Product updated successfully');
            onSuccess();
          },
          onError: (error) => {
            message.error(error.response?.data?.message || 'Failed to update product');
          },
        }
      );
    } else {
      createProduct(values, {
        onSuccess: () => {
          message.success('Product created successfully');
          form.resetFields();
          onSuccess();
        },
        onError: (error) => {
          message.error(error.response?.data?.message || 'Failed to create product');
        },
      });
    }
  };

  return (
    <Modal
      title={productId ? 'Edit Product' : 'Create Product'}
      open={isModalVisible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Spin spinning={productLoading || createLoading || updateLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="Product Name" />
          </Form.Item>

          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: 'Please enter SKU' }]}
          >
            <Input placeholder="SKU" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              precision={2}
              style={{ width: '100%' }}
              placeholder="Price"
            />
          </Form.Item>

          <Form.Item
            name="stock_quantity"
            label="Stock Quantity"
            rules={[{ required: true, message: 'Please enter stock quantity' }]}
          >
            <InputNumber
              min={0}
              step={1}
              style={{ width: '100%' }}
              placeholder="Stock Quantity"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {productId ? 'Update Product' : 'Create Product'}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ProductForm;
