import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { AuthUser } from '../../../../core/interfaces/AuthUser';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-details.component.html',
})
export class ProfileDetailsComponent {
  @Input({ required: true }) user!: AuthUser;
}
