/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SearchAndFilters } from './components/SearchAndFilters';
import { QuestionCard } from './components/QuestionCard';
import { QuestionDetailsModal } from './components/QuestionDetailsModal';
import { ShareQuestionModal } from './components/ShareQuestionModal';
import { EmptyState } from './components/EmptyState';
import { InterviewQuestion, QuestionFormData } from './types';
import { getVotedQuestionIds, markQuestionAsVoted } from './utils/storage';
import {
  subscribeToQuestions,
  createQuestion,
  voteHelpful,
} from './services/questionsService';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);

  // Load voted IDs from local storage
  useEffect(() => {
    setVotedIds(getVotedQuestionIds());
  }, []);

  // Real-time Firestore subscription
  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);

    const unsubscribe = subscribeToQuestions(
      (items) => {
        setQuestions(items);
        setIsLoading(false);

        // Handle deep link ?q=id
        const params = new URLSearchParams(window.location.search);
        const urlQuestionId = params.get('q');
        if (urlQuestionId) {
          const found = items.find((q) => q.id === urlQuestionId);
          if (found) {
            setSelectedQuestion(found);
          }
        }
      },
      (err) => {
        console.error('Firestore subscription error:', err);
        setFetchError('חלה שגיאה בטעינת השאלות ממסד הנתונים בענן.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Add new question to Firestore
  const handleAddQuestion = async (formData: QuestionFormData) => {
    await createQuestion(formData);
  };

  // Vote "Helpful"
  const handleVote = async (questionId: string) => {
    if (votedIds.includes(questionId)) return;

    markQuestionAsVoted(questionId);
    setVotedIds((prev) => [...prev, questionId]);
    await voteHelpful(questionId);

    if (selectedQuestion && selectedQuestion.id === questionId) {
      setSelectedQuestion((prev) =>
        prev ? { ...prev, helpfulCount: prev.helpfulCount + 1 } : null
      );
    }
  };

  // Available unique companies for filter dropdown
  const availableCompanies = useMemo(() => {
    const companySet = new Set<string>();
    questions.forEach((q) => {
      if (q.companyName?.trim()) {
        companySet.add(q.companyName.trim());
      }
    });
    return Array.from(companySet).sort((a, b) => a.localeCompare(b, 'he'));
  }, [questions]);

  // Filtered and sorted questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((item) => {
      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const inCompany = item.companyName.toLowerCase().includes(query);
        const inQuestion = item.question.toLowerCase().includes(query);
        const inAnswer = item.answer.toLowerCase().includes(query);
        const inAuthor = (item.authorName || '').toLowerCase().includes(query);
        const inStage = item.interviewStage.toLowerCase().includes(query);

        if (!inCompany && !inQuestion && !inAnswer && !inAuthor && !inStage) {
          return false;
        }
      }

      // Company filter check
      if (selectedCompany && item.companyName !== selectedCompany) {
        return false;
      }

      // Stage filter check
      if (selectedStage && item.interviewStage !== selectedStage) {
        return false;
      }

      return true;
    });
  }, [questions, searchQuery, selectedCompany, selectedStage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCompany('');
    setSelectedStage('');
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 || selectedCompany !== '' || selectedStage !== '';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <Header onOpenShareModal={() => setIsShareModalOpen(true)} />

      {/* Hero Section */}
      <Hero
        onOpenShareModal={() => setIsShareModalOpen(true)}
        totalQuestions={questions.length}
        totalCompanies={availableCompanies.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Search & Filters */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCompany={selectedCompany}
          onCompanyChange={setSelectedCompany}
          selectedStage={selectedStage}
          onStageChange={setSelectedStage}
          availableCompanies={availableCompanies}
          totalResults={filteredQuestions.length}
          onResetFilters={handleResetFilters}
        />

        {/* Error State */}
        {fetchError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{fetchError}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-9 h-9 border-3 border-slate-300 border-t-slate-800 rounded-full animate-spin mb-3"></div>
            <p className="text-base text-slate-800 font-semibold mb-1">מתחבר למסד הנתונים בענן...</p>
            <p className="text-sm text-slate-500 font-medium">טוען שאלות מראיונות...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          /* Empty State */
          <EmptyState
            hasFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        ) : (
          /* Questions List / Grid */
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                שאלות אחרונות ששותפו
              </h2>
              <span className="text-xs text-slate-500">
                מציג {filteredQuestions.length} מתוך {questions.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredQuestions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  isVoted={votedIds.includes(q.id)}
                  onVote={handleVote}
                  onSelect={(selected) => setSelectedQuestion(selected)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">שאלות ראיון</span>
            <span>—</span>
            <span>שיתוף שאלות ותשובות מראיונות עבודה בהייטק</span>
          </div>
          <p className="text-slate-400">
            פלטפורמה פתוחה ועצמאית לטובת קהילת המפתחים ואנשי הטכנולוגיה בישראל
          </p>
        </div>
      </footer>

      {/* Share Question Modal */}
      <ShareQuestionModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSubmitQuestion={handleAddQuestion}
      />

      {/* Question Details Modal */}
      <QuestionDetailsModal
        question={selectedQuestion}
        isOpen={Boolean(selectedQuestion)}
        isVoted={selectedQuestion ? votedIds.includes(selectedQuestion.id) : false}
        onClose={() => {
          setSelectedQuestion(null);
          // Clean URL param if present without reload
          if (window.location.search.includes('q=')) {
            const url = new URL(window.location.href);
            url.searchParams.delete('q');
            window.history.replaceState({}, '', url.pathname);
          }
        }}
        onVote={handleVote}
      />
    </div>
  );
}
