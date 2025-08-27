import { getToken, authenticatedHeaders } from "./auth.js";
import { showAlert, esconderTodas } from "./ui.js";

const API_URL = "http://localhost:8080";

// Mostra a seção produtos, esconde as outras e configura filtros e formulário
export function mostrarProdutos() {
  esconderTodas();
  const section = document.getElementById("produtoSection");
  if (!section) return console.warn("❌ Seção produtoSection não encontrada");
  section.style.display = "block";

  adicionarEventosFiltros();
  setupFormularioProduto();
  carregarProdutos(); // Carrega todos os produtos inicialmente
}

// Carrega produtos, podendo usar um endpoint customizado (filtros)
export function carregarProdutos(endpoint = "/api/produtos") {
  fetch(`${API_URL}${endpoint}`, {
    headers: authenticatedHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return Promise.reject(errorData?.message || "Erro ao buscar produtos");
      }
      return res.json();
    })
    .then((produtos) => {
      renderizarTabela(produtos);
      vincularEventosAcoes(produtos);
    })
    .catch((err) => showAlert("Erro: " + err, "danger"));
}

// --- Filtros ---
// Busca por código ou nome e atualiza a tabela
export function buscarPorCodigoOuNome() {
  const valor = document.getElementById("filtroCodigoNome")?.value.trim();
  if (!valor) return showAlert("Digite um código ou nome.", "warning");

  carregarProdutos(`/api/produtos/buscar?busca=${encodeURIComponent(valor)}`);
}

// Busca produto específico para edição e preenche formulário
export function buscarProdutoParaEdicao() {
  const input = document.getElementById("filtroCodigoNome");
  const valor = input?.value.trim();
  if (!valor) return showAlert("Digite um código ou nome.", "warning");

  fetch(`${API_URL}/api/produtos/buscar?busca=${encodeURIComponent(valor)}`, {
    headers: authenticatedHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return Promise.reject(errorData?.message || "Produto não encontrado");
      }
      return res.json();
    })
    .then((produto) => {
      if (!produto || (Array.isArray(produto) && produto.length === 0)) {
        showAlert("Produto não encontrado.", "warning");
        return;
      }

      const p = Array.isArray(produto) ? produto[0] : produto;

      preencherFormularioParaEdicao(p);
      showAlert("Produto carregado no formulário.", "success");

      input.value = "";
    })
    .catch((err) => {
      showAlert("Erro: " + err, "danger");
    });
}

// Filtra produtos pela categoria selecionada
export function filtrarPorCategoria() {
  const categoria = document.getElementById("filtroCategoria")?.value;
  if (!categoria) return showAlert("Escolha uma categoria válida.", "warning");
  carregarProdutos(`/api/produtos/categoria?categoria=${encodeURIComponent(categoria)}`);
}

// Mostra apenas os produtos que são kits
export function mostrarKits() {
  carregarProdutos("/api/produtos/kits");
}

// --- Adiciona eventos aos botões dos filtros ---
function adicionarEventosFiltros() {
  const btnBuscarCodigoNome = document.getElementById("btnBuscarCodigoNome");
  const btnBuscarCategoria = document.getElementById("btnBuscarCategoria");
  const btnVerKits = document.getElementById("btnMostrarKits");
  const btnTodos = document.getElementById("btnTodosProdutos");
  const inputBusca = document.getElementById("filtroCodigoNome");

  // Eventos de clique nos botões
  btnBuscarCodigoNome?.addEventListener("click", buscarProdutoParaEdicao);
  btnBuscarCategoria?.addEventListener("click", filtrarPorCategoria);
  btnVerKits?.addEventListener("click", mostrarKits);
  btnTodos?.addEventListener("click", () => carregarProdutos());

  // Evento de Enter no campo de busca
  inputBusca?.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      buscarProdutoParaEdicao();
    }
  });
}

// --- Formulário de cadastro / edição ---
export function setupFormularioProduto() {
  const form = document.getElementById("formProduto");
  const btnLimpar = document.getElementById("btnLimparProduto");

  if (!form) return;

  // Remove e adiciona para evitar múltiplos handlers
  form.removeEventListener("submit", submitHandler);
  form.addEventListener("submit", submitHandler);

  // Evento para botão limpar: limpa formulário e muda texto botão submit
  btnLimpar?.addEventListener("click", () => {
    resetFormProduto();
  });
}

// Manipula envio do formulário para criar ou editar produto
function submitHandler(e) {
  e.preventDefault();

  toggleBotaoSubmit(true);

  const form = e.target;
  const produto = capturarDadosFormulario();

  const validacao = validarProduto(produto);
  if (!validacao.valido) {
    toggleBotaoSubmit(false);
    return showAlert(validacao.mensagem, "warning");
  }

  const produtoId = form.getAttribute("data-edit-id");
  if (produtoId) {
    editarProduto(produtoId, produto);
  } else {
    cadastrarProduto(produto);
  }
}

// Captura dados do formulário em objeto
function capturarDadosFormulario() {
  return {
    codigo: document.getElementById("produtoIdCadastro")?.value.trim(),
    nome: document.getElementById("produtoNome")?.value.trim(),
    descricao: document.getElementById("produtoDescricao")?.value.trim(),
    preco: parseFloat(document.getElementById("produtoPreco")?.value),
    estoque: parseInt(document.getElementById("produtoEstoque")?.value),
    categoria: document.getElementById("produtoCategoria")?.value.trim(),
    kit: document.getElementById("produtoKit")?.checked,
  };
}

