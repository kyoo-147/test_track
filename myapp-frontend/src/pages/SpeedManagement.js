// src/pages/SpeedManagement.js
import { useState, useEffect } from 'react';
import {
  Table, Button, Input, Modal, Form, Space, Select, Row, Col, message
} from 'antd';
import axios from 'axios';
import '../styles/theme.css';

export default function SpeedManagement() {
  const [data, setData]         = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [visible, setVisible]   = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState(null);

  // Định nghĩa cột
  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Company', dataIndex: ['company', 'name'], key: 'company', render: (v, rec) => rec.company?.name || '' },
    {
      title: 'Action', key: 'action', render: (_, rec) => (
        <Space>
          <Button type="link" onClick={() => onEdit(rec)}>Edit</Button>
          <Button type="link" danger onClick={() => onDelete(rec._id)}>Del</Button>
        </Space>
      )
    }
  ];

  // Tải dữ liệu từ server
  const fetchData = async () => {
    setLoading(true);
    try {
      // Lấy danh sách user quản trị và danh sách công ty
      const [users, comps] = await Promise.all([
        axios.get('/api/admin-users'),
        axios.get('/api/companies')
      ]);
      setData(users.data.map(i => ({ ...i, key: i._id })));
      setCompanies(comps.data);
    } catch (err) {
      message.error('Không thể tải dữ liệu');
      setCompanies([]); // Đảm bảo không bị undefined
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Các handler CRUD
  const onCreate = () => {
    setEditing(null);
    setSelectedRole(null);
    setVisible(true);
    // Chờ Modal mở xong, rồi mới reset
    setTimeout(() => {
      form.resetFields();
    }, 0);
  };
  const onEdit = rec => {
    setEditing(rec);
    setSelectedRole(rec.role);
    form.setFieldsValue({ ...rec, company: rec.company?._id });
    setVisible(true);
  };
  const onDelete = async id => {
    try { await axios.delete(`/api/admin-users/${id}`); message.success('Xóa thành công'); fetchData(); }
    catch { message.error('Xóa thất bại'); }
  };
  const onFinish = async vals => {
    try {
      if (selectedRole !== 'Tech') vals.company = undefined;
      if (editing) await axios.put(`/api/admin-users/${editing._id}`, vals);
      else await axios.post('/api/admin-users', vals);
      message.success('Thao tác thành công');
      setVisible(false); form.resetFields(); fetchData();
    } catch {
      message.error('Thao tác thất bại');
    }
  };

  // Khi chọn quyền, nếu là Tech thì enable select công ty, ngược lại disable và clear
  const handleRoleChange = value => {
    setSelectedRole(value);
    if (value !== 'Tech') {
      form.setFieldsValue({ company: undefined });
    }
  };

  return (
    <>
      {/* Thanh điều khiển */}
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={onCreate}>Tạo mới</Button>
        <Button onClick={fetchData}>Refresh</Button>
      </Space>

      {/* Bảng dữ liệu */}
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="_id"
      />

      {/* Modal Thêm/Sửa */}
      <Modal
        title={editing ? 'Chỉnh sửa user quản trị' : 'Thêm user quản trị'}
        open={visible}
        onCancel={() => { setVisible(false); form.resetFields(); setSelectedRole(null); }}
        onOk={() => form.submit()}
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                <Input autoFocus />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role" label="Quyền" rules={[{ required: true }]}>
                <Select
                  placeholder="Chọn quyền"
                  onChange={handleRoleChange}
                  value={selectedRole}
                >
                  <Select.Option value="Admin">Admin</Select.Option>
                  <Select.Option value="Tech">Tech</Select.Option>
                  <Select.Option value="Sales">Sales</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="company"
                label="Công ty (chỉ cho Tech)"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (selectedRole === 'Tech' && !value) {
                        return Promise.reject('Chọn công ty cho Tech');
                      }
                      return Promise.resolve();
                    }
                  })
                ]}
              >
                <Select
                  placeholder="Chọn công ty"
                  allowClear
                  disabled={selectedRole !== 'Tech'}
                  showSearch
                  optionFilterProp="children"
                  notFoundContent={companies.length === 0 ? 'Không có dữ liệu công ty' : null}
                >
                  {companies.map(c => (
                    <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
