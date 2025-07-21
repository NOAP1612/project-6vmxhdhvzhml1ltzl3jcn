import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Loader2, Copy, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createStudyPost } from "@/functions";

interface PostData {
  title: string;
  content: string;
  hashtags: string[];
  callToAction: string;
}

export function StudyPost() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('motivational');
  const [language, setLanguage] = useState('hebrew');
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState<PostData | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן נושא לפוסט",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createStudyPost({
        topic,
        style,
        language
      });

      if (result.title) {
        setPostData(result);
        toast({
          title: "הצלחה!",
          description: "הפוסט נוצר בהצלחה",
        });
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת הפוסט. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (postData) {
      const fullPost = `${postData.title}\n\n${postData.content}\n\n${postData.hashtags.join(' ')}\n\n${postData.callToAction}`;
      navigator.clipboard.writeText(fullPost);
      toast({
        title: "הועתק!",
        description: "הפוסט הועתק ללוח",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">פוסט לימודי</h1>
          <p className="text-gray-600">צור פוסטים מעוצבים לשיתוף ברשתות חברתיות</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הגדרות הפוסט</CardTitle>
          <CardDescription>
            הזן את פרטי הפוסט שברצונך ליצור
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="topic">נושא הפוסט</Label>
              <Input
                id="topic"
                placeholder="לדוגמה: טיפים ללמידה יעילה"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">סגנון הפוסט</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motivational">מוטיבציה</SelectItem>
                  <SelectItem value="educational">חינוכי</SelectItem>
                  <SelectItem value="tips">טיפים</SelectItem>
                  <SelectItem value="facts">עובדות מעניינות</SelectItem>
                  <SelectItem value="inspiration">השראה</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">שפה</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hebrew">עברית</SelectItem>
                  <SelectItem value="english">אנגלית</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                יוצר פוסט...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                צור פוסט לימודי
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {postData && (
        <Card>
          <CardHeader>
            <CardTitle>הפוסט שנוצר</CardTitle>
            <CardDescription>
              פוסט מוכן לשיתוף ברשתות חברתיות
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">{postData.title}</h3>
              
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                {postData.content}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {postData.hashtags.map((hashtag, index) => (
                  <span key={index} className="text-blue-600 font-medium">
                    {hashtag}
                  </span>
                ))}
              </div>
              
              <div className="border-t border-pink-200 pt-4">
                <p className="text-gray-700 font-medium">{postData.callToAction}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                העתק פוסט
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                שתף
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}