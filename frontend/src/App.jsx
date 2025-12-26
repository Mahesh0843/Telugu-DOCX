import React, { useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/convert';

const statusSteps = [
  { key: 'ready', label: 'Ready', detail: 'Upload a PDF or image to get started.' },
  { key: 'uploading', label: 'Uploading', detail: 'Sending your file securely to the server.' },
  { key: 'processing', label: 'Converting', detail: 'Extracting text, translating, and generating DOCX.' },
  { key: 'downloading', label: 'Downloading', detail: 'Fetching your translated document.' },
];

function App() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState('ready');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const inputRef = useRef(null);

  const pickFile = () => inputRef.current?.click();

  const onFileChange = (e) => {
    const nextFile = e.target.files?.[0];
    if (!nextFile) return;
    setFile(nextFile);
    setMessage(`${nextFile.name} selected`);
    setError('');
    setStep('ready');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (['dragenter', 'dragover'].includes(e.type)) setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setMessage(`${droppedFile.name} selected`);
      setError('');
      setStep('ready');
    }
  };

  const filenameFromDisposition = (header) => {
    if (!header) return null;
    const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(header);
    return decodeURIComponent(match?.[1] || match?.[2] || '');
  };

  const convert = async () => {
    if (!file || isBusy) return;
    setError('');
    setMessage('');
    setIsBusy(true);
    setStep('uploading');

    try {
      const form = new FormData();
      form.append('file', file);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || payload.message || 'Conversion failed');
      }

      setStep('processing');
      const disposition = response.headers.get('Content-Disposition');
      const suggestedName = filenameFromDisposition(disposition) || 'translated.docx';

      setStep('downloading');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = suggestedName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setMessage('Download started. Check your downloads folder.');
      setStep('ready');
    } catch (err) {
      setError(err.message);
      setStep('ready');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="bg-shape" aria-hidden="true" />
      <header className="hero">
        <p className="eyebrow">Telugu Translator</p>
        <h1>
          Convert PDFs or images into polished <span>Telugu DOCX</span> in a click.
        </h1>
        <p className="lede">
          Upload a PDF or image. We extract the English text, translate with context, and hand you a Word
          document automatically.
        </p>
      </header>

      <main className="card" onDragEnter={handleDrag}>
        <div className={`dropzone ${dragActive ? 'active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
          <input
            ref={inputRef}
            id="file-input"
            type="file"
            accept="application/pdf,image/*"
            onChange={onFileChange}
            hidden
          />
          <div className="drop-content">
            <div className="icon-circle">
              <span role="img" aria-label="sparkles">✨</span>
            </div>
            <p className="drop-title">Drop a PDF or image</p>
            <p className="drop-sub">JPG, PNG, or PDF up to 25 MB</p>
            <div className="actions">
              <button className="ghost" type="button" onClick={pickFile}>
                Upload PDF or Image
              </button>
              <button
                className="primary"
                type="button"
                onClick={convert}
                disabled={!file || isBusy}
              >
                {isBusy ? 'Working…' : 'Convert and Download'}
              </button>
            </div>
            {file ? <p className="file-pill">{file.name}</p> : <p className="file-pill muted">No file chosen yet</p>}
          </div>
          {dragActive && <div className="drag-overlay">Drop to upload</div>}
        </div>

        <section className="status">
          {statusSteps.map((s) => {
            const idx = statusSteps.findIndex((stepItem) => stepItem.key === step);
            const activeIdx = statusSteps.findIndex((stepItem) => stepItem.key === s.key);
            const isDone = idx > activeIdx || step === 'ready' && s.key === 'ready';
            const isActive = s.key === step && step !== 'ready';
            return (
              <div key={s.key} className={`status-item ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                <div className="bullet" />
                <div>
                  <p className="status-label">{s.label}</p>
                  <p className="status-detail">{s.detail}</p>
                </div>
              </div>
            );
          })}
        </section>

        {message && <p className="alert success">{message}</p>}
        {error && <p className="alert error">{error}</p>}

        <footer className="footnotes">
  {/* <p>Files are sent to your own backend at {API_URL}. Output is downloaded automatically.</p> */}
  <p>Keep this tab open until the download prompt appears.</p>

  {/* 👇 Add this line */}
  <p className="made-with-love" style={{ fontSize: '18px', fontWeight: 'bold', fontStyle: 'italic' }}>
    Made by Mahesh
  </p>
</footer>

      </main>
    </div>
  );
}

export default App;
