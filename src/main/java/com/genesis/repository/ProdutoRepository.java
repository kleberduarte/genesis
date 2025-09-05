package com.genesis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.genesis.entity.Produto;

import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // Busca produtos pelo nome (ignora case e faz busca parcial)
    List<Produto> findByNomeContainingIgnoreCase(String nome);

    // Busca produtos pela categoria exata
    List<Produto> findByCategoria(String categoria);

    // Busca produtos onde kit == true
    List<Produto> findByKitTrue();

    // Busca produto pelo código exato
    Optional<Produto> findByCodigo(String codigo);

    // Verifica se o produto já foi usado em alguma venda
    @Query("SELECT COUNT(iv) > 0 FROM ItemVenda iv WHERE iv.produto.id = :produtoId")
    boolean existsProdutoVendido(@Param("produtoId") Long produtoId);

    // Busca todas as categorias distintas cadastradas
    @Query("SELECT DISTINCT p.categoria FROM Produto p WHERE p.categoria IS NOT NULL AND p.categoria <> ''")
    List<String> findDistinctCategorias();
}