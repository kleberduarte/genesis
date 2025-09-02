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
    private JwtUtil jwtUtil; // ✅ injeta a classe responsável por gerar JWT

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        Usuario u = usuarioService.buscarPorUsernameESenha(usuario.getUsername(), usuario.getPassword());
        if (u != null) {
            // ✅ agora o token é um JWT real
            String token = jwtUtil.generateToken(u.getUsername());
            return ResponseEntity.ok(Map.of("token", token));
        } else {
            return ResponseEntity.status(401).body(Map.of("erro", "Credenciais inválidas"));
        }
    }
}
