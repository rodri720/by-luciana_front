import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminAuth.css';

function AdminAuth() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (login(password)) {
      // Redirección automática
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <div className="auth-header">
          <h2>🔐 Acceso Administrativo</h2>
          <p>Ingresa la contraseña para acceder al panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="auth-button">
            🚀 Acceder al Panel
          </button>
        </form>

        <div className="auth-hint">
          <p>💡 Contraseña: <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
}

export default AdminAuth;