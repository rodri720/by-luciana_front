import { useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import './CategoryPage.css'

function CategoryPage() {
  const { categoryName } = useParams()
  const { products, loading } = useProducts()
  const { addToCart } = useCart()
  const [addingProduct, setAddingProduct] = useState(null)

  // Filtrar productos por categoría
  const categoryProducts = products.filter(product => 
    product.category === categoryName
  )

  // Mapeo de nombres de categoría a títulos display
  const categoryTitles = {
    'oulet': 'Oulet - Productos en Oferta',
    'novedades': 'Novedades', 
    'mayorista': 'Mayorista',
    'feriantes': 'Feriantes',
    'calzados': 'Calzados',
    'bodys': 'Bodys',
    'accesorios': 'Accesorios'
  }

  const displayTitle = categoryTitles[categoryName] || categoryName

  // Función para agregar al carrito
  const handleAddToCart = async (productId, productName) => {
    setAddingProduct(productId)
    const result = await addToCart(productId, 1, 'M', 'Único')
    
    if (result.success) {
      alert(`¡${productName} agregado al carrito!`)
    } else {
      alert(`Error: ${result.message}`)
    }
    setAddingProduct(null)
  }

  if (loading) {
    return (
      <div className="category-page">
        <div className="loading">Cargando productos...</div>
      </div>
    )
  }

  return (
    <div className="category-page">
      {/* Header de la categoría */}
      <div className="category-header">
        <h1>{displayTitle}</h1>
        <p>Descubre todos nuestros productos de {displayTitle.toLowerCase()}</p>
      </div>

      {/* Grid de productos */}
      <div className="products-grid">
        {categoryProducts.length > 0 ? (
          categoryProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {/* Aquí iría la imagen del producto */}
                <div className="image-placeholder">
                  {product.name.charAt(0)}
                </div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
                <p className="product-stock">{product.stock} disponibles</p>
                
                {/* Tallas y colores disponibles */}
                {product.sizes && product.sizes.length > 0 && (
                  <p className="product-sizes">
                    Tallas: {product.sizes.join(', ')}
                  </p>
                )}
                
                {product.colors && product.colors.length > 0 && (
                  <p className="product-colors">
                    Colores: {product.colors.join(', ')}
                  </p>
                )}

                <button 
                  className="btn-add-to-cart"
                  onClick={() => handleAddToCart(product._id, product.name)}
                  disabled={addingProduct === product._id || product.stock === 0}
                >
                  {addingProduct === product._id 
                    ? 'Agregando...' 
                    : product.stock === 0 
                      ? 'Sin Stock' 
                      : '🛒 Agregar al Carrito'
                  }
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <h3>No hay productos en esta categoría</h3>
            <p>Pronto agregaremos más productos</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage