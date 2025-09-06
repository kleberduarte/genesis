import { checkLoginRedirect, setupLoginForm, logout, getPerfil } from "./auth.js";
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

window.excluirProduto = excluirProduto;
window.preencherFormularioParaEdicao = preencherFormularioParaEdicao;
window.excluirFuncionario = excluirFuncionario;
window.excluirCliente = excluirCliente;
window.editarCliente = editarCliente;

function mostrarSecao(idSecao, callback, menuId) {
  const perfil = getPerfil();

  // Bloqueia o acesso à seção de funcionários para perfil NORMAL, garantindo controle centralizado
  if (idSecao === "funcionarioSection" && perfil === "NORMAL") {
    alert("Acesso negado! Você não tem permissão para acessar esta área.");
    mostrarSecao("vendaSection", inicializarVendaAvancada, "linkVendas");
    return;
  }

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

function bloquearAcessoFuncionalidadeParaNormal() {
  const perfil = getPerfil();

  if (perfil === "NORMAL") {
    // Esconder link de funcionários no menu
    const linkFuncionarios = document.getElementById("linkFuncionarios");
    if (linkFuncionarios) {
      linkFuncionarios.style.display = "none";
    }

    // Se estiver tentando acessar a seção de funcionários direto via URL ou DOM, redireciona para vendas
    const funcionarioSection = document.getElementById("funcionarioSection");
    if (funcionarioSection && funcionarioSection.style.display !== "none") {
      alert("Acesso negado! Você não tem permissão para acessar esta área. Redirecionando para vendas.");
      mostrarSecao("vendaSection", inicializarVendaAvancada, "linkVendas");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkLoginRedirect();

  const perfil = getPerfil();
  console.log("Perfil do usuário:", perfil);

  // Se estivermos na página de login, só configura o formulário e retorna
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "login.html") {
    setupLoginForm(showAlert);
    return;
  }

  // Bloquear o acesso restrito para perfil NORMAL
  bloquearAcessoFuncionalidadeParaNormal();

  // --- Referências aos links ---
  const linkProdutos = document.getElementById("linkProdutos");
  const linkVendas = document.getElementById("linkVendas");
  const linkClientes = document.getElementById("linkClientes");
  const linkFuncionarios = document.getElementById("linkFuncionarios");
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

    if (perfil === "NORMAL") {
      alert("Acesso negado! Você não tem permissão para acessar esta área.");
      return;
    }

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

  // --- Exibir a seção padrão ---
  if (document.getElementById("vendaSection")) {
    mostrarSecao("vendaSection", inicializarVendaAvancada, "linkVendas");
  } else if (document.getElementById("formProduto")) {
    mostrarSecao("produtoSection", mostrarProdutos, "linkProdutos");
  } else if (document.getElementById("funcionarioSection")) {
    if (perfil === "NORMAL") {
      alert("Acesso negado! Redirecionando para vendas.");
      mostrarSecao("vendaSection", inicializarVendaAvancada, "linkVendas");
    } else {
      mostrarSecao(
        "funcionarioSection",
        () => {
          mostrarFuncionarios();
          setupFormularioFuncionario();
        },
        "linkFuncionarios"
      );
    }
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
