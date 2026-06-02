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
  content_body?: string;
  contentUrl?: string;
  duration_minutes?: number;
  password?: string;
  isPractice?: boolean;
  passingScore?: number;

  // Schema fields
  is_mandatory?: boolean;
  completion_method?: 'button' | 'time' | 'question';
  completion_question?: string;
  delay_hours?: number;
  delay_days?: number;
  is_shared?: boolean;

  // UI state only — maps to lesson_progress.status in DB.
  // Replace with progress service in Phase 1A localStorage persistence task.
  isCompleted?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  lessons: Lesson[];

  // Schema fields
  tenant_id?: number;
  thumbnail_url?: string;
  category_id?: number;
  price?: number;
  is_published?: boolean;
  is_active?: boolean;
  issues_certificate?: boolean;
  created_by?: string;
  completion_rule?: 'all_units' | 'specific_test_passed';
  completion_test_id?: string;
  is_ceu?: boolean;
  ceu_credit_hours?: number;
  certificate_type?: 'core' | 'ceu';
  is_paygo?: boolean;
  paygo_parent_course_id?: string;
  paygo_part_number?: number;
  paygo_total_parts?: number;
  default_time_limit_days?: number;

  // UI display helpers — not in schema
  category?: string;
  duration?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  instructor?: { id: string; name: string; avatar: string };
  enrolledCount?: number;
  rating?: number;
  totalLessons?: number;
  tags?: string[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrollment_date: Date;
  status: 'enrolled' | 'suspended' | 'in_progress' | 'completed' | 'expired' | 'not_passed';

  // Schema fields
  tenant_id?: number;
  branch_id?: number;
  enrolled_by?: string;
  expiration_date?: Date;
  payment_id?: string;
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
