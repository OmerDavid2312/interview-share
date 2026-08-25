import React from 'react';
import { Search, X, Filter, Building2, Layers } from 'lucide-react';
import { InterviewStage, INTERVIEW_STAGES } from '../types';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCompany: string;
  onCompanyChange: (company: string) => void;
  selectedStage: string;
  onStageChange: (stage: string) => void;
  availableCompanies: string[];
  totalResults: number;
  onResetFilters: () => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCompany,
  onCompanyChange,
  selectedStage,
  onStageChange,
  availableCompanies,
  totalResults,
  onResetFilters,
}) => {
  const hasActiveFilters =
    searchQuery.trim().length > 0 || selectedCompany !== '' || selectedStage !== '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-6">
      {/* Search Input Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          id="input-search-questions"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="חיפוש לפי שאלה, חברה או מילות מפתח..."
          className="w-full pr-11 pl-10 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 text-sm transition-all"
        />
        {searchQuery && (
          <button
            id="btn-clear-search"
            onClick={() => onSearchChange('')}
            aria-label="נקה חיפוש"
            className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Selects Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Company Filter */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <Building2 className="w-4 h-4" />
          </div>
          <select
            id="select-company-filter"
            value={selectedCompany}
            onChange={(e) => onCompanyChange(e.target.value)}
            className="w-full pr-9 pl-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 cursor-pointer appearance-none"
          >
            <option value="">כל החברות ({availableCompanies.length})</option>
            {availableCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        {/* Stage Filter */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <Layers className="w-4 h-4" />
          </div>
          <select
            id="select-stage-filter"
            value={selectedStage}
            onChange={(e) => onStageChange(e.target.value)}
            className="w-full pr-9 pl-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 cursor-pointer appearance-none"
          >
            <option value="">כל שלבי הראיון</option>
            {INTERVIEW_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button or Results count */}
        <div className="lg:col-span-2 flex items-center justify-between lg:justify-end gap-2">
          {hasActiveFilters ? (
            <button
              id="btn-reset-filters"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer w-full lg:w-auto justify-center"
            >
              <X className="w-3.5 h-3.5" />
              <span>איפוס סינון</span>
            </button>
          ) : (
            <span className="text-xs text-slate-500 font-medium px-1">
              {totalResults} שאלות
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
