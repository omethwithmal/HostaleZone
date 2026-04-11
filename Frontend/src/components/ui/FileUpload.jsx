import React, { useRef, useState } from 'react';
import { UploadCloudIcon, XIcon, FileIcon } from 'lucide-react';

const MAX_FILE_SIZE_MB = 4;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function FileUpload({ onFileSelect, error }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [localError, setLocalError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleFile = (file) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setLocalError(`File is too large. Please upload a file under ${MAX_FILE_SIZE_MB}MB.`);
      setSelectedFile(null);
      setPreviewUrl(null);
      onFileSelect(null);

      if (inputRef.current) {
        inputRef.current.value = '';
      }

      return;
    }

    setLocalError('');
    setSelectedFile(file);
    onFileSelect(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result || null);
      };
      reader.readAsDataURL(file);
      return;
    }

    setPreviewUrl(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  const handleChange = (event) => {
    event.preventDefault();

    if (event.target.files && event.target.files[0]) {
      handleFile(event.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setLocalError('');
    onFileSelect(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-slate-300 bg-slate-50 hover:border-slate-400'
          } ${error ? 'border-red-500 bg-red-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*,.pdf"
            onChange={handleChange}
          />
          <UploadCloudIcon
            className={`mx-auto mb-4 h-10 w-10 ${error ? 'text-red-400' : 'text-slate-400'}`}
          />
          <p className="mb-1 text-sm font-medium text-slate-700">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-500">
            SVG, PNG, JPG or PDF (max. {MAX_FILE_SIZE_MB}MB)
          </p>
        </div>
      ) : (
        <div className="relative flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {previewUrl ? (
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
              <FileIcon className="h-8 w-8 text-slate-400" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <button
            type="button"
            onClick={removeFile}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {(error || localError) && (
        <p className="mt-2 text-sm text-red-600">{error || localError}</p>
      )}
    </div>
  );
}

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
