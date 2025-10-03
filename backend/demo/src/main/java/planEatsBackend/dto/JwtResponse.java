package planEatsBackend.dto;

import planEatsBackend.entities.Role;

public class JwtResponse {
  private String token;
  private String type = "Bearer";
  private Long id;
  private String nome;
  private String email;
  private Role role;

  public JwtResponse(String accessToken, Long id, String nome, String email, Role role) {
    this.token = accessToken;
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.role = role;
  }

  public String getAccessToken() {
    return token;
  }

  public String getType() {
    return type;
  }

  public Long getId() {
    return id;
  }
  
  public String getEmail() {
    return email;
  }

  public String getNome() {
    return nome;
  }

  public Role getRole() {
    return role;
  }

}
