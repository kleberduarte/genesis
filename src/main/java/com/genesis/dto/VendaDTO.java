package com.genesis.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.genesis.entity.Venda;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class VendaDTO {
    private Long id;
    private LocalDateTime dataVenda;
    private double total;
    private List<ItemVendaDTO> itens;

    // Conversor da entidade para o DTO
    public static VendaDTO fromEntity(Venda venda) {
        VendaDTO dto = new VendaDTO();
        dto.setId(venda.getId());
        dto.setDataVenda(venda.getDataVenda());
        dto.setTotal(venda.getTotal());
        dto.setItens(venda.getItens().stream()
                .map(ItemVendaDTO::fromEntity)
                .collect(Collectors.toList()));
        return dto;
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataVenda() {
        return dataVenda;
    }

    public void setDataVenda(LocalDateTime dataVenda) {
        this.dataVenda = dataVenda;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public List<ItemVendaDTO> getItens() {
        return itens;
    }

    public void setItens(List<ItemVendaDTO> itens) {
        this.itens = itens;
    }

    @JsonIgnore
    public String getNome() {
        return "";
    }
}
