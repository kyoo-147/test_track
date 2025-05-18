// src/pages/UserManagement.js
import { useState, useEffect } from 'react';
import {
  Table, Button, Input, Modal, Form, Space, Dropdown, Checkbox,
  Select, Row, Col, DatePicker, message
} from 'antd';
import { DownOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import '../styles/theme.css';

export default function UserManagement() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showCols, setShowCols] = useState([
    '_id','username','role','password','serviceType','pkg',
    'activation','createdAt','status','deviceSerial','action'
  ]);
  const [form] = Form.useForm();

  const columns = [
    { title:'ID', dataIndex:'_id', key:'_id' },
    { title:'Tên đăng nhập', dataIndex:'username', key:'username' },
    { title:'Chức danh', dataIndex:'role', key:'role' },
    { title:'Mật khẩu', dataIndex:'password', key:'password' },
    { title:'Loại dịch vụ', dataIndex:'serviceType', key:'serviceType' },
    { title:'Gói', dataIndex:'pkg', key:'pkg' },
    { title:'Kích hoạt', dataIndex:'activation', key:'activation' },
    { title:'Ngày tạo', dataIndex:'createdAt', key:'createdAt', render: d=> dayjs(d).format('DD/MM/YYYY') },
    { title:'Trạng thái', dataIndex:'status', key:'status' },
    { title:'Serial thiết bị', dataIndex:'deviceSerial', key:'deviceSerial' },
    {
      title:'Hành động', key:'action', render:(_, rec)=>(
        <Space>
          <Button type="link" onClick={()=>onEdit(rec)}>Sửa</Button>
          <Button type="link" danger onClick={()=>onDelete(rec._id)}>Xóa</Button>
        </Space>
      )
    }
  ];

  const fetchData = async(filters={}) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/users',{ params: filters });
      setData(res.data.map(u=>({ ...u, key:u._id })));
    } catch {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{ fetchData(); },[]);

  const onSearchCompany = v => fetchData({ company: v });
  const onSearchShip    = v => fetchData({ ship: v });
  const onSearchRole    = v => fetchData({ role: v });
  const onSearchStatus  = v => fetchData({ status: v });
  const onRefresh       = () => fetchData();
  const onCreate        = () => {
    setEditing(null);
    form.resetFields();
    setVisible(true);
  };
  const onEdit = rec => {
    setEditing(rec);
    form.setFieldsValue({
      ...rec,
      createdAt: rec.createdAt ? dayjs(rec.createdAt) : null
    });
    setVisible(true);
  };
  const onDelete = async id => {
    try {
      await axios.delete(`/api/users/${id}`);
      message.success('Xóa thành công');
      fetchData();
    } catch {
      message.error('Xóa thất bại');
    }
  };
  const onFinish = async vals => {
    try {
      vals.createdAt = vals.createdAt.toISOString();
      if(editing) await axios.put(`/api/users/${editing._id}`, vals);
      else await axios.post('/api/users', vals);
      message.success('Thao tác thành công');
      setVisible(false);
      form.resetFields();
      fetchData();
    } catch {
      message.error('Thao tác thất bại');
    }
  };

  const menu = (
    <div style={{ padding:8 }}>
      {columns.map(c=>c.key!=='action' && (
        <Checkbox
          key={c.key}
          checked={showCols.includes(c.key)}
          onChange={e=>{
            setShowCols(prev=> e.target.checked? [...prev,c.key]: prev.filter(k=>k!==c.key));
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
        <Input.Search placeholder="Tìm theo cty" onSearch={onSearchCompany} />
        <Input.Search placeholder="Tìm theo tàu" onSearch={onSearchShip} />
        <Input.Search placeholder="Tìm theo chức danh" onSearch={onSearchRole} />
        <Input.Search placeholder="Tìm theo trạng thái" onSearch={onSearchStatus} />
        <Button type="primary" onClick={onCreate}>Tạo mới</Button>
        <Button icon={<ReloadOutlined/>} onClick={onRefresh}>Refresh</Button>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button icon={<SettingOutlined/>}>Cài đặt <DownOutlined/></Button>
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
        width={720}
        title={editing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
        open={visible}
        onCancel={()=>{ setVisible(false); form.resetFields(); }}
        onOk={()=>form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{
          username:'', role:'', password:'', serviceType:'', pkg:'', activation:'', createdAt: null, status:'', deviceSerial:''
        }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="username" label="Tên đăng nhập"
                rules={[{ required:true,message:'Nhập tên đăng nhập' }]}
              >
                <Input placeholder="VD: lucky"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role" label="Chức danh"
                rules={[{ required:true,message:'Chọn chức danh' }]}
              >
                <Select placeholder="Chọn chức danh">
                  <Select.Option value="thuongtruong">Thường trưởng</Select.Option>
                  <Select.Option value="nhanvien">Nhân viên</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="password" label="Password"
                rules={[{ required:true,message:'Nhập mật khẩu' },{ min:8,message:'Tối thiểu 8 ký tự' }]}
              >
                <Input.Password/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="serviceType" label="Loại dịch vụ"
                rules={[{ required:true,message:'Chọn loại dịch vụ' }]}
              >
                <Select placeholder="Chọn">
                  <Select.Option value="10M">10M</Select.Option>
                  <Select.Option value="15G">15G</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="pkg" label="Gói"
                rules={[{ required:true,message:'Nhập gói' }]}
              >
                <Input placeholder="VD: 15G"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="activation" label="Kích hoạt/gỡ gói"
                rules={[{ required:true,message:'Chọn trạng thái' }]}
              >
                <Select placeholder="Chọn">
                  <Select.Option value="active">active</Select.Option>
                  <Select.Option value="inactive">inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="createdAt" label="Ngày tạo"
                rules={[{ required:true,message:'Chọn ngày tạo' }]}
              >
                <DatePicker style={{ width:'100%' }}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái người dùng"
                rules={[{ required:true,message:'Chọn trạng thái' }]}
              >
                <Select placeholder="Chọn">
                  <Select.Option value="active">active</Select.Option>
                  <Select.Option value="suspended">suspended</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deviceSerial" label="Serial thiết bị"
                rules={[{ max:50,message:'Tối đa 50 ký tự' }]}
              >
                <Input placeholder="VD: SN12345"/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
