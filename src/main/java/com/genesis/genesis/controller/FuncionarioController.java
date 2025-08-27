package com.genesis.genesis.controller;

import com.genesis.genesis.entity.Funcionario;
import com.genesis.genesis.entity.Usuario;
import com.genesis.genesis.repository.FuncionarioRepository;
import com.genesis.genesis.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

	@Autowired
	private FuncionarioRepository funcionarioRepository;

	@Autowired
	private UsuarioRepository usuarioRepository;

	// 🔹 LISTAR TODOS
	@GetMapping
	public ResponseEntity<List<Funcionario>> listarTodos() {
		List<Funcionario> funcionarios = funcionarioRepository.findAll();
		return ResponseEntity.ok(funcionarios);
	}

	// 🔹 BUSCAR POR ID
	@GetMapping("/{id}")
	public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
		return funcionarioRepository.findById(id)
			.map(ResponseEntity::ok)
			.orElse(ResponseEntity.notFound().build());
	}

	// 🔹 CADASTRAR FUNCIONÁRIO
	@PostMapping
	public ResponseEntity<Funcionario> cadastrar(@RequestBody Funcionario funcionario) {

		// ⬇️ Aqui é onde você insere o log para ver se o front está enviando o objeto usuario
		System.out.println("Recebido do front: funcionario.getUsuario() = " + funcionario.getUsuario());

		Usuario usuario = funcionario.getUsuario();

		// Validação do usuário (caso informado)
		if (usuario != null) {
			if (usuario.getUsername() == null || usuario.getPassword() == null) {
				return ResponseEntity.badRequest().body(null);
			}
			System.out.println("Ira salvar usuario : " + usuario);
			// Salvar o usuário antes de salvar o funcionário
			Usuario usuarioSalvo = usuarioRepository.save(usuario);
			funcionario.setUsuario(usuarioSalvo);
		}

		// Verifica duplicidade de funcionário
		boolean existeFuncionario = funcionarioRepository
			.existsByNomeAndCargo(funcionario.getNome(), funcionario.getCargo());

		if (existeFuncionario) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
		}

		// ✅ Salva o funcionário com usuário vinculado (corrigido)
			System.out.println("Ira salvar funcionario : " + funcionario);

		Funcionario funcionarioSalvo = funcionarioRepository.save(funcionario);
		return ResponseEntity.status(HttpStatus.CREATED).body(funcionarioSalvo);
	}

	// 🔹 ATUALIZAR FUNCIONÁRIO
	@PutMapping("/{id}")
	public ResponseEntity<Funcionario> atualizar(@PathVariable Long id,
		@RequestBody Funcionario funcionarioAtualizado) {

		return funcionarioRepository.findById(id).map(funcionarioExistente -> {
			funcionarioExistente.setNome(funcionarioAtualizado.getNome());
			funcionarioExistente.setCargo(funcionarioAtualizado.getCargo());
			funcionarioExistente.setUsuario(funcionarioAtualizado.getUsuario());
			return ResponseEntity.ok(funcionarioRepository.save(funcionarioExistente));
		}).orElse(ResponseEntity.notFound().build());
	}

	// 🔹 DELETAR FUNCIONÁRIO
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id) {
		return funcionarioRepository.findById(id).map(funcionario -> {
			funcionarioRepository.delete(funcionario);
			return ResponseEntity.noContent().<Void>build();
		}).orElse(ResponseEntity.notFound().build());
	}
}