import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Loader2, Plus, X, Clock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateStudySchedule } from "@/functions";

interface ScheduleDay {
  day: number;
  date: string;
  topics: string[];
  duration: string;
  tasks: string[];
  goals: string;
}

interface ScheduleData {
  title: string;
  totalDays: number;
  schedule: ScheduleDay[];
}

export function StudySchedule() {
  const [topics, setTopics] = useState<string[]>(['']);
  const [availableTime, setAvailableTime] = useState('2');
  const [examDate, setExamDate] = useState('');
  const [language, setLanguage] = useState('hebrew');
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const { toast } = useToast();

  const addTopic = () => {
    setTopics([...topics, '']);
  };

  const removeTopic = (index: number) => {
    if (topics.length > 1) {
      setTopics(topics.filter((_, i) => i !== index));
    }
  };

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleGenerate = async () => {
    const validTopics = topics.filter(t => t.trim());
    
    if (validTopics.length === 0) {
      toast({
        title: "שגיאה",
        description: "אנא הזן לפחות נושא אחד",
        variant: "destructive",
      });
      return;
    }

    if (!examDate) {
      toast({
        title: "שגיאה",
        description: "אנא הזן תאריך מבחן",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateStudySchedule({
        topics: validTopics,
        availableTime,
        examDate,
        language
      });

      if (result.schedule) {
        setScheduleData(result);
        toast({
          title: "הצלחה!",
          description: `נוצרה תוכנית לימודים ל-${result.totalDays} ימים`,
        });
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת התוכנית. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">גאנט לימודים</h1>
          <p className="text-gray-600">תוכנית לימודים יומית מותאמת לקראת המבחן</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הגדרות התוכנית</CardTitle>
          <CardDescription>
            הזן את פרטי הלימודים ותאריך המבחן
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="availableTime">זמן פנוי יומי (שעות)</Label>
              <Select value={availableTime} onValueChange={setAvailableTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">שעה אחת</SelectItem>
                  <SelectItem value="2">2 שעות</SelectItem>
                  <SelectItem value="3">3 שעות</SelectItem>
                  <SelectItem value="4">4 שעות</SelectItem>
                  <SelectItem value="5">5 שעות</SelectItem>
                  <SelectItem value="6">6 שעות</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examDate">תאריך המבחן</Label>
              <Input
                id="examDate"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>נושאי הלימוד</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTopic}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                הוסף נושא
              </Button>
            </div>
            
            <div className="space-y-3">
              {topics.map((topic, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`נושא ${index + 1}`}
                    value={topic}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    className="flex-1"
                  />
                  {topics.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeTopic(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                יוצר תוכנית...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                צור תוכנית לימודים
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {scheduleData && (
        <Card>
          <CardHeader>
            <CardTitle>{scheduleData.title}</CardTitle>
            <CardDescription>
              תוכנית לימודים ל-{scheduleData.totalDays} ימים
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduleData.schedule.map((day, index) => (
                <Card key={index} className="border-r-4 border-r-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          יום {day.day}
                        </h3>
                        <p className="text-gray-600">{day.date}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{day.duration}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">נושאים</h4>
                        <div className="space-y-1">
                          {day.topics.map((topic, topicIndex) => (
                            <Badge key={topicIndex} variant="secondary">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">משימות</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {day.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          יעדי היום
                        </h4>
                        <p className="text-sm text-gray-700">{day.goals}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}