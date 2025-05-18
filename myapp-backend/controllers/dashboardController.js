// controllers/dashboardController.js
const Company = require('../models/Company');
const RetailTransaction = require('../models/RetailTransaction');
const moment = require('moment');
const axios = require('axios');

// Hàm ánh xạ giá trị gói thuê bao sang giá trị số
const getPackagePrice = (packageName) => {
  const packagePrices = {
    '50G': 299,
    '250G': 399,
    '500G': 789,
    '1T': 1199,
    '2.5T': 3750
  };
  return packagePrices[packageName] || 0; // Trả về 0 nếu không khớp
};

// Hàm ánh xạ giá trị gói dịch vụ sang giá trị số
const getServicePrice = (serviceName) => {
  const servicePrices = {
    'Gói 1': 50,
    'Gói 2': 50,
    'Gói 3': 50
  };
  return servicePrices[serviceName] || 0; // Trả về 0 nếu không khớp
};

const getDashboardSummary = async (req, res) => {
  try {
    // Lấy danh sách công ty
    const companies = await Company.find();
    const totalCompanies = companies.length;

    // Khởi tạo dữ liệu
    const subscriptionPackages = {
      '50G': 0, '250G': 0, '500G': 0, '1T': 0, '2.5T': 0
    };
    const servicePackages = { 'Gói 1': 0, 'Gói 2': 0, 'Gói 3': 0 };

    let totalSubscriptionRevenue = 0;
    let totalServiceRevenue = 0;
    let activeSubscriptions = 0;
    let activeServicePackages = 0;

    // Tính toán doanh thu từ gói thuê bao và dịch vụ
    for (const company of companies) {
      for (const sub of company.subscriptions) {
        // Gói thuê bao
        if (sub.networkStatus === 'active') {
          activeSubscriptions++;
          const packagePrice = getPackagePrice(sub.networkPackage);
          totalSubscriptionRevenue += packagePrice;

          if (subscriptionPackages[sub.networkPackage]) {
            subscriptionPackages[sub.networkPackage]++;
          }
        }

        // Gói dịch vụ
        if (sub.serviceStatus === 'active') {
          activeServicePackages++;
          const servicePrice = getServicePrice(sub.servicePackage);
          totalServiceRevenue += servicePrice;

          if (servicePackages[sub.servicePackage]) {
            servicePackages[sub.servicePackage]++;
          }
        }
      }
    }

    // Tính toán doanh thu khách hàng lẻ từ bảng RetailTransaction
    const retailTransactions = await RetailTransaction.find({ status: 'completed' });
    const retailRevenue = retailTransactions.reduce((total, transaction) => total + transaction.amount, 0);

    // Tạo dữ liệu biểu đồ dựa trên các giao dịch thực tế
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const startOfMonth = moment().subtract(i, 'months').startOf('month').toDate();
      const endOfMonth = moment().subtract(i, 'months').endOf('month').toDate();

      const monthlySubscriptions = companies.reduce((total, company) => {
        return total + company.subscriptions.filter(sub => {
          return sub.networkStatus === 'active' &&
                 sub.createdAt >= startOfMonth &&
                 sub.createdAt <= endOfMonth;
        }).reduce((sum, sub) => sum + getPackagePrice(sub.networkPackage), 0);
      }, 0);

      const monthlyServices = companies.reduce((total, company) => {
        return total + company.subscriptions.filter(sub => {
          return sub.serviceStatus === 'active' &&
                 sub.createdAt >= startOfMonth &&
                 sub.createdAt <= endOfMonth;
        }).reduce((sum, sub) => sum + getServicePrice(sub.servicePackage), 0);
      }, 0);

      const monthlyRetail = retailTransactions.filter(transaction => {
        return transaction.createdAt >= startOfMonth && transaction.createdAt <= endOfMonth;
      }).reduce((sum, transaction) => sum + transaction.amount, 0);

      chartData.push({
        month: moment(startOfMonth).format('YYYY-MM'),
        subscriptionRevenue: monthlySubscriptions,
        serviceRevenue: monthlyServices,
        retailRevenue: monthlyRetail,
      });
    }

    // Trả về dữ liệu
    res.json({
      totalCompanies,
      subscriptionPackages,
      totalSubscriptionRevenue,
      activeSubscriptions,
      servicePackages,
      totalServiceRevenue,
      activeServicePackages,
      retailRevenue,
      chartData
    });
    console.log({
      totalSubscriptionRevenue,
      totalServiceRevenue,
      retailRevenue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
};

// useEffect(() => {
//   const fetchDashboard = async () => {
//     try {
//       const response = await axios.get('/api/dashboard/summary');
//       console.log(response.data); // Log dữ liệu trả về từ API
//       setStats(response.data);
//     } catch (err) {
//       setError('Không thể tải dữ liệu Dashboard');
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchDashboard();
// }, []);

module.exports = { getDashboardSummary };