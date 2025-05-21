// src/pages/ShipManagement.js
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Input, Modal, Form, Space, Select, Row, Col, DatePicker, message
} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

export default function ShipManagement() {
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Tên tàu', dataIndex: 'shipName', key: 'shipName' },
    { title: 'MMSI', dataIndex: 'mmsi', key: 'mmsi' },
    { title: 'Địa chỉ IP', dataIndex: 'ip', key: 'ip' },
    { title: 'Loại tàu', dataIndex: 'shipType', key: 'shipType' },
    {
      title: 'Ngày lắp đặt',
      dataIndex: 'installationDate',
      key: 'installationDate',
      render: d => d ? moment(d).format('DD-MM-YYYY') : ''
    },
    { title: 'Loại thiết bị', dataIndex: 'deviceType', key: 'deviceType' },
    { title: 'Trạng thái Starlink', dataIndex: 'starlinkStatus', key: 'starlinkStatus' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, rec) => (
        <Space>
          <Button type="link" onClick={() => onEdit(rec)}>Sửa</Button>
          <Button type="link" danger onClick={() => onDelete(rec._id)}>Xóa</Button>
        </Space>
      )
    }
  ];

  // fetch ships
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/ships');
      setData(res.data);
    } catch {
      message.error('Không thể tải dữ liệu tàu');
    } finally {
      setLoading(false);
    }
  };

  // fetch companies
  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/api/companies');
      setCompanies(res.data);
    } catch {
      message.error('Không thể tải danh sách công ty');
    }
  };

  useEffect(() => {
    fetchData();
    fetchCompanies();
  }, []);

  const onCreate = () => {
    setEditing(null);
    form.resetFields();
    setVisible(true);
  };

  const onEdit = record => {
    setEditing(record);
    setSubscriptions(
      companies.find(c => c._id === record.company)?.subscriptions || []
    );
    form.setFieldsValue({
      ...record,
      installationDate: record.installationDate ? moment(record.installationDate) : null
    });
    setVisible(true);
  };

  const onDelete = async id => {
    try {
      await axios.delete(`/api/ships/${id}`);
      message.success('Xóa thành công');
      fetchData();
    } catch {
      message.error('Xóa thất bại');
    }
  };

  const onFinish = async values => {
    const payload = {
      ...values,
      installationDate: values.installationDate
        ? values.installationDate.toISOString()
        : null
    };
    try {
      if (editing) {
        await axios.put(`/api/ships/${editing._id}`, payload);
      } else {
        await axios.post('/api/ships', payload);
      }
      message.success('Lưu thành công');
      setVisible(false);
      form.resetFields();
      fetchData();
    } catch {
      message.error('Thao tác thất bại');
    }
  };

  const handleCompanyChange = companyId => {
    const c = companies.find(x => x._id === companyId);
    setSubscriptions(c?.subscriptions || []);
    form.setFieldsValue({ networkPackage: undefined, servicePackage: undefined });
  };

  const handleSubscriptionChange = subscriptionId => {
    const s = subscriptions.find(x => x._id === subscriptionId);
    form.setFieldsValue({ servicePackage: s?.servicePackage || undefined });
  };

  return (
    <>
      <Space wrap style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={onCreate}>Tạo mới</Button>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>Refresh</Button>
      </Space>

      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        width={800}
        title={editing ? 'Chỉnh sửa tàu' : 'Thêm tàu'}
        open={visible}
        onCancel={() => { setVisible(false); form.resetFields(); }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="company"
                label="Tên công ty"
                rules={[{ required: true, message: 'Chọn công ty' }]}
              >
                <Select placeholder="Chọn công ty" onChange={handleCompanyChange}>
                  {companies.map(c => (
                    <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="networkPackage"
                label="Gói thuê bao"
                rules={[{ required: true, message: 'Chọn gói thuê bao' }]}
              >
                <Select
                  placeholder="Chọn gói thuê bao"
                  onChange={handleSubscriptionChange}
                  disabled={!subscriptions.length}
                >
                  {subscriptions.map(s => (
                    <Select.Option key={s._id} value={s._id}>{s.networkPackage}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="servicePackage"
                label="Gói dịch vụ"
                rules={[{ required: true, message: 'Chọn gói dịch vụ' }]}
              >
                <Input disabled placeholder="Tự động từ gói thuê bao" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="shipName"
                label="Tên tàu"
                rules={[{ required: true, message: 'Nhập tên tàu' }]}
              >
                <Input placeholder="VD: Tàu A" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="mmsi"
                label="MMSI"
                rules={[
                  { required: true, message: 'Nhập MMSI' },
                  { pattern: /^\d{9}$/, message: 'MMSI phải là 9 chữ số' }
                ]}
              >
                <Input placeholder="VD: 123456789" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="ip"
                label="Địa chỉ IP"
                rules={[
                  { required: true, message: 'Nhập địa chỉ IP' },
                  {
                    pattern:
                      /^(25[0-5]|2[0-4]\d|[01]?\d?\d)\.(25[0-5]|2[0-4]\d|[01]?\d?\d)\.(25[0-5]|2[0-4]\d|[01]?\d?\d)\.(25[0-5]|2[0-4]\d|[01]?\d?\d)$/,
                    message: 'IP không hợp lệ'
                  }
                ]}
              >
                <Input placeholder="VD: 192.168.1.1" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="shipType"
                label="Loại tàu"
                rules={[{ required: true, message: 'Chọn loại tàu' }]}
              >
                <Select placeholder="Chọn loại tàu">
                  <Select.Option value="Tàu hàng rời">Tàu hàng rời</Select.Option>
                  <Select.Option value="Tàu cont">Tàu cont</Select.Option>
                  <Select.Option value="Tàu chở dầu">Tàu chở dầu</Select.Option>
                  <Select.Option value="Tàu chở cont">Tàu chở cont</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="installationDate"
                label="Ngày lắp đặt"
                rules={[{ required: true, message: 'Chọn ngày lắp đặt' }]}
              >
                <DatePicker
                  format="DD-MM-YYYY"
                  style={{ width: '100%' }}
                  placeholder="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="deviceType"
                label="Loại thiết bị"
                rules={[{ required: true, message: 'Chọn loại thiết bị' }]}
              >
                <Select placeholder="Chọn thiết bị">
                  <Select.Option value="Router">Router</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="starlinkStatus"
                label="Trạng thái Starlink"
                rules={[{ required: true, message: 'Chọn trạng thái Starlink' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="Online">Online</Select.Option>
                  <Select.Option value="Offline">Offline</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="note" label="Ghi chú">
                <Input.TextArea rows={2} placeholder="Ghi chú (nếu có)" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
