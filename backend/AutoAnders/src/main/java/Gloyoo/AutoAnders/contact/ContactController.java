package Gloyoo.AutoAnders.contact;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class ContactController {

    private final ContactEmailService contactEmailService;

    public ContactController(ContactEmailService contactEmailService) {
        this.contactEmailService = contactEmailService;
    }

    @PostMapping("/contact")
    public UserContactMessageResponse sendContactMessage(
            @Valid @RequestBody ContactMessageRequest request,
            Authentication authentication
    ) {
        return contactEmailService.sendContactMessage(request, authenticatedUserId(authentication));
    }

    @GetMapping("/contact/messages")
    public List<UserContactMessageResponse> getMessages(Authentication authentication) {
        return contactEmailService.getMessages(authenticatedUserId(authentication));
    }

    private UUID authenticatedUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Map<?, ?> details)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        Object uid = details.get("uid");
        if (uid == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User ID missing");
        }

        return UUID.fromString(uid.toString());
    }
}
