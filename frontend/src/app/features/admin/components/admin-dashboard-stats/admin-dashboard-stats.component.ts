import { CommonModule } from '@angular/common';
import { Component, Input, computed, inject } from '@angular/core';
import { I18nService } from '../../../../core/i18/i18n.service';
import type { AdminDashboard } from '../../../../core/interfaces/admin';

@Component({
  selector: 'app-admin-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-stats.component.html',
})
export class AdminDashboardStatsComponent {
  @Input({ required: true }) dashboard!: AdminDashboard;

  private readonly i18n = inject(I18nService);
  protected readonly copy = computed(() => this.i18n.copy().admin);
}
