import { BarChart, Bar, PieChart, Pie, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useChartGenerator, ChartData } from '@/hooks/useChartGenerator';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card';
import { Upload, X, Loader2 } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const renderChart = (chart: ChartData) => {
  switch (chart.type) {
    case 'bar':
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
    case 'pie':
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
    case 'line':
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
    case 'area':
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>מחולל תרשימים</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="הדבק כאן טקסט או העלה קובץ..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="min-h-[150px]"
            disabled={isUploading || isLoading}
          />
          <div className="flex items-center justify-between gap-4">
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading || isLoading}>
              <Upload className="ml-2 h-4 w-4" />
              העלה קובץ
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.txt"
            />
            {fileName && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{fileName}</span>
                <Button variant="ghost" size="icon" onClick={handleReset} disabled={isUploading || isLoading}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {isUploading && <p className="text-sm text-blue-600">{uploadProgress}</p>}
          </div>
          <div className="flex gap-4">
            <Button onClick={handleGenerateCharts} disabled={isLoading || isUploading || !sourceText}>
              {isLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'יוצר גרפים...' : 'צור גרפים'}
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={isLoading || isUploading}>
              נקה
            </Button>
          </div>
        </CardContent>
      </Card>

      {chartsData && (
        <div className="grid gap-6 md:grid-cols-2">
          {chartsData.charts.map((chart, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{chart.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderChart(chart)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}