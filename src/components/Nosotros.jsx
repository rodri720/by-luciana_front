import React from 'react';
import './Nosotros.css';

const Nosotros = () => {
  return (
    <div className="nosotros-container">
      <div className="nosotros-content">
        <h1>Sobre Nosotros</h1>
        <div className="nosotros-text">
          <p>
            <strong>Somos distribuidores mayoristas de moda integral</strong>, 
            especializados en ropa y accesorios para todo tipo de negocio. 
            Contamos con una línea dedicada a la moda circular sostenible, 
            comprometidos con un futuro más responsable en la industria de la moda.
          </p>
          
          <h3>Nuestros Servicios</h3>
          <ul>
            <li>✅ <strong>Ropa mayorista</strong> para dama, bodys , remeras , jeans ,vestidos ,camperas y toda la gama de moda</li>

            <li>✅ <strong>Accesorios y complementos</strong> de moda</li>

            <li>✅ <strong>Línea de moda circular</strong> y sostenible</li>

            <li>✅ <strong>Envíos a todo el país</strong> con cobertura nacional</li>

            <li>✅ <strong>Precios competitivos</strong> para emprendedores y negocios</li>

            <li>✅ <strong>Asesoramiento personalizado</strong> para tu negocio</li>
          </ul>

          <p>
            Trabajamos con emprendedores, minoristas y negocios de todo el país, 
            ofreciendo productos de calidad y un servicio confiable que impulse 
            el crecimiento de tu negocio de moda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;