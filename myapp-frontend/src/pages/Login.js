import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const onFinish = async (vals) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', vals);
      // Lưu token và user info vào localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      message.success('Đăng nhập thành công');
      onLogin && onLogin(res.data.user); // callback cho App
    } catch (err) {
      message.error(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5'
    }}>
      <Card title="Đăng nhập hệ thống" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input autoFocus />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}