// =========================
// 都道府県モーダルを開く
// =========================

function openModal(code) {
  // ログイン確認
  if (
    typeof currentUser !== "string" ||
    currentUser.length === 0
  ) {
    return;
  }

  // 都道府県コードを文字列に統一
  code = String(code).padStart(2, "0");

  // 正しい都道府県コードか確認
  if (!isValidPrefectureCode(code)) {
    return;
  }

  const name = prefectureNames[code];

  if (!name) {
    return;
  }

  // 選択された県を保存
  selectedCode = code;

  const visits = getVisits();

  // =========================
  // 未訪問の場合
  // =========================

  if (!visits[code]) {
    modalTitle.textContent = name;

    confirmMessage.textContent =
      name + "を訪問済みにしますか？";

    visitCount.textContent = "0";

    confirmButton.style.display = "inline-block";
    addVisitButton.style.display = "none";
    removeVisitButton.style.display = "none";
    unvisitButton.style.display = "none";
  }

  // =========================
  // 訪問済みの場合
  // =========================

  else {
    modalTitle.textContent = name;

    confirmMessage.textContent =
      name + "の旅行記録";

    visitCount.textContent =
      String(visits[code].count);

    confirmButton.style.display = "none";
    addVisitButton.style.display = "inline-block";
    removeVisitButton.style.display = "inline-block";
    unvisitButton.style.display = "inline-block";
  }

  // 写真・旅行記録を表示
  showPhotos(code);
  showTravelRecords(code);

  // 写真入力欄をリセット
  photoInput.value = "";

  // モーダルを表示
  confirmModal.style.display = "flex";

  // 背景ページを固定
  document.body.classList.add("modal-open");
}

// =========================
// モーダルを閉じる
// =========================

function closeModal() {
  confirmModal.style.display = "none";

  document.body.classList.remove("modal-open");

  // 選択中の県をクリア
  selectedCode = null;

  // 写真入力欄をリセット
  photoInput.value = "";
}

// =========================
// 閉じるボタン
// =========================

cancelButton.addEventListener(
  "click",
  () => {
    closeModal();
  }
);