import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSummaryTable } from "@/functions";

interface SummaryItem {
  concept: string;
  definition: string;
  explanation: string;
  example?: string;
}

interface SummaryData {
  title: string;
  summary: SummaryItem[];
}

export function SummaryTable() {
  const [topic, setTopic] = useState('');
  const [concepts, setConcepts] = useState<string[]>(['']);
  const [language, setLanguage] = useState('hebrew');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const { toast } = useToast();

  const addConcept = () => {
    setConcepts([...concepts, '']);
  };

  const removeConcept = (index: number) => {
    if (concepts.length > 1) {
      setConcepts(concepts.filter((_, i) => i !== index));
    }
  };

  const updateConcept = (index: number, value: string) => {
    const newConcepts = [...concepts];
    newConcepts[index] = value;
    setConcepts(newConcepts);
  };

  const handleGenerate = async () => {
    const validConcepts = concepts.filter(c => c.trim());
    
    if (!topic.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן נושא לטבלה",
        variant: "destructive",
      });
      return;
    }

    if (validConcepts.length === 0) {
      toast({
        title: "שגיאה",
        description: "אנא הזן לפחות מושג אחד",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateSummaryTable({
        topic,
        concepts: validConcepts,
        language
      });

      if (result.summary) {
        setSummaryData(result);
        toast({
          title: "הצלחה!",
          description: `נוצרה טבלת סיכום עם ${result.summary.length} מושגים`,
        });
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת הטבלה. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <Table className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">טבלת סיכום</h1>
          <p className="text-gray-600">קבל טבלה מסודרת עם הסברים לכל מושג</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הגדרות הטבלה</CardTitle>
          <CardDescription>
            הזן את הנושא והמושגים לטבלת הסיכום
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="topic">נושא הטבלה</Label>
              <Input
                id="topic"
                placeholder="לדוגמה: מערכת העיכול"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">שפה</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hebrew">עברית</SelectItem>
                  <SelectItem value="english">אנגלית</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>מושגים לטבלה</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addConcept}
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
                    onChange={(e) => updateConcept(index, e.target.value)}
                    className="flex-1"
                  />
                  {concepts.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeConcept(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                יוצר טבלה...
              </>
            ) : (
              <>
                <Table className="w-4 h-4 mr-2" />
                צור טבלת סיכום
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {summaryData && (
        <Card>
          <CardHeader>
            <CardTitle>{summaryData.title}</CardTitle>
            <CardDescription>
              טבלת סיכום עם {summaryData.summary.length} מושגים
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-right p-4 font-semibold text-gray-900 bg-gray-50">מושג</th>
                    <th className="text-right p-4 font-semibold text-gray-900 bg-gray-50">הגדרה</th>
                    <th className="text-right p-4 font-semibold text-gray-900 bg-gray-50">הסבר מפורט</th>
                    <th className="text-right p-4 font-semibold text-gray-900 bg-gray-50">דוגמה</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.summary.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900 align-top">
                        <Badge variant="outline" className="mb-2">
                          {item.concept}
                        </Badge>
                      </td>
                      <td className="p-4 text-gray-800 align-top">
                        {item.definition}
                      </td>
                      <td className="p-4 text-gray-700 align-top leading-relaxed">
                        {item.explanation}
                      </td>
                      <td className="p-4 text-gray-600 align-top">
                        {item.example || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}