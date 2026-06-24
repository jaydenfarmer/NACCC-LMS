import { Injectable } from '@angular/core';
import { Certificate } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

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
