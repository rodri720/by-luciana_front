﻿import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'
import './App.css'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Footer from './components/Footer'

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
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