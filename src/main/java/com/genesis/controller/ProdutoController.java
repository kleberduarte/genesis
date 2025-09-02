package com.genesis.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.genesis.dto.ProdutoDTO;
import com.genesis.entity.Produto;
import com.genesis.service.ProdutoService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    // 🔍 Busca unificada por código ou nome
    @GetMapping("/buscar")
    public ResponseEntity<List<Produto>> buscarPorCodigoOuNome(@RequestParam String busca) {
        if (busca == null || busca.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        busca = busca.trim();

        try {
            if (busca.matches("\\d+")) {
                // Apenas dígitos: buscar por código
                Optional<Produto> produto = produtoService.buscarPorCodigo(busca);
                return produto.map(p -> ResponseEntity.ok(List.of(p)))
                        .orElse(ResponseEntity.notFound().build());
            } else {
                // Buscar por nome (parcial, case-insensitive)
                List<Produto> produtos = produtoService.buscarPorNome(busca);
                if (produtos.isEmpty()) {
                    return ResponseEntity.notFound().build();
                }
                return ResponseEntity.ok(produtos);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // 📦 Listar todos os produtos
    @GetMapping
    public List<Produto> listar() {
        return produtoService.listarTodos();
    }

    // ➕ Cadastrar novo produto
    @PostMapping
    public ResponseEntity<Produto> cadastrar(@RequestBody Produto p) {
        Produto salvo = produtoService.salvar(p);
        return ResponseEntity.ok(salvo);
    }

    // 🔎 Buscar produto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        Optional<Produto> produto = produtoService.listarTodos().stream()
                .filter(p -> p.getId().equals(id))
                .findFirst();
        return produto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 📁 Buscar por categoria
    @GetMapping("/categoria")
    public List<Produto> buscarPorCategoria(@RequestParam String categoria) {
        return produtoService.buscarPorCategoria(categoria);
    }

    // 🎯 Listar produtos que são kits
    @GetMapping("/kits")
    public List<Produto> listarKits() {
        return produtoService.listarKits();
    }

    // 🔄 Atualizar estoque
    @PutMapping("/{id}/estoque")
    public ResponseEntity<Produto> atualizarEstoque(@PathVariable Long id, @RequestBody Integer novoEstoque) {
        try {
            Produto atualizado = produtoService.atualizarEstoque(id, novoEstoque);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 🗑️ Excluir produto por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        Optional<Produto> produto = produtoService.listarTodos().stream()
                .filter(p -> p.getId().equals(id))
                .findFirst();

        if (produto.isPresent()) {
            produtoService.excluir(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ✏️ Atualizar produto (via DTO)
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestBody ProdutoDTO dto) {
        try {
            Produto atualizado = produtoService.atualizarProduto(id, dto);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
