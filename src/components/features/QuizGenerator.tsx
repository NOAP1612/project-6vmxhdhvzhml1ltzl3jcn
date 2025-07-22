import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";

export function QuizGenerator() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <FileQuestion className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">יצירת שאלון</h1>
          <p className="text-gray-600">צור שאלונים מותאמים אישית</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>יצירת שאלון</CardTitle>
          <CardDescription>הכלי ליצירת שאלונים יתווסף בקרוב</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 text-gray-500">
            <div className="text-center">
              <FileQuestion className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">בפיתוח</p>
              <p>הכלי ליצירת שאלונים יהיה זמין בקרוב</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}