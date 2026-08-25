import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { InterviewQuestion, QuestionFormData, InterviewStage } from '../types';

const COLLECTION_NAME = 'questions';

export function subscribeToQuestions(
  onData: (questions: InterviewQuestion[]) => void,
  onError: (error: Error) => void
) {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const questions: InterviewQuestion[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          companyName: data.companyName || '',
          interviewStage: (data.interviewStage as InterviewStage) || 'אחר',
          question: data.question || '',
          answer: data.answer || '',
          authorName: data.authorName || undefined,
          jobLink: data.jobLink || undefined,
          helpfulCount: typeof data.helpfulCount === 'number' ? data.helpfulCount : 0,
          createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
        };
      });
      onData(questions);
    },
    (err) => {
      console.error('Error fetching questions from Firestore:', err);
      onError(err);
    }
  );
}

export async function createQuestion(formData: QuestionFormData): Promise<string> {
  const colRef = collection(db, COLLECTION_NAME);
  const newDoc = {
    companyName: formData.companyName.trim(),
    interviewStage: formData.interviewStage as InterviewStage,
    question: formData.question.trim(),
    answer: formData.answer.trim(),
    authorName: formData.authorName.trim() || '',
    jobLink: formData.jobLink.trim() || '',
    helpfulCount: 0,
    createdAt: Date.now(),
  };

  const docRef = await addDoc(colRef, newDoc);
  return docRef.id;
}

export async function voteHelpful(questionId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, questionId);
  await updateDoc(docRef, {
    helpfulCount: increment(1),
  });
}
