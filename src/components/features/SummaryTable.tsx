import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function SummaryTable() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">טבלת סיכום</h1>
          <p className="text-gray-600">צור טבלאות סיכום מסודרות ומפורטות</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>טבלת סיכום - בפיתוח</CardTitle>
          <CardDescription>הכלי ליצירת טבלאות סיכום יתווסף בקרוב</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 text-gray-500">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">בפיתוח</p>
              <p>הכלי ליצירת טבלאות סיכום יהיה זמין בקרוב</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}