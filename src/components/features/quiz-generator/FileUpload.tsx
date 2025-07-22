import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, Clock } from "lucide-react";

interface FileUploadProps {
  fileName: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearFile: () => void;
  isUploading: boolean;
  isProcessingDrive: boolean;
  uploadProgress: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  driveLink: string;
}

export const FileUpload = ({
  fileName,
  handleFileChange,
  handleClearFile,
  isUploading,
  isProcessingDrive,
  uploadProgress,
  fileInputRef,
  driveLink,
}: FileUploadProps) => {
  return (
    <div className="space-y-2">
      <Label>העלאת קובץ PDF (אופציונלי)</Label>
      <div className="flex items-center gap-2">
        <Label
          htmlFor="pdf-upload"
          className={`flex-grow flex items-center justify-center gap-2 cursor-pointer rounded-md border-2 border-dashed p-4 text-center text-gray-500 transition-colors hover:border-blue-500 hover:bg-blue-50 ${
            isUploading || isProcessingDrive ? 'cursor-not-allowed bg-gray-100' : 'border-gray-300'
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{uploadProgress}</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>{fileName || 'לחץ לבחירת קובץ PDF'}</span>
            </>
          )}
        </Label>
        <Input
          id="pdf-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="application/pdf"
          disabled={isUploading || isProcessingDrive}
          ref={fileInputRef}
        />
        {(fileName || driveLink) && !isUploading && !isProcessingDrive && (
          <Button variant="ghost" size="icon" onClick={handleClearFile} className="shrink-0">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {isUploading && (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-pulse"></div>
            </div>
            <div className="text-center">
              <p className="text-blue-800 font-medium">{uploadProgress}</p>
              <p className="text-blue-600 text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                אנא המתן, זה עשוי לקחת מספר רגעים...
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">אין מגבלת עמודים. תומך בעברית ובאנגלית.</p>
    </div>
  );
};