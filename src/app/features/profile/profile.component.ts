import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  bio: string;
  timezone: string;
  language: string;
}

interface CustomFields {
  planToEnroll: string;
  newClient: string;
  companyName: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, TitleCasePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);

  readonly user = this.authService.user;

  readonly fullName = computed(() => {
    const u = this.user();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });

  readonly avatarUrl = computed(() =>
    this.user()?.profile_photo_url ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
  );

  form = signal<ProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    bio: '',
    timezone: 'America/New_York',
    language: 'en'
  });

  customFields = signal<CustomFields>({
    planToEnroll: '',
    newClient: '',
    companyName: ''
  });

  toastVisible = signal(false);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  readonly timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' }
  ];

  readonly languages = [
    { value: 'en', label: 'English' }
  ];

  readonly planToEnrollOptions = ['Yes', 'No', 'Not sure'];
  readonly newClientOptions = ['Yes', 'No'];

  ngOnInit(): void {
    const u = this.user();
    if (!u) return;

    this.form.set({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      username: u.username ?? '',
      bio: u.bio ?? '',
      timezone: u.timezone ?? 'America/New_York',
      language: u.language ?? 'en'
    });

    this.customFields.set({
      planToEnroll: u.custom_fields?.['planToEnroll'] ?? '',
      newClient: u.custom_fields?.['newClient'] ?? '',
      companyName: u.custom_fields?.['companyName'] ?? ''
    });
  }

  updateForm(field: keyof ProfileForm, value: string): void {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  updateCustomField(field: keyof CustomFields, value: string): void {
    this.customFields.update(cf => ({ ...cf, [field]: value }));
  }

  save(): void {
    const f = this.form();
    const cf = this.customFields();

    this.authService.updateProfile({
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      email: f.email.trim(),
      username: f.username.trim() || undefined,
      bio: f.bio.trim() || undefined,
      timezone: f.timezone,
      language: f.language,
      custom_fields: {
        planToEnroll: cf.planToEnroll,
        newClient: cf.newClient,
        companyName: cf.companyName
      }
    });

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastVisible.set(true);
    this.toastTimer = setTimeout(() => this.toastVisible.set(false), 3000);
  }
}
