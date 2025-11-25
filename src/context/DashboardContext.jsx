// src/context/DashboardContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard debe ser usado dentro de un DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    visits: [],
    sales: [],
    subscribers: [],
    products: []
  });
  const [subscribersList, setSubscribersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos del dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // En un caso real, estos serían llamados a tu API
      const mockSubscribers = [
        { id: 1, name: 'María González', email: 'maria@email.com', fecha: '2024-01-15', status: 'activo' },
        { id: 2, name: 'Carlos López', email: 'carlos@email.com', fecha: '2024-01-14', status: 'activo' },
        { id: 3, name: 'Ana Martínez', email: 'ana@email.com', fecha: '2024-01-13', status: 'activo' },
        { id: 4, name: 'Juan Pérez', email: 'juan@email.com', fecha: '2024-01-12', status: 'inactivo' },
        { id: 5, name: 'Laura Díaz', email: 'laura@email.com', fecha: '2024-01-11', status: 'activo' },
        { id: 6, name: 'Roberto Silva', email: 'roberto@email.com', fecha: '2024-01-10', status: 'activo' },
        { id: 7, name: 'Sofía Herrera', email: 'sofia@email.com', fecha: '2024-01-09', status: 'activo' },
        { id: 8, name: 'Diego Ramos', email: 'diego@email.com', fecha: '2024-01-08', status: 'inactivo' },
        { id: 9, name: 'Elena Castro', email: 'elena@email.com', fecha: '2024-01-07', status: 'activo' },
        { id: 10, name: 'Miguel Torres', email: 'miguel@email.com', fecha: '2024-01-06', status: 'activo' }
      ];

      const mockData = {
        visits: [
          { day: 'Lun', visitas: 1200 },
          { day: 'Mar', visitas: 1900 },
          { day: 'Mié', visitas: 1500 },
          { day: 'Jue', visitas: 2200 },
          { day: 'Vie', visitas: 2800 },
          { day: 'Sáb', visitas: 2000 },
          { day: 'Dom', visitas: 1800 }
        ],
        sales: [
          { mes: 'Ene', ventas: 45000, ordenes: 45 },
          { mes: 'Feb', ventas: 52000, ordenes: 52 },
          { mes: 'Mar', ventas: 48000, ordenes: 48 },
          { mes: 'Abr', ventas: 61000, ordenes: 61 },
          { mes: 'May', ventas: 72000, ordenes: 72 },
          { mes: 'Jun', ventas: 68000, ordenes: 68 }
        ],
        subscribers: [
          { name: 'Nuevos', value: 65 },
          { name: 'Recurrentes', value: 35 }
        ],
        products: [
          { categoria: 'Remeras', ventas: 150 },
          { categoria: 'Buzos', ventas: 89 },
          { categoria: 'Jeans', ventas: 76 },
          { categoria: 'Vestidos', ventas: 54 },
          { categoria: 'Accesorios', ventas: 32 }
        ]
      };

      setDashboardData(mockData);
      setSubscribersList(mockSubscribers);
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agregar nuevo suscriptor
  const addSubscriber = (subscriber) => {
    const newSubscriber = {
      id: subscribersList.length + 1,
      ...subscriber,
      fecha: new Date().toISOString().split('T')[0],
      status: 'activo'
    };
    setSubscribersList(prev => [newSubscriber, ...prev]);
  };

  // Eliminar suscriptor
  const deleteSubscriber = (id) => {
    setSubscribersList(prev => prev.filter(sub => sub.id !== id));
  };

  // Actualizar suscriptor
  const updateSubscriber = (id, updatedData) => {
    setSubscribersList(prev => 
      prev.map(sub => sub.id === id ? { ...sub, ...updatedData } : sub)
    );
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const value = {
    dashboardData,
    subscribersList,
    loading,
    loadDashboardData,
    addSubscriber,
    deleteSubscriber,
    updateSubscriber
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;