import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import type { Locale } from '../../../core/i18';
import { I18nService } from '../../../core/i18/i18n.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navBar.components.html'
})
export class NavBarComponent {
  private readonly i18n = inject(I18nService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly isAuthenticated = computed(() => this.auth.currentUser() !== null);
  protected readonly userName = computed(() => {
    const user = this.auth.currentUser();
    return user?.user || user?.email || '';
  });
  protected readonly languages = this.i18n.languages;
  protected readonly selectedLanguage = this.i18n.language;
  protected readonly mobileMenuOpen = signal(false);
  protected readonly navItems = computed(() => [
    { label: this.copy().navbar.home, routerLink: '/' },
    ...this.copy().services.treatments.items.map((treatment) => ({
      label: treatment.title,
      routerLink: `/services/${treatment.slug}`,
    })),
  ]);

  protected readonly copy = this.i18n.copy;
  protected readonly language_shift_window = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId) && !this.auth.currentUser()) {
      this.auth
        .me()
        .pipe(
          catchError(() => EMPTY),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  protected setLanguage(language: Locale): void {
    this.i18n.setLanguage(language);
    this.mobileMenuOpen.set(false);
    this.language_shift_window.set(false);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((isOpen) => !isOpen);
  }
}   
