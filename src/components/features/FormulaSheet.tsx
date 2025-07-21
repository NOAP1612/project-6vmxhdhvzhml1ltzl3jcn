import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Loader2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateFormulaSheet } from "@/functions";

interface Formula {
  name: string;
  formula: string;
  description: string;
  variables: string;
  example?: string;
}

interface FormulaCategory {
  name: string;
  formulas: Formula[];
}

interface FormulaSheetData {
  title: string;
  categories: FormulaCategory[];
}

export function FormulaSheet() {
  const [subject, setSubject] = useState('');
  const [language, setLanguage] = useState('hebrew');
  const [isLoading, setIsLoading] = useState(false);
  const [formulaData, setFormulaData] = useState<FormulaSheetData | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!subject.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן תחום לימוד",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateFormulaSheet({
        subject,
        language
      });

      if (result.categories) {
        setFormulaData(result);
        toast({
          title: "הצלחה!",
          description: `נוצר דף נוסחאות עם ${result.categories.length} קטגוריות`,
        });
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת דף הנוסחאות. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subjectOptions = [
    { value: 'mathematics', label: 'מתמטיקה' },
    { value: 'physics', label: 'פיזיקה' },
    { value: 'chemistry', label: 'כימיה' },
    { value: 'statistics', label: 'סטטיסטיקה' },
    { value: 'geometry', label: 'גיאומטריה' },
    { value: 'algebra', label: 'אלגברה' },
    { value: 'calculus', label: 'חשבון אינפיניטסימלי' },
    { value: 'economics', label: 'כלכלה' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">דף נוסחאות</h1>
          <p className="text-gray-600">דף נוסחאות מסודר ומעוצב לכל תחום לימוד</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הגדרות דף הנוסחאות</CardTitle>
          <CardDescription>
            בחר את תחום הלימוד ליצירת דף נוסחאות מותאם
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="subject">תחום לימוד</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תחום לימוד" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <div className="space-y-2">
            <Label htmlFor="customSubject">או הזן תחום מותאם אישית</Label>
            <Input
              id="customSubject"
              placeholder="לדוגמה: תרמודינמיקה"
              value={subject.includes('custom:') ? subject.replace('custom:', '') : ''}
              onChange={(e) => setSubject(`custom:${e.target.value}`)}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                יוצר דף נוסחאות...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                צור דף נוסחאות
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {formulaData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {formulaData.title}
            </CardTitle>
            <CardDescription>
              דף נוסחאות מסודר עם {formulaData.categories.length} קטגוריות
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {formulaData.categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-teal-200">
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                      {category.name}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4">
                    {category.formulas.map((formula, formulaIndex) => (
                      <Card key={formulaIndex} className="border-r-4 border-r-teal-500">
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {formula.name}
                            </h4>
                            
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-lg text-center">
                              {formula.formula}
                            </div>
                            
                            <p className="text-gray-700 leading-relaxed">
                              {formula.description}
                            </p>
                            
                            {formula.variables && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <h5 className="font-medium text-gray-900 mb-1">משתנים:</h5>
                                <p className="text-sm text-gray-700">{formula.variables}</p>
                              </div>
                            )}
                            
                            {formula.example && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <h5 className="font-medium text-gray-900 mb-1">דוגמה:</h5>
                                <p className="text-sm text-gray-700">{formula.example}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}