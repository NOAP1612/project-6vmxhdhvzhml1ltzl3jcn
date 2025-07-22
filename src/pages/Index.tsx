import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileQuestion, BarChart3, FileText, Volume2 } from "lucide-react";
import { QuizGenerator } from "@/components/features/QuizGenerator";
import { ChartGenerator } from "@/components/features/ChartGenerator";
import { SummaryTable } from "@/components/features/SummaryTable";
import { TextToSpeech } from "@/components/features/TextToSpeech";

type ActiveFeature = 'home' | 'quiz' | 'charts' | 'summary' | 'tts';

const Index = () => {
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>('home');

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'quiz':
        return <QuizGenerator />;
      case 'charts':
        return <ChartGenerator />;
      case 'summary':
        return <SummaryTable />;
      case 'tts':
        return <TextToSpeech />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                  כלים חכמים ללמידה
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  פלטפורמה מתקדמת ליצירת שאלונים, גרפים וטבלאות סיכום מטקסט וקבצי PDF באמצעות בינה מלאכותית
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-blue-300"
                  onClick={() => setActiveFeature('quiz')}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <FileQuestion className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">יצירת שאלונים</CardTitle>
                    <CardDescription className="text-center">
                      צור שאלונים אינטראקטיביים מטקסט או PDF
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-green-300"
                  onClick={() => setActiveFeature('charts')}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">יצירת גרפים</CardTitle>
                    <CardDescription className="text-center">
                      המר נתונים לגרפים ויזואליים מרהיבים
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-purple-300"
                  onClick={() => setActiveFeature('summary')}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">טבלת סיכום</CardTitle>
                    <CardDescription className="text-center">
                      צור טבלאות סיכום מסודרות ומפורטות
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-indigo-300"
                  onClick={() => setActiveFeature('tts')}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <Volume2 className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">קריאה בקול</CardTitle>
                    <CardDescription className="text-center">
                      המר טקסט לדיבור עם קול Fable
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">מופעל על ידי OpenAI GPT-4</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (activeFeature !== 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              onClick={() => setActiveFeature('home')} 
              variant="outline"
              className="mb-4"
            >
              ← חזור לעמוד הבית
            </Button>
          </div>
          {renderActiveFeature()}
        </div>
      </div>
    );
  }

  return renderActiveFeature();
};

export default Index;