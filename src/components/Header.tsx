import React from 'react';
import {
  Brain,
  BarChart3,
  BookOpen,
  Layers,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'questions' | 'fsrs';
  setActiveTab: (tab: 'dashboard' | 'questions' | 'fsrs') => void;
  dueCount: number;
  totalAnswered: number;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  dueCount,
  totalAnswered,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">
                  FSRS EdTech
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3" /> FSRS v4
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Simulados com Repetição Espaçada & Flashcards de Erros
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              id="tab-btn-dashboard"
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
              <span className="md:hidden">Métricas</span>
            </button>

            <button
              id="tab-btn-questions"
              type="button"
              onClick={() => setActiveTab('questions')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'questions'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Caderno de Questões</span>
              {totalAnswered > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
                  {totalAnswered}
                </span>
              )}
            </button>

            <button
              id="tab-btn-fsrs"
              type="button"
              onClick={() => setActiveTab('fsrs')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'fsrs'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Revisão FSRS</span>
              <span className="md:hidden">Deck FSRS</span>
              {dueCount > 0 ? (
                <span className="flex items-center justify-center px-1.5 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white animate-pulse">
                  {dueCount}
                </span>
              ) : (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                  0
                </span>
              )}
            </button>
          </nav>

          {/* Right Action: Reset / State Helper */}
          <div className="flex items-center gap-2">
            <button
              id="btn-reset-data"
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Deseja restaurar os dados iniciais do simulado e flashcards?'
                  )
                ) {
                  onResetData();
                }
              }}
              title="Restaurar dados iniciais padrão"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Restaurar Dados</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
