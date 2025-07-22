import { usePresentationGenerator } from '@/hooks/usePresentationGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, FileText, X, Wand2, Download } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { BarChart, PieChart, LineChart, AreaChart, RadarChart, Treemap } from 'recharts';
import html2canvas from 'html2canvas';

export const PresentationGenerator = () => {
  const {
    topic, setTopic,
    fileName,
    slideCount, setSlideCount,
    isUploading,
    uploadProgress,
    isLoading,
    presentationData,
    selectedTheme, setSelectedTheme,
    themes,
    fileInputRef,
    handleFileChange,
    handleGeneratePresentation,
    handleReset,
  } = usePresentationGenerator();

  const renderChart = (chartData: any) => {
    const { type, data, title } = chartData;
    const ChartComponent = {
      bar: BarChart,
      pie: PieChart,
      line: LineChart,
      area: AreaChart,
      radar: RadarChart,
      treemap: Treemap,
    }[type];

    return (
      <div className="w-full h-64">
        <h4 className="text-center font-semibold mb-2">{title}</h4>
        {ChartComponent ? <ChartComponent data={data} /> : <p>סוג גרף לא נתמך</p>}
      </div>
    );
  };
  
  const downloadSlide = (slideIndex: number) => {
    const slideElement = document.getElementById(`slide-${slideIndex}`);
    if (slideElement) {
      html2canvas(slideElement).then(canvas => {
        const link = document.createElement('a');
        link.download = `slide-${slideIndex + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">יצירת מצגות</h1>
        <p className="text-lg text-gray-600 mt-2">הפוך כל טקסט למצגת מרשימה בכמה קליקים.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>1. הגדרות מצגת</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="נושא המצגת (לדוגמה: 'מבוא לבינה מלאכותית')"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} variant="outline" className="w-full">
              <Upload className="ml-2 h-4 w-4" />
              {fileName ? 'החלף קובץ' : 'העלה קובץ מקור (אופציונלי)'}
            </Button>
            {fileName && (
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span>{fileName}</span>
                </div>
                <Button onClick={handleReset} variant="ghost" size="icon" className="h-6 w-6">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {isUploading && (
              <div className="flex items-center text-sm text-blue-600">
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                <span>{uploadProgress}</span>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">מספר שקופיות</label>
              <Input
                type="number"
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                min="3"
                max="20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">בחר עיצוב</label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר עיצוב..." />
                </SelectTrigger>
                <SelectContent>
                  {themes.map(theme => (
                    <SelectItem key={theme.id} value={theme.id}>{theme.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center justify-center">
          <Button onClick={handleGeneratePresentation} disabled={isLoading || isUploading} size="lg" className="w-full lg:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                יוצר מצגת...
              </>
            ) : (
              <>
                <Wand2 className="ml-2 h-5 w-5" />
                צור מצגת
              </>
            )}
          </Button>
        </div>
      </div>

      {presentationData && (
        <Card>
          <CardHeader>
            <CardTitle>{presentationData.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full">
              <CarouselContent>
                {presentationData.slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div id={`slide-${index}`} className={`p-6 rounded-lg text-white bg-gradient-to-br ${themes.find(t => t.id === selectedTheme)?.colors}`}>
                      <h3 className="text-2xl font-bold mb-4">{slide.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ul className="space-y-2">
                          {slide.content.map((point, i) => (
                            <li key={i} className="text-lg">{point}</li>
                          ))}
                        </ul>
                        {slide.visual && (
                          <div className="flex items-center justify-center bg-white/20 p-4 rounded-md">
                            {slide.visual.type === 'chart' && slide.visual.data ? renderChart(slide.visual.data) : <img src={slide.visual.url} alt={slide.title} className="max-h-64 rounded-md" />}
                          </div>
                        )}
                      </div>
                      <Button onClick={() => downloadSlide(index)} variant="secondary" size="sm" className="mt-4">
                        <Download className="ml-2 h-4 w-4" />
                        הורד שקופית
                      </Button>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      )}
    </div>
  );
};