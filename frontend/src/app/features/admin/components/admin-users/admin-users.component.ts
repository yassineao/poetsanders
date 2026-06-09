import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { I18nService } from '../../../../core/i18/i18n.service';
import type { AdminUser } from '../../../../core/interfaces/admin';

const pageSize = 10;

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent {
  readonly users = input.required<AdminUser[]>();

  private readonly i18n = inject(I18nService);
  protected readonly copy = computed(() => this.i18n.copy().admin);
  protected readonly query = signal('');
  protected readonly page = signal(1);

  protected readonly filteredUsers = computed(() => {
    const query = this.query().trim().toLowerCase();
    return query
      ? this.users().filter((user) =>
          [user.name, user.email, user.phoneNumber ?? '', user.role].some((value) =>
            value.toLowerCase().includes(query),
          ),
        )
      : this.users();
  });
  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredUsers().length / pageSize)),
  );
  protected readonly paginatedUsers = computed(() => {
    const start = (this.page() - 1) * pageSize;
    return this.filteredUsers().slice(start, start + pageSize);
  });

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  protected changePage(offset: number): void {
    this.page.update((page) => Math.min(this.pageCount(), Math.max(1, page + offset)));
  }

  protected formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    this.i18n.language();
    return new Intl.DateTimeFormat(this.i18n.getCurrentLanguage(), {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }
}
