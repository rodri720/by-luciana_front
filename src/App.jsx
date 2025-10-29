﻿import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
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
function App() {
  return (
    <AuthProvider>
    <ProductProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <ErrorBoundary> {/* ✅ CORRECTO: ErrorBoundary envuelve el contenido */}
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/outlet" element={<OutletPage />} />
                <Route path="/admin" element={<PanelAdmin />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/mujer" element={<Ubicacion />} />
                <Route path="/mayorista" element={<Mayorista />} />
                <Route path="/admin-auth" element={<AdminAuth />} />
                {/* ❌ ELIMINADO: <ErrorBoundary componentName="AdminDashboard"></ErrorBoundary> */}
              </Routes>
            </ErrorBoundary>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </ProductProvider>
    </AuthProvider>
  )
}

export default App