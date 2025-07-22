import { useChartGenerator } from '@/hooks/useChartGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, FileText, X, Wand2, Download } from 'lucide-react';
import { BarChart, PieChart, LineChart, AreaChart, RadarChart, Treemap, ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, Legend, Pie, Cell, Line, Area, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import html2canvas from 'html2canvas';

export const ChartGenerator = () => {
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const downloadChart = (chartIndex: number) => {
    const chartElement = document.getElementById(`chart-${chartIndex}`);
    if (chartElement) {
      html2canvas(chartElement).then(canvas => {
        const link = document.createElement('a');
        link.download = `chart-${chartIndex + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const renderChart = (chartData: any, index: number) => {
    const { type, data, title, explanation } = chartData;

    return (
      <Card key={index} id={`chart-${index}`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer>
              {
                {
                  'bar': <BarChart data={data}><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="value" fill="#8884d8" /></BarChart>,
                  'pie': <PieChart><Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>{data.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart>,
                  'line': <LineChart data={data}><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="value" stroke="#8884d8" /></LineChart>,
                  'area': <AreaChart data={data}><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" /></AreaChart>,
                  'radar': <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}><PolarGrid /><PolarAngleAxis dataKey="name" /><PolarRadiusAxis /><Tooltip /><Radar name={title} dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} /><Legend /></RadarChart>,
                  'treemap': <Treemap width={400} height={200} data={data} dataKey="value" ratio={4/3} stroke="#fff" fill="#8884d8" />
                }[type] || <p>סוג גרף לא נתמך: {type}</p>
              }
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-4">{explanation}</p>
          <Button onClick={() => downloadChart(index)} variant="outline" size="sm" className="mt-4">
            <Download className="ml-2 h-4 w-4" />
            הורד גרף
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">יצירת גרפים</h1>
        <p className="text-lg text-gray-600 mt-2">הפוך טקסט או נתונים לגרפים ויזואליים בקלות.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>1. הזנת מקור מידע</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="הדבק כאן טקסט או נתונים..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            rows={8}
            disabled={!!fileName}
          />
          <div className="text-center text-sm text-gray-500">או</div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} variant="outline">
              <Upload className="ml-2 h-4 w-4" />
              העלה קובץ
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.txt"
            />
            {fileName && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                <FileText className="h-5 w-5 text-gray-500" />
                <span>{fileName}</span>
                <Button onClick={handleReset} variant="ghost" size="icon" className="h-6 w-6">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {isUploading && (
            <div className="flex items-center text-sm text-blue-600">
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              <span>{uploadProgress}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={handleGenerateCharts} disabled={isLoading || isUploading || !sourceText.trim()} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              יוצר גרפים...
            </>
          ) : (
            <>
              <Wand2 className="ml-2 h-5 w-5" />
              צור גרפים
            </>
          )}
        </Button>
      </div>

      {chartsData && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">הגרפים שנוצרו</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {chartsData.charts.map((chart, index) => renderChart(chart, index))}
          </div>
        </div>
      )}
    </div>
  );
};