import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export function StudySchedule() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">גאנט לימודים</h1>
          <p className="text-gray-600">תכנן את לוח הזמנים הלימודי שלך</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>לוח זמנים לימודי</CardTitle>
          <CardDescription>הכלי לתכנון לוח זמנים יתווסף בקרוב</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 text-gray-500">
            <div className="text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">בפיתוח</p>
              <p>הכלי לתכנון לוח זמנים לימודי יהיה זמין בקרוב</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}