// Valida os dados do produto antes de enviar
function validarProduto(produto) {
  if (!produto.codigo) return { valido: false, mensagem: "Código é obrigatório." };
  if (!produto.nome) return { valido: false, mensagem: "Nome é obrigatório." };
  if (!produto.descricao) return { valido: false, mensagem: "Descrição é obrigatória." };
  if (isNaN(produto.preco) || produto.preco < 0) return { valido: false, mensagem: "Preço inválido." };
  if (isNaN(produto.estoque) || produto.estoque < 0) return { valido: false, mensagem: "Estoque inválido." };
  return { valido: true };
}

// Envia requisição para cadastrar um novo produto
function cadastrarProduto(produto) {
  fetch(`${API_URL}/api/produtos`, {
    method: "POST",
    headers: {
      ...authenticatedHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(produto),
  })
    .then(async (res) => {
      toggleBotaoSubmit(false);
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return Promise.reject(errorData?.message || "Erro ao cadastrar produto");
      }
      return res.json();
    })
    .then(() => {
      showAlert("Produto cadastrado com sucesso!", "success");
      resetFormProduto();
      carregarProdutos();
    })
    .catch((err) => {
      toggleBotaoSubmit(false);
      showAlert("Erro: " + err, "danger");
    });
}

// Envia requisição para editar produto existente
export function editarProduto(id, produto) {
  fetch(`${API_URL}/api/produtos/${id}`, {
    method: "PUT",
    headers: {
      ...authenticatedHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(produto),
  })
    .then(async (res) => {
      toggleBotaoSubmit(false);
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return Promise.reject(errorData?.message || "Erro ao atualizar produto");
      }
      return res.json();
    })
    .then(() => {
      showAlert("Produto atualizado com sucesso!", "success");
      resetFormProduto();
      carregarProdutos();
    })
    .catch((err) => {
      toggleBotaoSubmit(false);
      showAlert("Erro: " + err, "danger");
    });
}

// Preenche o formulário para edição de produto
export function preencherFormularioParaEdicao(produto) {
  const form = document.getElementById("formProduto");
  if (!form) return;

  document.getElementById("produtoIdCadastro").value = produto.codigo || "";
  document.getElementById("produtoNome").value = produto.nome || "";
  document.getElementById("produtoDescricao").value = produto.descricao || "";
  document.getElementById("produtoPreco").value = produto.preco ?? "";
  document.getElementById("produtoEstoque").value = produto.estoque ?? "";
  document.getElementById("produtoCategoria").value = produto.categoria || "";
  document.getElementById("produtoKit").checked = produto.kit || false;

  form.setAttribute("data-edit-id", produto.id);

  const btnSubmit = form.querySelector("button[type=submit]");
  if (btnSubmit) {
    btnSubmit.textContent = "Atualizar Produto";
  }
}

// Reseta o formulário após cadastro ou edição
function resetFormProduto() {
  const form = document.getElementById("formProduto");
  if (!form) return;

  form.reset();
  form.removeAttribute("data-edit-id");

  const btnSubmit = form.querySelector("button[type=submit]");
  if (btnSubmit) {
    btnSubmit.textContent = "Cadastrar Produto";
  }
}

// Habilita/desabilita botão submit e altera texto durante processamento
function toggleBotaoSubmit(disable) {
  const form = document.getElementById("formProduto");
  if (!form) return;

  const btn = form.querySelector("button[type=submit]");
  if (disable) {
    btn.disabled = true;
    btn.textContent = "Carregando...";
  } else {
    btn.disabled = false;
    btn.textContent = form.hasAttribute("data-edit-id") ? "Atualizar Produto" : "Cadastrar Produto";
  }
}

// --- Exclusão ---
export function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  fetch(`${API_URL}/api/produtos/${id}`, {
    method: "DELETE",
    headers: authenticatedHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return Promise.reject(errorData?.message || "Erro ao excluir produto");
      }
      showAlert("Produto excluído com sucesso!", "success");
      carregarProdutos();
    })
    .catch((err) => showAlert("Erro: " + err, "danger"));
}

// --- Renderização tabela ---
function renderizarTabela(produtos) {
  const tabela = document.getElementById("listaProdutos");
  if (!tabela) return;

  if (!produtos || produtos.length === 0) {
    tabela.innerHTML = `<tr><td colspan="8" class="text-center">Nenhum produto encontrado.</td></tr>`;
    return;
  }

  tabela.innerHTML = produtos
    .map(
      (p) => `
    <tr>
      <td>${p.codigo}</td>
      <td>${p.nome}</td>
      <td>${p.descricao}</td>
      <td>${p.preco.toFixed(2)}</td>
      <td>${p.estoque}</td>
      <td>${p.categoria}</td>
      <td>${p.kit ? "Sim" : "Não"}</td>
      <td>
        <button class="btn btn-warning btn-sm btn-editar" data-id="${p.id}">Editar</button>
        <button class="btn btn-danger btn-sm btn-excluir" data-id="${p.id}">Excluir</button>
      </td>
    </tr>
  `
    )
    .join("");
}

// Adiciona eventos de edição e exclusão para cada botão na tabela
function vincularEventosAcoes(produtos) {
  const btnsEditar = document.querySelectorAll("#listaProdutos .btn-editar");
  const btnsExcluir = document.querySelectorAll("#listaProdutos .btn-excluir");

  btnsEditar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const produto = produtos.find((p) => p.id.toString() === id);
      if (produto) {
        preencherFormularioParaEdicao(produto);
      }
    });
  });

  btnsExcluir.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      excluirProduto(id);
    });
  });
}
