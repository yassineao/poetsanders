package Gloyoo.AutoAnders.washCalendar.service;

import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.repository.UserRepository;
import Gloyoo.AutoAnders.user.service.UserService;
import Gloyoo.AutoAnders.washCalendar.dto.WashCalendarRequest;
import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import Gloyoo.AutoAnders.washCalendar.repository.WashCalendarRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

        WashCalendar washCalendar = WashCalendar.builder()
                .washType(washCalendarRequest.washType())
                .user(user)
                .localDateTime(washCalendarRequest.localDateTime())
                .build();

        return washCalendarRepository.save(washCalendar);
    }

    public List<WashCalendar> getWashCalendarByUser(UUID userId) {
        return washCalendarRepository.findByUser(userService.findByIdOrThrow(userId));
    }

    public List<WashCalendar> getWashCalendarByDate(LocalDateTime localDateTime) {
        return washCalendarRepository.findByLocalDateTime(localDateTime);
    }

    public void deleteWashCalendar(UUID uuid) {
        WashCalendar washCalendar = washCalendarRepository.findById(uuid)
                .orElseThrow(() -> new RuntimeException("Wash calendar not found"));

        washCalendarRepository.delete(washCalendar);
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

    public void accept(UUID washCalendarId) {
        WashCalendar washCalendar = washCalendarRepository.findById(washCalendarId)
                .orElseThrow();

        washCalendar.setAccepted(true);

        washCalendarRepository.save(washCalendar);
    }
}
