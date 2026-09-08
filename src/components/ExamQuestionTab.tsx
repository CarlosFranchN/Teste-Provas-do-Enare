import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Brain,
  UploadCloud,
  Filter,
  Lightbulb,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Question, Exam, UserAnswer, Flashcard } from '../types';

interface ExamQuestionTabProps {
  questions: Question[];
  exams: Exam[];
  userAnswers: Record<string, UserAnswer>;
  flashcards: Flashcard[];
  onAnswerQuestion: (questionId: string, optionId: 'A' | 'B' | 'C' | 'D' | 'E') => void;
  onResetAnswer: (questionId: string) => void;
  onCreateFlashcardFromError: (question: Question, wrongOptionId?: 'A' | 'B' | 'C' | 'D' | 'E') => { card: Flashcard; isNew: boolean };
  onOpenPdfModal: () => void;
  initialDisciplineFilter?: string;
  onNavigateToFsrs: () => void;
}

export const ExamQuestionTab: React.FC<ExamQuestionTabProps> = ({
  questions,
  exams,
  userAnswers,
  flashcards,
  onAnswerQuestion,
  onResetAnswer,
  onCreateFlashcardFromError,
  onOpenPdfModal,
  initialDisciplineFilter = 'all',
  onNavigateToFsrs,
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>(initialDisciplineFilter);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Available disciplines for filtering
  const disciplines = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => set.add(q.discipline));
    return Array.from(set);
  }, [questions]);

  // Filter questions based on exam and discipline
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchExam = selectedExamId === 'all' || q.examId === selectedExamId;
      const matchDiscipline = selectedDiscipline === 'all' || q.discipline === selectedDiscipline;
      return matchExam && matchDiscipline;
    });
  }, [questions, selectedExamId, selectedDiscipline]);

  // Safe current question
  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];
  const currentAnswer = currentQuestion ? userAnswers[currentQuestion.id] : undefined;

  // Has a flashcard already been created for this question?
  const existingFlashcard = useMemo(() => {
    if (!currentQuestion) return null;
    return flashcards.find((fc) => fc.questionId === currentQuestion.id);
  }, [currentQuestion, flashcards]);

  // Keep selected option in sync if user already answered
  React.useEffect(() => {
    if (currentAnswer) {
      setSelectedOption(currentAnswer.selectedOptionId);
      setIsExplanationOpen(true);
    } else {
      setSelectedOption(null);
      setIsExplanationOpen(false);
    }
  }, [currentQuestion?.id, currentAnswer]);

  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (currentAnswer) return; // Locked once answered
    setSelectedOption(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!currentQuestion || !selectedOption) return;
    onAnswerQuestion(currentQuestion.id, selectedOption);
    setIsExplanationOpen(true);
  };

  const handleGenerateFlashcard = () => {
    if (!currentQuestion) return;
    const res = onCreateFlashcardFromError(currentQuestion, selectedOption || undefined);
    if (res.isNew) {
      showToast('🧠 Flashcard inteligente gerado com sucesso e adicionado ao Deck FSRS!');
    } else {
      showToast('ℹ️ Este erro já possui um flashcard no seu deck de revisão.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  if (filteredQuestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Nenhuma questão encontrada com os filtros atuais
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Experimente redefinir os filtros de disciplina ou carregar um novo simulado em PDF.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setSelectedExamId('all');
              setSelectedDiscipline('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Limpar Filtros
          </button>
          <button
            type="button"
            onClick={onOpenPdfModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
          >
            Carregar PDF de Prova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
          <button
            type="button"
            onClick={onNavigateToFsrs}
            className="ml-2 text-xs font-bold text-indigo-300 hover:text-white underline underline-offset-2"
          >
            Ver Deck
          </button>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        {/* Exam & Discipline Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
          {/* Exam Selector */}
          <div className="relative min-w-[200px]">
            <select
              id="select-exam"
              value={selectedExamId}
              onChange={(e) => {
                setSelectedExamId(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="all">📚 Todos os Simulados ({questions.length} questões)</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.title} ({exam.year})
                </option>
              ))}
            </select>
          </div>

          {/* Discipline Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setSelectedDiscipline('all');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedDiscipline === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas Matérias
            </button>
            {disciplines.map((disc) => (
              <button
                key={disc}
                type="button"
                onClick={() => {
                  setSelectedDiscipline(disc);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  selectedDiscipline === disc
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {disc}
              </button>
            ))}
          </div>
        </div>

        {/* Load PDF Button */}
        <button
          id="btn-open-upload-pdf"
          type="button"
          onClick={onOpenPdfModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-semibold hover:bg-indigo-100 transition-colors shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Carregar PDF de Prova</span>
        </button>
      </div>

      {/* Question Selector Quick Grid */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-3 bg-white rounded-2xl border border-slate-200 shadow-sm scrollbar-thin">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 shrink-0">
          Questões:
        </span>
        {filteredQuestions.map((q, idx) => {
          const ans = userAnswers[q.id];
          const isCurrent = idx === currentIndex;

          let badgeColor = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
          if (ans) {
            badgeColor = ans.isCorrect
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-rose-100 text-rose-800 border border-rose-300';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center justify-center ${badgeColor} ${
                isCurrent ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105' : ''
              }`}
              title={`Questão ${idx + 1} - ${q.topic}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card (Simulated Mode) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Card Header Info */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
              Questão {currentIndex + 1} de {filteredQuestions.length}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
              {currentQuestion.discipline}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
              {currentQuestion.topic}
            </span>
          </div>

          <span className="text-xs font-medium text-slate-500 truncate max-w-xs">
            {currentQuestion.examTitle}
          </span>
        </div>

        {/* Prompt Statement */}
        <div className="p-6 sm:p-8">
          <div className="text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal">
            {currentQuestion.prompt}
          </div>

          {/* Alternatives (A, B, C, D, E) */}
          <div className="mt-8 space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const isSubmitted = !!currentAnswer;
              const isCorrectOption = option.id === currentQuestion.correctOptionId;
              const isUserWrongSelection =
                isSubmitted && isSelected && !currentAnswer.isCorrect;

              let buttonStyle =
                'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 text-slate-800';

              if (!isSubmitted) {
                if (isSelected) {
                  buttonStyle =
                    'border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-600/30';
                }
              } else {
                if (isCorrectOption) {
                  buttonStyle =
                    'border-emerald-500 bg-emerald-50/90 text-emerald-950 font-medium ring-2 ring-emerald-500/30';
                } else if (isUserWrongSelection) {
                  buttonStyle =
                    'border-rose-500 bg-rose-50/90 text-rose-950 ring-2 ring-rose-500/30';
                } else {
                  buttonStyle = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 group ${buttonStyle}`}
                >
                  {/* Option Badge (A, B, C, D, E) */}
                  <div
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm transition-colors ${
                      isSubmitted && isCorrectOption
                        ? 'bg-emerald-600 text-white'
                        : isSubmitted && isUserWrongSelection
                        ? 'bg-rose-600 text-white'
                        : isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                    }`}
                  >
                    {isSubmitted && isCorrectOption ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isSubmitted && isUserWrongSelection ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      option.id
                    )}
                  </div>

                  {/* Option Text */}
                  <div className="flex-1 pt-0.5 text-sm sm:text-base leading-snug">
                    {option.text}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!currentAnswer ? (
                <button
                  id="btn-confirm-answer"
                  type="button"
                  disabled={!selectedOption}
                  onClick={handleConfirmAnswer}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                    selectedOption
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-200'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirmar Resposta</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold ${
                      currentAnswer.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {currentAnswer.isCorrect ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Resposta Correta! (+1 ponto)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Resposta Incorreta</span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onResetAnswer(currentQuestion.id)}
                    title="Tentar responder novamente"
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Prev / Next navigation */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 transition-colors ${
                  currentIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <button
                type="button"
                disabled={currentIndex === filteredQuestions.length - 1}
                onClick={() =>
                  setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))
                }
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 transition-colors ${
                  currentIndex === filteredQuestions.length - 1
                    ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Próxima</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Retractable "Resolução Didática" & "🧠 Gerar Flashcard deste Erro" */}
        {currentAnswer && (
          <div className="border-t border-slate-100 bg-slate-50/70 p-6 sm:p-8 space-y-6">
            {/* If user answered incorrectly: prominent Flashcard Generator Button */}
            {!currentAnswer.isCorrect && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-indigo-50 border border-rose-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                      Fixação Anti-Pegadinha
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    Não perca este ponto na prova real!
                  </h4>
                  <p className="text-xs text-slate-600">
                    O algoritmo FSRS programa repetições espaçadas automatizadas focadas no conceito que você acabou de errar.
                  </p>
                </div>

                <button
                  id="btn-generate-error-flashcard"
                  type="button"
                  onClick={handleGenerateFlashcard}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm shrink-0 active:scale-95"
                >
                  <Brain className="w-4 h-4 text-amber-300" />
                  <span>🧠 Gerar Flashcard deste Erro</span>
                </button>
              </div>
            )}

            {/* Explanation Toggle Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Resolução Didática & Análise das Pegadinhas
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsExplanationOpen(!isExplanationOpen)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {isExplanationOpen ? 'Ocultar Explicação' : 'Exibir Explicação'}
              </button>
            </div>

            {/* Collapsible Content */}
            {isExplanationOpen && (
              <div className="space-y-4 pt-2">
                {/* Por que o gabarito está certo */}
                <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wide">
                    <CheckCircle className="w-4 h-4" />
                    <span>Por que a alternativa {currentQuestion.correctOptionId} é a correta:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                    {currentQuestion.didacticExplanation.whyCorrect}
                  </p>
                </div>

                {/* Pegadinhas das demais */}
                <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-1">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wide">
                    <AlertCircle className="w-4 h-4" />
                    <span>Pegadinhas das demais alternativas:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                    {currentQuestion.didacticExplanation.trapsExplanation}
                  </p>
                </div>

                {/* Conceito-Chave */}
                <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                      Conceito Síntese (Memorização):
                    </span>
                    <p className="text-xs text-indigo-800 font-medium mt-0.5">
                      {currentQuestion.didacticExplanation.keyConcept}
                    </p>
                  </div>
                </div>

                {existingFlashcard && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 text-xs text-slate-600">
                    <span>
                      📌 Este tema já possui 1 flashcard ativo no seu deck FSRS.
                    </span>
                    <button
                      type="button"
                      onClick={onNavigateToFsrs}
                      className="font-bold text-indigo-600 hover:text-indigo-800 underline"
                    >
                      Ir para Revisão
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
