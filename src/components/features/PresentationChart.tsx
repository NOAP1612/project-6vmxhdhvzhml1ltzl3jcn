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
        const RADIAN = Math.PI / 180;
        const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name, index }) => {
          // Calculate position for labels outside the pie
          const radius = outerRadius + 60; // Increased distance from pie
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);

          // Adjust vertical position to prevent overlap
          const adjustedY = y + (index % 2 === 0 ? -10 : 10);

          return (
            <g>
              {/* Connection line from pie to label */}
              <line
                x1={cx + (outerRadius + 5) * Math.cos(-midAngle * RADIAN)}
                y1={cy + (outerRadius + 5) * Math.sin(-midAngle * RADIAN)}
                x2={cx + (outerRadius + 40) * Math.cos(-midAngle * RADIAN)}
                y2={cy + (outerRadius + 40) * Math.sin(-midAngle * RADIAN)}
                stroke="white"
                strokeWidth={1}
                opacity={0.8}
              />
              {/* Horizontal line */}
              <line
                x1={cx + (outerRadius + 40) * Math.cos(-midAngle * RADIAN)}
                y1={cy + (outerRadius + 40) * Math.sin(-midAngle * RADIAN)}
                x2={x > cx ? x - 10 : x + 10}
                y2={adjustedY}
                stroke="white"
                strokeWidth={1}
                opacity={0.8}
              />
              {/* Label text */}
              <text
                x={x > cx ? x - 5 : x + 5}
                y={adjustedY}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
                className="pointer-events-none"
                style={{ 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  fontWeight: '500'
                }}
              >
                {`${name} (${(percent * 100).toFixed(0)}%)`}
              </text>
            </g>
          );
        };

        return (
          <ResponsiveContainer width="100%" height={450}>
            <PieChart margin={{ top: 60, right: 120, bottom: 60, left: 120 }}>
              <Pie
                data={chartData.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={70}
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
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={chartData.data} margin={{ top: 40, right: 80, bottom: 40, left: 80 }}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ fill: 'white', fontSize: 10 }}
                className="text-white"
                tickFormatter={(value) => {
                  // Truncate long labels to prevent overlap
                  return value.length > 15 ? value.substring(0, 12) + '...' : value;
                }}
              />
              <PolarRadiusAxis 
                tick={{ fill: 'white', fontSize: 8 }}
                tickCount={4}
                angle={90}
              />
              <Radar 
                name="Value" 
                dataKey="value" 
                stroke={themeColors[0]} 
                fill={themeColors[0]} 
                fillOpacity={0.6} 
                strokeWidth={2} 
              />
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