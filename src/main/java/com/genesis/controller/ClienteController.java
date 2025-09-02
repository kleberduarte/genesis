package com.genesis.controller;

import com.genesis.dto.ClienteDTO;
import com.genesis.entity.Cliente;
import com.genesis.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping
    public Cliente cadastrar(@RequestBody ClienteDTO dto) {
        return clienteService.salvar(dto);
    }

    @GetMapping
    public List<Cliente> listar() {
        return clienteService.listarTodos();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizar(@PathVariable Long id, @RequestBody ClienteDTO dto) {
        Cliente cliente = clienteService.atualizar(id, dto);
        return ResponseEntity.ok(cliente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        clienteService.excluir(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Long id) {
        Cliente cliente = clienteService.buscarPorId(id);
        return ResponseEntity.ok(cliente);
    }

    // 🔍 Endpoint flexível para busca por nome e/ou cep
    @GetMapping("/buscar")
    public List<Cliente> buscarPorFiltros(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cep
    ) {
        return clienteService.buscarPorFiltros(nome, cep);
    }
}