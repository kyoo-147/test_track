// src/pages/SpeedManagement.js
import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  InputNumber,
  Input,
  Modal,
  Form,
  Space,
  Dropdown,
  Checkbox,
  Row,
  Col,
  message
} from 'antd';
import { DownOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../styles/theme.css';


export default function SpeedManagement() {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [visible, setVisible]   = useState(false);
  const [editing, setEditing]   = useState(null);
  const [showCols, setShowCols] = useState([
    '_id','upRate','downRate','burst','description','note','action'
  ]);
  const [form] = Form.useForm();

  // Định nghĩa cột
  const columns = [
    { title: 'ID', dataIndex: '_id', key: '_id' },
    { title: 'Tốc độ upload (Mbps)', dataIndex: 'upRate', key: 'upRate' },
    { title: 'Tốc độ download (Mbps)', dataIndex: 'downRate', key: 'downRate' },
    { title: 'Burst Limit', dataIndex: 'burst', key: 'burst' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, rec) => (
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
      const res = await axios.get('/api/speeds');
      setData(res.data.map(i => ({ ...i, key: i._id })));
    } catch {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, []);

  // Các handler CRUD
  const onCreate = () => {
    setEditing(null);
    form.resetFields();
    setVisible(true);
  };
  const onEdit = rec => {
    setEditing(rec);
    form.setFieldsValue(rec);
    setVisible(true);
  };
  const onDelete = async id => {
    try {
      await axios.delete(`/api/speeds/${id}`);
      message.success('Xóa thành công');
      fetchData();
    } catch {
      message.error('Xóa thất bại');
    }
  };
  const onFinish = async vals => {
    try {
      if (editing) {
        await axios.put(`/api/speeds/${editing._id}`, vals);
      } else {
        await axios.post('/api/speeds', vals);
      }
      message.success('Thao tác thành công');
      setVisible(false);
      form.resetFields();
      fetchData();
    } catch {
      message.error('Thao tác thất bại');
    }
  };

  // Menu cài đặt cột hiển thị
  const menu = (
    <div style={{ padding: 8 }}>
      {columns.map(col =>
        col.key !== 'action' && (
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
        )
      )}
    </div>
  );
  const visibleCols = columns.filter(col => showCols.includes(col.key));

  return (
    <>
      {/* Thanh điều khiển */}
      <Space wrap style={{ marginBottom: 16 }}>
      <div className="filter-bar">
      <Space wrap>
        <Button type="primary" onClick={onCreate}>Tạo mới</Button>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>Refresh</Button>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button icon={<SettingOutlined />}>Cài đặt <DownOutlined/></Button>
        </Dropdown>
      </Space>
      </div>
     </Space>

      {/* Bảng dữ liệu */}
      <div className="table-container">
      <Table
        loading={loading}
        columns={visibleCols}
        dataSource={data}
        pagination={false}
      />
      </div>

      {/* Modal Thêm/Sửa */}
      <Modal
        title={editing ? 'Chỉnh sửa tốc độ' : 'Thêm tốc độ'}
        open={visible}
        onCancel={() => { setVisible(false); form.resetFields(); }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            upRate: null,
            downRate: null,
            burst: '',
            description: '',
            note: ''
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="upRate"
                label="Tốc độ upload (Mbps)"
                rules={[
                  { required: true, message: 'Nhập tốc độ upload' },
                  {
                    type: 'number',
                    min: 0.1,
                    message: 'Tốc độ phải ≥ 0.1 Mbps'
                  },
                  {
                    pattern: /^\d+(\.\d+)?$/,
                    message: 'Chỉ cho phép số và thập phân'
                  }
                ]}
              >
                <InputNumber
                  min={0.1}
                  step={0.1}
                  style={{ width: '100%' }}
                  placeholder="Ví dụ: 4 hoặc 4.5"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="downRate"
                label="Tốc độ download (Mbps)"
                rules={[
                  { required: true, message: 'Nhập tốc độ download' },
                  {
                    type: 'number',
                    min: 0.1,
                    message: 'Tốc độ phải ≥ 0.1 Mbps'
                  },
                  {
                    pattern: /^\d+(\.\d+)?$/,
                    message: 'Chỉ cho phép số và thập phân'
                  }
                ]}
              >
                <InputNumber
                  min={0.1}
                  step={0.1}
                  style={{ width: '100%' }}
                  placeholder="Ví dụ: 10 hoặc 10.5"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="burst"
                label="Burst Limit"
                rules={[
                  {
                    pattern: /^\d+M\/\d+M$/,
                    message: 'Định dạng phải là {số}M/{số}M (e.g., 8M/8M)'
                  }
                ]}
              >
                <Input placeholder="Ví dụ: 8M/8M" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ max: 100, message: 'Tối đa 100 ký tự' }]}
              >
                <Input placeholder="Mô tả (tối đa 100 ký tự)" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="note"
                label="Ghi chú"
                rules={[{ max: 200, message: 'Tối đa 200 ký tự' }]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Ghi chú (tối đa 200 ký tự)"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
