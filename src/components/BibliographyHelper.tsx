import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { formatBilingualBibliography } from "@/functions";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FileText, Copy, X } from 'lucide-react';

export const BibliographyHelper = () => {
  const [sourceText, setSourceText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bibliography, setBibliography] = useState('');
  const [style, setStyle] = useState('APA');
  const [language, setLanguage] = useState('he');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.type.startsWith('text/')) {
      toast({
        title: "קובץ לא נתמך",
        description: "אנא העלה קובץ PDF או טקסט בלבד.",
        variant: "destructive",
      });
      return;
    }

    setFileName(selectedFile.name);
    setIsUploading(true);
    setSourceText('');
    setBibliography('');

    try {
      const { file_url } = await uploadFile({ file: selectedFile });
      const schema = {
        type: "object",
        properties: { text_content: { type: "string" } },
        required: ["text_content"],
      };
      const result = await extractDataFromUploadedFile({ file_url, json_schema: schema });

      if (result.status === 'success' && result.output && typeof (result.output as any).text_content === 'string') {
        setSourceText((result.output as { text_content: string }).text_content);
        toast({
          title: "הצלחה!",
          description: "הטקסט מהקובץ חולץ בהצלחה.",
        });
      } else {
        throw new Error(result.details || "Failed to extract text from file.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "שגיאה בעיבוד הקובץ",
        description: "לא הצלחנו לחלץ את הטקסט מהקובץ.",
        variant: "destructive",
      });
      setFileName('');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerateBibliography = async () => {
    if (!sourceText.trim()) {
      toast({ title: "שגיאה", description: "אנא הזן טקסט או העלה קובץ.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setBibliography('');
    try {
      const result = await formatBilingualBibliography({
        text: sourceText,
        style,
        language,
      });
      if (result.bibliography) {
        setBibliography(result.bibliography);
        toast({ title: "הצלחה!", description: "הביבליוגרפיה עומדה בהצלחה." });
      } else {
        throw new Error("Failed to format bibliography.");
      }
    } catch (error) {
      console.error("Error formatting bibliography:", error);
      toast({ title: "שגיאה", description: "לא ניתן היה לעמד את הביבליוגרפיה.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bibliography);
    toast({ title: "הצלחה", description: "הטקסט הועתק ללוח." });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">עורך ביבליוגרפיה דו-לשוני</CardTitle>
        <CardDescription className="text-center">הדבק טקסט, העלה קובץ, ובחר סגנון ושפה כדי לעצב את הביבליוגרפיה שלך.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="source-text">הדבק טקסט או העלה קובץ</Label>
          <Textarea
            id="source-text"
            placeholder="הדבק כאן את הטקסט המכיל את רשימת המקורות..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            rows={10}
            className="bg-white"
          />
        </div>
        <div className="flex items-center justify-center">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {isUploading ? 'מעלה...' : 'העלה קובץ (PDF/TXT)'}
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.txt" />
        </div>
        {fileName && (
          <div className="flex items-center justify-center bg-gray-100 p-2 rounded-md text-sm">
            <FileText className="h-4 w-4 mr-2 text-gray-600" />
            <span>{fileName}</span>
            <Button variant="ghost" size="sm" onClick={() => { setFileName(''); setSourceText(''); }} className="mr-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="style-select">סגנון ציטוט</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="style-select">
                <SelectValue placeholder="בחר סגנון" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APA">APA</SelectItem>
                <SelectItem value="MLA">MLA</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language-select">שפת פלט</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language-select">
                <SelectValue placeholder="בחר שפה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="he">עברית</SelectItem>
                <SelectItem value="en">אנגלית</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleGenerateBibliography} disabled={isLoading || isUploading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'מעבד...' : 'צור ביבליוגרפיה'}
        </Button>
        {bibliography && (
          <div className="space-y-2 pt-4">
            <Label>תוצאה</Label>
            <div className="relative">
              <Textarea value={bibliography} readOnly rows={10} className="bg-gray-50 pr-10" />
              <Button variant="ghost" size="icon" className="absolute top-2 left-2" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-500 text-center w-full">הכלי משתמש ב-AI כדי לזהות ולעצב את הרשימה הביבליוגרפית מהטקסט שסופק.</p>
      </CardFooter>
    </Card>
  );
};