export type LessonType =
  | 'section'
  | 'content_page'
  | 'web_content'
  | 'video'
  | 'audio'
  | 'presentation_document'
  | 'iframe'
  | 'test'
  | 'survey'
  | 'assignment'
  | 'ilt'
  | 'scorm';

export interface Lesson {
  id: string;
  courseId?: string;
  title: string;
  description?: string;
  order: number;
  type: LessonType;
  content?: string;
  contentUrl?: string;
  duration?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  passingScore?: number;
  password?: string;
  isPractice?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: number;
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
  lessons: Lesson[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  progress: number;
  completedLessons: number;
  lastAccessedAt: Date;
  status: 'in-progress' | 'completed' | 'not-started';
  certificateIssued?: boolean;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  questionCount: number;
  shuffleQuestions?: boolean;
  allowReview?: boolean;
  maxAttempts?: number;
  questions: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
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
  timeSpent?: number;
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
  content?: string;
  fileUrl?: string;
  fileName?: string;
  status: 'submitted' | 'graded' | 'returned';
  grade?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: Date;
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
