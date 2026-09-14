async function loadMap() {
  // =========================
  // ログイン確認
  // =========================

  if (
    typeof currentUser !== "string" ||
    currentUser.length === 0
  ) {
    return;
  }

  try {
    const response = await fetch(map);

    if (!response.ok) {
      throw new Error("地図の読み込みに失敗しました");
    }

    const svgText = await response.text();

    // =========================
    // SVGをDOMParserで解析
    // =========================

    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(
      svgText,
      "image/svg+xml"
    );

    // XMLとして正しく解析できたか確認
    const parseError =
      svgDocument.querySelector("parsererror");

    if (parseError) {
      throw new Error("SVGの解析に失敗しました");
    }

    const svg = svgDocument.documentElement;

    if (
      !svg ||
      svg.tagName.toLowerCase() !== "svg"
    ) {
      throw new Error("正しいSVGではありません");
    }

    // =========================
    // 危険な要素を削除
    // =========================

    svg
      .querySelectorAll(
        "script, iframe, object, embed, foreignObject"
      )
      .forEach((element) => {
        element.remove();
      });

    // =========================
    // イベント属性を削除
    // =========================

    svg.querySelectorAll("*").forEach((element) => {
      Array.from(element.attributes).forEach(
        (attribute) => {
          if (
            attribute.name
              .toLowerCase()
              .startsWith("on")
          ) {
            element.removeAttribute(attribute.name);
          }
        }
      );
    });

    // =========================
    // 地図を表示
    // =========================

    mapContainer.replaceChildren(
      document.importNode(svg, true)
    );

    // =========================
    // 都道府県を取得
    // =========================

    const prefectures =
      mapContainer.querySelectorAll(
        ".geolonia-svg-map .prefecture"
      );

    const visits = getVisits();

    prefectures.forEach((prefecture) => {
      const rawCode =
        prefecture.getAttribute("data-code");

      if (!rawCode) {
        return;
      }

      const code = String(rawCode).padStart(2, "0");

      // =========================
      // 都道府県コードを検証
      // =========================

      if (!isValidPrefectureCode(code)) {
        return;
      }

      prefecture.dataset.code = code;

      // =========================
      // 訪問済みなら色を付ける
      // =========================

      if (visits[code]) {
        const area = areas[code];

        if (area) {
          prefecture.classList.add(area);
        }

        prefecture.classList.add("visited");
      }

      // =========================
      // クリック処理
      // =========================

      prefecture.addEventListener(
        "click",
        (event) => {
          event.stopPropagation();

          // ログイン状態を再確認
          if (
            typeof currentUser !== "string" ||
            currentUser.length === 0
          ) {
            return;
          }

          // コードを再確認
          if (!isValidPrefectureCode(code)) {
            return;
          }

          openModal(code);
        }
      );
    });

    // =========================
    // 訪問数を更新
    // =========================

    updateVisitedCount();

  } catch (error) {
    console.error(
      "地図の読み込みエラー:",
      error
    );

    mapContainer.innerHTML = "";

    message.textContent =
      "地図の読み込みに失敗しました。";
  }
}