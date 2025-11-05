// src/components/ProductForm/ProductForm.jsx
import { useState } from 'react';
import ImageUpload from '../ImageUpload/ImageUpload';
import { useProducts } from '../../context/ProductContext';
import './ProductForm.css';

function ProductForm({ product, onSave, onCancel }) {
  const { createProduct, updateProduct, uploadProductImage } = useProducts();
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    stock: product?.stock || '',
    featured: product?.featured || false
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('=== 🚨 DEBUG MANUAL EXTREMO 🚨 ===');
    console.log('📝 Datos del formulario:', formData);
    console.log('🖼️ Imágenes para subir:', uploadedImages);
    console.log('📊 Número de imágenes:', uploadedImages.length);
    
    try {
      // Preparar datos finales
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        featured: formData.featured === true || formData.featured === 'true',
        images: uploadedImages
      };

      console.log('📦 Datos finales para enviar:', productData);

      let result;
      if (product) {
        // ✅ MODO EDICIÓN
        console.log('🔄 Actualizando producto existente...');
        result = await updateProduct(product._id, productData);
      } else {
        // ✅ MODO CREACIÓN
        console.log('🔄 Creando nuevo producto...');
        result = await createProduct(productData);
      }

      console.log('✅ Operación completada');
      
      // SOLO UNA LLAMADA - pasar el resultado a onSave si existe
      if (onSave && typeof onSave === 'function') {
        onSave(result);
      }
      
    } catch (error) {
      console.error('❌ Error en submit:', error);
      alert('Error: ' + error.message);
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

  // ✅ Manejar imagen subida - PARA CREACIÓN
  const handleImageUploaded = (imageData) => {
    console.log('🔄 ProductForm - Imagen recibida:', imageData);
    
    if (imageData && imageData.length > 0 && imageData[0] instanceof File) {
      console.log('📁 Es File object?: true');
      console.log('✅ Imagen lista para crear producto:', imageData[0]);
      
      // imageData es un array de Files directamente
      setUploadedImages(imageData);
      console.log('📊 Total imágenes listas:', imageData.length);
    } else {
      console.log('❌ No se recibieron imágenes válidas');
      console.log('📁 Tipo recibido:', typeof imageData);
      console.log('📁 Es array?:', Array.isArray(imageData));
      if (imageData && imageData[0]) {
        console.log('📁 Primer elemento:', imageData[0]);
        console.log('📁 Es File?:', imageData[0] instanceof File);
      }
    }
  };

  // ✅ Manejar imagen subida - PARA EDICIÓN
  const handleImageUpload = async (productId, formData) => {
    try {
      const result = await uploadProductImage(productId, formData);
      return result;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-row">
        <div className="form-group">
          <label>Nombre del producto</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Precio</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Categoría</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Seleccionar categoría</option>
            <option value="novedades">Novedades</option>
            <option value="outlet">Outlet</option>
            <option value="mayorista">Mayorista</option>
            <option value="feriantes">Feriantes</option>
            <option value="calzados">Calzados</option>
            <option value="bodys">Bodys</option>
            <option value="ventasalpormayor">Venta Sal por Mayor</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          Producto destacado
        </label>
      </div>

      {/* ImageUpload SIEMPRE visible */}
      <div className="image-upload-section">
        <label>Imagen del producto</label>
        <ImageUpload
          productId={product?._id}
          existingImage={product?.image || product?.images?.[0]}
          onImageUpload={product ? handleImageUpload : handleImageUploaded}
          isCreating={!product}
        />
        
        {/* DEBUG TEMPORAL */}
        <div style={{
          background: '#e7f3ff', 
          padding: '10px', 
          margin: '10px 0', 
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          <strong>🔧 DEBUG ProductForm:</strong><br/>
          - Modo: {product ? 'EDICIÓN' : 'CREACIÓN'}<br/>
          - Imágenes listas: {uploadedImages.length}<br/>
          - Product ID: {product?._id || 'NUEVO'}<br/>
          - Loading: {loading ? '✅ SÍ' : '❌ NO'}
        </div>

        {/* Mostrar imágenes subidas en creación */}
        {!product && uploadedImages.length > 0 && (
          <div className="uploaded-images-preview">
            <p>✅ Imágenes listas para guardar: {uploadedImages.length}</p>
            <div className="images-grid">
              {uploadedImages.map((img, index) => (
                <div key={index} className="preview-item">
                  <img 
                    src={URL.createObjectURL(img)} 
                    alt={`Preview ${index}`} 
                    className="preview-thumb" 
                  />
                  <small>{img.name}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? '⏳ Procesando...' : (product ? 'Actualizar' : 'Crear') + ' Producto'}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;