import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

interface ConceptsManagerProps {
  concepts: string[];
  onAddConcept: () => void;
  onRemoveConcept: (index: number) => void;
  onUpdateConcept: (index: number, value: string) => void;
}

export function ConceptsManager({ concepts, onAddConcept, onRemoveConcept, onUpdateConcept }: ConceptsManagerProps) {
  return (
    <div className="space-y-4">
      <Label>מושגים לטבלה</Label>
      {concepts.map((concept, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder={`מושג ${index + 1}`}
            value={concept}
            onChange={(e) => onUpdateConcept(index, e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemoveConcept(index)}
            disabled={concepts.length === 1}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={onAddConcept}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        הוסף מושג
      </Button>
    </div>
  );
}