import { useSummaryTable, SummaryItem } from '@/hooks/useSummaryTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Upload, Plus, Trash2, Wand2, X } from 'lucide-react';

export const SummaryTable = () => {
  const {
    topic, setTopic,
    sourceText, setSourceText,
    concepts,
    isLoading,
    isUploading,
    isExtractingConcepts,
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
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">מחולל טבלאות סיכום</h1>
        <p className="text-gray-600 mt-2">ארגן מידע מורכב בטבלאות ברורות ומסודרות.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="topic">נושא הטבלה</Label>
            <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="לדוגמה: מלחמת העולם השנייה" />
          </div>
          <div>
            <Label htmlFor="source-text">טקסט מקור (אופציונלי)</Label>
            <Textarea
              id="source-text"
              placeholder="הדבק טקסט לחילוץ מושגים אוטומטי..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <div className="flex items-center justify-between">
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading || isLoading}>
              <Upload className="ml-2 h-4 w-4" />
              {isUploading ? 'מעלה...' : 'העלה PDF'}
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
            {fileName && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{fileName}</span>
                <Button variant="ghost" size="icon" onClick={handleClearFile} disabled={isUploading || isLoading}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div>
            <Label>מושגים לסיכום</Label>
            <div className="space-y-2">
              {concepts.map((concept, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={concept} onChange={(e) => updateConcept(index, e.target.value)} placeholder={`מושג ${index + 1}`} />
                  <Button variant="outline" size="icon" onClick={() => removeConcept(index)} disabled={concepts.length <= 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <Button variant="outline" onClick={addConcept}>
                <Plus className="ml-2 h-4 w-4" /> הוסף מושג
              </Button>
              <Button onClick={handleExtractConcepts} disabled={isExtractingConcepts || (!sourceText && !topic)}>
                {isExtractingConcepts && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                <Wand2 className="ml-2 h-4 w-4" /> חלץ מושגים אוטומטית
              </Button>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Button onClick={handleGenerate} disabled={isLoading || concepts.every(c => !c.trim()) || !topic} size="lg">
              {isLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
              צור טבלת סיכום
            </Button>
          </div>
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
                  <TableHead>הרחבה</TableHead>
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