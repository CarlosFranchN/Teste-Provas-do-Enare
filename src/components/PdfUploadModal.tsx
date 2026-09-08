import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle,
  Loader2,
  Sparkles,
  PlusCircle,
  Layers,
} from 'lucide-react';
import { Question } from '../types';

interface PdfUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestions: (questions: Question[]) => void;
}

// Preset packs that the simulated PDF parser can extract
const SIMULATED_PDF_PACKS: { name: string; size: string; questions: Question[] }[] = [
  {
    name: 'Simulado_Polícia_Federal_Constitucional_2024.pdf',
    size: '1.4 MB',
    questions: [
      {
        id: `q-pf-01-${Date.now()}`,
        examId: 'exam-pf-2024',
        examTitle: 'Simulado Polícia Federal (2024)',
        discipline: 'Direito Constitucional',
        topic: 'Segurança Pública',
        prompt: `(Cebraspe / PF) No que concerne à Segurança Pública no Artigo 144 da Constituição Federal de 1988, a Polícia Federal destina-se a:`,
        options: [
          {
            id: 'A',
            text: 'Exercer com exclusividade as funções de polícia judiciária em todo o território nacional.',
          },
          {
            id: 'B',
            text: 'Apurar infrações penais contra a ordem política e social ou em detrimento de bens, serviços e interesses da União ou de suas entidades autárquicas e empresas públicas, assim como outras infrações cuja prática tenha repercussão interestadual ou internacional e exija repressão uniforme.',
          },
          {
            id: 'C',
            text: 'Subordinar-se aos governadores dos Estados quando em operação dentro do território respectivo.',
          },
          {
            id: 'D',
            text: 'Patrulhamento ostensivo das rodovias estaduais e municipais.',
          },
          {
            id: 'E',
            text: 'Exercer privativamente o policiamento ambiental de reservas indígenas e áreas de preservação permanente.',
          },
        ],
        correctOptionId: 'B',
        didacticExplanation: {
          whyCorrect:
            'O Art. 144, § 1º, I da CF/88 define expressamente essa competência nuclear da Polícia Federal: infrações contra a ordem política e social, ou em detrimento de bens, serviços e interesses da União, suas autarquias e empresas públicas, e com repercussão interestadual/internacional.',
          trapsExplanation:
            'A Polícia Federal exerce com exclusividade as funções de polícia judiciária DA UNIÃO (Art. 144, § 1º, IV), e não de todo o território nacional indistintamente (as Polícias Civis exercem a dos Estados).',
          keyConcept:
            'Competência da PF (Art. 144): Polícia judiciária da UNIÃO com exclusividade, apuração de crimes federais e interestaduais.',
        },
      },
      {
        id: `q-pf-02-${Date.now()}`,
        examId: 'exam-pf-2024',
        examTitle: 'Simulado Polícia Federal (2024)',
        discipline: 'Raciocínio Lógico e Matemática',
        topic: 'Lógica Proposicional',
        prompt: `(Cebraspe / PF - Agente) Considerando as proposições lógicas P e Q, a proposição condicional (P -> Q) é logicamente EQUIVALENTE a:`,
        options: [
          {
            id: 'A',
            text: '~P -> ~Q',
          },
          {
            id: 'B',
            text: '~Q -> ~P (Contrapositiva) e também ~P v Q (Disjunção equivalente)',
          },
          {
            id: 'C',
            text: 'P ^ ~Q',
          },
          {
            id: 'D',
            text: 'Q -> P (Recíproca)',
          },
          {
            id: 'E',
            text: '~P ^ ~Q',
          },
        ],
        correctOptionId: 'B',
        didacticExplanation: {
          whyCorrect:
            'As duas equivalências mais cobradas da condicional (P -> Q) são: 1) A contrapositiva (~Q -> ~P: inverte e nega ambos) e 2) A regra do "NÉ-OU" (~P v Q: nega a primeira OU mantém a segunda).',
          trapsExplanation:
            'A opção C é a NEGAÇÃO da condicional (regra do MANÉ), e não uma equivalência! A recíproca (Q -> P) não é uma equivalência válida.',
          keyConcept:
            'Equivalências de P -> Q: 1) Contrapositiva (~Q -> ~P) e 2) Regra do NÉ-OU (~P v Q).',
        },
      },
    ],
  },
];

