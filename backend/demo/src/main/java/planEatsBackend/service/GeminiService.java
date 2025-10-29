package planEatsBackend.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public JsonNode gerarReceita(List<String> ingredientes, String comentario) {
        Client client = Client.builder()
                .apiKey(apiKey)
                .build();

        String prompt = construirPrompt(ingredientes, comentario);

        GenerateContentResponse response = client.models.generateContent(
            "gemini-2.5-flash",
            prompt,
            null
        );

        try {
            String responseText = response.text();
            
            // Limpar a resposta removendo backticks de markdown
            String cleanedJson = limparRespostaGemini(responseText);
            
            // Parse a resposta JSON limpa
            return objectMapper.readTree(cleanedJson);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar resposta do Gemini: " + e.getMessage(), e);
        }
    }

    private String limparRespostaGemini(String response) {
        // Remove backticks de markdown (```json ... ``` ou ``` ... ```)
        String cleaned = response.trim();
        
        // Remove ```json no início
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        
        // Remove ``` no final
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        
        return cleaned.trim();
    }

    private String construirPrompt(List<String> ingredientes, String comentario) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Você é um chef especializado. Crie uma receita completa em formato JSON com os seguintes campos:\n\n");
        prompt.append("{\n");
        prompt.append("  \"nome\": \"Nome criativo da receita\",\n");
        prompt.append("  \"descricao\": \"Descrição breve e apetitosa da receita (2-3 frases)\",\n");
        prompt.append("  \"modoPreparo\": \"Passo a passo detalhado numerado\",\n");
        prompt.append("  \"ingredientes\": [\"lista de ingredientes com quantidades\"],\n");
        prompt.append("  \"tempoPreparo\": número_em_minutos,\n");
        prompt.append("  \"custoAproximado\": valor_em_reais\n");
        prompt.append("}\n\n");
        prompt.append("Ingredientes disponíveis: ").append(String.join(", ", ingredientes)).append("\n");
        
        if (comentario != null && !comentario.isEmpty()) {
            prompt.append("Preferências do usuário: ").append(comentario).append("\n");
        }
        
        prompt.append("\nRETORNE APENAS O JSON PURO, SEM markdown, SEM backticks, SEM texto adicional antes ou depois.");
        
        return prompt.toString();
    }
}