import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface ConceptsManagerProps {
  concepts: string[];
  onAddConcept: () => void;
  onRemoveConcept: (index: number) => void;
  onUpdateConcept: (index: number, value: string) => void;
}

export function ConceptsManager({
  concepts,
  onAddConcept,
  onRemoveConcept,
  onUpdateConcept
}: ConceptsManagerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>מושגים לטבלה</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddConcept}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          הוסף מושג
        </Button>
      </div>
      
      <div className="space-y-3">
        {concepts.map((concept, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder={`מושג ${index + 1}`}
              value={concept}
              onChange={(e) => onUpdateConcept(index, e.target.value)}
              className="flex-1"
            />
            {concepts.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onRemoveConcept(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}