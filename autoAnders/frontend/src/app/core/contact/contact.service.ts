import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

export interface ContactMessageRequest {
    companyName: string;
    phoneNumber: string;
    message: string;
}

export interface UserContactMessage {
    id: string;
    companyName: string;
    phoneNumber: string | null;
    message: string;
    status: "NEW" | "READ" | "ARCHIVED";
    adminReply: string | null;
    repliedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

@Injectable({ providedIn: "root" })
export class ContactService {
    private readonly http = inject(HttpClient);
    private readonly contactUrl = `${environment.apiBaseUrl}/contact`;
    private readonly requestOptions = { withCredentials: true };

    sendMessage(message: ContactMessageRequest): Observable<UserContactMessage> {
        return this.http.post<UserContactMessage>(this.contactUrl, message, this.requestOptions);
    }

    getMessages(): Observable<UserContactMessage[]> {
        return this.http.get<UserContactMessage[]>(`${this.contactUrl}/messages`, this.requestOptions);
    }
}
