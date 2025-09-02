package com.genesis.dto;

import com.genesis.entity.ItemVenda;

public class ItemVendaDTO {
    private Long id;
    private Long produtoId;          // novo campo para mapear produto
    private String nomeProduto;
    private double valorUnitario;
    private int quantidade;
    private double total;

    public static ItemVendaDTO fromEntity(ItemVenda item) {
        ItemVendaDTO dto = new ItemVendaDTO();
        dto.setId(item.getId());

        if (item.getProduto() != null) {
            dto.setProdutoId(item.getProduto().getId());
            dto.setNomeProduto(item.getProduto().getNome());
        } else {
            dto.setProdutoId(null);
            dto.setNomeProduto("Produto removido");
        }

        dto.setValorUnitario(item.getValorUnitario());
        dto.setQuantidade(item.getQuantidade());
        dto.setTotal(item.getTotal());
        return dto;
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(Long produtoId) {
        this.produtoId = produtoId;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public double getValorUnitario() {
        return valorUnitario;
    }

    public void setValorUnitario(double valorUnitario) {
        this.valorUnitario = valorUnitario;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
