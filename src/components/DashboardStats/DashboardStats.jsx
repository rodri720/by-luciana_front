// src/components/DashboardStats/DashboardStats.jsx
import { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import './DashboardStats.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function DashboardStats() {
  const { dashboardData, subscribersList, loading } = useDashboard();
  const [timeRange, setTimeRange] = useState('semana');
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' o 'subscribers'
  const [selectedSubscribersType, setSelectedSubscribersType] = useState('all'); // 'all', 'nuevos', 'recurrentes'

  // Métricas principales calculadas desde los datos reales
  const metrics = {
    totalVisitas: dashboardData.visits.reduce((sum, day) => sum + day.visitas, 0),
    totalVentas: dashboardData.sales.reduce((sum, month) => sum + month.ventas, 0),
    totalOrdenes: dashboardData.sales.reduce((sum, month) => sum + month.ordenes, 0),
    totalSubscriptores: subscribersList.length,
    subscriptoresActivos: subscribersList.filter(sub => sub.status === 'activo').length,
    tasaConversion: '3.2%',
    clientesNuevos: 45,
    ticketPromedio: '$1,250'
  };

  // Filtrar suscriptores según el tipo seleccionado
  const filteredSubscribers = subscribersList.filter(sub => {
    if (selectedSubscribersType === 'all') return true;
    if (selectedSubscribersType === 'activos') return sub.status === 'activo';
    if (selectedSubscribersType === 'inactivos') return sub.status === 'inactivo';
    return true;
  });

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  // Vista de Lista de Suscriptores
  if (activeView === 'subscribers') {
    return (
      <div className="subscribers-view">
        <div className="view-header">
          <button 
            className="back-button"
            onClick={() => setActiveView('dashboard')}
          >
            ← Volver al Dashboard
          </button>
          <h2>📧 Lista de Suscriptores</h2>
          <div className="subscribers-filters">
            <select 
              value={selectedSubscribersType}
              onChange={(e) => setSelectedSubscribersType(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos los suscriptores</option>
              <option value="activos">Solo activos</option>
              <option value="inactivos">Solo inactivos</option>
            </select>
            <span className="subscribers-count">
              {filteredSubscribers.length} suscriptores
            </span>
          </div>
        </div>

        <div className="subscribers-list">
          {filteredSubscribers.map(subscriber => (
            <div key={subscriber.id} className="subscriber-card">
              <div className="subscriber-avatar">
                {subscriber.name.charAt(0)}
              </div>
              <div className="subscriber-info">
                <h4>{subscriber.name}</h4>
                <p>{subscriber.email}</p>
                <div className="subscriber-meta">
                  <span className={`status-badge ${subscriber.status}`}>
                    {subscriber.status}
                  </span>
                  <span className="subscriber-date">
                    Registrado: {new Date(subscriber.fecha).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="subscriber-actions">
                <button className="action-btn email" title="Enviar email">
                  ✉️
                </button>
                <button className="action-btn delete" title="Eliminar">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSubscribers.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No hay suscriptores</h3>
            <p>No se encontraron suscriptores con los filtros aplicados.</p>
          </div>
        )}
      </div>
    );
  }

  // Vista Principal del Dashboard
  return (
    <div className="dashboard-stats">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <h2>📊 Dashboard de Analytics</h2>
        <div className="header-actions">
          <div className="time-range-selector">
            <button 
              className={timeRange === 'semana' ? 'active' : ''}
              onClick={() => setTimeRange('semana')}
            >
              Semana
            </button>
            <button 
              className={timeRange === 'mes' ? 'active' : ''}
              onClick={() => setTimeRange('mes')}
            >
              Mes
            </button>
            <button 
              className={timeRange === 'año' ? 'active' : ''}
              onClick={() => setTimeRange('año')}
            >
              Año
            </button>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h3>Total Visitas</h3>
            <span className="metric-value">{metrics.totalVisitas.toLocaleString()}</span>
            <span className="metric-trend positive">+12% vs semana anterior</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <h3>Ventas Totales</h3>
            <span className="metric-value">${metrics.totalVentas.toLocaleString()}</span>
            <span className="metric-trend positive">+8% vs mes anterior</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📧</div>
          <div className="metric-info">
            <h3>Suscriptores</h3>
            <span className="metric-value">{metrics.totalSubscriptores}</span>
            <span className="metric-trend positive">
              {metrics.subscriptoresActivos} activos
            </span>
          </div>
        </div>

        <div className="metric-card clickable" onClick={() => setActiveView('subscribers')}>
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h3>Ver Suscriptores</h3>
            <span className="metric-value">Lista completa</span>
            <span className="metric-trend link">Haz clic para ver detalles →</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        {/* Gráfico de Visitas */}
        <div className="chart-card">
          <h3>📈 Visitas Diarias</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData.visits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="visitas" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Ventas */}
        <div className="chart-card">
          <h3>💰 Ventas Mensuales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#82ca9d" name="Ventas ($)" />
              <Bar dataKey="ordenes" fill="#8884d8" name="Órdenes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Suscriptores - AHORA ES CLICKABLE */}
        <div className="chart-card clickable" onClick={() => setActiveView('subscribers')}>
          <h3>👥 Distribución de Suscriptores</h3>
          <div className="chart-click-hint">
            <span>Haz clic para ver la lista completa</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.subscribers}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dashboardData.subscribers.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Productos Más Vendidos */}
        <div className="chart-card">
          <h3>🏆 Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.products} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="categoria" width={80} />
              <Tooltip />
              <Bar dataKey="ventas" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;