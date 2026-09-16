import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { AdminService } from '../../../../core/admin/admin.service';
import { I18nService } from '../../../../core/i18/i18n.service';
import type {
  AdminContactMessage,
  AdminContactMessageStatus,
} from '../../../../core/interfaces/admin';

const pageSize = 10;

@Component({
  selector: 'app-admin-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-contacts.component.html',
})
export class AdminContactsComponent {
  readonly contactMessages = input.required<AdminContactMessage[]>();
  readonly contactUpdated = output<AdminContactMessage>();
  readonly contactDeleted = output<string>();

  private readonly admin = inject(AdminService);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly copy = computed(() => this.i18n.copy().admin);
  protected readonly query = signal('');
  protected readonly page = signal(1);
  protected readonly updatingIds = signal<string[]>([]);
  protected readonly updateError = signal(false);
  protected readonly replyDrafts = signal<Record<string, string>>({});

  protected readonly filteredMessages = computed(() => {
    const query = this.query().trim().toLowerCase();
    const messages = this.contactMessages();
    return query
      ? messages.filter((message) =>
          [
            message.companyName,
            message.customerName,
            message.email,
            message.phoneNumber ?? '',
            message.message,
            message.status,
          ].some((value) => value.toLowerCase().includes(query)),
        )
      : messages;
  });

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredMessages().length / pageSize)),
  );

  protected readonly paginatedMessages = computed(() => {
    const page = Math.min(this.page(), this.pageCount());
    const start = (page - 1) * pageSize;
    return this.filteredMessages().slice(start, start + pageSize);
  });

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  protected changePage(offset: number): void {
    this.page.update((page) => Math.min(this.pageCount(), Math.max(1, page + offset)));
  }

  protected updateStatus(message: AdminContactMessage, status: AdminContactMessageStatus): void {
    if (message.status === status || this.isUpdating(message.id)) {
      return;
    }

    this.updateError.set(false);
    this.updatingIds.update((ids) => [...ids, message.id]);
    this.admin
      .updateContactMessage(message.id, status, message.adminReply)
      .pipe(
        finalize(() =>
          this.updatingIds.update((ids) => ids.filter((id) => id !== message.id)),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (updatedMessage) => this.contactUpdated.emit(updatedMessage),
        error: () => this.updateError.set(true),
      });
  }

  protected replyValue(message: AdminContactMessage): string {
    return this.replyDrafts()[message.id] ?? message.adminReply ?? '';
  }

  protected updateReplyDraft(message: AdminContactMessage, event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.replyDrafts.update((drafts) => ({
      ...drafts,
      [message.id]: value,
    }));
  }

  protected saveReply(message: AdminContactMessage): void {
    if (this.isUpdating(message.id)) {
      return;
    }

    const reply = this.replyValue(message).trim();
    this.updateError.set(false);
    this.updatingIds.update((ids) => [...ids, message.id]);
    this.admin
      .updateContactMessage(message.id, 'READ', reply || null)
      .pipe(
        finalize(() =>
          this.updatingIds.update((ids) => ids.filter((id) => id !== message.id)),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (updatedMessage) => {
          this.contactUpdated.emit(updatedMessage);
          this.replyDrafts.update((drafts) => ({
            ...drafts,
            [message.id]: updatedMessage.adminReply ?? '',
          }));
        },
        error: () => this.updateError.set(true),
      });
  }

  protected deleteMessage(message: AdminContactMessage): void {
    if (this.isUpdating(message.id)) {
      return;
    }

    if (!window.confirm(`Delete contact message from ${message.email}?`)) {
      return;
    }

    this.updateError.set(false);
    this.updatingIds.update((ids) => [...ids, message.id]);
    this.admin
      .deleteContactMessage(message.id)
      .pipe(
        finalize(() =>
          this.updatingIds.update((ids) => ids.filter((id) => id !== message.id)),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.contactDeleted.emit(message.id),
        error: () => this.updateError.set(true),
      });
  }

  protected isUpdating(id: string): boolean {
    return this.updatingIds().includes(id);
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
