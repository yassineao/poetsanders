import type { WashType } from '../booking/booking.service';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface AdminAppointment {
  id: string;
  washType: WashType;
  localDateTime: string;
  accepted: boolean;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string | null;
}

export interface AdminDashboard {
  totalUsers: number;
  totalAppointments: number;
  pendingAppointments: number;
  acceptedAppointments: number;
  users: AdminUser[];
  appointments: AdminAppointment[];
}

export interface AdminCopy {
  eyebrow: string;
  heading: string;
  description: string;
  loadingLabel: string;
  errorLabel: string;
  usersStatLabel: string;
  appointmentsStatLabel: string;
  pendingStatLabel: string;
  acceptedStatLabel: string;
  usersHeading: string;
  usersDescription: string;
  appointmentsHeading: string;
  appointmentsDescription: string;
  searchUsersLabel: string;
  searchAppointmentsLabel: string;
  allStatusesLabel: string;
  pendingLabel: string;
  acceptedLabel: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  roleLabel: string;
  joinedLabel: string;
  customerLabel: string;
  treatmentLabel: string;
  dateLabel: string;
  statusLabel: string;
  actionsLabel: string;
  acceptLabel: string;
  acceptingLabel: string;
  acceptErrorLabel: string;
  previousLabel: string;
  nextLabel: string;
  pageLabel: string;
  ofLabel: string;
  noUsersLabel: string;
  noAppointmentsLabel: string;
}
