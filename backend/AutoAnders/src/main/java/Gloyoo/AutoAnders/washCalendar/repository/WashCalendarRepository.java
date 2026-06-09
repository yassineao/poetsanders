package Gloyoo.AutoAnders.washCalendar.repository;

import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface WashCalendarRepository extends JpaRepository<WashCalendar, UUID> {

    List<WashCalendar> findByUser(User user);


    List<WashCalendar> findByLocalDateTime(LocalDateTime localDateTime);

    List<WashCalendar> findByUserAndAccepted(User user, boolean accepted);


}