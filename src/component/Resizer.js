import React, { useState, useRef } from 'react';
import './Resizer.css';

const Resizer = () => {
  const [image, setImage] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [customWidth, setCustomWidth] = useState(300);
  const [customHeight, setCustomHeight] = useState(300);
  const [compression, setCompression] = useState(0.8);
  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResize = () => {
    if (image) {
      const canvas = canvasRef.current;
      const img = new Image();

      img.onload = () => {
        if (aspectRatio !== 'custom') {
          const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
          const scale = Math.min(
            customWidth / (img.width * widthRatio),
            customHeight / (img.height * heightRatio)
          );

          canvas.width = img.width * scale * widthRatio;
          canvas.height = img.height * scale * heightRatio;
        } else {
          canvas.width = customWidth;
          canvas.height = customHeight;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = image;
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg', compression);
    link.download = 'resized-image.jpg';
    link.click();
  };

  return (
    <div className="resizer-page">
      <aside className="resizer-sidebar">
        <h2>Upload & Resize</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        
        <h3>Aspect Ratio</h3>
        <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
          <option value="1:1">1:1 (Square)</option>
          <option value="16:9">16:9 (Widescreen)</option>
          <option value="4:3">4:3 (Standard)</option>
          <option value="3:2">3:2</option>
          <option value="21:9">21:9 (Cinematic)</option>
          <option value="custom">Custom</option>
        </select>

        {aspectRatio === 'custom' && (
          <div className="custom-size-inputs">
            <label>
              Width:
              <input type="number" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} />
            </label>
            <label>
              Height:
              <input type="number" value={customHeight} onChange={(e) => setCustomHeight(Number(e.target.value))} />
            </label>
          </div>
        )}

        <h3>Compression</h3>
        <input type="range" min="0.1" max="1" step="0.1" value={compression} onChange={(e) => setCompression(parseFloat(e.target.value))} />
        <span>{compression}</span>

        <button onClick={handleResize} className="resize-button">Resize Image</button>
        <button onClick={handleDownload} className="download-button">Download Image</button>
      </aside>

      <main className="resizer-content">
        <h2>Resized Image</h2>
        <canvas ref={canvasRef} className="resizer-canvas" />
      </main>
    </div>
  );
};

export default Resizer;
