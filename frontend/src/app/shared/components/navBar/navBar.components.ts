import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
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

  protected readonly languages = this.i18n.languages;
  protected readonly selectedLanguage = this.i18n.language$;
  protected readonly mobileMenuOpen = signal(false);
  protected readonly navItems = computed(() => [
    { label: this.copy().navbar.home, routerLink: '/' },
    { label: this.copy().navbar.collections, routerLink: '/collections' },
  ]);

  copy = computed(() => {
    this.i18n.copy$();
    return this.i18n.getCurrentCopy();
  });
  protected setLanguage(language: Locale): void {
    this.i18n.setLanguage(language);
    this.mobileMenuOpen.set(false);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((isOpen) => !isOpen);
  }
}   
