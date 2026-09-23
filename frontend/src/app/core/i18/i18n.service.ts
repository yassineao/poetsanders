import { DOCUMENT } from '@angular/common';
import { afterNextRender, computed, inject, Injectable, signal } from '@angular/core';
import { translationMap } from './index';
import type { Copy, Locale } from '../interfaces/types';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private selectedLanguageSignal = signal<Locale>('en');
  private currentCopySignal = computed<Copy>(() => translationMap[this.selectedLanguageSignal()]);

  readonly languages = ['en', 'de', 'nl'] as const;

  constructor() {
    // Restore after hydration so server and browser initially render the same copy.
    afterNextRender(() => {
      try {
        const saved = this.document.defaultView?.localStorage.getItem('poetsanders-language');
        if (saved && this.languages.some(language => language === saved)) {
          this.selectedLanguageSignal.set(saved as Locale);
        }
      } catch {
        // Language switching still works when browser storage is unavailable.
      }
    });
  }

  get language() {
    return this.selectedLanguageSignal.asReadonly();
  }

  get copy() {
    return this.currentCopySignal;
  }

  getCurrentCopy(): Copy {
    return this.currentCopySignal();
  }

  setLanguage(language: Locale): void {
    if (!this.languages.includes(language)) return;
    this.selectedLanguageSignal.set(language);
    try {
      this.document.defaultView?.localStorage.setItem('poetsanders-language', language);
    } catch {
      // Storage may be blocked by browser privacy settings.
    }
  }

  getCurrentLanguage(): Locale {
    return this.selectedLanguageSignal();
  }
}
