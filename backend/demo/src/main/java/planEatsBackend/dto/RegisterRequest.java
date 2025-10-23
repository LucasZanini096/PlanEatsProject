package planEatsBackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import planEatsBackend.entities.Role;

public class RegisterRequest {
  @NotBlank
  private String nome;

  @Email @NotBlank
  private String email;

  @NotBlank
  private String senha;

  private String preferenciasAlimentares; // JSON string

  @NotNull
  private Role role = Role.USER;

  // Teste chave de admin com 6 caracteres
  @Size(min = 6)
  private String adminKey; 

  // Getters and Setters
  // TODO: Praticas de seguranca
  public String getNome() {
    return nome;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getSenha() {
    return senha;
  }

  public void setSenha(String senha) {
    this.senha = senha;
  }

  public String getPreferenciasAlimentares() {
    return preferenciasAlimentares;
  }

  public void setPreferenciasAlimentares(String preferenciasAlimentares) {
    this.preferenciasAlimentares = preferenciasAlimentares;
  }

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public String getAdminKey() {
    return adminKey;
  }

  public void setAdminKey(String adminKey) {
    this.adminKey = adminKey;
  }

}
