import { Injectable, signal } from '@angular/core';
import { Course, Enrollment, Module, Lesson } from '../models/course.model';

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
    const course = this.courses().find(c => c.id === id);
    if (course) {
      // Add modules data if not already present
      if (!course.modules || course.modules.length === 0) {
        course.modules = this.getMockModulesForCourse(id);
      }
    }
    return course;
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

  private getMockModulesForCourse(courseId: string): Module[] {
    // Return modules based on courseId
    if (courseId === 'course-1') {
      const modules: Module[] = [
        {
          id: 'mod-1-1',
          courseId,
          title: 'Getting Started with Credit Counseling',
          description: 'Introduction to the field of credit counseling and its importance',
          order: 1,
          isExpanded: false,
          lessons: [
            {
              id: 'lesson-1',
              title: 'What is Credit Counseling?',
              description: 'Overview of credit counseling profession and services',
              type: 'video',
              duration: 15,
              order: 1,
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              isCompleted: true
            },
            {
              id: 'lesson-2',
              title: 'The Role of a Credit Counselor',
              description: 'Understanding responsibilities and expectations',
              type: 'video',
              duration: 20,
              order: 2,
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              isCompleted: true
            },
            {
              id: 'lesson-3',
              title: 'Industry Standards & Regulations',
              description: 'Key regulations governing credit counseling',
              type: 'pdf',
              duration: 10,
              order: 3,
              content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              isCompleted: true
            }
          ]
        },
        {
          id: 'mod-1-2',
          courseId,
          title: 'Client Assessment Techniques',
          description: 'Learn how to assess client financial situations',
          order: 2,
          isExpanded: false,
          lessons: [
            {
              id: 'lesson-4',
              title: 'Initial Client Interview',
              description: 'Conducting effective first meetings',
              type: 'video',
              duration: 25,
              order: 1,
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              isCompleted: true
            },
            {
              id: 'lesson-5',
              title: 'Financial Document Review',
              description: 'Analyzing client financial documents',
              type: 'video',
              duration: 18,
              order: 2,
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              isCompleted: true
            },
            {
              id: 'lesson-6',
              title: 'Assessment Quiz',
              description: 'Test your knowledge of client assessment',
              type: 'quiz',
              duration: 15,
              order: 3,
              content: '',
              isCompleted: false
            }
          ]
        },
        {
          id: 'mod-1-3',
          courseId,
          title: 'Creating Debt Management Plans',
          description: 'Master the art of creating effective DMPs',
          order: 3,
          isExpanded: false,
          lessons: [
            {
              id: 'lesson-7',
              title: 'DMP Fundamentals',
              description: 'Understanding debt management plan basics',
              type: 'video',
              duration: 22,
              order: 1,
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              isCompleted: true
            },
            {
              id: 'lesson-8',
              title: 'Calculating Monthly Payments',
              description: 'How to determine affordable payment amounts',
              type: 'video',
              duration: 20,
              order: 2,
              content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              isCompleted: true
            },
            {
              id: 'lesson-9',
              title: 'DMP Case Studies',
              description: 'Review real-world DMP scenarios',
              type: 'pdf',
              duration: 12,
              order: 3,
              content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              isCompleted: true
            }
          ]
        },
        {
          id: 'mod-1-4',
          courseId,
          title: 'Final Assessment',
          description: 'Complete the course final exam',
          order: 4,
          isExpanded: false,
          lessons: [
            {
              id: 'lesson-10',
              title: 'Course Review',
              description: 'Summary of key concepts',
              type: 'pdf',
              duration: 8,
              order: 1,
              content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              isCompleted: false
            },
            {
              id: 'lesson-11',
              title: 'Practice Quiz',
              description: 'Prepare for the final exam',
              type: 'quiz',
              duration: 20,
              order: 2,
              content: '',
              isCompleted: false
            },
            {
              id: 'lesson-12',
              title: 'Final Exam',
              description: 'Complete to earn your certificate',
              type: 'exam',
              duration: 45,
              order: 3,
              content: '',
              isCompleted: false
            }
          ]
        }
      ];

      // Ensure lessons include courseId and moduleId for typing
      modules.forEach((mod) => {
        mod.lessons.forEach((l) => {
          if (!l.courseId) (l as any).courseId = courseId;
          if (!l.moduleId) (l as any).moduleId = mod.id;
        });
      });

      return modules;
    }

    // Default modules for other courses
    const defaultModules: Module[] = [
      {
        id: `mod-${courseId}-1`,
        courseId,
        title: 'Introduction',
        description: 'Getting started with this course',
        order: 1,
        isExpanded: false,
        lessons: [
          {
            id: `lesson-${courseId}-1`,
            title: 'Course Overview',
            description: 'What you will learn in this course',
            type: 'video',
            duration: 15,
            order: 1,
            content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isCompleted: false
          },
          {
            id: `lesson-${courseId}-2`,
            title: 'Course Materials',
            description: 'Download course resources',
            type: 'pdf',
            duration: 5,
            order: 2,
            content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            isCompleted: false
          }
        ]
      },
      {
        id: `mod-${courseId}-2`,
        courseId,
        title: 'Core Concepts',
        description: 'Main course content',
        order: 2,
        isExpanded: false,
        lessons: [
          {
            id: `lesson-${courseId}-3`,
            title: 'Key Topics',
            description: 'Essential knowledge for this course',
            type: 'video',
            duration: 30,
            order: 1,
            content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isCompleted: false
          },
          {
            id: `lesson-${courseId}-4`,
            title: 'Knowledge Check',
            description: 'Test your understanding',
            type: 'quiz',
            duration: 15,
            order: 2,
            content: '',
            isCompleted: false
          }
        ]
      }
    ];

    defaultModules.forEach((mod) => {
      mod.lessons.forEach((l) => {
        if (!l.courseId) (l as any).courseId = courseId;
        if (!l.moduleId) (l as any).moduleId = mod.id;
      });
    });

    return defaultModules;
  }

  // Return mock questions for an exam lesson. In a real app this would come from the backend.
  getQuestionsForLesson(courseId: string, lessonId: string) {
    return this.getMockQuestionsForLesson(courseId, lessonId);
  }

  private getMockQuestionsForLesson(courseId: string, lessonId: string) {
    // Provide a predictable set of mock multiple-choice questions for course-1 / lesson-12
    if (courseId === 'course-1' && lessonId === 'lesson-12') {
      return [
        {
          id: 'q1',
          text: 'Which of the following best describes a Debt Management Plan (DMP)?',
          options: [
            'A short-term loan to cover emergency expenses',
            'A negotiated repayment plan with creditors to lower payments',
            'A type of investment vehicle for retirement savings',
            'An insurance policy to protect against debt'
          ],
          correctIndex: 1
        },
        {
          id: 'q2',
          text: 'When assessing a client, which document is most important to review?',
          options: [
            'Client social media profiles',
            'Recent bank statements and credit reports',
            'Client favorite movies list',
            'None of the above'
          ],
          correctIndex: 1
        },
        {
          id: 'q3',
          text: 'Which action is appropriate when a client cannot meet their monthly obligations?',
          options: [
            'Recommend immediate bankruptcy without assessment',
            'Create an abusive collection plan',
            'Work with the client to build a realistic budget and negotiate with creditors',
            'Ignore the issue and hope it resolves'
          ],
          correctIndex: 2
        },
        {
          id: 'q4',
          text: 'What is a common goal of credit counseling?',
          options: [
            'Maximize interest charges',
            'Improve client financial literacy and sustainable repayment',
            'Encourage risky investments',
            'Reduce client income'
          ],
          correctIndex: 1
        }
      ];
    }

    // Default small question set for other lessons
    return [
      {
        id: 'q1',
        text: 'This is a placeholder question for the lesson.',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: 0
      }
    ];
  }
}
