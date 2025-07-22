import { useChartGenerator, ChartData } from '@/hooks/useChartGenerator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, BarChart, PieChart, LineChart, AreaChart, X } from 'lucide-react';
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie, Cell, Line } from 'recharts';

const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const ChartDisplay = ({ chart }: { chart: ChartData }) => {
  const renderChart = () => {
    switch (chart.type) {
      case 'bar':
        return (
          <BarChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie data={chart.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
              {chart.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case 'line':
        return (
          <LineChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        );
      default:
        return <p>סוג תרשים לא נתמך: {chart.type}</p>;
    }
  };

  const getIcon = () => {
    switch (chart.type) {
      case 'bar': return <BarChart className="h-5 w-5 text-gray-500" />;
      case 'pie': return <PieChart className="h-5 w-5 text-gray-500" />;
      case 'line': return <LineChart className="h-5 w-5 text-gray-500" />;
      default: return <AreaChart className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {getIcon()}
          {chart.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const ChartGenerator = () => {
  const {
    sourceText, setSourceText,
    fileName,
    isUploading,
    isLoading,
    chartsData,
    fileInputRef,
    handleFileChange,
    handleGenerateCharts,
    handleReset,
  } = useChartGenerator();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">מחולל גרפים מטקסט</h1>
        <p className="text-gray-600 mt-2">הפוך טקסט גולמי או מסמכים לתובנות ויזואליות באופן אוטומטי.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Textarea
              placeholder="הדבק כאן את הטקסט שלך..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="min-h-[150px] text-base"
              disabled={isUploading || isLoading}
            />
            <div className="flex items-center justify-between">
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading || isLoading}>
                <Upload className="ml-2 h-4 w-4" />
                {isUploading ? 'מעלה...' : 'העלה קובץ PDF'}
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
              {fileName && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{fileName}</span>
                  <Button variant="ghost" size="icon" onClick={handleReset} disabled={isUploading || isLoading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button onClick={handleGenerateCharts} disabled={isLoading || isUploading || !sourceText} size="lg">
              {isLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
              צור גרפים
            </Button>
          </div>
        </CardContent>
      </Card>

      {(isLoading || isUploading) && (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-lg font-semibold">{isUploading ? 'מעבד את הקובץ...' : 'מנתח את הטקסט ובונה גרפים...'}</p>
          <p className="text-gray-500">זה עשוי לקחת מספר רגעים...</p>
        </div>
      )}

      {chartsData && chartsData.charts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">הגרפים שנוצרו</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {chartsData.charts.map((chart, index) => (
              <ChartDisplay key={index} chart={chart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};