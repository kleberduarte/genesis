package com.genesis.genesis.dto;

import lombok.Data;

@Data
public class ProdutoDTO {
    private Long id;
    private String codigo;   // Importante para exibir e manipular o código gerado
    private String nome;
    private Double preco;
    private String descricao;
    private Integer estoque;
    private String categoria;
    private Boolean kit;
}
