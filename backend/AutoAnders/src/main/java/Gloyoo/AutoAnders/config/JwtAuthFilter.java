package Gloyoo.AutoAnders.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String ACCESS_COOKIE = "accessToken";
    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwtService jwt;

    public JwtAuthFilter(JwtService jwt) {
        this.jwt = jwt;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String auth = request.getHeader("Authorization");
        String token = null;

        if (auth != null && auth.startsWith("Bearer ")) {
            token = auth.substring(7);
        } else {
            token = readCookie(request, ACCESS_COOKIE);
        }

        if (token != null && !token.isBlank()) {
            try {
                var claims = jwt.parse(token).getBody();

                if ("refresh".equals(claims.get("type"))) {
                    throw new RuntimeException("refresh token cannot authenticate requests");
                }

                Object uidObj = claims.get("uid");

                if (uidObj == null) {
                    throw new RuntimeException("uid missing in token claims");
                }

                UUID uid = UUID.fromString(uidObj.toString());

                String role = (String) claims.get("role");
                String user = (String) claims.get("user");
                List<SimpleGrantedAuthority> authorities = List.of(
                        new SimpleGrantedAuthority("ROLE_" + claims.get("role"))
                );

                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(user, null, authorities);

                    authentication.setDetails(java.util.Map.of(
                            "uid", uid.toString(),
                            "role", role == null ? "" : role,
                            "user", user == null ? "" : user,
                            "email", claims.getSubject()
                    ));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }

            } catch (Exception e) {
                log.warn("Rejected access token on {} {}: {}",
                        request.getMethod(), request.getRequestURI(), e.getMessage());
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("""
                        {
                          "error": "APP_JWT_INVALID_OR_EXPIRED",
                          "message": "The access token was rejected before reaching the controller.",
                          "hint": "Log in again so the browser receives a fresh HttpOnly accessToken cookie."
                        }
                        """);
                return;
            }
        }

        chain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.equals("/auth/login")
                || path.equals("/auth/register")
                || path.equals("/auth/refresh")
                || path.equals("/auth/logout");
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
}
