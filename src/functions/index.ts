import { superdevClient } from "@/lib/superdev/client";

export const generateSummaryTable = superdevClient.functions.generateSummaryTable;
export const formatBibliography = superdevClient.functions.formatBibliography;
export const formatBilingualBibliography = superdevClient.functions.formatBilingualBibliography;
export const createQuizQuestions = superdevClient.functions.createQuizQuestions;
export const createStudyPost = superdevClient.functions.createStudyPost;
export const textToSpeech = superdevClient.functions.textToSpeech;
export const generateFlashcards = superdevClient.functions.generateFlashcards;
export const generateFormulaSheet = superdevClient.functions.generateFormulaSheet;
export const generateStudySchedule = superdevClient.functions.generateStudySchedule;
export const processDriveLink = superdevClient.functions.processDriveLink;
export const generateInteractiveQuiz = superdevClient.functions.generateInteractiveQuiz;
export const extractConcepts = superdevClient.functions.extractConcepts;
export const generateChartsFromText = superdevClient.functions.generateChartsFromText;
export const readTextOutLoud = superdevClient.functions.readTextOutLoud;
export const presentationSlidesFromText = superdevClient.functions.presentationSlidesFromText;
