import { superdevClient } from "@/lib/superdev/client";

export const createQuizQuestions = superdevClient.functions.createQuizQuestions;
export const generateSummaryTable = superdevClient.functions.generateSummaryTable;
export const generateStudySchedule = superdevClient.functions.generateStudySchedule;
export const createStudyPost = superdevClient.functions.createStudyPost;
export const generateFlashcards = superdevClient.functions.generateFlashcards;
export const generateFormulaSheet = superdevClient.functions.generateFormulaSheet;
export const textToSpeech = superdevClient.functions.textToSpeech;
