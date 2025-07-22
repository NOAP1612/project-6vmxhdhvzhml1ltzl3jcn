import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { invokeLLM, uploadFile, extractDataFromUploadedFile } from "@/integrations/core";
import { generateFormulaSheet } from "@/functions";

export interface ChartSuggestion {
// ... keep existing code
}

export interface ChartData {
// ... keep existing code
}

export interface GeneratedChart {
  title: string;
  type: 'bar' | 'pie' | 'line' | 'area' | 'composed';
  data: ChartData[];
}

export const useChartGenerator = () => {
// ... keep existing code
  const [chartSuggestions, setChartSuggestions] = useState<ChartSuggestion[]>([]);
  const [selectedChart, setSelectedChart] = useState<ChartSuggestion | null>(null);
  const [chartData, setChartData] = useState<ChartData[] | null>(null);
  const [formulaSheet, setFormulaSheet] = useState<GeneratedChart[] | null>(null);
  const [isGeneratingSheet, setIsGeneratingSheet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
// ... keep existing code
  const handleGenerateChart = async (suggestion: ChartSuggestion) => {
// ... keep existing code
    try {
      const prompt = `Based on the following text and the chart suggestion, generate the data for the chart.

Text:
${sourceText}

Chart Suggestion:
Title: ${suggestion.title}
Description: ${suggestion.description}
Type: ${suggestion.type}

Return the data in the following JSON format, with at least 3 data points:
{
  "data": [
    {"name": "Category 1", "value": 10},
    {"name": "Category 2", "value": 20}
  ]
}`;
      const result = await invokeLLM({
// ... keep existing code
      if (result && result.data) {
        setChartData(result.data as ChartData[]);
      } else {
        throw new Error("Invalid chart data received");
      }
    } catch (error) {
// ... keep existing code
      setSelectedChart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFormulaSheet = async () => {
    if (!sourceText.trim()) {
      toast({ title: "שגיאה", description: "אנא הזן טקסט או העלה קובץ תחילה", variant: "destructive" });
      return;
    }
    setIsGeneratingSheet(true);
    setFormulaSheet(null);
    setChartSuggestions([]);
    setChartData(null);
    setSelectedChart(null);
    try {
      const result = await generateFormulaSheet({ text: sourceText });
      if (result && result.charts) {
        setFormulaSheet(result.charts);
        toast({ title: "הצלחה!", description: `דף הנוסחאות נוצר עם ${result.charts.length} תרשימים.` });
      } else {
        throw new Error("Invalid data received from formula sheet generator");
      }
    } catch (error) {
      console.error("Error generating formula sheet:", error);
      toast({ title: "שגיאה", description: "אירעה שגיאה ביצירת דף הנוסחאות.", variant: "destructive" });
    } finally {
      setIsGeneratingSheet(false);
    }
  };

  const handleReset = () => {
// ... keep existing code
    setChartData(null);
  };
  
  const handleFullReset = () => {
// ... keep existing code
    setChartSuggestions([]);
    setSelectedChart(null);
    setChartData(null);
    setFormulaSheet(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return {
// ... keep existing code
    chartSuggestions,
    selectedChart,
    chartData,
    formulaSheet,
    isGeneratingSheet,
    fileInputRef,
    handleFileChange,
// ... keep existing code
    handleGenerateChart,
    handleGenerateFormulaSheet,
    handleReset,
    handleFullReset,
  };
};
