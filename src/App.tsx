import React, { useState, useMemo } from 'react';
import { FileUploadCard } from './components/FileUploadCard';
import { AutomationOptionCard } from './components/AutomationOptionCard';
import { DownloadZone } from './components/DownloadZone';
import { AUTOMATION_OPTIONS, VALID_EXTENSIONS } from './constants';
import { FileCategory, UploadedFile, ProcessedFile } from './types';
import { Play, Loader2, AlertCircle } from 'lucide-react';

type FileState = Record<FileCategory, UploadedFile | null>;

export default function App() {
  const [files, setFiles] = useState<FileState>({
    generals: null,
    parents: null,
    kids: null,
  });

  const [selectedAutomation, setSelectedAutomation] = useState<string>('general');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const activeOption = useMemo(
    () => AUTOMATION_OPTIONS.find(opt => opt.id === selectedAutomation) || AUTOMATION_OPTIONS[0],
    [selectedAutomation]
  );

  const validateFile = (file: File): UploadedFile => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!VALID_EXTENSIONS.includes(ext)) {
      return {
        file,
        name: file.name,
        size: file.size,
        status: 'invalid',
        errorMessage: 'Invalid file type. Need .xlsx, .xls, .xlsm, or .csv',
      };
    }
    
    return {
      file,
      name: file.name,
      size: file.size,
      status: 'ready',
    };
  };

  const handleFileSelect = (category: FileCategory, file: File) => {
    const validated = validateFile(file);
    setFiles(prev => ({ ...prev, [category]: validated }));
    setGlobalError(null);
  };

  const handleFileRemove = (category: FileCategory) => {
    setFiles(prev => ({ ...prev, [category]: null }));
  };

  const requiredFiles = activeOption.requiredFiles;
  
  const missingFiles = requiredFiles.filter(
    cat => !files[cat] || files[cat]?.status !== 'ready'
  );
  
  const canRun = missingFiles.length === 0;

  const handleRunAutomation = async () => {
    if (!canRun) return;
    
    setIsProcessing(true);
    setGlobalError(null);
    setProcessedFiles([]);

    try {
      const formData = new FormData();
      formData.append('automationType', selectedAutomation);
      
      requiredFiles.forEach(cat => {
        if (files[cat]?.file) {
          formData.append(cat, files[cat]!.file);
        }
      });

      const backendUrl = import.meta.env.VITE_PYTHON_BACKEND_URL;
      
      if (backendUrl) {
        // Example integration
        const response = await fetch(`${backendUrl}/api/process`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Server responded with an error');
        }
        
        const data = await response.json();
        // Assume backend returns Array<{ name, downloadUrl }>
        setProcessedFiles(data.files.map((f: any, i: number) => ({
          id: `file-${Date.now()}-${i}`,
          name: f.name || 'Processed_Output.xlsx',
          automationType: activeOption.label,
          timestamp: new Date().toISOString(),
          downloadUrl: f.downloadUrl,
        })));
      } else {
        // Mock processing for environment without backend
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setProcessedFiles([
          {
            id: `file-${Date.now()}`,
            name: `${activeOption.id}_output_${Date.now()}.xlsx`,
            automationType: activeOption.label,
            timestamp: new Date().toISOString(),
            // Mock a download via a blob
            downloadUrl: URL.createObjectURL(new Blob(['mock data'], { type: 'text/csv' }))
          }
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setGlobalError('Something went wrong while processing the files. Please check the uploaded files and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setProcessedFiles([]);
    setGlobalError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-800 underline decoration-blue-500 decoration-2 underline-offset-4">
              NRG Tracking Automation Hub
            </h1>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-slate-200">
              Internal Tool
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Upload tracking files, choose an automation, and download the processed output.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-slate-600 hidden sm:inline">Systems Operational</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-8 flex flex-col gap-8">
        {/* Step 1: Upload */}
        <section aria-label="Upload Zone">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">1</div>
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Upload Files
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FileUploadCard
              title="Generals"
              description="Upload the Generals tracking file."
              file={files.generals}
              onFileSelect={(f) => handleFileSelect('generals', f)}
              onRemove={() => handleFileRemove('generals')}
            />
            <FileUploadCard
              title="Parents"
              description="Upload the Parents tracking file."
              file={files.parents}
              onFileSelect={(f) => handleFileSelect('parents', f)}
              onRemove={() => handleFileRemove('parents')}
            />
            <FileUploadCard
              title="Kids"
              description="Upload the Kids tracking file."
              file={files.kids}
              onFileSelect={(f) => handleFileSelect('kids', f)}
              onRemove={() => handleFileRemove('kids')}
            />
          </div>
        </section>

        {/* Step 2: Automation */}
        <section aria-label="Automation Options">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">2</div>
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Choose Automation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {AUTOMATION_OPTIONS.map(option => (
              <AutomationOptionCard
                key={option.id}
                option={option}
                selected={selectedAutomation === option.id}
                onSelect={() => setSelectedAutomation(option.id)}
              />
            ))}
          </div>
        </section>

        {/* Step 3: Action & Download Zone */}
        <section aria-label="Action and Download Zone" className="flex flex-col flex-1 pb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">3</div>
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Action & Download
            </h2>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row items-stretch p-6 gap-8 min-h-[250px] shadow-sm">
            {/* Left Col - Action */}
            <div className="w-full md:w-1/3 flex flex-col justify-center items-center text-center space-y-4">
              {missingFiles.length > 0 ? (
                <div className="px-3 py-2 bg-amber-50 text-amber-800 rounded flex items-center gap-2 text-xs font-medium self-stretch justify-center border border-amber-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Upload {missingFiles.join(' & ')}
                </div>
              ) : null}

              {globalError && (
                <div className="px-3 py-2 bg-red-50 text-red-800 rounded flex items-center gap-2 text-xs font-medium self-stretch justify-center border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {globalError}
                </div>
              )}

              <button
                onClick={handleRunAutomation}
                disabled={!canRun || isProcessing}
                className={`
                  w-full py-4 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2
                  ${canRun && !isProcessing
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  }
                `}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Run Automation</>
                )}
              </button>
              
              {!isProcessing && canRun && (
                <p className="text-[10px] text-slate-400 font-medium italic">
                  All required files for "{activeOption.label}" are ready.
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-slate-100"></div>
            <div className="block md:hidden h-px w-full bg-slate-100"></div>

            {/* Right Col - Download Zone */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <DownloadZone files={processedFiles} onReset={handleReset} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 px-6 py-4 flex justify-between items-center text-slate-400 text-[10px] font-medium mt-auto">
        <div className="flex flex-wrap gap-4 sm:gap-6 uppercase tracking-wider">
          <span>Version 1.2.0</span>
          <span>NRG Tracking Operations</span>
          <span>Confidential</span>
        </div>
        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer transition-colors">User Guide</span>
          <span className="hover:text-white cursor-pointer transition-colors">Support</span>
        </div>
      </footer>
    </div>
  );
}
