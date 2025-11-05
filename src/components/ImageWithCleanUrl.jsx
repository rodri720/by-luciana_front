import { useState } from 'react'

function ImageWithCleanUrl({ src, alt, className, ...props }) {
  const [imageSrc, setImageSrc] = useState('')

  // Limpiar URL cuando el componente se monta
  useState(() => {
    if (!src) return
    
    let cleanUrl = src
    // Eliminar duplicados de /uploads/
    cleanUrl = cleanUrl.replace(/\/uploads\/\/uploads\//g, '/uploads/')
    // Eliminar dobles barras
    cleanUrl = cleanUrl.replace(/([^:]\/)\/+/g, '$1')
    
    // Si no empieza con http, construir URL completa
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `http://localhost:5000/uploads/${cleanUrl}`
    }
    
    console.log('🔄 URL limpiada:', { original: src, limpia: cleanUrl })
    setImageSrc(cleanUrl)
  }, [src])

  if (!imageSrc) {
    return (
      <div 
        className={`${className} image-placeholder`}
        style={{ 
          backgroundColor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#999'
        }}
      >
        Cargando...
      </div>
    )
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className}
      onError={(e) => {
        console.error('❌ No se pudo cargar:', imageSrc)
        e.target.style.display = 'none'
      }}
      {...props}
    />
  )
}

export default ImageWithCleanUrl