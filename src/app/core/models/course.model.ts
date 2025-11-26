export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  enrolledCount: number;
  rating: number;
  totalLessons: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  modules?: Module[]; // New: hierarchical structure
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
  isExpanded?: boolean; // UI state for collapsible
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  progress: number; // 0-100
  completedLessons: number;
  lastAccessedAt: Date;
  status: 'in-progress' | 'completed' | 'not-started';
  certificateIssued?: boolean;
}

export interface Lesson {
  id: string;
  courseId?: string;
  moduleId?: string; // Parent module reference
  title: string;
  description: string;
  order: number;
  type: 'video' | 'pdf' | 'quiz' | 'assignment' | 'exam' | 'webinar' | 'case-study' | 'keywords';
  contentUrl?: string;
  // Friendly alias used across mock data and templates
  content?: string;
  duration?: number;
  isCompleted?: boolean;
  isLocked?: boolean; // Progress gating
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  passingScore: number; // Percentage (0-100)
  timeLimit?: number; // in minutes
  questionCount: number;
  shuffleQuestions?: boolean;
  allowReview?: boolean;
  maxAttempts?: number;
  questions: Question[];
}

export interface Question {
  id: string;
  quizId: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  order: number;
  points: number;
  options?: QuestionOption[]; // For multiple-choice
  correctAnswer?: string | string[]; // For auto-grading
  explanation?: string; // Shown after answering
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: Date;
  submittedAt?: Date;
  score?: number;
  passed?: boolean;
  answers: QuizAnswer[];
  timeSpent?: number; // in seconds
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string | string[];
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface Assignment {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  instructions: string;
  dueDate?: Date;
  maxPoints: number;
  submissionTypes: ('text' | 'file' | 'video' | 'audio' | 'screen')[];
  allowLateSubmission?: boolean;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  submittedAt: Date;
  submissionType: 'text' | 'file' | 'video' | 'audio' | 'screen';
  content?: string; // For text submissions
  fileUrl?: string; // For file/media submissions
  fileName?: string;
  status: 'submitted' | 'graded' | 'returned';
  grade?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: Date;
}

export interface Exam {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  password?: string;
  isProctored: boolean;
  questionCount: number;
  timeLimit: number; // in minutes
  passingScore: number; // Percentage
  shuffleQuestions: boolean;
  showResultsImmediately: boolean;
  allowReview: boolean;
  maxAttempts: number;
  questions: Question[];
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: Date;
  certificateNumber: string;
  expiresAt?: Date;
  pdfUrl?: string;
}
