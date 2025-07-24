import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const svgRef = useRef(null);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!isValidUrl(input)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      setUrl('');
      return;
    }
    setError('');
    setUrl(input);
  };

  const handleDownload = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const urlBlob = URL.createObjectURL(svgBlob);
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(urlBlob);
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qr-code.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    img.src = urlBlob;
  };

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>QR Code Generator</h1>
      <form onSubmit={handleGenerate} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Enter URL here"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ padding: 8, width: 300, fontSize: 16 }}
        />
        <button type="submit" style={{ marginLeft: 10, padding: '8px 16px', fontSize: 16 }}>
          Generate
        </button>
      </form>
      {error && <div style={{ color: '#ff4d4f', marginBottom: 16 }}>{error}</div>}
      {url && (
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="qr-container">
            <QRCodeSVG value={url} size={256} ref={svgRef} />
          </div>
          <button onClick={handleDownload} style={{ marginTop: 16, padding: '8px 16px', fontSize: 16 }}>
            Download as PNG
          </button>
          <p style={{ marginTop: 10 }}>{url}</p>
        </div>
      )}
    </div>
  );
}

export default App;
