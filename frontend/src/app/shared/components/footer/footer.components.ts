import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import type { Locale } from '../../../core/i18';
import { I18nService } from '../../../core/i18/i18n.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.components.html'
})
export class FooterComponent {
    private readonly i18n = inject(I18nService);
    protected readonly currentYear = new Date().getFullYear();
    protected readonly languages = this.i18n.languages;
    protected readonly selectedLanguage = this.i18n.language;
    protected readonly navItems = computed(() => [
        { label: this.copy().navbar.home, routerLink: '/' },
        { label: this.copy().navbar.collections, routerLink: '/collections' },
    ]);
    protected readonly footer = computed(() => this.copy().footer);
    protected readonly copy = this.i18n.copy;

    protected setLanguage(language: Locale): void {
        this.i18n.setLanguage(language);
    }
}
