import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Presentation, Loader2, RotateCcw, Eye } from "lucide-react";
import { usePresentationGenerator } from "@/hooks/usePresentationGenerator";
import { PresentationViewer } from "./PresentationViewer";
import { useState } from "react";

export function PresentationGenerator() {
  const {
    topic, setTopic,
    sourceText, setSourceText,
    fileName,
    slideCount, setSlideCount,
    isUploading,
    uploadProgress,
    isLoading,
    presentationData,
    selectedTheme, setSelectedTheme,
    themes,
    fileInputRef,
    handleFileChange,
    handleGeneratePresentation,
    handleReset,
  } = usePresentationGenerator();

  const [showViewer, setShowViewer] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">יצירת מצגות</h1>
        <p className="text-gray-600">צור מצגות מקצועיות מטקסט או קבצי PDF</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Presentation className="h-5 w-5" />
              הגדרות המצגת
            </CardTitle>
            <CardDescription>
              הזן את הפרטים הבסיסיים למצגת שלך
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">נושא המצגת</Label>
              <Input
                id="topic"
                placeholder="לדוגמה: בינה מלאכותית בחינוך"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slideCount">מספר שקופיות</Label>
              <Select value={slideCount.toString()} onValueChange={(value) => setSlideCount(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 שקופיות</SelectItem>
                  <SelectItem value="5">5 שקופיות</SelectItem>
                  <SelectItem value="7">7 שקופיות</SelectItem>
                  <SelectItem value="10">10 שקופיות</SelectItem>
                  <SelectItem value="15">15 שקופיות</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>בחר עיצוב</Label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme) => (
                  <Button
                    key={theme.id}
                    variant={selectedTheme === theme.id ? "default" : "outline"}
                    className={`h-12 ${selectedTheme === theme.id ? `bg-gradient-to-r ${theme.colors} text-white` : ''}`}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    {theme.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              תוכן המצגת
            </CardTitle>
            <CardDescription>
              הזן טקסט או העלה קובץ PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">העלאת קובץ PDF</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'מעלה...' : 'בחר קובץ'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {fileName && (
                <Badge variant="secondary" className="mt-2">
                  {fileName}
                </Badge>
              )}
              {uploadProgress && (
                <p className="text-sm text-blue-600">{uploadProgress}</p>
              )}
            </div>

            <div className="text-center text-gray-500">או</div>

            <div className="space-y-2">
              <Label htmlFor="sourceText">הדבק טקסט ישירות</Label>
              <Textarea
                id="sourceText"
                placeholder="הדבק כאן את הטקסט שממנו תרצה ליצור מצגת..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                rows={8}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleGeneratePresentation}
          disabled={isLoading || isUploading}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              יוצר מצגת...
            </>
          ) : (
            <>
              <Presentation className="h-4 w-4 mr-2" />
              צור מצגת
            </>
          )}
        </Button>

        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          איפוס
        </Button>
      </div>

      {/* Results Section */}
      {presentationData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>המצגת שלך מוכנה!</span>
              <Button onClick={() => setShowViewer(true)}>
                <Eye className="h-4 w-4 mr-2" />
                הצג מצגת
              </Button>
            </CardTitle>
            <CardDescription>
              {presentationData.title} • {presentationData.slides.length} שקופיות
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {presentationData.slides.map((slide, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      שקופית {index + 1}: {slide.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1 mb-3">
                      {slide.content.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-gray-700">{point}</li>
                      ))}
                    </ul>
                    <Badge variant="outline" className="text-xs">
                      💡 {slide.visualSuggestion}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Presentation Viewer Modal */}
      {showViewer && presentationData && (
        <PresentationViewer
          presentation={presentationData}
          theme={selectedTheme}
          onClose={() => setShowViewer(false)}
        />
      )}
    </div>
  );
}