// auth.js
const API_URL = "http://localhost:8080";

// Retorna o token salvo no localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// Headers para requisições autenticadas
export function authenticatedHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  };
}

// Redireciona para login.html se não houver token
export function requireAuth() {
  if (!getToken()) {
    window.location.href = "login.html";
  }
}

// Redireciona para sistema.html se já houver token e estiver na tela de login
export function checkLoginRedirect() {
  if (getToken() && window.location.pathname.includes("login.html")) {
    window.location.href = "sistema.html";
  }
}

// Logout e redireciona para tela de login
export function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Configura o formulário de login
export function setupLoginForm(showAlert) {
  document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) throw "Credenciais inválidas";

      const data = await res.json();
      if (!data.token) throw "Token ausente";

      localStorage.setItem("token", data.token);
      showAlert("Login realizado com sucesso!", "success");

      setTimeout(() => {
        window.location.href = "sistema.html";
      }, 800);

    } catch (err) {
      showAlert("Erro ao fazer login: " + err, "danger");
    }
  });
}
