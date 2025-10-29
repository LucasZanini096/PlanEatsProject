package planEatsBackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import planEatsBackend.dto.ReceitaRequestDto;
import planEatsBackend.dto.ReceitaResponseDto;
import planEatsBackend.entities.Geladeira;
import planEatsBackend.entities.Ingrediente;
import planEatsBackend.entities.Receita;
import planEatsBackend.entities.Usuario;
import planEatsBackend.repository.GeladeiraRepository;
import planEatsBackend.repository.ReceitaRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReceitaService {

    @Autowired
    private ReceitaRepository receitaRepository;

    @Autowired
    private GeladeiraRepository geladeiraRepository;

    @Autowired
    private GeminiService geminiService;

    public ReceitaResponseDto gerarReceita(Usuario usuario, ReceitaRequestDto request) {
        // Buscar ingredientes (entidades) pela geladeira
        List<Ingrediente> ingredientes = request.getIngredientesIds().stream()
            .map(id -> geladeiraRepository.findById(id)
                .map(Geladeira::getIngrediente)
                .orElseThrow(() -> new RuntimeException("Ingrediente não encontrado")))
            .collect(Collectors.toList());

        // Extrair nomes para o prompt do Gemini
        List<String> nomesIngredientes = ingredientes.stream()
            .map(Ingrediente::getNome)
            .collect(Collectors.toList());

        // Gerar receita com Gemini
        JsonNode receitaJson = geminiService.gerarReceita(nomesIngredientes, request.getComentario());

        // Criar entidade Receita
        Receita receita = new Receita();
        receita.setUsuario(usuario);
        receita.setNome(receitaJson.get("nome").asText());
        receita.setDescricao(receitaJson.get("descricao").asText());
        receita.setModoPreparo(receitaJson.get("modoPreparo").asText());
        
        // Associar os ingredientes reais (entidades)
        receita.setIngredientes(ingredientes);
        
        receita.setTempoPreparo(receitaJson.get("tempoPreparo").asInt());
        receita.setCustoAproximado(receitaJson.get("custoAproximado").asDouble());

        // Salvar receita
        Receita salva = receitaRepository.save(receita);

        return converterParaDto(salva);
    }

    public List<ReceitaResponseDto> listarReceitasDoUsuario(Usuario usuario) {
        return receitaRepository.findByUsuarioId(usuario.getId())
            .stream()
            .map(this::converterParaDto)
            .collect(Collectors.toList());
    }

    public ReceitaResponseDto buscarPorId(Long id, Usuario usuario) {
        Receita receita = receitaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Receita não encontrada"));
        
        if (!receita.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("Acesso negado");
        }

        return converterParaDto(receita);
    }

    public void deletarReceita(Long id, Usuario usuario) {
        Receita receita = receitaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Receita não encontrada"));
        
        if (!receita.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("Acesso negado");
        }

        receitaRepository.delete(receita);
    }

    private ReceitaResponseDto converterParaDto(Receita receita) {
        ReceitaResponseDto dto = new ReceitaResponseDto();
        dto.setId(receita.getId());
        dto.setNome(receita.getNome());
        dto.setDescricao(receita.getDescricao());
        dto.setModoPreparo(receita.getModoPreparo());
        
        // Converter ingredientes (entidades) para nomes (strings)
        List<String> nomesIngredientes = receita.getIngredientes().stream()
            .map(Ingrediente::getNome)
            .collect(Collectors.toList());
        dto.setIngredientes(nomesIngredientes);
        
        dto.setTempoPreparo(receita.getTempoPreparo());
        dto.setCustoAproximado(receita.getCustoAproximado());
        dto.setUrlImagem(receita.getUrlImagem());
        dto.setDataCriacao(receita.getDataCriacao());
        return dto;
    }
}