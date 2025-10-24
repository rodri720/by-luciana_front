// src/components/ProductForm/ProductForm.jsx
import { useState } from 'react';
import ImageUpload from '../ImageUpload/ImageUpload';
import { useProducts } from '../../context/ProductContext';
import './ProductForm.css';

function ProductForm({ product, onSave, onCancel }) {
  const { uploadProductImage } = useProducts();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    stock: product?.stock || '',
    featured: product?.featured || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Categoría</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">Seleccionar categoría</option>
            <option value="novedades">Novedades</option>
            <option value="outlet">Outlet</option>
            <option value="mayorista">Mayorista</option>
            <option value="accesorios">Accesorios</option>
            <option value="calzados">Calzados</option>
            <option value="bodys">Bodys</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
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

      {/* Componente de upload de imagen */}
      {product && (
        <div className="image-upload-section">
          <label>Imagen del producto</label>
          <ImageUpload
            productId={product._id}
            existingImage={product.image}
            onImageUpload={uploadProductImage}
          />
        </div>
      )}

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {product ? 'Actualizar' : 'Crear'} Producto
        </button>
      </div>
    </form>
  );
}

export default ProductForm;