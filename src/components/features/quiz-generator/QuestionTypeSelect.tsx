import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuestionTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const QuestionTypeSelect = ({ value, onChange, disabled }: QuestionTypeSelectProps) => (
  <div className="space-y-2">
    <Label htmlFor="questionType">סוג השאלות</Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id="questionType">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="multiple">שאלות אמריקאיות</SelectItem>
        <SelectItem value="open">שאלות פתוחות</SelectItem>
        <SelectItem value="mixed">מעורב</SelectItem>
      </SelectContent>
    </Select>
  </div>
);