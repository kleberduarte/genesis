package com.genesis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.genesis.entity.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

	boolean existsByNomeAndCargo(String nome, String cargo);}
