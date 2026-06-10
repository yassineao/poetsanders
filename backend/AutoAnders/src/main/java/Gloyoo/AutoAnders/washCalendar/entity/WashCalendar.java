package Gloyoo.AutoAnders.washCalendar.entity;

import Gloyoo.AutoAnders.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "wash_calendar")
public class WashCalendar {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "wash_type", nullable = false)
    private WashType washType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "local_date_time", nullable = false)
    private LocalDateTime localDateTime;
    
    @Column(name= "accepted" , nullable = false)
    @Builder.Default
    private boolean accepted = false;

    @Column(name = "cancellation_token_hash", nullable = false, length = 64)
    private String cancellationTokenHash;

    @Transient
    private String cancellationToken;
}
