// =========================
// 訪問データの安全確認
// =========================

const MAX_VISIT_COUNT = 9999;

function isVisitUserLoggedIn() {
  return typeof currentUser === "string" && currentUser.length > 0;
}

function isValidVisitCode(code) {
  return (
    typeof code === "string" &&
    isValidPrefectureCode(code)
  );
}

function getSelectedVisitCode() {
  if (!isVisitUserLoggedIn()) return null;
  if (!isValidVisitCode(selectedCode)) return null;

  return selectedCode;
}

// =========================
// 訪問済みにする
// =========================

confirmButton.addEventListener("click", () => {
  const code = getSelectedVisitCode();

  if (!code) return;

  const visits = getVisits();

  // すでに訪問済みなら処理しない
  if (visits[code]) return;

  visits[code] = {
    count: 1
  };

  const saved = saveVisits(visits);

  if (!saved) {
    alert("訪問情報の保存に失敗しました。");
    return;
  }

  closeModal();

  const prefecture = mapContainer.querySelector(
    `.prefecture[data-code="${code}"]`
  );

  if (prefecture) {
    const area = areas[code];

    if (area) {
      prefecture.classList.add(area);
    }

    prefecture.classList.add("visited");
  }

  updateVisitedCount();

  message.textContent =
    prefectureNames[code] + "を訪問済みにしました。";
});

// =========================
// 訪問回数を増やす
// =========================

addVisitButton.addEventListener("click", () => {
  const code = getSelectedVisitCode();

  if (!code) return;

  const visits = getVisits();
  const visit = visits[code];

  if (!visit) return;

  const countValue = Number(visit.count);

  if (
    !Number.isInteger(countValue) ||
    countValue < 1 ||
    countValue >= MAX_VISIT_COUNT
  ) {
    if (countValue >= MAX_VISIT_COUNT) {
      alert("訪問回数の上限に達しています。");
    }

    return;
  }

  visit.count = countValue + 1;

  const saved = saveVisits(visits);

  if (!saved) {
    alert("訪問回数の保存に失敗しました。");
    return;
  }

  visitCount.textContent = visit.count;
});

// =========================
// 訪問回数を減らす
// =========================

removeVisitButton.addEventListener("click", () => {
  const code = getSelectedVisitCode();

  if (!code) return;

  const visits = getVisits();
  const visit = visits[code];

  if (!visit) return;

  const countValue = Number(visit.count);

  if (!Number.isInteger(countValue) || countValue < 1) {
    return;
  }

  if (countValue <= 1) {
    alert("訪問回数は1回未満にはできません。");
    return;
  }

  visit.count = countValue - 1;

  const saved = saveVisits(visits);

  if (!saved) {
    alert("訪問回数の保存に失敗しました。");
    return;
  }

  visitCount.textContent = visit.count;
});

// =========================
// 未訪問に戻す
// =========================

unvisitButton.addEventListener("click", () => {
  const code = getSelectedVisitCode();

  if (!code) return;

  const visits = getVisits();

  if (!visits[code]) return;

  const prefectureName = prefectureNames[code];

  // 誤操作防止
  const confirmed = window.confirm(
    prefectureName +
      "を未訪問に戻しますか？\n\n" +
      "この県の旅行記録と写真も削除されます。"
  );

  if (!confirmed) return;

  // 訪問データを削除
  delete visits[code];

  const saved = saveVisits(visits);

  if (!saved) {
    alert("訪問情報の保存に失敗しました。");
    return;
  }

  // 写真と旅行記録を削除
  localStorage.removeItem(
    "photos_" + currentUser + "_" + code
  );

  localStorage.removeItem(
    "records_" + currentUser + "_" + code
  );

  closeModal();

  // 地図の表示を未訪問状態に戻す
  const prefecture = mapContainer.querySelector(
    `.prefecture[data-code="${code}"]`
  );

  if (prefecture) {
    prefecture.classList.remove("visited");

    Object.values(areas).forEach((area) => {
      prefecture.classList.remove(area);
    });
  }

  updateVisitedCount();

  message.textContent =
    prefectureName + "を未訪問に戻しました。";
});