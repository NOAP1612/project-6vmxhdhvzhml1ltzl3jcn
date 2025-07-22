import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, FileText, Presentation, Trash2 } from "lucide-react";
import { usePresentationGenerator } from "@/hooks/usePresentationGenerator";
import { PresentationViewer } from "./PresentationViewer";

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

  const handleViewPresentation = () => {
    if (presentationData) {
      setShowViewer(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">יצירת מצגות</h1>
        <p className="text-gray-600">צור מצגות מקצועיות עם גרפים וויזואליזציות מטקסט או קבצים</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Presentation className="h-5 w-5" />
              הגדרות המצגת
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Topic Input */}
            <div>
              <Label htmlFor="topic">נושא המצגת *</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="הזן את נושא המצגת..."
                className="mt-1"
              />
            </div>

            {/* Slide Count */}
            <div>
              <Label htmlFor="slideCount">מספר שקופיות</Label>
              <Input
                id="slideCount"
                type="number"
                min="3"
                max="15"
                value={slideCount}
                onChange={(e) => setSlideCount(parseInt(e.target.value) || 5)}
                className="mt-1"
              />
            </div>

            {/* Theme Selection */}
            <div>
              <Label>ערכת נושא</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTheme === theme.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`h-4 w-full rounded bg-gradient-to-r ${theme.colors} mb-2`}></div>
                    <span className="text-sm font-medium">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <Label>העלאת קובץ (אופציונלי)</Label>
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 ml-2" />
                  {isUploading ? uploadProgress : 'העלה קובץ PDF או טקסט'}
                </Button>
                {fileName && (
                  <div className="flex items-center justify-between mt-2 p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">{fileName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSourceText('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Text Input */}
            <div>
              <Label htmlFor="sourceText">טקסט מקור (אופציונלי)</Label>
              <Textarea
                id="sourceText"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="הזן טקסט לניתוח ויצירת המצגת..."
                className="mt-1 min-h-[120px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleGeneratePresentation}
                disabled={isLoading || !topic.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    יוצר מצגת...
                  </>
                ) : (
                  <>
                    <Presentation className="h-4 w-4 ml-2" />
                    צור מצגת
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <Trash2 className="h-4 w-4 ml-2" />
                נקה
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>תוצאות</CardTitle>
          </CardHeader>
          <CardContent>
            {presentationData ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">
                    {presentationData.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-green-700">
                    <Badge variant="secondary">
                      {presentationData.slides.length} שקופיות
                    </Badge>
                    <Badge variant="secondary">
                      {presentationData.slides.filter(s => s.visual?.type === 'chart').length} גרפים
                    </Badge>
                  </div>
                </div>

                <Button onClick={handleViewPresentation} className="w-full">
                  <Presentation className="h-4 w-4 ml-2" />
                  הצג מצגת במסך מלא
                </Button>

                {/* Slides Preview */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {presentationData.slides.map((slide, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{slide.title}</h4>
                        {slide.visual?.type === 'chart' && (
                          <Badge variant="outline" className="text-xs">
                            📊 גרף
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {slide.content[0]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Presentation className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>המצגת תופיע כאן לאחר היצירה</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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