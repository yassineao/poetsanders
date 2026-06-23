import { Component, computed, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../../core/i18/i18n.service';
import type { AdminSection } from '../../../../core/interfaces/admin';

@Component({
  selector: 'admin-button',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav aria-label="Admin shortcuts" class="mt-8 grid gap-3 sm:grid-cols-3">
      @for (action of actions(); track action.section) {
        <a
          routerLink="/admin"
          [queryParams]="{ section: action.section }"
          class="flex min-h-14 items-center justify-between gap-4 rounded-lg border border-white/10 bg-slate-900 px-4 text-left text-sm font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          (click)="sectionSelected.emit(action.section)"
        >
          <span>{{ action.label }}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </a>
      }
    </nav>
  `,
})
export class AdminButtonComponent {
  readonly sectionSelected = output<AdminSection>();

  private readonly i18n = inject(I18nService);
  protected readonly actions = computed(() => {
    const copy = this.i18n.copy().admin;
    return [
      { section: 'users' as const, label: `${copy.editLabel} ${copy.usersHeading}` },
      {
        section: 'appointments' as const,
        label: `${copy.editLabel} ${copy.appointmentsHeading}`,
      },
      { section: 'cars' as const, label: `${copy.editLabel} ${copy.carsManagementHeading}` },
    ];
  });
}
