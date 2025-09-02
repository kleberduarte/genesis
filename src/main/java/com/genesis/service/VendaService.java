package com.genesis.service;

import com.genesis.entity.ItemVenda;
import com.genesis.entity.Produto;
import com.genesis.entity.Venda;
import com.genesis.exception.RecursoNaoEncontradoException;
import com.genesis.exception.ValidacaoException;
import com.genesis.repository.ProdutoRepository;
import com.genesis.repository.VendaRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VendaService {

    private final VendaRepository vendaRepo;
    private final ProdutoRepository produtoRepo;

    /**
     * Registra uma nova venda.
     * Valida o estoque, calcula o total e atualiza o estoque dos produtos.
     * O método é transacional para garantir atomicidade.
     *
     * @param venda Objeto Venda com itens e quantidades.
     * @return Venda salva com id e data.
     */
    @Transactional
    public Venda registrarVenda(Venda venda) {
        if (venda == null || venda.getItens() == null || venda.getItens().isEmpty()) {
            throw new ValidacaoException("A venda deve conter ao menos um item.");
        }

        double totalVenda = 0.0;

        for (ItemVenda item : venda.getItens()) {

            if (item.getProduto() == null || item.getProduto().getId() == null) {
                throw new ValidacaoException("Produto inválido no item da venda.");
            }

            Produto produto = produtoRepo.findById(item.getProduto().getId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException(
                            "Produto não encontrado: ID " + item.getProduto().getId()
                    ));

            Integer estoqueAtual = produto.getEstoque();
            Integer quantidade = item.getQuantidade();
            Double precoUnitario = produto.getPreco();

            if (estoqueAtual == null || quantidade == null || precoUnitario == null) {
                throw new ValidacaoException("Produto com dados incompletos: estoque, quantidade ou preço nulo.");
            }

            if (quantidade <= 0) {
                throw new ValidacaoException("Quantidade inválida para o produto: " + produto.getNome());
            }

            if (estoqueAtual < quantidade) {
                throw new ValidacaoException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            double totalItem = precoUnitario * quantidade;

            // Atualiza item
            item.setProduto(produto);
            item.setVenda(venda);
            item.setValorUnitario(precoUnitario);
            item.setTotal(totalItem);

            // Atualiza estoque do produto
            produto.setEstoque(estoqueAtual - quantidade);
            produtoRepo.save(produto);

            totalVenda += totalItem;
        }

        venda.setTotal(totalVenda);
        venda.setDataVenda(LocalDateTime.now());

        return vendaRepo.save(venda);
    }

    /**
     * Retorna todas as vendas registradas no banco.
     *
     * @return Lista de vendas.
     */
    public List<Venda> listarVendas() {
        return vendaRepo.findAll();
    }
}
