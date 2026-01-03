// src/components/ProductForm/ProductForm.jsx - VERSIÓN CORREGIDA CON IMÁGENES
import { useState, useEffect, useRef } from 'react';
import ImageUpload from '../ImageUpload/ImageUpload';
import { useProducts } from '../../context/ProductContext';
import './ProductForm.css';

// Predefinidos para hacerlo más fácil
const PREDEFINED_COLORS = [
  'Negro', 'Blanco', 'Gris', 'Azul Marino', 'Azul Claro', 
  'Rojo', 'Verde', 'Amarillo', 'Rosa', 'Beige', 'Marrón',
  'Naranja', 'Violeta', 'Celeste', 'Turquesa', 'Bordó'
];

const PREDEFINED_SIZES = {
  ropa: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  calzado: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  jean: ['28', '29', '30', '31', '32', '33', '34', '35', '36', '38', '40'],
  unico: ['Único']
};

const PREDEFINED_TAGS = [
  'algodón', 'lino', 'jean', 'slim fit', 'regular fit', 'oversize',
  'unisex', 'mujer', 'hombre', 'niño', 'niña', 'bebé',
  'casual', 'deporte', 'elegante', 'formal', 'verano', 'invierno',
  'básico', 'estampado', 'liso', 'rayas', 'cuadros'
];

// Configuración del backend
const BACKEND_URL = 'http://localhost:5000';

