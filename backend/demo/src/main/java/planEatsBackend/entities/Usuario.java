package planEatsBackend.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
// Conflito com role solucionado: mudou de "role" para "user_type" para evitar conflito com o campo role da entidade
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("USER")
public class Usuario {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String nome;

  @Column(unique = true, nullable = false)
  private String email;

  @Column(nullable = false)
  private String senhaHash;

  // Preferencias alimentares que virarao JSON
  @Column(columnDefinition = "TEXT")
  private String preferenciasAlimentares;

  @Enumerated
  @Column(nullable = false)
  private Role role = Role.USER;

  @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
  private List<Geladeira> geladeira;


  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

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

  public String getSenhaHash() {
    return senhaHash;
  }

  public void setSenhaHash(String senhaHash) {
    this.senhaHash = senhaHash;
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


  public List<Geladeira> getGeladeira() {
    return geladeira;
  }

  public void setGeladeira(List<Geladeira> geladeira) {
    this.geladeira = geladeira;
  }

}
