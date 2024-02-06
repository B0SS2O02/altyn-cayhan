// open modal
const modal = document.getElementById("modal");
const closeModal = document.querySelectorAll("#close");
const modalBox = document.getElementById("modalBox");
const modalTitle = document.getElementById("modalTitle");
const allow = document.getElementById("allow");
let type, itemId, deleteUrl, activateUrl;
function openModal(url, id, text, type, NODE) {
  itemId = id;
  if (type === 1) activateUrl = url;
  else deleteUrl = url;
  modalTitle.setAttribute('data-key', text)
  modalTitle.textContent = text;
  type = type;
  modal.classList.remove("hidden");
  allow.setAttribute("id", type);
  NODE.parentNode.classList.add("this");
  modalBox.classList.remove("translate-y-[-400px]");
}
closeModal.forEach((item, i) => {
  item.addEventListener("click", function () {
    modal.classList.add("hidden");
    modalBox.classList.add("translate-y-[-400px]");

    const targetTR = document.querySelector(".this");
    if (targetTR) {
      targetTR.classList.remove("this");
    }
  });
});
allow.addEventListener("click", function () {
  const typeId = allow.getAttribute("id");
  allow.removeAttribute("id");
  const targetTR = document.querySelector(".this");
  if (typeId == 1) {
    fetch(activateUrl + itemId, {
      method: "GET",
    })
      .then((res) => {
        if (targetTR.children.bool.innerText.toUpperCase().trim() == "YES") {
          targetTR.children.bool.classList.remove("text-[#445FD3]");
          targetTR.children.bool.classList.add("text-[red]");
          targetTR.children.bool.innerText = "No";
        } else {
          targetTR.children.bool.classList.remove("text-[red]");
          targetTR.children.bool.classList.add("text-[#445FD3]");
          targetTR.children.bool.innerText = "Yes";
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  } else if (typeId == 2) {
    fetch(deleteUrl + itemId, {
      method: "DELETE",
    })
      .then((res) => {
        targetTR.remove();
      })
      .catch((err) => {
        alert(err.message);
      });
  }
  document.querySelectorAll("#close")[0].click();
  itemId = "";
  activateUrl = "";
  deleteUrl = "";
  type = "";
});
