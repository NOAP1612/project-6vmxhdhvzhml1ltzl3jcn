import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { readTextOutLoud } from "@/functions";
import { Volume2, Loader2, Play, Gauge } from "lucide-react";

export function TextToSpeech() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [speed, setSpeed] = useState([1.0]);
  const { toast } = useToast();

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן טקסט להמרה.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAudioUrl(null);

    try {
      const result = await readTextOutLoud({ 
        text, 
        voice: "ash",
        speed: speed[0]
      });

      if (result && result.audioData) {
        const url = `data:audio/mpeg;base64,${result.audioData}`;
        setAudioUrl(url);

        toast({
          title: "הצלחה!",
          description: "הקול נוצר בהצלחה.",
        });
      } else {
        throw new Error(result.error || "תגובה לא תקינה מהשרת");
      }

    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        title: "שגיאה",
        description: error instanceof Error ? error.message : "אירעה שגיאה ביצירת הקול. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSpeedLabel = (speedValue: number) => {
    if (speedValue <= 0.5) return "איטי מאוד";
    if (speedValue <= 0.8) return "איטי";
    if (speedValue <= 1.2) return "רגיל";
    if (speedValue <= 1.5) return "מהיר";
    if (speedValue <= 2.0) return "מהיר מאוד";
    return "מהיר ביותר";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
          <Volume2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">קריאה בקול</h1>
          <p className="text-gray-600">המר טקסט לדיבור עם קול Ash</p>
        </div>
      </div>

      {/* Speed Control - Prominent outside the main card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <Gauge className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">מהירות דיבור:</span>
            </div>
            <div className="flex-1 px-4">
              <Slider
                value={speed}
                onValueChange={setSpeed}
                max={3.0}
                min={0.25}
                step={0.25}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div className="min-w-0 text-left">
              <div className="text-lg font-bold text-blue-900">×{speed[0]}</div>
              <div className="text-sm text-blue-700">{getSpeedLabel(speed[0])}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>המרת טקסט לדיבור</CardTitle>
          <CardDescription>הדבק את הטקסט שברצונך להפוך לדיבור ולחץ על הכפתור.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="הזן כאן את הטקסט שלך..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-48"
            disabled={isLoading}
          />
          <Button onClick={handleGenerateSpeech} disabled={isLoading || !text.trim()} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                מעבד...
              </>
            ) : (
              <>
                <Play className="ml-2 h-4 w-4" />
                המר לדיבור
              </>
            )}
          </Button>

          {audioUrl && (
            <div className="pt-4">
              <audio controls src={audioUrl} className="w-full">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}