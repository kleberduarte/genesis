import { checkLoginRedirect, setupLoginForm, logout } from "./auth.js";
import { showAlert, esconderTodas, destacarMenu } from "./ui.js";
import {
  mostrarProdutos,
  setupFormularioProduto,
  carregarProdutos,
  carregarCategorias,
  preencherFormularioParaEdicao,
  excluirProduto,
} from "./produtos.js";
import { inicializarVendaAvancada } from "./vendas.js";
import {
  mostrarFuncionarios,
  setupFormularioFuncionario,
  excluirFuncionario,
} from "./funcionarios.js";
import {
  carregarClientes,
  setupFormularioCliente,
  excluirCliente,
  editarCliente,
  limparSecaoClientes,
} from "./clientes.js";

// Expor para uso em botões dinâmicos HTML
window.excluirProduto = excluirProduto;
window.preencherFormularioParaEdicao = preencherFormularioParaEdicao;
window.excluirFuncionario = excluirFuncionario;
window.excluirCliente = excluirCliente;
window.editarCliente = editarCliente;

function mostrarSecao(idSecao, callback, menuId) {
  console.log(`🔄 Alternando para seção: ${idSecao}`);

  if (idSecao !== "clienteSection") limparSecaoClientes();

  esconderTodas();
  destacarMenu(menuId);

  const secao = document.getElementById(idSecao);
  if (secao) {
    secao.style.display = "block";
    console.log(`✅ Seção ${idSecao} exibida`);
    if (typeof callback === "function") {
      console.log(`📦 Executando lógica da seção: ${idSecao}`);
      callback();
    }
  } else {
    console.warn(`⚠️ Seção ${idSecao} não encontrada`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkLoginRedirect();

  const currentPage = window.location.pathname.split("/").pop();
  console.log("📄 Página atual:", currentPage);

  if (currentPage === "login.html") {
    setupLoginForm(showAlert);
    return;
  }

  // --- Referências aos links de navegação ---
  const linkProdutos = document.getElementById("linkProdutos");
  const linkVendas = document.getElementById("linkVendas");
  const linkFuncionarios = document.getElementById("linkFuncionarios");
  const linkClientes = document.getElementById("linkClientes");
  const btnLogout = document.getElementById("btnLogout");

  // --- PRODUTOS ---
  linkProdutos?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("📌 Produtos clicado");
    mostrarSecao("produtoSection", mostrarProdutos, "linkProdutos");
  });

  // --- VENDAS ---
  linkVendas?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("📌 Vendas clicado");
    mostrarSecao("vendaSection", inicializarVendaAvancada, "linkVendas");
  });

  // --- FUNCIONÁRIOS ---
  linkFuncionarios?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("📌 Funcionários clicado");
    mostrarSecao(
      "funcionarioSection",
      () => {
        mostrarFuncionarios();
        setupFormularioFuncionario();
      },
      "linkFuncionarios"
    );
  });

  // --- CLIENTES ---
  linkClientes?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("📌 Clientes clicado");
    mostrarSecao(
      "clienteSection",
      () => {
        carregarClientes();
        setupFormularioCliente();
      },
      "linkClientes"
    );
  });

  // --- LOGOUT ---
  btnLogout?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("🔓 Logout solicitado");
    logout();
  });

  // --- Inicialização automática se seção estiver visível ---
  if (document.getElementById("formProduto")) {
    console.log("🧾 Formulário de produtos detectado — inicializando");
    mostrarSecao("produtoSection", mostrarProdutos, "linkProdutos");
  } else if (document.getElementById("vendaSection")) {
    mostrarSecao("vendaSection", inicializarVendaAvancada, "linkVendas");
  } else if (document.getElementById("funcionarioSection")) {
    mostrarSecao(
      "funcionarioSection",
      () => {
        mostrarFuncionarios();
        setupFormularioFuncionario();
      },
      "linkFuncionarios"
    );
  } else if (document.getElementById("clienteSection")) {
    mostrarSecao(
      "clienteSection",
      () => {
        carregarClientes();
        setupFormularioCliente();
      },
      "linkClientes"
    );
  }
});
