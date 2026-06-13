import { computed, Injectable, signal } from "@angular/core";
import { dictionaries, locales } from "./index";
import type { Locale, LocaleDictionary } from "./index";

@Injectable({
  providedIn: "root",
})
export class I18nService {
  private readonly selectedLanguageSignal = signal<Locale>("en");
  private readonly currentDictionarySignal = computed<LocaleDictionary>(
    () => dictionaries[this.selectedLanguageSignal()],
  );

  readonly languages = locales;
  readonly language = this.selectedLanguageSignal.asReadonly();
  readonly dictionary = this.currentDictionarySignal;

  getCurrentDictionary(): LocaleDictionary {
    return this.currentDictionarySignal();
  }

  setLanguage(language: Locale): void {
    this.selectedLanguageSignal.set(language);
  }

  getCurrentLanguage(): Locale {
    return this.selectedLanguageSignal();
  }
}
