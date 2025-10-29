package planEatsBackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

@RestController
@RequestMapping("/api/gemini")
public class GeminiController {

    @GetMapping("/generate")
    public ResponseEntity<String> gerarTextoComGemini() {
        // Configurar o cliente Gemini
        Client client = Client.builder()
                .apiKey("AIzaSyDP5eZIt5qSZBKiuACOUxoCDEgNTaiSIp0")
                .build();

        GenerateContentResponse response =
        client.models.generateContent(
            "gemini-2.5-flash",
            "Explain how AI works",
            null);

        // Retornar a resposta gerada
        return ResponseEntity.ok(response.text());
    }

    
  
}
