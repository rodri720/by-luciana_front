// src/components/ConnectionTester.jsx
import React, { useState } from 'react';

const ConnectionTester = () => {
  const [testResult, setTestResult] = useState('');
  const [testing, setTesting] = useState(false);

  const testBackendConnection = async () => {
    setTesting(true);
    setTestResult('🔍 Probando conexión...');
    
    try {
      const response = await fetch('http://localhost:5000/api/health', {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ CONEXIÓN EXITOSA: ${JSON.stringify(data)}`);
      } else {
        setTestResult(`❌ Error HTTP: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestResult(`❌ Error de conexión: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{
      background: '#e3f2fd',
      border: '2px solid #2196f3',
      borderRadius: '8px',
      padding: '15px',
      margin: '10px 0',
      fontSize: '14px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>🔧 Diagnóstico de Conexión</h4>
      
      <button 
        onClick={testBackendConnection}
        disabled={testing}
        style={{
          background: '#2196f3',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        {testing ? '🔄 Probando...' : '🧪 Probar Conexión'}
      </button>
      
      {testResult && (
        <div style={{
          background: testResult.includes('✅') ? '#e8f5e8' : '#ffebee',
          border: `1px solid ${testResult.includes('✅') ? '#4caf50' : '#f44336'}`,
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          {testResult}
        </div>
      )}
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <strong>💡 Si falla la conexión:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Verifica que el backend esté en puerto 5000</li>
          <li>Revisa la consola del backend por errores</li>
          <li>Prueba en el navegador: <code>http://localhost:5000/api/health</code></li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectionTester;