package Gloyoo.AutoAnders.user.controller;

import Gloyoo.AutoAnders.Cars.entity.Car;
import Gloyoo.AutoAnders.config.JwtService;
import Gloyoo.AutoAnders.notification.RegisterConfirmationService;
import Gloyoo.AutoAnders.user.service.ProfileAccessTokenService;
import Gloyoo.AutoAnders.user.dto.AuthRequest;
import Gloyoo.AutoAnders.user.dto.AuthResponse;
import Gloyoo.AutoAnders.user.dto.TokenResponse;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.service.UserService;
import Gloyoo.AutoAnders.user.dto.UserCreateRequest;
import Gloyoo.AutoAnders.user.dto.UserUpdateRequest;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")

public class AuthController {

    private static final String ACCESS_COOKIE = "accessToken";
    private static final String REFRESH_COOKIE = "refreshToken";
    private static final Duration ACCESS_TTL = Duration.ofMinutes(15);
    private static final Duration REFRESH_TTL = Duration.ofDays(7);
    private final UserService userService;
    private final JwtService jwt;
    private final RegisterConfirmationService registerConfirmationService;
    private final ProfileAccessTokenService profileAccessTokenService;
    private final String appBaseUrl;

    public AuthController(
            UserService userService,
            JwtService jwt,
            RegisterConfirmationService registerConfirmationService,
            ProfileAccessTokenService profileAccessTokenService,
            @org.springframework.beans.factory.annotation.Value("${app.base-url}") String appBaseUrl
    ) {
        this.userService = userService;
        this.jwt = jwt;
        this.registerConfirmationService = registerConfirmationService;
        this.profileAccessTokenService = profileAccessTokenService;
        this.appBaseUrl = removeTrailingSlash(appBaseUrl);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserCreateRequest req, HttpServletRequest request) {
        try {
            User u = userService.register(req);
            // optional: auto-login after register
            String access = jwt.generateToken(u.getEmail(),
                    Map.of("uid", u.getId().toString(), "role", u.getRole(), "user", u.getName()),
                    ACCESS_TTL);
            String refresh = jwt.generateToken(u.getEmail(),
                    Map.of("uid", u.getId().toString(), "role", u.getRole(), "user", u.getName(), "type", "refresh"),
                    REFRESH_TTL);

            registerConfirmationService.sendRegisterConfirmation(u);

            return withAuthCookies(ResponseEntity.status(HttpStatus.CREATED), request, access, refresh)
                    .body(authPayload(u));
        } catch (IllegalArgumentException ex) {
            ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
            pd.setTitle("Registration failed");
            pd.setProperty("exception", ex.getClass().getName());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(pd);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest req, HttpServletRequest request) {

        try {
            User u = userService.findByEmailOrThrow(req.getEmail());

            if (!userService.checkPassword(u, req.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
            }

            String access = jwt.generateToken(u.getEmail(),
                    Map.of("uid", u.getId().toString(), "role", u.getRole(), "user", u.getName()),
                    ACCESS_TTL);
            String refresh = jwt.generateToken(u.getEmail(),
                    Map.of("uid", u.getId().toString(), "role", u.getRole(), "user", u.getName(), "type", "refresh"),
                    REFRESH_TTL);
            return withAuthCookies(ResponseEntity.ok(), request, access, refresh)
                    .body(authPayload(u));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PatchMapping("/update")
    public ResponseEntity<?> updateUser(
            @Valid @RequestBody UserUpdateRequest req,
            Authentication authentication,
            HttpServletRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        try {
            User user = userService.update(authenticatedUserId(authentication), req);
            String access = jwt.generateToken(user.getEmail(),
                    Map.of("uid", user.getId().toString(), "role", user.getRole(), "user", user.getName()),
                    ACCESS_TTL);
            String refresh = jwt.generateToken(user.getEmail(),
                    Map.of("uid", user.getId().toString(), "role", user.getRole(), "user", user.getName(), "type", "refresh"),
                    REFRESH_TTL);

            return withAuthCookies(ResponseEntity.ok(), request, access, refresh)
                    .body(authPayload(user));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @RequestBody(required = false) TokenResponse body,
            HttpServletRequest request) {
        try {
            String refreshToken = body != null && body.refreshToken() != null
                    ? body.refreshToken()
                    : readCookie(request, REFRESH_COOKIE);
            if (refreshToken == null || refreshToken.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing refresh token"));
            }

            var claims = jwt.parse(refreshToken).getBody();
            if (!"refresh".equals(claims.get("type"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token type"));
            }
            String email = claims.getSubject();
            String access = jwt.generateToken(email,
                    Map.of("uid", claims.get("uid"), "role", claims.get("role"), "user", claims.get("user")),
                    ACCESS_TTL);
            Map<String, Object> payload = authPayload(claims);
            payload.put("accessToken", access);
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, authCookie(request, ACCESS_COOKIE, access, ACCESS_TTL).toString())
                    .body(payload);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid/expired token"));
        }
    }

    @GetMapping("/getUserCars")
    public ResponseEntity<?> getUserCars(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Car> cars = userService.findAllCarsByUserId(user.getId());
        return ResponseEntity.ok(cars);

    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        return ResponseEntity.ok(authPayload(userService.findByIdOrThrow(authenticatedUserId(authentication))));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, expiredCookie(request, ACCESS_COOKIE).toString())
                .header(HttpHeaders.SET_COOKIE, expiredCookie(request, REFRESH_COOKIE).toString())
                .body(Map.of("message", "Logged out"));
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }

    @GetMapping("/profile-access")
    public ResponseEntity<Void> profileAccess(
            @RequestParam String token,
            HttpServletRequest request
    ) {
        User user = profileAccessTokenService.consumeToken(token);
        String access = jwt.generateToken(user.getEmail(),
                Map.of(
                        "uid", user.getId().toString(),
                        "role", user.getRole(),
                        "user", user.getName(),
                        "profileAccess", true
                ),
                ACCESS_TTL);

        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.SET_COOKIE, authCookie(request, ACCESS_COOKIE, access, ACCESS_TTL).toString())
                .header(HttpHeaders.LOCATION, appBaseUrl + "/nl/profile")
                .build();
    }

    private ResponseEntity.BodyBuilder withAuthCookies(
            ResponseEntity.BodyBuilder builder,
            HttpServletRequest request,
            String access,
            String refresh) {
        return builder
                .header(HttpHeaders.SET_COOKIE, authCookie(request, ACCESS_COOKIE, access, ACCESS_TTL).toString())
                .header(HttpHeaders.SET_COOKIE, authCookie(request, REFRESH_COOKIE, refresh, REFRESH_TTL).toString());
    }

    private ResponseCookie authCookie(HttpServletRequest request, String name, String value, Duration maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(maxAge)
                .build();
    }

    private ResponseCookie expiredCookie(HttpServletRequest request, String name) {
        return ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(Duration.ZERO)
                .build();
    }

    private String readCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private Map<String, Object> authPayload(User user) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("uid", user.getId().toString());
        payload.put("role", user.getRole());
        payload.put("user", user.getName());
        payload.put("email", user.getEmail());
        payload.put("phoneNumber", user.getPhoneNumber() == null ? "" : user.getPhoneNumber());
        return payload;
    }

    private Map<String, Object> authPayload(Claims claims) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("uid", claims.get("uid"));
        payload.put("role", claims.get("role"));
        payload.put("user", claims.get("user"));
        payload.put("email", claims.getSubject());
        return payload;
    }

    private UUID authenticatedUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Map<?, ?> details)) {
            throw new IllegalArgumentException("Not authenticated");
        }

        Object uid = details.get("uid");
        if (uid == null) {
            throw new IllegalArgumentException("User ID missing");
        }

        return UUID.fromString(uid.toString());
    }

    private String removeTrailingSlash(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        while (value.endsWith("/")) {
            value = value.substring(0, value.length() - 1);
        }

        return value;
    }
}
