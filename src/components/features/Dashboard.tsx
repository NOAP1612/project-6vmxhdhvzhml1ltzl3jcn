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
  BookOpen,
  Zap,
  Activity,
  Target
} from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      title: "שאלונים שנוצרו",
      value: "24",
      description: "השבוע",
      icon: FileQuestion,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%"
    },
    {
      title: "טבלאות סיכום",
      value: "12",
      description: "החודש",
      icon: Table,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+8%"
    },
    {
      title: "כרטיסיות זיכרון",
      value: "156",
      description: "סה\"כ",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+23%"
    },
    {
      title: "שעות למידה",
      value: "48",
      description: "השבוע",
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "+15%"
    }
  ];

  const recentActivities = [
    { action: "נוצר שאלון בנושא מתמטיקה", time: "לפני 2 שעות", icon: FileQuestion, color: "text-blue-500" },
    { action: "הושלמה טבלת סיכום בפיזיקה", time: "לפני 4 שעות", icon: Table, color: "text-green-500" },
    { action: "נוצרו כרטיסיות זיכרון בהיסטוריה", time: "אתמול", icon: CreditCard, color: "text-purple-500" },
    { action: "הושלם לוח זמנים לימודי", time: "לפני יומיים", icon: Calendar, color: "text-orange-500" }
  ];

  const quickActions = [
    { name: "צור שאלון חדש", icon: FileQuestion, color: "from-blue-500 to-blue-600", id: "quiz" },
    { name: "צור טבלת סיכום", icon: Table, color: "from-green-500 to-green-600", id: "summary" },
    { name: "צור כרטיסיות זיכרון", icon: CreditCard, color: "from-purple-500 to-purple-600", id: "flashcards" },
    { name: "תכנן לוח זמנים", icon: Calendar, color: "from-orange-500 to-orange-600", id: "schedule" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8 tech-highlight p-6 rounded-2xl">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center tech-glow animate-float">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold hero-text">לוח בקרה</h1>
          <p className="subtitle-text">ברוך הבא לפלטפורמת הלמידה החכמה</p>
        </div>
        <div className="mr-auto">
          <div className="flex items-center gap-2 text-green-600">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">מערכת פעילה</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animation">
        {stats.map((stat, index) => (
          <Card key={index} className="feature-card tech-border relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">{stat.description}</p>
                    <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center floating-element`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600 animate-progress"></div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="glass-effect tech-border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-green-600 animate-pulse" />
              <div>
                <CardTitle className="gradient-text">פעולות מהירות</CardTitle>
                <CardDescription>התחל ליצור תוכן לימודי חדש</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <Button 
                key={index}
                className={`w-full justify-start bg-gradient-to-r ${action.color} text-white hover:scale-105 transition-all duration-300 tech-shadow`}
                variant="default"
              >
                <action.icon className="w-4 h-4 mr-2 animate-float" />
                {action.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-effect tech-border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-green-600 animate-pulse" />
              <div>
                <CardTitle className="gradient-text">פעילות אחרונה</CardTitle>
                <CardDescription>מה קרה לאחרונה בחשבון שלך</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl tech-highlight hover:scale-105 transition-all duration-300 data-stream">
                  <div className={`w-10 h-10 bg-white rounded-full flex items-center justify-center tech-shadow`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <Card className="glass-effect tech-border neural-network">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-green-600 animate-pulse" />
            <div>
              <CardTitle className="gradient-text">התקדמות השבוע</CardTitle>
              <CardDescription>הסטטיסטיקות שלך בשבוע האחרון</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-12 text-gray-500">
            <div className="text-center">
              <div className="relative mb-6">
                <TrendingUp className="w-16 h-16 mx-auto text-green-400 animate-float" />
                <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse-ring opacity-30"></div>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">גרפי התקדמות מתקדמים</p>
              <p className="text-sm text-gray-500">יתווספו בקרוב עם ניתוח AI מתקדם</p>
              <div className="mt-4 flex justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce-1"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce-2"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce-3"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}