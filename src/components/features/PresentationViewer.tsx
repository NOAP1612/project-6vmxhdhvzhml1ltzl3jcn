import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { PresentationData } from "@/hooks/usePresentationGenerator";
import { PresentationChart } from "./PresentationChart";
import { useToast } from "@/hooks/use-toast";

interface PresentationViewerProps {
  presentation: PresentationData;
  theme: string;
  onClose: () => void;
}

export function PresentationViewer({ presentation, theme, onClose }: PresentationViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const themeClasses = {
    modern: 'from-blue-600 to-purple-600',
    professional: 'from-gray-700 to-blue-800',
    creative: 'from-pink-500 to-orange-500',
    nature: 'from-green-600 to-teal-600',
    elegant: 'from-purple-800 to-indigo-900'
  };

  const nextSlide = () => {
    if (currentSlide < presentation.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') onClose();
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      // Create a temporary container for the slide
      const slideElement = document.querySelector('.presentation-slide');
      if (!slideElement) {
        throw new Error('לא נמצא אלמנט השקף');
      }

      // Capture the current slide with higher quality
      const canvas = await html2canvas(slideElement as HTMLElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: slideElement.clientWidth,
        height: slideElement.clientHeight,
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${presentation.title}_שקף_${currentSlide + 1}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "הצלחה!",
        description: "השקף הורד בהצלחה",
      });
    } catch (error) {
      console.error('Error downloading slide:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בהורדת השקף. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const currentSlideData = presentation.slides[currentSlide];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-white bg-black bg-opacity-50">
            {currentSlide + 1} / {presentation.slides.length}
          </Badge>
          <h2 className="text-white font-semibold">{presentation.title}</h2>
          {currentSlideData.visual?.type === 'chart' && (
            <Badge variant="outline" className="text-white border-white">
              📊 גרף
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDownload}
            disabled={isDownloading}
            className="text-white hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <Download className="h-4 w-4 ml-2" />
            {isDownloading ? 'מוריד...' : 'הורד שקף'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="w-full max-w-6xl mx-4">
        <Card className={`presentation-slide bg-gradient-to-br ${themeClasses[theme as keyof typeof themeClasses]} text-white border-0 shadow-2xl`}>
          <CardContent className="p-12 min-h-[600px] flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-8 text-center">
              {currentSlideData.title}
            </h1>
            
            <div className="space-y-4 text-lg text-center max-w-3xl">
              {currentSlideData.content.map((point, index) => (
                <p key={index} className="leading-relaxed">{point}</p>
              ))}
            </div>

            {/* Chart Display - Only show if chart exists */}
            {currentSlideData.visual?.type === 'chart' && currentSlideData.visual.data && (
              <PresentationChart 
                chartData={currentSlideData.visual.data} 
                theme={theme}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <Button
          variant="ghost"
          size="lg"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="text-white hover:bg-white hover:bg-opacity-20 disabled:opacity-50"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        
        <div className="flex gap-2">
          {presentation.slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all relative ${
                index === currentSlide 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            >
              {slide.visual?.type === 'chart' && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="lg"
          onClick={nextSlide}
          disabled={currentSlide === presentation.slides.length - 1}
          className="text-white hover:bg-white hover:bg-opacity-20 disabled:opacity-50"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}