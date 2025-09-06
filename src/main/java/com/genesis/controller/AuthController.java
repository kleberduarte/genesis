package com.genesis.controller;

import com.genesis.entity.Usuario;
import com.genesis.security.JwtUtil;
import com.genesis.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        // Busca o usuário no banco usando username e senha
        Usuario u = usuarioService.buscarPorUsernameESenha(usuario.getUsername(), usuario.getPassword());

        if (u != null) {
            // Gera um token JWT com base no username
            String token = jwtUtil.generateToken(u.getUsername());

            // Retorna o token + o perfil (ADMIN ou NORMAL)
            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "perfil", u.getPerfil() // Certifique-se de que o campo perfil existe na entidade
                    )
            );
        } else {
            // Credenciais inválidas
            return ResponseEntity.status(401).body(
                    Map.of("erro", "Credenciais inválidas")
            );
        }
    }
}
