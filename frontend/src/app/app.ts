import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, effect, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { I18nService } from './core/i18/i18n.service';
import { NavBarComponent } from './shared/components/navBar/navBar.components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected languages: readonly string[] = [];
  protected selectedLanguage: any;
  protected copy: any;

  constructor(
    private i18n: I18nService,
    private titleService: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.languages = this.i18n.languages;
    this.selectedLanguage = this.i18n.language$;
    this.copy = this.i18n.copy$;
    effect(() => this.updateSeo(this.i18n.getCurrentCopy()));
  }

  protected setLanguage(language: string): void {
    this.i18n.setLanguage(language as any);
  }

  private updateSeo(copy: any): void {
    this.titleService.setTitle(copy.home.pageTitle);
    this.meta.updateTag({ name: 'description', content: copy.home.description });
    this.meta.updateTag({ property: 'og:title', content: copy.home.pageTitle });
    this.meta.updateTag({ property: 'og:description', content: copy.home.description });
    this.meta.updateTag({ name: 'twitter:title', content: copy.home.pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: copy.home.description });
    this.document.documentElement.lang = this.i18n.getCurrentLanguage();
  }
}
