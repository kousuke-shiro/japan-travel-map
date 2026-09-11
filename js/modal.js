// =========================
// モーダル
// =========================

function openModal(code) {
  code = String(code).padStart(2, "0");
  selectedCode = code;

  const visits = getVisits();
  const name = prefectureNames[code];

  if (!name) return;

  if (!visits[code]) {
    modalTitle.textContent = name;
    confirmMessage.textContent = name + "を訪問済みにしますか？";
    visitCount.textContent = "0";

    confirmButton.style.display = "inline-block";
    addVisitButton.style.display = "none";
    removeVisitButton.style.display = "none";
    unvisitButton.style.display = "none";

  } else {
    modalTitle.textContent = name;
    confirmMessage.textContent = name + "の旅行記録";
    visitCount.textContent = visits[code].count;

    confirmButton.style.display = "none";
    addVisitButton.style.display = "inline-block";
    removeVisitButton.style.display = "inline-block";
    unvisitButton.style.display = "inline-block";
  }

  showPhotos(code);
  showTravelRecords(code);
  photoInput.value = "";

  confirmModal.style.display = "flex";
  document.body.classList.add("modal-open");
}

function closeModal() {
  confirmModal.style.display = "none";
  document.body.classList.remove("modal-open");
  selectedCode = null;
  photoInput.value = "";
}
