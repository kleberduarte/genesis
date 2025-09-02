package com.genesis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.genesis.entity.Venda;

public interface VendaRepository extends JpaRepository<Venda, Long> {
}
