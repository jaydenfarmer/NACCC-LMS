import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { CertificateService } from '../../shared/services/certificate.service';
import { Certificate } from '../../shared/models/course.model';

const EXPIRING_SOON_DAYS = 60;
const CEU_RENEWAL_THRESHOLD = 16;

type CertStatus = 'active' | 'expiring_soon' | 'expired';

@Component({
  selector: 'app-my-certificates',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-certificates.component.html',
  styleUrl: './my-certificates.component.css'
})
export class MyCertificatesComponent {
  private authService = inject(AuthService);
  private certificateService = inject(CertificateService);

  readonly ceuRenewalThreshold = CEU_RENEWAL_THRESHOLD;

  private allCertificates = computed(() => {
    const user = this.authService.user();
    if (!user) return [];
    return this.certificateService.getUserCertificates(user.id);
  });

  coreCertificates = computed(() =>
    this.allCertificates().filter(c => c.certificate_type === 'core')
  );

  ceuCertificates = computed(() =>
    this.allCertificates().filter(c => c.certificate_type === 'ceu')
  );

  totalCeuHours = computed(() =>
    this.ceuCertificates().reduce((sum, c) => sum + (c.ceu_credit_hours ?? 0), 0)
  );

  ceuProgressPercent = computed(() =>
    Math.min(100, (this.totalCeuHours() / CEU_RENEWAL_THRESHOLD) * 100)
  );

  getCertStatus(cert: Certificate): CertStatus {
    if (!cert.expiresAt) return 'active';
    const now = new Date();
    if (cert.expiresAt < now) return 'expired';
    const msUntilExpiry = cert.expiresAt.getTime() - now.getTime();
    const daysUntilExpiry = msUntilExpiry / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= EXPIRING_SOON_DAYS ? 'expiring_soon' : 'active';
  }

  getStatusLabel(cert: Certificate): string {
    const status = this.getCertStatus(cert);
    if (status === 'expired') return 'Expired';
    if (status === 'expiring_soon') return 'Expiring Soon';
    return 'Active';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  downloadCertificate(): void { return; }

  viewVerification(): void { return; }
}
