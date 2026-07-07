package Gloyoo.AutoAnders.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ProblemDetail> handleMaxUploadSize(MaxUploadSizeExceededException exception) {
        return problem(
                HttpStatus.PAYLOAD_TOO_LARGE,
                "Image upload is too large",
                "One or more selected images are too large. Please remove the large image or upload a smaller file."
        );
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ProblemDetail> handleMultipart(MultipartException exception) {
        return problem(
                HttpStatus.BAD_REQUEST,
                "Image upload failed",
                rootMessage(exception, "The selected image could not be uploaded.")
        );
    }

    @ExceptionHandler(RestClientResponseException.class)
    public ResponseEntity<ProblemDetail> handleRestClient(RestClientResponseException exception) {
        HttpStatus status = HttpStatus.resolve(exception.getStatusCode().value());
        if (status == null) {
            status = HttpStatus.BAD_GATEWAY;
        }

        String detail = exception.getStatusCode().value() == 413
                ? "One or more selected images are too large for storage. Please upload a smaller file."
                : "Storage rejected the image upload: " + safeMessage(exception.getResponseBodyAsString(), exception.getMessage());

        return problem(status, "Image storage failed", detail);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ProblemDetail> handleUnreadableMessage(HttpMessageNotReadableException exception) {
        return problem(
                HttpStatus.BAD_REQUEST,
                "Request body is invalid",
                rootMessage(exception, "The submitted data could not be read.")
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleValidation(MethodArgumentNotValidException exception) {
        String detail = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("The submitted data is invalid.");

        return problem(HttpStatus.BAD_REQUEST, "Validation failed", detail);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ProblemDetail> handleResponseStatus(ResponseStatusException exception) {
        HttpStatus status = HttpStatus.resolve(exception.getStatusCode().value());
        if (status == null) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return problem(status, status.getReasonPhrase(), exception.getReason());
    }

    private ResponseEntity<ProblemDetail> problem(HttpStatus status, String title, String detail) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setTitle(title);
        return ResponseEntity.status(status).body(problem);
    }

    private String rootMessage(Throwable throwable, String fallback) {
        Throwable current = throwable;
        while (current.getCause() != null) {
            current = current.getCause();
        }

        return safeMessage(current.getMessage(), fallback);
    }

    private String safeMessage(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }

        return value.length() > 500 ? value.substring(0, 500) : value;
    }
}
