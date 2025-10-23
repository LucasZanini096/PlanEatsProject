package planEatsBackend.dto;

public class IncreaseGeladeiraDto {
  private long ingredienteId;
  private int quantidade;

  public long getIngredienteId() {
    return ingredienteId;
  }

  public void setIngredienteId(long ingredienteId) {
    this.ingredienteId = ingredienteId;
  }

  public int getQuantidade() {
    return quantidade;
  }

  public void setQuantidade(int quantidade) {
    this.quantidade = quantidade;
  }
}
