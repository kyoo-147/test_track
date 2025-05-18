// src/App.js
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Input, Avatar, Badge, Space } from 'antd';
import {
  AppstoreOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons';

import DashboardPage        from './pages/DashboardPage';
import CompanyManagement from './pages/CompanyManagement';
import ShipManagement    from './pages/ShipManagement';
import UserManagement    from './pages/UserManagement';
import SpeedManagement   from './pages/SpeedManagement';
import PackageManagement from './pages/PackageManagement';

import 'antd/dist/reset.css';
import './styles/theme.css';

const { Header, Sider, Content } = Layout;

function SidebarMenu() {
  const location = useLocation();
  // Xác định key dựa vào pathname
  const path = location.pathname.split('/')[1] || 'dashboard';
  return (
    <Menu theme="dark" mode="inline" selectedKeys={[path]}>
      <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="companies" icon={<AppstoreOutlined />}>
        <Link to="/companies">Quản lý Công ty</Link>
      </Menu.Item>
      <Menu.Item key="ships" icon={<DashboardOutlined />}>
        <Link to="/ships">Quản lý Tàu</Link>
      </Menu.Item>
      <Menu.Item key="users" icon={<UserOutlined />}>
        <Link to="/users">Quản lý Người dùng</Link>
      </Menu.Item>
      <Menu.Item key="speeds" icon={<SettingOutlined />}>
        <Link to="/speeds">Cài đặt Tốc độ</Link>
      </Menu.Item>
      <Menu.Item key="packages" icon={<AppstoreOutlined />}>
        <Link to="/packages">Quản lý Gói</Link>
      </Menu.Item>
    </Menu>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sider
  width={220}
  collapsible
  breakpoint="lg" // Thu gọn Sidebar trên màn hình nhỏ
  collapsedWidth="80" // Chiều rộng khi Sidebar thu gọn
>
  <div style={{
    height: 48,
    margin: 16,
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  }}>
    MyCompany
  </div>
  <SidebarMenu />
</Sider>

        {/* Main */}
        <Layout>
          {/* Header */}
          <Header style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 16px',
  background: '#fff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
}}>
  <Input.Search
    placeholder="Search..."
    style={{ width: '100%', maxWidth: 280 }}
  />
  <Space>
    <Badge count={3}>
      <BellOutlined style={{ fontSize: 20, color: 'var(--text-secondary)' }} />
    </Badge>
    <Avatar icon={<UserOutlined />} />
  </Space>
</Header>

          {/* Content */}
          <Content style={{ margin: 24 }}>
            <Routes>
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/companies" element={<CompanyManagement />} />
              <Route path="/ships"      element={<ShipManagement />} />
              <Route path="/users"      element={<UserManagement />} />
              <Route path="/speeds"     element={<SpeedManagement />} />
              <Route path="/packages"   element={<PackageManagement />} />
              <Route
                path="*"
                element={<h2>Vui lòng chọn mục trong menu bên trái.</h2>}
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}
