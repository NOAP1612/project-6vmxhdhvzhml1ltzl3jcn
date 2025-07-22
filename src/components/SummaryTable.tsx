import { useSummaryTable } from '@/hooks/useSummaryTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, FileText, X, Wand2, Plus, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SummaryTable = () => {
  const {
    topic, setTopic,
    concepts,
    language, setLanguage,
    isLoading,
    isUploading,
    isExtractingConcepts,
    uploadProgress,
    fileName,
    summaryData,
    fileInputRef,
    addConcept,
    removeConcept,
    updateConcept,
    handleFileChange,
    handleClearFile,
    handleExtractConcepts,
    handleGenerate,
  } = useSummaryTable();

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">יצירת טבלאות סיכום</h1>
        <p className="text-lg text-gray-600 mt-2">סכם טקסטים ארוכים ומורכבים לטבלאות ברורות ותמציתיות.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>1. הגדרות סיכום</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="נושא הטבלה (לדוגמה: 'מושגי יסוד בכלכלה')"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} variant="outline">
              <Upload className="ml-2 h-4 w-4" />
              העלה קובץ מקור (אופציונלי)
            </Button>
            {fileName && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                <FileText className="h-5 w-5 text-gray-500" />
                <span>{fileName}</span>
                <Button onClick={handleClearFile} variant="ghost" size="icon" className="h-6 w-6">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {isUploading && (
            <div className="flex items-center text-sm text-blue-600">
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              <span>{uploadProgress}</span>
            </div>
          )}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="בחר שפה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hebrew">עברית</SelectItem>
              <SelectItem value="english">אנגלית</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. מושגים לסיכום</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleExtractConcepts} disabled={isExtractingConcepts || !fileName}>
            {isExtractingConcepts ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Wand2 className="ml-2 h-4 w-4" />}
            חילוץ מושגים אוטומטי מהקובץ
          </Button>
          <div className="space-y-2">
            {concepts.map((concept, index) => (
              <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Input
                  placeholder={`מושג ${index + 1}`}
                  value={concept}
                  onChange={(e) => updateConcept(index, e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => removeConcept(index)} disabled={concepts.length <= 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={addConcept}>
            <Plus className="ml-2 h-4 w-4" />
            הוסף מושג
          </Button>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={handleGenerate} disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              יוצר טבלה...
            </>
          ) : (
            <>
              <Wand2 className="ml-2 h-5 w-5" />
              צור טבלת סיכום
            </>
          )}
        </Button>
      </div>

      {summaryData && (
        <Card>
          <CardHeader>
            <CardTitle>{summaryData.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>מושג</TableHead>
                  <TableHead>הגדרה</TableHead>
                  <TableHead>הסבר</TableHead>
                  <TableHead>דוגמה</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaryData.summary.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.concept}</TableCell>
                    <TableCell>{item.definition}</TableCell>
                    <TableCell>{item.explanation}</TableCell>
                    <TableCell>{item.example}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};