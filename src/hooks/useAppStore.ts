import { useState, useEffect, useMemo, useCallback } from 'react';
import { Question, Flashcard, UserAnswer, Exam, TopicStat, FSRSRating } from '../types';
import {
  INITIAL_EXAMS,
  INITIAL_QUESTIONS,
  INITIAL_FLASHCARDS,
  INITIAL_USER_ANSWERS,
} from '../data/mockData';
import { calculateNextFSRS, isCardDue } from '../lib/fsrs';

const STORAGE_KEYS = {
  QUESTIONS: 'fsrs_questions_v1',
  FLASHCARDS: 'fsrs_flashcards_v1',
  ANSWERS: 'fsrs_answers_v1',
  EXAMS: 'fsrs_exams_v1',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key} to localStorage:`, err);
  }
}

export function useAppStore() {
  const [questions, setQuestions] = useState<Question[]>(() =>
    loadStorage<Question[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS)
  );

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() =>
    loadStorage<Flashcard[]>(STORAGE_KEYS.FLASHCARDS, INITIAL_FLASHCARDS)
  );

  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>(() =>
    loadStorage<Record<string, UserAnswer>>(STORAGE_KEYS.ANSWERS, INITIAL_USER_ANSWERS)
  );

  const [exams, setExams] = useState<Exam[]>(() =>
    loadStorage<Exam[]>(STORAGE_KEYS.EXAMS, INITIAL_EXAMS)
  );

  // Sync back to localStorage
  useEffect(() => {
    saveStorage(STORAGE_KEYS.QUESTIONS, questions);
  }, [questions]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.FLASHCARDS, flashcards);
  }, [flashcards]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.ANSWERS, userAnswers);
  }, [userAnswers]);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.EXAMS, exams);
  }, [exams]);

  // Answer a question
  const answerQuestion = useCallback(
    (questionId: string, selectedOptionId: 'A' | 'B' | 'C' | 'D' | 'E') => {
      const q = questions.find((item) => item.id === questionId);
      if (!q) return null;

      const isCorrect = q.correctOptionId === selectedOptionId;
      const newAnswer: UserAnswer = {
        questionId,
        selectedOptionId,
        isCorrect,
        answeredAt: new Date().toISOString(),
      };

      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: newAnswer,
      }));

      return newAnswer;
    },
    [questions]
  );

  // Clear answer for a question (to retry)
  const resetQuestionAnswer = useCallback((questionId: string) => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }, []);

  // Generate flashcard from an error
  const createFlashcardFromError = useCallback(
    (question: Question, userWrongOptionId?: 'A' | 'B' | 'C' | 'D' | 'E') => {
      // Avoid duplicate flashcard for this question if it already exists
      const existing = flashcards.find((fc) => fc.questionId === question.id);
      if (existing) {
        return { card: existing, isNew: false };
      }

      const wrongText = userWrongOptionId
        ? question.options.find((o) => o.id === userWrongOptionId)?.text
        : '';

      const newCard: Flashcard = {
        id: `fc-err-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        questionId: question.id,
        discipline: question.discipline,
        topic: question.topic,
        front: `[Pegadinha / Erro em ${question.topic}]\n${question.didacticExplanation.keyConcept}`,
        back: `Gabarito Correto (${question.correctOptionId}):\n${
          question.options.find((o) => o.id === question.correctOptionId)?.text
        }\n\n💡 Explicação Didática:\n${question.didacticExplanation.whyCorrect}\n\n⚠️ Pegadinha Evitada:\n${
          question.didacticExplanation.trapsExplanation
        }${wrongText ? `\n(Você havia marcado: ${wrongText})` : ''}`,
        keyTakeaway: question.didacticExplanation.keyConcept,
        due_date: new Date().toISOString(), // Due immediately for review
        state: 'new',
        stability: 0.8,
        difficulty: 6.5,
        reps: 0,
        lapses: 0,
        interval: 0,
        created_at: new Date().toISOString(),
      };

      setFlashcards((prev) => [newCard, ...prev]);
      return { card: newCard, isNew: true };
    },
    [flashcards]
  );

  // Review flashcard with FSRS
  const reviewFlashcard = useCallback((cardId: string, rating: FSRSRating) => {
    setFlashcards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card;
        const nextFsrs = calculateNextFSRS(card, rating);
        return {
          ...card,
          ...nextFsrs,
          last_review: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Add custom flashcard
  const addFlashcard = useCallback(
    (cardData: Omit<Flashcard, 'id' | 'created_at' | 'state' | 'stability' | 'difficulty' | 'reps' | 'lapses' | 'interval'>) => {
      const newCard: Flashcard = {
        ...cardData,
        id: `fc-custom-${Date.now()}`,
        state: 'new',
        stability: 1.0,
        difficulty: 5.0,
        reps: 0,
        lapses: 0,
        interval: 0,
        created_at: new Date().toISOString(),
      };
      setFlashcards((prev) => [newCard, ...prev]);
      return newCard;
    },
    []
  );

  // Delete flashcard
  const deleteFlashcard = useCallback((id: string) => {
    setFlashcards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Add questions (from PDF or import)
  const addQuestions = useCallback((newQuestions: Question[]) => {
    setQuestions((prev) => [...newQuestions, ...prev]);
  }, []);

  // Reset entire application data back to initial mock state
  const resetToDefaults = useCallback(() => {
    setQuestions(INITIAL_QUESTIONS);
    setFlashcards(INITIAL_FLASHCARDS);
    setUserAnswers(INITIAL_USER_ANSWERS);
    setExams(INITIAL_EXAMS);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.FLASHCARDS);
    localStorage.removeItem(STORAGE_KEYS.ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.EXAMS);
  }, []);

  // Metrics computation
  const metrics = useMemo(() => {
    const answersList = Object.values(userAnswers) as UserAnswer[];
    const totalAnswered = Object.keys(userAnswers).length;
    const correctCount = answersList.filter((a) => a.isCorrect).length;
    const overallAccuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

    const totalFlashcards = flashcards.length;
    const dueFlashcards = flashcards.filter(isCardDue);

    // Topic breakdown
    const topicMap: Record<string, { discipline: string; topic: string; total: number; correct: number; incorrect: number }> = {};

    questions.forEach((q) => {
      const key = `${q.discipline} > ${q.topic}`;
      if (!topicMap[key]) {
        topicMap[key] = {
          discipline: q.discipline,
          topic: q.topic,
          total: 0,
          correct: 0,
          incorrect: 0,
        };
      }
    });

    answersList.forEach((ans) => {
      const q = questions.find((item) => item.id === ans.questionId);
      if (!q) return;
      const key = `${q.discipline} > ${q.topic}`;
      if (topicMap[key]) {
        topicMap[key].total += 1;
        if (ans.isCorrect) {
          topicMap[key].correct += 1;
        } else {
          topicMap[key].incorrect += 1;
        }
      }
    });

    const topicStats: TopicStat[] = Object.values(topicMap).map((item) => {
      const percentage = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
      return {
        discipline: item.discipline,
        topic: item.topic,
        total: item.total,
        correct: item.correct,
        incorrect: item.incorrect,
        percentage,
      };
    });

    // Determine 2 weakest topics for "Atenção" card
    // Filter topics that have been answered or give priority to low percentage ones
    const answeredTopics = topicStats.filter((t) => t.total > 0);
    const sortedByWorst = [...answeredTopics].sort((a, b) => a.percentage - b.percentage);

    let priorityWeakTopics = sortedByWorst.slice(0, 2);
    // If fewer than 2 answered topics, fill with untouched topics so user gets study recommendations
    if (priorityWeakTopics.length < 2) {
      const remaining = topicStats.filter((t) => !priorityWeakTopics.some((p) => p.topic === t.topic));
      priorityWeakTopics = [...priorityWeakTopics, ...remaining.slice(0, 2 - priorityWeakTopics.length)];
    }

    return {
      totalQuestions: questions.length,
      totalAnswered,
      correctCount,
      overallAccuracy,
      totalFlashcards,
      dueFlashcardsCount: dueFlashcards.length,
      dueFlashcards,
      topicStats,
      priorityWeakTopics,
    };
  }, [questions, userAnswers, flashcards]);

  return {
    questions,
    flashcards,
    userAnswers,
    exams,
    metrics,
    answerQuestion,
    resetQuestionAnswer,
    createFlashcardFromError,
    reviewFlashcard,
    addFlashcard,
    deleteFlashcard,
    addQuestions,
    resetToDefaults,
  };
}
