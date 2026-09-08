import { Question, Flashcard, Exam, UserAnswer } from '../types';

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-trf-2024',
    title: 'Simulado Nacional TRF & Concursos Federais (2024)',
    year: 2024,
    institution: 'Cebraspe / FGV Adaptado',
    discipline: 'Geral',
    description: 'Questões de alto nível focadas em Direito Constitucional e Raciocínio Lógico.',
  },
  {
    id: 'exam-oab-const',
    title: 'Exame OAB & Carreiras Jurídicas - Direito Constitucional',
    year: 2024,
    institution: 'Fundação Getulio Vargas (FGV)',
    discipline: 'Direito Constitucional',
    description: 'Foco intensivo em Direitos Fundamentais, Remédios Constitucionais e Controle.',
  },
  {
    id: 'exam-rlm-fiscal',
    title: 'Carreiras Fiscais & Controle - RLM e Matemática',
    year: 2024,
    institution: 'FCC / FGV',
    discipline: 'Raciocínio Lógico e Matemática',
    description: 'Lógica proposicional, equivalências, diagramas lógicos e probabilidades.',
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-const-01',
    examId: 'exam-trf-2024',
    examTitle: 'Simulado Nacional TRF (2024)',
    discipline: 'Direito Constitucional',
    topic: 'Direitos Fundamentais',
    prompt: `(FGV / TJ - Analista Judiciário) Tício, policial civil, durante o período noturno (às 23h), toma conhecimento de que no interior de uma residência particular está ocorrendo uma situação inequívoca de flagrante delito de tráfico ilícito de entorpecentes. Tício não possui mandado judicial.

À luz estrita do Artigo 5º, inciso XI, da Constituição Federal de 1988 e da jurisprudência pacificada do Supremo Tribunal Federal (STF - Tema 280), assinale a alternativa correta sobre a atuação do agente:`,
    options: [
      {
        id: 'A',
        text: 'A entrada no domicílio só seria lícita se munido de ordem judicial, pois à noite a inviolabilidade domiciliar é absoluta.',
      },
      {
        id: 'B',
        text: 'A entrada no domicílio no período noturno é autorizada em caso de flagrante delito, dispensando prévia autorização judicial, desde que respaldada em fundadas razões (justa causa).',
      },
      {
        id: 'C',
        text: 'Apenas no período diurno é admitida a invasão mesmo em caso de flagrante delito sem consentimento do morador.',
      },
      {
        id: 'D',
        text: 'A autorização do síndico do condomínio supre a exigência de mandado ou flagrante delito para o ingresso noturno.',
      },
      {
        id: 'E',
        text: 'Tício pode entrar para prestar socorro ou em caso de desastre, mas o flagrante delito exige sempre amanhecer do dia.',
      },
    ],
    correctOptionId: 'B',
    didacticExplanation: {
      whyCorrect:
        'Conforme o Art. 5º, XI da CF/88 ("a casa é asilo inviolável do indivíduo... salvo em caso de flagrante delito ou desastre, ou para prestar socorro, ou, durante o dia, por determinação judicial"), as hipóteses de flagrante, desastre e socorro autorizam o ingresso a QUALQUER HORA (dia ou noite). O STF (Tema 280) fixou que o ingresso forçado em domicílio sem mandado é legítimo, inclusive à noite, se amparado em "fundadas razões" devidamente justificadas a posteriori.',
      trapsExplanation:
        'A pegadinha clássica (Alternativas A, C e E) é confundir a restrição "DURANTE O DIA" com todas as hipóteses. A exigência de ser "durante o dia" aplica-se EXCLUSIVAMENTE ao cumprimento de mandado judicial! Flagrante delito, desastre e socorro valem a qualquer hora.',
      keyConcept:
        'Inviolabilidade de domicílio: determinação judicial apenas durante o dia; flagrante, socorro e desastre valem dia e noite.',
    },
  },
  {
    id: 'q-const-02',
    examId: 'exam-trf-2024',
    examTitle: 'Simulado Nacional TRF (2024)',
    discipline: 'Direito Constitucional',
    topic: 'Controle de Constitucionalidade',
    prompt: `(Cebraspe / Procuradoria) No que tange aos legitimados para a propositura de Ação Direta de Inconstitucionalidade (ADI) perante o Supremo Tribunal Federal, dispostos no Art. 103 da Constituição da República de 1988, é considerado legitimado ESPECIAL (aquele que deve demonstrar a pertinência temática entre o objeto da ação e seus objetivos institucionais):`,
    options: [
      {
        id: 'A',
        text: 'O Presidente da República.',
      },
      {
        id: 'B',
        text: 'A Mesa do Senado Federal.',
      },
      {
        id: 'C',
        text: 'O Procurador-Geral da República.',
      },
      {
        id: 'D',
        text: 'O Conselho Federal da Ordem dos Advogados do Brasil (CFOAB).',
      },
      {
        id: 'E',
        text: 'A Confederação Sindical ou entidade de classe de âmbito nacional.',
      },
    ],
    correctOptionId: 'E',
    didacticExplanation: {
      whyCorrect:
        'São legitimados ESPECIAIS (exigem pertinência temática): 1) Governador de Estado ou do DF; 2) Mesa da Assembleia Legislativa ou da Câmara Legislativa do DF; 3) Confederação Sindical ou entidade de classe de âmbito nacional. Todos os demais do Art. 103 são legitimados UNIVERSAIS (Presidente, Mesa do Senado, Mesa da Câmara, PGR, CFOAB e partidos políticos com representação no Congresso).',
      trapsExplanation:
        'Muito cuidado com o Conselho Federal da OAB (Alternativa D)! Embora muitos achem que entidades profissionais precisam de pertinência temática, o CFOAB possui status constitucional de legitimado UNIVERSAL, podendo impugnar qualquer lei sobre qualquer matéria.',
      keyConcept:
        'Legitimados Especiais da ADI: Governadores, Mesas de Assembleias Legislativas e Confederações Sindicais/Entidades de classe nacionais (exigem pertinência temática).',
    },
  },
  {
    id: 'q-const-03',
    examId: 'exam-oab-const',
    examTitle: 'Exame OAB - Direito Constitucional',
    discipline: 'Direito Constitucional',
    topic: 'Remédios Constitucionais',
    prompt: `(FGV / Exame de Ordem) Caio solicitou formalmente a uma autarquia federal acesso a dados cadastrais e fichas relativas à sua pessoa constantes de banco de dados público. A autarquia recusou imotivadamente o fornecimento das informações. Diante disso, assinale o instrumento constitucional adequado e sua respectiva regra de custas:`,
    options: [
      {
        id: 'A',
        text: 'Habeas Data, sendo ação gratuita por mandamento expresso da Constituição Federal.',
      },
      {
        id: 'B',
        text: 'Mandado de Segurança, sendo isento de custas processuais por tratar de direito líquido e certo.',
      },
      {
        id: 'C',
        text: 'Ação Popular, que tem cabimento privativo para retificação ou conhecimento de dados pessoais.',
      },
      {
        id: 'D',
        text: 'Habeas Data, desde que recolhidas previamente as custas e taxas judiciárias fixadas em regimento.',
      },
      {
        id: 'E',
        text: 'Habeas Corpus, pois a recusa estatal de informação fere a liberdade de locomoção civil do postulante.',
      },
    ],
    correctOptionId: 'A',
    didacticExplanation: {
      whyCorrect:
        'O Art. 5º, LXXII da CF/88 prevê a concessão de Habeas Data para assegurar o conhecimento de informações relativas à pessoa do impetrante. E, segundo o Art. 5º, LXXVII, são gratuitas as ações de Habeas Corpus e Habeas Data, e, na forma da lei, os atos necessários ao exercício da cidadania.',
      trapsExplanation:
        'A pegadinha é achar que Mandado de Segurança é gratuito (MS paga custas normalmente!) ou que Habeas Data paga custas (Alternativa D). Além disso, o Mandado de Segurança é residual, não cabendo quando protegível por Habeas Data.',
      keyConcept:
        'Habeas Corpus e Habeas Data são AÇÕES GRATUITAS por previsão constitucional expressa (Art. 5º, LXXVII).',
    },
  },
  {
    id: 'q-const-04',
    examId: 'exam-oab-const',
    examTitle: 'Exame OAB - Direito Constitucional',
    discipline: 'Direito Constitucional',
    topic: 'Organização do Estado',
    prompt: `(FCC / Analista) De acordo com a repartição constitucional de competências legislativas na CF/88, compete PRIVATIVAMENTE à União legislar sobre:`,
    options: [
      {
        id: 'A',
        text: 'Direito tributário, financeiro, penitenciário, econômico e urbanístico.',
      },
      {
        id: 'B',
        text: 'Direito civil, comercial, penal, processual, eleitoral, agrário, marítimo, aeronáutico, espacial e do trabalho.',
      },
      {
        id: 'C',
        text: 'Proteção e integração social das pessoas portadoras de deficiência.',
      },
      {
        id: 'D',
        text: 'Florestas, caça, pesca, fauna, conservação da natureza e defesa do solo.',
      },
      {
        id: 'E',
        text: 'Previdência social, proteção e defesa da saúde.',
      },
    ],
    correctOptionId: 'B',
    didacticExplanation: {
      whyCorrect:
        'O Artigo 22, inciso I, da CF/88 estabelece como competência PRIVATIVA da União legislar sobre: "direito civil, comercial, penal, processual, eleitoral, agrário, marítimo, aeronáutico, espacial e do trabalho" (o famoso mnemônico CAPACETE DE PM).',
      trapsExplanation:
        'As opções A, C, D e E tratam de matérias de competência CONCORRENTE entre União, Estados e DF (Artigo 24 da CF/88): tributário, financeiro, penitenciário, econômico, urbanístico (PUTO FE), saúde, previdência e meio ambiente.',
      keyConcept:
        'Competência privativa da União (Art. 22): CAPACETE DE PM (Civil, Agrário, Penal, Aeronáutico, Comercial, Espacial, Trabalho, Eleitoral, Processual, Marítimo).',
    },
  },
  {
    id: 'q-rlm-01',
    examId: 'exam-rlm-fiscal',
    examTitle: 'Carreiras Fiscais - RLM',
    discipline: 'Raciocínio Lógico e Matemática',
    topic: 'Lógica Proposicional',
    prompt: `(Cebraspe / Auditor Fiscal) Considere a seguinte proposição condicional:
"Se Tício estuda com constância, então ele é aprovado no concurso público."

A negação lógica correta e equivalente dessa proposição é:`,
    options: [
      {
        id: 'A',
        text: 'Se Tício não estuda com constância, então ele não é aprovado no concurso público.',
      },
      {
        id: 'B',
        text: 'Tício não estuda com constância ou ele não é aprovado no concurso público.',
      },
      {
        id: 'C',
        text: 'Tício estuda com constância e ele não é aprovado no concurso público.',
      },
      {
        id: 'D',
        text: 'Se Tício é aprovado no concurso público, então ele estudou com constância.',
      },
      {
        id: 'E',
        text: 'Tício não estuda com constância e ele é aprovado no concurso público.',
      },
    ],
    correctOptionId: 'C',
    didacticExplanation: {
      whyCorrect:
        'A negação da proposição condicional p -> q é dada pela fórmula clássica ~(p -> q) ≡ p ^ ~q. Na prática, aplica-se a regra do "MANÉ": MANTÉM a primeira ("Tício estuda com constância") E (conjunção ^) NEGA a segunda ("ele não é aprovado no concurso público").',
      trapsExplanation:
        'A pegadinha mais frequente dos candidatos é achar que negar "Se p, então q" gera outra condicional "Se não p, então não q" (Alternativa A). A negação de uma condicional NUNCA é outra condicional! É uma conjunção com o conectivo "E".',
      keyConcept:
        'Negação de P -> Q: Regra do MANÉ (Mantém a 1ª E Nega a 2ª): p ^ ~q. Jamais é outra condicional.',
    },
  },
  {
    id: 'q-rlm-02',
    examId: 'exam-rlm-fiscal',
    examTitle: 'Carreiras Fiscais - RLM',
    discipline: 'Raciocínio Lógico e Matemática',
    topic: 'Probabilidade e Análise Combinatória',
    prompt: `(FGV / Receita) Em uma urna há exatamente 10 bolas idênticas em peso e tamanho, sendo 6 bolas azuis e 4 bolas vermelhas. Duas bolas são sorteadas sucessivamente e SEM REPOSIÇÃO.

Qual é a probabilidade exata de que a primeira bola sorteada seja azul e a segunda bola sorteada seja vermelha?`,
    options: [
      {
        id: 'A',
        text: '24/100 (24%)',
      },
      {
        id: 'B',
        text: '4/15 (aproximadamente 26,67%)',
      },
      {
        id: 'C',
        text: '1/3 (aproximadamente 33,33%)',
      },
      {
        id: 'D',
        text: '12/45 ou 4/15',
      },
      {
        id: 'E',
        text: '6/10 + 4/9',
      },
    ],
    correctOptionId: 'B',
    didacticExplanation: {
      whyCorrect:
        'Como a retirada é SEM reposição: A probabilidade da primeira ser azul é P(A) = 6/10 = 3/5. Após retirar uma bola azul, restam 9 bolas no total, das quais 4 são vermelhas. Logo, a probabilidade da segunda ser vermelha é P(V|A) = 4/9. Pelo princípio multiplicativo: P = (6/10) * (4/9) = 24/90. Dividindo numerador e denominador por 6, obtemos exatamente 4/15.',
      trapsExplanation:
        'A alternativa A (24/100) é a pegadinha com reposição (6/10 * 4/10). A alternativa E soma probabilidades de eventos independentes em vez de multiplicar (regra do "OU" vs regra do "E"). Nota: B e D têm simplificação similar, mas 24/90 = 4/15 (12/45 = 4/15).',
      keyConcept:
        'Probabilidade sem reposição: P(A e B) = P(A) * P(B|A). O número total de casos no denominador diminui em 1 a cada retirada.',
    },
  },
  {
    id: 'q-rlm-03',
    examId: 'exam-rlm-fiscal',
    examTitle: 'Carreiras Fiscais - RLM',
    discipline: 'Raciocínio Lógico e Matemática',
    topic: 'Diagramas Lógicos',
    prompt: `(Vunesp / Tribunal de Contas) Considere verdadeiras as seguintes premissas:
1. "Todo auditor é pontual."
2. "Algum pesquisador não é pontual."

A partir dessas premissas, é necessariamente CORRETO concluir que:`,
    options: [
      {
        id: 'A',
        text: 'Nenhum pesquisador é auditor.',
      },
      {
        id: 'B',
        text: 'Todo pesquisador é auditor.',
      },
      {
        id: 'C',
        text: 'Algum pesquisador não é auditor.',
      },
      {
        id: 'D',
        text: 'Algum auditor não é pesquisador.',
      },
      {
        id: 'E',
        text: 'Nenhum auditor é pontual.',
      },
    ],
    correctOptionId: 'C',
    didacticExplanation: {
      whyCorrect:
        'Pela premissa 1, todo elemento do conjunto dos auditores está contido no conjunto dos pontuais (Auditores ⊆ Pontuais). Pela premissa 2, existe pelo menos um pesquisador que está FORA do conjunto dos pontuais. Se esse pesquisador está fora dos pontuais, e todos os auditores estão dentro dos pontuais, esse pesquisador obrigatoriamente NÃO PODE ser auditor. Logo: "Algum pesquisador não é auditor".',
      trapsExplanation:
        'Concluir que "Nenhum pesquisador é auditor" (Alternativa A) extrapola as premissas, pois outros pesquisadores podem sim ser auditores pontuais. A única certeza lógica estrita é a existência de pelo menos um que não é.',
      keyConcept:
        'Silogismo e Diagramas: Se A ⊆ B e existe C ∉ B, então esse elemento de C necessariamente ∉ A.',
    },
  },
];

