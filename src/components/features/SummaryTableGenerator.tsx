import { useSummaryTable } from '@/hooks/useSummaryTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileUp, X, Plus, Trash2, Wand2, Sparkles } from 'lucide-react';

export const SummaryTableGenerator = () => {
  const {
    topic, setTopic,
    sourceText, setSourceText,
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
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">מחולל טבלאות סיכום</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="topic">נושא הטבלה</Label>
            <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="לדוגמה: מושגים בכלכלה" />
          </div>
          <div>
            <Label htmlFor="source-text">טקסט מקור (אופציונלי)</Label>
            <Textarea
              id="source-text"
              placeholder="הדבק כאן טקסט לחילוץ מושגים אוטומטי"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              rows={6}
              disabled={isUploading || !!fileName}
            />
          </div>
          <div className="flex items-center justify-between">
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading || !!sourceText} variant="outline">
              <FileUp className="ml-2 h-4 w-4" />
              העלה קובץ PDF
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
            {isUploading && <div className="text-sm text-gray-500 flex items-center"><Loader2 className="animate-spin ml-2" /> {uploadProgress}</div>}
            {fileName && !isUploading && (
              <div className="text-sm text-gray-500 flex items-center">
                <span>{fileName}</span>
                <Button variant="ghost" size="sm" onClick={handleClearFile}><X className="h-4 w-4" /></Button>
              </div>
            )}
          </div>
          <div>
            <Label>מושגים לסיכום</Label>
            <div className="space-y-2">
              {concepts.map((concept, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={concept} onChange={(e) => updateConcept(index, e.target.value)} placeholder={`מושג ${index + 1}`} />
                  <Button variant="ghost" size="icon" onClick={() => removeConcept(index)} disabled={concepts.length <= 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addConcept} className="mt-2">
              <Plus className="ml-2 h-4 w-4" />
              הוסף מושג
            </Button>
            <Button onClick={handleExtractConcepts} disabled={isExtractingConcepts || (!sourceText && !topic)} className="mt-2 mr-2">
              {isExtractingConcepts ? <Loader2 className="animate-spin ml-2" /> : <Sparkles className="ml-2 h-4 w-4" />}
              חלץ מושגים אוטומטית
            </Button>
          </div>
          <div>
            <Label htmlFor="language">שפת הטבלה</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="w-[180px]">
                <SelectValue placeholder="בחר שפה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hebrew">עברית</SelectItem>
                <SelectItem value="english">אנגלית</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin ml-2" /> : <Wand2 className="ml-2 h-4 w-4" />}
            צור טבלה
          </Button>
        </CardContent>
      </Card>

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
                    <TableCell>{item.example || 'N/A'}</TableCell>
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