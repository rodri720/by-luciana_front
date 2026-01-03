﻿import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { DashboardProvider } from './context/DashboardContext';
import './App.css'
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Footer from './components/Footer';
import OutletPage from './components/OutletPage';
import PanelAdmin from "./components/PanelAdmin/PanelAdmin"
import AdminLogin from './components/AdminLogin';
import Nosotros from './components/Nosotros';
import Ubicacion from './components/Ubicacion'; 
import Jeans from './components/Jeans';
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
import Remeras from './components/Remeras';
import RopaDeportiva from './components/RopaDeportiva';
import Vestidos from './components/Vestidos';
import Abrigos from './components/Abrigos';
import RopaInterior from './components/RopaInterior';
import Fiesta from './components/Fiesta';
import ProductDetail from './components/ProductDetail/ProductDetail';
// ✅ NUEVOS COMPONENTES DE PAGO
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import CheckoutPage from './pages/CheckoutPage'; // Si no lo tienes, créalo
import PaymentButton from './components/PaymentButton'; // Componente reutilizable

import './styles/global.css'

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
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
                    {/* ✅ RUTAS EXISTENTES */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/outlet" element={<OutletPage />} />
                    <Route path="/admin" element={<PanelAdmin />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/mujer" element={<Ubicacion />} />
                    <Route path="/jeans" element={<Jeans />} />
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
                    <Route path="/remeras" element={<Remeras />} />
                    <Route path="/ropadeportiva" element={<RopaDeportiva />} />
                    <Route path="/vestidos" element={<Vestidos />} />
                    <Route path="/abrigos" element={<Abrigos />} />
                    <Route path="/ropainterior" element={<RopaInterior />} />
                    <Route path="/fiesta" element={<Fiesta />} />
                     <Route path="/product/:id" element={<ProductDetail />} />
                    {/* ✅ NUEVAS RUTAS DE PAGOS */}
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/failure" element={<PaymentFailure />} />
                    <Route path="/payment/pending" element={<PaymentSuccess />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    
                    {/* ✅ RUTA DE PRUEBA - Puedes eliminar después */}
                    <Route path="/test-payment" element={<PaymentTestPage />} />
                  </Routes>
                </ErrorBoundary>

                {/* BOTÓN FLOTANTE DE WHATSAPP */}
                <WhatsAppFloat />
                
                <Footer />
              </div>
            </Router>
          </DashboardProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  )
}

// ✅ COMPONENTE TEMPORAL PARA PRUEBAS
function PaymentTestPage() {
  const cartItems = [
    {
      id: '1',
      name: 'Remera By Luciana',
      price: 4500,
      quantity: 1,
      image: '/uploads/remera.jpg',
      color: 'Negro',
      size: 'M'
    },
    {
      id: '2', 
      name: 'Pantalón Jeans',
      price: 7800,
      quantity: 1,
      image: '/uploads/jeans.jpg',
      color: 'Azul',
      size: '38'
    }
  ];

  const customerInfo = {
    name: 'Lucía Test',
    email: 'bylualiendo@gmail.com',
    phone: '1122334455',
    address: 'Calle Falsa 123'
  };

  const shippingInfo = {
    method: 'standard',
    cost: 800
  };

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '600px', 
      margin: '0 auto',
      minHeight: '80vh'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        🧪 Prueba de MercadoPago
      </h1>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3>Carrito de prueba:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cartItems.map(item => (
            <li key={item.id} style={{ 
              padding: '10px', 
              borderBottom: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{item.name} ({item.quantity}x)</span>
              <span>${item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '10px',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          <span>Total:</span>
          <span>${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shippingInfo.cost}</span>
        </div>
      </div>

      <PaymentButton 
        cartItems={cartItems}
        customerInfo={customerInfo}
        shippingInfo={shippingInfo}
        onSuccess={() => console.log('Pago exitoso!')}
        onError={(error) => console.log('Error:', error)}
      />
      
      <div style={{ 
        marginTop: '30px', 
        padding: '15px',
        background: '#fff3cd',
        border: '1px solid #ffd43b',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <h4>💡 Instrucciones de prueba:</h4>
        <p>1. Haz clic en "Pagar con MercadoPago"</p>
        <p>2. En MercadoPago Sandbox, usa tarjeta de prueba:</p>
        <p><strong>Visa:</strong> 4509 9535 6623 3704 (CVV: 123)</p>
        <p>3. Cualquier fecha futura y CVV 123</p>
        <p>4. No se harán cargos reales</p>
      </div>
    </div>
  );
}

export default App