// 4 Initial Flashcards: 2 due today (past due timestamp), 2 due in the future
export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-01',
    questionId: 'q-rlm-01',
    discipline: 'Raciocínio Lógico e Matemática',
    topic: 'Lógica Proposicional',
    front: 'Como fazer a NEGAÇÃO lógica de uma condicional (P -> Q)? Qual o mnemônico?',
    back: 'Regra do "MANÉ": MANTÉM a 1ª parte E NEGA a 2ª parte!\n\nFórmula: ~(P -> Q) ≡ P ^ ~Q\n\n⚠️ Pegadinha: A negação de uma condicional NUNCA é outra condicional.',
    keyTakeaway: 'Negação de P -> Q é P e não Q (P ^ ~Q).',
    due_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago (Due TODAY!)
    state: 'review',
    stability: 2.8,
    difficulty: 4.5,
    reps: 2,
    lapses: 0,
    last_review: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    interval: 3,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fc-02',
    questionId: 'q-const-01',
    discipline: 'Direito Constitucional',
    topic: 'Direitos Fundamentais',
    front: 'Inviolabilidade de Domicílio (Art. 5º, XI CF/88): Quando é lícita a entrada noturna SEM autorização do morador?',
    back: 'À NOITE (qualquer horário) é lícita em apenas 3 hipóteses:\n1. Flagrante delito (com fundadas razões - STF Tema 280)\n2. Prestar socorro\n3. Desastre\n\n⚠️ Atenção: Por determinação judicial, APENAS DURANTE O DIA!',
    keyTakeaway: 'Mandado judicial = só durante o dia. Flagrante/socorro/desastre = dia e noite.',
    due_date: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago (Due TODAY!)
    state: 'review',
    stability: 3.5,
    difficulty: 5.0,
    reps: 3,
    lapses: 1,
    last_review: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    interval: 4,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fc-03',
    questionId: 'q-const-02',
    discipline: 'Direito Constitucional',
    topic: 'Controle de Constitucionalidade',
    front: 'Quais são os 3 Legitimados ESPECIAIS da ADI que exigem demonstração de pertinência temática?',
    back: 'São apenas 3:\n1. Governador de Estado ou do DF\n2. Mesa de Assembleia Legislativa ou da CLDF\n3. Confederação Sindical ou Entidade de Classe de âmbito nacional\n\nTodos os outros do Art. 103 (Presidente, Mesas do Congresso, PGR, CFOAB, Partidos com representação) são UNIVERSAIS.',
    keyTakeaway: 'Legitimados especiais na ADI: Governadores, Mesas de Assembleias e Confederações/Classes nacionais.',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // in 2 days
    state: 'review',
    stability: 5.2,
    difficulty: 4.8,
    reps: 3,
    lapses: 0,
    last_review: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    interval: 3,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fc-04',
    questionId: 'q-const-03',
    discipline: 'Direito Constitucional',
    topic: 'Remédios Constitucionais',
    front: 'Quais remédios constitucionais são EXPRESSAMENTE GRATUITOS segundo a CF/88?',
    back: 'Ações gratuitas na CF/88 (Art. 5º, LXXVII):\n• Habeas Corpus (HC)\n• Habeas Data (HD)\n• Atos necessários ao exercício da cidadania (na forma da lei)\n\n⚠️ Mandado de Segurança (MS) e Mandado de Injunção (MI) NÃO são gratuitos!',
    keyTakeaway: 'HC e HD são gratuitos na CF/88. MS paga custas normais.',
    due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // in 4 days
    state: 'review',
    stability: 7.0,
    difficulty: 3.5,
    reps: 4,
    lapses: 0,
    last_review: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    interval: 6,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Initial pre-recorded user answers so analytics have rich starting baseline data
export const INITIAL_USER_ANSWERS: Record<string, UserAnswer> = {
  'q-const-01': {
    questionId: 'q-const-01',
    selectedOptionId: 'B',
    isCorrect: true,
    answeredAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  'q-rlm-02': {
    questionId: 'q-rlm-02',
    selectedOptionId: 'A', // Answered incorrectly earlier to populate error analytics
    isCorrect: false,
    answeredAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
};
