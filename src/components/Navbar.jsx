import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import logo from '../assets/imagenes/logolu.png'
import { useCart } from '../context/CartContext'
import CartWidget from './CartWidget'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [darkMode, setDarkMode] = useState(false)
  const [user, setUser] = useState(null) // Estado para el usuario logueado

  // Cargar el modo oscuro desde localStorage al iniciar
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    document.body.classList.toggle('dark-mode', savedDarkMode)
  }, [])

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Función para alternar modo oscuro/claro
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    document.body.classList.toggle('dark-mode', newDarkMode)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (isLoginOpen) setIsLoginOpen(false)
  }

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen)
    if (isSearchOpen) setIsSearchOpen(false)
  }

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen)
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault()
      console.log('Buscando:', searchTerm)
      setIsSearchOpen(false)
      setSearchTerm('')
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    console.log('Login data:', loginData)
    // Aquí iría la lógica real de login con email/password
    // Por ahora simulamos un login exitoso
    const mockUser = {
      name: 'Usuario Demo',
      email: loginData.email,
      avatar: '👤'
    }
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    setIsLoginOpen(false)
    setLoginData({ email: '', password: '' })
    alert(`¡Bienvenido ${mockUser.name}!`)
  }

  // ✅ IMPLEMENTACIÓN REAL DE LOGIN CON GOOGLE
  const handleGoogleLogin = () => {
    console.log('Iniciando login con Google...')
    
    // Configuración de Google OAuth
    const clientId = 'TU_CLIENT_ID_DE_GOOGLE' // Reemplaza con tu Client ID real
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google/callback`)
    const scope = encodeURIComponent('profile email')
    const state = encodeURIComponent('google_login')
    
    // URL de autenticación de Google
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`
    
    // Abrir ventana de login de Google
    const width = 500
    const height = 600
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2
    
    const authWindow = window.open(
      authUrl,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    )
    
    // Escuchar mensajes desde la ventana de autenticación
    const receiveMessage = (event) => {
      if (event.origin !== window.location.origin) return
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const userData = event.data.user
        console.log('✅ Usuario autenticado con Google:', userData)
        
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        setIsLoginOpen(false)
        alert(`¡Bienvenido ${userData.name}!`)
        
        // Limpiar el event listener
        window.removeEventListener('message', receiveMessage)
      }
    }
    
    window.addEventListener('message', receiveMessage)
    
    // Verificar si la ventana se cerró
    const checkWindow = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(checkWindow)
        window.removeEventListener('message', receiveMessage)
        console.log('Ventana de Google cerrada')
      }
    }, 500)
  }

  // ✅ ALTERNATIVA SIMPLE - Login con Google simulado (para desarrollo)
  const handleGoogleLoginSimple = () => {
    console.log('🔐 Login con Google (simulado)')
    
    // Simular datos de usuario de Google
    const googleUser = {
      name: 'Usuario Google',
      email: 'usuario@gmail.com',
      avatar: '🅖',
      provider: 'google'
    }
    
    setUser(googleUser)
    localStorage.setItem('user', JSON.stringify(googleUser))
    setIsLoginOpen(false)
    alert(`¡Bienvenido ${googleUser.name}!`)
  }

  const handleLogout = () => {
    console.log('Cerrando sesión')
    setUser(null)
    localStorage.removeItem('user')
    setIsLoginOpen(false)
    alert('¡Sesión cerrada!')
  }

  // Categorías disponibles
  const categories = [
    { name: 'Remeras', path: '/categoria/remeras' },
    { name: 'Buzos', path: '/categoria/buzos' },
    { name: 'Suéters', path: '/categoria/sueters' },
    { name: 'Bodys', path: '/categoria/bodys' },
    { name: 'Jeans', path: '/categoria/jeans' },
    { name: 'Shorts', path: '/categoria/shorts' },
    { name: 'Vestidos', path: '/categoria/vestidos' },
    { name: 'Calzados', path: '/categoria/calzados' },
    { name: 'accesorios', path: '/categoria/accesorios' }
  ]

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo con imagen */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img 
            src={logo} 
            alt="By Luciana Logo" 
            className="logo-image"
          />
          <span className="logo-text">by Luciana Aliendo</span>
        </Link>

        {/* Menu para desktop */}
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/mujer" className="nav-link" onClick={closeMenu}>
              Ubicacion
            </Link>
          </li>
          
          <li 
            className="nav-item categories-item"
            onMouseEnter={() => setIsCategoriesOpen(true)}
            onMouseLeave={() => setIsCategoriesOpen(false)}
          >
            <span className="nav-link categories-link">
              Categorías
            </span>
            {isCategoriesOpen && (
              <ul className="categories-dropdown">
                {categories.map((category, index) => (
                  <li key={index} className="dropdown-item">
                    <Link 
                      to={category.path} 
                      className="dropdown-link"
                      onClick={() => {
                        closeMenu()
                        setIsCategoriesOpen(false)
                      }}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        {/* Iconos de acción */}
        <div className="nav-actions">
          {/* Botón Modo Oscuro/Claro */}
          <button 
            className="nav-icon dark-mode-toggle"
            onClick={toggleDarkMode}
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <span className="icon">
              {darkMode ? '☀️' : '🌙'}
            </span>
          </button>

          {/* Login Button & Panel */}
          <div className="login-container">
            <button className="nav-icon" onClick={toggleLogin}>
              {user ? (
                <span className="user-avatar" title={user.name}>
                  {user.avatar}
                </span>
              ) : (
                <span className="icon">👤</span>
              )}
            </button>
            {isLoginOpen && (
              <div className="login-panel">
                {user ? (
                  // Panel cuando el usuario está logueado
                  <div className="user-panel">
                    <h4>¡Hola, {user.name}!</h4>
                    <p>{user.email}</p>
                    <div className="user-actions">
                      <Link to="/perfil" className="profile-btn" onClick={() => setIsLoginOpen(false)}>
                        Mi Perfil
                      </Link>
                      <Link to="/pedidos" className="orders-btn" onClick={() => setIsLoginOpen(false)}>
                        Mis Pedidos
                      </Link>
                      <button onClick={handleLogout} className="logout-btn">
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  // Panel de login cuando no hay usuario
                  <>
                    <h4>Iniciar Sesión</h4>
                    
                    {/* Botón de Google - USANDO LA VERSIÓN SIMPLE */}
                    <button className="google-login-btn" onClick={handleGoogleLoginSimple}>
                      <span className="google-icon">G</span>
                      Continuar con Google
                    </button>
                    
                    <div className="login-divider">
                      <span>o ingresa con tu email</span>
                    </div>
                    
                    <form onSubmit={handleLogin} className="login-form">
                      <input
                        type="email"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        required
                        className="login-input"
                      />
                      <input
                        type="password"
                        placeholder="Contraseña"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                        className="login-input"
                      />
                      <button type="submit" className="login-btn">
                        Ingresar
                      </button>
                    </form>
                    <div className="login-links">
                      <a href="#registro">Crear cuenta</a>
                      <a href="#olvide">¿Olvidé mi contraseña?</a>
                    </div>
                  </>
                )}
                <button 
                  className="login-close"
                  onClick={() => setIsLoginOpen(false)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* CARRITO REAL */}
          <CartWidget />

          <Link to="/admin" className="btn btn-admin">Panel Admin</Link>
        </div>

        {/* Menú hamburguesa para mobile */}
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>

      {/* Overlay para mobile */}
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </nav>
  )
}

export default Navbar