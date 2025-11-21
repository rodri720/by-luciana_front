// components/AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <div className="container">
          <h1 className="logo">by_lu_Aliendo</h1>
          <p className="tagline">Una plataforma digital especializada en visibilidad y conexión mayorista</p>
        </div>
      </header>
      
      <div className="container">
        <div className="content-section">
          <h2>¡Somos by_lu_Aliendo!</h2>
          <p>by_lu_Aliendo es una plataforma digital especializada en visibilidad y conexión mayorista.</p>
          
          <div className="highlight">
            <p>Con más de 8 años de trayectoria, reunimos a cientos de fabricantes y tiendas de indumentaria en un solo lugar, impulsando el comercio mayorista argentino.</p>
          </div>
          
          <p>Desde 2025, evolucionamos hacia un modelo basado en suscripción publicitaria y exposición digital, brindando herramientas para potenciar la presencia online de cada marca.</p>
        </div>
        
        <div className="content-section">
          <h2>Misión</h2>
          <p>En by_lu_Aliendo, nuestra misión es simplificar y potenciar el acceso de las tiendas mayoristas a una vidriera digital de alto impacto. Buscamos conectar a las marcas con sus compradores de manera eficiente, transparente y adaptada a las necesidades del mercado actual.</p>
        </div>
        
        <div className="content-section">
          <h2>Visión</h2>
          <p>Nos proyectamos como la plataforma líder en visibilidad mayorista, siendo el puente directo entre las mejores tiendas de moda y los comerciantes de toda la región. Aspiramos a ser sinónimo de confianza, innovación y excelencia en el sector.</p>
        </div>
        
        <div className="content-section">
          <h2>Valores</h2>
          <div className="values-grid">
            <div className="value-card">
              <h4>▸ Transparencia</h4>
              <p>Nos comprometemos a actuar con claridad y honestidad en todas nuestras operaciones.</p>
            </div>
            
            <div className="value-card">
              <h4>▸ Innovación</h4>
              <p>Apostamos por la mejora continua y la adaptación a las nuevas tendencias para brindar un servicio de vanguardia.</p>
            </div>
            
            <div className="value-card">
              <h4>▸ Compromiso con el cliente</h4>
              <p>La satisfacción de nuestros usuarios es nuestra prioridad, ofreciendo siempre un soporte cercano y soluciones a medida.</p>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" className="btn-back">Volver al Inicio</Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;