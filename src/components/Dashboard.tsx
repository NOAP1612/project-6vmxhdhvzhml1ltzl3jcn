import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

export const Dashboard = () => {
  return (
    <div className="p-6">
      <Card className="text-center p-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <BrainCircuit className="h-16 w-16 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold">ברוכים הבאים לכלי הלמידה מבוססי AI</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700">
            בחרו את הכלי הרצוי מהתפריט בצד ימין כדי להתחיל.
          </p>
          <p className="mt-2 text-md text-gray-500">
            תוכלו ליצור בחנים, טבלאות סיכום, גרפים ועוד - הכל בכמה קליקים.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};