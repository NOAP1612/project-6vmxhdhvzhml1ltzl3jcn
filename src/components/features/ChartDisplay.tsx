import { BarChart, Bar, PieChart, Pie, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ComposedChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartData } from '@/hooks/useChartGenerator';

interface ChartDisplayProps {
    data: ChartData;
    type: 'bar' | 'pie' | 'line' | 'area' | 'composed';
    title: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const renderChart = (type: ChartDisplayProps['type'], data: ChartDisplayProps['data']) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500">אין נתונים להצגה</p>;
    }
    const dataKeys = Object.keys(data[0]).filter(key => key !== 'name' && typeof data[0][key] === 'number');

    switch (type) {
        case 'pie':
            return (
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value as number)} />
                    <Legend />
                </PieChart>
            );
        case 'bar':
            return (
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {dataKeys.map((key, index) => (
                        <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
                    ))}
                </BarChart>
            );
        case 'line':
             return (
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {dataKeys.map((key, index) => (
                         <Line key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} />
                    ))}
                </LineChart>
            );
        case 'area':
            return (
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {dataKeys.map((key, index) => (
                        <Area key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} fillOpacity={0.6} />
                    ))}
                </AreaChart>
            );
        case 'composed':
             return (
                <ComposedChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {dataKeys.map((key, index) => {
                        if (index === 0) return <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />;
                        return <Line key={key} type="monotone" dataKey={key} stroke={COLORS[(index + 1) % COLORS.length]} />;
                    })}
                </ComposedChart>
            );
        default:
            return <p>סוג גרף לא נתמך</p>;
    }
};

export function ChartDisplay({ data, type, title }: ChartDisplayProps) {
    return (
        <Card className="animate-fade-in">
            <CardHeader>
                <CardTitle className="text-center">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    {renderChart(type, data)}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}