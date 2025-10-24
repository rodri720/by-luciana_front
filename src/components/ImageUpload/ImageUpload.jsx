// src/components/ImageUpload/ImageUpload.jsx
import { useState } from 'react';
import './ImageUpload.css';

function ImageUpload({ onImageUpload, existingImage, productId }) {
  const [preview, setPreview] = useState(existingImage || '');
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Crear preview inmediato
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Subir archivo
    setUploading(true);
    try {
      await onImageUpload(productId, file);
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <div className="image-preview">
        {preview ? (
          <img src={preview} alt="Preview" className="preview-image" />
        ) : (
          <div className="placeholder">📷 Sin imagen</div>
        )}
      </div>
      
      <div className="upload-controls">
        <input
          type="file"
          id={`file-${productId}`}
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="file-input"
        />
        <label 
          htmlFor={`file-${productId}`} 
          className={`upload-btn ${uploading ? 'uploading' : ''}`}
        >
          {uploading ? '📤 Subiendo...' : '📷 Subir imagen'}
        </label>
      </div>
    </div>
  );
}

export default ImageUpload;