export const PdfUploadModal: React.FC<PdfUploadModalProps> = ({
  isOpen,
  onClose,
  onAddQuestions,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseStep, setParseStep] = useState<string>('');
  const [parsedQuestions, setParsedQuestions] = useState<Question[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setIsParsing(true);
    setParseStep('Lendo arquivo binário e extraindo camadas de texto...');

    setTimeout(() => {
      setParseStep('Identificando enunciados, alternativas (A-E) e matérias...');
      setTimeout(() => {
        setParseStep('Validando gabarito didático e pegadinhas associadas...');
        setTimeout(() => {
          setIsParsing(false);
          // Use pack questions adjusted with file name
          const pack = SIMULATED_PDF_PACKS[0];
          const newQs = pack.questions.map((q) => ({
            ...q,
            examTitle: `Extraído de: ${file.name.replace('.pdf', '')}`,
          }));
          setParsedQuestions(newQs);
        }, 800);
      }, 900);
    }, 1000);
  };

  const handleLoadPreset = (packIndex: number) => {
    const pack = SIMULATED_PDF_PACKS[packIndex];
    setIsParsing(true);
    setParseStep(`Processando ${pack.name}...`);
    setTimeout(() => {
      setIsParsing(false);
      setParsedQuestions(pack.questions);
    }, 900);
  };

  const handleConfirmImport = () => {
    if (parsedQuestions && parsedQuestions.length > 0) {
      onAddQuestions(parsedQuestions);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Carregar Prova em PDF / Simulado
              </h3>
              <p className="text-xs text-slate-500">
                O analisador inteligente detecta questões, alternativas e explicações
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!parsedQuestions && !isParsing && (
            <>
              {/* Drag and drop zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-indigo-600 bg-indigo-50/40'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 shadow-inner">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800">
                  Arraste e solte o PDF da sua prova aqui
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  ou clique para selecionar do seu dispositivo (.pdf, .txt)
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Auto-detecção A-E
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Gabarito didático
                  </span>
                </div>
              </div>

              {/* Quick Preset Packs */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Ou carregue simulados pré-configurados:
                  </span>
                </div>
                <div className="space-y-2">
                  {SIMULATED_PDF_PACKS.map((pack, idx) => (
                    <div
                      key={pack.name}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {pack.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {pack.questions.length} questões com gabarito didático • {pack.size}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleLoadPreset(idx)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Carregar</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Parsing State */}
          {isParsing && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center animate-spin">
                <Loader2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">
                  Processando documento com Parser Educacional...
                </h4>
                <p className="text-xs text-indigo-600 font-medium mt-1 animate-pulse">
                  {parseStep}
                </p>
              </div>
              <div className="max-w-xs mx-auto bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {/* Parsed Result Preview */}
          {parsedQuestions && !isParsing && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    {parsedQuestions.length} questões extraídas com sucesso!
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Foram mapeadas alternativas de A a E, explicações didáticas e gabarito.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {parsedQuestions.map((q, i) => (
                  <div key={q.id} className="p-3 bg-white text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        Questão {i + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {q.discipline}
                      </span>
                      <span className="font-semibold text-emerald-700">
                        Gabarito: {q.correctOptionId}
                      </span>
                    </div>
                    <p className="text-slate-700 line-clamp-2">{q.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>

          {parsedQuestions && (
            <button
              type="button"
              onClick={handleConfirmImport}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm"
            >
              <Layers className="w-4 h-4" />
              <span>Adicionar ao Caderno ({parsedQuestions.length})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
