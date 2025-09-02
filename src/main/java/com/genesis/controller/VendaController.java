package com.genesis.controller;

import com.genesis.dto.ItemVendaDTO;
import com.genesis.dto.VendaDTO;

import com.genesis.entity.ItemVenda;
import com.genesis.entity.Produto;
import com.genesis.entity.Venda;
import com.genesis.exception.RecursoNaoEncontradoException;
import com.genesis.exception.ValidacaoException;
import com.genesis.repository.ProdutoRepository;
import com.genesis.repository.VendaRepository;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {

    @Autowired
    private VendaRepository vendaRepo;

    @Autowired
    private ProdutoRepository produtoRepo;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public VendaDTO registrar(@Valid @RequestBody VendaDTO vendaRequest) {
        List<ItemVendaDTO> itensRequest = vendaRequest.getItens();

        if (itensRequest == null || itensRequest.isEmpty()) {
            throw new ValidacaoException("A venda deve conter ao menos um item.");
        }

        Venda venda = new Venda();
        List<ItemVenda> itensVenda = new ArrayList<>();
        double totalVenda = 0;

        for (ItemVendaDTO itemReq : itensRequest) {
            Produto produto = produtoRepo.findById(itemReq.getProdutoId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado: ID " + itemReq.getProdutoId()));

            if (produto.getEstoque() < itemReq.getQuantidade()) {
                throw new ValidacaoException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            ItemVenda itemVenda = new ItemVenda();
            itemVenda.setProduto(produto);
            itemVenda.setQuantidade(itemReq.getQuantidade());
            itemVenda.setValorUnitario(produto.getPreco());
            double totalItem = produto.getPreco() * itemReq.getQuantidade();
            itemVenda.setTotal(totalItem);
            itemVenda.setVenda(venda);

            // Atualiza estoque
            produto.setEstoque(produto.getEstoque() - itemReq.getQuantidade());
            produtoRepo.save(produto);

            itensVenda.add(itemVenda);
            totalVenda += totalItem;
        }

        venda.setItens(itensVenda);
        venda.setTotal(totalVenda);
        venda.setDataVenda(LocalDateTime.now());

        Venda vendaSalva = vendaRepo.save(venda);

        return VendaDTO.fromEntity(vendaSalva);
    }

    // Método POST de teste que cria uma venda fixa com produto ID 1 e quantidade 1
    @PostMapping("/teste")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public VendaDTO vendaTeste() {
        Long produtoIdTeste = 1L;
        Produto produto = produtoRepo.findById(produtoIdTeste)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto teste não encontrado: ID " + produtoIdTeste));

        if (produto.getEstoque() < 1) {
            throw new ValidacaoException("Estoque insuficiente para o produto de teste: " + produto.getNome());
        }

        Venda venda = new Venda();
        List<ItemVenda> itensVenda = new ArrayList<>();

        ItemVenda itemVenda = new ItemVenda();
        itemVenda.setProduto(produto);
        itemVenda.setQuantidade(1);
        itemVenda.setValorUnitario(produto.getPreco());
        itemVenda.setTotal(produto.getPreco() * 1);
        itemVenda.setVenda(venda);

        // Atualiza estoque
        produto.setEstoque(produto.getEstoque() - 1);
        produtoRepo.save(produto);

        itensVenda.add(itemVenda);

        venda.setItens(itensVenda);
        venda.setTotal(produto.getPreco());
        venda.setDataVenda(LocalDateTime.now());

        Venda vendaSalva = vendaRepo.save(venda);

        return VendaDTO.fromEntity(vendaSalva);
    }

    @GetMapping
    public List<VendaDTO> listar() {
        return vendaRepo.findAll().stream()
                .map(VendaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/teste")
    public String teste() {
        return "API vendas funcionando";
    }
}
