package com.genesis.service;

import com.genesis.dto.ClienteDTO;
import com.genesis.entity.Cliente;
import com.genesis.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public Cliente salvar(ClienteDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNome(dto.getNome());
        cliente.setTelefone(dto.getTelefone());
        cliente.setCep(dto.getCep());
        cliente.setRua(dto.getRua());
        cliente.setNumero(dto.getNumero());
        cliente.setBairro(dto.getBairro());
        cliente.setCidade(dto.getCidade());
        cliente.setEstado(dto.getEstado());
        return clienteRepository.save(cliente);
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Cliente atualizar(Long id, ClienteDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        cliente.setNome(dto.getNome());
        cliente.setTelefone(dto.getTelefone());
        cliente.setCep(dto.getCep());
        cliente.setRua(dto.getRua());
        cliente.setNumero(dto.getNumero());
        cliente.setBairro(dto.getBairro());
        cliente.setCidade(dto.getCidade());
        cliente.setEstado(dto.getEstado());

        return clienteRepository.save(cliente);
    }
    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
    }


    public void excluir(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente não encontrado");
        }
        clienteRepository.deleteById(id);
    }

    public List<Cliente> buscarPorNome(String nome) {
        return clienteRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Cliente> buscarPorCep(String cep) {
        return clienteRepository.findByCep(cep);
    }

    public List<Cliente> buscarPorNomeECep(String nome, String cep) {
        return clienteRepository.findByNomeContainingIgnoreCaseAndCep(nome, cep);
    }

    // ✅ Novo método flexível
    public List<Cliente> buscarPorFiltros(String nome, String cep) {
        if (nome != null && !nome.isEmpty() && cep != null && !cep.isEmpty()) {
            return clienteRepository.findByNomeContainingIgnoreCaseAndCep(nome, cep);
        } else if (nome != null && !nome.isEmpty()) {
            return clienteRepository.findByNomeContainingIgnoreCase(nome);
        } else if (cep != null && !cep.isEmpty()) {
            return clienteRepository.findByCep(cep);
        } else {
            return listarTodos(); // ou retornar lista vazia
        }
    }
}