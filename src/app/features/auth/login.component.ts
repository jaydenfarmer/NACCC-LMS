import { Component, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = signal('');
  password = signal('');
  errorMessage = signal('');

  onSubmit(): void {
    this.errorMessage.set('');
    if (this.authService.login(this.email(), this.password())) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] as string | undefined;
      if (returnUrl) {
        this.router.navigateByUrl(returnUrl);
        return;
      }
      const role = this.authService.user()?.role;
      const dest = role === 'admin' ? '/admin' : role === 'learner' ? '/my-learning' : '/dashboard';
      this.router.navigateByUrl(dest);
    } else {
      this.errorMessage.set('Invalid email or password');
    }
  }

  setDemoUser(email: string, password: string): void {
    this.email.set(email);
    this.password.set(password);
  }
}
