package com.genesis.genesis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.genesis.genesis.entity.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

	boolean existsByNomeAndCargo(String nome, String cargo);}
