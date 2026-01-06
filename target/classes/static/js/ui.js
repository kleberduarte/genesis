// ui.js

export function showAlert(message, type = "success") {
console.log ("show")
  const el = document.getElementById("alertArea");
  if (!el) return;

  el.className = `alert alert-${type} alert-dismissible fade show`;
  el.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  el.classList.remove("d-none");

  setTimeout(() => {
    el.classList.add("d-none");
    el.className = "alert d-none";
    el.innerHTML = "";
  }, 3000);
}

export function esconderTodas() {
  document.querySelectorAll("section[id$='Section']").forEach(secao => {
    secao.style.setProperty("display", "none");
  });
}

export function destacarMenu(ativoId) {
  document.querySelectorAll(".nav-link").forEach(link =>
    link.classList.remove("fw-bold", "text-primary")
  );
  document.getElementById(ativoId)?.classList.add("fw-bold", "text-primary");
}

export function mostrarSecao(secaoId, menuId) {
  esconderTodas();
  document.getElementById(secaoId).style.setProperty("display", "block");
  destacarMenu(menuId);
}

// 👇 Expondo ao escopo global para testes no console
window.showAlert = showAlert;
window.esconderTodas = esconderTodas;
window.destacarMenu = destacarMenu;
