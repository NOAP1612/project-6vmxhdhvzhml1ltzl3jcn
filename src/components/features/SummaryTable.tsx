import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, Loader2, Sparkles } from "lucide-react";
import { useSummaryTable } from "@/hooks/useSummaryTable";
import { FileUpload } from "./FileUpload";
import { ConceptsManager } from "./ConceptsManager";
import { SummaryTableDisplay } from "./SummaryTableDisplay";

export function SummaryTable() {
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
          <FileUpload
            fileName={fileName}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onClearFile={handleClearFile}
          />

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

          <ConceptsManager
            concepts={concepts}
            onAddConcept={addConcept}
            onRemoveConcept={removeConcept}
            onUpdateConcept={updateConcept}
          />

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

      {summaryData && <SummaryTableDisplay summaryData={summaryData} />}
    </div>
  );
}