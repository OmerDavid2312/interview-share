const STORAGE_KEY_VOTED_IDS = 'interview_voted_questions';

export function getVotedQuestionIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VOTED_IDS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

export function markQuestionAsVoted(questionId: string): void {
  try {
    const current = getVotedQuestionIds();
    if (!current.includes(questionId)) {
      current.push(questionId);
      localStorage.setItem(STORAGE_KEY_VOTED_IDS, JSON.stringify(current));
    }
  } catch (err) {
    console.error('Error saving voted state:', err);
  }
}
