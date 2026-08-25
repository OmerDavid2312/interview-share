import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Code2,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
} from 'lucide-react';
import {
  InterviewStage,
  INTERVIEW_STAGES,
  QuestionFormData,
} from '../types';

interface ShareQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuestion: (formData: QuestionFormData) => Promise<void>;
}

const INITIAL_FORM: QuestionFormData = {
  companyName: '',
  interviewStage: '',
  question: '',
  answer: '',
  codeSnippet: '',
  codeLanguage: 'javascript',
  outcome: 'undisclosed',
  interviewNotes: '',
  authorName: '',
  jobLink: '',
};

const CODE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript / TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java / Kotlin' },
  { value: 'csharp', label: 'C# / .NET' },
  { value: 'cpp', label: 'C / C++' },
  { value: 'go', label: 'Go' },
  { value: 'sql', label: 'SQL' },
  { value: 'html', label: 'HTML / CSS' },
  { value: 'bash', label: 'Bash / Shell' },
];

export const ShareQuestionModal: React.FC<ShareQuestionModalProps> = ({
  isOpen,
  onClose,
  onSubmitQuestion,
}) => {
  const [formData, setFormData] = useState<QuestionFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showCodeInput, setShowCodeInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM);
      setErrors({});
      setIsSuccess(false);
      setIsSubmitting(false);
      setSubmitError(null);
      setShowCodeInput(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'נא להזין את שם החברה';
    }

    if (!formData.interviewStage) {
      newErrors.interviewStage = 'נא לבחור את שלב הראיון';
    }

    if (!formData.question.trim()) {
      newErrors.question = 'נא לפרט את השאלה שנשאלה';
    } else if (formData.question.trim().length < 5) {
      newErrors.question = 'השאלה צריכה להכיל לפחות 5 תווים';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'נא לפרט מה עניתם או איזה פתרון הצעתם';
    } else if (formData.answer.trim().length < 5) {
      newErrors.answer = 'התשובה צריכה להכיל לפחות 5 תווים';
    }

    if (formData.jobLink.trim()) {
      const link = formData.jobLink.trim();
      if (!link.startsWith('http://') && !link.startsWith('https://')) {
        newErrors.jobLink = 'קישור למשרה חייב להתחיל ב-https:// או http://';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmitQuestion(formData);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Failed to submit question:', err);
      setSubmitError('אירעה שגיאה בשמירת השאלה במסד הנתונים. אנא נסו שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        id="modal-share-question"
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              שתפו שאלה מראיון
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              עזרו למועמדים אחרים להתכונן ולעבור ראיונות בהצלחה
            </p>
          </div>

          <button
            id="btn-close-share-modal"
            onClick={onClose}
            aria-label="סגור חלון"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center flex flex-col items-center justify-center my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              השאלה נשמרה ב-Database בהצלחה!
            </h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              תודה על השיתוף. השאלה שלך זמינה עכשיו לכל החברים והמשתמשים בזמן אמת.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Mandatory Notice */}
              <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-amber-900 text-xs leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">הנחיות לשיתוף בטוח:</span>
                  אין לשתף מידע סודי, קוד פרטי או מידע אישי על עובדים ומועמדים.
                </div>
              </div>

              {submitError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-xs font-medium">
                  {submitError}
                </div>
              )}

              {/* Row 1: Company Name + Interview Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Company Name */}
                <div>
                  <label
                    htmlFor="input-company-name"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    שם החברה <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-company-name"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => {
                      setFormData({ ...formData, companyName: e.target.value });
                      if (errors.companyName) setErrors({ ...errors, companyName: '' });
                    }}
                    placeholder="לדוגמה: Wix, Check Point, Meta"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.companyName
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800/10'
                    }`}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-rose-500 mt-1">{errors.companyName}</p>
                  )}
                </div>

                {/* 2. Interview Stage */}
                <div>
                  <label
                    htmlFor="select-interview-stage"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    שלב הראיון <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="select-interview-stage"
                    value={formData.interviewStage}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        interviewStage: e.target.value as InterviewStage,
                      });
                      if (errors.interviewStage) setErrors({ ...errors, interviewStage: '' });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 cursor-pointer ${
                      errors.interviewStage
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800/10'
                    }`}
                  >
                    <option value="">בחרו את שלב הראיון</option>
                    {INTERVIEW_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                  {errors.interviewStage && (
                    <p className="text-xs text-rose-500 mt-1">{errors.interviewStage}</p>
                  )}
                </div>
              </div>

              {/* 3. Question Asked */}
              <div>
                <label
                  htmlFor="textarea-question"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  השאלה שנשאלה <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="textarea-question"
                  rows={3}
                  value={formData.question}
                  onChange={(e) => {
                    setFormData({ ...formData, question: e.target.value });
                    if (errors.question) setErrors({ ...errors, question: '' });
                  }}
                  placeholder="פרטו את השאלה במלואה, דרישות או תרחיש שנשאלתם עליו..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.question
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800/10'
                  }`}
                />
                {errors.question && (
                  <p className="text-xs text-rose-500 mt-1">{errors.question}</p>
                )}
              </div>

              {/* 4. What I Answered */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="textarea-answer"
                    className="block text-xs font-bold text-slate-700"
                  >
                    מה עניתי או איזה פתרון הצעתי <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCodeInput(!showCodeInput)}
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{showCodeInput ? 'הסתר עורך קוד' : '+ הוספת קטע קוד / מימוש'}</span>
                  </button>
                </div>
                <textarea
                  id="textarea-answer"
                  rows={3}
                  value={formData.answer}
                  onChange={(e) => {
                    setFormData({ ...formData, answer: e.target.value });
                    if (errors.answer) setErrors({ ...errors, answer: '' });
                  }}
                  placeholder="הסבירו בקצרה את הפתרון, הארכיטקטורה, הגישה או התשובה שנתתם בראיון..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.answer
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800/10'
                  }`}
                />
                {errors.answer && (
                  <p className="text-xs text-rose-500 mt-1">{errors.answer}</p>
                )}
              </div>

              {/* Code Snippet Input (Toggleable) */}
              {showCodeInput && (
                <div className="bg-slate-900 rounded-xl p-3.5 border border-slate-800 text-white space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-slate-200">קטע קוד / פתרון בקוד</span>
                    </div>
                    <select
                      value={formData.codeLanguage}
                      onChange={(e) => setFormData({ ...formData, codeLanguage: e.target.value })}
                      className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {CODE_LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    rows={5}
                    value={formData.codeSnippet}
                    onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                    placeholder={`// הדביקו כאן את הקוד שכתבתם בראיון...\nfunction solution() {\n  // ...\n}`}
                    dir="ltr"
                    className="w-full font-mono text-xs p-3 rounded-lg bg-slate-950 text-emerald-300 border border-slate-800 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 resize-y"
                  />
                </div>
              )}

              {/* Row: Interview Outcome (עברתי / לא עברתי) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  האם עברת את השלב?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, outcome: 'passed' })}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      formData.outcome === 'passed'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>עברתי</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, outcome: 'failed' })}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      formData.outcome === 'failed'
                        ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>לא עברתי</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, outcome: 'pending' })}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      formData.outcome === 'pending'
                        ? 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>ממתין לתשובה</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, outcome: 'undisclosed' })}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      formData.outcome === 'undisclosed'
                        ? 'bg-slate-100 border-slate-400 text-slate-800 ring-2 ring-slate-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>מעדיף לא לציין</span>
                  </button>
                </div>
              </div>

              {/* Interview Notes / Tips */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="textarea-notes"
                    className="block text-xs font-bold text-slate-700"
                  >
                    הערות על הראיון / טיפים לאחרים
                  </label>
                  <span className="text-[11px] text-slate-400">אופציונלי</span>
                </div>
                <textarea
                  id="textarea-notes"
                  rows={2}
                  value={formData.interviewNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, interviewNotes: e.target.value })
                  }
                  placeholder="איך הייתה האווירה? על מה המראיינים שמו דגש? טיפים למי שמתראיין שם..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10"
                />
              </div>

              {/* Row 2: Author Name (Optional) + Job Link (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* 5. Display Name (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="input-author-name"
                      className="block text-xs font-bold text-slate-700"
                    >
                      שם להצגה
                    </label>
                    <span className="text-[11px] text-slate-400">אופציונלי</span>
                  </div>
                  <input
                    id="input-author-name"
                    type="text"
                    value={formData.authorName}
                    onChange={(e) =>
                      setFormData({ ...formData, authorName: e.target.value })
                    }
                    placeholder="אם יושאר ריק יוצג 'אנונימי'"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    ברירת מחדל: אנונימי. אין צורך לחשוף פרטים מזהים.
                  </p>
                </div>

                {/* 6. Job Link (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="input-job-link"
                      className="block text-xs font-bold text-slate-700"
                    >
                      קישור למשרה
                    </label>
                    <span className="text-[11px] text-slate-400">אופציונלי</span>
                  </div>
                  <input
                    id="input-job-link"
                    type="url"
                    value={formData.jobLink}
                    onChange={(e) => {
                      setFormData({ ...formData, jobLink: e.target.value });
                      if (errors.jobLink) setErrors({ ...errors, jobLink: '' });
                    }}
                    placeholder="https://..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.jobLink
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800/10'
                    }`}
                  />
                  {errors.jobLink ? (
                    <p className="text-xs text-rose-500 mt-1">{errors.jobLink}</p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-1">
                      קישור לעמוד קריירה / פרסום המשרה אם רלוונטי
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-3">
              <button
                id="btn-cancel-share"
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                ביטול
              </button>
              <button
                id="btn-submit-share"
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span>שומר ב-Firebase...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>פרסום שאלה</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
