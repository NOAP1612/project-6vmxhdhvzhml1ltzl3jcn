import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const LanguageSelect = ({ value, onChange, disabled }: LanguageSelectProps) => (
  <div className="space-y-2">
    <Label htmlFor="language">שפה</Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id="language">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="hebrew">עברית</SelectItem>
        <SelectItem value="english">אנגלית</SelectItem>
      </SelectContent>
    </Select>
  </div>
);