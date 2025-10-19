package planEatsBackend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "geladeira")
public class Geladeira {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "usuario_id", nullable = false)
  private Usuario usuario;

  @ManyToOne
  @JoinColumn(name = "ingrediente_id", nullable = false)
  private Ingrediente ingrediente;

  @Column
  private Integer quantidade;

  // Construtores
  public Geladeira() {}

  public Geladeira(Usuario usuario, Ingrediente ingrediente, Integer quantidade) {
    this.usuario = usuario;
    this.ingrediente = ingrediente;
    this.quantidade = quantidade;
  }

  // Getters e Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Usuario getUsuario() {
    return usuario;
  }

  public void setUsuario(Usuario usuario) {
    this.usuario = usuario;
  }

  public Ingrediente getIngrediente() {
    return ingrediente;
  }

  public void setIngrediente(Ingrediente ingrediente) {
    this.ingrediente = ingrediente;
  }

  public Integer getQuantidade() {
    return quantidade;
  }

  public void setQuantidade(Integer quantidade) {
    this.quantidade = quantidade;
  }
}