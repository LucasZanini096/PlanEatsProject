package planEatsBackend.dto;
import jakarta.validation.constraints.*;

public class LoginRequest {
  @Email @NotBlank
  private String email; 
  @NotBlank
  private String senha;
}
