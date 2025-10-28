// src/components/ImageUpload/ImageUpload.jsx
import { useState } from 'react';
import './ImageUpload.css';

function ImageUpload({ onImageUpload, existingImage, productId, isCreating }) {
  const [preview, setPreview] = useState(existingImage || '');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setMessage('❌ Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('❌ La imagen no debe superar los 5MB');
      return;
    }

    // Crear preview inmediato
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Subir archivo usando FormData
    setUploading(true);
    setMessage('');

    try {
      console.log('📤 ImageUpload - Archivo seleccionado:', file.name, file);

      if (isCreating) {
        // ✅ CORREGIDO: Enviar directamente el array con el File
        console.log('✅ ImageUpload - Enviando File para creación:', file);
        
        // Enviar array con el file directamente
        onImageUpload([file]);
        
        setMessage('✅ Imagen lista para crear producto');
      } else {
        // Para edición: subir al servidor
        const formData = new FormData();
        formData.append('image', file);
        await onImageUpload(productId, formData);
        setMessage('✅ Imagen subida correctamente');
      }

      // Limpiar input
      event.target.value = '';

    } catch (error) {
      console.error('❌ Error subiendo imagen:', error);
      setMessage('❌ Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    document.getElementById(`file-${productId || 'new'}`).click();
  };

  return (
    <div className="image-upload">
      <div className="upload-header">
        <h4>Subir Imagen</h4>
        {isCreating && (
          <span className="creating-badge">Modo Creación</span>
        )}
      </div>

      <div className="image-preview-container">
        <div className="image-preview" onClick={triggerFileInput}>
          {preview ? (
            <img src={preview} alt="Preview" className="preview-image" />
          ) : (
            <div className="placeholder">
              <div className="placeholder-icon">📷</div>
              <p>Haz clic para seleccionar una imagen</p>
              <small>Formatos: JPEG, PNG, WebP, GIF (max. 5MB)</small>
            </div>
          )}
        </div>
        
        {preview && (
          <button 
            type="button"
            className="change-image-btn"
            onClick={triggerFileInput}
            disabled={uploading}
          >
            🔄 Cambiar imagen
          </button>
        )}
      </div>
      
      <div className="upload-controls">
        <input
          type="file"
          id={`file-${productId || 'new'}`}
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="file-input"
        />
        
        {!preview && (
          <button 
            onClick={triggerFileInput}
            disabled={uploading}
            className={`upload-btn ${uploading ? 'uploading' : ''}`}
          >
            {uploading ? '📤 Subiendo...' : '📷 Seleccionar imagen'}
          </button>
        )}
      </div>

      {message && (
        <div className={`message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar"></div>
          <span>Procesando imagen...</span>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;