export type FileCategory = "generals" | "parents" | "kids";

export type UploadStatus = "waiting" | "ready" | "invalid" | "error";

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
  status: UploadStatus;
  errorMessage?: string;
}

export interface AutomationOption {
  id: string;
  label: string;
  description: string;
  requiredFiles: FileCategory[];
}

export interface ProcessedFile {
  id: string;
  name: string;
  automationType: string;
  timestamp: string;
  downloadUrl: string;
}
