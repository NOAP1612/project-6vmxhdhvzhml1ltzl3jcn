import React from 'react';
import { useChartGenerator, ChartData, GeneratedChart } from '@/hooks/useChartGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, X, Wand2, BarChart, PieChart, LineChart, AreaChart } from 'lucide-react';
import { Bar, BarChart as ReBarChart, Pie, PieChart as RePieChart, Line, LineChart as ReLineChart, Area, AreaChart as ReAreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ChartComponent = ({ chart }: { chart: GeneratedChart }) => {
  const renderChart = () => {
    switch (chart.type) {
      case 'bar':
        return (
          <ReBarChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </ReBarChart>
        );
      case 'pie':
        return (
          <RePieChart>
            <Pie data={chart.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
              {chart.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RePieChart>
        );
      case 'line':
        return (
          <ReLineChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </ReLineChart>
        );
      case 'area':
        return (
          <ReAreaChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
          </ReAreaChart>
        );
      default:
        return <p>סוג תרשים לא נתמך: {chart.type}</p>;
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-center text-center">{chart.title}</CardTitle>
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
    fileName, handleFileChange, handleClearFile, fileInputRef,
    isUploading, uploadProgress,
    isLoading,
    isGeneratingSheet,
    formulaSheet,
    handleGenerateFormulaSheet,
    handleFullReset,
  } = useChartGenerator();

  const showGetStarted = !sourceText && !fileName && !formulaSheet;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto" dir="rtl">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">מחולל תרשימים מטקסט</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Textarea
              placeholder="הדבק כאן טקסט או העלה קובץ PDF..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full p-2 border rounded"
              rows={8}
            />
            <div className="flex items-center gap-2">
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                <Upload className="ml-2 h-4 w-4" />
                {isUploading ? 'מעלה...' : 'העלה PDF'}
              </Button>
              <Input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
              {fileName && (
                <div className="flex items-center gap-2 text-sm">
                  <span>{fileName}</span>
                  <Button variant="ghost" size="icon" onClick={handleClearFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {isUploading && <p className="text-sm text-blue-600">{uploadProgress}</p>}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button onClick={handleGenerateFormulaSheet} disabled={isGeneratingSheet || isLoading || !sourceText}>
              {isGeneratingSheet || isLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Wand2 className="ml-2 h-4 w-4" />}
              {isGeneratingSheet ? 'יוצר דף נוסחאות...' : 'צור דף נוסחאות חזותי'}
            </Button>
             <Button onClick={handleFullReset} variant="outline">
                נקה הכל
            </Button>
          </div>
        </CardContent>
      </Card>

      {showGetStarted && (
        <div className="text-center mt-8 p-8 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">איך מתחילים?</h3>
            <p className="text-gray-600 mb-2">1. הדבק טקסט בתיבה למעלה או העלה קובץ PDF.</p>
            <p className="text-gray-600">2. לחץ על "צור דף נוסחאות חזותי" כדי להפוך את המידע שלך לתרשימים באופן אוטומטי.</p>
        </div>
      )}

      {formulaSheet && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-center mb-4">דף הנוסחאות החזותי שלך</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {formulaSheet.map((chart, index) => (
              <ChartComponent key={index} chart={chart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};