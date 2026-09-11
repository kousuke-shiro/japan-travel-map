// =========================
// 地図読み込み
// =========================

async function loadMap() {
  try {
    const response = await fetch(map);

    if (!response.ok) {
      throw new Error("地図の読み込みに失敗しました");
    }

    const svgText = await response.text();
    mapContainer.innerHTML = svgText;

    const prefectures = mapContainer.querySelectorAll(".geolonia-svg-map .prefecture");
    const visits = getVisits();

    prefectures.forEach((prefecture) => {
      const rawCode = prefecture.getAttribute("data-code");

      if (!rawCode) return;

      const code = String(rawCode).padStart(2, "0");
      prefecture.dataset.code = code;

      if (visits[code]) {
        const area = areas[code];

        if (area) {
          prefecture.classList.add(area);
        }

        prefecture.classList.add("visited");
      }

      prefecture.addEventListener("click", (event) => {
        event.stopPropagation();
        openModal(code);
      });
    });

    updateVisitedCount();

  } catch (error) {
    console.error(error);
    message.textContent = "地図の読み込みに失敗しました。";
  }
}
