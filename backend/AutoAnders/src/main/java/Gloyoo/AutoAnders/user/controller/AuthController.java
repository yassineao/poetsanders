package Gloyoo.AutoAnders.user.controller;

import Gloyoo.AutoAnders.Cars.entity.Car;
import Gloyoo.AutoAnders.config.JwtService;
import Gloyoo.AutoAnders.user.dto.AuthRequest;
import Gloyoo.AutoAnders.user.dto.AuthResponse;
import Gloyoo.AutoAnders.user.dto.TokenResponse;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.service.UserService;
import Gloyoo.AutoAnders.user.dto.UserCreateRequest;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")

public class AuthController {

    private static final String ACCESS_COOKIE = "accessToken";
    private static final String REFRESH_COOKIE = "refreshToken";
    private static final Duration ACCESS_TTL = Duration.ofMinutes(15);
    private static final Duration REFRESH_TTL = Duration.ofDays(7);
    private final UserService userService;
    private final JwtService jwt;

    public AuthController(UserService userService, JwtService jwt) {
        this.userService = userService;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserCreateRequest req, HttpServletRequest request) {
        try {
            User u = userService.register(req);
            // optional: auto-login after register
            String access = jwt.generateToken(u.getEmail(),
                    Map.of("uid", u.getId().toString(), "role", u.getRole(),"user",u.getName()),
                    ACCESS_TTL);
            String refresh = jwt.generateToken(u.getEmail(),
                    Map.of("uid", u.getId().toString(), "role", u.getRole(),"user",u.getName(), "type", "refresh"),
                    REFRESH_TTL);
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
    public ResponseEntity<?> login(@RequestBody AuthRequest req, HttpServletRequest request) {

        try {
            User u = userService.findByEmailOrThrow(req.getEmail());

            if (!userService.checkPassword(u, req.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","Invalid credentials"));
            }

            String access = jwt.generateToken(u.getEmail(),
                    Map.of("uid", u.getId().toString(), "role", u.getRole(),"user",u.getName()),
                    ACCESS_TTL);
            String refresh = jwt.generateToken(u.getEmail(),
                    Map.of("uid", u.getId().toString(), "role", u.getRole(),"user",u.getName(), "type", "refresh"),
                    REFRESH_TTL);
            return withAuthCookies(ResponseEntity.ok(), request, access, refresh)
                    .body(authPayload(u));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","Invalid credentials"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @RequestBody(required = false) TokenResponse body,
            HttpServletRequest request
    ) {
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
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, authCookie(request, ACCESS_COOKIE, access, ACCESS_TTL).toString())
                    .body(authPayload(claims));
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

        return ResponseEntity.ok(authentication.getDetails());
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


    private ResponseEntity.BodyBuilder withAuthCookies(
            ResponseEntity.BodyBuilder builder,
            HttpServletRequest request,
            String access,
            String refresh
    ) {
        return builder
                .header(HttpHeaders.SET_COOKIE, authCookie(request, ACCESS_COOKIE, access, ACCESS_TTL).toString())
                .header(HttpHeaders.SET_COOKIE, authCookie(request, REFRESH_COOKIE, refresh, REFRESH_TTL).toString());
    }

    private ResponseCookie authCookie(HttpServletRequest request, String name, String value, Duration maxAge) {
        boolean secure = isSecureRequest(request);
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secure)
                .sameSite(secure ? "None" : "Lax")
                .path("/")
                .maxAge(maxAge)
                .build();
    }

    private ResponseCookie expiredCookie(HttpServletRequest request, String name) {
        boolean secure = isSecureRequest(request);
        return ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(secure)
                .sameSite(secure ? "None" : "Lax")
                .path("/")
                .maxAge(Duration.ZERO)
                .build();
    }

    private boolean isSecureRequest(HttpServletRequest request) {
        String forwardedProto = request.getHeader("X-Forwarded-Proto");
        String forwarded = request.getHeader("Forwarded");
        String forwardedSsl = request.getHeader("X-Forwarded-Ssl");
        String origin = request.getHeader("Origin");
        String referer = request.getHeader("Referer");

        return request.isSecure()
                || containsHttps(forwardedProto)
                || containsHttps(forwarded)
                || "on".equalsIgnoreCase(forwardedSsl)
                || startsWithHttps(origin)
                || startsWithHttps(referer);
    }

    private boolean containsHttps(String value) {
        return value != null && value.toLowerCase().contains("https");
    }

    private boolean startsWithHttps(String value) {
        return value != null && value.toLowerCase().startsWith("https://");
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
}
