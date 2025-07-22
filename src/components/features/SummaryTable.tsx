import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function SummaryTable() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">יצירת טבלת סיכום</h1>
          <p className="text-gray-600">הכלי ליצירת טבלאות סיכום</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>טבלת סיכום</CardTitle>
          <CardDescription>כאן יוצג הכלי ליצירת טבלאות סיכום.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>התכונה נמצאת בפיתוח ותהיה זמינה בקרוב.</p>
        </CardContent>
      </Card>
    </div>
  );
}