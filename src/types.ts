export type InterviewStage =
  | 'ראיון טכני'
  | 'ראיון קוד'
  | 'System Design'
  | 'ראיון התנהגותי'
  | 'משימת בית'
  | 'אחר';

export const INTERVIEW_STAGES: readonly InterviewStage[] = [
  'ראיון טכני',
  'ראיון קוד',
  'System Design',
  'ראיון התנהגותי',
  'משימת בית',
  'אחר',
] as const;

export type InterviewOutcome = 'passed' | 'failed' | 'pending' | 'undisclosed';

export const OUTCOME_LABELS: Record<
  InterviewOutcome,
  { label: string; textClass: string; bgClass: string; borderClass: string }
> = {
  passed: {
    label: 'עברתי את השלב',
    textClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
  },
  failed: {
    label: 'לא עברתי',
    textClass: 'text-rose-700',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-200',
  },
  pending: {
    label: 'ממתין לתשובה',
    textClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
  },
  undisclosed: {
    label: 'לא צוין',
    textClass: 'text-slate-600',
    bgClass: 'bg-slate-50',
    borderClass: 'border-slate-200',
  },
};

export interface InterviewQuestion {
  id: string;
  companyName: string;
  interviewStage: InterviewStage;
  question: string;
  answer: string;
  codeSnippet?: string;
  codeLanguage?: string;
  outcome?: InterviewOutcome;
  interviewNotes?: string;
  authorName?: string;
  jobLink?: string;
  helpfulCount: number;
  createdAt: number;
}

export interface QuestionFormData {
  companyName: string;
  interviewStage: InterviewStage | '';
  question: string;
  answer: string;
  codeSnippet: string;
  codeLanguage: string;
  outcome: InterviewOutcome;
  interviewNotes: string;
  authorName: string;
  jobLink: string;
}