function ProductForm({ product, onSave, onCancel }) {
  const { createProduct, updateProduct } = useProducts();
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    category: product?.category || '',
    stock: product?.stock || 0,
    featured: product?.featured || false,
    sku: product?.sku || generateSKU(),
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    tags: product?.tags || [],
    sizeType: determineSizeType(product?.category, product?.sizes),
    images: product?.images || [] // ¡IMPORTANTE: Inicializar images aquí!
  });

  const [selectedColors, setSelectedColors] = useState(new Set(product?.colors || []));
  const [selectedSizes, setSelectedSizes] = useState(new Set(product?.sizes || []));
  const [selectedTags, setSelectedTags] = useState(new Set(product?.tags || []));
  const [customColor, setCustomColor] = useState('');
  const [customSize, setCustomSize] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [uploadedImageFiles, setUploadedImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Generar SKU automático
  function generateSKU() {
    const prefix = 'PROD';
    const random = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${random}`;
  }

  // Determinar tipo de talle según categoría
  function determineSizeType(category, existingSizes) {
    if (existingSizes?.length > 0) {
      if (existingSizes.some(s => ['XS','S','M','L','XL'].includes(s))) return 'ropa';
      if (existingSizes.some(s => /\d{2}/.test(s))) {
        return existingSizes.some(s => parseInt(s) < 30) ? 'calzado' : 'jean';
      }
    }
    
    if (category === 'calzados') return 'calzado';
    if (category === 'bodys') return 'ropa';
    if (category === 'accesorios') return 'unico';
    return 'ropa';
  }

  // Inicializar imágenes correctamente
  useEffect(() => {
    if (product?.images) {
      const absoluteUrls = product.images.map(img => {
        if (img.startsWith('/uploads/') && !img.startsWith('http')) {
          return `${BACKEND_URL}${img}`;
        }
        return img;
      });
      
      setImagePreviews(absoluteUrls);
    }
  }, [product]);

  // Manejar cambio de categoría
  useEffect(() => {
    if (formData.category && !product) {
      const sizeType = determineSizeType(formData.category, []);
      setFormData(prev => ({ ...prev, sizeType }));
      setSelectedSizes(new Set());
    }
  }, [formData.category, product]);

  // Función de subida de imágenes
  const uploadImagesToServer = async (files) => {
    if (!files || files.length === 0) return [];

    try {
      setImageUploading(true);
      console.log(`⬆️ Subiendo ${files.length} imagen(es) al servidor...`);

      const uploadFormData = new FormData();
      files.forEach((file) => {
        uploadFormData.append('images', file);
      });

      const response = await fetch(`${BACKEND_URL}/api/uploads/upload-images`, {
        method: 'POST',
        body: uploadFormData
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta del servidor (upload):', data);

      if (data.imageUrls && Array.isArray(data.imageUrls)) {
        return data.imageUrls;
      } else if (data.urls && Array.isArray(data.urls)) {
        return data.urls;
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (error) {
      console.error('❌ Error subiendo imágenes:', error);
      throw error;
    } finally {
      setImageUploading(false);
    }
  };

  // ✅ FUNCIÓN PRINCIPAL CORREGIDA - PROBLEMA RESUELTO
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🚀 Iniciando proceso de guardado del producto...');
    
    if (!isFormValid()) {
      alert('⚠️ Completa todos los campos requeridos antes de guardar');
      return;
    }
    
    setLoading(true);
    
    try {
      let finalImageUrls = [...(formData.images || [])];
      
      // ✅ 1. SUBIR NUEVAS IMÁGENES SI LAS HAY
      if (!product && uploadedImageFiles.length > 0) {
        console.log(`⬆️ Subiendo ${uploadedImageFiles.length} imágenes nuevas...`);
        
        try {
          const uploadedRelativeUrls = await uploadImagesToServer(uploadedImageFiles);
          
          if (uploadedRelativeUrls.length > 0) {
            // ✅ CORRECTO: Agregar las URLs a finalImageUrls
            finalImageUrls = [...finalImageUrls, ...uploadedRelativeUrls];
            console.log(`✅ ${uploadedRelativeUrls.length} imágenes subidas correctamente`);
            console.log('📸 URLs obtenidas:', uploadedRelativeUrls);
          }
        } catch (uploadError) {
          alert('Error subiendo imágenes: ' + uploadError.message);
          setLoading(false);
          return;
        }
      }
      
      // ✅ 2. PREPARAR DATOS DEL PRODUCTO - ¡IMÁGENES INCLUIDAS!
      console.log('🖼️ finalImageUrls a enviar:', finalImageUrls);
      console.log('📊 Longitud:', finalImageUrls.length);
      
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        sku: formData.sku.trim(),
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        featured: formData.featured === true || formData.featured === 'true',
        colors: Array.from(selectedColors),
        sizes: Array.from(selectedSizes),
        tags: Array.from(selectedTags),
        // ✅ ¡ESTA ES LA LÍNEA CLAVE QUE ESTABA FALTANDO!
        images: finalImageUrls, // Debe contener las URLs
        active: true
      };

      console.log('📤 Enviando producto al backend CON IMÁGENES...');
      console.log('📦 Datos completos:', JSON.stringify(productData, null, 2));

      // ✅ 3. CREAR O ACTUALIZAR PRODUCTO
      let result;
      if (product) {
        result = await updateProduct(product._id, productData);
      } else {
        result = await createProduct(productData);
      }
      
      console.log('✅ Producto guardado exitosamente con', finalImageUrls.length, 'imágenes');
      
      // Limpiar archivos temporales
      if (!product) {
        uploadedImageFiles.forEach(() => {
          imagePreviews.forEach(previewUrl => {
            if (previewUrl.startsWith('blob:')) {
              URL.revokeObjectURL(previewUrl);
            }
          });
        });
        setUploadedImageFiles([]);
        setImagePreviews([]);
      }
      
      if (onSave && typeof onSave === 'function') {
        onSave(result);
      }
      
    } catch (error) {
      console.error('❌ Error completo guardando producto:', error);
      alert('Error al guardar el producto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar colores
  const toggleColor = (color, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    const newSelected = new Set(selectedColors);
    if (newSelected.has(color)) {
      newSelected.delete(color);
    } else {
      newSelected.add(color);
    }
    setSelectedColors(newSelected);
  };

  const addCustomColor = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (customColor.trim()) {
      const newSelected = new Set(selectedColors);
      newSelected.add(customColor.trim());
      setSelectedColors(newSelected);
      setCustomColor('');
    }
  };

  const removeColor = (colorToRemove, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newSelected = new Set(selectedColors);
    newSelected.delete(colorToRemove);
    setSelectedColors(newSelected);
  };

  // Manejar talles
  const toggleSize = (size, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newSelected = new Set(selectedSizes);
    if (newSelected.has(size)) {
      newSelected.delete(size);
    } else {
      newSelected.add(size);
    }
    setSelectedSizes(newSelected);
  };

  const addCustomSize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (customSize.trim()) {
      const newSelected = new Set(selectedSizes);
      newSelected.add(customSize.trim());
      setSelectedSizes(newSelected);
      setCustomSize('');
    }
  };

  const removeSize = (sizeToRemove, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newSelected = new Set(selectedSizes);
    newSelected.delete(sizeToRemove);
    setSelectedSizes(newSelected);
  };

  // Manejar tags
  const toggleTag = (tag, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tag)) {
      newSelected.delete(tag);
    } else {
      newSelected.add(tag);
    }
    setSelectedTags(newSelected);
  };

  const addCustomTag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (customTag.trim()) {
      const newSelected = new Set(selectedTags);
      newSelected.add(customTag.trim());
      setSelectedTags(newSelected);
      setCustomTag('');
    }
  };

  const removeTag = (tagToRemove, e) => {
    e.preventDefault();
    e.stopPropagation();
    const newSelected = new Set(selectedTags);
    newSelected.delete(tagToRemove);
    setSelectedTags(newSelected);
  };

  // Manejar subida de imágenes
  const handleImageUploaded = async (imageFiles) => {
    if (!imageFiles || imageFiles.length === 0) return;
    
    console.log('📸 Imágenes recibidas desde ImageUpload:', imageFiles.length);
    
    setUploadedImageFiles(prev => [...prev, ...imageFiles]);
    
    const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviewUrls]);
  };

  // Eliminar imagen
  const removeImage = async (imageUrl, index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const isLocalBlob = imageUrl.startsWith('blob:');
    const isServerImage = imageUrl.includes('/uploads/');
    
    if (isLocalBlob) {
      const previewIndex = imagePreviews.indexOf(imageUrl);
      if (previewIndex !== -1) {
        const fileIndex = previewIndex;
        
        const newPreviews = [...imagePreviews];
        const removedPreview = newPreviews.splice(previewIndex, 1)[0];
        setImagePreviews(newPreviews);
        
        if (fileIndex >= 0 && fileIndex < uploadedImageFiles.length) {
          const newFiles = [...uploadedImageFiles];
          newFiles.splice(fileIndex, 1);
          setUploadedImageFiles(newFiles);
          
          URL.revokeObjectURL(removedPreview);
        }
      }
    } 
    else if (isServerImage && product?._id) {
      if (window.confirm('¿Estás seguro de eliminar esta imagen permanentemente?')) {
        try {
          let relativePath = imageUrl;
          if (imageUrl.startsWith(BACKEND_URL)) {
            relativePath = imageUrl.replace(BACKEND_URL, '');
          }
          
          const response = await fetch(`${BACKEND_URL}/api/products/${product._id}/images`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: relativePath })
          });
          
          if (response.ok) {
            const newPreviews = imagePreviews.filter(url => url !== imageUrl);
            setImagePreviews(newPreviews);
            
            const currentImages = formData.images || [];
            const newImages = currentImages.filter(img => img !== relativePath && img !== imageUrl);
            
            setFormData(prev => ({
              ...prev,
              images: newImages
            }));
          }
        } catch (error) {
          console.error('❌ Error eliminando imagen:', error);
          alert('Error eliminando imagen: ' + error.message);
        }
      }
    }
  };

  const isFormValid = () => {
    const hasRequiredFields = (
      formData.name &&
      formData.description &&
      formData.price &&
      formData.sku &&
      formData.category &&
      !isNaN(formData.stock)
    );
    
    const hasImages = product ? true : (uploadedImageFiles.length > 0);
    
    return hasRequiredFields && hasImages;
  };

  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      switch(type) {
        case 'color':
          addCustomColor(e);
          break;
        case 'size':
          addCustomSize(e);
          break;
        case 'tag':
          addCustomTag(e);
          break;
      }
    }
  };

  const renderImage = (imgUrl, index) => {
    const isLocalBlob = imgUrl.startsWith('blob:');
    const isServerImage = imgUrl.includes('/uploads/');
    
    return (
      <div key={index} className="preview-item">
        <img 
          src={imgUrl} 
          alt={`Preview ${index + 1}`} 
          className="preview-thumb" 
          onError={(e) => {
            console.error('❌ Error cargando imagen:', imgUrl);
            e.target.style.display = 'none';
          }}
        />
        <div className="preview-info">
          <small>
            {isLocalBlob ? '📤 Por subir' : '✅ En servidor'}
          </small>
          <button 
            type="button" 
            className="btn-remove-image"
            onClick={(e) => removeImage(imgUrl, index, e)}
            disabled={imageUploading || loading}
            title="Eliminar imagen"
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="product-form">
      <h2 className="form-title">{product ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>

      {/* Información básica */}
      <div className="form-section">
        <h3 className="section-title">📋 Información Básica</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Nombre del producto *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ej: Remera Básica de Algodón"
            />
          </div>
          
          <div className="form-group">
            <label>SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              placeholder="Código único del producto"
            />
            <button 
              type="button" 
              className="btn-generate-sku"
              onClick={() => setFormData(prev => ({ ...prev, sku: generateSKU() }))}
            >
              Generar SKU
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Descripción *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
            placeholder="Describe el producto, materiales, características..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Precio actual *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              placeholder="15990"
            />
          </div>

          <div className="form-group">
            <label>Precio comparación (opcional)</label>
            <input
              type="number"
              name="comparePrice"
              value={formData.comparePrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="19990"
            />
            <small className="helper-text">Para mostrar descuento</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Categoría *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Seleccionar categoría</option>
              <option value="novedades">Novedades</option>
              <option value="outlet">Outlet</option>
              <option value="abrigos">Abrigos</option>
              <option value="ropadeportiva">RopaDeportiva</option>
              <option value="calzados">Calzados</option>
              <option value="jeans">Jeans</option>
              <option value="remeras">Remeras</option>
              <option value="vestidos">Vestidos</option>
              <option value="bodys">Bodys</option>
              <option value="ropainterior">RopaInterior</option>
              <option value="accesorios">Accesorios</option>
              <option value="fiesta">Fiesta</option>
              <option value="ventasalpormayor">Venta Sal por Mayor</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Stock disponible *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
              placeholder="25"
            />
          </div>
        </div>
      </div>

      {/* Selección de Colores */}
      <div className="form-section">
        <h3 className="section-title">🎨 Colores Disponibles</h3>
        <p className="section-subtitle">Haz clic en los colores que tiene este producto</p>
        
        <div className="color-grid">
          {PREDEFINED_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`color-option ${selectedColors.has(color) ? 'selected' : ''}`}
              onClick={(e) => toggleColor(color, e)}
              title={color}
            >
              <span className="color-dot" style={{ 
                backgroundColor: getColorHex(color),
                border: color === 'Blanco' ? '1px solid #ddd' : 'none'
              }}></span>
              <span className="color-name">{color}</span>
            </button>
          ))}
        </div>

        <div className="custom-input">
          <input
            type="text"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, 'color')}
            placeholder="Agregar color personalizado..."
          />
          <button type="button" onClick={addCustomColor} className="btn-add-custom">
            Agregar
          </button>
        </div>

        {selectedColors.size > 0 && (
          <div className="selected-items">
            <p className="selected-label">Colores seleccionados ({selectedColors.size}):</p>
            <div className="items-chips">
              {Array.from(selectedColors).map((color) => (
                <div key={color} className="item-chip">
                  <span className="item-dot" style={{ backgroundColor: getColorHex(color) }}></span>
                  <span className="item-name">{color}</span>
                  <button 
                    type="button" 
                    className="item-remove"
                    onClick={(e) => removeColor(color, e)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selección de Talles */}
      <div className="form-section">
        <h3 className="section-title">📏 Talles Disponibles</h3>
        <p className="section-subtitle">Selecciona el tipo de talle y haz clic en los disponibles</p>
        
        <div className="size-type-selector">
          <label>Tipo de talle:</label>
          <div className="size-type-buttons">
            {Object.keys(PREDEFINED_SIZES).map((type) => (
              <button
                key={type}
                type="button"
                className={`size-type-btn ${formData.sizeType === type ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, sizeType: type }))}
              >
                {type === 'ropa' ? 'Ropa (XS-XXL)' : 
                 type === 'calzado' ? 'Calzado (35-45)' : 
                 type === 'jean' ? 'Jean (28-40)' : 'Único'}
              </button>
            ))}
          </div>
        </div>

        <div className="size-grid">
          {PREDEFINED_SIZES[formData.sizeType]?.map((size) => (
            <button
              key={size}
              type="button"
              className={`size-option ${selectedSizes.has(size) ? 'selected' : ''}`}
              onClick={(e) => toggleSize(size, e)}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="custom-input">
          <input
            type="text"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, 'size')}
            placeholder="Agregar talle personalizado..."
          />
          <button type="button" onClick={addCustomSize} className="btn-add-custom">
            Agregar
          </button>
        </div>

        {selectedSizes.size > 0 && (
          <div className="selected-items">
            <p className="selected-label">Talles seleccionados ({selectedSizes.size}):</p>
            <div className="items-chips">
              {Array.from(selectedSizes).map((size) => (
                <div key={size} className="item-chip">
                  <span className="item-name">{size}</span>
                  <button 
                    type="button" 
                    className="item-remove"
                    onClick={(e) => removeSize(size, e)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Etiquetas */}
      <div className="form-section">
        <h3 className="section-title">🏷️ Etiquetas</h3>
        <p className="section-subtitle">Selecciona etiquetas para facilitar la búsqueda</p>
        
        <div className="tags-grid">
          {PREDEFINED_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag-option ${selectedTags.has(tag) ? 'selected' : ''}`}
              onClick={(e) => toggleTag(tag, e)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="custom-input">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, 'tag')}
            placeholder="Agregar etiqueta personalizada..."
          />
          <button type="button" onClick={addCustomTag} className="btn-add-custom">
            Agregar
          </button>
        </div>

        {selectedTags.size > 0 && (
          <div className="selected-items">
            <p className="selected-label">Etiquetas seleccionadas ({selectedTags.size}):</p>
            <div className="items-chips">
              {Array.from(selectedTags).map((tag) => (
                <div key={tag} className="item-chip">
                  <span className="item-name">{tag}</span>
                  <button 
                    type="button" 
                    className="item-remove"
                    onClick={(e) => removeTag(tag, e)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sección de imágenes */}
      <div className="form-section">
        <h3 className="section-title">🖼️ Imágenes del Producto</h3>
        
        <div className="image-status">
          {!product && uploadedImageFiles.length === 0 && (
            <div className="alert alert-warning">
              ⚠️ <strong>Importante:</strong> Sube al menos una imagen antes de crear el producto.
            </div>
          )}
          
          {!product && uploadedImageFiles.length > 0 && (
            <div className="alert alert-success">
              ✅ <strong>Listo:</strong> {uploadedImageFiles.length} imagen(es) lista(s) para subir.
            </div>
          )}
          
          {product && (
            <div className="alert alert-info">
              ℹ️ <strong>Editando:</strong> {formData.images?.length || 0} imagen(es) existentes.
            </div>
          )}
        </div>
        
        <ImageUpload
          productId={product?._id}
          existingImages={product?.images}
          onImageUpload={handleImageUploaded}
          isCreating={!product}
          multiple={true}
        />
        
        {imageUploading && (
          <div className="uploading-status">
            ⏳ Subiendo imágenes al servidor... Por favor espera.
          </div>
        )}
        
        {imagePreviews.length > 0 && (
          <div className="uploaded-images-preview">
            <p className="images-count">
              {product ? '📸 Imágenes del producto:' : '📤 Imágenes por subir:'} {imagePreviews.length}
            </p>
            <div className="images-grid">
              {imagePreviews.map((imgUrl, index) => renderImage(imgUrl, index))}
            </div>
          </div>
        )}
        
        <div className="image-counter">
          <small>
            {product ? 
              `Total de imágenes en producto: ${formData.images?.length || 0}` :
              `Imágenes listas para subir: ${uploadedImageFiles.length}`
            }
          </small>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <span className="checkbox-text">Producto destacado (aparecerá en la página principal)</span>
          </label>
        </div>
      </div>

      {/* Botones */}
      <div className="form-actions">
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn btn-secondary"
          disabled={loading || imageUploading}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || imageUploading || !isFormValid()}
        >
          {loading ? '⏳ Guardando...' : 
           imageUploading ? '📤 Subiendo imágenes...' : 
           (product ? 'Actualizar Producto' : 'Crear Producto')}
        </button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <small>
            Estado: {loading ? 'Cargando' : 'Listo'} | 
            Imágenes: {uploadedImageFiles.length} | 
            Previews: {imagePreviews.length}
          </small>
        </div>
      )}
    </form>
  );
}

// Función auxiliar para convertir nombres de colores a hex
function getColorHex(colorName) {
  const colorMap = {
    'Negro': '#000000',
    'Blanco': '#FFFFFF',
    'Gris': '#808080',
    'Azul Marino': '#000080',
    'Azul Claro': '#87CEEB',
    'Rojo': '#FF0000',
    'Verde': '#008000',
    'Amarillo': '#FFFF00',
    'Rosa': '#FFC0CB',
    'Beige': '#F5F5DC',
    'Marrón': '#A52A2A',
    'Naranja': '#FFA500',
    'Violeta': '#EE82EE',
    'Celeste': '#87CEEB',
    'Turquesa': '#40E0D0',
    'Bordó': '#800000'
  };
  return colorMap[colorName] || '#CCCCCC';
}

export default ProductForm;