import type { FormField, FormPageContent } from "../../../core/interfaces/Infos";
import type { AuthContent } from "../../../core/interfaces/LocaleDictionary";

function createLoginFields(content: AuthContent): FormField[] {
    return [
        {
            name: "email",
            label: content.fields.email,
            type: "email",
            placeholder: content.placeholders.email,
            required: true,
            errors: {
                required: content.validation.required,
                email: content.validation.invalidEmail,
            },
        },
        {
            name: "password",
            label: content.fields.password,
            type: "password",
            placeholder: content.placeholders.password,
            required: true,
            errors: {
                required: content.validation.required,
            },
        },
    ];
}

function createRegistrationFields(content: AuthContent): FormField[] {
    const [emailField] = createLoginFields(content);

    return [
        emailField,
        {
            name: "password",
            label: content.fields.password,
            type: "password",
            placeholder: content.placeholders.password,
            required: true,
            minLength: 12,
            maxLength: 30,
            pattern:
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d\\s]).{12,}$",
            errors: {
                required: content.validation.required,
                minlength: content.validation.passwordLength,
                maxlength: content.validation.passwordLength,
                pattern: content.validation.passwordPattern,
            },
        },
        {
            name: "name",
            label: content.fields.name,
            type: "text",
            placeholder: content.placeholders.name,
            required: true,
            maxLength: 255,
            errors: {
                required: content.validation.required,
                maxlength: content.validation.nameTooLong,
            },
        },
        {
            name: "confirmPassword",
            label: content.fields.confirmPassword,
            type: "password",
            placeholder: content.placeholders.confirmPassword,
            required: true,
            matchField: "password",
            errors: {
                required: content.validation.required,
                mismatch: content.validation.passwordMismatch,
            },
        },
        {
            name: "phoneNumber",
            label: content.fields.phoneNumber,
            type: "tel",
            placeholder: content.placeholders.phoneNumber,
            required: true,
            minLength: 8,
            maxLength: 30,
            errors: {
                required: content.validation.required,
                minlength: content.validation.phoneLength,
                maxlength: content.validation.phoneLength,
            },
        },
    ];
}

export function createAuthFormContent(
    content: AuthContent,
    registering: boolean,
): FormPageContent {
    return {
        metadata: content.metadata,
        eyebrow: content.badge,
        title: content.title,
        description: content.description,
        fields: registering
            ? createRegistrationFields(content)
            : createLoginFields(content),
        submitLabel: content.submitLabel,
        sendingLabel: content.sendingLabel,
        popup: content.popup,
        loginAuth: content.loginAuth,
        registerAuth: content.registerAuth,
    };
}
