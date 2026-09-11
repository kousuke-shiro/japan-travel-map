// =========================
// 訪問済みにする
// =========================

confirmButton.addEventListener("click", () => {
  if (!selectedCode) return;

  const code = selectedCode;
  const visits = getVisits();

  visits[code] = {
    count: 1
  };

  saveVisits(visits);
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
    prefectureNames[code] +
    "を訪問済みにしました。";
});


// =========================
// 訪問回数
// =========================

addVisitButton.addEventListener("click", () => {
  if (!selectedCode) return;

  const visits = getVisits();

  if (!visits[selectedCode]) return;

  visits[selectedCode].count += 1;

  saveVisits(visits);
  visitCount.textContent = visits[selectedCode].count;
});

removeVisitButton.addEventListener("click", () => {
  if (!selectedCode) return;

  const visits = getVisits();

  if (!visits[selectedCode]) return;

  if (visits[selectedCode].count <= 1) {
    alert("訪問回数は1回未満にはできません。");
    return;
  }

  visits[selectedCode].count -= 1;

  saveVisits(visits);
  visitCount.textContent = visits[selectedCode].count;
});

// =========================
// 未訪問に戻す
// =========================

unvisitButton.addEventListener("click", () => {
  if (!selectedCode) return;

  const code = selectedCode;
  const visits = getVisits();

  delete visits[code];
  saveVisits(visits);

  localStorage.removeItem(
    "photos_" +
    currentUser +
    "_" +
    code
  );

  localStorage.removeItem(
    "records_" +
    currentUser +
    "_" +
    code
  );

  closeModal();

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
    prefectureNames[code] +
    "を未訪問に戻しました。";
});

cancelButton.addEventListener("click", () => {
  closeModal();
});
