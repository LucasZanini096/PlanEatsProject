package planEatsBackend.dto;

public class GeladeiraDto {
  private Long usuarioId;
  private Long ingredienteId;
  private Integer quantidade;

  public Long getUsuarioId() {
    return usuarioId;
  }

  public void setUsuarioId(Long usuarioId) {
    this.usuarioId = usuarioId;
  }

  public Long getIngredienteId() {
    return ingredienteId;
  }

  public void setIngredienteId(Long ingredienteId) {
    this.ingredienteId = ingredienteId;
  }

  public Integer getQuantidade() {
    return quantidade;
  }

  public void setQuantidade(Integer quantidade) {
    this.quantidade = quantidade;
  }
}