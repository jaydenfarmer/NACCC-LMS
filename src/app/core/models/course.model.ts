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
  courseId: string;
  title: string;
  description: string;
  order: number;
  type: 'video' | 'pdf' | 'quiz' | 'assignment';
  contentUrl?: string;
  duration?: number;
  isCompleted?: boolean;
}
