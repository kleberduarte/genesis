package com.genesis.genesis.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.genesis.genesis.entity.Funcionario;
import com.genesis.genesis.repository.FuncionarioRepository;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository repo;

    public Funcionario salvar(Funcionario f) {
        return repo.save(f);
    }

    public List<Funcionario> listarTodos() {
        return repo.findAll();
    }
}