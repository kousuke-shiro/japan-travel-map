// =========================
// 旅行記録
// =========================

function showTravelRecords(code) {
  travelRecordList.innerHTML = "";

  const key =
    "records_" +
    currentUser +
    "_" +
    code;

  const records = JSON.parse(
    localStorage.getItem(key) || "[]"
  );

  records.forEach((record, index) => {
    const card = document.createElement("div");
    card.className = "record-card";

    const title = document.createElement("h4");
    title.textContent =
      (index + 1) +
      "回目の旅行";

    const date = document.createElement("p");
    date.textContent =
      "訪問日：" +
      (record.date || "未入力");

    const place = document.createElement("p");
    place.textContent =
      "訪れた場所：" +
      (record.place || "未入力");

    const deleteButton =
      document.createElement("button");

    deleteButton.textContent =
      "この記録を削除";

    deleteButton.className =
      "delete-record-button";

    deleteButton.addEventListener(
      "click",
      () => {
        records.splice(index, 1);

        localStorage.setItem(
          key,
          JSON.stringify(records)
        );

        showTravelRecords(code);
      }
    );

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(place);
    card.appendChild(deleteButton);

    travelRecordList.appendChild(card);
  });
}


// =========================
// 旅行記録保存
// =========================

saveRecordButton.addEventListener("click", () => {
  if (!selectedCode) return;

  if (!visitDate.value) {
    alert("訪問日を入力してください。");
    return;
  }

  const key =
    "records_" +
    currentUser +
    "_" +
    selectedCode;

  const records = JSON.parse(
    localStorage.getItem(key) || "[]"
  );

  const record = {
    date: visitDate.value,
    place: travelPlace.value.trim()
  };

  records.push(record);

  localStorage.setItem(
    key,
    JSON.stringify(records)
  );

  visitDate.value = "";
  travelPlace.value = "";

  showTravelRecords(selectedCode);
  showRecordList();

  message.textContent =
    prefectureNames[selectedCode] +
    "の旅行記録を保存しました。";
});

// =========================
// 旅行記録一覧
// =========================

function showRecordList() {
  recordList.innerHTML = "";

  let hasRecord = false;

  for (const code in prefectureNames) {
    const key =
      "records_" +
      currentUser +
      "_" +
      code;

    const records = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    records.forEach((record, index) => {
      hasRecord = true;

      const card = document.createElement("div");
      card.className = "list-record-card";

      const title = document.createElement("h3");
      title.textContent =
        prefectureNames[code];

      const number = document.createElement("p");
      number.textContent =
        (index + 1) +
        "回目の旅行";

      const date = document.createElement("p");
      date.textContent =
        "訪問日：" +
        (record.date || "未入力");

      const place = document.createElement("p");
      place.textContent =
        "訪れた場所：" +
        (record.place || "未入力");

      card.appendChild(title);
      card.appendChild(number);
      card.appendChild(date);
      card.appendChild(place);

      recordList.appendChild(card);
    });
  }

  if (!hasRecord) {
    const noRecord =
      document.createElement("p");

    noRecord.className =
      "no-record";

    noRecord.textContent =
      "まだ旅行記録がありません。";

    recordList.appendChild(noRecord);
  }
}

toggleRecordButton.addEventListener("click", () => {
  const isShown =
    recordListSection.classList.toggle("show");

  if (isShown) {
    toggleRecordButton.textContent =
      "旅行記録を閉じる";
  } else {
    toggleRecordButton.textContent =
      "旅行記録を見る";
  }
});
