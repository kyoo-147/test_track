import React, { useState, useEffect } from 'react';
import {
  Table, Button, Input, Modal, Form, Space, Dropdown, Checkbox,
  Select, Row, Col, DatePicker, message, Tooltip
} from 'antd';
import {
  DownOutlined, ReloadOutlined, SettingOutlined,
  PrinterOutlined, EyeOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import '../styles/theme.css';

export default function UserManagement() {
  const [data, setData]       = useState([]);
  const [ships, setShips]     = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showCols, setShowCols] = useState([
    '_id','username','role','password','ship','serviceType','pkg','volumeLimit',
    'usedVolume','activation','createdAt','updatedAt','createdBy','status','action'
  ]);
  const [form] = Form.useForm();

  const roles = [
    'Capt','CO','2O','3O','CE','2E','3E',
    ...Array.from({ length: 15 }, (_, i) => `TV${i+1}`)
  ];

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [u, s, p] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/ships'),
        axios.get('/api/packages')
      ]);
      setData(u.data.map(x=>({ ...x, key: x._id })));
      setShips(s.data);
      setPackages(p.data);
    } catch {
      message.error('Load data failed');
    } finally {
      setLoading(false);
    }
  };

  const onCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      password: Math.floor(100000+Math.random()*900000).toString()
    });
    setVisible(true);
  };

  const onEdit = rec => {
    setEditing(rec);
    form.setFieldsValue({
      ...rec,
      ship: rec.ship._id,
      pkg: rec.pkg._id,
      createdAt: rec.createdAt ? dayjs(rec.createdAt) : null,
      updatedAt: rec.updatedAt ? dayjs(rec.updatedAt) : null
    });
    setVisible(true);
  };

  const onDelete = async id => {
    await axios.delete(`/api/users/${id}`);
    loadAll();
  };

  // trong UserManagement.js
