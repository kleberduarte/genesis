package com.genesis.entity;

import javax.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigo;  // Código único, gerado automaticamente se não passado

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private Double preco;

    @Column(length = 500)
    private String descricao;

    @Column(nullable = false)
    private Integer estoque;

    @Column(length = 100)
    private String categoria;

    private boolean kit;

    // Gera código único antes de persistir no banco se não existir
    @PrePersist
    public void gerarCodigoSeNaoExistir() {
        if (this.codigo == null || this.codigo.trim().isEmpty()) {
            this.codigo = "PROD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }
}
