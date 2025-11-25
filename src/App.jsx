﻿import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { DashboardProvider } from './context/DashboardContext'; // ✅ AGREGAR ESTA IMPORTACIÓN
import './App.css'
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Footer from './components/Footer';
import OutletPage from './components/OutletPage';
import PanelAdmin from "./components/PanelAdmin/PanelAdmin"
import AdminLogin from './components/AdminLogin';
import Nosotros from './components/Nosotros';
import Ubicacion from './components/Ubicacion'; 
import Mayorista from './components/Mayorista';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import AdminAuth from './components/AdminAuth/AdminAuth';
import Novedades from './components/Novedades';
import Accesorios from './components/Accesorios';
import Bodys from './components/Bodys';
import Calzados from './components/Calzados';
import Productos from './components/Productos';
import VentaSalPorMayor from './components/VentaSalPorMayor';
import Categoria from './components/Categoria'; 
import AboutPage from './components/AboutPage';
import CartPage from './pages/CartPage';
import PreguntasFrecuentes from './components/PreguntasFrecuentes';
import WhatsAppFloat from './components/WhatsAppFloat';
import Contacto from './components/Contacto';
import './styles/global.css'

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          {/* ✅ AGREGAR DashboardProvider AQUÍ */}
          <DashboardProvider>
            <Router>
              <div className="App">
                <Navbar />
                
                {/* DEBUG TEMPORAL - eliminar cuando funcione */}
                <div style={{
                  background: '#e3f2fd', 
                  padding: '10px', 
                  textAlign: 'center',
                  borderBottom: '2px solid #2196f3',
                  fontSize: '14px'
                }}>
                  <strong>🛒 DEBUG CARRO:</strong> El carrito funciona - prueba agregar productos en Outlet
                </div>

                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/outlet" element={<OutletPage />} />
                    <Route path="/admin" element={<PanelAdmin />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/mujer" element={<Ubicacion />} />
                    <Route path="/mayorista" element={<Mayorista />} />
                    <Route path="/admin-auth" element={<AdminAuth />} />
                    <Route path="/novedades" element={<Novedades />} />
                    <Route path="/bodys" element={<Bodys />} />
                    <Route path="/accesorios" element={<Accesorios />} />
                    <Route path="/calzados" element={<Calzados />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/ventasalpormayor" element={<VentaSalPorMayor />} />
                    <Route path="/categoria/:categoria" element={<Categoria />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
                    <Route path="/contacto" element={<Contacto />} />
                  </Routes>
                </ErrorBoundary>

                {/* BOTÓN FLOTANTE DE WHATSAPP */}
                <WhatsAppFloat />
                
                <Footer />
              </div>
            </Router>
          </DashboardProvider>
          {/* ✅ FIN DE DashboardProvider */}
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  )
}

export default App