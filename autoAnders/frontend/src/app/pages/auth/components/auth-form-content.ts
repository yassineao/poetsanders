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
        },
        {
            name: "password",
            label: content.fields.password,
            type: "password",
            placeholder: content.placeholders.password,
            required: true,
        },
    ];
}

function createRegistrationFields(content: AuthContent): FormField[] {
    return [
        ...createLoginFields(content),
        {
            name: "name",
            label: content.fields.name,
            type: "text",
            placeholder: content.placeholders.name,
            required: true,
        },
        {
            name: "phoneNumber",
            label: content.fields.phoneNumber,
            type: "tel",
            placeholder: content.placeholders.phoneNumber,
            required: true,
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
