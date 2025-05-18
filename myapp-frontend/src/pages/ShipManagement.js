// src/pages/ShipManagement.js
import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Space,
  Dropdown,
  Checkbox,
  Select,
  Row,
  Col,
  message
} from 'antd';
import {
  DownOutlined,
  ReloadOutlined,
  SettingOutlined
} from '@ant-design/icons';
import axios from 'axios';
import '../styles/theme.css';

export default function ShipManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showCols, setShowCols] = useState([
    '_id','shipName','code','ip','company',
    'networkPackage','activation','servicePackage',
    'status','note','action'
  ]);
  const [form] = Form.useForm();

  const columns = [
    { title: 'ID', dataIndex: '_id', key: '_id' },
    { title: 'Tên tàu', dataIndex: 'shipName', key: 'shipName' },
    { title: 'Mã hiệu', dataIndex: 'code', key: 'code' },
    { title: 'Địa chỉ IP', dataIndex: 'ip', key: 'ip' },
    { title: 'Công ty', dataIndex: 'company', key: 'company' },
    { title: 'Gói thuê bao', dataIndex: 'networkPackage', key: 'networkPackage' },
    { title: 'Kích hoạt', dataIndex: 'activation', key: 'activation' },
    { title: 'Gói dịch vụ', dataIndex: 'servicePackage', key: 'servicePackage' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>Sửa</Button>
          <Button type="link" danger onClick={() => onDelete(record._id)}>Xóa</Button>
          <Button size="small" onClick={() => onCheck(record._id)}>Kiểm tra</Button>
        </Space>
      )
    }
  ];

  // Fetch dữ liệu
  const fetchData = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/ships', { params: filters });
      setData(res.data.map(item => ({ ...item, key: item._id })));
    } catch {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Các handler
  const onSearchCompany = v => fetchData({ company: v });
  const onSearchShip = v => fetchData({ shipName: v });
  const onRefresh = () => fetchData();
  const onCreate = () => {
    setEditing(null);
    form.resetFields();
    setVisible(true);
  };
  const onEdit = record => {
    setEditing(record);
    form.setFieldsValue({ ...record });
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
  const onCheck = id => {
    // Tùy chỉnh gọi API kiểm tra trạng thái thực tế
    message.info(`Kiểm tra trạng thái tàu ${id}`);
  };
  const onFinish = async values => {
    try {
      if (editing) {
        await axios.put(`/api/ships/${editing._id}`, values);
        message.success('Cập nhật thành công');
      } else {
        await axios.post('/api/ships', values);
        message.success('Tạo mới thành công');
      }
      setVisible(false);
      form.resetFields();
      fetchData();
    } catch {
      message.error('Thao tác thất bại');
    }
  };

  // Cài đặt cột hiển thị
  const menu = (
    <div style={{ padding: 8 }}>
      {columns.map(col =>
        col.key !== 'action' ? (
          <Checkbox
            key={col.key}
            checked={showCols.includes(col.key)}
            onChange={e => {
              setShowCols(prev =>
                e.target.checked
                  ? [...prev, col.key]
                  : prev.filter(k => k !== col.key)
              );
            }}
          >
            {col.title}
          </Checkbox>
        ) : null
      )}
    </div>
  );
  const visibleColumns = columns.filter(col => showCols.includes(col.key));

  return (
    <>
      {/* Thanh điều khiển */}
      <Space wrap style={{ marginBottom: 16 }}>
      <div className="filter-bar">
      <Space wrap>
        <Input.Search placeholder="Tìm theo công ty" onSearch={onSearchCompany} style={{ width: 200 }} />
        <Input.Search placeholder="Tìm theo tên tàu" onSearch={onSearchShip} style={{ width: 200 }} />
        <Button type="primary" onClick={onCreate}>Tạo mới</Button>
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>Refresh</Button>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button icon={<SettingOutlined />}>Cài đặt <DownOutlined /></Button>
        </Dropdown>
      </Space>
      </div>
     </Space>

      {/* Bảng dữ liệu */}
      <div className="table-container">
      <Table
        loading={loading}
        columns={visibleColumns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
      />
      </div>

      {/* Modal Thêm/Sửa */}
      <Modal
        width={700}
        title={editing ? 'Chỉnh sửa tàu' : 'Thêm tàu'}
        open={visible}
        onCancel={() => { setVisible(false); form.resetFields(); }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            shipName: '',
            code: '',
            ip: '',
            company: '',
            networkPackage: '',
            activation: undefined,
            servicePackage: '',
            status: undefined,
            note: ''
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="shipName"
                label="Tên tàu"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên tàu' },
                  { min: 2, message: 'Tối thiểu 2 ký tự' },
                  { max: 50, message: 'Tối đa 50 ký tự' },
                  { pattern: /^[A-Za-z0-9 ]+$/, message: 'Chỉ chữ, số và khoảng trắng' }
                ]}
              >
                <Input placeholder="VD: Tau A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Mã hiệu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã hiệu' },
                  { pattern: /^\d{9}$/, message: 'Mã hiệu phải gồm 9 chữ số' }
                ]}
              >
                <Input placeholder="123456789" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ip"
                label="Địa chỉ IP"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ IP' },
                  { pattern: /^(?:\d{1,3}\.){3}\d{1,3}$/, message: 'IP không hợp lệ' }
                ]}
              >
                <Input placeholder="172.168.0.1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="company"
                label="Công ty"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên công ty' },
                  { min: 2, message: 'Tối thiểu 2 ký tự' },
                  { max: 100, message: 'Tối đa 100 ký tự' }
                ]}
              >
                <Input placeholder="Công ty A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="networkPackage"
                label="Gói thuê bao"
                rules={[
                  { pattern: /^\d+G$/, message: 'Ví dụ: 50G, 100G' }
                ]}
              >
                <Input placeholder="50G" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="activation"
                label="Kích hoạt"
                rules={[{ required: true, message: 'Chọn trạng thái kích hoạt' }]}
              >
                <Select placeholder="Chọn">
                  <Select.Option value="active">active</Select.Option>
                  <Select.Option value="inactive">inactive</Select.Option>
                  <Select.Option value="debt">nợ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="servicePackage"
                label="Gói dịch vụ"
                rules={[
                  { required: true, message: 'Vui lòng nhập gói dịch vụ' },
                  { max: 20, message: 'Tối đa 20 ký tự' }
                ]}
              >
                <Input placeholder="2" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Chọn trạng thái' }]}
              >
                <Select placeholder="Chọn">
                  <Select.Option value="active">active</Select.Option>
                  <Select.Option value="limit">limit</Select.Option>
                  <Select.Option value="suspended">suspended</Select.Option>
                  <Select.Option value="noactive">no active</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="note"
                label="Ghi chú"
                rules={[{ max: 200, message: 'Tối đa 200 ký tự' }]}
              >
                <Input.TextArea rows={2} placeholder="Ghi chú (nếu có)" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
