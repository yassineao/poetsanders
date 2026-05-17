import { computed, Injectable, signal } from '@angular/core';
import { translationMap } from './index';
import type { Copy, Locale } from '../interfaces/types';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private selectedLanguageSignal = signal<Locale>('en');
  private currentCopySignal = computed<Copy>(() => translationMap[this.selectedLanguageSignal()]);

  readonly languages = ['en', 'de', 'nl'] as const;

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
    this.selectedLanguageSignal.set(language);
  }

  getCurrentLanguage(): Locale {
    return this.selectedLanguageSignal();
  }
}
