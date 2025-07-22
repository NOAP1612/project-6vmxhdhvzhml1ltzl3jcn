import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  FileQuestion, 
  Table, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  Calculator,
  Volume2,
  TrendingUp,
  Users,
  BookOpen
} from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      title: "שאלונים שנוצרו",
      value: "24",
      description: "השבוע",
      icon: FileQuestion,
      color: "text-blue-600"
    },
    {
      title: "טבלאות סיכום",
      value: "12",
      description: "החודש",
      icon: Table,
      color: "text-green-600"
    },
    {
      title: "כרטיסיות זיכרון",
      value: "156",
      description: "סה\"כ",
      icon: CreditCard,
      color: "text-purple-600"
    },
    {
      title: "שעות למידה",
      value: "48",
      description: "השבוע",
      icon: BookOpen,
      color: "text-orange-600"
    }
  ];

  const recentActivities = [
    { action: "נוצר שאלון בנושא מתמטיקה", time: "לפני 2 שעות" },
    { action: "הושלמה טבלת סיכום בפיזיקה", time: "לפני 4 שעות" },
    { action: "נוצרו כרטיסיות זיכרון בהיסטוריה", time: "אתמול" },
    { action: "הושלם לוח זמנים לימודי", time: "לפני יומיים" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">לוח בקרה</h1>
          <p className="text-gray-600">ברוך הבא לפלטפורמת הלמידה החכמה</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>פעולות מהירות</CardTitle>
            <CardDescription>התחל ליצור תוכן לימודי חדש</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <FileQuestion className="w-4 h-4 mr-2" />
              צור שאלון חדש
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Table className="w-4 h-4 mr-2" />
              צור טבלת סיכום
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="w-4 h-4 mr-2" />
              צור כרטיסיות זיכרון
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              תכנן לוח זמנים
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>פעילות אחרונה</CardTitle>
            <CardDescription>מה קרה לאחרונה בחשבון שלך</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle>התקדמות השבוע</CardTitle>
          <CardDescription>הסטטיסטיקות שלך בשבוע האחרון</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-gray-500">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>גרפי התקדמות יתווספו בקרוב</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}