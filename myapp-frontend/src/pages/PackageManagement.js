// src/pages/PackageManagement.js
import { useState, useEffect } from 'react';
import {
  Table, Button, Input, InputNumber, Modal, Form, Space,
  Dropdown, Checkbox, Row, Col, message
} from 'antd';
import {
  DownOutlined, ReloadOutlined, SettingOutlined
} from '@ant-design/icons';
import axios from 'axios';
import '../styles/theme.css';


export default function PackageManagement() {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [visible, setVisible]   = useState(false);
  const [editing, setEditing]   = useState(null);
  const [showCols, setShowCols] = useState([
    '_id','name','type','category','price','duration',
    'volume','speed','shipName','note','action'
  ]);
  const [form] = Form.useForm();

  const columns = [
    { title:'ID', dataIndex:'_id', key:'_id' },
    { title:'Tên gói', dataIndex:'name', key:'name' },
    { title:'Loại gói', dataIndex:'type', key:'type' },
    { title:'Phân loại', dataIndex:'category', key:'category' },
    { title:'Giá (VNĐ)', dataIndex:'price', key:'price' },
    { title:'Thời gian (ngày)', dataIndex:'duration', key:'duration' },
    { title:'Dung lượng', dataIndex:'volume', key:'volume' },
    { title:'Tốc độ', dataIndex:'speed', key:'speed' },
    { title:'Tên tàu', dataIndex:'shipName', key:'shipName' },
    { title:'Ghi chú', dataIndex:'note', key:'note' },
    {
      title:'Hành động', key:'action', render:(_,rec)=>(
        <Space size="middle">
          <Button type="text" onClick={()=>onEdit(rec)}>Edit</Button>
          <Button type="text" danger onClick={()=>onDelete(rec._id)}>Del</Button>
        </Space>
      )
    }
  ];

  const fetchData = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/packages',{params:filters});
      setData(res.data.map(i=>({ ...i, key: i._id })));
    } catch {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchData(); },[]);

  const onSearchId   = v => fetchData({ id: v });
  const onSearchName = v => fetchData({ name: v });
  const onRefresh    = () => fetchData();
  const onCreate     = () => { setEditing(null); form.resetFields(); setVisible(true); };
  const onEdit       = rec => { setEditing(rec); form.setFieldsValue(rec); setVisible(true); };
  const onDelete     = async id => {
    try { await axios.delete(`/api/packages/${id}`); message.success('Xóa thành công'); fetchData(); }
    catch { message.error('Xóa thất bại'); }
  };

  const onFinish = async vals => {
    try {
      if (editing) await axios.put(`/api/packages/${editing._id}`, vals);
      else          await axios.post('/api/packages',        vals);
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
                <Input.Search placeholder="Tìm theo ID" onSearch={onSearchId} style={{width:160}} />
                <Input.Search placeholder="Tìm theo tên" onSearch={onSearchName} style={{width:200}} />
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
            name:'', type:'', category:'', price:null,
            duration:null, volume:'', speed:'', shipName:'', note:''
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name" label="Tên gói"
                rules={[
                  { required:true, message:'Nhập tên gói' },
                  { min: 3, message:'Tối thiểu 3 ký tự' },  //citeturn0search3
                  { max: 50, message:'Tối đa 50 ký tự' }
                ]}
              >
                <Input placeholder="VD: Gói 50G" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type" label="Loại gói"
                rules={[
                  { required:true, message:'Nhập loại gói' },
                  { pattern:/^[A-Za-z ]+$/, message:'Chỉ chữ và khoảng trắng' }  //citeturn0search7
                ]}
              >
                <Input placeholder="VD: Trả trước" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category" label="Phân loại"
                rules={[
                  { required:true, message:'Nhập phân loại' },
                  { pattern:/^[A-Za-z ]+$/, message:'Chỉ chữ và khoảng trắng' }
                ]}
              >
                <Input placeholder="VD: Cá nhân" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price" label="Giá (VNĐ)"
                rules={[
                  { required:true, message:'Nhập giá' },
                  { type:'number', min:1000, message:'Giá ≥ 1.000 VNĐ' }      //citeturn0search0
                ]}
              >
                <InputNumber style={{ width:'100%' }} min={1000} step={1000} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration" label="Thời gian (ngày)"
                rules={[
                  { required:true, message:'Nhập số ngày' },
                  { type:'number', min:1, message:'Phải ≥ 1 ngày' }
                ]}
              >
                <InputNumber style={{ width:'100%' }} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="volume" label="Dung lượng"
                rules={[
                  { required:true, message:'Nhập dung lượng' },
                  { pattern:/^\d+G$/, message:'Ví dụ: 50G, 100G' }            //citeturn0search4
                ]}
              >
                <Input placeholder="Ví dụ: 50G" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="speed" label="Tốc độ"
                rules={[
                  { required:true, message:'Nhập tốc độ' },
                  { pattern:/^\d+\/\d+ Mbps$/, message:'Ví dụ: 10/10 Mbps' }  //citeturn0search4
                ]}
              >
                <Input placeholder="VD: 10/10 Mbps" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="shipName" label="Tên tàu"
                rules={[
                  { required:true, message:'Chọn tên tàu' }
                ]}
              >
                <Input placeholder="Tên tàu liên kết" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="note" label="Ghi chú"
                rules={[
                  { max:200, message:'Tối đa 200 ký tự' }                  //citeturn0search9
                ]}
              >
                <Input.TextArea rows={2} placeholder="Ghi chú thêm (tối đa 200 ký tự)" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
