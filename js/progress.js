// =========================
// 進捗状況を更新
// =========================

function updateProgress() {
  // ログイン確認
  if (
    typeof currentUser !== "string" ||
    currentUser.length === 0
  ) {
    return;
  }

  // storage.jsで検証済みのデータを取得
  const visits = getVisits();

  const visitedCount =
    Object.keys(visits).length;

  // 全国の訪問率
  const percent = Math.round(
    (visitedCount / 47) * 100
  );

  progressPercent.textContent =
    percent + "%";

  progressBarFill.style.width =
    percent + "%";

  progressCount.textContent =
    visitedCount + " / 47 都道府県";

  // =========================
  // 地方ごとの訪問数
  // =========================

  const regionCounts = {};

  Object.keys(regionNames).forEach(
    (region) => {
      regionCounts[region] = 0;
    }
  );

  Object.keys(visits).forEach(
    (code) => {
      // 念のため都道府県コードを再確認
      if (!isValidPrefectureCode(code)) {
        return;
      }

      const region = areas[code];

      // 存在する地方だけを集計
      if (
        region &&
        Object.prototype.hasOwnProperty.call(
          regionCounts,
          region
        )
      ) {
        regionCounts[region]++;
      }
    }
  );

  // =========================
  // 地方別進捗を表示
  // =========================

  regionProgress.innerHTML = "";

  Object.keys(regionNames).forEach(
    (region) => {
      const item =
        document.createElement("div");

      item.className =
        "region-progress-item";

      item.textContent =
        regionNames[region] +
        " " +
        regionCounts[region] +
        " / " +
        regionTotals[region];

      regionProgress.appendChild(item);
    }
  );
}