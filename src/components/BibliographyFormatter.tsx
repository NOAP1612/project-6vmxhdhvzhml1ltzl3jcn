import { useBibliographyFormatter } from '@/hooks/useBibliographyFormatter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, FileText, X, Wand2 } from 'lucide-react';

export const BibliographyFormatter = () => {
  const {
    fileName,
    isUploading,
    uploadProgress,
    isLoading,
    bibliography,
    citationStyle,
    setCitationStyle,
    fileInputRef,
    handleFileChange,
    handleFormatBibliography,
    handleReset,
  } = useBibliographyFormatter();

  const citationStyles = ["APA", "MLA", "Chicago", "Harvard"];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">עיצוב ביבליוגרפיה</h1>
        <p className="text-lg text-gray-600 mt-2">העלה מסמך, בחר סגנון ציטוט, וקבל רשימה ביבליוגרפית מעוצבת באופן אוטומטי.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>1. העלאת מסמך</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} variant="outline">
              <Upload className="ml-2 h-4 w-4" />
              בחר קובץ
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.txt"
            />
            {fileName && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                <FileText className="h-5 w-5 text-gray-500" />
                <span>{fileName}</span>
                <Button onClick={handleReset} variant="ghost" size="icon" className="h-6 w-6">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. בחירת סגנון ציטוט</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={citationStyle} onValueChange={setCitationStyle}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="בחר סגנון..." />
            </SelectTrigger>
            <SelectContent>
              {citationStyles.map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={handleFormatBibliography} disabled={isLoading || isUploading || !fileName} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              מעצב...
            </>
          ) : (
            <>
              <Wand2 className="ml-2 h-5 w-5" />
              עצב ביבליוגרפיה
            </>
          )}
        </Button>
      </div>

      {bibliography && (
        <Card>
          <CardHeader>
            <CardTitle>הביבליוגרפיה המעוצבת שלך</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 border rounded-md whitespace-pre-wrap text-left" dir="ltr">
              {bibliography}
            </div>
            <Button
              onClick={() => navigator.clipboard.writeText(bibliography)}
              variant="outline"
              className="mt-4"
            >
              העתק טקסט
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};