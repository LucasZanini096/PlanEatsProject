package planEatsBackend.mapper;

import planEatsBackend.dto.RegisterRequest;
import planEatsBackend.dto.UsuarioDto;
import planEatsBackend.entities.Admin;
import planEatsBackend.entities.Role;
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

    public static Usuario fromRegisterRequest(RegisterRequest r, String senhaHash) {
        if (r.getRole() == Role.ADMIN) {
            Admin admin = new Admin();
            admin.setNome(r.getNome());
            admin.setEmail(r.getEmail());
            admin.setPreferenciasAlimentares(r.getPreferenciasAlimentares());
            admin.setSenhaHash(senhaHash);
            admin.setRole(Role.ADMIN);
            // adminKeyHash deve ser setado no service (para usar passwordEncoder)
            return admin;
        } else {
            Usuario user = new Usuario();
            user.setNome(r.getNome());
            user.setEmail(r.getEmail());
            user.setPreferenciasAlimentares(r.getPreferenciasAlimentares());
            user.setSenhaHash(senhaHash);
            user.setRole(Role.USER);
            return user;
        }
    }
}
