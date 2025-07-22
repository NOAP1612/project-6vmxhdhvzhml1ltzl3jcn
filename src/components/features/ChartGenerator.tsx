import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./FileUpload";
import { useChartGenerator, ChartSuggestion } from "@/hooks/useChartGenerator";
import { Loader2, BarChart, PieChartIcon, LineChart, AreaChart, Wand2, ArrowRight, RefreshCw } from "lucide-react";
import { ChartDisplay } from "./ChartDisplay";

const iconMap: Record<string, React.ReactNode> = {
    bar: <BarChart className="w-6 h-6 text-blue-600" />,
    pie: <PieChartIcon className="w-6 h-6 text-green-600" />,
    line: <LineChart className="w-6 h-6 text-red-600" />,
    area: <AreaChart className="w-6 h-6 text-purple-600" />,
    composed: <BarChart className="w-6 h-6 text-yellow-600" />,
};

const SuggestionCard = ({ suggestion, onClick, disabled }: { suggestion: ChartSuggestion, onClick: () => void, disabled: boolean }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-full text-right p-4 border rounded-lg hover:bg-gray-50/80 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4"
    >
        <div className="p-2 bg-gray-100 rounded-md">
            {iconMap[suggestion.type] || <BarChart className="w-6 h-6 text-gray-600" />}
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-gray-800">{suggestion.title}</h3>
            <p className="text-sm text-gray-600">{suggestion.description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
    </button>
);

export function ChartGenerator() {
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

    const showSuggestions = !isLoading && chartSuggestions.length > 0 && !chartData;
    const showChart = chartData && selectedChart;

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            {showChart ? (
                <div className="space-y-4">
                    <ChartDisplay data={chartData} type={selectedChart.type} title={selectedChart.title} />
                    <div className="flex gap-2">
                        <Button onClick={handleReset} variant="outline">
                            <RefreshCw className="w-4 h-4 ml-2" />
                            בחר הצעה אחרת
                        </Button>
                         <Button onClick={handleFullReset}>
                            התחל מחדש
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="text-center">
                        <div className="inline-block p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                            <Wand2 className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mt-4">מחולל תרשימים חכם</h1>
                        <p className="text-lg text-gray-600 mt-2">הפוך טקסט ונתונים לתרשימים ויזואליים בקלות</p>
                    </div>

                    <Card className="relative">
                         {(isUploading || isLoading) && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                <p className="text-lg font-semibold text-gray-700">
                                    {isUploading ? uploadProgress : (selectedChart ? `יוצר תרשים: ${selectedChart.title}` : 'מחפש רעיונות...')}
                                </p>
                                <p className="text-sm text-gray-500">זה עשוי לקחת מספר רגעים...</p>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle>שלב 1: ספק את המידע</CardTitle>
                            <CardDescription>
                                העלה קובץ PDF או הדבק טקסט כדי להתחיל.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FileUpload
                                fileName={fileName}
                                isUploading={isUploading}
                                uploadProgress={uploadProgress}
                                fileInputRef={fileInputRef}
                                onFileChange={handleFileChange}
                                onClearFile={handleClearFile}
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

                            <Button 
                                onClick={handleGetSuggestions} 
                                disabled={isLoading || !sourceText.trim()}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                <Wand2 className="w-4 h-4 ml-2" />
                                {isLoading ? "מחפש רעיונות..." : "שלב 2: קבל הצעות לתרשימים"}
                            </Button>
                        </CardContent>
                    </Card>

                    {showSuggestions && (
                        <Card className="animate-fade-in">
                            <CardHeader>
                                <CardTitle>הצעות לתרשימים</CardTitle>
                                <CardDescription>בחר אחת מההצעות הבאות כדי ליצור תרשים.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                                {chartSuggestions.map((suggestion, index) => (
                                    <SuggestionCard
                                        key={index}
                                        suggestion={suggestion}
                                        onClick={() => handleGenerateChart(suggestion)}
                                        disabled={isLoading}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}