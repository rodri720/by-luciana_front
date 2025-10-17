// src/components/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Credenciales simples (en producción usa autenticación real)
    if (username === 'admin' && password === 'admin123') {
      navigate('/admin');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <form onSubmit={handleLogin} style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        width: '300px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
          Admin - By Luciana
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            required
          />
        </div>

        <button type="submit" style={{
          width: '100%',
          padding: '12px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Ingresar
        </button>

        <p style={{ 
          marginTop: '20px', 
          fontSize: '12px', 
          color: '#666',
          textAlign: 'center' 
        }}>
          Usuario: admin / Contraseña: admin123
        </p>
      </form>
    </div>
  );
}

export default AdminLogin;