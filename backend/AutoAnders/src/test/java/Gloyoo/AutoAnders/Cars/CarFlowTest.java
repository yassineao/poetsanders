package Gloyoo.AutoAnders.Cars;

import Gloyoo.AutoAnders.Cars.dto.CarRequest;
import Gloyoo.AutoAnders.Cars.entity.Car;
import Gloyoo.AutoAnders.Cars.entity.DriveType;
import Gloyoo.AutoAnders.Cars.entity.Status;
import Gloyoo.AutoAnders.Cars.repository.CarRepository;
import Gloyoo.AutoAnders.Cars.service.CarService;
import Gloyoo.AutoAnders.config.JwtService;
import Gloyoo.AutoAnders.notification.CarManagementEmail;
import Gloyoo.AutoAnders.storage.service.SupaBasePictureStorage;
import Gloyoo.AutoAnders.user.entity.Role;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Real security, MVC, services, repositories, Flyway and PostgreSQL; only storage is mocked. */
@Testcontainers
@AutoConfigureMockMvc
@SpringBootTest(properties = {
        "spring.config.import=",
        "spring.docker.compose.enabled=false",
        "jwt.secret=test-only-secret-at-least-32-characters-long",
        "app.mail.enabled=false",
        "app.appointments.cleanup-cron=-"
})
class CarFlowTest {
    @Container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine");

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired CarRepository cars;
    @Autowired UserRepository users;
    @Autowired CarService service;
    @Autowired JwtService jwt;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean SupaBasePictureStorage storage;
    @MockitoBean CarManagementEmail carEmail;

    User owner;
    User other;
    User admin;

    @BeforeEach
    void setUp() {
        cars.deleteAll();
        users.deleteAll();
        owner = user("owner", Role.USER);
        other = user("other", Role.USER);
        admin = user("admin", Role.ADMIN);
        when(storage.resolveAccessibleUrl(anyString())).thenAnswer(call -> "https://pictures.example/" + call.getArgument(0));
    }

