package Gloyoo.AutoAnders.washCalendar.controller;

import Gloyoo.AutoAnders.washCalendar.dto.WashCalendarRequest;
import Gloyoo.AutoAnders.washCalendar.dto.WashCalendarResponse;
import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import Gloyoo.AutoAnders.washCalendar.service.WashCalendarService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/wash_calendar")
public class WashCalendarController {

    private final WashCalendarService washCalendarService;

    public WashCalendarController(WashCalendarService washCalendarService) {
        this.washCalendarService = washCalendarService;
    }

    @PostMapping
    public ResponseEntity<WashCalendarResponse> addWashCalendar(
            @RequestBody WashCalendarRequest washCalendarRequest,
            Authentication authentication
    ) {
        WashCalendar washCalendar =
                washCalendarService.book_a_wash_calendar(
                        washCalendarRequest,
                        authenticatedUserId(authentication)
                );

        return ResponseEntity.ok(WashCalendarResponse.from(washCalendar));
    }

    @GetMapping
    public ResponseEntity<List<WashCalendarResponse>> getWashCalendar() {
        List<WashCalendarResponse> washCalendars = toResponses(
                washCalendarService.findAllWashCalendar()
        );
        return ResponseEntity.ok(washCalendars);
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<Void> deleteWashCalendar(
            @PathVariable UUID uuid

    ) {
        washCalendarService.deleteWashCalendar(uuid);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/date/{localDateTime}")
    public ResponseEntity<List<WashCalendarResponse>> getWashCalendarByDate(
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime localDateTime
    ) {
        List<WashCalendarResponse> washCalendars = toResponses(
                washCalendarService.getWashCalendarByDate(localDateTime)
        );

        return ResponseEntity.ok(washCalendars);
    }

    @GetMapping("/accepted/{TF}")
    public ResponseEntity<List<WashCalendarResponse>> getAcceptedWashCalendar(
            @PathVariable boolean TF,
            Authentication authentication
    ) {
        UUID uuid = authenticatedUserId(authentication);
        List<WashCalendarResponse> washCalendars = toResponses(
                washCalendarService.findByAccepted(TF, uuid)
        );
        return ResponseEntity.ok(washCalendars);
    }

    @PostMapping("/accept/{uuid}")
    public ResponseEntity<Void> acceptWashCalendar(
            @PathVariable UUID uuid
    ) {
        washCalendarService.accept(uuid);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/by_user")
    public ResponseEntity<List<WashCalendarResponse>> getWashCalendarByUser(
            Authentication authentication
    ) {
        List<WashCalendarResponse> washCalendars = toResponses(
                washCalendarService.getWashCalendarByUser(
                        authenticatedUserId(authentication)
                )
        );

        return ResponseEntity.ok(washCalendars);
    }

    private List<WashCalendarResponse> toResponses(List<WashCalendar> washCalendars) {
        return washCalendars.stream()
                .map(WashCalendarResponse::from)
                .toList();
    }

    private UUID authenticatedUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Map<?, ?> details)) {
            throw new IllegalArgumentException("Authenticated user details are missing");
        }

        Object uid = details.get("uid");
        if (uid == null) {
            throw new IllegalArgumentException("Authenticated user ID is missing");
        }

        return UUID.fromString(uid.toString());
    }
}
