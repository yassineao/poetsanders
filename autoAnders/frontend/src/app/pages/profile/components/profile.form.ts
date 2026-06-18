import { isPlatformBrowser } from "@angular/common";
import { Component, PLATFORM_ID, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule, NgForm, NgModel } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, finalize, map, of } from "rxjs";
import { getDictionary, isValidLocale, Locale } from "../../../core/lib/i18n";
import { AuthService } from "../../../core/auth/auth.service";
import type { FormField } from "../../../core/interfaces/Infos";
import type { UpdateProfileRequest } from "../../../core/interfaces/updateProfile";

@Component({
    selector: "app-form-profile",
    imports: [FormsModule],
    templateUrl: "./profile.form.html",
})
export class ProfileForm {
    private readonly route = inject (ActivatedRoute);
    private readonly router = inject(Router);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);
    protected readonly authService = inject(AuthService);
    private readonly user = toSignal(
        (this.isBrowser ? this.authService.me() : of(this.authService.currentUser())).pipe(
            catchError(() => of(this.authService.currentUser())),
        ),
        { initialValue: this.authService.currentUser() },
    );
    
    private readonly localeParam = toSignal(
            (this.route.parent?.paramMap ?? this.route.paramMap).pipe(
                map((params) => params.get("locale") ?? "de"),
            ),
            { initialValue: "de" },
        );
    
    protected readonly locale = computed<Locale>(()=>{
        const value = this.localeParam();
        return isValidLocale(value) ? value : "de";
    })
    
    protected readonly content = computed(() => getDictionary(this.locale()).profile);
    protected readonly edit = signal(false);
    protected readonly sending = signal(false);
    protected readonly sent = signal(false);
    protected readonly failed = signal(false);

    protected fieldValue(name: string): string {
        const user = this.user();
        if (!user) {
            return "";
        }

        const values: Record<string, string> = {
            name: user.user ?? "",
            email: user.email ?? "",
            phoneNumber: user.phoneNumber ?? "",
            password: "",
        };
        return values[name] ?? "";
    }

    protected fieldError(field: FormField, control: NgModel): string | null {
        if (!control.touched) {
            return null;
        }

        if (control.errors?.["required"]) {
            return field.errors?.required ?? "This field is required.";
        }
        if (control.errors?.["email"]) {
            return field.errors?.email ?? "Enter a valid email address.";
        }
        if (control.errors?.["minlength"]) {
            return field.errors?.minlength ?? "This value is too short.";
        }
        if (control.errors?.["maxlength"]) {
            return field.errors?.maxlength ?? "This value is too long.";
        }
        if (control.errors?.["pattern"]) {
            return field.errors?.pattern ?? "Enter a valid value.";
        }

        return null;
    }

    protected submit(form: NgForm): void {
        form.form.markAllAsTouched();
        if (form.invalid || this.sending()) {
            return;
        }

        const values = form.value as Record<string, string>;
        const profile: UpdateProfileRequest = {
            name: values["name"] ?? "",
            phoneNumber: values["phoneNumber"] ?? "",
        };

        if (values["password"]) {
            profile.password = values["password"];
        }

        this.sending.set(true);
        this.sent.set(false);
        this.failed.set(false);

        this.authService.updateProfile(profile)
            .pipe(finalize(() => this.sending.set(false)))
            .subscribe({
                next: () => {
                    this.sent.set(true);
                    this.edit.set(false);
                    form.controls["password"]?.reset("");
                },
                error: (error) => {
                    console.error("Profile update failed:", error);
                    this.failed.set(true);
                },
            });
    }

    protected logout(): void {
        this.authService.logout().subscribe({
            next: () => {
                void this.router.navigate(["/", this.locale(), "auth"]);
            },
            error: (error) => {
                console.error("Logout failed:", error);
                this.failed.set(true);
            },
        });
    }

}
