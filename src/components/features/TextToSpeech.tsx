import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2 } from "lucide-react";

export function TextToSpeech() {
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
          <CardTitle>קריאה בקול - Fable</CardTitle>
          <CardDescription>הכלי להמרת טקסט לדיבור יתווסף בקרוב</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 text-gray-500">
            <div className="text-center">
              <Volume2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">בפיתוח</p>
              <p>הכלי להמרת טקסט לדיבור עם קול Fable יהיה זמין בקרוב</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}