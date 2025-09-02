package com.genesis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.genesis.entity.Usuario;
import com.genesis.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repo;

    public Usuario salvar(Usuario usuario) {
        return repo.save(usuario);
    }

    public Usuario buscarPorUsernameESenha(String username, String password) {
        return repo.findByUsernameAndPassword(username, password);
    }
}
