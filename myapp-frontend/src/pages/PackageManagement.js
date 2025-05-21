// src/pages/PackageManagement.js
import { useState, useEffect } from 'react';
import {
  Table, Button, Input, InputNumber, Modal, Form, Space,
  Dropdown, Checkbox, Row, Col, Select, message
} from 'antd';
import { DownOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../styles/theme.css';

const BANDWIDTH_OPTIONS = [
  '2Mbps', '5Mbps', '10Mbps', '20Mbps', '50Mbps', '100Mbps'
];
const UNIT_OPTIONS = ['1hour', 'day', '1w', '1 tháng'];
const LIMIT_TYPE_OPTIONS = ['Time Limit', 'Data Limit', 'Both Limit'];
const PRICE_OPTIONS = [100000, 200000, 500000, 1000000];

export default function PackageManagement() {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [visible, setVisible]   = useState(false);
  const [editing, setEditing]   = useState(null);
  const [showCols, setShowCols] = useState([
    '_id','name','radius','limitType','bandwidth','validity','unit','price','sharedUsers','vessel','action'
  ]);
  const [form] = Form.useForm();
  const [ships, setShips] = useState([]);

  const columns = [
    { title:'ID', dataIndex:'_id', key:'_id' },
    { title:'Tên gói', dataIndex:'name', key:'name' },
    { title:'Radius', dataIndex:'radius', key:'radius' },
    { title:'Loại giới hạn', dataIndex:'limitType', key:'limitType' },
    { title:'Băng thông', dataIndex:'bandwidth', key:'bandwidth' },
    { title:'Hiệu lực', dataIndex:'validity', key:'validity' },
    { title:'Đơn vị', dataIndex:'unit', key:'unit' },
    { title:'Giá', dataIndex:'price', key:'price', render: v => v?.toLocaleString() },
    { title:'Shared Users', dataIndex:'sharedUsers', key:'sharedUsers' },
    { title:'Tàu', dataIndex:['vessel','shipName'], key:'vessel', render: (v, rec) => rec.vessel?.shipName || '' },
    {
      title:'Hành động', key:'action', render:(_,rec)=>(
        <Space size="middle">
          <Button type="text" onClick={()=>onEdit(rec)}>Edit</Button>
          <Button type="text" danger onClick={()=>onDelete(rec._id)}>Del</Button>
        </Space>
      )
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/packages');
      setData(res.data.map(i=>({ ...i, key: i._id })));
    } catch {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchShips = async () => {
    try {
      const res = await axios.get('/api/ships');
      setShips(res.data);
    } catch {
      message.error('Không thể tải danh sách tàu');
    }
  };

  useEffect(()=>{ fetchData(); fetchShips(); },[]);

  const onRefresh    = () => fetchData();
  const onCreate     = () => { setEditing(null); form.resetFields(); setVisible(true); };
  const onEdit       = rec => { setEditing(rec); form.setFieldsValue({ ...rec, vessel: rec.vessel?._id }); setVisible(true); };
  const onDelete     = async id => {
    try { await axios.delete(`/api/packages/${id}`); message.success('Xóa thành công'); fetchData(); }
    catch { message.error('Xóa thất bại'); }
  };

  const onFinish = async vals => {
    try {
      if (editing) await axios.put(`/api/packages/${editing._id}`, vals);
      else         await axios.post('/api/packages', vals);
      message.success('Thao tác thành công');
      setVisible(false); form.resetFields(); fetchData();
    } catch {
      message.error('Thao tác thất bại');
    }
  };

  // Column toggle menu
  const menu = (
    <div style={{ padding:8 }}>
      {columns.map(c=>c.key!=='action' && (
        <Checkbox
          key={c.key}
          checked={showCols.includes(c.key)}
          onChange={e=>{
            setShowCols(prev=>
              e.target.checked ? [...prev,c.key] : prev.filter(k=>k!==c.key)
            );
          }}
        >{c.title}</Checkbox>
      ))}
    </div>
  );
  const visibleCols = columns.filter(c=>showCols.includes(c.key));

  return (
    <>
      <Space wrap style={{ marginBottom:16 }}>
        <div className="filter-bar">
            <Space wrap>
                <Button type="primary" onClick={onCreate}>Tạo mới</Button>
                <Button icon={<ReloadOutlined />} onClick={onRefresh}>Refresh</Button>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button icon={<SettingOutlined />}>Cài đặt <DownOutlined/></Button>
                </Dropdown>
            </Space>
        </div>
      </Space>

      <div className="table-container">
      <Table
        loading={loading}
        columns={visibleCols}
        dataSource={data}
        pagination={{ pageSize:10 }}
      />
      </div>

      <Modal
        title={editing ? 'Chỉnh sửa gói' : 'Thêm gói'}
        open={visible}
        onCancel={()=>{ setVisible(false); form.resetFields(); }}
        onOk={()=>form.submit()}
        width={750}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name:'', radius:'', limitType:'', bandwidth:'', validity:null,
            unit:'', price:null, sharedUsers:1, vessel:''
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name" label="Tên gói"
                rules={[{ required:true, message:'Nhập tên gói' }]}
              >
                <Input placeholder="VD: Gói 50G" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="radius" label="Radius"
              >
                <Input placeholder="Radius (nếu có)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="limitType" label="Loại giới hạn"
                rules={[{ required:true, message:'Chọn loại giới hạn' }]}
              >
                <Select placeholder="Chọn loại giới hạn">
                  {LIMIT_TYPE_OPTIONS.map(opt=>(
                    <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bandwidth" label="Băng thông"
                rules={[{ required:true, message:'Chọn băng thông' }]}
              >
                <Select placeholder="Chọn băng thông">
                  {BANDWIDTH_OPTIONS.map(opt=>(
                    <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="validity" label="Hiệu lực"
                rules={[{ required:true, message:'Nhập số ngày/giờ hiệu lực' }]}
              >
                <InputNumber style={{ width:'100%' }} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unit" label="Đơn vị"
                rules={[{ required:true, message:'Chọn đơn vị' }]}
              >
                <Select placeholder="Chọn đơn vị">
                  {UNIT_OPTIONS.map(opt=>(
                    <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price" label="Giá"
                rules={[{ required:true, message:'Nhập giá' }]}
              >
                <Select
                  placeholder="Chọn giá hoặc nhập"
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <div style={{ display:'flex', padding:8 }}>
                        <InputNumber
                          style={{ flex:1 }}
                          min={1000}
                          placeholder="Nhập giá khác"
                          onPressEnter={e=>{
                            const v = e.target.value;
                            if(v && !PRICE_OPTIONS.includes(Number(v))) {
                              PRICE_OPTIONS.push(Number(v));
                            }
                          }}
                        />
                      </div>
                    </>
                  )}
                  allowClear
                >
                  {PRICE_OPTIONS.map(opt=>(
                    <Select.Option key={opt} value={opt}>{opt.toLocaleString()} VNĐ</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sharedUsers" label="Shared Users"
                rules={[{ required:true, message:'Chọn số user dùng chung' }]}
              >
                <Select placeholder="Chọn số user">
                  {[...Array(10)].map((_,i)=>
                    <Select.Option key={i+1} value={i+1}>{i+1}</Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="vessel" label="Tàu"
                rules={[{ required:true, message:'Chọn tàu' }]}
              >
                <Select placeholder="Chọn tàu">
                  {ships.map(ship=>(
                    <Select.Option key={ship._id} value={ship._id}>{ship.shipName}</Select.Option>
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
