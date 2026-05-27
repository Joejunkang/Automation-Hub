import { Download, FileSpreadsheet, ArrowRight } from 'lucide-react';
import React from 'react';
import { ProcessedFile } from '../types';

interface DownloadZoneProps {
  files: ProcessedFile[];
  onReset: () => void;
}

export function DownloadZone({ files, onReset }: DownloadZoneProps) {
  if (files.length === 0) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center text-slate-400 h-full py-8">
        <svg className="w-10 h-10 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h5 className="text-sm font-bold text-slate-500">No processed file yet</h5>
        <p className="text-xs text-slate-400 mt-1">Upload required files and click "Run Automation".</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col h-full bg-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h5 className="text-sm font-bold text-slate-800">Processed files ready</h5>
          <p className="text-[11px] text-slate-500">Success!</p>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 underline flex items-center gap-1 focus:outline-none"
        >
          Run another
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-blue-50 border border-blue-100 text-blue-600 rounded-md flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-grow">
                <p className="text-[11px] font-bold text-slate-700 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide truncate">
                  {file.automationType}
                </p>
              </div>
            </div>
            
            <a
              href={file.downloadUrl}
              download={file.name}
              className="ml-3 flex items-center gap-1.5 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 px-3 py-1.5 rounded-md text-[11px] font-bold shadow-sm shrink-0 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
