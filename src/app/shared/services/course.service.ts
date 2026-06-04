import { Injectable, signal } from '@angular/core';
import { Certificate, Course, Enrollment, ExamQuestion } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly ENROLLMENTS_KEY = 'lms.enrollments';
  private readonly LESSON_PROGRESS_KEY = 'lms.lesson_progress';

  private courses = signal<Course[]>(this.getMockCourses());
  private enrollments = signal<Enrollment[]>(this.getMockEnrollments());

  readonly allCourses = this.courses.asReadonly();
  readonly userEnrollments = this.enrollments.asReadonly();

  constructor() {
    const savedEnrollments = this.loadEnrollments();
    if (savedEnrollments.length > 0) {
      this.enrollments.set(savedEnrollments);
    }

    const savedProgress = this.loadLessonProgress();
    if (Object.keys(savedProgress).length > 0) {
      this.applyLessonProgress(savedProgress);
    }
  }

  private loadEnrollments(): Enrollment[] {
    try {
      const raw = localStorage.getItem(this.ENROLLMENTS_KEY);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item: unknown) => {
        const e = item as Record<string, unknown>;
        return {
          ...e,
          enrollment_date: new Date(e['enrollment_date'] as string),
          expiration_date: e['expiration_date'] != null
            ? new Date(e['expiration_date'] as string)
            : undefined
        } as Enrollment;
      });
    } catch {
      return [];
    }
  }

  private loadLessonProgress(): Record<string, boolean> {
    try {
      const raw = localStorage.getItem(this.LESSON_PROGRESS_KEY);
      if (!raw) return {};
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
      return parsed as Record<string, boolean>;
    } catch {
      return {};
    }
  }

  private applyLessonProgress(progress: Record<string, boolean>): void {
    this.courses.update(courses =>
      courses.map(course => ({
        ...course,
        lessons: course.lessons.map(lesson => ({
          ...lesson,
          isCompleted: progress[lesson.id] ?? lesson.isCompleted
        }))
      }))
    );
  }

  private saveEnrollments(): void {
    try {
      localStorage.setItem(this.ENROLLMENTS_KEY, JSON.stringify(this.enrollments()));
    } catch { /* ignore — storage full or private browsing */ }
  }

  private saveLessonProgress(): void {
    try {
      const progress: Record<string, boolean> = {};
      for (const course of this.courses()) {
        for (const lesson of course.lessons) {
          if (lesson.isCompleted) {
            progress[lesson.id] = true;
          }
        }
      }
      localStorage.setItem(this.LESSON_PROGRESS_KEY, JSON.stringify(progress));
    } catch { /* ignore — storage full or private browsing */ }
  }

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
      enrollment_date: new Date(),
      status: 'enrolled'
    };
    this.enrollments.set([...this.enrollments(), newEnrollment]);
    this.saveEnrollments();
  }

  updateProgress(enrollmentId: string, progress: number): void {
    const enrollments = this.enrollments();
    const index = enrollments.findIndex(e => e.id === enrollmentId);
    if (index !== -1) {
      enrollments[index] = {
        ...enrollments[index],
        status: progress === 100 ? 'completed' : 'in_progress'
      };
      this.enrollments.set([...enrollments]);
      this.saveEnrollments();
    }
  }

  completeLesson(courseId: string, lessonId: string): void {
    const courses = this.courses();
    const index = courses.findIndex(c => c.id === courseId);
    if (index === -1) return;
    const updated: Course = {
      ...courses[index],
      lessons: courses[index].lessons.map(l =>
        l.id === lessonId ? { ...l, isCompleted: true } : l
      )
    };
    const next = [...courses];
    next[index] = updated;
    this.courses.set(next);
    this.saveLessonProgress();
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

  getAdminStats(): { totalCourses: number; totalStudents: number; activeEnrollments: number; completionRate: number } {
    const allEnrollments = this.enrollments();
    const totalCourses = this.courses().length;
    const totalStudents = new Set(allEnrollments.map(e => e.userId)).size;
    const activeEnrollments = allEnrollments.filter(e => e.status === 'enrolled' || e.status === 'in_progress').length;
    const completed = allEnrollments.filter(e => e.status === 'completed').length;
    const completionRate = allEnrollments.length > 0 ? Math.round((completed / allEnrollments.length) * 100) : 0;
    return { totalCourses, totalStudents, activeEnrollments, completionRate };
  }

  getQuestionsForLesson(courseId: string, lessonId: string): ExamQuestion[] {
    if (courseId === 'course-1' && lessonId === 'c1-16') {
      return [
        { id: 'q1', text: 'Which of the following best describes a Debt Management Plan (DMP)?', options: ['A short-term loan to cover emergency expenses', 'A negotiated repayment plan with creditors to lower interest and payments', 'A type of investment vehicle for retirement savings', 'An insurance policy to protect against debt default'], correctIndex: 1 },
        { id: 'q2', text: 'When assessing a new client, which document is most critical to review first?', options: ['Client social media profiles', 'Recent bank statements and credit reports', 'Client employment history from five years ago', 'A list of the client\'s personal goals'], correctIndex: 1 },
        { id: 'q3', text: 'Which action is most appropriate when a client cannot meet their monthly debt obligations?', options: ['Recommend immediate bankruptcy without a full assessment', 'Create an aggressive collection pressure plan', 'Work with the client to build a realistic budget and negotiate with creditors', 'Advise the client to stop paying all debts immediately'], correctIndex: 2 },
        { id: 'q4', text: 'What is the primary goal of credit counseling?', options: ['Maximize creditor interest charges on the client account', 'Improve client financial literacy and create a path to sustainable repayment', 'Encourage high-risk investments to grow client wealth', 'Reduce the client\'s reported income for tax purposes'], correctIndex: 1 },
        { id: 'q5', text: 'Under NFCC standards, a credit counselor must disclose which of the following to a client?', options: ['The counselor\'s personal credit score', 'All fees, services, and the voluntary nature of the program', 'The names of other clients in the program', 'The counselor\'s commission rate per enrolled client'], correctIndex: 1 },
        { id: 'q6', text: 'Which of the following is NOT a typical component of a Debt Management Plan?', options: ['Reduced interest rates negotiated with creditors', 'A single consolidated monthly payment to the agency', 'Immediate legal protection from all creditors', 'Regular budget counseling sessions'], correctIndex: 2 },
        { id: 'q7', text: 'A client asks whether enrolling in a DMP will affect their credit score. What is the most accurate response?', options: ['It has no effect whatsoever on credit scores', 'It will immediately improve their credit score by 100 points', 'It may have a short-term impact but consistent on-time payments typically improve scores over time', 'It permanently destroys the client\'s credit rating'], correctIndex: 2 },
        { id: 'q8', text: 'What is the recommended first step when a client presents with overwhelming debt?', options: ['Immediately enroll them in the most comprehensive DMP available', 'Conduct a thorough financial assessment including income, expenses, assets, and liabilities', 'Refer them directly to a bankruptcy attorney', 'Advise them to liquidate all assets immediately'], correctIndex: 1 }
      ];
    }

    if (courseId === 'course-1' && lessonId === 'c1-14') {
      return [
        { id: 'p1', text: 'What does DMP stand for in the context of credit counseling?', options: ['Debt Management Plan', 'Deferred Monthly Payment', 'Debt Mediation Process', 'Direct Money Program'], correctIndex: 0 },
        { id: 'p2', text: 'Which federal agency primarily oversees consumer credit counseling agencies?', options: ['The Federal Reserve', 'The Consumer Financial Protection Bureau (CFPB)', 'The Department of Labor', 'The Securities and Exchange Commission'], correctIndex: 1 },
        { id: 'p3', text: 'A client has $30,000 in unsecured debt across six creditors. The best first step is to:', options: ['Tell the client to ignore the smallest debts', 'Compile a complete list of all debts, interest rates, and minimum payments', 'Contact each creditor separately without a plan', 'Recommend the client take out a home equity loan immediately'], correctIndex: 1 },
        { id: 'p4', text: 'Which of the following is considered a secured debt?', options: ['Credit card balance', 'Medical bills', 'Mortgage loan', 'Utility arrears'], correctIndex: 2 },
        { id: 'p5', text: 'Confidentiality in credit counseling means:', options: ['Sharing client information freely with all creditors', 'Protecting client information and only disclosing with explicit consent', 'Publishing client success stories without permission', 'Reporting all client debts to credit bureaus immediately'], correctIndex: 1 }
      ];
    }

    return [
      { id: 'q1', text: 'This is a placeholder question for this exam.', options: ['Option A', 'Option B', 'Option C', 'Option D'], correctIndex: 0 }
    ];
  }

  private getMockCourses(): Course[] {
    return [
      {
        id: 'course-1',
        title: 'Introduction to Credit Counseling',
        description: 'Learn the fundamentals of credit counseling, including assessment techniques, debt management plans, and client communication strategies.',
        thumbnail_url:'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
        category: 'Fundamentals',
        duration: 180,
        difficulty: 'beginner',
        instructor: { id: 'inst-1', name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
        enrolledCount: 245,
        rating: 4.8,
        totalLessons: 16,
        tags: ['credit', 'counseling', 'basics'],
        price: 720,
        issues_certificate: true,
        certificate_type: 'core' as const,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-11-01'),
        lessons: [
          { id: 'c1-s0', type: 'section', title: 'INTRODUCTION', order: 1 },
          { id: 'c1-01', type: 'content_page', title: 'Join the Community', order: 2, duration_minutes:5, isCompleted: true },
          { id: 'c1-02', type: 'content_page', title: 'Keys to Success', order: 3, duration_minutes:10, isCompleted: true },
          { id: 'c1-03', type: 'content_page', title: 'Grading Information', order: 4, duration_minutes:5, isCompleted: true },
          { id: 'c1-s1', type: 'section', title: 'INSTRUCTOR INFORMATION', order: 5 },
          { id: 'c1-04', type: 'content_page', title: 'Meet Your Instructor', order: 6, duration_minutes:5, isCompleted: true },
          { id: 'c1-05', type: 'iframe', title: 'Live Chat Session', order: 7, duration_minutes:60 },
          { id: 'c1-s2', type: 'section', title: 'MODULE 1 — Credit Counseling Fundamentals', order: 8 },
          { id: 'c1-06', type: 'video', title: 'What is Credit Counseling?', order: 9, duration_minutes:15, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isCompleted: true },
          { id: 'c1-07', type: 'video', title: 'The Role of a Credit Counselor', order: 10, duration_minutes:20, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isCompleted: true },
          { id: 'c1-08', type: 'presentation_document', title: 'Industry Standards & Regulations', order: 11, duration_minutes:10, isCompleted: true },
          { id: 'c1-09', type: 'test', title: 'Module 1 Quiz', order: 12, passingScore: 70, isCompleted: true },
          { id: 'c1-s3', type: 'section', title: 'MODULE 2 — Client Assessment', order: 13 },
          { id: 'c1-10', type: 'video', title: 'Initial Client Interview', order: 14, duration_minutes:25, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isCompleted: true },
          { id: 'c1-11', type: 'video', title: 'Financial Document Review', order: 15, duration_minutes:18, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'c1-12', type: 'content_page', title: 'Creating Debt Management Plans', order: 16, duration_minutes:12, completion_method: 'question', completion_question: { text: 'What is the primary goal of a Debt Management Plan (DMP)?', options: ['To eliminate all debt immediately through bankruptcy', 'To consolidate and repay debt through structured monthly payments', 'To negotiate permanent debt forgiveness with all creditors', 'To freeze interest rates without a formal repayment plan'], correctIndex: 1 } },
          { id: 'c1-13', type: 'test', title: 'Module 2 Quiz', order: 17, passingScore: 70 },
          { id: 'c1-s4', type: 'section', title: 'EXAM REVIEW', order: 18 },
          { id: 'c1-14', type: 'test', title: 'Practice Test', order: 19, isPractice: true, passingScore: 70, description: 'Review the key concepts from this course before your proctored final exam. This practice test is untimed and you may retake it as many times as you like.', pass_message: 'Great work! You are ready for the final exam.', fail_message: 'Review the material and try the practice test again before scheduling your exam.' },
          { id: 'c1-15', type: 'content_page', title: 'Schedule Your Exam', order: 20, duration_minutes:5 },
          { id: 'c1-s5', type: 'section', title: 'FINAL EXAM', order: 21 },
          { id: 'c1-16', type: 'test', title: 'Final Exam', order: 22, passingScore: 70, password: 'exam2024', time_limit_minutes: 90, description: 'This is your proctored final exam. You have 90 minutes to complete all questions. A passing score of 70% is required to earn your certificate.', pass_message: 'Congratulations! You have passed the exam and earned your certificate.', fail_message: 'You did not pass this time. Review the material and schedule a retake when you are ready.' }
        ]
      },
      {
        id: 'course-2',
        title: 'Advanced Debt Management Strategies',
        description: 'Master advanced techniques for creating effective debt management plans, negotiating with creditors, and handling complex financial situations.',
        thumbnail_url:'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop',
        category: 'Advanced',
        duration: 240,
        difficulty: 'advanced',
        instructor: { id: 'inst-2', name: 'Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
        enrolledCount: 156,
        rating: 4.9,
        totalLessons: 13,
        tags: ['debt', 'management', 'negotiation'],
        price: 895,
        issues_certificate: true,
        certificate_type: 'core' as const,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-10-15'),
        lessons: [
          { id: 'c2-s0', type: 'section', title: 'INTRODUCTION', order: 1 },
          { id: 'c2-01', type: 'content_page', title: 'Course Overview', order: 2, duration_minutes:5, completion_method: 'question', completion_question: { text: 'What distinguishes this advanced course from the foundational certification?', options: ['It covers basic budgeting skills for new clients', 'It focuses on complex debt scenarios and creditor negotiation strategies', 'It teaches tax preparation and financial planning', 'It covers investment strategies for high-income clients'], correctIndex: 1 } },
          { id: 'c2-02', type: 'content_page', title: 'Prerequisites & Expectations', order: 3, duration_minutes:5, completion_method: 'question', completion_question: { text: 'Which of the following is a prerequisite for this advanced course?', options: ['No prior experience required', 'Completion of the Foundational Credit Counseling Certification', 'A degree in finance or accounting', 'At least 5 years of banking experience'], correctIndex: 1 } },
          { id: 'c2-s1', type: 'section', title: 'INSTRUCTOR INFORMATION', order: 4 },
          { id: 'c2-03', type: 'content_page', title: 'Meet Your Instructor', order: 5, duration_minutes:5 },
          { id: 'c2-s2', type: 'section', title: 'MODULE 1 — Advanced DMP Construction', order: 6 },
          { id: 'c2-04', type: 'video', title: 'Complex Debt Scenarios', order: 7, duration_minutes:30, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'c2-05', type: 'video', title: 'Creditor Negotiation Techniques', order: 8, duration_minutes:25, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'c2-06', type: 'presentation_document', title: 'DMP Templates & Tools', order: 9, duration_minutes:15 },
          { id: 'c2-07', type: 'test', title: 'Module 1 Quiz', order: 10, passingScore: 75 },
          { id: 'c2-s3', type: 'section', title: 'MODULE 2 — Creditor Relations', order: 11 },
          { id: 'c2-08', type: 'video', title: 'Building Creditor Partnerships', order: 12, duration_minutes:22, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'c2-09', type: 'video', title: 'Handling Creditor Disputes', order: 13, duration_minutes:20, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'c2-10', type: 'test', title: 'Module 2 Quiz', order: 14, passingScore: 75 },
          { id: 'c2-s4', type: 'section', title: 'EXAM REVIEW', order: 15 },
          { id: 'c2-11', type: 'test', title: 'Practice Test', order: 16, isPractice: true, passingScore: 75 },
          { id: 'c2-12', type: 'content_page', title: 'Schedule Your Exam', order: 17, duration_minutes:5 },
          { id: 'c2-s5', type: 'section', title: 'FINAL EXAM', order: 18 },
          { id: 'c2-13', type: 'test', title: 'Final Exam', order: 19, passingScore: 75, password: 'adv2024' }
        ]
      },
      {
        id: 'course-3',
        title: 'Financial Literacy for Counselors',
        description: 'Comprehensive training on teaching financial literacy concepts to clients, including budgeting, saving, and credit score improvement.',
        thumbnail_url:'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=250&fit=crop',
        category: 'Professional Development',
        duration: 150,
        difficulty: 'intermediate',
        instructor: { id: 'inst-1', name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
        enrolledCount: 189,
        rating: 4.7,
        totalLessons: 11,
        tags: ['financial literacy', 'teaching', 'budgeting'],
        price: 0,
        issues_certificate: false,
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-09-20'),
        lessons: [
          { id: 'c3-s0', type: 'section', title: 'INTRODUCTION', order: 1 },
          { id: 'c3-01', type: 'content_page', title: 'Course Overview', order: 2, duration_minutes:5, isCompleted: true },
          { id: 'c3-02', type: 'content_page', title: 'Why Financial Literacy Matters', order: 3, duration_minutes:8, isCompleted: true },
          { id: 'c3-s1', type: 'section', title: 'INSTRUCTOR INFORMATION', order: 4 },
          { id: 'c3-03', type: 'content_page', title: 'Meet Your Instructor', order: 5, duration_minutes:5, isCompleted: true },
          { id: 'c3-s2', type: 'section', title: 'MODULE 1 — Teaching Budgeting Skills', order: 6 },
          { id: 'c3-04', type: 'video', title: 'Budgeting Frameworks for Clients', order: 7, duration_minutes:20, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isCompleted: true },
          { id: 'c3-05', type: 'video', title: 'Income vs. Expense Analysis', order: 8, duration_minutes:18, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'c3-06', type: 'test', title: 'Module 1 Quiz', order: 9, passingScore: 70 },
          { id: 'c3-s3', type: 'section', title: 'MODULE 2 — Credit Score Education', order: 10 },
          { id: 'c3-07', type: 'video', title: 'How Credit Scores Work', order: 11, duration_minutes:22, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'c3-08', type: 'presentation_document', title: 'Credit Score Improvement Strategies', order: 12, duration_minutes:12 },
          { id: 'c3-09', type: 'test', title: 'Module 2 Quiz', order: 13, passingScore: 70 },
          { id: 'c3-s4', type: 'section', title: 'EXAM REVIEW', order: 14 },
          { id: 'c3-10', type: 'test', title: 'Practice Test', order: 15, isPractice: true, passingScore: 70 },
          { id: 'c3-s5', type: 'section', title: 'FINAL EXAM', order: 16 },
          { id: 'c3-11', type: 'test', title: 'Final Exam', order: 17, passingScore: 70, password: 'finlit2024' }
        ]
      },
      {
        id: 'course-4',
        title: 'Legal & Ethical Compliance',
        description: 'Understanding legal requirements, ethical standards, and compliance regulations in credit counseling practice.',
        thumbnail_url:'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop',
        category: 'Compliance',
        duration: 120,
        difficulty: 'intermediate',
        instructor: { id: 'inst-3', name: 'David Martinez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
        enrolledCount: 198,
        rating: 4.6,
        totalLessons: 9,
        tags: ['legal', 'ethics', 'compliance'],
        price: 545,
        issues_certificate: true,
        certificate_type: 'ceu' as const,
        createdAt: new Date('2024-04-12'),
        updatedAt: new Date('2024-10-30'),
        lessons: [
          { id: 'c4-s0', type: 'section', title: 'INTRODUCTION', order: 1 },
          { id: 'c4-01', type: 'content_page', title: 'Course Overview', order: 2, duration_minutes:5 },
          { id: 'c4-02', type: 'content_page', title: 'Regulatory Landscape Overview', order: 3, duration_minutes:10 },
          { id: 'c4-s1', type: 'section', title: 'INSTRUCTOR INFORMATION', order: 4 },
          { id: 'c4-03', type: 'content_page', title: 'Meet Your Instructor', order: 5, duration_minutes:5 },
          { id: 'c4-s2', type: 'section', title: 'MODULE 1 — Federal Compliance', order: 6 },
          { id: 'c4-04', type: 'video', title: 'CFPB Regulations & Requirements', order: 7, duration_minutes:25, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'c4-05', type: 'video', title: 'FCRA and Consumer Rights', order: 8, duration_minutes:20, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'c4-06', type: 'test', title: 'Module 1 Quiz', order: 9, passingScore: 80 },
          { id: 'c4-s3', type: 'section', title: 'MODULE 2 — Ethical Standards', order: 10 },
          { id: 'c4-07', type: 'video', title: 'NFCC Code of Ethics', order: 11, duration_minutes:18, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'c4-08', type: 'test', title: 'Module 2 Quiz', order: 12, passingScore: 80 },
          { id: 'c4-s4', type: 'section', title: 'EXAM REVIEW', order: 13 },
          { id: 'c4-09', type: 'test', title: 'Practice Test', order: 14, isPractice: true, passingScore: 80 },
          { id: 'c4-s5', type: 'section', title: 'FINAL EXAM', order: 15 },
          { id: 'c4-10', type: 'test', title: 'Final Exam', order: 16, passingScore: 80, password: 'legal2024' }
        ]
      },
      {
        id: 'course-5',
        title: 'Client Communication Skills',
        description: 'Develop effective communication techniques for counseling sessions, including active listening, empathy, and conflict resolution.',
        thumbnail_url:'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=250&fit=crop',
        category: 'Soft Skills',
        duration: 90,
        difficulty: 'beginner',
        instructor: { id: 'inst-2', name: 'Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
        enrolledCount: 312,
        rating: 4.9,
        totalLessons: 7,
        tags: ['communication', 'counseling', 'soft skills'],
        price: 395,
        issues_certificate: true,
        certificate_type: 'ceu' as const,
        createdAt: new Date('2024-05-08'),
        updatedAt: new Date('2024-11-05'),
        lessons: [
          { id: 'c5-s0', type: 'section', title: 'INTRODUCTION', order: 1 },
          { id: 'c5-01', type: 'content_page', title: 'Course Overview', order: 2, duration_minutes:5, isCompleted: true },
          { id: 'c5-02', type: 'content_page', title: 'The Power of Communication', order: 3, duration_minutes:8, isCompleted: true },
          { id: 'c5-s1', type: 'section', title: 'INSTRUCTOR INFORMATION', order: 4 },
          { id: 'c5-03', type: 'content_page', title: 'Meet Your Instructor', order: 5, duration_minutes:5, isCompleted: true },
          { id: 'c5-s2', type: 'section', title: 'MODULE 1 — Active Listening', order: 6 },
          { id: 'c5-04', type: 'video', title: 'Active Listening Techniques', order: 7, duration_minutes:20, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isCompleted: true },
          { id: 'c5-05', type: 'video', title: 'Empathy in Practice', order: 8, duration_minutes:15, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isCompleted: true },
          { id: 'c5-06', type: 'test', title: 'Module 1 Quiz', order: 9, passingScore: 70, isCompleted: true },
          { id: 'c5-s3', type: 'section', title: 'EXAM REVIEW', order: 10 },
          { id: 'c5-s4', type: 'section', title: 'FINAL EXAM', order: 11 },
          { id: 'c5-07', type: 'test', title: 'Final Exam', order: 12, passingScore: 70, password: 'comm2024', isCompleted: true }
        ]
      },
      {
        id: 'course-6',
        title: 'Credit Report Analysis',
        description: 'Learn to read, interpret, and analyze credit reports from all three major bureaus. Identify errors and guide clients on dispute processes.',
        thumbnail_url:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
        category: 'Technical Skills',
        duration: 135,
        difficulty: 'intermediate',
        instructor: { id: 'inst-1', name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
        enrolledCount: 223,
        rating: 4.8,
        totalLessons: 10,
        tags: ['credit report', 'analysis', 'bureaus'],
        price: 0,
        issues_certificate: false,
        createdAt: new Date('2024-06-20'),
        updatedAt: new Date('2024-10-10'),
        lessons: [
          { id: 'c6-s0', type: 'section', title: 'INTRODUCTION', order: 1 },
          { id: 'c6-01', type: 'content_page', title: 'Course Overview', order: 2, duration_minutes:5 },
          { id: 'c6-02', type: 'content_page', title: 'Understanding the Three Bureaus', order: 3, duration_minutes:10 },
          { id: 'c6-s1', type: 'section', title: 'INSTRUCTOR INFORMATION', order: 4 },
          { id: 'c6-03', type: 'content_page', title: 'Meet Your Instructor', order: 5, duration_minutes:5 },
          { id: 'c6-s2', type: 'section', title: 'MODULE 1 — Reading Credit Reports', order: 6 },
          { id: 'c6-04', type: 'video', title: 'Anatomy of a Credit Report', order: 7, duration_minutes:22, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'c6-05', type: 'video', title: 'Identifying Derogatory Marks', order: 8, duration_minutes:18, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'c6-06', type: 'test', title: 'Module 1 Quiz', order: 9, passingScore: 70 },
          { id: 'c6-s3', type: 'section', title: 'MODULE 2 — Dispute Process', order: 10 },
          { id: 'c6-07', type: 'video', title: 'Filing a Dispute — Step by Step', order: 11, duration_minutes:20, content_body: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'c6-08', type: 'presentation_document', title: 'Dispute Letter Templates', order: 12, duration_minutes:10 },
          { id: 'c6-09', type: 'test', title: 'Module 2 Quiz', order: 13, passingScore: 70 },
          { id: 'c6-s4', type: 'section', title: 'EXAM REVIEW', order: 14 },
          { id: 'c6-10', type: 'test', title: 'Practice Test', order: 15, isPractice: true, passingScore: 70 },
          { id: 'c6-s5', type: 'section', title: 'FINAL EXAM', order: 16 },
          { id: 'c6-11', type: 'test', title: 'Final Exam', order: 17, passingScore: 70, password: 'credit2024' }
        ]
      }
    ];
  }

  private getMockEnrollments(): Enrollment[] {
    return [
      {
        id: 'enr-1',
        userId: '1',
        courseId: 'course-1',
        enrollment_date: new Date('2024-10-01'),
        status: 'in_progress'
      },
      {
        id: 'enr-2',
        userId: '1',
        courseId: 'course-3',
        enrollment_date: new Date('2024-10-15'),
        status: 'in_progress'
      },
      {
        id: 'enr-3',
        userId: '1',
        courseId: 'course-5',
        enrollment_date: new Date('2024-09-20'),
        status: 'completed'
      }
    ];
  }

  getUserCertificates(userId: string): Certificate[] {
    return this.getMockCertificates().filter(c => c.userId === userId);
  }

  private getMockCertificates(): Certificate[] {
    return [
      {
        id: 'cert-1',
        userId: '1',
        courseId: 'course-1',
        courseName: 'Certified Credit Counselor (CCC) — Core Certification',
        certificate_type: 'core',
        issuedAt: new Date('2025-01-15'),
        expiresAt: new Date('2027-01-15'),
        certificateNumber: 'NACCC-2025-00001'
      },
      {
        id: 'cert-2',
        userId: '1',
        courseId: 'course-2',
        courseName: 'Housing Counseling Certification — Core Certification',
        certificate_type: 'core',
        issuedAt: new Date('2024-05-20'),
        expiresAt: new Date('2026-07-10'),
        certificateNumber: 'NACCC-2024-00047'
      },
      {
        id: 'cert-3',
        userId: '1',
        courseId: 'course-3',
        courseName: 'Bankruptcy Counseling Certification — Core Certification',
        certificate_type: 'core',
        issuedAt: new Date('2023-02-10'),
        expiresAt: new Date('2025-02-10'),
        certificateNumber: 'NACCC-2023-00112'
      },
      {
        id: 'cert-4',
        userId: '1',
        courseId: 'course-4',
        courseName: 'Financial Literacy Fundamentals (3.0 CEU Hours)',
        certificate_type: 'ceu',
        issuedAt: new Date('2025-03-01'),
        certificateNumber: 'NACCC-2025-00203',
        ceu_credit_hours: 3.0
      },
      {
        id: 'cert-5',
        userId: '1',
        courseId: 'course-5',
        courseName: 'Advanced Debt Management Strategies (5.0 CEU Hours)',
        certificate_type: 'ceu',
        issuedAt: new Date('2025-08-15'),
        certificateNumber: 'NACCC-2025-00318',
        ceu_credit_hours: 5.0
      }
    ];
  }
}
