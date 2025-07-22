import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, Loader2 } from "lucide-react";

interface FileUploadProps {
  isUploading: boolean;
  fileName: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearFile: () => void;
  uploadProgress: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const FileUpload = ({
  isUploading,
  fileName,
  handleFileChange,
  handleClearFile,
  uploadProgress,
  fileInputRef,
}: FileUploadProps) => {
  const isProcessing = isUploading && uploadProgress.includes('מעבד');
  const uploadPercentage = isUploading ? (isProcessing ? 50 : 25) : 0;

  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload">העלה קובץ PDF</Label>
      {fileName ? (
        <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span className="flex-grow text-sm text-gray-700 truncate">{fileName}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearFile}
            disabled={isUploading}
            className="w-6 h-6"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <Input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            בחר קובץ
          </Button>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{uploadProgress}</span>
          </div>
          <Progress value={uploadPercentage} className="w-full h-2" />
        </div>
      )}
    </div>
  );
};