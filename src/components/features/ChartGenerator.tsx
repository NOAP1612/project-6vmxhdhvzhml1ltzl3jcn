import { BarChart, Bar, PieChart, Pie, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { useChartGenerator, ChartData } from "@/hooks/useChartGenerator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, X, Loader2, Download, BarChart3 } from "lucide-react";
import { downloadChartAsPNG } from "@/utils/chartDownload";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";
import { FileUpload } from "./FileUpload";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const renderChart = (chart: ChartData) => {
  const chartContainer = (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>{chart.title}</h3>
      {
        (() => {
          switch (chart.type) {
            case "bar":
              return (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chart.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              );
            case "pie":
              return (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={chart.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                      {chart.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              );
            case "line":
              return (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chart.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              );
            case "area":
                return (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                );
            default:
              return <p>סוג תרשים לא נתמך: {chart.type}</p>;
          }
        })()
      }
    </div>
  );

  return { chartContainer, chartElement: chartContainer };
};

export function ChartGenerator() {
  const {
    sourceText, setSourceText,
    fileName,
    isUploading,
    uploadProgress,
    isLoading,
    chartsData,
    fileInputRef,
    handleFileChange,
    handleGenerateCharts,
    handleReset,
  } = useChartGenerator();

  const { toast } = useToast();
  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDownloadChart = async (chartIndex: number, chartTitle: string) => {
    const chartElement = chartRefs.current[chartIndex];
    if (!chartElement) {
      toast({
        title: "שגיאה",
        description: "לא ניתן למצוא את הגרף להורדה",
        variant: "destructive",
      });
      return;
    }

    try {
      await downloadChartAsPNG(chartElement, chartTitle);
      toast({
        title: "הצלחה!",
        description: "הגרף הורד בהצלחה",
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בהורדת הגרף",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">יצירת גרפים</h1>
          <p className="text-gray-600">המר נתונים לגרפים ויזואליים מרהיבים</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הזנת נתונים</CardTitle>
          <CardDescription>הדבק טקסט או העלה קובץ כדי ליצור ממנו גרפים</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            fileName={fileName}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onClearFile={handleReset}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">או</span>
            </div>
          </div>

          <Textarea
            placeholder="הדבק כאן את הטקסט שלך..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="h-48"
            disabled={isUploading || !!fileName}
          />
          
          <div className="flex gap-4">
            <Button onClick={handleGenerateCharts} disabled={isLoading || isUploading || !sourceText.trim()}>
              {isLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "יוצר גרפים..." : "צור גרפים"}
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={isLoading || isUploading}>
              נקה הכל
            </Button>
          </div>
        </CardContent>
      </Card>

      {chartsData && (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {chartsData.charts.map((chart, index) => (
            <Card key={index} className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-center flex-1">{chart.title}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadChart(index, chart.title)}
                  className="ml-2"
                >
                  <Download className="h-4 w-4 ml-1" />
                  הורד PNG
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="w-full"
                  ref={(el) => (chartRefs.current[index] = el)}
                >
                  {renderChart(chart).chartContainer}
                </div>
                {chart.explanation && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border-r-4 border-blue-500">
                    <h4 className="font-semibold text-gray-800 mb-2">פירוט הגרף:</h4>
                    <p className="text-gray-700 leading-relaxed">{chart.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}