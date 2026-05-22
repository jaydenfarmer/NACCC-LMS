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
  returnUrl = signal('/dashboard');

  constructor() {
    this.returnUrl.set(this.route.snapshot.queryParams['returnUrl'] || '/dashboard');
  }

  onSubmit(): void {
    this.errorMessage.set('');
    
    if (this.authService.login(this.email(), this.password())) {
      const dest = this.returnUrl() || '/dashboard';
      try {

        console.debug('[Login] successful, returning to:', dest);
      } catch { /* ignore */ }
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
