import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NumQuestionsSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const NumQuestionsSelect = ({ value, onChange, disabled }: NumQuestionsSelectProps) => (
  <div className="space-y-2">
    <Label htmlFor="numQuestions">מספר שאלות</Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id="numQuestions">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="3">3 שאלות</SelectItem>
        <SelectItem value="5">5 שאלות</SelectItem>
        <SelectItem value="10">10 שאלות</SelectItem>
        <SelectItem value="15">15 שאלות</SelectItem>
        <SelectItem value="20">20 שאלות</SelectItem>
      </SelectContent>
    </Select>
  </div>
);