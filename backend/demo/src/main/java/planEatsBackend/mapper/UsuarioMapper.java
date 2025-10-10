package planEatsBackend.mapper;

import planEatsBackend.dto.UsuarioDto;
import planEatsBackend.entities.Usuario;

public class UsuarioMapper {
    public static UsuarioDto toDto(Usuario user) {
        if (user == null) return null;
        UsuarioDto userDto = new UsuarioDto();
        userDto.setId(user.getId());
        userDto.setNome(user.getNome());
        userDto.setEmail(user.getEmail());
        userDto.setPreferenciasAlimentares(user.getPreferenciasAlimentares());
        userDto.setRole(user.getRole());
        return userDto;
    }

    public static Usuario fromRegisterRequest(planEatsBackend.dto.RegisterRequest r, String senhaHash) {
        Usuario user = new Usuario();
        user.setNome(r.getNome());
        user.setEmail(r.getEmail());
        user.setSenhaHash(senhaHash);
        user.setPreferenciasAlimentares(r.getPreferenciasAlimentares());
        user.setRole(r.getRole() != null ? r.getRole() : planEatsBackend.entities.Role.USER);
        return user;
    }
}
