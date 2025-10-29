package planEatsBackend.dto;

import java.util.List;

public class ReceitaRequestDto {
    private List<Long> ingredientesIds;
    private String comentario;

    public List<Long> getIngredientesIds() { return ingredientesIds; }
    public void setIngredientesIds(List<Long> ingredientesIds) { this.ingredientesIds = ingredientesIds; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
}