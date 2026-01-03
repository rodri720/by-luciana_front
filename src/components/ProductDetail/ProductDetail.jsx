// src/components/ProductDetail/ProductDetail.jsx - VERSIÓN ACTUALIZADA
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando producto ID:', id);
      
      // ✅ 1. Primero intentar con datos locales/harcodeados
      const localProducts = getLocalProducts();
      const localProduct = localProducts.find(p => p._id === id);
      
      if (localProduct) {
        console.log('✅ Producto encontrado localmente');
        setProduct(localProduct);
        initializeSelections(localProduct);
        return;
      }
      
      // ✅ 2. Si no está localmente, intentar con el backend
      console.log('🌐 Intentando conectar al backend...');
      const backendUrl = 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/products/${id}`);
      
      if (!response.ok) {
        // Si el backend falla, usar un producto de ejemplo
        console.log('⚠️ Backend no disponible, usando producto de ejemplo');
        const fallbackProduct = createFallbackProduct(id);
        setProduct(fallbackProduct);
        initializeSelections(fallbackProduct);
        return;
      }
      
      const data = await response.json();
      console.log('✅ Producto cargado desde backend:', data);
      
      // Arreglar URLs de imágenes si es necesario
      const productWithFixedImages = {
        ...data,
        images: fixImageUrls(data.images || [], backendUrl)
      };
      
      setProduct(productWithFixedImages);
      initializeSelections(productWithFixedImages);
      
    } catch (err) {
      console.error('❌ Error cargando producto:', err);
      
      // Crear producto de emergencia
      const emergencyProduct = createEmergencyProduct(id);
      setProduct(emergencyProduct);
      initializeSelections(emergencyProduct);
      
      setError('Usando datos de demostración. El backend no está disponible.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Datos locales para pruebas
  const getLocalProducts = () => [
    {
      _id: '65f8a1b2c3d4e5f678901234',
      name: 'Remera Básica de Algodón',
      price: 15990,
      comparePrice: 19990,
      description: 'Remera 100% algodón premium, cómoda y suave al tacto. Ideal para uso diario. Confeccionada con materiales de alta calidad que garantizan durabilidad y comodidad.',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?w=600&h=600&fit=crop'
      ],
      category: 'novedades',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Negro', 'Blanco', 'Gris', 'Azul Marino', 'Rojo'],
      stock: 25,
      featured: true,
      sku: 'REM-ALG-001',
      tags: ['algodón', 'básica', 'unisex', 'casual'],
      active: true,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '65f8a1b2c3d4e5f678901235',
      name: 'Jean Slim Fit Premium',
      price: 34990,
      comparePrice: 39990,
      description: 'Jean de corte slim fit con 2% de elastano para mayor comodidad y movilidad. Tela denim premium resistente al desgaste. Perfecto para looks casuales y semi-formales.',
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&h=600&fit=crop'
      ],
      category: 'novedades',
      sizes: ['28', '30', '32', '34', '36', '38'],
      colors: ['Azul Claro', 'Azul Oscuro', 'Negro', 'Gris'],
      stock: 18,
      featured: true,
      sku: 'JEAN-SLM-002',
      tags: ['jean', 'slim fit', 'premium', 'denim'],
      active: true,
      createdAt: '2024-01-20T14:45:00Z'
    },
    {
      _id: '65f8a1b2c3d4e5f678901236',
      name: 'Camisa de Lino Verano',
      price: 22990,
      comparePrice: 25990,
      description: 'Camisa de lino 100% natural, tejida para máxima transpirabilidad. Perfecta para el verano y climas cálidos. Corte regular que ofrece comodidad y elegancia.',
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop'
      ],
      category: 'novedades',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blanco', 'Beige', 'Azul Claro', 'Verde Claro'],
      stock: 12,
      featured: false,
      sku: 'CAM-LIN-003',
      tags: ['lino', 'verano', 'casual', 'elegante'],
      active: true,
      createdAt: '2024-01-25T09:15:00Z'
    }
  ];

  const createFallbackProduct = (productId) => ({
    _id: productId,
    name: 'Producto de Demostración',
    price: 19990,
    comparePrice: 24990,
    description: 'Este es un producto de demostración para probar la funcionalidad de selección de color y talle. En un entorno real, este producto se cargaría desde la base de datos.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'
    ],
    category: 'general',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Blanco', 'Gris', 'Azul', 'Rojo'],
    stock: 15,
    featured: true,
    sku: 'DEMO-001',
    tags: ['demo', 'prueba', 'ejemplo'],
    active: true,
    createdAt: new Date().toISOString()
  });

  const createEmergencyProduct = (productId) => ({
    _id: productId,
    name: `Producto #${productId.substring(0, 6)}`,
    price: 14990,
    description: 'Producto disponible para prueba de funcionalidades.',
    images: ['https://via.placeholder.com/600x600/cccccc/969696?text=Producto+Demo'],
    category: 'general',
    sizes: ['Único', 'S', 'M', 'L'],
    colors: ['Mixto', 'Sólido'],
    stock: 10,
    sku: `EMG-${productId.substring(0, 8)}`,
    tags: ['emergencia', 'demo'],
    active: true
  });

  const fixImageUrls = (images, backendUrl) => {
    if (!images || !Array.isArray(images)) {
      return ['https://via.placeholder.com/600x600/cccccc/969696?text=Sin+imagen'];
    }
    
    return images.map(img => {
      if (!img) return 'https://via.placeholder.com/600x600/cccccc/969696?text=Sin+imagen';
      if (img.startsWith('http')) return img;
      if (img.startsWith('/')) return `${backendUrl}${img}`;
      return `${backendUrl}/uploads/${img}`;
    });
  };

  const initializeSelections = (productData) => {
    if (productData.colors && productData.colors.length > 0) {
      setSelectedColor(productData.colors[0]);
    }
    if (productData.sizes && productData.sizes.length > 0) {
      setSelectedSize(productData.sizes[0]);
    }
  };

  const handleAddToCart = () => {
    if (!product) {
      alert('Error: Producto no disponible');
      return;
    }

    // Validar selecciones
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('Por favor selecciona un color');
      return;
    }
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Por favor selecciona un talle');
      return;
    }

    // Validar stock
    if (product.stock <= 0) {
      alert('Lo sentimos, este producto no tiene stock disponible');
      return;
    }

    if (quantity > product.stock) {
      alert(`Solo quedan ${product.stock} unidades disponibles`);
      return;
    }

    // Crear item del carrito
    const cartItem = {
      id: `${product._id}_${selectedColor}_${selectedSize}`,
      productId: product._id,
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      sku: product.sku || '',
      category: product.category || 'general',
      addedAt: new Date().toISOString(),
      maxStock: product.stock
    };

    // Obtener carrito existente
    let cart = [];
    try {
      const cartStr = localStorage.getItem('cart');
      if (cartStr) {
        cart = JSON.parse(cartStr);
      }
    } catch (e) {
      console.error('Error al leer carrito:', e);
      cart = [];
    }

    // Verificar si ya existe
    const existingIndex = cart.findIndex(item => 
      item.productId === cartItem.productId && 
      item.color === cartItem.color && 
      item.size === cartItem.size
    );

    if (existingIndex >= 0) {
      // Actualizar cantidad
      const newQuantity = cart[existingIndex].quantity + cartItem.quantity;
      if (newQuantity > cartItem.maxStock) {
        alert(`No puedes agregar más. Máximo disponible: ${cartItem.maxStock}`);
        return;
      }
      cart[existingIndex].quantity = newQuantity;
    } else {
      // Agregar nuevo
      cart.push(cartItem);
    }

    // Guardar en localStorage
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Mensaje de éxito
      const message = `✅ ${quantity} x ${product.name}` + 
        (selectedColor ? `\nColor: ${selectedColor}` : '') + 
        (selectedSize ? `\nTalle: ${selectedSize}` : '') + 
        `\nAgregado al carrito`;
      
      alert(message);
      
      // Opcional: Resetear cantidad
      // setQuantity(1);
      
    } catch (e) {
      console.error('Error al guardar carrito:', e);
      alert('Error al agregar al carrito. Intenta nuevamente.');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Redirigir al carrito
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else if (product) {
      alert(`Máximo disponible: ${product.stock}`);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const changeMainImage = (index) => {
    setMainImageIndex(index);
  };

  const handleRetry = () => {
    setError(null);
    fetchProduct();
  };

  // Estados de carga
  if (loading) {
    return (
      <div className="pd-loading-container">
        <div className="pd-spinner"></div>
        <p>Cargando producto...</p>
        <p className="pd-product-id">ID: {id}</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="pd-error-container">
        <h2>⚠️ Error al cargar producto</h2>
        <p>{error}</p>
        <div className="pd-retry-buttons">
          <button className="pd-retry-btn" onClick={handleRetry}>
            Reintentar
          </button>
          <button className="pd-home-btn" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-not-found">
        <h2>😕 Producto no encontrado</h2>
        <p>El producto con ID <strong>{id}</strong> no existe.</p>
        <button className="pd-home-btn" onClick={() => navigate('/')}>
          Ver todos los productos
        </button>
      </div>
    );
  }

  return (
    <div className="pd-container">
      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <span className="pd-breadcrumb-link" onClick={() => navigate('/')}>
          🏠 Inicio
        </span>
        <span className="pd-breadcrumb-separator">/</span>
        <span className="pd-breadcrumb-link" onClick={() => navigate(`/category/${product.category}`)}>
          {product.category}
        </span>
        <span className="pd-breadcrumb-separator">/</span>
        <span className="pd-breadcrumb-current">{product.name}</span>
      </div>

      {error && (
        <div className="pd-warning-banner">
          ⚠️ {error}
        </div>
      )}

      <div className="pd-content">
        {/* Galería de imágenes */}
        <div className="pd-gallery">
          <div className="pd-main-image-container">
            <div className="pd-main-image">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[mainImageIndex]} 
                  alt={`${product.name} - Vista principal`}
                  className="pd-product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600/cccccc/969696?text=Imagen+no+disponible';
                  }}
                />
              ) : (
                <div className="pd-no-image-placeholder">
                  <span className="pd-no-image-text">🖼️ Sin imagen</span>
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="pd-image-navigation">
                <button 
                  className="pd-nav-btn pd-prev"
                  onClick={() => setMainImageIndex(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>
                <span className="pd-image-counter">
                  {mainImageIndex + 1} / {product.images.length}
                </span>
                <button 
                  className="pd-nav-btn pd-next"
                  onClick={() => setMainImageIndex(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                  aria-label="Siguiente imagen"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="pd-thumbnails-container">
              <div className="pd-thumbnails">
                {product.images.map((img, index) => (
                  <div 
                    key={index}
                    className={`pd-thumbnail-wrapper ${index === mainImageIndex ? 'active' : ''}`}
                    onClick={() => changeMainImage(index)}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - Vista ${index + 1}`}
                      className="pd-thumbnail"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100/cccccc/969696?text=Img';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="pd-info">
          <div className="pd-header">
            <h1 className="pd-title">{product.name}</h1>
            <div className="pd-sku">SKU: {product.sku || 'N/A'}</div>
          </div>

          <div className="pd-price-section">
            <div className="pd-price-main">
              <span className="pd-current-price">
                ${typeof product.price === 'number' ? product.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0,00'}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="pd-original-price">
                  ${typeof product.comparePrice === 'number' ? product.comparePrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0,00'}
                </span>
              )}
            </div>
            {product.comparePrice && product.comparePrice > product.price && (
              <div className="pd-discount-badge">
                -{Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
              </div>
            )}
          </div>

          {/* Descripción */}
          {product.description && (
            <div className="pd-description-section">
              <h3 className="pd-section-title">📝 Descripción</h3>
              <div className="pd-description-content">
                {product.description.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Color */}
          {product.colors && product.colors.length > 0 && (
            <div className="pd-selector-section pd-color-section">
              <div className="pd-selector-header">
                <h3 className="pd-section-title">🎨 Color</h3>
                {selectedColor && (
                  <span className="pd-selected-indicator">
                    Seleccionado: <strong>{selectedColor}</strong>
                  </span>
                )}
              </div>
              <div className="pd-color-options">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`pd-color-option ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    type="button"
                    aria-label={`Seleccionar color ${color}`}
                    title={color}
                  >
                    <span className="pd-color-name">{color}</span>
                    {selectedColor === color && (
                      <span className="pd-color-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Talle */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="pd-selector-section pd-size-section">
              <div className="pd-selector-header">
                <h3 className="pd-section-title">📏 Talle</h3>
                {selectedSize && (
                  <span className="pd-selected-indicator">
                    Seleccionado: <strong>{selectedSize}</strong>
                  </span>
                )}
              </div>
              <div className="pd-size-guide-link">
                <button type="button" className="pd-guide-btn">
                  ¿No sabes tu talle? Consulta nuestra guía de talles
                </button>
              </div>
              <div className="pd-size-options">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`pd-size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    type="button"
                    aria-label={`Seleccionar talle ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cantidad y Stock */}
          <div className="pd-quantity-stock-section">
            <div className="pd-quantity-control">
              <h3 className="pd-section-title">🔢 Cantidad</h3>
              <div className="pd-quantity-buttons">
                <button 
                  className="pd-quantity-btn pd-minus"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  type="button"
                  aria-label="Reducir cantidad"
                >
                  −
                </button>
                <span className="pd-quantity-value">{quantity}</span>
                <button 
                  className="pd-quantity-btn pd-plus"
                  onClick={incrementQuantity}
                  disabled={product.stock && quantity >= product.stock}
                  type="button"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="pd-stock-info">
              <div className={`pd-stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? (
                  <>
                    <span className="pd-stock-icon">✅</span>
                    <span className="pd-stock-text">
                      <strong>{product.stock}</strong> unidades disponibles
                    </span>
                  </>
                ) : (
                  <>
                    <span className="pd-stock-icon">❌</span>
                    <span className="pd-stock-text">Sin stock</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mensaje de validación */}
          {((product.colors && product.colors.length > 0 && !selectedColor) ||
            (product.sizes && product.sizes.length > 0 && !selectedSize)) && (
            <div className="pd-validation-message">
              ⚠️ Por favor selecciona {product.colors && !selectedColor ? 'un color' : ''} 
              {product.colors && !selectedColor && product.sizes && !selectedSize ? ' y ' : ''}
              {product.sizes && !selectedSize ? 'un talle' : ''} antes de continuar.
            </div>
          )}

          {/* Botones de acción */}
          <div className="pd-action-buttons">
            <button
              className="pd-add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || 
                (product.colors && product.colors.length > 0 && !selectedColor) ||
                (product.sizes && product.sizes.length > 0 && !selectedSize)}
              type="button"
            >
              <span className="pd-btn-icon">🛒</span>
              <span className="pd-btn-text">
                {product.stock > 0 ? 'AGREGAR AL CARRITO' : 'SIN STOCK'}
              </span>
            </button>
            
            <button 
              className="pd-buy-now-btn"
              onClick={handleBuyNow}
              disabled={product.stock <= 0 || 
                (product.colors && product.colors.length > 0 && !selectedColor) ||
                (product.sizes && product.sizes.length > 0 && !selectedSize)}
              type="button"
            >
              <span className="pd-btn-icon">⚡</span>
              <span className="pd-btn-text">COMPRAR AHORA</span>
            </button>
          </div>

          {/* Información adicional */}
          <div className="pd-additional-info">
            <h3 className="pd-section-title">📋 Detalles del producto</h3>
            
            <div className="pd-info-grid">
              {product.category && (
                <div className="pd-info-item">
                  <strong className="pd-info-label">Categoría:</strong>
                  <span className="pd-info-value">{product.category}</span>
                </div>
              )}
              
              {product.sku && (
                <div className="pd-info-item">
                  <strong className="pd-info-label">SKU:</strong>
                  <span className="pd-info-value pd-sku-value">{product.sku}</span>
                </div>
              )}
              
              {product.stock !== undefined && (
                <div className="pd-info-item">
                  <strong className="pd-info-label">Stock:</strong>
                  <span className={`pd-info-value ${product.stock > 10 ? 'stock-high' : product.stock > 0 ? 'stock-medium' : 'stock-low'}`}>
                    {product.stock} unidades
                  </span>
                </div>
              )}
              
              {product.tags && product.tags.length > 0 && (
                <div className="pd-info-item pd-tags-item">
                  <strong className="pd-info-label">Etiquetas:</strong>
                  <div className="pd-tags-container">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="pd-tag" title={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Garantías y envíos */}
          <div className="pd-warranty-shipping">
            <div className="pd-feature-item">
              <span className="pd-feature-icon">🚚</span>
              <div className="pd-feature-text">
                <strong>Envío gratis</strong>
                <small>En compras mayores a $30.000</small>
              </div>
            </div>
            <div className="pd-feature-item">
              <span className="pd-feature-icon">↩️</span>
              <div className="pd-feature-text">
                <strong>30 días de devolución</strong>
                <small>Cambios o devoluciones sin costo</small>
              </div>
            </div>
            <div className="pd-feature-item">
              <span className="pd-feature-icon">🛡️</span>
              <div className="pd-feature-text">
                <strong>Garantía 6 meses</strong>
                <small>Contra defectos de fabricación</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;