// src/components/ProductList/ProductList.jsx
import { useProducts } from '../../context/ProductContext';

function ProductList({ onEditProduct }) {
  const { products, deleteProduct, loading } = useProducts();

  const handleDelete = async (productId) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        alert('🗑️ Producto eliminado');
      } catch (error) {
        alert('❌ Error eliminando producto');
      }
    }
  };

  if (loading) {
    return <div className="loading">⏳ Cargando productos...</div>;
  }

  return (
    <div className="product-list">
      <div className="section-header">
        <h2>📦 Gestión de Productos ({products.length})</h2>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">📦</div>
          <h3>No hay productos</h3>
          <p>Crea tu primer producto para comenzar</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <div className="image-placeholder">📷</div>
                <div className="product-category-badge">{product.category}</div>
                {product.featured && <div className="featured-badge">⭐</div>}
              </div>
              
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                <div className="product-details">
                  <span className="price">${product.price?.toLocaleString()}</span>
                  <span className="stock">Stock: {product.stock}</span>
                </div>
              </div>

              <div className="product-actions">
                <button 
                  className="edit-btn"
                  onClick={() => onEditProduct(product)}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(product._id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;