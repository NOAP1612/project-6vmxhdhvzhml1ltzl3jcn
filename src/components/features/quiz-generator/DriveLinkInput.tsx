import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Link, Clock } from "lucide-react";

interface DriveLinkInputProps {
  driveLink: string;
  setDriveLink: (value: string) => void;
  handleDriveLinkProcess: () => void;
  isProcessingDrive: boolean;
  isUploading: boolean;
}

export const DriveLinkInput = ({
  driveLink,
  setDriveLink,
  handleDriveLinkProcess,
  isProcessingDrive,
  isUploading,
}: DriveLinkInputProps) => {
  return (
    <div className="space-y-2">
      <Label>קישור לקובץ בגוגל דרייב (אופציונלי)</Label>
      <div className="flex items-center gap-2">
        <Input
          placeholder="הדבק כאן קישור לקובץ PDF בגוגל דרייב"
          value={driveLink}
          onChange={(e) => setDriveLink(e.target.value)}
          disabled={isProcessingDrive || isUploading}
          className="flex-grow"
        />
        <Button
          onClick={handleDriveLinkProcess}
          disabled={isProcessingDrive || isUploading || !driveLink.trim()}
          variant="outline"
          className="shrink-0"
        >
          {isProcessingDrive ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Link className="w-4 h-4" />
          )}
        </Button>
      </div>

      {isProcessingDrive && (
        <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              <div className="absolute inset-0 rounded-full border-2 border-green-200 animate-pulse"></div>
            </div>
            <div className="text-center">
              <p className="text-green-800 font-medium">מעבד קישור דרייב...</p>
              <p className="text-green-600 text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                אנא המתן, זה עשוי לקחת מספר רגעים...
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        הדבק קישור לקובץ PDF בגוגל דרייב. ודא שהקובץ נגיש לצפייה ציבורית.
      </p>
    </div>
  );
};