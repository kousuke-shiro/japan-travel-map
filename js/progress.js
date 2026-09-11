// =========================
// 全国制覇率
// =========================

function updateProgress() {
  const visits = getVisits();

  const visitedCount =
    Object.keys(visits).length;

  const percent =
    Math.round(
      (visitedCount / 47) * 100
    );

  progressPercent.textContent =
    percent + "%";

  progressBarFill.style.width =
    percent + "%";

  progressCount.textContent =
    visitedCount +
    " / 47 都道府県";

  const regionCounts = {};

  Object.keys(regionNames).forEach(
    (region) => {
      regionCounts[region] = 0;
    }
  );

  Object.keys(visits).forEach(
    (code) => {
      const region =
        areas[code];

      if (region) {
        regionCounts[region]++;
      }
    }
  );

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
