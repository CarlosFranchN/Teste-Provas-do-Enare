/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { ExamQuestionTab } from './components/ExamQuestionTab';
import { FSRSReviewTab } from './components/FSRSReviewTab';
import { PdfUploadModal } from './components/PdfUploadModal';
import { useAppStore } from './hooks/useAppStore';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'questions' | 'fsrs'>('dashboard');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('all');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  const {
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
  } = useAppStore();

  const handleNavigateToExam = (filter?: string) => {
    if (filter) {
      setDisciplineFilter(filter);
    } else {
      setDisciplineFilter('all');
    }
    setActiveTab('questions');
  };

  const handleNavigateToFsrs = () => {
    setActiveTab('fsrs');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dueCount={metrics.dueFlashcardsCount}
        totalAnswered={metrics.totalAnswered}
        onResetData={resetToDefaults}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && (
          <DashboardTab
            totalQuestions={metrics.totalQuestions}
            totalAnswered={metrics.totalAnswered}
            correctCount={metrics.correctCount}
            overallAccuracy={metrics.overallAccuracy}
            totalFlashcards={metrics.totalFlashcards}
            dueFlashcardsCount={metrics.dueFlashcardsCount}
            topicStats={metrics.topicStats}
            priorityWeakTopics={metrics.priorityWeakTopics}
            onNavigateToExam={handleNavigateToExam}
            onNavigateToFsrs={handleNavigateToFsrs}
          />
        )}

        {activeTab === 'questions' && (
          <ExamQuestionTab
            questions={questions}
            exams={exams}
            userAnswers={userAnswers}
            flashcards={flashcards}
            onAnswerQuestion={answerQuestion}
            onResetAnswer={resetQuestionAnswer}
            onCreateFlashcardFromError={createFlashcardFromError}
            onOpenPdfModal={() => setIsPdfModalOpen(true)}
            initialDisciplineFilter={disciplineFilter}
            onNavigateToFsrs={handleNavigateToFsrs}
          />
        )}

        {activeTab === 'fsrs' && (
          <FSRSReviewTab
            flashcards={flashcards}
            onReviewCard={reviewFlashcard}
            onAddCustomCard={addFlashcard}
            onDeleteCard={deleteFlashcard}
            onNavigateToExam={() => setActiveTab('questions')}
          />
        )}
      </main>

      {/* PDF Upload and Parsing Modal */}
      <PdfUploadModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onAddQuestions={(newQuestions) => {
          addQuestions(newQuestions);
          setActiveTab('questions');
        }}
      />
    </div>
  );
}