const onFinish = async vals => {
  try {
    if (vals.createdAt) vals.createdAt = vals.createdAt.toISOString();
    vals.updatedAt = vals.updatedAt ? vals.updatedAt.toISOString() : null;
    Object.keys(vals).forEach(k => vals[k] === undefined && delete vals[k]);
    const url = editing ? `/api/users/${editing._id}` : '/api/users';
    const method = editing ? 'put' : 'post';
    await axios[method](url, vals);
    message.success('Lưu thành công');
    setVisible(false);
    loadAll();
  } catch (err) {
    console.error('Server replied:', err.response?.data);
    message.error('Lỗi: ' + err.response?.data?.message);
  }
};

  const columns = [
    { title:'ID', dataIndex:'_id', key:'_id' },
    { title:'Username', dataIndex:'username', key:'username' },
    { title:'Role', dataIndex:'role', key:'role' },
    {
      title:'Password', dataIndex:'password', key:'password',
      render: p => <Tooltip title={p}><EyeOutlined/></Tooltip>
    },
    { title:'Ship', dataIndex:['ship','shipName'], key:'ship' },
    { title:'Service', dataIndex:'serviceType', key:'serviceType' },
    { title:'Package', dataIndex:['pkg','name'], key:'pkg' },
    { title:'Vol Limit', dataIndex:'volumeLimit', key:'volumeLimit' },
    { title:'Used Vol', dataIndex:'usedVolume', key:'usedVolume' },
    { title:'Activation', dataIndex:'activation', key:'activation' },
    {
      title:'Created At', dataIndex:'createdAt', key:'createdAt',
      render:d=>d?dayjs(d).format('DD/MM/YYYY'):''
    },
    {
      title:'Updated At', dataIndex:'updatedAt', key:'updatedAt',
      render:d=>d?dayjs(d).format('DD/MM/YYYY'):''
    },
    { title:'Created By', dataIndex:'createdBy', key:'createdBy' },
    { title:'Status', dataIndex:'status', key:'status' },
    {
      title:'Action', key:'action',
      render:(_,r)=>(
        <Space>
          <Button type="link" onClick={()=>onEdit(r)}>Edit</Button>
          <Button type="link" danger onClick={()=>onDelete(r._id)}>Del</Button>
        </Space>
      )
    }
  ];

  const menu = (
    <div style={{ padding:8 }}>
      {columns.map(c=>(
        <Checkbox key={c.key}
          checked={showCols.includes(c.key)}
          onChange={e=>setShowCols(prev=>
            e.target.checked?[...prev,c.key]:prev.filter(k=>k!==c.key)
          )}
        >{c.title}</Checkbox>
      ))}
    </div>
  );
  const visibleCols = columns.filter(c=>showCols.includes(c.key));

  const syncFields = () => {
    const pkgId = form.getFieldValue('pkg');
    const role  = form.getFieldValue('role');
    const pkg   = packages.find(p=>p._id===pkgId);
    if(pkg && role) {
      form.setFieldsValue({
        username: `${pkg.name}-${role}`,
        volumeLimit: pkg.volume
      });
    }
  };

  return <>
    <Space wrap style={{ marginBottom:16, justifyContent:'space-between',width:'100%' }}>
      <Space>
        <Button type="primary" onClick={onCreate}>New</Button>
        <Button icon={<ReloadOutlined/>} onClick={loadAll}>Reload</Button>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button icon={<SettingOutlined/>}>Cols <DownOutlined/></Button>
        </Dropdown>
      </Space>
      <Button icon={<PrinterOutlined/>} onClick={()=>window.print()}>Print</Button>
    </Space>
    <Table
      loading={loading}
      columns={visibleCols}
      dataSource={data}
      rowKey="_id"
      pagination={{ pageSize:10 }}
    />
    <Modal
      width={720}
      title={editing?'Edit User':'New User'}
      visible={visible}
      destroyOnClose forceRender
      onCancel={()=>{ setVisible(false); form.resetFields(); }}
      onOk={()=>form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}
        initialValues={{ activation:'active', status:'active' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="role" label="Role" rules={[{required:true}]}>
              <Select placeholder="Role" onChange={syncFields}>
                {roles.map(r=><Select.Option key={r} value={r}>{r}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="pkg" label="Package" rules={[{required:true}]}>
              <Select placeholder="Package" onChange={syncFields}>
                {packages.map(p=><Select.Option key={p._id} value={p._id}>{p.name}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="username" label="Username" rules={[{required:true}]}>
              <Input disabled/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="password" label="Password" rules={[{required:true}]}>
              <Input.Password disabled visibilityToggle={false}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="ship" label="Ship" rules={[{required:true}]}>
              <Select placeholder="Ship">
                {ships.map(s=>(
                  <Select.Option key={s._id} value={s._id}>{s.shipName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="serviceType" label="Service Type" rules={[{required:true}]}>
              <Select placeholder="Service Type">
                {[...new Set(packages.map(p=>p.limitType))].map(t=><Select.Option key={t} value={t}>{t}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="volumeLimit" label="Vol Limit" rules={[{required:true}]}>
              <Input placeholder="e.g. 10G"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="usedVolume" label="Used Vol" rules={[{required:true}]}>
              <Input placeholder="e.g. 10G"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="activation" label="Activation" rules={[{required:true}]}>
              <Select>
                <Select.Option value="active">active</Select.Option>
                <Select.Option value="inactive">inactive</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="createdAt" label="Created At" rules={[{required:true}]}>
              <DatePicker style={{width:'100%'}}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="updatedAt" label="Updated At">
              <DatePicker style={{width:'100%'}} allowClear format="DD-MM-YYYY"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="createdBy" label="Created By" rules={[{required:true}]}>
              <Input placeholder="Creator"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Status" rules={[{required:true}]}>
              <Select>
                <Select.Option value="active">active</Select.Option>
                <Select.Option value="suspended">suspended</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  </>;
}
