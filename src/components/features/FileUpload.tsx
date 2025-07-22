import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, File as FileIcon, X, Loader2 } from "lucide-react";

interface FileUploadProps {
  fileName: string;
  isUploading: boolean;
  uploadProgress: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
}

export function FileUpload({
  fileName,
  isUploading,
  uploadProgress,
  fileInputRef,
  onFileChange,
  onClearFile,
}: FileUploadProps) {
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="space-y-2 relative">
      <Label>העלאת קובץ (PDF)</Label>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept=".pdf"
        disabled={isUploading}
      />
      
      {/* Loading Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg border-2 border-dashed border-blue-300">
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-blue-200 rounded-full animate-pulse"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">{uploadProgress || 'מעלה קובץ...'}</p>
              <p className="text-sm text-gray-500">אנא המתן, זה עשוי לקחת מספר רגעים...</p>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {!fileName ? (
        <Button
          onClick={triggerFileSelect}
          variant="outline"
          className="w-full border-dashed border-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 h-24"
          disabled={isUploading}
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <div className="text-center">
              <p className="font-medium">בחר קובץ או גרור לכאן</p>
              <p className="text-xs text-gray-500">PDF עד 50MB</p>
            </div>
          </div>
        </Button>
      ) : (
        <div className="flex items-center justify-between w-full p-4 border-2 rounded-lg bg-green-50 border-green-200 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <FileIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <span className="text-sm font-medium text-green-800">{fileName}</span>
              <p className="text-xs text-green-600">קובץ נטען בהצלחה</p>
            </div>
          </div>
          <Button
            onClick={onClearFile}
            variant="ghost"
            size="icon"
            disabled={isUploading}
            className="hover:bg-red-100 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}