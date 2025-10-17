// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    featured: false,
    stock: '0'
  });

  useEffect(() => {
    setLoading(true);
    const sampleProducts = [
      {
        _id: '1',
        name: 'Vestido Floral',
        description: 'Hermoso vestido con estampado floral',
        price: 29900,
        category: 'novedades',
        stock: 10,
        featured: true
      },
      {
        _id: '2',
        name: 'Zapatos de Tacón',
        description: 'Zapatos elegantes para ocasiones especiales',
        price: 19900,
        category: 'calzados',
        stock: 5,
        featured: false
      }
    ];
    setProducts(sampleProducts);
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newProduct = {
        _id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? newProduct : p));
      } else {
        setProducts(prev => [...prev, newProduct]);
      }

      resetForm();
      setLoading(false);
    }, 1000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      featured: false,
      stock: '0'
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      featured: product.featured,
      stock: product.stock.toString()
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p._id !== productId));
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Panel de Administración - By Luciana</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Nuevo Producto
        </button>
      </header>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>{editingProduct ? 'Editar' : 'Crear'} Producto</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio:</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categoría:</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="novedades">Novedades</option>
                    <option value="oulet">Outlet</option>
                    <option value="mayorista">Mayorista</option>
                    <option value="accesorios">Accesorios</option>
                    <option value="calzados">Calzados</option>
                    <option value="bodys">Bodys</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock:</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                    />
                    Destacado
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit">
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" onClick={resetForm}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-section">
        <h2>Productos ({products.length})</h2>
        
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <div className="image-placeholder">📷</div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="category">{product.category}</p>
                  <p className="price">${product.price}</p>
                  <p className="stock">Stock: {product.stock}</p>
                  {product.featured && <span className="badge">Destacado</span>}
                </div>
                <div className="product-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Editar
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;