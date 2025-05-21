import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Layout, Menu, Input, Avatar, Badge, Space, Button, notification } from 'antd'; // Thêm notification
import {
  AppstoreOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons';

import DashboardPage      from './pages/DashboardPage';
import CompanyManagement  from './pages/CompanyManagement';
import ShipManagement     from './pages/ShipManagement';
import UserManagement     from './pages/UserManagement';
import SpeedManagement    from './pages/SpeedManagement';
import PackageManagement  from './pages/PackageManagement';
import Login              from './pages/Login';

import 'antd/dist/reset.css';
import './styles/theme.css';

const { Header, Sider, Content } = Layout;

// Hàm tiện ích để hiển thị thông báo đẩy toàn cục
export function showNotify({ type = 'success', message = '', description = '' }) {
  notification[type]({
    message,
    description,
    placement: 'topRight',
    duration: 5
  });
}

// Sidebar menu theo quyền
function SidebarMenu({ role }) {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'dashboard';

  let items = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> }
  ];
  if (role === 'Admin') {
    items = [
      ...items,
      { key: 'companies', icon: <AppstoreOutlined />, label: <Link to="/companies">Quản lý Công ty</Link> },
      { key: 'ships',     icon: <DashboardOutlined />, label: <Link to="/ships">Quản lý Tàu</Link> },
      { key: 'users',     icon: <UserOutlined />, label: <Link to="/users">Quản lý Người dùng</Link> },
      { key: 'packages',  icon: <AppstoreOutlined />, label: <Link to="/packages">Quản lý Gói</Link> },
      { key: 'speeds',    icon: <SettingOutlined />, label: <Link to="/speeds">Cài đặt</Link> },
    ];
  } else if (role === 'Tech') {
    items = [
      ...items,
      { key: 'ships',     icon: <DashboardOutlined />, label: <Link to="/ships">Quản lý Tàu</Link> },
      { key: 'users',     icon: <UserOutlined />, label: <Link to="/users">Quản lý Người dùng</Link> },
      { key: 'packages',  icon: <AppstoreOutlined />, label: <Link to="/packages">Quản lý Gói</Link> },
    ];
  }
  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[path]}
      items={items}
    />
  );
}

// Route bảo vệ theo quyền
function ProtectedRoute({ children, allow }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || (allow && !allow.includes(user.role))) {
    showNotify({ type: 'error', message: 'Không có quyền truy cập', description: 'Bạn không đủ quyền để truy cập trang này.' });
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  // Truyền hàm showNotify xuống các page qua props nếu muốn dùng ở page con
  if (!user) return <Login onLogin={setUser} showNotify={showNotify} />;

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sider
          width={220}
          collapsible
          breakpoint="lg"
          collapsedWidth="80"
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
          <SidebarMenu role={user.role} />
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
              <Button
                type="link"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  showNotify({ type: 'success', message: 'Đăng xuất thành công' });
                  setTimeout(() => window.location.reload(), 800);
                }}
                style={{ marginLeft: 8 }}
              >
                Đăng xuất
              </Button>
            </Space>
          </Header>

          {/* Content */}
          <Content style={{ margin: 24 }}>
            <Routes>
              <Route path="/dashboard" element={<DashboardPage showNotify={showNotify} />} />
              {/* Admin */}
              <Route path="/companies" element={
                <ProtectedRoute allow={['Admin']}>
                  <CompanyManagement showNotify={showNotify} />
                </ProtectedRoute>
              } />
              <Route path="/speeds" element={
                <ProtectedRoute allow={['Admin']}>
                  <SpeedManagement showNotify={showNotify} />
                </ProtectedRoute>
              } />
              {/* Admin + Tech */}
              <Route path="/ships" element={
                <ProtectedRoute allow={['Admin', 'Tech']}>
                  <ShipManagement showNotify={showNotify} />
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute allow={['Admin', 'Tech']}>
                  <UserManagement showNotify={showNotify} />
                </ProtectedRoute>
              } />
              <Route path="/packages" element={
                <ProtectedRoute allow={['Admin', 'Tech']}>
                  <PackageManagement showNotify={showNotify} />
                </ProtectedRoute>
              } />
              {/* Sales chỉ xem dashboard */}
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
