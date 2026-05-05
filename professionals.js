const companyDialog = document.querySelector("#companyDialog");

document.querySelectorAll("[data-open-login]").forEach((button) => {
  button.addEventListener("click", () => {
    if (companyDialog?.showModal) companyDialog.showModal();
  });
});

window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();
});
