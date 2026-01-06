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

  if (idSecao === "funcionarioSection" && perfil === "NORMAL") {
    showAlert("Acesso negado! Você não tem permissão para acessar esta área.", "danger");
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
    showAlert(`Seção ${idSecao.replace("Section", "")} aberta com sucesso!`, "info");

    if (typeof callback === "function") {
      console.log(`📦 Executando lógica da seção: ${idSecao}`);
      callback();
    }
  } else {
    console.warn(`⚠️ Seção ${idSecao} não encontrada`);
    showAlert(`Seção ${idSecao} não encontrada!`, "warning");
  }
}

function bloquearAcessoFuncionalidadeParaNormal() {
  const perfil = getPerfil();

  if (perfil === "NORMAL") {
    const linkFuncionarios = document.getElementById("linkFuncionarios");
    if (linkFuncionarios) {
      linkFuncionarios.style.display = "none";
    }

    const funcionarioSection = document.getElementById("funcionarioSection");
    if (funcionarioSection && funcionarioSection.style.display !== "none") {
      showAlert("Acesso negado! Redirecionando para vendas.", "danger");
      mostrarSecao("vendaSection", inicializarVendaAvancada, "linkVendas");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkLoginRedirect();

  const perfil = getPerfil();
  console.log("Perfil do usuário:", perfil);

  // Teste inicial para validar que o alerta aparece
  showAlert("Sistema carregado com sucesso!", "success");

  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "login.html") {
    setupLoginForm(showAlert);
    return;
  }

  bloquearAcessoFuncionalidadeParaNormal();

  const linkProdutos = document.getElementById("linkProdutos");
  const linkVendas = document.getElementById("linkVendas");
  const linkClientes = document.getElementById("linkClientes");
  const linkFuncionarios = document.getElementById("linkFuncionarios");
  const btnLogout = document.getElementById("btnLogout");

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
      showAlert("Acesso negado! Você não tem permissão para acessar esta área.", "danger");
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
    showAlert("Logout realizado com sucesso!", "success");
  });

  if (document.getElementById("vendaSection")) {
    mostrarSecao("vendaSection", inicializarVendaAvancada, "linkVendas");
  } else if (document.getElementById("formProduto")) {
    mostrarSecao("produtoSection", mostrarProdutos, "linkProdutos");
  } else if (document.getElementById("funcionarioSection")) {
    if (perfil === "NORMAL") {
      showAlert("Acesso negado! Redirecionando para vendas.", "danger");
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