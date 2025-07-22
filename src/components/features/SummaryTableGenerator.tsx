import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useSummaryTable } from "@/hooks/useSummaryTable";
import { Loader2, Plus, Trash2, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./FileUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SummaryTableGenerator() {
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

    const loadingState = isUploading || isLoading || isExtractingConcepts;

    if (summaryData) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto">
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
                                    {summaryData.summary.some(item => item.example) && <TableHead>דוגמה</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summaryData.summary.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.concept}</TableCell>
                                        <TableCell>{item.definition}</TableCell>
                                        <TableCell>{item.explanation}</TableCell>
                                        {summaryData.summary.some(s => s.example) && <TableCell>{item.example}</TableCell>}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Button onClick={() => window.location.reload()}>התחל מחדש</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">מחולל טבלאות סיכום</h1>
                <p className="text-lg text-gray-600 mt-2">צור טבלאות סיכום מותאמות אישית מטקסט או מקבצים.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>שלב 1: נושא וטקסט מקור</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="topic">נושא הטבלה</Label>
                        <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="לדוגמה: מושגים בכלכלה" />
                    </div>
                    <FileUpload
                        fileName={fileName}
                        isUploading={isUploading}
                        uploadProgress={uploadProgress}
                        fileInputRef={fileInputRef}
                        onFileChange={handleFileChange}
                        onClearFile={handleClearFile}
                    />
                    <Textarea
                        placeholder="או הדבק כאן את הטקסט שלך..."
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        className="h-32"
                        disabled={!!fileName}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>שלב 2: מושגים</CardTitle>
                    <CardDescription>הזן מושגים ידנית או חלץ אותם אוטומטית מהטקסט.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={handleExtractConcepts} disabled={!sourceText.trim() || !topic.trim() || loadingState}>
                        {isExtractingConcepts ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                        חלץ מושגים אוטומטית
                    </Button>
                    {concepts.map((concept, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                value={concept}
                                onChange={(e) => updateConcept(index, e.target.value)}
                                placeholder={`מושג ${index + 1}`}
                            />
                            <Button variant="ghost" size="icon" onClick={() => removeConcept(index)} disabled={concepts.length <= 1}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={addConcept}>
                        <Plus className="w-4 h-4 mr-2" />
                        הוסף מושג
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>שלב 3: הגדרות ויצירה</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="language">שפת הטבלה</Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger id="language">
                                <SelectValue placeholder="בחר שפה" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hebrew">עברית</SelectItem>
                                <SelectItem value="english">אנגלית</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleGenerate} disabled={loadingState || !topic.trim() || concepts.every(c => !c.trim())} className="w-full">
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        צור טבלת סיכום
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}