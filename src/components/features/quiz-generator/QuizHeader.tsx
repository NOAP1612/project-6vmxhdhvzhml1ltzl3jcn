import { FileQuestion } from "lucide-react";

export const QuizHeader = () => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
      <FileQuestion className="w-6 h-6 text-white" />
    </div>
    <div>
      <h1 className="text-3xl font-bold text-gray-900">יצירת שאלון</h1>
      <p className="text-gray-600">צור שאלות מותאמות אישית לכל נושא</p>
    </div>
  </div>
);