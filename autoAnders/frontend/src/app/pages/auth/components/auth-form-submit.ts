import {   type FormSubmission,} from "../../../shared/form/form-page.component";

import type { LoginCredentials } from "../../../core/interfaces/loginCridentials";
import type { RegisterCredentials } from "../../../core/interfaces/registerCredentials";


export function createCredentials(
    submission: FormSubmission,
    registring: boolean,
): LoginCredentials | RegisterCredentials {

    let credentials: LoginCredentials | RegisterCredentials = {
        email: String(submission.values["email"] ?? "")
            .trim()
            .toLowerCase(),

        password: String(
            submission.values["password"] ?? ""
        ),
    };

    if (registring) {
        credentials = {
            ...credentials,

            confirmPassword: String(
                submission.values["confirmPassword"] ?? ""
            ),

            name: String(
                submission.values["name"] ?? ""
            ),

            phoneNumber: String(
                submission.values["phoneNumber"] ?? ""
            ),
        };
    }

    return credentials;
}