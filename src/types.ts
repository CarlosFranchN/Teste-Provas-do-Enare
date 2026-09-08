export type FSRSRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export type FSRSCardState = 'new' | 'learning' | 'review' | 'relearning';

export interface Flashcard {
  id: string;
  questionId?: string;
  discipline: string;
  topic: string;
  front: string;
  back: string;
  keyTakeaway?: string;
  due_date: string; // ISO string
  state: FSRSCardState;
  stability: number; // in days
  difficulty: number; // 1-10
  reps: number;
  lapses: number;
  last_review?: string;
  interval: number; // in days or fractional
  created_at: string;
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
}

export interface Question {
  id: string;
  examId: string;
  examTitle: string;
  discipline: string;
  topic: string;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D' | 'E';
  didacticExplanation: {
    whyCorrect: string;
    trapsExplanation: string;
    keyConcept: string;
  };
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: 'A' | 'B' | 'C' | 'D' | 'E';
  isCorrect: boolean;
  answeredAt: string;
}

export interface Exam {
  id: string;
  title: string;
  year: number;
  institution: string;
  discipline: string;
  description: string;
}

export interface TopicStat {
  discipline: string;
  topic: string;
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
}
