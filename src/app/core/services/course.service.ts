import { Injectable, signal } from '@angular/core';
import { Course, Enrollment } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses = signal<Course[]>(this.getMockCourses());
  private enrollments = signal<Enrollment[]>(this.getMockEnrollments());

  readonly allCourses = this.courses.asReadonly();
  readonly userEnrollments = this.enrollments.asReadonly();

  getCourses(): Course[] {
    return this.courses();
  }

  getCourseById(id: string): Course | undefined {
    return this.courses().find(c => c.id === id);
  }

  getUserEnrollments(userId: string): Enrollment[] {
    return this.enrollments().filter(e => e.userId === userId);
  }

  getUserCourses(userId: string): Course[] {
    const userEnrollments = this.getUserEnrollments(userId);
    const courseIds = userEnrollments.map(e => e.courseId);
    return this.courses().filter(c => courseIds.includes(c.id));
  }

  getEnrollment(userId: string, courseId: string): Enrollment | undefined {
    return this.enrollments().find(e => e.userId === userId && e.courseId === courseId);
  }

  enrollCourse(userId: string, courseId: string): void {
    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      userId,
      courseId,
      enrolledAt: new Date(),
      progress: 0,
      completedLessons: 0,
      lastAccessedAt: new Date(),
      status: 'not-started'
    };
    this.enrollments.set([...this.enrollments(), newEnrollment]);
  }

  updateProgress(enrollmentId: string, progress: number, completedLessons: number): void {
    const enrollments = this.enrollments();
    const index = enrollments.findIndex(e => e.id === enrollmentId);
    if (index !== -1) {
      enrollments[index] = {
        ...enrollments[index],
        progress,
        completedLessons,
        lastAccessedAt: new Date(),
        status: progress === 100 ? 'completed' : 'in-progress'
      };
      this.enrollments.set([...enrollments]);
    }
  }

  addCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrolledCount' | 'rating'>): void {
    const newCourse: Course = {
      ...course,
      id: `course-${Date.now()}`,
      enrolledCount: 0,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.courses.set([...this.courses(), newCourse]);
  }

  updateCourse(id: string, updates: Partial<Course>): void {
    const courses = this.courses();
    const index = courses.findIndex(c => c.id === id);
    if (index !== -1) {
      courses[index] = {
        ...courses[index],
        ...updates,
        updatedAt: new Date()
      };
      this.courses.set([...courses]);
    }
  }

  deleteCourse(id: string): void {
    this.courses.set(this.courses().filter(c => c.id !== id));
  }

  private getMockCourses(): Course[] {
    return [
      {
        id: 'course-1',
        title: 'Introduction to Credit Counseling',
        description: 'Learn the fundamentals of credit counseling, including assessment techniques, debt management plans, and client communication strategies.',
        thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
        category: 'Fundamentals',
        duration: 180,
        difficulty: 'beginner',
        instructor: {
          id: 'inst-1',
          name: 'Sarah Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        },
        enrolledCount: 245,
        rating: 4.8,
        totalLessons: 12,
        tags: ['credit', 'counseling', 'basics'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-11-01')
      },
      {
        id: 'course-2',
        title: 'Advanced Debt Management Strategies',
        description: 'Master advanced techniques for creating effective debt management plans, negotiating with creditors, and handling complex financial situations.',
        thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop',
        category: 'Advanced',
        duration: 240,
        difficulty: 'advanced',
        instructor: {
          id: 'inst-2',
          name: 'Michael Chen',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
        },
        enrolledCount: 156,
        rating: 4.9,
        totalLessons: 15,
        tags: ['debt', 'management', 'negotiation'],
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-10-15')
      },
      {
        id: 'course-3',
        title: 'Financial Literacy for Counselors',
        description: 'Comprehensive training on teaching financial literacy concepts to clients, including budgeting, saving, and credit score improvement.',
        thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=250&fit=crop',
        category: 'Professional Development',
        duration: 150,
        difficulty: 'intermediate',
        instructor: {
          id: 'inst-1',
          name: 'Sarah Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        },
        enrolledCount: 189,
        rating: 4.7,
        totalLessons: 10,
        tags: ['financial literacy', 'teaching', 'budgeting'],
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-09-20')
      },
      {
        id: 'course-4',
        title: 'Legal & Ethical Compliance',
        description: 'Understanding legal requirements, ethical standards, and compliance regulations in credit counseling practice.',
        thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop',
        category: 'Compliance',
        duration: 120,
        difficulty: 'intermediate',
        instructor: {
          id: 'inst-3',
          name: 'David Martinez',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
        },
        enrolledCount: 198,
        rating: 4.6,
        totalLessons: 8,
        tags: ['legal', 'ethics', 'compliance'],
        createdAt: new Date('2024-04-12'),
        updatedAt: new Date('2024-10-30')
      },
      {
        id: 'course-5',
        title: 'Client Communication Skills',
        description: 'Develop effective communication techniques for counseling sessions, including active listening, empathy, and conflict resolution.',
        thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=250&fit=crop',
        category: 'Soft Skills',
        duration: 90,
        difficulty: 'beginner',
        instructor: {
          id: 'inst-2',
          name: 'Michael Chen',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
        },
        enrolledCount: 312,
        rating: 4.9,
        totalLessons: 6,
        tags: ['communication', 'counseling', 'soft skills'],
        createdAt: new Date('2024-05-08'),
        updatedAt: new Date('2024-11-05')
      },
      {
        id: 'course-6',
        title: 'Credit Report Analysis',
        description: 'Learn to read, interpret, and analyze credit reports from all three major bureaus. Identify errors and guide clients on dispute processes.',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
        category: 'Technical Skills',
        duration: 135,
        difficulty: 'intermediate',
        instructor: {
          id: 'inst-1',
          name: 'Sarah Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        },
        enrolledCount: 223,
        rating: 4.8,
        totalLessons: 9,
        tags: ['credit report', 'analysis', 'bureaus'],
        createdAt: new Date('2024-06-20'),
        updatedAt: new Date('2024-10-10')
      }
    ];
  }

  private getMockEnrollments(): Enrollment[] {
    return [
      {
        id: 'enr-1',
        userId: '1',
        courseId: 'course-1',
        enrolledAt: new Date('2024-10-01'),
        progress: 75,
        completedLessons: 9,
        lastAccessedAt: new Date('2024-11-08'),
        status: 'in-progress'
      },
      {
        id: 'enr-2',
        userId: '1',
        courseId: 'course-3',
        enrolledAt: new Date('2024-10-15'),
        progress: 40,
        completedLessons: 4,
        lastAccessedAt: new Date('2024-11-05'),
        status: 'in-progress'
      },
      {
        id: 'enr-3',
        userId: '1',
        courseId: 'course-5',
        enrolledAt: new Date('2024-09-20'),
        progress: 100,
        completedLessons: 6,
        lastAccessedAt: new Date('2024-10-28'),
        status: 'completed',
        certificateIssued: true
      }
    ];
  }
}
