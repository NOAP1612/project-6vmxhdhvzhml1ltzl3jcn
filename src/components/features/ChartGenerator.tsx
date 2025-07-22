import { useChartGenerator } from '@/hooks/useChartGenerator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileUp, X, Wand2, BarChart, PieChart, LineChart, AreaChart, RefreshCw } from 'lucide-react';
import { Bar, BarChart as ReBarChart, Pie, PieChart as RePieChart, Line, LineChart as ReLineChart, Area, AreaChart as ReAreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

const iconMap = {
  bar: <BarChart className="h-5 w-5" />,
  pie: <PieChart className="h-5 w-5" />,
  line: <LineChart className="h-5 w-5" />,
  area: <AreaChart className="h-5 w-5" />,
  composed: <BarChart className="h-5 w-5" />,
};

export const ChartGenerator = () => {
  const {
    sourceText, setSourceText,
    fileName,
    isUploading,
    uploadProgress,
    isLoading,
    chartSuggestions,
    selectedChart,
    chartData,
    fileInputRef,
    handleFileChange,
    handleClearFile,
    handleGetSuggestions,
    handleGenerateChart,
    handleReset,
    handleFullReset,
  } = useChartGenerator();

  const renderChart = () => {
    if (!chartData || !selectedChart) return null;

    const ChartComponent = {
      bar: ReBarChart,
      pie: RePieChart,
      line: ReLineChart,
      area: ReAreaChart,
      composed: ComposedChart,
    }[selectedChart.type];

    const ChartElement = {
        bar: <Bar dataKey="value" fill="#8884d8" />,
        pie: <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />,
        line: <Line type="monotone" dataKey="value" stroke="#8884d8" />,
        area: <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />,
        composed: (
            <>
                <Bar dataKey="value" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="value" stroke="#ff7300" />
            </>
        )
    }[selectedChart.type];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={chartData}>
          {selectedChart.type !== 'pie' && <CartesianGrid strokeDasharray="3 3" />}
          {selectedChart.type !== 'pie' && <XAxis dataKey="name" />}
          {selectedChart.type !== 'pie' && <YAxis />}
          <Tooltip />
          <Legend />
          {ChartElement}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">מחולל תרשימים</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="source-text">הדבק טקסט או העלה קובץ PDF</Label>
            <Textarea
              id="source-text"
              placeholder="הזן כאן את הטקסט שלך..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="mt-1"
              rows={8}
              disabled={isUploading || !!fileName}
            />
          </div>
          <div className="flex items-center justify-between">
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading || !!sourceText} variant="outline">
              <FileUp className="ml-2 h-4 w-4" />
              העלה קובץ PDF
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
            {isUploading && <div className="text-sm text-gray-500 flex items-center"><Loader2 className="animate-spin ml-2" /> {uploadProgress}</div>}
            {fileName && !isUploading && (
              <div className="text-sm text-gray-500 flex items-center">
                <span>{fileName}</span>
                <Button variant="ghost" size="sm" onClick={handleClearFile}><X className="h-4 w-4" /></Button>
              </div>
            )}
          </div>
          <Button onClick={handleGetSuggestions} disabled={isLoading || (!sourceText && !fileName)}>
            {isLoading && !chartSuggestions.length ? <Loader2 className="animate-spin ml-2" /> : <Wand2 className="ml-2 h-4 w-4" />}
            קבל הצעות לתרשימים
          </Button>
        </CardContent>
      </Card>

      {isLoading && !chartSuggestions.length && (
        <div className="text-center p-4">
          <Loader2 className="animate-spin mx-auto h-8 w-8 text-gray-500" />
          <p className="mt-2 text-gray-600">מנתח את הטקסט ומחפש הצעות...</p>
        </div>
      )}

      {chartSuggestions.length > 0 && !selectedChart && (
        <Card>
          <CardHeader>
            <CardTitle>הצעות לתרשימים</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chartSuggestions.map((suggestion, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleGenerateChart(suggestion)}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{suggestion.title}</CardTitle>
                  {iconMap[suggestion.type]}
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedChart && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedChart.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center p-4">
                <Loader2 className="animate-spin mx-auto h-8 w-8 text-gray-500" />
                <p className="mt-2 text-gray-600">יוצר את התרשים...</p>
              </div>
            ) : (
              renderChart()
            )}
            <Button onClick={handleReset} variant="outline" className="mt-4">
              <RefreshCw className="ml-2 h-4 w-4" />
              חזור להצעות
            </Button>
             <Button onClick={handleFullReset} variant="destructive" className="mt-4 mr-2">
              <X className="ml-2 h-4 w-4" />
              נקה הכל
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};