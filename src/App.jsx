﻿import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext'
import './App.css'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Footer from './components/Footer'

function App() {
  return (
    <ProductProvider>
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
    </ProductProvider>
  )
}

export default App