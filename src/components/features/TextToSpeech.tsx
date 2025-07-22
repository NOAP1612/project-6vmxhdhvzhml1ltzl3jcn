import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { readTextOutLoud } from "@/functions";
import { Volume2, Loader2, Play, Gauge, Mic } from "lucide-react";

export function TextToSpeech() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [speed, setSpeed] = useState([1.0]);
  const [selectedVoice, setSelectedVoice] = useState("alloy");
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
        voice: selectedVoice,
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

  const getVoiceDescription = (voice: string) => {
    switch (voice) {
      case "alloy":
        return "קול נייטרלי ובהיר";
      case "sage":
        return "קול רך ומתון";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
          <Volume2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">קריאה בקול</h1>
          <p className="text-gray-600">המר טקסט לדיבור עם קולות AI מתקדמים</p>
        </div>
      </div>

      {/* Voice Selection */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <Mic className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">בחירת קול:</span>
          </div>
          <RadioGroup value={selectedVoice} onValueChange={setSelectedVoice} className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="alloy" id="alloy" disabled={isLoading} />
              <Label htmlFor="alloy" className="cursor-pointer">
                <div>
                  <div className="font-medium text-green-900">Alloy</div>
                  <div className="text-sm text-green-700">{getVoiceDescription("alloy")}</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="sage" id="sage" disabled={isLoading} />
              <Label htmlFor="sage" className="cursor-pointer">
                <div>
                  <div className="font-medium text-green-900">Sage</div>
                  <div className="text-sm text-green-700">{getVoiceDescription("sage")}</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
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
            <div className="space-y-4 pt-4">
              <audio controls src={audioUrl} className="w-full">
                Your browser does not support the audio element.
              </audio>
              
              {/* Speed Control - Only shown when audio is ready */}
              <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-orange-900 text-lg">בקרת מהירות הפעלה</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <Slider
                        value={speed}
                        onValueChange={setSpeed}
                        max={3.0}
                        min={0.25}
                        step={0.25}
                        className="w-full"
                      />
                    </div>
                    <div className="text-center min-w-[100px]">
                      <div className="text-2xl font-bold text-orange-900">×{speed[0]}</div>
                      <div className="text-sm text-orange-700 font-medium">{getSpeedLabel(speed[0])}</div>
                    </div>
                  </div>
                  <p className="text-sm text-orange-700 mt-3 text-center">
                    שנה את המהירות והפעל שוב את ההקלטה כדי לשמוע את השינוי
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}