import React from 'react';
import {
  ThumbsUp,
  ExternalLink,
  User,
  ShieldCheck,
  ArrowUpLeft,
  Code2,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquareQuote,
} from 'lucide-react';
import { InterviewQuestion, InterviewStage, OUTCOME_LABELS } from '../types';

interface QuestionCardProps {
  question: InterviewQuestion;
  isVoted: boolean;
  onVote: (questionId: string) => void;
  onSelect: (question: InterviewQuestion) => void;
}

const STAGE_BADGE_STYLES: Record<InterviewStage, string> = {
  'ראיון טכני': 'bg-blue-50 text-blue-700 border-blue-200/70',
  'ראיון קוד': 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
  'System Design': 'bg-purple-50 text-purple-700 border-purple-200/70',
  'ראיון התנהגותי': 'bg-amber-50 text-amber-800 border-amber-200/70',
  'משימת בית': 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  'אחר': 'bg-slate-100 text-slate-700 border-slate-200',
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isVoted,
  onVote,
  onSelect,
}) => {
  const authorDisplay = question.authorName?.trim() || 'אנונימי';
  const isAnonymous = !question.authorName?.trim();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    onSelect(question);
  };

  const handleVoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVote(question.id);
  };

  const outcomeInfo =
    question.outcome && question.outcome !== 'undisclosed'
      ? OUTCOME_LABELS[question.outcome]
      : null;

  // Check if answer contains code blocks or snippet exists
  const hasCode = Boolean(
    (question.codeSnippet && question.codeSnippet.trim()) ||
    question.answer.includes('```')
  );

  return (
    <article
      id={`card-question-${question.id}`}
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Top Header: Company + Stage & Outcome */}
        <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
          <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
            {question.companyName}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {outcomeInfo && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${outcomeInfo.bgClass} ${outcomeInfo.textClass} ${outcomeInfo.borderClass}`}
              >
                {question.outcome === 'passed' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                {question.outcome === 'failed' && <XCircle className="w-3 h-3 text-rose-600" />}
                {question.outcome === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                <span>{outcomeInfo.label}</span>
              </span>
            )}

            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                STAGE_BADGE_STYLES[question.interviewStage] || STAGE_BADGE_STYLES['אחר']
              }`}
            >
              {question.interviewStage}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug line-clamp-3 group-hover:text-slate-800">
            {question.question}
          </h3>
        </div>

        {/* Answer / Solution Preview */}
        <div className="mb-4 bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 text-slate-700 text-sm leading-relaxed">
          <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-500 mb-1">
            <span>מה עניתי / פתרון שהוצע:</span>
            {hasCode && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                <Code2 className="w-3 h-3" />
                <span>כולל קוד</span>
              </span>
            )}
          </div>
          <p className="line-clamp-3 text-slate-700 whitespace-pre-line">
            {question.answer.replace(/```[a-zA-Z0-9_-]*\n/g, '').replace(/```/g, '')}
          </p>
        </div>

        {/* Interview Notes Preview if available */}
        {question.interviewNotes && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-amber-50/60 border border-amber-100 text-amber-900 text-xs flex items-start gap-2">
            <MessageSquareQuote className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="line-clamp-2">
              <span className="font-semibold">הערות: </span>
              {question.interviewNotes}
            </p>
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap text-xs">
        {/* Left Side: Author & Job Link */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
            {isAnonymous ? (
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <User className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{authorDisplay}</span>
          </div>

          {question.jobLink && (
            <a
              id={`link-job-${question.id}`}
              href={question.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 hover:underline font-medium"
            >
              <span>קישור למשרה</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Right Side: "עזר לי" Button & Details link */}
        <div className="flex items-center gap-2">
          <button
            id={`btn-helpful-${question.id}`}
            type="button"
            onClick={handleVoteClick}
            disabled={isVoted}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isVoted
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 active:scale-95'
            }`}
            title={isVoted ? 'כבר סימנת שעזר לך' : 'סמן כשאלה שעזרה לך'}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${isVoted ? 'fill-emerald-600 text-emerald-600' : ''}`} />
            <span>עזר לי</span>
            <span className="bg-white/80 px-1.5 py-0.5 rounded text-[11px] font-bold text-slate-800 border border-slate-200/60">
              {question.helpfulCount}
            </span>
          </button>

          <button
            id={`btn-view-details-${question.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(question);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title="הצג פרטים מלאים"
          >
            <ArrowUpLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
