const companyDialog = document.querySelector("#companyDialog");
const claimProfileForm = document.querySelector("#claimProfileForm");
const claimFormNote = document.querySelector("#claimFormNote");

document.querySelectorAll("[data-open-login]").forEach((button) => {
  button.addEventListener("click", () => {
    if (companyDialog?.showModal) companyDialog.showModal();
  });
});

claimProfileForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const company = document.querySelector("#claimCompany").value.trim() || "your company";
  claimFormNote.textContent = `Prototype claim ready for ${company}. In the live product this would start verification and create a founding profile.`;
  claimFormNote.classList.add("success");
});

window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();
});
