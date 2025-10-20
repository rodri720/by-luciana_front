import React from 'react';
import './Ubicacion.css';

const Ubicacion = () => {
  return (
    <div className="ubicacion-container">
      <div className="ubicacion-content">
        <h1>Nuestras Ubicaciones</h1>
        <p>Visítanos en nuestros showrooms mayoristas</p>
        
        <div className="locations-grid">
          {/* Primera ubicación */}
          <div className="location-item">
            <h3>📍 Padre Mariani 133</h3>
            <p>Villa Allende, Córdoba</p>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3407.234567890123!2d-64.29500000000000!3d-31.300000000000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDE4JzAwLjAiUyA2NMKwMTcnNDAuMCJX!5e0!3m2!1ses!2sar!4v1234567890123"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Villa Allende - Padre Mariani 133"
              ></iframe>
            </div>
            <div className="location-info">
              <p><strong>Dirección:</strong> Padre Mariani 133, Villa Allende, Córdoba</p>
              <p><strong>Código Postal:</strong> 5009</p>
            </div>
          </div>

          {/* Segunda ubicación */}
          <div className="location-item">
            <h3>📍 9 de Julio y Tablada</h3>
            <p>Córdoba Capital</p>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.123456789012!2d-64.188268724276!3d-31.420419874295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDI1JzEzLjUiUyA2NMKwMTEnMTAuMCJX!5e0!3m2!1ses!2sar!4v1234567890123"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Córdoba Capital - 9 de Julio y Tablada"
              ></iframe>
            </div>
            <div className="location-info">
              <p><strong>Dirección:</strong> 9 de Julio y Tablada, Córdoba Capital</p>
              <p><strong>Intersección:</strong> Esquina noroeste</p>
            </div>
          </div>
        </div>

        <div className="info-ubicacion">
          <div className="info-item">
            <h3>🕒 Horarios de Atención</h3>
            <p><strong>Lunes a Viernes:</strong> 8:00 - 18:00</p>
            <p><strong>Sábados:</strong> 9:00 - 13:00</p>
            <p><strong>Domingos:</strong> Cerrado</p>
          </div>

          <div className="info-item">
            <h3>📞 Contacto</h3>
            <p><strong>Teléfono:</strong> +54 351 123-4567</p>
            <p><strong>Email:</strong> info@tuempresa.com</p>
            <p><strong>WhatsApp:</strong> +54 351 765-4321</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ubicacion;