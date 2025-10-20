﻿import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import './App.css'
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Footer from './components/Footer';
import OutletPage from './components/OutletPage';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import Nosotros from './components/Nosotros';
import Ubicacion from './components/Ubicacion'; 
function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/outlet" element={<OutletPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin-login" element={<AdminLogin />} />
               <Route path="/nosotros" element={<Nosotros />} />
               <Route path="/mujer" element={<Ubicacion />} /> 
              {/* Agregaremos más rutas aquí */}
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </ProductProvider>
  )
}

export default App