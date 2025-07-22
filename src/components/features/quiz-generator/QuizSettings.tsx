import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileQuestion, Loader2 } from "lucide-react";
import { DriveLinkInput } from "./DriveLinkInput";
import { FileUpload } from "./FileUpload";

interface QuizSettingsProps {
  driveLink: string;
  setDriveLink: (value: string) => void;
  handleDriveLinkProcess: () => void;
  isProcessingDrive: boolean;
  isUploading: boolean;
  fileName: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearFile: () => void;
  uploadProgress: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  topic: string;
  setTopic: (value: string) => void;
  numQuestions: string;
  setNumQuestions: (value: string) => void;
  questionType: string;
  setQuestionType: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  handleGenerate: () => void;
  isLoading: boolean;
}

export const QuizSettings = ({
  driveLink, setDriveLink, handleDriveLinkProcess, isProcessingDrive, isUploading,
  fileName, handleFileChange, handleClearFile, uploadProgress, fileInputRef,
  topic, setTopic,
  numQuestions, setNumQuestions,
  questionType, setQuestionType,
  language, setLanguage,
  handleGenerate, isLoading
}: QuizSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>הגדרות השאלון</CardTitle>
        <CardDescription>
          הזן את פרטי השאלון שברצונך ליצור, או העלה קובץ PDF או הדבק קישור לדרייב כדי ליצור שאלון מהתוכן שלו.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DriveLinkInput
          driveLink={driveLink}
          setDriveLink={setDriveLink}
          handleDriveLinkProcess={handleDriveLinkProcess}
          isProcessingDrive={isProcessingDrive}
          isUploading={isUploading}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">או</span>
          </div>
        </div>

        <FileUpload
          fileName={fileName}
          handleFileChange={handleFileChange}
          handleClearFile={handleClearFile}
          isUploading={isUploading}
          isProcessingDrive={isProcessingDrive}
          uploadProgress={uploadProgress}
          fileInputRef={fileInputRef}
          driveLink={driveLink}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">או</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="topic">נושא השאלון (או הטקסט שחולץ)</Label>
            <Textarea
              id="topic"
              placeholder="לדוגמה: היסטוריה של ישראל, או הדבק טקסט כאן"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-32"
              disabled={isUploading || isProcessingDrive}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numQuestions">מספר שאלות</Label>
            <Select value={numQuestions} onValueChange={setNumQuestions}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 שאלות</SelectItem>
                <SelectItem value="5">5 שאלות</SelectItem>
                <SelectItem value="10">10 שאלות</SelectItem>
                <SelectItem value="15">15 שאלות</SelectItem>
                <SelectItem value="20">20 שאלות</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="questionType">סוג השאלות</Label>
            <Select value={questionType} onValueChange={setQuestionType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple">שאלות אמריקאיות</SelectItem>
                <SelectItem value="open">שאלות פתוחות</SelectItem>
                <SelectItem value="mixed">מעורב</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="language">שפה</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hebrew">עברית</SelectItem>
                <SelectItem value="english">אנגלית</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading || isUploading || isProcessingDrive}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              יוצר שאלות...
            </>
          ) : (
            <>
              <FileQuestion className="w-4 h-4 mr-2" />
              צור שאלון
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};