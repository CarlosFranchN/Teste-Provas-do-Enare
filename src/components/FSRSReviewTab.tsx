import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  RotateCcw,
  Plus,
  Trash2,
  Search,
  BookOpen,
  ArrowRight,
  Info,
  Calendar,
} from 'lucide-react';
import { Flashcard, FSRSRating } from '../types';
import { isCardDue, getForecastIntervals } from '../lib/fsrs';

interface FSRSReviewTabProps {
  flashcards: Flashcard[];
  onReviewCard: (cardId: string, rating: FSRSRating) => void;
  onAddCustomCard: (
    card: Omit<
      Flashcard,
      'id' | 'created_at' | 'state' | 'stability' | 'difficulty' | 'reps' | 'lapses' | 'interval'
    >
  ) => void;
  onDeleteCard: (id: string) => void;
  onNavigateToExam: () => void;
}

export const FSRSReviewTab: React.FC<FSRSReviewTabProps> = ({
  flashcards,
  onReviewCard,
  onAddCustomCard,
  onDeleteCard,
  onNavigateToExam,
}) => {
  const [viewMode, setViewMode] = useState<'study' | 'deck'>('study');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [studyAheadMode, setStudyAheadMode] = useState<boolean>(false);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  const [sessionReviewedCount, setSessionReviewedCount] = useState<number>(0);
  const [lastRatingFeedback, setLastRatingFeedback] = useState<string | null>(null);

  // Deck manager search & filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Filter due cards or all cards for study ahead
  const dueCards = useMemo(() => {
    return flashcards.filter(isCardDue);
  }, [flashcards]);

  const activeQueue = useMemo(() => {
    if (studyAheadMode) {
      return flashcards;
    }
    return dueCards;
  }, [flashcards, dueCards, studyAheadMode]);

  const currentCard: Flashcard | undefined = activeQueue[currentQueueIndex];

  // Forecast intervals for the 4 buttons
  const forecasts = useMemo(() => {
    if (!currentCard) return null;
    return getForecastIntervals(currentCard);
  }, [currentCard]);

  // Reset flip when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentCard?.id]);

  const handleRate = useCallback(
    (rating: FSRSRating) => {
      if (!currentCard || !forecasts) return;

      const forecast = forecasts[rating];
      onReviewCard(currentCard.id, rating);
      setSessionReviewedCount((prev) => prev + 1);

      const ratingNames: Record<FSRSRating, string> = {
        1: 'Novamente (< 10 min)',
        2: `Difícil (${forecast.label})`,
        3: `Bom (${forecast.label})`,
        4: `Fácil (${forecast.label})`,
      };
      setLastRatingFeedback(`Agendado: ${ratingNames[rating]}`);
      setTimeout(() => setLastRatingFeedback(null), 2500);

      // Advance in queue
      if (currentQueueIndex >= activeQueue.length - 1) {
        setCurrentQueueIndex(0);
      }
      setIsFlipped(false);
    },
    [currentCard, forecasts, onReviewCard, currentQueueIndex, activeQueue.length]
  );

  // Keyboard navigation support: Space/Enter to flip, 1-4 to rate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRate(1);
        if (e.key === '2') handleRate(2);
        if (e.key === '3') handleRate(3);
        if (e.key === '4') handleRate(4);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, handleRate]);

  // Deck filtered for list view
  const filteredDeck = useMemo(() => {
    return flashcards.filter((card) => {
      const matchSearch =
        card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.back.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.discipline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [flashcards, searchQuery]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-lg">
                Deck de Flashcards FSRS
              </h2>
              {dueCards.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white animate-pulse">
                  {dueCards.length} para hoje
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Retenção matemática com intervalos adaptados ao seu ritmo cognitivo
            </p>
          </div>
        </div>

        {/* View mode toggle (Study vs Manage Deck) */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-100 rounded-xl flex items-center">
            <button
              type="button"
              onClick={() => setViewMode('study')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'study'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Modo Estudo ({activeQueue.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('deck')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'deck'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gerenciar Deck ({flashcards.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Card</span>
          </button>
        </div>
      </div>

      {/* Floating toast feedback after rating */}
      {lastRatingFeedback && (
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 animate-in fade-in">
            <Sparkles className="w-3 h-3" /> {lastRatingFeedback}
          </span>
        </div>
      )}

      {/* VIEW 1: ACTIVE STUDY MODE */}
      {viewMode === 'study' && (
        <div className="space-y-6">
          {/* Active Card View */}
          {currentCard ? (
            <div className="space-y-6">
              {/* Queue Progress Bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">
                    Card {currentQueueIndex + 1} de {activeQueue.length}
                  </span>
                  {studyAheadMode && (
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium text-[11px]">
                      Modo Antecipado
                    </span>
                  )}
                </div>
                <span>
                  Sessão: {sessionReviewedCount} revisões feitas
                </span>
              </div>

              {/* Main Interactive Flashcard Card */}
              <div className="perspective-1000">
                <div
                  id="flashcard-container"
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300 min-h-[360px] flex flex-col justify-between"
                >
                  {/* Card Meta Top Bar */}
                  <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/40 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800">
                        {currentCard.discipline}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                        {currentCard.topic}
                      </span>
                      {currentCard.questionId && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          🧠 Originado de Erro
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span>Estabilidade: {currentCard.stability}d</span>
                      <span>Dificuldade: {currentCard.difficulty}</span>
                      <span>Reps: {currentCard.reps}</span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-6 sm:p-10 flex-1 flex flex-col justify-center text-center">
                    {!isFlipped ? (
                      /* Front Side */
                      <div className="space-y-4 max-w-xl mx-auto py-6">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                          Frente do Card (Conceito / Pergunta)
                        </span>
                        <h3 className="text-lg sm:text-2xl font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                          {currentCard.front}
                        </h3>
                        <p className="text-xs text-slate-400 pt-4">
                          Tente recordar ativamente a resposta antes de virar o card
                        </p>
                      </div>
                    ) : (
                      /* Back Side */
                      <div className="space-y-6 max-w-xl mx-auto py-4 text-left animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-2 justify-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            Verso (Resposta Didática)
                          </span>
                        </div>

                        <div className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                          {currentCard.back}
                        </div>

                        {currentCard.keyTakeaway && (
                          <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Ponto de Fixação: </span>
                              {currentCard.keyTakeaway}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom / Flip Action */}
                  {!isFlipped ? (
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        Dica: Pressione a tecla <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-mono">Espaço</kbd> para virar
                      </span>
                      <button
                        id="btn-show-answer"
                        type="button"
                        onClick={() => setIsFlipped(true)}
                        className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Mostrar Resposta</span>
                      </button>
                    </div>
                  ) : (
                    /* The 4 FSRS Classical Rating Buttons */
                    <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/70 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">
                          Como foi a recordação? (Selecione o grau FSRS):
                        </span>
                        <span className="hidden sm:inline">
                          Atalhos: <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-mono">1</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-mono">2</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-mono">3</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-mono">4</kbd>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* 1. Novamente (Again) - Red */}
                        <button
                          id="btn-fsrs-again"
                          type="button"
                          onClick={() => handleRate(1)}
                          className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-rose-700 transition-all active:scale-95 shadow-sm group"
                        >
                          <div className="text-[11px] font-bold text-rose-500 uppercase tracking-wide">
                            [1] Novamente
                          </div>
                          <div className="font-bold text-sm sm:text-base text-rose-800 mt-0.5">
                            {forecasts ? forecasts[1].label : '< 10 min'}
                          </div>
                          <span className="text-[10px] text-rose-400 group-hover:text-rose-600">
                            Esqueci / Errei
                          </span>
                        </button>

                        {/* 2. Difícil (Hard) - Orange */}
                        <button
                          id="btn-fsrs-hard"
                          type="button"
                          onClick={() => handleRate(2)}
                          className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-white border border-amber-200 hover:bg-amber-50 hover:border-amber-300 text-amber-700 transition-all active:scale-95 shadow-sm group"
                        >
                          <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wide">
                            [2] Difícil
                          </div>
                          <div className="font-bold text-sm sm:text-base text-amber-800 mt-0.5">
                            {forecasts ? forecasts[2].label : '1 dia'}
                          </div>
                          <span className="text-[10px] text-amber-400 group-hover:text-amber-600">
                            Com esforço
                          </span>
                        </button>

                        {/* 3. Bom (Good) - Blue */}
                        <button
                          id="btn-fsrs-good"
                          type="button"
                          onClick={() => handleRate(3)}
                          className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-white border border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 transition-all active:scale-95 shadow-sm group"
                        >
                          <div className="text-[11px] font-bold text-blue-500 uppercase tracking-wide">
                            [3] Bom
                          </div>
                          <div className="font-bold text-sm sm:text-base text-blue-800 mt-0.5">
                            {forecasts ? forecasts[3].label : '3 dias'}
                          </div>
                          <span className="text-[10px] text-blue-400 group-hover:text-blue-600">
                            Correto
                          </span>
                        </button>

                        {/* 4. Fácil (Easy) - Green */}
                        <button
                          id="btn-fsrs-easy"
                          type="button"
                          onClick={() => handleRate(4)}
                          className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-white border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700 transition-all active:scale-95 shadow-sm group"
                        >
                          <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-wide">
                            [4] Fácil
                          </div>
                          <div className="font-bold text-sm sm:text-base text-emerald-800 mt-0.5">
                            {forecasts ? forecasts[4].label : '8 dias'}
                          </div>
                          <span className="text-[10px] text-emerald-500 group-hover:text-emerald-700">
                            Instantâneo
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Empty Queue Celebration Card (Tudo em dia para hoje!) */
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-slate-900">
                  Tudo em dia com o FSRS! 🎉
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Não há mais revisões agendadas para hoje. O algoritmo já calculou os próximos intervalos para consolidar sua memória de longo prazo.
                </p>
              </div>

              {sessionReviewedCount > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-xs mx-auto text-xs text-slate-600">
                  <span className="font-bold text-slate-900">
                    {sessionReviewedCount} cards
                  </span>{' '}
                  revisados com sucesso nesta sessão.
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStudyAheadMode(true);
                    setCurrentQueueIndex(0);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Estudar Antecipadamente Todos ({flashcards.length})
                </button>
                <button
                  type="button"
                  onClick={onNavigateToExam}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-semibold hover:bg-indigo-100 transition-colors"
                >
                  Resolver Mais Questões
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: DECK MANAGEMENT (VIEW ALL CARDS) */}
      {viewMode === 'deck' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              placeholder="Buscar flashcard por termo, matéria ou tópico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-transparent border-none focus:outline-none text-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredDeck.map((card) => {
              const isDue = isCardDue(card);
              const dueDateObj = new Date(card.due_date);

              return (
                <div
                  key={card.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                        {card.discipline}
                      </span>
                      <span className="text-xs font-medium text-slate-600">
                        {card.topic}
                      </span>
                      {card.questionId && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Erro em Questão
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          isDue
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {isDue ? 'Due Hoje' : `Agendado: ${dueDateObj.toLocaleDateString('pt-BR')}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Deseja excluir este flashcard do seu deck?')) {
                            onDeleteCard(card.id);
                          }
                        }}
                        title="Excluir card"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                        Frente
                      </span>
                      <p className="text-slate-800 whitespace-pre-line font-medium">
                        {card.front}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                        Verso
                      </span>
                      <p className="text-slate-800 whitespace-pre-line">
                        {card.back}
                      </p>
                    </div>
                  </div>

                  {/* FSRS Stats pill */}
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                    <span>Estabilidade: {card.stability}d</span>
                    <span>Dificuldade: {card.difficulty}</span>
                    <span>Repetições: {card.reps}</span>
                    <span>Erros (lapses): {card.lapses}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Card Creation Modal */}
      {isAddModalOpen && (
        <CreateCardModal
          onClose={() => setIsAddModalOpen(false)}
          onAddCard={(card) => {
            onAddCustomCard(card);
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

interface CreateCardModalProps {
  onClose: () => void;
  onAddCard: (card: {
    discipline: string;
    topic: string;
    front: string;
    back: string;
    keyTakeaway?: string;
    due_date: string;
  }) => void;
}

const CreateCardModal: React.FC<CreateCardModalProps> = ({ onClose, onAddCard }) => {
  const [discipline, setDiscipline] = useState('Direito Constitucional');
  const [topic, setTopic] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [keyTakeaway, setKeyTakeaway] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front || !back || !topic) return;

    onAddCard({
      discipline,
      topic,
      front,
      back,
      keyTakeaway,
      due_date: new Date().toISOString(), // due immediately
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            Criar Novo Flashcard FSRS
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Disciplina
            </label>
            <input
              type="text"
              required
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Ex.: Direito Administrativo"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tópico / Assunto
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Ex.: Atos Administrativos - Motivação"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Frente (Pergunta / Conceito / Lacuna)
            </label>
            <textarea
              required
              rows={3}
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Escreva a pergunta ou o estímulo de memória..."
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Verso (Resposta Didática)
            </label>
            <textarea
              required
              rows={3}
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Escreva a resposta e detalhes para fixar..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors shadow-sm"
            >
              Salvar Flashcard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
