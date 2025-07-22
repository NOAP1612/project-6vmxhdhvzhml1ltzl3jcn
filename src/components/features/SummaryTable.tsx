import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, Loader2, Plus, X, Upload, Clock, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSummaryTable } from "@/functions";
import { extractConcepts } from "@/functions";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";
import { useSummaryTable, SummaryData } from '@/context/SummaryTableContext';

export function SummaryTable() {
  const {
    topic, setTopic,
    sourceText, setSourceText,
    concepts, setConcepts,
    language, setLanguage,
    fileName, setFileName,
    uploadProgress, setUploadProgress,
    summaryData, setSummaryData
  } = useSummaryTable();

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtractingConcepts, setIsExtractingConcepts] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const addConcept = () => {
// ... keep existing code
    setConcepts([...concepts, '']);
  };

  const removeConcept = (index: number) => {
// ... keep existing code
    if (concepts.length > 1) {
      setConcepts(concepts.filter((_, i) => i !== index));
    }
  };

  const updateConcept = (index: number, value: string) => {
// ... keep existing code
    const newConcepts = [...concepts];
    newConcepts[index] = value;
    setConcepts(newConcepts);
  };

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
// ... keep existing code
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
// ... keep existing code
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
// ... keep existing code
      toast({
        title: "קובץ לא נתמך",
        description: "אנא העלה קובץ PDF בלבד.",
        variant: "destructive",
      });
      return;
    }

    setFileName(selectedFile.name);
    setIsUploading(true);
    setSourceText('');
    setConcepts(['']);
    setSummaryData(null);
    setUploadProgress('מעלה קובץ...');

    try {
// ... keep existing code
      toast({
        title: "מעלה קובץ...",
        description: "שלב 1 מתוך 2: מעלה את הקובץ לשרת.",
      });

      const { file_url } = await withTimeout(
        uploadFile({ file: selectedFile }), 
        120000
      );

      setUploadProgress('מעבד את הקובץ...');
      toast({
// ... keep existing code
        title: "מעבד את הקובץ...",
        description: "שלב 2 מתוך 2: מחלץ טקסט מהקובץ.",
      });

      const schema = {
// ... keep existing code
        type: "object",
        properties: {
          text_content: {
            type: "string",
            description: "The full text content of the document, preserving original language (Hebrew or English).",
          },
        },
        required: ["text_content"],
      };

      const result = await withTimeout(
// ... keep existing code
        extractDataFromUploadedFile({
          file_url,
          json_schema: schema,
        }),
        300000
      );

      if (result.status === 'success' && result.output && typeof (result.output as any).text_content === 'string') {
// ... keep existing code
        const content = (result.output as { text_content: string }).text_content;
        setSourceText(content);
        setUploadProgress('הושלם בהצלחה!');
        toast({
          title: "הצלחה!",
          description: "הטקסט מהקובץ חולץ בהצלחה. כעת תוכל לחלץ מושגים אוטומטית.",
        });
      } else {
        throw new Error(result.details || "Failed to extract text from PDF.");
      }
    } catch (error) {
// ... keep existing code
      console.error("Error processing file:", error);
      let description = "לא הצלחנו לחלץ את הטקסט מהקובץ. אנא ודא שהקובץ תקין ונסה שוב.";
      
      if (error instanceof Error) {
// ... keep existing code
        if (error.message === 'Request timeout') {
          description = "הבקשה ארכה יותר מדי זמן. אנא נסה שוב עם קובץ קטן יותר.";
        } else if (error.message === 'Failed to fetch') {
          description = "אירעה שגיאת רשת. אנא בדוק את חיבור האינטרנט ונסה שוב.";
        }
      }
      
      toast({
// ... keep existing code
        title: "שגיאה בעיבוד הקובץ",
        description: description,
        variant: "destructive",
      });
      setFileName('');
      setUploadProgress('');
    } finally {
// ... keep existing code
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearFile = () => {
// ... keep existing code
    setFileName('');
    setSourceText('');
    setUploadProgress('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExtractConcepts = async () => {
// ... keep existing code
    const textToAnalyze = sourceText || topic;
    
    if (!textToAnalyze.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן טקסט או העלה קובץ כדי לחלץ מושגים",
        variant: "destructive",
      });
      return;
    }

    if (!topic.trim()) {
// ... keep existing code
      toast({
        title: "שגיאה",
        description: "אנא הזן נושא לטבלה",
        variant: "destructive",
      });
      return;
    }

    setIsExtractingConcepts(true);
    try {
// ... keep existing code
      const result = await extractConcepts({
        text: textToAnalyze,
        topic: topic,
        language: language
      });

      if (result.concepts && Array.isArray(result.concepts)) {
// ... keep existing code
        setConcepts(result.concepts);
        toast({
          title: "הצלחה!",
          description: `חולצו ${result.concepts.length} מושגים מהטקסט`,
        });
      } else {
        throw new Error("לא הצלחנו לחלץ מושגים מהטקסט");
      }
    } catch (error) {
// ... keep existing code
      console.error("Error extracting concepts:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בחילוץ המושגים. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsExtractingConcepts(false);
    }
  };

  const handleGenerate = async () => {
// ... keep existing code
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
// ... keep existing code
      toast({
        title: "שגיאה",
        description: "אנא הזן לפחות מושג אחד",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
// ... keep existing code
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
// ... keep existing code
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
// ... keep existing code
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
            הזן את הנושא והמושגים לטבלת הסיכום, או העלה קובץ PDF לחילוץ מושגים אוטומטי
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>העלאת קובץ PDF (אופציונלי)</Label>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="pdf-upload"
                className={`flex-grow flex items-center justify-center gap-2 cursor-pointer rounded-md border-2 border-dashed p-4 text-center text-gray-500 transition-colors hover:border-green-500 hover:bg-green-50 ${isUploading ? 'cursor-not-allowed bg-gray-100' : 'border-gray-300'}`}
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
                disabled={isUploading}
                ref={fileInputRef}
              />
              {fileName && !isUploading && (
                <Button variant="ghost" size="icon" onClick={handleClearFile} className="shrink-0">
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
            
            {isUploading && (
              <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                    <div className="absolute inset-0 rounded-full border-2 border-green-200 animate-pulse"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-green-800 font-medium">{uploadProgress}</p>
                    <p className="text-green-600 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      אנא המתן, זה עשוי לקחת מספר רגעים...
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-500">תומך בעברית ובאנגלית. לאחר העלאה תוכל לחלץ מושגים אוטומטית.</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">או</span>
            </div>
          </div>

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

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="sourceText">טקסט מקור (אופציונלי - להדבקת טקסט ישירות)</Label>
            <Textarea
              id="sourceText"
              placeholder="הדבק כאן טקסט שממנו תרצה לחלץ מושגים אוטומטית..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="h-32"
              disabled={isUploading}
            />
          </div>

          {(sourceText.trim() || fileName) && topic.trim() && (
            <Button
              onClick={handleExtractConcepts}
              disabled={isExtractingConcepts}
              variant="outline"
              className="w-full border-green-500 text-green-600 hover:bg-green-50"
            >
              {isExtractingConcepts ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  מחלץ מושגים...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  חלץ מושגים אוטומטית מהטקסט
                </>
              )}
            </Button>
          )}

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
