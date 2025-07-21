import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Loader2, Play, Pause, Download, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { textToSpeech } from "@/functions";

export function TextToSpeech() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('hebrew');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן טקסט להמרה",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAudioUrl(null); // Reset previous audio
    try {
      const response = await textToSpeech({
        text,
        language
      });

      if (response instanceof ArrayBuffer) {
        const blob = new Blob([response], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        toast({
          title: "הצלחה!",
          description: "הטקסט הומר לקול בהצלחה",
        });
      } else {
        // Handle cases where the function returns an error object
        const errorData = response as { error?: string };
        throw new Error(errorData.error || "An unknown error occurred");
      }
    } catch (error: any) {
      const errorMessage = error.message || "אירעה שגיאה בהמרת הטקסט לקול. אנא נסה שוב.";
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'speech.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const sampleTexts = {
    hebrew: [
      "שלום, זהו דוגמה לטקסט בעברית שיומר לקול באמצעות בינה מלאכותית מתקדמת.",
      "המערכת שלנו משתמשת במודל TTS של OpenAI כדי ליצור קול טבעי ונעים להאזנה.",
      "אתה יכול להזין כל טקסט שתרצה והמערכת תמיר אותו לקובץ אודיו איכותי."
    ],
    english: [
      "Hello, this is a sample text in English that will be converted to speech using advanced AI.",
      "Our system uses OpenAI's TTS model to create natural and pleasant voice output.",
      "You can enter any text you want and the system will convert it to a high-quality audio file."
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
          <Volume2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">קריאה בקול</h1>
          <p className="text-gray-600">המר טקסט להרצאה מוקלטת באיכות גבוהה</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הגדרות הקריאה</CardTitle>
          <CardDescription>
            הזן את הטקסט שברצונך להמיר לקול
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language">שפה</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hebrew">עברית</SelectItem>
                <SelectItem value="english">אנגלית</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">הטקסט להמרה</Label>
            <Textarea
              id="text"
              placeholder={language === 'hebrew' 
                ? "הזן כאן את הטקסט שברצונך להמיר לקול..."
                : "Enter the text you want to convert to speech..."
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <div className="text-sm text-gray-500">
              {text.length} תווים
            </div>
          </div>

          <div className="space-y-3">
            <Label>דוגמאות טקסט</Label>
            <div className="grid gap-2">
              {sampleTexts[language as keyof typeof sampleTexts].map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setText(sample)}
                  className="text-right justify-start h-auto p-3 whitespace-normal"
                >
                  {sample}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ממיר לקול...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                המר לקול
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {audioUrl && (
        <Card>
          <CardHeader>
            <CardTitle>הקובץ שנוצר</CardTitle>
            <CardDescription>
              הטקסט הומר בהצלחה לקובץ אודיו
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="hidden"
            />
            
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePlay}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    השהה
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    נגן
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleDownload}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                הורד MP3
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">פרטי הקובץ</span>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• קול: Alloy (מרצה מעניין)</p>
                <p>• פורמט: MP3</p>
                <p>• איכות: גבוהה</p>
                <p>• מופעל על ידי OpenAI TTS</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
