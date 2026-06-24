import { Injectable } from '@angular/core';
import { ExamQuestion } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

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
}
