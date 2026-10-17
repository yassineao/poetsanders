import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isValidLocale } from '../../core/lib/i18n';
import { seoContent } from '../../core/lib/seo-content';

@Component({
  imports: [RouterLink],
  template: `<main class="min-h-screen bg-black px-6 pb-16 pt-32 text-white">
    <div class="mx-auto max-w-4xl"><h1 class="text-4xl font-bold">{{ copy.notFound }}</h1>
    <a class="mt-8 inline-block text-red-400 underline" [routerLink]="['/', locale, 'Catalogue']">{{ copy.back }}</a></div>
  </main>`,
})
export class NotFoundComponent {
  private readonly pathLocale = inject(Router).getCurrentNavigation()?.extractedUrl.root.children['primary']?.segments[0]?.path ?? 'de';
  protected readonly locale = isValidLocale(this.pathLocale) ? this.pathLocale : 'de';
  protected readonly copy = seoContent[this.locale];
}
