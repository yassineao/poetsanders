package Gloyoo.AutoAnders.washCalendar.scheduling;

import Gloyoo.AutoAnders.washCalendar.service.WashCalendarService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Component
public class ExpiredAppointmentCleanupScheduler {

    private static final Logger log =
            LoggerFactory.getLogger(ExpiredAppointmentCleanupScheduler.class);

    private final WashCalendarService washCalendarService;
    private final ZoneId appointmentTimeZone;

    public ExpiredAppointmentCleanupScheduler(
            WashCalendarService washCalendarService,
            @Value("${app.appointments.time-zone:Europe/Amsterdam}") String timeZone
    ) {
        this.washCalendarService = washCalendarService;
        this.appointmentTimeZone = ZoneId.of(timeZone);
    }

    @Scheduled(
            cron = "${app.appointments.cleanup-cron:0 */15 * * * *}",
            zone = "${app.appointments.time-zone:Europe/Amsterdam}"
    )
    public void deleteExpiredAppointments() {
        LocalDateTime cutoff = LocalDateTime.now(appointmentTimeZone);
        int deleted = washCalendarService.deleteExpiredAppointments(cutoff);

        if (deleted > 0) {
            log.info("Deleted {} expired appointment rows before {}", deleted, cutoff);
        }
    }
}
