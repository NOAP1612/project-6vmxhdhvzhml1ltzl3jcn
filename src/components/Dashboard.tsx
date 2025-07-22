import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, FileText, MessageSquare, BookOpenCheck, ListOrdered } from "lucide-react";

export const Dashboard = () => {
  const features = [
    { name: "מצגות", icon: <FileText className="h-8 w-8 text-blue-500" />, description: "צור מצגות מקצועיות מטקסט" },
    { name: "בחנים", icon: <MessageSquare className="h-8 w-8 text-green-500" />, description: "הפוך חומר לימודי לחידונים" },
    { name: "גרפים", icon: <BarChart className="h-8 w-8 text-red-500" />, description: "הצג נתונים בצורה ויזואלית" },
    { name: "טבלאות סיכום", icon: <BookOpenCheck className="h-8 w-8 text-yellow-500" />, description: "סכם טקסטים ארוכים בטבלה" },
    { name: "עיצוב ביבליוגרפיה", icon: <ListOrdered className="h-8 w-8 text-purple-500" />, description: "עצב רשימות ביבליוגרפיות" },
  ];

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">ברוך הבא ל-StudyAI</h1>
        <p className="text-lg text-gray-600 mt-2">הכלי שלך להצלחה אקדמית. בחר אחד מהפיצ'רים כדי להתחיל.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.name} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{feature.name}</CardTitle>
              {feature.icon}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};