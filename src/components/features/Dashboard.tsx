import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  FileQuestion, 
  Table, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  Calculator,
  Volume2,
  Sparkles,
  BookOpen,
  Target
} from "lucide-react";

export function Dashboard() {
  const features = [
    {
      icon: FileQuestion,
      title: "יצירת שאלון",
      description: "צור שאלות מותאמות אישית לפי נושא, מספר שאלות וסוג השאלות",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Table,
      title: "טבלת סיכום",
      description: "קבל טבלה מסודרת עם הסברים פשוטים וברורים לכל מושג",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Calendar,
      title: "גאנט לימודים",
      description: "תוכנית לימודים יומית מותאמת לקראת המבחן שלך",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: MessageSquare,
      title: "פוסט לימודי",
      description: "פוסטים קצרים ומעוצבים ללמידה ושיתוף ברשתות חברתיות",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: CreditCard,
      title: "כרטיסיות זיכרון",
      description: "כרטיסיות ללמידה מהירה - שאלה בצד אחד, תשובה בצד שני",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: Calculator,
      title: "דף נוסחאות",
      description: "דף נוסחאות מסודר ומעוצב לכל תחום לימוד",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: Volume2,
      title: "קריאה בקול",
      description: "המרת טקסטים להרצאה מוקלטת באיכות גבוהה",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              פלטפורמת למידה חכמה
            </h1>
            <p className="text-xl text-gray-600 mt-2">מופעלת על ידי בינה מלאכותית מתקדמת</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>GPT-4 מתקדם</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>תמיכה בעברית ואנגלית</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-500" />
            <span>למידה מותאמת אישית</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/70 backdrop-blur-sm"
          >
            <CardHeader className="pb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">איך זה עובד?</h3>
            <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
              המערכת שלנו מבוססת על Assistant מתקדם של OpenAI עם GPT-4, המחובר ישירות ל־Dashboard שלך. 
              כל כלי למידה מותאם אישית לצרכים שלך ומספק תוכן איכותי בעברית ובאנגלית. 
              פשוט בחר את הכלי הרצוי, הזן את הפרטים, והמערכת תיצור עבורך תוכן לימודי מקצועי ומותאם.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>מחובר ל־OpenAI</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}