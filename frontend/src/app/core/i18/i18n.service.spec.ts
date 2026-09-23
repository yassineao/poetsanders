import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';

@Component({ template: '{{ i18n.language() }}' })
class LanguageHost {
  readonly i18n = inject(I18nService);
}

describe('language preference', () => {
  beforeEach(() => {
    localStorage.removeItem('poetsanders-language');
    TestBed.configureTestingModule({ imports: [LanguageHost] });
  });

  afterEach(() => localStorage.removeItem('poetsanders-language'));

  it('restores Dutch after the first render', () => {
    localStorage.setItem('poetsanders-language', 'nl');
    const fixture = TestBed.createComponent(LanguageHost);
    fixture.detectChanges();
    TestBed.tick();
    expect(fixture.componentInstance.i18n.getCurrentLanguage()).toBe('nl');
    expect(fixture.componentInstance.i18n.getCurrentCopy().navbar.langLabel).toBe('Taal');
  });

  it('ignores an unsupported saved language', () => {
    localStorage.setItem('poetsanders-language', 'fr');
    const fixture = TestBed.createComponent(LanguageHost);
    fixture.detectChanges();
    TestBed.tick();
    expect(fixture.componentInstance.i18n.getCurrentLanguage()).toBe('en');
  });

  it('persists a new choice and updates the displayed copy', () => {
    const fixture = TestBed.createComponent(LanguageHost);
    fixture.detectChanges();
    const service = fixture.componentInstance.i18n;
    service.setLanguage('de');
    expect(localStorage.getItem('poetsanders-language')).toBe('de');
    expect(service.getCurrentCopy().navbar.langLabel).toBe('Sprache');
  });
});
