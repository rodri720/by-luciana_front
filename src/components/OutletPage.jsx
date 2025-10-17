import { Link } from 'react-router-dom'
import './OutletPage.css'
import logo from '../assets/imagenes/logolu.png'

function OutletPage() {
  return (
    <div className="outlet-page">
      {/* Header con logo */}
      <header className="outlet-header">
        <div className="container">
          <img src={logo} alt="By Luciana" className="outlet-logo" />
          <h1 className="outlet-title">Outlet</h1>
          
        </div>
      </header>

      {/* Contenido principal */}
      <main className="outlet-content">
        <div className="container">
          <div className="outlet-products">
            
            
            {/* Puedes agregar más contenido aquí */}
          </div>
        </div>
      </main>

      {/* Botón para volver */}
      <footer className="outlet-footer">
        <div className="container">
          <Link to="/" className="btn btn-primary">
            Volver a la Página Principal
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default OutletPage