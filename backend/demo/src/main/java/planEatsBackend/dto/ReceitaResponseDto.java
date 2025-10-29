package planEatsBackend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ReceitaResponseDto {
    private Long id;
    private String nome;
    private String descricao;
    private String modoPreparo;
    private List<String> ingredientes;
    private Integer tempoPreparo;
    private Double custoAproximado;
    private String urlImagem;
    private LocalDateTime dataCriacao;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getModoPreparo() { return modoPreparo; }
    public void setModoPreparo(String modoPreparo) { this.modoPreparo = modoPreparo; }

    public List<String> getIngredientes() { return ingredientes; }
    public void setIngredientes(List<String> ingredientes) { this.ingredientes = ingredientes; }

    public Integer getTempoPreparo() { return tempoPreparo; }
    public void setTempoPreparo(Integer tempoPreparo) { this.tempoPreparo = tempoPreparo; }

    public Double getCustoAproximado() { return custoAproximado; }
    public void setCustoAproximado(Double custoAproximado) { this.custoAproximado = custoAproximado; }

    public String getUrlImagem() { return urlImagem; }
    public void setUrlImagem(String urlImagem) { this.urlImagem = urlImagem; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}