import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { TopicStat } from '../types';

interface DashboardTabProps {
  totalQuestions: number;
  totalAnswered: number;
  correctCount: number;
  overallAccuracy: number;
  totalFlashcards: number;
  dueFlashcardsCount: number;
  topicStats: TopicStat[];
  priorityWeakTopics: TopicStat[];
  onNavigateToExam: (disciplineFilter?: string) => void;
  onNavigateToFsrs: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  totalQuestions,
  totalAnswered,
  correctCount,
  overallAccuracy,
  totalFlashcards,
  dueFlashcardsCount,
  topicStats,
  priorityWeakTopics,
  onNavigateToExam,
  onNavigateToFsrs,
}) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Welcome / Headline banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Desempenho & Repetição Espaçada
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Painel de Inteligência e Retenção
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Acompanhe o rendimento nas provas, converta falhas em memória de longo prazo e revise flashcards com o algoritmo FSRS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-dash-goto-questions"
            type="button"
            onClick={() => onNavigateToExam()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Resolver Questões</span>
          </button>

          <button
            id="btn-dash-goto-fsrs"
            type="button"
            onClick={onNavigateToFsrs}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-sm"
          >
            <Layers className="w-4 h-4" />
            <span>Revisar FSRS ({dueFlashcardsCount})</span>
          </button>
        </div>
      </div>

      {/* 1. Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Questions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Questões Resolvidas
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {totalAnswered}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                de {totalQuestions} disponíveis
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((totalAnswered / Math.max(1, totalQuestions)) * 100))}%`,
                }}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">{correctCount} certas</span>
            <span>•</span>
            <span className="text-rose-600 font-semibold">{totalAnswered - correctCount} erradas</span>
          </p>
        </div>

        {/* Card 2: Overall Accuracy */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Taxa Geral de Acerto
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {overallAccuracy}%
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  overallAccuracy >= 75
                    ? 'bg-emerald-100 text-emerald-800'
                    : overallAccuracy >= 50
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {overallAccuracy >= 75
                  ? 'Alto Desempenho'
                  : overallAccuracy >= 50
                  ? 'Mediano'
                  : 'Necessita Revisão'}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overallAccuracy >= 75
                    ? 'bg-emerald-500'
                    : overallAccuracy >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${overallAccuracy}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Média ponderada de todas as matérias
          </p>
        </div>

        {/* Card 3: Total Flashcards */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Deck de Flashcards
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {totalFlashcards}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                cards memorizados
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${Math.min(100, totalFlashcards * 15)}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Alimentado por erros de simulados</span>
          </p>
        </div>

        {/* Card 4: Due Reviews Today */}
        <div
          className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between transition-colors ${
            dueFlashcardsCount > 0
              ? 'bg-amber-50/50 border-amber-200'
              : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Revisões para Hoje (Due)
            </span>
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                dueFlashcardsCount > 0
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-bold ${
                  dueFlashcardsCount > 0 ? 'text-amber-700' : 'text-slate-800'
                }`}
              >
                {dueFlashcardsCount}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {dueFlashcardsCount === 1 ? 'card pendente' : 'cards pendentes'}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  dueFlashcardsCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{
                  width: `${Math.min(100, (dueFlashcardsCount / Math.max(1, totalFlashcards)) * 100)}%`,
                }}
              />
            </div>
          </div>
          <div className="mt-3">
            {dueFlashcardsCount > 0 ? (
              <button
                type="button"
                onClick={onNavigateToFsrs}
                className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 group"
              >
                <span>Revisar FSRS agora</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Fila em dia!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Priority Attention Card (Card de "Atenção") */}
      <div className="bg-white rounded-2xl border border-rose-200/80 p-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-50 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Atenção: Sugestão de Estudo Prioritário
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              O algoritmo identificou os 2 tópicos com menor índice de acertos e maior incidência de pegadinhas no seu histórico recente. Priorize a resolução de questões e revisão de flashcards destes assuntos:
            </p>

            {/* 2 Weakest Topics highlighted */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {priorityWeakTopics.map((topic, idx) => (
                <div
                  key={`${topic.discipline}-${topic.topic}`}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                      Prioridade #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {topic.total > 0 ? `${topic.percentage}% acerto` : 'Ainda sem respostas'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mt-2">
                    {topic.topic}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {topic.discipline}
                  </p>
                  <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
                    <span>
                      {topic.total > 0
                        ? `${topic.incorrect} erros em ${topic.total} questões`
                        : 'Recomenda-se realizar o primeiro teste'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
            <button
              type="button"
              onClick={() => onNavigateToExam(priorityWeakTopics[0]?.discipline)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Target className="w-4 h-4 text-rose-400" />
              <span>Praticar Ponto Fraco</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToFsrs}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Ver Flashcards do Tema</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Visual Breakdown by Discipline and Topic */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Taxa de Acertos por Disciplina e Assunto Específico
            </h2>
            <p className="text-sm text-slate-500">
              Detalhamento analítico de retenção e assertividade por tópico do edital
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 px-3 py-1 rounded-full bg-slate-100 self-start sm:self-auto">
            {topicStats.length} tópicos catalogados
          </span>
        </div>

        {/* Progress Bars List */}
        <div className="mt-6 space-y-6">
          {topicStats.map((stat) => {
            // Determine color palette
            const isAnswered = stat.total > 0;
            const pct = stat.percentage;
            let barColor = 'bg-slate-300';
            let badgeBg = 'bg-slate-100 text-slate-600';

            if (isAnswered) {
              if (pct >= 75) {
                barColor = 'bg-emerald-500';
                badgeBg = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
              } else if (pct >= 50) {
                barColor = 'bg-amber-500';
                badgeBg = 'bg-amber-50 text-amber-700 border border-amber-200';
              } else {
                barColor = 'bg-rose-500';
                badgeBg = 'bg-rose-50 text-rose-700 border border-rose-200';
              }
            }

            return (
              <div
                key={`${stat.discipline}-${stat.topic}`}
                className="group p-3 -mx-3 rounded-xl hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {stat.discipline}
                    </span>
                    <span className="text-slate-400">›</span>
                    <span className="text-slate-700 font-medium">
                      {stat.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs text-slate-500 font-medium">
                      {isAnswered
                        ? `${stat.correct} de ${stat.total} certas`
                        : 'Nenhuma questão respondida'}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full font-mono ${badgeBg}`}
                    >
                      {isAnswered ? `${pct}%` : '—'}
                    </span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className={`${barColor} h-full rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${isAnswered ? Math.max(5, pct) : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
