const API_URL = "http://localhost:8080/api/clientes";

// 🔄 Inicializa os eventos do formulário e dos filtros
function setupFormularioCliente() {
  const cepInput = document.getElementById("clienteCep");
  const form = document.getElementById("formCliente");
  const btnBuscar = document.getElementById("btnBuscarClientes");
  const filtroNome = document.getElementById("filtroNome");
  const filtroCep = document.getElementById("filtroCep");

  if (cepInput) cepInput.addEventListener("blur", buscarEnderecoPorCep);
  if (form) form.addEventListener("submit", cadastrarCliente);
  if (btnBuscar) btnBuscar.addEventListener("click", buscarClientes);

  // ⌨️ Buscar com Enter + atualizar ao limpar campos
  [filtroNome, filtroCep].forEach(input => {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        buscarClientes();
      }
    });

    input.addEventListener("input", function () {
      const nome = filtroNome.value.trim();
      const cep = filtroCep.value.trim();
      if (!nome && !cep) {
        carregarClientes(); // mostra todos os clientes automaticamente
      }
    });
  });
}

// 📦 Preencher endereço via ViaCEP
async function buscarEnderecoPorCep() {
  const cep = this.value.replace(/\D/g, "");
  if (cep.length !== 8) return;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (data.erro) throw new Error("CEP inválido");

    document.getElementById("clienteRua").value = data.logradouro || "";
    document.getElementById("clienteBairro").value = data.bairro || "";
    document.getElementById("clienteCidade").value = data.localidade || "";
    document.getElementById("clienteEstado").value = data.uf || "";
  } catch (err) {
    alert("Erro ao buscar CEP: " + err.message);
  }
}

// 📝 Cadastrar ou atualizar cliente
async function cadastrarCliente(e) {
  e.preventDefault();

  const id = document.getElementById("clienteId").value;

  const cliente = {
    nome: document.getElementById("clienteNome").value,
    telefone: document.getElementById("clienteTelefone").value,
    cep: document.getElementById("clienteCep").value,
    rua: document.getElementById("clienteRua").value,
    numero: document.getElementById("clienteNumero").value,
    bairro: document.getElementById("clienteBairro").value,
    cidade: document.getElementById("clienteCidade").value,
    estado: document.getElementById("clienteEstado").value
  };

  try {
    let res;
    if (id) {
      res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
      });
    } else {
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
      });
    }

    if (!res.ok) throw new Error("Erro ao salvar cliente");

    alert(id ? "Cliente atualizado com sucesso!" : "Cliente cadastrado com sucesso!");
    document.getElementById("formCliente").reset();
    document.getElementById("clienteId").value = "";
    document.getElementById("btnCadastrar").textContent = "Cadastrar Cliente";
    carregarClientes();
  } catch (err) {
    alert("Erro: " + err.message);
  }
}

// 📋 Listar todos os clientes
async function carregarClientes() {
  try {
    const res = await fetch(API_URL);
    const clientes = await res.json();
    renderizarTabela(clientes);
  } catch (err) {
    console.error("Erro ao carregar clientes:", err);
  }
}

// 🔍 Buscar por nome ou CEP
async function buscarClientes() {
  const nome = document.getElementById("filtroNome").value.trim();
  const cep = document.getElementById("filtroCep").value.trim();

  // Se ambos os campos estiverem vazios, carrega todos os clientes
  if (!nome && !cep) {
    carregarClientes();
    return;
  }

  let url = `${API_URL}/buscar`;
  const params = [];
  if (nome) params.push(`nome=${encodeURIComponent(nome)}`);
  if (cep) params.push(`cep=${encodeURIComponent(cep)}`);
  if (params.length > 0) url += `?${params.join("&")}`;

  try {
    const res = await fetch(url);
    const clientes = await res.json();
    renderizarTabela(clientes);
  } catch (err) {
    console.error("Erro ao buscar clientes:", err);
  }
}

// 🧾 Renderizar tabela
function renderizarTabela(clientes) {
  const tbody = document.getElementById("listaClientes");
  tbody.innerHTML = "";

  clientes.forEach(c => {
    tbody.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.nome}</td>
        <td>${c.telefone}</td>
        <td>${c.cep}</td>
        <td>${c.rua}</td>
        <td>${c.numero}</td>
        <td>${c.bairro}</td>
        <td>${c.cidade}</td>
        <td>${c.estado}</td>
        <td>
          <div class="acoes-btns">
            <button class="btn-editar" onclick="editarCliente(${c.id})">Editar</button>
            <button class="btn-excluir" onclick="excluirCliente(${c.id})">Excluir</button>
          </div>
        </td>
      </tr>
    `;
  });
}

// ✏️ Editar cliente
async function editarCliente(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar cliente");

    const cliente = await res.json();

    document.getElementById("clienteNome").value = cliente.nome;
    document.getElementById("clienteTelefone").value = cliente.telefone;
    document.getElementById("clienteCep").value = cliente.cep;
    document.getElementById("clienteRua").value = cliente.rua;
    document.getElementById("clienteNumero").value = cliente.numero;
    document.getElementById("clienteBairro").value = cliente.bairro;
    document.getElementById("clienteCidade").value = cliente.cidade;
    document.getElementById("clienteEstado").value = cliente.estado;

    document.getElementById("clienteId").value = cliente.id;
    document.getElementById("btnCadastrar").textContent = "Atualizar Cliente";
  } catch (err) {
    console.error("Erro ao carregar cliente para edição:", err);
    alert("Erro ao carregar cliente para edição");
  }
}

// ❌ Excluir cliente
async function excluirCliente(id) {
  if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Cliente excluído com sucesso!");
      carregarClientes();
    } else {
      alert("Erro ao excluir cliente.");
    }
  } catch (err) {
    console.error("Erro:", err);
  }
}

// 🧹 Limpar seção de clientes (versão segura)
function limparSecaoClientes() {
  const campos = [
    "clienteId",
    "clienteNome",
    "clienteTelefone",
    "clienteCep",
    "clienteRua",
    "clienteNumero",
    "clienteBairro",
    "clienteCidade",
    "clienteEstado",
    "btnCadastrar"
  ];

  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === "btnCadastrar") {
        el.textContent = "Cadastrar Cliente";
      } else {
        el.value = "";
      }
    }
  });
}

// 📤 Exportar funções para uso no main.js
export {
  carregarClientes,
  setupFormularioCliente,
  excluirCliente,
  limparSecaoClientes,
  editarCliente
};