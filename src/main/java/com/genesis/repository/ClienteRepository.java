package com.genesis.repository;

import com.genesis.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // 🔍 Busca por nome (case-insensitive, parcial)
    List<Cliente> findByNomeContainingIgnoreCase(String nome);

    // 🔍 Busca por CEP exato
    List<Cliente> findByCep(String cep);

    // 🔍 Busca combinada por nome parcial e CEP exato
    List<Cliente> findByNomeContainingIgnoreCaseAndCep(String nome, String cep);
}