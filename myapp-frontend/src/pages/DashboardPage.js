import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Alert, Statistic } from 'antd';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Đăng ký các thành phần cần thiết
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get('/api/dashboard/summary');
        setStats(response.data);
      } catch (err) {
        setError('Không thể tải dữ liệu Dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Spin tip="Đang tải dữ liệu Dashboard..." style={{ marginTop: 100 }} />;
  if (error) return <Alert message="Lỗi" description={error} type="error" showIcon style={{ marginTop: 100 }} />;

  const chartData = {
    labels: stats.chartData.map(item => item.month),
    datasets: [
      {
        label: 'Doanh thu thuê bao (USD)',
        data: stats.chartData.map(item => item.subscriptionRevenue),
        backgroundColor: '#4ade80',
      },
      {
        label: 'Doanh thu dịch vụ (USD)',
        data: stats.chartData.map(item => item.serviceRevenue),
        backgroundColor: '#60a5fa',
      },
      {
        label: 'Doanh thu khách lẻ (USD)',
        data: stats.chartData.map(item => item.retailRevenue),
        backgroundColor: '#facc15',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Biểu đồ doanh thu tổng theo tháng' },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true },
    },
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Dòng 1: Gói thuê bao */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Tổng số công ty" value={stats.totalCompanies} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Tổng số gói thuê bao" value={stats.activeSubscriptions} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Doanh thu thuê bao (USD)" value={stats.totalSubscriptionRevenue} />
          </Card>
        </Col>
      </Row>

      {/* Dòng 2: Gói dịch vụ */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Tổng số gói dịch vụ" value={stats.activeServicePackages} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Doanh thu dịch vụ (USD)" value={stats.totalServiceRevenue} />
          </Card>
        </Col>
      </Row>

      {/* Dòng 3: Khách hàng lẻ */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Doanh thu khách hàng lẻ (USD)" value={stats.retailRevenue} />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ doanh thu */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Biểu đồ doanh thu tổng theo tháng">
            <Bar data={chartData} options={chartOptions} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
