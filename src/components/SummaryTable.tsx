import React from 'react';
import { useSummaryTable } from '@/hooks/useSummaryTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Upload, X, Wand2, Plus, Trash2 } from 'lucide-react';

export const SummaryTable = () => {
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
    <div className="p-4 md:p-6 max-w-4xl mx-auto" dir="rtl">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">מחולל טבלאות סיכום</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="topic">נושא הטבלה</Label>
              <Input id="topic" placeholder="לדוגמה: מבוא לבינה מלאכותית" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
            
            <div className="grid gap-2">
              <Label>מקור מידע (אופציונלי)</Label>
              <Textarea
                placeholder="הדבק כאן טקסט או העלה קובץ PDF כדי לחלץ מושגים אוטומטית"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="w-full p-2 border rounded"
                rows={5}
              />
              <div className="flex items-center gap-2">
                <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  <Upload className="ml-2 h-4 w-4" />
                  {isUploading ? 'מעלה...' : 'העלה PDF'}
                </Button>
                <Input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
                {fileName && (
                  <div className="flex items-center gap-2 text-sm">
                    <span>{fileName}</span>
                    <Button variant="ghost" size="icon" onClick={handleClearFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {isUploading && <p className="text-sm text-blue-600">{uploadProgress}</p>}
            </div>

            <div className="grid gap-2">
              <Label>מושגים לסיכום</Label>
              {concepts.map((concept, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`מושג ${index + 1}`}
                    value={concept}
                    onChange={(e) => updateConcept(index, e.target.value)}
                  />
                  <Button variant="outline" size="icon" onClick={() => removeConcept(index)} disabled={concepts.length <= 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={addConcept}>
                  <Plus className="ml-2 h-4 w-4" />
                  הוסף מושג
                </Button>
                <Button onClick={handleExtractConcepts} disabled={isExtractingConcepts || (!sourceText && !topic)}>
                  {isExtractingConcepts ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Wand2 className="ml-2 h-4 w-4" />}
                  חלץ מושגים אוטומטית
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="language">שפת הסיכום</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר שפה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hebrew">עברית</SelectItem>
                  <SelectItem value="english">אנגלית</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} disabled={isLoading || concepts.every(c => !c.trim()) || !topic}>
              {isLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Wand2 className="ml-2 h-4 w-4" />}
              {isLoading ? 'יוצר טבלה...' : 'צור טבלת סיכום'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {summaryData && (
        <Card className="mt-6">
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