    @Test
    void featuresCanBeAddedReplacedRemovedAndClearedWithoutChangingCarDetails() throws Exception {
        Car car = saveCar(owner, "FEATURES-01", Status.Available);
        String path = "/cars/" + car.getId() + "/features";
        mvc.perform(get(path)).andExpect(status().isOk()).andExpect(content().json("[]"));
        mvc.perform(post(path).header("Authorization", token(owner)).contentType(APPLICATION_JSON)
                        .content("""
                                {"features":[" Navigation ","Heated seats","Navigation"]}
                                """))
                .andExpect(status().isOk()).andExpect(content().json("[\"Navigation\",\"Heated seats\"]"));
        mvc.perform(post(path).header("Authorization", token(owner)).contentType(APPLICATION_JSON)
                        .content("{\"features\":[\"Navigation\",\"Sunroof\"]}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(3));
        mvc.perform(get(path)).andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("Navigation"))
                .andExpect(jsonPath("$[2]").value("Sunroof"));
        mvc.perform(delete(path).header("Authorization", token(owner)).contentType(APPLICATION_JSON)
                        .content("{\"features\":[\" Heated seats \",\"Not present\"]}"))
                .andExpect(status().isOk()).andExpect(content().json("[\"Navigation\",\"Sunroof\"]"));
        mvc.perform(put(path).header("Authorization", token(admin)).contentType(APPLICATION_JSON)
                        .content("{\"features\":[\" Parking sensors \",\"Parking sensors\"]}"))
                .andExpect(status().isOk()).andExpect(content().json("[\"Parking sensors\"]"));
        mvc.perform(get("/cars/{id}", car.getId())).andExpect(status().isOk())
                .andExpect(jsonPath("$.features[0]").value("Parking sensors"))
                .andExpect(jsonPath("$.brand").value(car.getBrand()))
                .andExpect(jsonPath("$.licensePlate").value("FEATURES-01"))
                .andExpect(jsonPath("$.status").value("Available"));
        mvc.perform(put(path).header("Authorization", token(owner)).contentType(APPLICATION_JSON)
                        .content("{\"features\":[]}"))
                .andExpect(status().isOk()).andExpect(content().json("[]"));
        assertThat(jdbc.queryForObject("SELECT count(*) FROM car_features WHERE car_id = ?", Long.class, car.getId()))
                .isZero();
    }

    @Test
    void featureWritesRequireOwnerOrAdminAndValidateEveryFeature() throws Exception {
        Car car = saveCar(owner, "FEATURES-02", Status.Pending_Confirmation);
        String path = "/cars/" + car.getId() + "/features";
        for (var method : List.of(org.springframework.http.HttpMethod.POST,
                org.springframework.http.HttpMethod.PUT, org.springframework.http.HttpMethod.DELETE)) {
            mvc.perform(request(method, path).contentType(APPLICATION_JSON)
                            .content("{\"features\":[\"Navigation\"]}"))
                    .andExpect(status().isUnauthorized());
            mvc.perform(request(method, path).header("Authorization", token(other)).contentType(APPLICATION_JSON)
                            .content("{\"features\":[\"Navigation\"]}"))
                    .andExpect(status().isForbidden());
            for (String body : List.of("{}", "{\"features\":null}", "{\"features\":[null]}",
                    "{\"features\":[\" \"]}", "{\"features\":[\"" + "x".repeat(256) + "\"]}")) {
                mvc.perform(request(method, path).header("Authorization", token(owner))
                                .contentType(APPLICATION_JSON).content(body))
                        .andExpect(status().isBadRequest());
            }
            mvc.perform(request(method, "/cars/" + UUID.randomUUID() + "/features")
                            .header("Authorization", token(admin)).contentType(APPLICATION_JSON)
                            .content("{\"features\":[\"Navigation\"]}"))
                    .andExpect(status().isNotFound());
        }
        mvc.perform(get(path)).andExpect(status().isOk()).andExpect(content().json("[]"));
        mvc.perform(get("/cars/{id}/features", UUID.randomUUID())).andExpect(status().isNotFound());
    }

    @Test
    void guestCanSubmitWithoutLoginEvenWithAnExpiredToken() throws Exception {
        String response = mvc.perform(post("/cars/guest")
                        .servletPath("/cars/guest")
                        .header("Authorization", "Bearer expired-token")
                        .contentType(APPLICATION_JSON).content(guestRequest("Guest@Example.com", "GUEST-01")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("Pending_Confirmation"))
                .andExpect(jsonPath("$.featured").value(false))
                .andExpect(jsonPath("$.reserved").value(false))
                .andExpect(jsonPath("$.sold").value(false))
                .andExpect(jsonPath("$.features[0]").value("Navigation"))
                .andExpect(jsonPath("$.pictures[0].storage_path").value("cars/guest.jpg"))
                .andExpect(jsonPath("$.user").doesNotExist())
                .andReturn().getResponse().getContentAsString();
        UUID id = UUID.fromString(mapper.readTree(response).get("id").asText());
        User guest = users.findByEmail("guest::guest@example.com").orElseThrow();
        assertThat(guest.getName()).isEqualTo("Guest Name");
        assertThat(guest.getRole()).isEqualTo(Role.USER);
        assertThat(cars.findByUserId(guest.getId())).extracting(Car::getId).containsExactly(id);
        verify(carEmail).sendCarRequestConfirmation(eq("Guest Name"), eq("guest@example.com"), any(Car.class));
        mvc.perform(get("/cars")).andExpect(status().isOk()).andExpect(jsonPath("$").isEmpty());
        mvc.perform(delete("/cars/{id}", id)).andExpect(status().isUnauthorized());
    }

    @Test
    void guestSubmissionValidatesContactAndNestedCarBeforeCreatingUser() throws Exception {
        String valid = guestRequest("guest@example.com", "GUEST-01");
        for (String body : List.of(
                valid.replace("guest@example.com", "invalid-email"),
                valid.replace("Guest Name", " "),
                valid.replace("0612345678", "123"),
                valid.replace("Volvo", " "),
                "{\"name\":\"Guest\",\"email\":\"guest@example.com\",\"phoneNumber\":\"0612345678\"}")) {
            mvc.perform(post("/cars/guest").contentType(APPLICATION_JSON).content(body))
                    .andExpect(status().isBadRequest());
        }
        assertThat(users.count()).isEqualTo(3);
        assertThat(cars.count()).isZero();
        verifyNoInteractions(carEmail);
    }

    @Test
    void failedGuestCarCreationRollsBackGuestRegistration() throws Exception {
        saveCar(owner, "TAKEN", Status.Available);
        mvc.perform(post("/cars/guest").contentType(APPLICATION_JSON)
                        .content(guestRequest("guest@example.com", "TAKEN")))
                .andExpect(status().isConflict());
        assertThat(users.findByEmail("guest::guest@example.com")).isEmpty();
        assertThat(cars.count()).isEqualTo(1);
        verifyNoInteractions(carEmail);
    }

    @Test
    void guestSubmissionRejectsRegisteredAndPreviouslyUsedEmails() throws Exception {
        mvc.perform(post("/cars/guest").contentType(APPLICATION_JSON)
                        .content(guestRequest(owner.getEmail(), "GUEST-01")))
                .andExpect(status().isConflict());
        mvc.perform(post("/cars/guest").contentType(APPLICATION_JSON)
                        .content(guestRequest("guest@example.com", "GUEST-01")))
                .andExpect(status().isCreated());
        mvc.perform(post("/cars/guest").contentType(APPLICATION_JSON)
                        .content(guestRequest("GUEST@example.com", "GUEST-02")))
                .andExpect(status().isConflict());
        assertThat(users.count()).isEqualTo(4);
        assertThat(cars.count()).isEqualTo(1);
    }

    private String guestRequest(String email, String plate) {
        return """
                {"name":" Guest Name ","email":"%s","phoneNumber":"0612345678",
                 "car":{"brand":"Volvo","model":"XC60","licensePlate":"%s",
                        "status":"Available","featured":true,"reserved":true,"sold":true,
                        "features":["Navigation"],"pictures":[{"storagePath":"cars/guest.jpg"}]}}
                """.formatted(email, plate);
    }

    @Test
    void customerSubmissionApprovalUpdateAndDeletionWorkThroughHttp() throws Exception {
        String body = """
                {"brand":"Volvo","model":"XC60","licensePlate":" TEST-01 ","price":25000,
                 "status":"Available","pictures":[{"storagePath":"cars/photo.jpg","title":"Front"}]}
                """;
        String response = mvc.perform(post("/cars").header("Authorization", token(owner))
                        .contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("Pending_Confirmation"))
                .andExpect(jsonPath("$.licensePlate").value("TEST-01"))
                .andExpect(jsonPath("$.featured").value(false))
                .andExpect(jsonPath("$.features").isEmpty())
                .andExpect(jsonPath("$.version").value(0))
                .andExpect(jsonPath("$.createdAt").isNotEmpty())
                .andExpect(jsonPath("$.user").doesNotExist())
                .andReturn().getResponse().getContentAsString();
        UUID id = UUID.fromString(mapper.readTree(response).get("id").asText());
        assertThat(cars.findByUserId(owner.getId())).extracting(Car::getId).containsExactly(id);
        mvc.perform(get("/cars")).andExpect(status().isOk()).andExpect(jsonPath("$").isEmpty());
        mvc.perform(patch("/cars/statusUpdate/{id}", id).header("Authorization", token(admin))
                        .contentType(APPLICATION_JSON).content("\"Available\""))
                .andExpect(status().isOk()).andExpect(jsonPath("$.version").value(1));
        mvc.perform(get("/cars")).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(id.toString()))
                .andExpect(jsonPath("$[0].pictures[0].storage_path").value("https://pictures.example/cars/photo.jpg"));
        mvc.perform(put("/cars/{id}", id).header("Authorization", token(owner))
                        .contentType(APPLICATION_JSON).content(body.replace("25000", "24000")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.price").value(24000));
        assertThat(cars.findById(id).orElseThrow().getPrice()).isEqualByComparingTo("24000");
        mvc.perform(get("/cars/by_user").header("Authorization", token(owner)))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].id").value(id.toString()));
        mvc.perform(get("/cars/by_user").header("Authorization", token(other)))
                .andExpect(status().isOk()).andExpect(jsonPath("$").isEmpty());
        mvc.perform(delete("/cars/{id}", id).header("Authorization", token(owner)))
                .andExpect(status().isNoContent());
        assertThat(cars.existsById(id)).isFalse();
        assertThat(jdbc.queryForObject("SELECT count(*) FROM car_pictures WHERE car_id = ?", Long.class, id)).isZero();
        mvc.perform(get("/cars/{id}", id)).andExpect(status().isNotFound());
    }

    @Test
    void authorizationProtectsCarWrites() throws Exception {
        Car car = saveCar(owner, "OWNER-01", Status.Pending_Confirmation);
        String update = """
                {"brand":"Volvo","model":"XC60","status":"Pending_Confirmation"}
                """;
        mvc.perform(post("/cars").contentType(APPLICATION_JSON).content(update)).andExpect(status().isUnauthorized());
        mvc.perform(put("/cars/{id}", car.getId()).header("Authorization", token(other))
                .contentType(APPLICATION_JSON).content(update)).andExpect(status().isForbidden());
        mvc.perform(delete("/cars/{id}", car.getId()).header("Authorization", token(other)))
                .andExpect(status().isForbidden());
        mvc.perform(put("/cars/{id}", car.getId()).header("Authorization", token(owner))
                .contentType(APPLICATION_JSON).content(update.replace("Pending_Confirmation", "Available")))
                .andExpect(status().isForbidden());
        mvc.perform(patch("/cars/statusUpdate/{id}", car.getId()).header("Authorization", token(owner))
                .contentType(APPLICATION_JSON).content("\"Available\""))
                .andExpect(status().isForbidden());
        mvc.perform(get("/cars/by_user")).andExpect(status().isUnauthorized());
        assertThat(cars.findById(car.getId()).orElseThrow().getStatus()).isEqualTo(Status.Pending_Confirmation);
        mvc.perform(delete("/cars/{id}", car.getId()).header("Authorization", token(admin)))
                .andExpect(status().isNoContent());
    }

    @Test
    void duplicatePlatesAndMissingCarsReturnUsefulErrors() throws Exception {
        saveCar(owner, "DUP-01", Status.Available);
        Car second = saveCar(owner, "SECOND", Status.Available);
        String body = """
                {"brand":"Volvo","model":"XC60","licensePlate":" DUP-01 ","status":"Available"}
                """;
        mvc.perform(post("/cars").header("Authorization", token(admin)).contentType(APPLICATION_JSON).content(body))
                .andExpect(status().isConflict());
        mvc.perform(put("/cars/{id}", second.getId()).header("Authorization", token(admin))
                .contentType(APPLICATION_JSON).content(body)).andExpect(status().isConflict());
        mvc.perform(get("/cars/{id}", UUID.randomUUID())).andExpect(status().isNotFound());
        mvc.perform(delete("/cars/{id}", UUID.randomUUID()).header("Authorization", token(admin)))
                .andExpect(status().isNotFound());
        assertThat(cars.count()).isEqualTo(2);
    }

    @Test
    void adminCanCreateAvailableCarsWithoutLicensePlates() throws Exception {
        String body = """
                {"brand":"Volvo","model":"XC60","licensePlate":" ","status":"Available"}
                """;
        for (int i = 0; i < 2; i++) {
            mvc.perform(post("/cars").header("Authorization", token(admin))
                            .contentType(APPLICATION_JSON).content(body))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.status").value("Available"))
                    .andExpect(jsonPath("$.licensePlate").isEmpty());
        }
        assertThat(cars.findByStatus(Status.Available)).hasSize(2);
    }

    @Test
    void repositoryQueriesAndNewFieldsRoundTrip() throws Exception {
        Car car = Car.builder().brand("Volvo").model("EX30").user(owner)
                .licensePlate("EV-01").status(Status.Available).driveType(DriveType.ALL_WHEEL_DRIVE)
                .batteryCapacityKwh(new BigDecimal("75.50")).featured(true)
                .features(List.of("Navigation", "Heated seats")).build();
        car = cars.saveAndFlush(car);
        saveCar(other, "OTHER-01", Status.Pending_Confirmation);
        assertThat(cars.findByStatus(Status.Available)).extracting(Car::getId).containsExactly(car.getId());
        assertThat(cars.findByUserId(owner.getId())).extracting(Car::getId).containsExactly(car.getId());
        assertThat(cars.existsByLicensePlate("EV-01")).isTrue();
        assertThat(cars.existsByLicensePlateAndIdNot("EV-01", car.getId())).isFalse();
        assertThat(cars.existsByLicensePlateAndIdNot("EV-01", UUID.randomUUID())).isTrue();
        mvc.perform(get("/cars/{id}", car.getId())).andExpect(status().isOk())
                .andExpect(jsonPath("$.driveType").value("ALL_WHEEL_DRIVE"))
                .andExpect(jsonPath("$.batteryCapacityKwh").value(75.50))
                .andExpect(jsonPath("$.features[0]").value("Navigation"))
                .andExpect(jsonPath("$.features[1]").value("Heated seats"));
        // Older clients must be able to edit a car without clearing new specifications.
        mvc.perform(put("/cars/{id}", car.getId()).header("Authorization", token(owner))
                        .contentType(APPLICATION_JSON).content("""
                                {"brand":"Volvo","model":"EX30","price":32000,"status":"Available"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.driveType").value("ALL_WHEEL_DRIVE"))
                .andExpect(jsonPath("$.features[0]").value("Navigation"));
        mvc.perform(delete("/cars/{id}", car.getId()).header("Authorization", token(owner)))
                .andExpect(status().isNoContent());
        assertThat(jdbc.queryForObject("SELECT count(*) FROM car_features", Long.class)).isZero();
    }

    @Test
    void serviceCanReadAndEnforceOwnershipOutsideHttp() throws Exception {
        CarRequest request = mapper.readValue("""
                {"brand":"Volvo","model":"XC60","status":"Available"}
                """, CarRequest.class);
        Car car = service.addCar(request, owner.getId(), "USER");
        assertThat(car.getStatus()).isEqualTo(Status.Pending_Confirmation);
        assertThatThrownBy(() -> service.deleteCarForUser(car.getId(), other.getId(), "USER"))
                .isInstanceOf(IllegalArgumentException.class).hasMessageContaining("own cars");
        assertThat(service.findAllCars()).extracting(Car::getId).containsExactly(car.getId());
        assertThat(service.findCarById(car.getId())).isPresent();
        assertThat(service.findCarByUser(owner.getId())).hasSize(1);
        assertThat(service.findAvailableCars()).isEmpty();
        service.deleteCarForUser(car.getId(), owner.getId(), "USER");
        assertThat(cars.existsById(car.getId())).isFalse();
    }

    @Test
    void repositoryRejectsInvalidNewSpecifications() {
        Car car = Car.builder().brand("Volvo").model("EX30").user(owner)
                .batteryCapacityKwh(new BigDecimal("-1")).numberOfSeats(0)
                .vin("THIS-VIN-IS-TOO-LONG").build();
        assertThatThrownBy(() -> cars.saveAndFlush(car))
                .isInstanceOf(ConstraintViolationException.class);
        assertThat(cars.count()).isZero();
    }

    @Test
    void specificationsAndFeaturesCanBeCreatedEditedAndClearedThroughHttp() throws Exception {
        var body = mapper.createObjectNode();
        body.put("brand", "Volvo").put("model", "EX30").put("status", "Available");
        body.put("variant", "Test variant");
        body.put("trimLevel", "Test trimLevel");
        body.put("vin", "WVWZZZ1JZXW000001");
        body.put("originalPrice", 12.5);
        body.put("discountAmount", 12.5);
        body.put("taxScheme", "Test taxScheme");
        body.put("lastServiceDate", "2026-09-01");
        body.put("warrantyUntil", "2026-09-01");
        body.put("accidentFree", true);
        body.put("imported", true);
        body.put("numberOfPreviousOwners", 5);
        body.put("conditionDescription", "Test conditionDescription");
        body.put("horsepower", 5);
        body.put("kilowatts", 5);
        body.put("torqueNm", 5);
        body.put("topSpeed", 5);
        body.put("acceleration", 12.5);
        body.put("tankCapacity", 5);
        body.put("engineCode", "Test engineCode");
        body.put("wltpFuelConsumption", 12.5);
        body.put("electricRange", 5);
        body.put("batteryCapacityKwh", 12.5);
        body.put("chargingTimeHours", 12.5);
        body.put("fastChargingPowerKw", 5);
        body.put("numberOfSeats", 5);
        body.put("lengthMm", 5);
        body.put("widthMm", 5);
        body.put("heightMm", 5);
        body.put("grossVehicleWeight", 5);
        body.put("maxPayload", 5);
        body.put("trunkCapacityLitres", 5);
        body.put("numberOfGears", 5);
        body.put("driveType", "ALL_WHEEL_DRIVE");
        body.put("manufacturerColour", "Test manufacturerColour");
        body.put("wheelSize", "Test wheelSize");
        body.put("tyreSize", "Test tyreSize");
        body.put("upholsteryColour", "Test upholsteryColour");
        body.put("interiorColour", "Test interiorColour");
        body.put("featured", true);
        body.put("reserved", true);
        body.put("sold", true);
        body.putArray("features").add(" Navigation ").add("Navigation").add("Heated seats");
        var created = mvc.perform(post("/cars").header("Authorization", token(admin))
                        .contentType(APPLICATION_JSON).content(body.toString()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.features.length()").value(2))
                .andReturn().getResponse().getContentAsString();
        var result = mapper.readTree(created);
        body.fields().forEachRemaining(entry -> {
            if (entry.getKey().equals("features")) return;
            if (entry.getValue().isNumber()) {
                assertThat(result.get(entry.getKey()).decimalValue())
                        .isEqualByComparingTo(entry.getValue().decimalValue());
            } else {
                assertThat(result.get(entry.getKey())).isEqualTo(entry.getValue());
            }
        });
        String id = result.get("id").asText();
        body.put("horsepower", 200);
        body.putArray("features").add("Rear camera").add("Navigation");
        mvc.perform(put("/cars/{id}", id).header("Authorization", token(admin))
                        .contentType(APPLICATION_JSON).content(body.toString()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.horsepower").value(200))
                .andExpect(jsonPath("$.features[0]").value("Rear camera"));
        mvc.perform(get("/cars/{id}", id)).andExpect(status().isOk())
                .andExpect(jsonPath("$.features[1]").value("Navigation"))
                .andExpect(jsonPath("$.numberOfSeats").value(5));
        body.putArray("features");
        mvc.perform(put("/cars/{id}", id).header("Authorization", token(admin))
                        .contentType(APPLICATION_JSON).content(body.toString()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.features").isEmpty());
        assertThat(jdbc.queryForObject("SELECT count(*) FROM car_features WHERE car_id = ?",
                Long.class, UUID.fromString(id))).isZero();
    }

    @Test
    void invalidSpecificationsReturnBadRequestAndCustomersCannotSetListingFlags() throws Exception {
        for (String invalid : List.of("\"numberOfSeats\":0", "\"vin\":\"123456789012345678\"",
                "\"batteryCapacityKwh\":-1", "\"features\":[\" \"]")) {
            mvc.perform(post("/cars").header("Authorization", token(owner)).contentType(APPLICATION_JSON)
                            .content("{\"brand\":\"Volvo\",\"model\":\"EX30\"," + invalid + "}"))
                    .andExpect(status().isBadRequest());
        }
        String result = mvc.perform(post("/cars").header("Authorization", token(owner))
                        .contentType(APPLICATION_JSON).content("""
                                {"brand":"Volvo","model":"EX30","featured":true,"sold":true,"reserved":true}
                                """))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.featured").value(false))
                .andExpect(jsonPath("$.sold").value(false)).andExpect(jsonPath("$.reserved").value(false))
                .andReturn().getResponse().getContentAsString();
        mvc.perform(put("/cars/{id}", mapper.readTree(result).get("id").asText())
                        .header("Authorization", token(owner)).contentType(APPLICATION_JSON).content("""
                                {"brand":"Volvo","model":"EX30","status":"Pending_Confirmation","featured":true}
                                """))
                .andExpect(status().isForbidden());
    }

    private User user(String name, Role role) {
        return users.saveAndFlush(User.builder().email(name + "@example.test").name(name)
                .password("test-only").role(role).build());
    }

    private Car saveCar(User user, String plate, Status status) {
        return cars.saveAndFlush(Car.builder().brand("Volvo").model("XC60")
                .licensePlate(plate).status(status).user(user).build());
    }

    private String token(User user) {
        return "Bearer " + jwt.generateToken(user.getEmail(), Map.of(
                "uid", user.getId().toString(), "role", user.getRole().name(), "user", user.getName()), Duration.ofMinutes(5));
    }
}
