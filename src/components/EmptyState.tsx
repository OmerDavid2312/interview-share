import React from 'react';
import { SearchX, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
  onOpenShareModal: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onResetFilters,
  onOpenShareModal,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center my-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
        <SearchX className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2">
        {hasFilters ? 'לא נמצאו שאלות מתאימות לחיפוש' : 'אין עדיין שאלות במאגר'}
      </h3>

      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
        {hasFilters
          ? 'נסו לשנות את מילות החיפוש או לאפס את הסינון כדי לראות את כל השאלות.'
          : 'היו הראשונים לשתף שאלה מראיון עבודה ועזרו לקהילה להתכונן!'}
      </p>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        {hasFilters && (
          <button
            id="btn-empty-reset"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>איפוס סינון</span>
          </button>
        )}
        <button
          id="btn-empty-share"
          onClick={onOpenShareModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>שתפו שאלה עכשיו</span>
        </button>
      </div>
    </div>
  );
};
