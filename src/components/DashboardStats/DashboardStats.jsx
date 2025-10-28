// src/components/DashboardStats/DashboardStats.jsx
import { useProducts } from '../../context/ProductContext';

function DashboardStats() {
  const { products } = useProducts();

  const getProductsByCategory = (category) => {
    return products.filter(product => product?.category === category);
  };

  const getFeaturedProductsCount = () => {
    return products.filter(p => p?.featured).length;
  };

  const stats = [
    {
      title: 'Total Productos',
      value: products.length,
      icon: '📦',
      color: '#007bff'
    },
    {
      title: 'En Outlet',
      value: getProductsByCategory('outlet').length,
      icon: '💰',
      color: '#28a745'
    },
    {
      title: 'Destacados',
      value: getFeaturedProductsCount(),
      icon: '⭐',
      color: '#ffc107'
    },
    {
      title: 'Mayorista',
      value: getProductsByCategory('mayorista').length,
      icon: '🏢',
      color: '#6f42c1'
    }
  ];

  return (
    <div className="dashboard-stats">
      <h2>📊 Resumen General</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <span className="stat-number">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardStats;