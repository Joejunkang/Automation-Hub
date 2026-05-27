import { Upload, X, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { UploadedFile } from '../types';
import { cn, formatBytes } from '../utils';

interface FileUploadCardProps {
  title: string;
  description: string;
  acceptedText?: string;
  file: UploadedFile | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

export function FileUploadCard({
  title,
  description,
  acceptedText,
  file,
  onFileSelect,
  onRemove,
}: FileUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderStatus = () => {
    if (!file) {
      return (
        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase">Waiting</span>
      );
    }
    if (file.status === 'invalid' || file.status === 'error') {
      return (
        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase max-w-[120px] truncate" title={file.errorMessage}>
          Error
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Ready</span>
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 h-full">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{description}</p>
      </div>

      {/* Main Dropzone / File Area */}
      <div
        onClick={() => !file && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "rounded-lg py-5 flex flex-col items-center justify-center gap-2 transition-colors relative flex-1 min-h-[110px]",
          !file ? (
            isDragging 
              ? "border-2 border-dashed border-blue-400 bg-blue-50/50 cursor-pointer" 
              : "border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100"
          ) : (
            file.status === 'ready' 
              ? "border-2 border-dashed border-blue-100 bg-blue-50/40"
              : "border-2 border-dashed border-red-100 bg-red-50/40"
          )
        )}
      >
        {!file ? (
          <>
            <p className="text-[11px] text-slate-400 font-medium">Drag & drop or browse</p>
            {renderStatus()}
          </>
        ) : (
          <>
            <p className={cn(
              "text-[11px] font-bold text-center px-4 w-full truncate",
              file.status === 'ready' ? "text-blue-600" : "text-red-600"
            )}>
              {file.name}
            </p>
            {renderStatus()}
          </>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-1 self-start">
        {!file ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 underline focus:outline-none"
          >
            Browse Files
          </button>
        ) : (
          <div className="flex gap-4 items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 underline focus:outline-none"
            >
              Replace File
            </button>
            <button
              onClick={onRemove}
              className="text-[11px] font-semibold text-red-400 hover:text-red-600 underline focus:outline-none"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".xlsx,.xls,.xlsm,.csv"
        onChange={handleChange}
      />
    </div>
  );
}
