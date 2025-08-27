// vendas.js

import { authenticatedHeaders } from "./auth.js";  // Autenticação com token
import { showAlert } from "./ui.js";               // Alerta na UI

const API_URL = "http://localhost:8080";           // Backend API URL

// Função principal que inicializa a lógica da tela de vendas
export function inicializarVendaAvancada() {
  const itensVenda = [];  // Armazena os itens da venda
  let totalVenda = 0;     // Soma total da venda

  const totalVendaSpan = document.getElementById("totalVenda");

  // Verifica se o elemento #totalVenda existe no DOM
  if (!totalVendaSpan) {
    console.warn("⚠️ Elemento #totalVenda não encontrado. VendaAvancada não será inicializada.");
    return;
  }

  console.log("✅ inicializarVendaAvancada() iniciada");

  // 🔄 Evento: carregar dados do produto ao selecionar o código
  document.getElementById("produtoId")?.addEventListener("change", async function () {
    const codigo = this.value;  // Código inserido no campo

    console.log("🔍 Produto selecionado:", codigo);

    try {
      const res = await fetch(`${API_URL}/api/produtos/buscar?busca=${encodeURIComponent(codigo)}`, {
        headers: authenticatedHeaders(),
      });

      if (!res.ok) throw new Error("Produto não encontrado");

      const data = await res.json();
      const p = Array.isArray(data) ? data[0] : data; // Se for um array, pega o primeiro item

      if (!p || !p.preco) throw new Error("Produto inválido");

      // Preenche os campos com os dados do produto
      document.getElementById("vendaNome").value = p.nome;
      document.getElementById("vendaPreco").value = p.preco.toFixed(2);
      document.getElementById("vendaDescricao").value = p.descricao;
      document.getElementById("vendaCategoria").value = p.categoria;
      document.getElementById("vendaKit").value = p.kit ? "Sim" : "Não";

      // Armazenando o ID do produto para usar ao finalizar a venda
      document.getElementById("produtoId").dataset.produtoId = p.id;  // ID do produto armazenado
    } catch (error) {
      showAlert("Produto não encontrado", "warning");
      console.error("❌ Erro ao buscar produto:", error);
    }
  });

  // 🧮 Evento: atualizar total do item quando a quantidade muda
  document.getElementById("quantidade")?.addEventListener("input", function () {
    const qtd = parseInt(this.value) || 0;
    const preco = parseFloat(document.getElementById("vendaPreco").value.replace(",", ".")) || 0;
    document.getElementById("totalItem").value = (qtd * preco).toFixed(2);
  });

  // 🧮 Evento: recalcular total quando o valor unitário for alterado manualmente
  document.getElementById("vendaPreco")?.addEventListener("input", function () {
    const preco = parseFloat(this.value.replace(",", ".")) || 0;
    const qtd = parseInt(document.getElementById("quantidade").value) || 0;
    document.getElementById("totalItem").value = (qtd * preco).toFixed(2);
  });

  // ➕ Evento: adicionar item à venda
  document.getElementById("formVenda")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const produtoId = document.getElementById("produtoId").dataset.produtoId; // Usando o ID do produto
    const nome = document.getElementById("vendaNome").value;
    const preco = parseFloat(document.getElementById("vendaPreco").value.replace(",", "."));
    const qtd = parseInt(document.getElementById("quantidade").value);
    const total = qtd * preco;

    console.log("🧾 Adicionando item:", { produtoId, nome, preco, qtd, total });

    if (!produtoId || !qtd || !preco) {
      return showAlert("Preencha todos os campos corretamente.", "warning");
    }

    itensVenda.push({ produtoId, quantidade: qtd });

    document.getElementById("tabelaItens").innerHTML += `
      <tr>
        <td>${nome}</td>
        <td>${qtd}</td>
        <td>R$ ${preco.toFixed(2)}</td>
        <td>R$ ${total.toFixed(2)}</td>
      </tr>
    `;

    // Atualiza o total geral da venda
    totalVenda += total;
    totalVendaSpan.innerText = totalVenda.toFixed(2);
    console.log("💰 Total atualizado:", totalVenda.toFixed(2));

    // Limpa o formulário e os campos de exibição
    this.reset();
    ["vendaNome", "vendaPreco", "vendaDescricao", "vendaCategoria", "vendaKit", "totalItem"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  });

  // ✅ Evento: finalizar venda
  document.getElementById("finalizarVenda")?.addEventListener("click", async function () {
    console.log("🛒 Botão 'Finalizar Venda' clicado");

    if (!itensVenda.length) {
      return showAlert("Adicione pelo menos um item antes de finalizar.", "warning");
    }

    try {
      // Enviando o ID do produto (não o código) para registrar a venda
      const res = await fetch(`${API_URL}/api/vendas`, {
        method: "POST",
        headers: {
          ...authenticatedHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          itens: itensVenda.map(item => {
            return {
              produtoId: item.produtoId,  // Usando o ID do produto aqui
              quantidade: item.quantidade
            };
          })
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao registrar venda.");
      }

      showAlert(`Venda registrada com sucesso! Total: R$ ${totalVenda.toFixed(2)}`, "success");
      console.log("✅ Venda registrada:", itensVenda);

      // Reset total e interface
      totalVenda = 0;
      totalVendaSpan.innerText = "0.00";

      // Recarrega a página após 5 segundos
      setTimeout(() => {
        location.reload();
      }, 5000);

    } catch (error) {
      console.error("❌ Erro ao finalizar venda:", error);
      showAlert(error.message, "danger");

      // Limpa a interface mesmo com erro
      totalVenda = 0;
      totalVendaSpan.innerText = "0.00";
      document.getElementById("formVenda").reset();
      ["vendaNome", "vendaPreco", "vendaDescricao", "vendaCategoria", "vendaKit", "totalItem"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
      document.getElementById("tabelaItens").innerHTML = "";
      itensVenda.length = 0;
    }
  });
}