// ui.js
export function showAlert(message, type = "success") {
  const el = document.getElementById("alertArea");
  if (!el) return;

  el.textContent = message;
  el.className = `alert alert-${type}`;
  el.classList.remove("d-none");
  setTimeout(() => el.classList.add("d-none"), 3000);
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
