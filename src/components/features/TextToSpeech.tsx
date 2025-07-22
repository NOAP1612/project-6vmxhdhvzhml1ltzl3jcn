import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Volume2, Play, Pause, Square, Settings } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { FileUpload } from "./FileUpload";

export function TextToSpeech() {
  const {
    text, setText,
    fileName,
    isUploading,
    uploadProgress,
    isPlaying,
    isPaused,
    voices,
    selectedVoice, setSelectedVoice,
    rate, setRate,
    pitch, setPitch,
    volume, setVolume,
    fileInputRef,
    handleFileChange,
    handlePlay,
    handlePause,
    handleStop,
    handleClearFile,
  } = useTextToSpeech();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
          <Volume2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">קריאה בקול</h1>
          <p className="text-gray-600">המר טקסט לדיבור עם קול Fable</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הכנס טקסט לקריאה</CardTitle>
          <CardDescription>העלה קובץ או הדבק טקסט כדי להקריא אותו בקול</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <Textarea
            placeholder="הדבק כאן את הטקסט שלך..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-48"
            disabled={isUploading || !!fileName}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            הגדרות קול
          </CardTitle>
          <CardDescription>התאם את הגדרות הקריאה לפי העדפתך</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>בחר קול</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue placeholder="בחר קול" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>מהירות: {rate.toFixed(1)}x</Label>
              <Slider
                value={[rate]}
                onValueChange={(value) => setRate(value[0])}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>גובה צליל: {pitch.toFixed(1)}</Label>
              <Slider
                value={[pitch]}
                onValueChange={(value) => setPitch(value[0])}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>עוצמת קול: {Math.round(volume * 100)}%</Label>
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>נגן</CardTitle>
          <CardDescription>שלט בקריאת הטקסט</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4">
            {!isPlaying && !isPaused ? (
              <Button
                onClick={handlePlay}
                disabled={!text.trim() || isUploading}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                התחל קריאה
              </Button>
            ) : (
              <>
                {isPlaying ? (
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    className="px-6 py-3"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    השהה
                  </Button>
                ) : (
                  <Button
                    onClick={handlePlay}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    המשך
                  </Button>
                )}
                
                <Button
                  onClick={handleStop}
                  variant="destructive"
                  className="px-6 py-3"
                >
                  <Square className="w-5 h-5 mr-2" />
                  עצור
                </Button>
              </>
            )}
          </div>

          {(isPlaying || isPaused) && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                <span className="text-sm font-medium">
                  {isPlaying ? 'מקריא כעת...' : 'מושהה'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}