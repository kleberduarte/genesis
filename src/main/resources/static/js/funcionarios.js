const API_URL = 'http://localhost:8080/api/funcionarios';

/**
 * Gera um nome de usuário com base no nome.
 */
function gerarUsuario(nome) {
  const partes = nome.trim().toLowerCase().split(/\s+/);
  return `${partes[0]}_${partes[1] || 'user'}`;
}

/**
 * Gera uma senha aleatória de 8 caracteres.
 */
function gerarSenha() {
  return Math.random().toString(36).slice(-8);
}

/**
 * Carrega e exibe os funcionários na tabela.
 */
export async function mostrarFuncionarios() {
  const tbody = document.getElementById("listaFuncionarios");
  if (!tbody) return;

  try {
    const resposta = await fetch(API_URL);
    const funcionarios = await resposta.json();

    tbody.innerHTML = "";

    funcionarios.forEach(func => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${func.nome}</td>
        <td>${func.cargo}</td>
        <td>${func.usuario?.username || '-'}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="excluirFuncionario(${func.id})">
            Excluir
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (erro) {
    console.error("Erro ao carregar funcionários:", erro);
    alert("❌ Não foi possível carregar os funcionários.");
  }
}

/**
 * Função para excluir um funcionário pelo ID.
 */
export async function excluirFuncionario(id) {
  if (!confirm("Tem certeza que deseja excluir este funcionário?")) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (resposta.status === 204) {
      alert("✅ Funcionário excluído com sucesso!");
      mostrarFuncionarios();
    } else if (resposta.status === 404) {
      alert("⚠️ Funcionário não encontrado.");
    } else {
      const erroTexto = await resposta.text();
      throw new Error(erroTexto);
    }
  } catch (erro) {
    console.error("Erro ao excluir funcionário:", erro);
    alert("❌ Erro ao excluir funcionário. Verifique o console.");
  }
}

/**
 * Inicializa o formulário de cadastro de funcionário.
 */
export function setupFormularioFuncionario() {
  const form = document.getElementById("formFuncionario");
  const nomeEl = document.getElementById("nomeFunc");
  const cargoEl = document.getElementById("cargo");
  const userEl = document.getElementById("usernameFunc");
  const passEl = document.getElementById("passwordFunc");
  const tabela = document.getElementById("listaFuncionarios");

  if (!form || !nomeEl || !cargoEl || !userEl || !passEl || !tabela) return;

  // Sugestão de usuário enquanto digita
  nomeEl.addEventListener("input", () => {
    const nome = nomeEl.value.trim();
    if (!userEl.value.trim()) {
      userEl.placeholder = `sugestão: ${gerarUsuario(nome)}`;
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = nomeEl.value.trim();
    const cargo = cargoEl.value.trim();
    let username = userEl.value.trim();
    let password = passEl.value.trim();

    if (!nome || !cargo) {
      alert("⚠️ Nome e cargo são obrigatórios.");
      return;
    }

    if (!username) username = gerarUsuario(nome);
    if (!password) password = gerarSenha();

    const novoFuncionario = {
      nome,
      cargo,
      usuario: {
        username,
        password
      }
    };

    try {
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoFuncionario)
      });

      if (!resposta.ok) {
        const texto = await resposta.text();
        throw new Error(`Erro ${resposta.status}: ${texto}`);
      }

      alert(`✅ Funcionário cadastrado!\nUsuário: ${username}\nSenha: ${password}`);
      form.reset();
      userEl.placeholder = "";
      mostrarFuncionarios();

    } catch (erro) {
      console.error("Erro ao cadastrar funcionário:", erro);
      alert("❌ Erro ao cadastrar funcionário. Verifique o console.");
    }
  });
}

// ✅ Torna a função acessível globalmente para funcionar com onclick no HTML
window.excluirFuncionario = excluirFuncionario;
