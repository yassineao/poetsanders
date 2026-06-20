import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import type { AdminSection, AdminSidebar } from '../../../../core/interfaces/admin';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-sidebar.html',
})
export class AdminSidebarComponent {
  readonly sidebar = input.required<AdminSidebar>();
  readonly activeSection = input.required<AdminSection>();
  readonly sectionSelected = output<AdminSection>();

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly menuOpen = signal(false);
  protected readonly loggingOut = signal(false);

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected selectSection(section: AdminSection): void {
    this.sectionSelected.emit(section);
    this.closeMenu();
  }

  protected logout(): void {
    if (this.loggingOut()) {
      return;
    }

    this.loggingOut.set(true);
    this.auth
      .logout()
      .pipe(
        finalize(() => this.loggingOut.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.router.navigateByUrl('/login'),
      });
  }
}
