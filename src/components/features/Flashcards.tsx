import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Loader2, Plus, X, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateFlashcards } from "@/functions";

interface Flashcard {
  front: string;
  back: string;
  category: string;
  difficulty: string;
}

interface FlashcardsData {
  title: string;
  flashcards: Flashcard[];
}

export function Flashcards() {
  const [topic, setTopic] = useState('');
  const [concepts, setConcepts] = useState<string[]>(['']);
  const [language, setLanguage] = useState('hebrew');
  const [isLoading, setIsLoading] = useState(false);
  const [flashcardsData, setFlashcardsData] = useState<FlashcardsData | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();

  const addConcept = () => {
    setConcepts([...concepts, '']);
  };

  const removeConcept = (index: number) => {
    if (concepts.length > 1) {
      setConcepts(concepts.filter((_, i) => i !== index));
    }
  };

  const updateConcept = (index: number, value: string) => {
    const newConcepts = [...concepts];
    newConcepts[index] = value;
    setConcepts(newConcepts);
  };

  const handleGenerate = async () => {
    const validConcepts = concepts.filter(c => c.trim());
    
    if (!topic.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן נושא לכרטיסיות",
        variant: "destructive",
      });
      return;
    }

    if (validConcepts.length === 0) {
      toast({
        title: "שגיאה",
        description: "אנא הזן לפחות מושג אחד",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateFlashcards({
        topic,
        concepts: validConcepts,
        language
      });

      if (result.flashcards) {
        setFlashcardsData(result);
        setCurrentCard(0);
        setIsFlipped(false);
        toast({
          title: "הצלחה!",
          description: `נוצרו ${result.flashcards.length} כרטיסיות זיכרון`,
        });
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת הכרטיסיות. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextCard = () => {
    if (flashcardsData && currentCard < flashcardsData.flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
      case 'קל':
        return 'bg-green-100 text-green-800';
      case 'medium':
      case 'בינוני':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
      case 'קשה':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">כרטיסיות זיכרון</h1>
          <p className="text-gray-600">כרטיסיות ללמידה מהירה ויעילה</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הגדרות הכרטיסיות</CardTitle>
          <CardDescription>
            הזן את הנושא והמושגים לכרטיסיות הזיכרון
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="topic">נושא הכרטיסיות</Label>
              <Input
                id="topic"
                placeholder="לדוגמה: מילים באנגלית"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
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
              <Label>מושגים לכרטיסיות</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addConcept}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                הוסף מושג
              </Button>
            </div>
            
            <div className="space-y-3">
              {concepts.map((concept, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`מושג ${index + 1}`}
                    value={concept}
                    onChange={(e) => updateConcept(index, e.target.value)}
                    className="flex-1"
                  />
                  {concepts.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeConcept(index)}
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
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                יוצר כרטיסיות...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                צור כרטיסיות זיכרון
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {flashcardsData && (
        <Card>
          <CardHeader>
            <CardTitle>{flashcardsData.title}</CardTitle>
            <CardDescription>
              כרטיסייה {currentCard + 1} מתוך {flashcardsData.flashcards.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={prevCard}
                disabled={currentCard === 0}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {flashcardsData.flashcards[currentCard].category}
                </Badge>
                <Badge className={getDifficultyColor(flashcardsData.flashcards[currentCard].difficulty)}>
                  {flashcardsData.flashcards[currentCard].difficulty}
                </Badge>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={nextCard}
                disabled={currentCard === flashcardsData.flashcards.length - 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>

            <div 
              className="relative h-64 cursor-pointer perspective-1000"
              onClick={flipCard}
            >
              <div className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl flex items-center justify-center p-6">
                  <div className="text-center">
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                      {flashcardsData.flashcards[currentCard].front}
                    </p>
                    <p className="text-sm text-gray-500">לחץ להיפוך</p>
                  </div>
                </div>
                
                {/* Back of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl flex items-center justify-center p-6">
                  <div className="text-center">
                    <p className="text-xl font-semibold text-gray-900">
                      {flashcardsData.flashcards[currentCard].back}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={flipCard}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                הפוך כרטיסייה
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}