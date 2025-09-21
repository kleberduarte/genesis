import { authenticatedHeaders } from "./auth.js";
import { showAlert } from "./ui.js";

const API_URL = "http://localhost:8080";

// Utilitários
const $ = id => document.getElementById(id);
const parseFloatSafe = val => parseFloat(val?.replace(",", ".")) || 0;
const parseIntSafe = val => parseInt(val) || 0;

// Funções auxiliares
function limparCamposVenda() {
  ["produtoId", "vendaNome", "vendaPreco", "vendaDescricao", "vendaCategoria", "vendaKit", "quantidade", "totalItem"].forEach(id => {
    const el = $(id);
    if (el) el.value = "";
    if (id === "produtoId") el.removeAttribute("data-produto-id");
  });
}

function atualizarTotalItem() {
  const preco = parseFloatSafe($("vendaPreco").value);
  const qtd = parseIntSafe($("quantidade").value);
  $("totalItem").value = (preco * qtd).toFixed(2);
}

function adicionarItemTabela({ nome, qtd, preco, total }) {
  $("tabelaItens").innerHTML += `
    <tr>
      <td>${nome}</td>
      <td>${qtd}</td>
      <td>R$ ${preco.toFixed(2)}</td>
      <td>R$ ${total.toFixed(2)}</td>
    </tr>
  `;
}

function preencherCamposProduto(p) {
  $("vendaNome").value = p.nome;
  $("vendaPreco").value = p.preco.toFixed(2);
  $("vendaDescricao").value = p.descricao;
  $("vendaCategoria").value = p.categoria;
  $("vendaKit").value = p.kit ? "Sim" : "Não";
  $("produtoId").dataset.produtoId = p.id;
}

export function inicializarVendaAvancada() {
  const totalVendaSpan = $("totalVenda");
  if (!totalVendaSpan) {
    console.warn("⚠️ Elemento #totalVenda não encontrado. VendaAvancada não será inicializada.");
    return;
  }

  console.log("✅ inicializarVendaAvancada() iniciada");

  const itensVenda = [];
  let totalVenda = 0;

  // Buscar produto ao alterar código
  $("produtoId")?.addEventListener("change", async function () {
    const codigo = this.value.trim();
    if (!codigo) return;

    try {
      const res = await fetch(`${API_URL}/api/produtos/buscar?busca=${encodeURIComponent(codigo)}`, {
        headers: authenticatedHeaders(),
      });

      if (!res.ok) throw new Error("Produto não encontrado");

      const data = await res.json();
      const p = Array.isArray(data) ? data[0] : data;

      if (!p || !p.preco) throw new Error("Produto inválido");

      preencherCamposProduto(p);
      atualizarTotalItem();

    } catch (error) {
      showAlert("Produto não encontrado", "warning");
      console.error("❌ Erro ao buscar produto:", error);
      limparCamposVenda();
    }
  });

  // Atualizar total do item ao alterar quantidade ou preço
  $("quantidade")?.addEventListener("input", atualizarTotalItem);
  $("vendaPreco")?.addEventListener("input", atualizarTotalItem);

  // Adicionar item à venda
  $("formVenda")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const produtoId = $("produtoId").dataset.produtoId;
    const nome = $("vendaNome").value;
    const preco = parseFloatSafe($("vendaPreco").value);
    const qtd = parseIntSafe($("quantidade").value);

    if (!produtoId || !qtd || !preco) {
      return showAlert("Preencha todos os campos corretamente.", "warning");
    }

    const total = preco * qtd;

    itensVenda.push({ produtoId, quantidade: qtd });
    adicionarItemTabela({ nome, qtd, preco, total });

    totalVenda += total;
    totalVendaSpan.innerText = totalVenda.toFixed(2);

    console.log("➕ Item adicionado:", { produtoId, nome, preco, qtd, total });
    limparCamposVenda();
  });

  // Finalizar venda
  $("finalizarVenda")?.addEventListener("click", async () => {
    console.log("🛒 Finalizando venda...");

    if (!itensVenda.length) {
      return showAlert("Adicione pelo menos um item antes de finalizar.", "warning");
    }

    try {
      const res = await fetch(`${API_URL}/api/vendas`, {
        method: "POST",
        headers: {
          ...authenticatedHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ itens: itensVenda }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao registrar venda.");
      }

      showAlert(`Venda registrada com sucesso! Total: R$ ${totalVenda.toFixed(2)}`, "success");
      console.log("✅ Venda registrada:", itensVenda);

      // Reset
      totalVenda = 0;
      itensVenda.length = 0;
      totalVendaSpan.innerText = "0.00";
      $("tabelaItens").innerHTML = "";
      limparCamposVenda();

      setTimeout(() => location.reload(), 5000);

    } catch (error) {
      console.error("❌ Erro ao finalizar venda:", error);
      showAlert(error.message, "danger");

      // Reset parcial
      totalVenda = 0;
      itensVenda.length = 0;
      totalVendaSpan.innerText = "0.00";
      $("tabelaItens").innerHTML = "";
      limparCamposVenda();
    }
  });
}
