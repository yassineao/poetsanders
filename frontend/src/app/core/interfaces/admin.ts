import type { WashType } from '../booking/booking.service';
import type { CarRequest } from './Car';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export type AdminUserUpdate = Pick<AdminUser, 'name' | 'email' | 'phoneNumber' | 'role'>;

export interface AdminUserCreate extends AdminUserUpdate {
  password: string;
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

export type AdminContactMessageStatus = 'NEW' | 'READ' | 'ARCHIVED';

export interface AdminContactMessage {
  id: string;
  companyName: string;
  userId: string;
  customerName: string;
  email: string;
  phoneNumber: string | null;
  message: string;
  status: AdminContactMessageStatus;
  emailDelivered: boolean;
  emailError: string | null;
  adminReply: string | null;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboard {
  totalUsers: number;
  totalAppointments: number;
  pendingAppointments: number;
  acceptedAppointments: number;
  users: AdminUser[];
  appointments: AdminAppointment[];
  contactMessages: AdminContactMessage[];
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
  contactsHeading: string;
  contactsDescription: string;
  searchContactsLabel: string;
  topicLabel: string;
  messageLabel: string;
  deliveredLabel: string;
  markReadLabel: string;
  markUnreadLabel: string;
  archiveLabel: string;
  deleteLabel: string;
  noContactsLabel: string;
  contactUpdateErrorLabel: string;
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
  carsManagementHeading: string;
  carsManagementDescription: string;
  searchCarsLabel: string;
  carLabel: string;
  licensePlateLabel: string;
  yearLabel: string;
  priceLabel: string;
  allCarStatusesLabel: string;
  availableLabel: string;
  bookedLabel: string;
  cancelledLabel: string;
  updatingLabel: string;
  carUpdateErrorLabel: string;
  noCarsLabel: string;
  detailsLabel: string;
  closeLabel: string;
  characteristicsLabel: string;
  picturesLabel: string;
  editLabel: string;
  saveLabel: string;
  cancelLabel: string;
  savingLabel: string;
  userUpdateErrorLabel: string;
  addCarLabel: string;
  carCreateErrorLabel: string;
}

export interface AdminSidebar{
  items: AdminSidebarItems[];
  logout: string;

}

export type AdminAppointmentUpdate = Pick<
  AdminAppointment,
  'userId' | 'washType' | 'localDateTime' | 'accepted'
>;

export interface AdminAppointmentCreate extends AdminAppointmentUpdate {
  userId: string;
}

export type AdminCarUpdate = CarRequest;

export type AdminCarCreate = AdminCarUpdate;

export type AdminSection = 'overview' | 'users' | 'appointments' | 'cars' | 'contacts';

export interface AdminSidebarItems{
  name: string;
  table: AdminSection;
}
