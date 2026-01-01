import React, { useRef, useState } from 'react';
import { UploadIcon } from './Icons';

interface UploadAreaProps {
  onImageSelected: (base64: string) => void;
  selectedImage: string | null;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageSelected, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelected(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full">
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full h-64 rounded-2xl border-2 border-dashed 
          flex flex-col items-center justify-center cursor-pointer transition-all duration-300
          overflow-hidden group
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-slate-600 hover:border-indigo-400 bg-slate-800/50 hover:bg-slate-800'
          }
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange} 
        />
        
        {selectedImage ? (
          <img 
            src={selectedImage} 
            alt="Upload Preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center p-6 text-center">
            <div className={`
              p-4 rounded-full bg-slate-700/50 mb-4 transition-transform duration-300
              group-hover:scale-110 group-hover:bg-indigo-500/20
            `}>
              <UploadIcon />
            </div>
            <p className="text-lg font-semibold text-slate-200">
              Upload your photo
            </p>
            <p className="text-sm text-slate-400 mt-2 max-w-xs">
              Drag & drop or click to browse. Best results with a clear front-facing portrait.
            </p>
          </div>
        )}

        {selectedImage && (
           <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium bg-slate-900/60 px-3 py-1 rounded-full backdrop-blur-sm">
                Click to change photo
              </span>
           </div>
        )}
      </div>
    </div>
  );
};

export default UploadArea;