// components/PreguntasFrecuentes.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './PreguntasFrecuentes.css';

const PreguntasFrecuentes = () => {
  return (
    <div className="preguntas-frecuentes">
      <header className="faq-header">
        <div className="container">
          <h1 className="faq-logo">by_lu_Aliendo</h1>
          <p className="faq-tagline">Preguntas Frecuentes - Encuentra todas las respuestas que necesitas</p>
        </div>
      </header>
      
      <div className="container">
        <div className="faq-content">
          
          {/* Sección de Navegación Rápida */}
          <div className="quick-links-section">
            <h2>Navegación Rápida</h2>
            <div className="quick-links-grid">
              <Link to="/como-comprar" className="quick-link-card">
                <span className="quick-link-icon">🛒</span>
                <span>¿Cómo comprar?</span>
              </Link>
              <Link to="/adherite" className="quick-link-card">
                <span className="quick-link-icon">⭐</span>
                <span>¡Adherite a by_lu_Aliendo!</span>
              </Link>
              <Link to="/envios" className="quick-link-card">
                <span className="quick-link-icon">🚚</span>
                <span>Consolidación de envíos</span>
              </Link>
              <Link to="/preguntas-frecuentes" className="quick-link-card">
                <span className="quick-link-icon">❓</span>
                <span>Preguntas Frecuentes</span>
              </Link>
              <Link to="/about" className="quick-link-card">
                <span className="quick-link-icon">ℹ️</span>
                <span>Acerca de by_lu_Aliendo</span>
              </Link>
              <Link to="/productos" className="quick-link-card">
                <span className="quick-link-icon">👥</span>
                <span>Sobre Nosotros</span>
              </Link>
              <Link to="/por-que-elegirnos" className="quick-link-card">
                <span className="quick-link-icon">✅</span>
                <span>¿Por qué elegirnos?</span>
              </Link>
              <Link to="/contacto" className="quick-link-card">
                <span className="quick-link-icon">📞</span>
                <span>Comunicate con nosotros</span>
              </Link>
              <Link to="/nosotros" className="quick-link-card">
                <span className="quick-link-icon">📄</span>
                <span>Términos y Condiciones</span>
              </Link>
              <Link to="/politica-privacidad" className="quick-link-card">
                <span className="quick-link-icon">🔒</span>
                <span>Políticas de Privacidad</span>
              </Link>
            </div>
          </div>

          {/* Preguntas Frecuentes */}
          <div className="faq-section">
            <h2>Preguntas Frecuentes</h2>
            
            <div className="faq-item">
              <h3>1. ¿Qué es by_lu_Aliendo?</h3>
              <div className="faq-answer">
                <p>by_lu_Aliendo es una plataforma mayorista, orientada a revendedores y negocios.</p>
                <p>Cuenta con más de 300 fabricantes mayoristas de indumentaria de la Zona de Flores (CABA), actuando como la vidriera digital más grande para tu negocio.</p>
              </div>
            </div>

            <div className="faq-item">
              <h3>2. ¿Cómo comprar?</h3>
              <div className="faq-answer">
                <p>Cualquier persona puede comprar siempre y cuando cumpla con el monto mínimo de compra exigido por la tienda fabricante para acceder a los precios mayoristas.</p>
                <p>Los precios publicados no incluyen el costo de IVA.</p>
                
                <div className="process-section">
                  <h4>Proceso de Compra</h4>
                  <p>Conocé paso a paso cómo podés generar tu pedido:</p>
                  <ol className="process-steps">
                    <li>Registrate o iniciá sesión.</li>
                    <li>Seleccioná productos y agregalos al carrito (recordá el mínimo de compra es por tienda).</li>
                    <li>Confirmá el carrito.</li>
                    <li>La tienda se contactará contigo para confirmar stock, pago y coordinar el envío.</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="faq-item">
              <h3>3. ¿Hay un mínimo compra? ¿Dónde lo puedo ver?</h3>
              <div className="faq-answer">
                <p>Cada tienda establece su propio monto mínimo de compra. Lo podés ver en el perfil de la tienda seleccionada. Debés cumplir el mínimo para poder confirmar el pedido.</p>
              </div>
            </div>

            <div className="faq-item">
              <h3>4. ¿Todos los productos publicados están en stock?</h3>
              <div className="faq-answer">
                <p>No necesariamente. Debido a la alta dinámica de venta mayorista, el stock varía constantemente. Por eso, es esencial que NO realices el pago hasta que la tienda se comunique contigo (en 24 a 48 hs hábiles) para confirmar la disponibilidad.</p>
              </div>
            </div>

            <div className="faq-item">
              <h3>5. Hice un pedido y la tienda no se contacta conmigo.</h3>
              <div className="faq-answer">
                <p>Las tiendas pueden demorar entre 24 y 48 horas hábiles en contactarse.</p>
                <p>Si no tenés respuesta, contactate con nuestro Servicio de Atención al Cliente para que gestionemos el seguimiento.</p>
              </div>
            </div>

            <div className="faq-item">
              <h3>6. ¿Quién define el costo del envío?</h3>
              <div className="faq-answer">
                <p>El costo lo define la tienda. Ellos te proporcionarán las opciones logísticas y las tarifas más ajustadas según el peso del paquete y tu ubicación, buscando la opción más conveniente para tu zona.</p>
              </div>
            </div>

            <div className="faq-item">
              <h3>7. ¿Qué métodos de pago ofrecen las tiendas?</h3>
              <div className="faq-answer">
                <p>Las tiendas suelen aceptar Depósito o Transferencia Bancaria y Mercado Pago (que incluye opciones con Tarjeta de Crédito, Débito o efectivo por RapiPago/PagoFácil).</p>
              </div>
            </div>

            <div className="faq-item">
              <h3>8. ¿Tienen recargo los pagos?</h3>
              <div className="faq-answer">
                <p>El pago por Transferencia o Depósito generalmente no tiene recargo. El uso de Mercado Pago o Tarjeta de Crédito sí puede generar un recargo variable que debes consultar con la tienda antes de abonar.</p>
              </div>
            </div>

            <div className="faq-item">
              <h3>9. ¿Cómo informo un pago?</h3>
              <div className="faq-answer">
                <p>Los pagos no se informan automáticamente.</p>
                <p>Debés enviar el comprobante de pago/transferencia a la tienda para que puedan verificarlo y despachar el pedido.</p>
              </div>
            </div>

            <div className="faq-item">
              <h3>10. ¿Qué pasa si necesito una factura?</h3>
              <div className="faq-answer">
                <p>La factura es emitida directamente por cada tienda de forma individual. Si eres Responsable Inscripto o Monotributista, debés comunicarle tus datos y tu solicitud a la tienda antes de abonar.</p>
              </div>
            </div>

            <div className="faq-item">
              <h3>11. ¿Se pueden cambiar las prendas o realizar devoluciones?</h3>
              <div className="faq-answer">
                <p>Cada tienda tiene su propia política de cambios y devoluciones.</p>
                <p>Sugerimos asesorarte con la marca antes de pagar sobre su política de cambio por fallas o disconformidad de talle.</p>
              </div>
            </div>

            <div className="faq-item">
              <h3>12. ¿Qué hago en caso de prendas falladas?</h3>
              <div className="faq-answer">
                <p>Debés contactarte directamente con la tienda. by_lu_Aliendo es intermediario y no arma ni revisa los pedidos.</p>
              </div>
            </div>

            <div className="faq-item">
              <h3>13. ¿Qué hago si la tienda no me da una respuesta?</h3>
              <div className="faq-answer">
                <p>Si pasan 48 horas hábiles y la tienda no te brinda una respuesta sobre tu reclamo, podés contactar nuestros canales de Atención al Cliente para que te ayudemos a gestionar el seguimiento.</p>
              </div>
            </div>

            <div className="faq-item">
              <h3>14. ¿Hay una política de garantía de envíos de by_lu_Aliendo?</h3>
              <div className="faq-answer">
                <p>No. Dado que cada tienda gestiona ahora su propia logística, la garantía por robo, extravío o siniestro debe ser gestionada directamente entre el comprador y la empresa de logística elegida por la tienda.</p>
              </div>
            </div>

          </div>

          {/* Sección de Contacto */}
          <div className="contact-section">
            <h2>¿No encontraste tu respuesta?</h2>
            <p>Estamos aquí para ayudarte. Contacta con nuestro equipo de soporte:</p>
            <div className="contact-options">
              <div className="contact-option">
                <span className="contact-icon">📧</span>
                <div>
                  <strong>Email</strong>
                  <p>bylualiendo@gmail.com</p>
                </div>
              </div>
              <div className="contact-option">
                <span className="contact-icon">📞</span>
                <div>
                  <strong>Teléfono</strong>
                  <p>+54 351 8046979</p>
                </div>
              </div>
              <div className="contact-option">
                <span className="contact-icon">💬</span>
                <div>
                  <strong>WhatsApp</strong>
                  <p>+54 351 8046979</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/" className="btn-back">Volver al Inicio</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreguntasFrecuentes;