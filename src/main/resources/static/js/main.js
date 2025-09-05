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

// Expor para uso global nos botões
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

  // --- Referências aos links ---
  const linkProdutos = document.getElementById("linkProdutos");
  const linkVendas = document.getElementById("linkVendas");
  const linkFuncionarios = document.getElementById("linkFuncionarios");
  const linkClientes = document.getElementById("linkClientes");
  const btnLogout = document.getElementById("btnLogout");

  // --- Event listeners ---
  linkProdutos?.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarSecao("produtoSection", mostrarProdutos, "linkProdutos");
  });

  linkVendas?.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarSecao("vendaSection", inicializarVendaAvancada, "linkVendas");
  });

  linkFuncionarios?.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarSecao(
      "funcionarioSection",
      () => {
        mostrarFuncionarios();
        setupFormularioFuncionario();
      },
      "linkFuncionarios"
    );
  });

  linkClientes?.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarSecao(
      "clienteSection",
      () => {
        carregarClientes();
        setupFormularioCliente();
      },
      "linkClientes"
    );
  });

  btnLogout?.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });

  // --- Exibir a seção de vendas como padrão SEM depender de parâmetros na URL ---
  if (document.getElementById("vendaSection")) {
    mostrarSecao("vendaSection", inicializarVendaAvancada, "linkVendas");
  } else if (document.getElementById("formProduto")) {
    mostrarSecao("produtoSection", mostrarProdutos, "linkProdutos");
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
