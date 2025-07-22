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
    <div className="space-y-2">
      <Label>העלאת קובץ (PDF)</Label>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept=".pdf"
        disabled={isUploading}
      />
      {!fileName ? (
        <Button
          onClick={triggerFileSelect}
          variant="outline"
          className="w-full border-dashed"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {uploadProgress || 'מעלה...'}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              בחר קובץ או גרור לכאן
            </>
          )}
        </Button>
      ) : (
        <div className="flex items-center justify-between w-full p-2 border rounded-md bg-gray-50">
          <div className="flex items-center gap-2">
            <FileIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{fileName}</span>
          </div>
          <Button
            onClick={onClearFile}
            variant="ghost"
            size="icon"
            disabled={isUploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}