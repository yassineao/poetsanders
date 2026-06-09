package Gloyoo.AutoAnders.washCalendar.service;

import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.service.UserService;
import Gloyoo.AutoAnders.washCalendar.dto.WashCalendarBatchRequest;
import Gloyoo.AutoAnders.washCalendar.dto.WashCalendarRequest;
import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import Gloyoo.AutoAnders.washCalendar.entity.WashType;
import Gloyoo.AutoAnders.washCalendar.repository.WashCalendarRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.UUID;

@Service
public class WashCalendarService {

    private final WashCalendarRepository washCalendarRepository;
    private final UserService userService;

    public WashCalendarService(
            WashCalendarRepository washCalendarRepository,
            UserService userService
    ) {
        this.washCalendarRepository = washCalendarRepository;
        this.userService = userService;
    }

    public WashCalendar book_a_wash_calendar(
            WashCalendarRequest washCalendarRequest,
            UUID userId
    ) {
        User user = userService.findByIdOrThrow(userId);
        return washCalendarRepository.save(toEntity(
                washCalendarRequest.washType(),
                washCalendarRequest.localDateTime(),
                user
        ));
    }

    @Transactional
    public List<WashCalendar> bookWashCalendars(
            WashCalendarBatchRequest request,
            UUID userId
    ) {
        User user = userService.findByIdOrThrow(userId);
        List<WashCalendar> washCalendars = request.washTypes().stream()
                .distinct()
                .map(washType -> toEntity(washType, request.localDateTime(), user))
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
    public void deleteWashCalendar(UUID uuid, UUID userId) {
        WashCalendar washCalendar = findOwnedWashCalendar(uuid, userId);

        washCalendarRepository.delete(washCalendar);
    }

    @Transactional
    public void deleteWashCalendars(List<UUID> ids, UUID userId) {
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

        washCalendarRepository.deleteAll(washCalendars);
    }

    public List<WashCalendar> findAllWashCalendar() {
        return washCalendarRepository.findAll();
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

        washCalendar.setAccepted(true);

        washCalendarRepository.save(washCalendar);
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

    private WashCalendar toEntity(
            WashType washType,
            LocalDateTime localDateTime,
            User user
    ) {
        return WashCalendar.builder()
                .washType(washType)
                .user(user)
                .localDateTime(localDateTime)
                .build();
    }
}
