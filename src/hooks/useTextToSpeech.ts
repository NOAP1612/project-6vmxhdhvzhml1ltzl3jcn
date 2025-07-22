import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { uploadFile, extractDataFromUploadedFile } from "@/integrations/core";

export const useTextToSpeech = () => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  // Load available voices
  const loadVoices = () => {
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);
    
    // Try to find Hebrew voice or Fable-like voice
    const hebrewVoice = availableVoices.find(voice => 
      voice.lang.includes('he') || voice.name.toLowerCase().includes('hebrew')
    );
    const fableVoice = availableVoices.find(voice => 
      voice.name.toLowerCase().includes('fable') || 
      voice.name.toLowerCase().includes('daniel') ||
      voice.name.toLowerCase().includes('david')
    );
    
    if (fableVoice) {
      setSelectedVoice(fableVoice.name);
    } else if (hebrewVoice) {
      setSelectedVoice(hebrewVoice.name);
    } else if (availableVoices.length > 0) {
      setSelectedVoice(availableVoices[0].name);
    }
  };

  // Initialize voices when component mounts
  useState(() => {
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  });

  const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.type.startsWith('text/')) {
      toast({
        title: "קובץ לא נתמך",
        description: "אנא העלה קובץ PDF או טקסט בלבד.",
        variant: "destructive",
      });
      return;
    }

    setFileName(selectedFile.name);
    setIsUploading(true);
    setText('');
    setUploadProgress('מעלה קובץ...');

    try {
      toast({
        title: "מעלה קובץ...",
        description: "שלב 1 מתוך 2: מעלה את הקובץ לשרת.",
      });
      
      const { file_url } = await withTimeout(uploadFile({ file: selectedFile }), 300000);

      setUploadProgress('מעבד את הקובץ...');
      toast({
        title: "מעבד את הקובץ...",
        description: "שלב 2 מתוך 2: מחלץ טקסט מהקובץ.",
      });
      
      const schema = {
        type: "object",
        properties: { text_content: { type: "string" } },
        required: ["text_content"],
      };

      const result = await withTimeout(extractDataFromUploadedFile({ file_url, json_schema: schema }), 600000);

      if (result.status === 'success' && result.output && typeof (result.output as any).text_content === 'string') {
        const content = (result.output as { text_content: string }).text_content;
        setText(content);
        setUploadProgress('הושלם בהצלחה!');
        toast({
          title: "הצלחה!",
          description: "הטקסט מהקובץ חולץ בהצלחה. כעת תוכל להקריא אותו.",
        });
      } else {
        throw new Error(result.details || "Failed to extract text from file.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      let description = "לא הצלחנו לחלץ את הטקסט מהקובץ. אנא ודא שהקובץ תקין ונסה שוב.";
      if (error instanceof Error && error.message === 'Request timeout') {
        description = "הבקשה ארכה יותר מדי זמן. אנא נסה שוב עם קובץ קטן יותר.";
      }
      toast({
        title: "שגיאה בעיבוד הקובץ",
        description: description,
        variant: "destructive",
      });
      setFileName('');
      setUploadProgress('');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePlay = () => {
    if (!text.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן טקסט או העלה קובץ כדי להקריא",
        variant: "destructive",
      });
      return;
    }

    if (isPaused && utteranceRef.current) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set voice
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentPosition(0);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      toast({
        title: "שגיאה בקריאה",
        description: "אירעה שגיאה בקריאת הטקסט. אנא נסה שוב.",
        variant: "destructive",
      });
      setIsPlaying(false);
      setIsPaused(false);
    };

    speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (isPlaying) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentPosition(0);
  };

  const handleClearFile = () => {
    setFileName('');
    setText('');
    setUploadProgress('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    text, setText,
    fileName,
    isUploading,
    uploadProgress,
    isPlaying,
    isPaused,
    voices,
    selectedVoice, setSelectedVoice,
    rate, setRate,
    pitch, setPitch,
    volume, setVolume,
    fileInputRef,
    handleFileChange,
    handlePlay,
    handlePause,
    handleStop,
    handleClearFile,
  };
};