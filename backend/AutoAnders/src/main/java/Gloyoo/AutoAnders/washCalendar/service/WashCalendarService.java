package Gloyoo.AutoAnders.washCalendar.service;

import Gloyoo.AutoAnders.notification.StatusChangeEmailService;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.service.UserService;
import Gloyoo.AutoAnders.washCalendar.dto.GuestWashCalendarRequest;
import Gloyoo.AutoAnders.washCalendar.dto.AppointmentCancellation;
import Gloyoo.AutoAnders.washCalendar.dto.WashCalendarBatchRequest;
import Gloyoo.AutoAnders.washCalendar.dto.WashCalendarRequest;
import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import Gloyoo.AutoAnders.washCalendar.entity.WashType;
import Gloyoo.AutoAnders.washCalendar.repository.WashCalendarRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class WashCalendarService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final WashCalendarRepository washCalendarRepository;
    private final UserService userService;
    private final StatusChangeEmailService statusChangeEmailService;

    public WashCalendarService(
            WashCalendarRepository washCalendarRepository,
            UserService userService,
            StatusChangeEmailService statusChangeEmailService
    ) {
        this.washCalendarRepository = washCalendarRepository;
        this.userService = userService;
        this.statusChangeEmailService = statusChangeEmailService;
    }

    public WashCalendar book_a_wash_calendar(
            WashCalendarRequest washCalendarRequest,
            UUID userId
    ) {
        User user = userService.findByIdOrThrow(userId);
        String cancellationToken = generateCancellationToken();
        return washCalendarRepository.save(toEntity(
                washCalendarRequest.washType(),
                washCalendarRequest.localDateTime(),
                user,
                cancellationToken
        ));
    }

    @Transactional
    public List<WashCalendar> bookWashCalendars(
            WashCalendarBatchRequest request,
            UUID userId
    ) {
        User user = userService.findByIdOrThrow(userId);
        String cancellationToken = generateCancellationToken();
        List<WashCalendar> washCalendars = request.washTypes().stream()
                .distinct()
                .map(washType -> toEntity(
                        washType,
                        request.localDateTime(),
                        user,
                        cancellationToken
                ))
                .toList();

        return washCalendarRepository.saveAll(washCalendars);
    }

    @Transactional
    public List<WashCalendar> bookGuestWashCalendars(GuestWashCalendarRequest request) {
        User guest = userService.registerGuest(
                request.name(),
                request.email(),
                request.phoneNumber()
        );
        String cancellationToken = generateCancellationToken();
        List<WashCalendar> washCalendars = request.washTypes().stream()
                .distinct()
                .map(washType -> toEntity(
                        washType,
                        request.localDateTime(),
                        guest,
                        cancellationToken
                ))
                .toList();

        return washCalendarRepository.saveAll(washCalendars);
    }

    public List<WashCalendar> getWashCalendarByUser(UUID userId) {
        return washCalendarRepository.findByUser(userService.findByIdOrThrow(userId));
    }

    public List<WashCalendar> getWashCalendarByDate(LocalDateTime localDateTime) {
        return washCalendarRepository.findByLocalDateTime(localDateTime);
    }

    @Transactional
    public AppointmentCancellation deleteWashCalendar(UUID uuid, UUID userId) {
        WashCalendar washCalendar = findOwnedWashCalendar(uuid, userId);
        return cancelAppointments(List.of(washCalendar));
    }

    @Transactional
    public AppointmentCancellation deleteWashCalendarAsAdmin(UUID uuid) {
        WashCalendar washCalendar = washCalendarRepository.findById(uuid)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Wash calendar not found"
                ));

        return cancelAppointments(List.of(washCalendar));
    }

    @Transactional
    public AppointmentCancellation deleteWashCalendars(List<UUID> ids, UUID userId) {
        List<UUID> uniqueIds = List.copyOf(new LinkedHashSet<>(ids));
        List<WashCalendar> washCalendars = washCalendarRepository.findAllById(uniqueIds);

        if (washCalendars.size() != uniqueIds.size()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "One or more appointments were not found");
        }

        boolean ownsEveryAppointment = washCalendars.stream()
                .allMatch(washCalendar -> washCalendar.getUser().getId().equals(userId));
        if (!ownsEveryAppointment) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only cancel your own appointments"
            );
        }

        return cancelAppointments(washCalendars);
    }

    @Transactional
    public AppointmentCancellation deleteWashCalendarsByToken(String cancellationToken) {
        if (cancellationToken == null || cancellationToken.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cancellation token is required"
            );
        }

        List<WashCalendar> washCalendars =
                washCalendarRepository.findByCancellationTokenHash(
                        hashCancellationToken(cancellationToken)
                );
        if (washCalendars.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Appointment cancellation token is invalid or already used"
            );
        }

        return cancelAppointments(washCalendars);
    }

    public List<WashCalendar> findAllWashCalendar() {
        return washCalendarRepository.findAll();
    }

    @Transactional
    public int deleteExpiredAppointments(LocalDateTime cutoff) {
        List<WashCalendar> expiredAppointments =
                washCalendarRepository.findByLocalDateTimeBefore(cutoff);
        if (expiredAppointments.isEmpty()) {
            return 0;
        }

        Map<UUID, User> guestUsers = new LinkedHashMap<>();
        for (WashCalendar appointment : expiredAppointments) {
            User user = appointment.getUser();
            if (userService.isGuest(user)) {
                guestUsers.putIfAbsent(user.getId(), user);
            }
        }

        washCalendarRepository.deleteAll(expiredAppointments);
        washCalendarRepository.flush();

        for (User guest : guestUsers.values()) {
            if (washCalendarRepository.countByUser(guest) == 0) {
                userService.deleteGuest(guest);
            }
        }

        return expiredAppointments.size();
    }


    public List<WashCalendar> findByAccepted(boolean accepted, UUID userId) {
        return washCalendarRepository.findByUserAndAccepted(
                userService.findByIdOrThrow(userId),
                accepted
        );
    }

    @Transactional
    public void accept(UUID washCalendarId) {
        WashCalendar washCalendar = washCalendarRepository.findById(washCalendarId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Wash calendar not found"
                ));

        boolean previousAccepted = washCalendar.isAccepted();
        washCalendar.setAccepted(true);

        WashCalendar savedWashCalendar = washCalendarRepository.save(washCalendar);
        statusChangeEmailService.sendAppointmentStatusChanged(
                savedWashCalendar,
                previousAccepted,
                savedWashCalendar.isAccepted()
        );
    }

    private WashCalendar findOwnedWashCalendar(UUID washCalendarId, UUID userId) {
        WashCalendar washCalendar = washCalendarRepository.findById(washCalendarId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Wash calendar not found"
                ));

        if (!washCalendar.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only cancel your own appointments"
            );
        }

        return washCalendar;
    }

    private AppointmentCancellation cancelAppointments(
            List<WashCalendar> washCalendars
    ) {
        User user = washCalendars.getFirst().getUser();
        List<UUID> cancelledIds = washCalendars.stream()
                .map(WashCalendar::getId)
                .toList();
        AppointmentCancellation cancellation = new AppointmentCancellation(
                user.getName(),
                userService.contactEmail(user),
                washCalendars.getFirst().getLocalDateTime(),
                washCalendars.stream()
                        .map(WashCalendar::getWashType)
                        .distinct()
                        .toList(),
                false
        );

        boolean deleteGuest = userService.isGuest(user)
                && washCalendarRepository.countByUserAndIdNotIn(user, cancelledIds) == 0;
        washCalendarRepository.deleteAll(washCalendars);

        if (deleteGuest) {
            userService.deleteGuest(user);
            return new AppointmentCancellation(
                    cancellation.customerName(),
                    cancellation.customerEmail(),
                    cancellation.localDateTime(),
                    cancellation.washTypes(),
                    true
            );
        }

        return cancellation;
    }

    private WashCalendar toEntity(
            WashType washType,
            LocalDateTime localDateTime,
            User user,
            String cancellationToken
    ) {
        return WashCalendar.builder()
                .washType(washType)
                .user(user)
                .localDateTime(localDateTime)
                .cancellationTokenHash(hashCancellationToken(cancellationToken))
                .cancellationToken(cancellationToken)
                .build();
    }

    private String generateCancellationToken() {
        byte[] tokenBytes = new byte[32];
        SECURE_RANDOM.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    private String hashCancellationToken(String cancellationToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(
                    cancellationToken.getBytes(StandardCharsets.UTF_8)
            );
            return java.util.HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }
}
