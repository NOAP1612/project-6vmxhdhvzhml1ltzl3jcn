import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ChartData } from '@/hooks/useChartGenerator';

interface PresentationChartProps {
  chartData: ChartData;
  theme?: string;
}

export function PresentationChart({ chartData, theme = 'modern' }: PresentationChartProps) {
  const colors = {
    modern: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'],
    professional: ['#374151', '#1F2937', '#4B5563', '#6B7280', '#9CA3AF'],
    creative: ['#EC4899', '#F97316', '#EF4444', '#8B5CF6', '#06B6D4'],
    nature: ['#059669', '#0D9488', '#047857', '#065F46', '#064E3B'],
    elegant: ['#7C3AED', '#5B21B6', '#6D28D9', '#8B5CF6', '#A855F7']
  };

  const themeColors = colors[theme as keyof typeof colors] || colors.modern;

  const renderChart = () => {
    switch (chartData.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis dataKey="name" tick={{ fill: 'white', fontSize: 12 }} />
              <YAxis tick={{ fill: 'white', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Bar dataKey="value" fill={themeColors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={themeColors[index % themeColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis dataKey="name" tick={{ fill: 'white', fontSize: 12 }} />
              <YAxis tick={{ fill: 'white', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Line type="monotone" dataKey="value" stroke={themeColors[0]} strokeWidth={3} dot={{ fill: themeColors[0], strokeWidth: 2, r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis dataKey="name" tick={{ fill: 'white', fontSize: 12 }} />
              <YAxis tick={{ fill: 'white', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Area type="monotone" dataKey="value" stroke={themeColors[0]} fill={themeColors[0]} fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={chartData.data}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis dataKey="name" tick={{ fill: 'white', fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fill: 'white', fontSize: 10 }} />
              <Radar name="Value" dataKey="value" stroke={themeColors[0]} fill={themeColors[0]} fillOpacity={0.6} strokeWidth={2} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-white">
            <p>סוג גרף לא נתמך: {chartData.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="mt-8 p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
      <h3 className="text-xl font-semibold mb-4 text-center text-white">
        {chartData.title}
      </h3>
      {renderChart()}
      {chartData.explanation && (
        <p className="text-sm text-white opacity-90 mt-4 text-center">
          {chartData.explanation}
        </p>
      )}
    </div>
  );
}