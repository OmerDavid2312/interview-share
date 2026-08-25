import React from 'react';
import { Plus, Sparkles, Building2, HelpCircle } from 'lucide-react';

interface HeroProps {
  onOpenShareModal: () => void;
  totalQuestions: number;
  totalCompanies: number;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenShareModal,
  totalQuestions,
  totalCompanies,
}) => {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 text-center border-b border-slate-200/80 bg-gradient-to-b from-slate-100/70 to-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>קהילה שיתופית להכנה לראיונות הייטק</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          התכוננו טוב יותר לראיון הבא
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
          שתפו שאלות אמיתיות שקיבלתם בראיונות עבודה בתחום התוכנה וההייטק, עיינו בפתרונות ובתשובות של מועמדים אחרים, ועזרו לקהילה להגיע מוכנה.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="btn-hero-share"
            onClick={onOpenShareModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-base font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
            <span>שתפו שאלה</span>
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>{totalQuestions} שאלות במאגר</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>{totalCompanies} חברות טכנולוגיה</span>
          </div>
        </div>
      </div>
    </section>
  );
};
