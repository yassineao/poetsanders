import { Component, computed, inject, signal } from "@angular/core";
import {
    FormPageComponent,
    type FormSubmission,
} from "../../../shared/form/form-page.component";
import { ActivatedRoute } from "@angular/router";
import { finalize, map } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { getDictionary, isValidLocale } from "../../../core/lib/i18n";
import type { FormPageContent } from "../../../core/interfaces/Infos";
import type { Locale } from "../../../core/interfaces/locale";
import { AuthService } from "../../../core/auth/auth.service";
import type { LoginCredentials } from "../../../core/interfaces/loginCridentials";
import { createAuthFormContent } from "../components/auth-form-content";
import { RegisterCredentials } from "../../../core/interfaces/registerCredentials";
import { createCredentials } from "../components/auth-form-submit";
import { log } from "console";

@Component({
    selector: "app-auth",
    imports: [FormPageComponent],

    templateUrl: "./auth-page.component.html",
})
export class AuthPageComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly localeParam = toSignal(
        (this.route.parent?.paramMap ?? this.route.paramMap).pipe(
            map((params) => params.get("locale") ?? "de"),
        ),
        { initialValue: "de" },
    );
    protected readonly locale = computed<Locale>(() => {
        const value = this.localeParam();
        return isValidLocale(value) ? value : "de";
    });


    protected readonly registring = signal(false);

    protected readonly content = computed<FormPageContent>(() => {
        const content = getDictionary(this.locale()).auth;
        return createAuthFormContent(content, this.registring());
    });

    private readonly authService = inject(AuthService);
    protected readonly sending = signal(false);
    protected readonly sent = signal(false);
    protected readonly failed = signal(false);
    protected readonly sent_Url = signal("/");

    protected submit(submission: FormSubmission): void {
        const credentials = createCredentials(submission, this.registring());
        this.sending.set(true);



        const request$ = this.registring()
            ? this.authService.register(credentials as RegisterCredentials)
            : this.authService.login(credentials as LoginCredentials);

        setTimeout(() => (
            request$
                .pipe(
                    finalize(() => this.sending.set(false)),
                    map((user) => {
                        if(user.role === "ADMIN"){
                             window.location.href = 'https://poetsanders.vercel.app/admin';
                        }
                     
                    })
                )
                .subscribe({
                    next: () => {
                        this.sending.set(false);
                        this.sent.set(true);
                        this.failed.set(false);
                        submission.form.resetForm();
                        
                    },
                    error: (error) => {
                        console.error(
                            this.registring() ? 'Registration failed:' : 'Login failed:',
                            error,
                        );

                        this.sent.set(false);
                        this.failed.set(true);
                    },
                })
        ), 1000);

    }
}
