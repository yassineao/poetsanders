import { Injectable, signal } from '@angular/core';
import type { Copy, Locale } from './index';
import { translationMap } from './index';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private selectedLanguage = signal<Locale>('en');

  readonly languages = ['en', 'de', 'nl'] as const;

  get language$() {
    return this.selectedLanguage.asReadonly();
  }

  get copy$() {
    return this.selectedLanguage;
  }

  getCurrentCopy(): Copy {
    return translationMap[this.selectedLanguage()];
  }

  setLanguage(language: Locale): void {
    this.selectedLanguage.set(language);
  }

  getCurrentLanguage(): Locale {
    return this.selectedLanguage();
  }
}
