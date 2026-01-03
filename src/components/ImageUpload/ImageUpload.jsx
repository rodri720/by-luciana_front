// src/components/ImageUpload/ImageUpload.jsx - VERSIÓN CORREGIDA
import { useState, useRef } from 'react';
import './ImageUpload.css';

function ImageUpload({ onImageUpload, existingImages = [], productId, isCreating, multiple = false }) {
  const [previews, setPreviews] = useState(existingImages || []);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    // Validar archivos
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setMessage('❌ Solo se permiten archivos de imagen');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ La imagen no debe superar los 5MB');
        return;
      }
    }

    // Crear previews inmediatos
    const newPreviews = [];
    for (const file of files) {
      const reader = new FileReader();
      const previewPromise = new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
      newPreviews.push(await previewPromise);
    }

    // Agregar a las previews existentes
    setPreviews(prev => [...prev, ...newPreviews]);
    
    setUploading(true);
    setMessage('');

    try {
      console.log('📤 ImageUpload - Archivos seleccionados:', files.length);

      if (isCreating) {
        // ✅ CORREGIDO: Enviar los files directamente sin subir
        console.log('✅ ImageUpload - Enviando Files para creación:', files);
        
        if (onImageUpload) {
          onImageUpload(files);
        }
        
        setMessage(`✅ ${files.length} imagen(es) lista(s) para crear producto`);
      } else {
        // Para edición: intentar subir al servidor si hay endpoint
        if (productId) {
          setMessage('⚠️ Modo edición: Las imágenes se subirán al guardar el producto');
        }
      }

      // Limpiar input
      event.target.value = '';

    } catch (error) {
      console.error('❌ Error procesando imágenes:', error);
      setMessage('❌ Error al procesar imágenes');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    fileInputRef.current?.click();
  };

  const removePreview = (index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setPreviews(prev => prev.filter((_, i) => i !== index));
    
    // Notificar al padre si hay imágenes eliminadas (solo para edición)
    if (!isCreating && onImageUpload) {
      onImageUpload([]); // Enviar array vacío para indicar eliminación
    }
    
    setMessage(`🗑️ Imagen ${index + 1} eliminada`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };

  return (
    <div className="image-upload">
      <div className="upload-header">
        <h4>{multiple ? 'Subir Imágenes' : 'Subir Imagen'}</h4>
        {isCreating && (
          <span className="creating-badge">Modo Creación</span>
        )}
        {multiple && (
          <span className="multiple-badge">Múltiple</span>
        )}
      </div>

      <div 
        className="image-preview-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {previews.length > 0 ? (
          <div className="previews-grid">
            {previews.map((preview, index) => (
              <div key={index} className="preview-item">
                <img src={preview} alt={`Preview ${index + 1}`} className="preview-image" />
                <button 
                  type="button"
                  className="remove-preview-btn"
                  onClick={(e) => removePreview(index, e)}
                  title="Eliminar imagen"
                >
                  ×
                </button>
                <div className="preview-number">{index + 1}</div>
              </div>
            ))}
            
            {multiple && (
              <div className="add-more-container" onClick={triggerFileInput}>
                <div className="add-more-icon">+</div>
                <p>Agregar más</p>
              </div>
            )}
          </div>
        ) : (
          <div className="image-preview" onClick={triggerFileInput}>
            <div className="placeholder">
              <div className="placeholder-icon">📷</div>
              <p>Haz clic o arrastra imágenes aquí</p>
              <small>
                {multiple ? 'Puedes seleccionar múltiples imágenes' : 'Selecciona una imagen'}
                <br />
                Formatos: JPEG, PNG, WebP, GIF (max. 5MB)
              </small>
            </div>
          </div>
        )}
      </div>
      
      <div className="upload-controls">
        <input
          ref={fileInputRef}
          type="file"
          id={`file-${productId || 'new'}`}
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="file-input"
          multiple={multiple}
        />
        
        <div className="upload-buttons">
          {!isCreating && previews.length > 0 && (
            <button 
              type="button"
              onClick={triggerFileInput}
              disabled={uploading}
              className="upload-btn add-more-btn"
            >
              ➕ Agregar más
            </button>
          )}
          
          {previews.length === 0 && (
            <button 
              type="button"
              onClick={triggerFileInput}
              disabled={uploading}
              className={`upload-btn ${uploading ? 'uploading' : ''}`}
            >
              {uploading ? '📤 Procesando...' : '📷 Seleccionar imagen(es)'}
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('❌') ? 'error' : message.includes('⚠️') ? 'warning' : 'success'}`}>
          {message}
        </div>
      )}

      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar"></div>
          <span>Procesando imagen(es)...</span>
        </div>
      )}
      
      {/* Información para el usuario */}
      <div className="upload-info">
        <p><strong>📝 Instrucciones:</strong></p>
        <ul>
          <li>{isCreating ? '✅ Las imágenes se guardarán al crear el producto' : '✅ Las imágenes se subirán inmediatamente'}</li>
          <li>🖼️ {multiple ? 'Puedes seleccionar varias imágenes a la vez' : 'Solo una imagen por producto'}</li>
          <li>🗑️ Haz clic en la × para eliminar una imagen</li>
          <li>📁 También puedes arrastrar y soltar imágenes</li>
        </ul>
      </div>
    </div>
  );
}

export default ImageUpload;