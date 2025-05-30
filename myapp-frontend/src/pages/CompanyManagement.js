import { useState, useEffect } from 'react';
import {
  Table, Button, Input, Modal, Form, Space, Dropdown, Checkbox, Select, Row, Col, message
} from 'antd';
import { DownOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../styles/theme.css';

export default function CompanyManagement({ showNotify }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showCols, setShowCols] = useState([
    'index', 'name', 'username', 'password',
    'ships', 'networkPackages', 'networkStatuses',
    'servicePackages', 'serviceStatuses', 'phones', 'notes',
    'action'
  ]);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_, __, index) => index + 1 // Hiển thị thứ tự tự động
    },
    {
      title: 'Tên công ty',
      key: 'name',
      render: (_, rec, idx) => {
        const firstShip = rec.subscriptions?.[0]?.ship || '';
        return idx === 0 ? `${rec.name} - ${firstShip}` : rec.name;
      }
    },
    {
      title: 'Tàu',
      key: 'ships',
      render: (_, rec) => (
        rec.subscriptions.map((s, idx) => (
          <div key={idx}>
            {idx === 0 ? `${rec.name} - ${s.ship}` : s.ship}
          </div>
        ))
      )
    },
    {
      title: 'Gói thuê bao',
      key: 'networkPackages',
      render: (_, rec) =>
        rec.subscriptions.map((s, idx) => (
          <div key={idx}>{s.networkPackage || '-'}</div>
        ))
    },
    {
      title: 'Top-up',
      key: 'topUps',
      render: (_, rec) =>
        rec.subscriptions.map((s, idx) => (
          <div key={idx}>{s.topUp || '-'}</div>
        ))
    },
    {
      title: 'Trạng thái mạng',
      key: 'networkStatuses',
      render: (_, rec) =>
        rec.subscriptions.map((s, idx) => (
          <div key={idx}>{s.networkStatus === 'Paused' ? 'Chưa kích hoạt' : s.networkStatus}</div>
        ))
    },
    {
      title: 'Gói DV',
      key: 'servicePackages',
      render: (_, rec) =>
        rec.subscriptions.map((s, idx) => (
          <div key={idx}>{s.servicePackage || '-'}</div>
        ))
    },
    {
      title: 'Trạng thái DV',
      key: 'serviceStatuses',
      render: (_, rec) =>
        rec.subscriptions.map((s, idx) => (
          <div key={idx}>{s.serviceStatus || '-'}</div>
        ))
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, rec) => rec.subscriptions.some(s => s.networkStatus === 'Active') ? 'Active' : 'Chưa kích hoạt'
    },
    {
      title: 'SĐT',
      key: 'phones',
      render: (_, rec) =>
        rec.subscriptions.map((s, idx) => (
          <div key={idx}>{s.phone || '-'}</div>
        ))
    },
    {
      title: 'Ghi chú',
      key: 'notes',
      render: (_, rec) =>
        rec.subscriptions.map((s, idx) => (
          <div key={idx}>{s.note || '-'}</div>
        ))
    },
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

  const fetchData = async (q = '') => {
    setLoading(true);
    try {
      const res = await axios.get('/api/companies', { params: { q } });
      setData(res.data.map(c => ({ ...c, key: c._id })));
    } catch {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, []);

  const onSearch = v => fetchData(v);
  const onRefresh = () => fetchData();
  const onCreate = () => {
    setEditing(null);
    form.resetFields();
    setVisible(true);
  };
  const onEdit = rec => {
    setEditing(rec);
    form.setFieldsValue({
      name: rec.name,
      username: rec.username,
      password: rec.password,
      subscriptions: rec.subscriptions || []
    });
    setVisible(true);
  };
  const onDelete = async id => {
    try {
      await axios.delete(`/api/companies/${id}`);
      fetchData();
    } catch {
      message.error('Xóa thất bại');
    }
  };
  const onFinish = async (vals) => {
    try {
      await axios.post('/api/companies', vals);
      showNotify({ type: 'success', message: 'Thành công', description: 'Tạo công ty thành công!' });
      setVisible(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      showNotify({ type: 'error', message: 'Thất bại', description: err.response?.data?.message || 'Có lỗi xảy ra!' });
    }
  };

  const menu = (
    <div style={{ padding: 8 }}>
      {columns.map(c => c.key !== 'action' && (
        <Checkbox
          key={c.key}
          checked={showCols.includes(c.key)}
          onChange={e => {
            setShowCols(prev =>
              e.target.checked
                ? [...prev, c.key]
                : prev.filter(k => k !== c.key)
            );
          }}
        >{c.title}</Checkbox>
      ))}
    </div>
  );
  const visibleCols = columns.filter(c => showCols.includes(c.key));

  return (
    <>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="filter-bar">
          <Space wrap>
            <Input.Search placeholder="Tìm theo cty" onSearch={onSearch} style={{ width: 240 }} />
            <Button type="primary" onClick={onCreate}>Tạo mới</Button>
            <Button icon={<ReloadOutlined />} onClick={onRefresh} />
            <Dropdown overlay={menu} trigger={['click']}>
              <Button icon={<SettingOutlined />}>
                Cài đặt <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        </div>
      </Space>

      <div className="table-container">
        <Table
          loading={loading}
          columns={visibleCols}
          dataSource={data}
          pagination={{ pageSize: 10 }}
          rowClassName={(rec, idx) =>
            idx % 2 === 0 ? 'even-row' : 'odd-row'
          }
        />
      </div>

      <Modal
        width={800}
        title={editing ? 'Chỉnh sửa công ty' : 'Thêm công ty'}
        open={visible}
        onCancel={() => { setVisible(false); form.resetFields(); }}
        onOk={() => form.submit()}
        bodyStyle={{ padding: '24px' }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Tên công ty" name="name"
                rules={[
                  { required: true, message: 'Nhập tên công ty' },
                  { min: 2, message: 'Tối thiểu 2 ký tự' },
                  { max: 100, message: 'Tối đa 100 ký tự' },
                  { pattern: /^[\p{L}0-9 ]+$/u, message: 'Chỉ chữ, số và khoảng trắng' }
                ]}
              >
                <Input placeholder="VD: Công ty ABC" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Username" name="username"
                rules={[
                  { required: true, message: 'Nhập username' },
                  {
                    pattern: /^[A-Za-z][A-Za-z0-9_]{5,15}$/,
                    message: '6–16 ký tự, bắt đầu chữ, chỉ chữ/số/_'
                  }
                ]}
              >
                <Input placeholder="VD: user_abc123" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Password" name="password"
                rules={[
                  { required: true, message: 'Nhập password' },
                  { min: 8, message: 'Tối thiểu 8 ký tự' }
                ]}
              >
                <Input.Password placeholder="Tối thiểu 8 ký tự" />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="subscriptions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }, idx) => (
                  <div
                    key={key}
                    style={{
                      border: '1px dashed #d9d9d9',
                      padding: 16,
                      marginBottom: 12,
                      borderRadius: 4,
                      position: 'relative'
                    }}
                  >
                    <Button
                      type="text"
                      danger
                      size="small"
                      style={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => remove(name)}
                    >
                      Xóa tàu
                    </Button>
                    <Row gutter={[16, 12]}>
                      <Col xs={24} sm={4}>
                        <Form.Item {...rest} name={[name, 'ship']} label="Tàu">
                          <Input placeholder="Số hoặc tên tàu" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Form.Item {...rest} name={[name, 'networkPackage']} label="Gói thuê bao"
                          rules={[{ pattern: /^\d+G$/, message: 'Ví dụ: 50G, 100G' }]}
                        >
                          <Select placeholder="Chọn gói thuê bao">
                            <Select.Option value="50G">50G</Select.Option>
                            <Select.Option value="100G">100G</Select.Option>
                            <Select.Option value="250G">250G</Select.Option>
                            <Select.Option value="300G">300G</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={6}>
      <Form.Item noStyle shouldUpdate={(prev, cur) =>
        prev.subscriptions?.[name]?.networkPackage !== cur.subscriptions?.[name]?.networkPackage
      }>
        {({ getFieldValue }) => {
          const pkg = getFieldValue(['subscriptions', name, 'networkPackage']);
          return (
            <Form.Item
              {...rest}
              name={[name, 'topUp']}
              label="Top‑up"
              // rules={[{ required: !!pkg, message: 'Chọn top‑up' }]}
            >
              <Select placeholder="Chọn Top‑up"
                disabled={!pkg}
              >
                <Select.Option value="450GB">450GB</Select.Option>
                <Select.Option value="600GB">600GB</Select.Option>
                <Select.Option value="750GB">750GB</Select.Option>
                <Select.Option value="900GB">900GB</Select.Option>
                <Select.Option value="1TB">1TB</Select.Option>
              </Select>
            </Form.Item>
          );
        }}
      </Form.Item>
    </Col>
                      <Col xs={24} sm={6}>
                        <Form.Item {...rest} name={[name, 'networkStatus']} label="Trạng thái mạng"
                          rules={[{ required: true, message: 'Chọn trạng thái mạng' }]}
                        >
                          <Select placeholder="Chọn trạng thái">
                            <Select.Option value="Active">Hoạt động</Select.Option>
                            <Select.Option value="Paused">Chưa kích hoạt</Select.Option>
                            <Select.Option value="Expired">Hết hạn</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item {...rest} name={[name, 'servicePackage']} label="Gói DV"
                          rules={[{ required: true, message: 'Nhập gói dịch vụ' }]}
                        >
                          <Select placeholder="Chọn gói dịch vụ">
                            <Select.Option value="Gói 1">Gói 1</Select.Option>
                            <Select.Option value="Gói 2">Gói 2</Select.Option>
                            <Select.Option value="Gói 3">Gói 3</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Form.Item {...rest} name={[name, 'serviceStatus']} label="Trạng thái DV"
                          rules={[{ required: true, message: 'Chọn trạng thái DV' }]}
                        >
                          <Select placeholder="Chọn trạng thái">
                            <Select.Option value="Active">Hoạt động</Select.Option>
                            <Select.Option value="Paused">Chưa kích hoạt</Select.Option>
                            <Select.Option value="Expired">Hết hạn</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Form.Item {...rest} name={[name, 'phone']} label="SĐT"
                          rules={[
                            { pattern: /^(03|05|07|08|09|01[2689])[0-9]{8}$/, message: 'SĐT VN 10 số' }
                          ]}
                        >
                          <Input placeholder="VD: 0912345678" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={6}>
                        <Form.Item {...rest} name={[name, 'note']} label="Ghi chú"
                          rules={[{ max: 200, message: 'Tối đa 200 ký tự' }]}
                        >
                          <Input placeholder="Thêm ghi chú (nếu có)" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" block onClick={() => add()} style={{ marginTop: 8 }}>
                    + Thêm tàu
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
}
