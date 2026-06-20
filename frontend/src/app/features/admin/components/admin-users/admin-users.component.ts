import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminService } from '../../../../core/admin/admin.service';
import { I18nService } from '../../../../core/i18/i18n.service';
import type { AdminUser, AdminUserCreate } from '../../../../core/interfaces/admin';

const pageSize = 10;

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent {
  readonly users = input.required<AdminUser[]>();
  readonly userUpdated = output<AdminUser>();
  readonly userCreated = output<AdminUser>();

  private readonly admin = inject(AdminService);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly copy = computed(() => this.i18n.copy().admin);
  protected readonly query = signal('');
  protected readonly page = signal(1);
  protected readonly editingUserId = signal<string | null>(null);
  protected readonly editingUser = signal<AdminUser | null>(null);
  protected readonly addableUser = signal<AdminUserCreate | null>(null);
  protected readonly adding = signal(false);
  protected readonly saving = signal(false);
  protected readonly saveError = signal(false);

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
    const page = Math.min(this.page(), this.pageCount());
    const start = (page - 1) * pageSize;
    return this.filteredUsers().slice(start, start + pageSize);
  });

 protected startAddingUser(): void {
  this.saveError.set(false);
  
  this.addableUser.set({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: "USER"
  });
}
protected cancelAdding(): void {
    if (this.adding()) {
      return;
    }
    this.addableUser.set(null);
    this.saveError.set(false);
  }

  protected saveAddedUser(): void {
    const user = this.addableUser();
    if (
      !user ||
      this.adding() ||
      !user.name.trim() ||
      !user.email.trim() ||
      !user.password
    ) {
      return;
    }

    this.adding.set(true);
    this.saveError.set(false);
    this.admin
      .createUser({
        name: user.name.trim(),
        email: user.email.trim(),
        phoneNumber: user.phoneNumber?.trim() || null,
        password: user.password,
        role: user.role,
      })
      .pipe(
        finalize(() => this.adding.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (createdUser) => {
          this.userCreated.emit(createdUser);
          this.cancelAdding();
        },
        error: () => this.saveError.set(true),
      });
  }


  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  protected changePage(offset: number): void {
    this.page.update((page) => Math.min(this.pageCount(), Math.max(1, page + offset)));
  }

  protected startEditing(user: AdminUser): void {
    this.saveError.set(false);
    this.editingUserId.set(user.id);
    this.editingUser.set({ ...user });
  }

  protected cancelEditing(): void {
    if (this.saving()) {
      return;
    }
    this.editingUserId.set(null);
    this.editingUser.set(null);
    this.saveError.set(false);
  }

  protected saveUser(): void {
    const user = this.editingUser();
    if (!user || this.saving() || !user.name.trim() || !user.email.trim()) {
      return;
    }

    this.saving.set(true);
    this.saveError.set(false);
    this.admin
      .updateUser(user.id, {
        name: user.name.trim(),
        email: user.email.trim(),
        phoneNumber: user.phoneNumber?.trim() || null,
        role: user.role,
      })
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (updatedUser) => {
          this.userUpdated.emit(updatedUser);
          this.cancelEditing();
        },
        error: () => this.saveError.set(true),
      });
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
