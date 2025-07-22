import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Settings, BrainCircuit } from "lucide-react";
import { FileUpload } from './FileUpload';
import { LanguageSelect } from './LanguageSelect';
import { NumQuestionsSelect } from './NumQuestionsSelect';
import { QuestionTypeSelect } from './QuestionTypeSelect';

interface QuizSettingsProps {
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
  isUploading,
  fileName,
  handleFileChange,
  handleClearFile,
  uploadProgress,
  fileInputRef,
  topic,
  setTopic,
  numQuestions,
  setNumQuestions,
  questionType,
  setQuestionType,
  language,
  setLanguage,
  handleGenerate,
  isLoading,
}: QuizSettingsProps) => {
  const isGenerateDisabled = isLoading || isUploading || !topic.trim();

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-indigo-100 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-md">
            <Settings className="w-6 h-6 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">הגדרות שאלון</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FileUpload
              isUploading={isUploading}
              fileName={fileName}
              handleFileChange={handleFileChange}
              handleClearFile={handleClearFile}
              uploadProgress={uploadProgress}
              fileInputRef={fileInputRef}
            />
            <div className="relative">
              <Label htmlFor="topic-textarea">או הדבק טקסט כאן</Label>
              <Textarea
                id="topic-textarea"
                placeholder="הדבק כאן את הטקסט שממנו תרצה ליצור שאלון..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={8}
                className="bg-white focus:border-indigo-400"
                disabled={isUploading || !!fileName}
              />
            </div>
          </div>
          <div className="space-y-4">
            <NumQuestionsSelect
              value={numQuestions}
              onChange={setNumQuestions}
              disabled={isLoading}
            />
            <QuestionTypeSelect
              value={questionType}
              onChange={setQuestionType}
              disabled={isLoading}
            />
            <LanguageSelect
              value={language}
              onChange={setLanguage}
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerateDisabled}
          className="w-full py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              יוצר שאלון...
            </>
          ) : (
            <>
              <BrainCircuit className="w-6 h-6 mr-2" />
              צור שאלון
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};