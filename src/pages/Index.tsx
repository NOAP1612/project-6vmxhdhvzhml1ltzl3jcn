import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizGenerator } from "@/components/QuizGenerator";
import { SummaryTable } from "@/components/SummaryTable";
import { ChartGenerator } from "@/components/ChartGenerator";
import { BrainCircuit, FileText, BarChart2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            מערכת חכמה ליצירת חומרי למידה
          </h1>
        </div>
      </header>
      <main className="py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Tabs defaultValue="quiz" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-200 rounded-lg p-1">
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" />
                מחולל בחנים
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                טבלאות סיכום
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                מחולל תרשימים
              </TabsTrigger>
            </TabsList>
            <TabsContent value="quiz">
              <QuizGenerator />
            </TabsContent>
            <TabsContent value="summary">
              <SummaryTable />
            </TabsContent>
            <TabsContent value="charts">
              <ChartGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;