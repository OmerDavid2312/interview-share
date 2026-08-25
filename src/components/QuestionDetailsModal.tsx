import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  ThumbsUp,
  ExternalLink,
  User,
  ShieldCheck,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquareQuote,
} from 'lucide-react';
import { InterviewQuestion, InterviewStage, OUTCOME_LABELS } from '../types';
import { FormattedSolutionView } from './CodeBlock';

interface QuestionDetailsModalProps {
  question: InterviewQuestion | null;
  isOpen: boolean;
  isVoted: boolean;
  onClose: () => void;
  onVote: (questionId: string) => void;
}

const STAGE_BADGE_STYLES: Record<InterviewStage, string> = {
  'ראיון טכני': 'bg-blue-50 text-blue-700 border-blue-200/70',
  'ראיון קוד': 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
  'System Design': 'bg-purple-50 text-purple-700 border-purple-200/70',
  'ראיון התנהגותי': 'bg-amber-50 text-amber-800 border-amber-200/70',
  'משימת בית': 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  'אחר': 'bg-slate-100 text-slate-700 border-slate-200',
};

export const QuestionDetailsModal: React.FC<QuestionDetailsModalProps> = ({
  question,
  isOpen,
  isVoted,
  onClose,
  onVote,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !question) return null;

  const authorDisplay = question.authorName?.trim() || 'אנונימי';
  const isAnonymous = !question.authorName?.trim();

  const handleCopyLink = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('q', question.id);
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const formattedDate = new Intl.DateTimeFormat('he-IL', {
    dateStyle: 'medium',
  }).format(new Date(question.createdAt));

  const outcomeInfo = question.outcome && question.outcome !== 'undisclosed'
    ? OUTCOME_LABELS[question.outcome]
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        id="modal-question-details"
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-10 my-8 flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {question.companyName}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    STAGE_BADGE_STYLES[question.interviewStage] || STAGE_BADGE_STYLES['אחר']
                  }`}
                >
                  {question.interviewStage}
                </span>

                {outcomeInfo && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${outcomeInfo.bgClass} ${outcomeInfo.textClass} ${outcomeInfo.borderClass}`}
                  >
                    {question.outcome === 'passed' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    {question.outcome === 'failed' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                    {question.outcome === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    <span>{outcomeInfo.label}</span>
                  </span>
                )}

                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          <button
            id="btn-close-details-modal"
            onClick={onClose}
            aria-label="סגור חלון"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Question Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              השאלה שנשאלה בראיון
            </h4>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-slate-900 text-base font-medium leading-relaxed whitespace-pre-line">
              {question.question}
            </div>
          </div>

          {/* Answer Section with Syntax Highlighted Code */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              מה עניתי / הפתרון שהצעתי
            </h4>
            <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4">
              <FormattedSolutionView
                text={question.answer}
                codeSnippet={question.codeSnippet}
                codeLanguage={question.codeLanguage}
              />
            </div>
          </div>

          {/* Interview Notes & Tips if present */}
          {question.interviewNotes && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquareQuote className="w-4 h-4 text-amber-600" />
                <span>הערות על הראיון / טיפים</span>
              </h4>
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 text-amber-950 text-sm leading-relaxed whitespace-pre-line">
                {question.interviewNotes}
              </div>
            </div>
          )}

          {/* Meta Info: Author & Job link */}
          <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="text-xs text-slate-500 font-medium">שותף על ידי:</span>
              <div className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                {isAnonymous ? (
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                ) : (
                  <User className="w-4 h-4 text-slate-400" />
                )}
                <span>{authorDisplay}</span>
              </div>
            </div>

            {question.jobLink ? (
              <a
                id="link-details-job"
                href={question.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 hover:underline font-semibold text-xs"
              >
                <span>צפייה בקישור למשרה</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-xs text-slate-400">לא צורף קישור למשרה</span>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 flex-wrap">
          <button
            id="btn-copy-question-link"
            type="button"
            onClick={handleCopyLink}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span>הקישור הועתק ללוח!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>העתקת קישור לשאלה</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <button
              id="btn-details-helpful"
              type="button"
              onClick={() => onVote(question.id)}
              disabled={isVoted}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isVoted
                  ? 'bg-emerald-600 text-white shadow-xs cursor-default'
                  : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{isVoted ? 'סימנת שעזר לך' : 'עזר לי'}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                {question.helpfulCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
