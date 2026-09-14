// =========================
// 旅行記録
// =========================


// =========================
// 設定
// =========================

// 1都道府県あたりの最大旅行記録数
const MAX_RECORDS_PER_PREFECTURE = 20;

// 訪れた場所の最大文字数
const MAX_PLACE_LENGTH = 200;


// =========================
// ログイン確認
// =========================

function isRecordUserLoggedIn() {

  return (
    typeof currentUser === "string" &&
    currentUser.length > 0
  );
}


// =========================
// 記録キー作成
// =========================

function getRecordKey(code) {

  if (!isRecordUserLoggedIn()) {
    return null;
  }

  if (!isValidPrefectureCode(code)) {
    return null;
  }

  return "records_" + currentUser + "_" + code;
}


// =========================
// 記録データの検証
// =========================

function sanitizeRecords(data) {

  if (!Array.isArray(data)) {
    return [];
  }

  const safeRecords = [];

  data.forEach((record) => {

    if (
      !record ||
      typeof record !== "object" ||
      Array.isArray(record)
    ) {
      return;
    }


    // 日付
    let date = "";

    if (typeof record.date === "string") {
      date = record.date;
    }

    // YYYY-MM-DD形式
    if (
      date !== "" &&
      !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
      return;
    }


    // 日付が実在する日付か確認
    if (date !== "") {

      const dateObject = new Date(
        date + "T00:00:00"
      );

      if (
        Number.isNaN(
          dateObject.getTime()
        )
      ) {
        return;
      }

      const year =
        dateObject.getFullYear();

      const month =
        String(
          dateObject.getMonth() + 1
        ).padStart(2, "0");

      const day =
        String(
          dateObject.getDate()
        ).padStart(2, "0");

      const normalizedDate =
        year + "-" + month + "-" + day;

      if (normalizedDate !== date) {
        return;
      }
    }


    // 訪れた場所
    let place = "";

    if (typeof record.place === "string") {
      place = record.place.trim();
    }

    // 長すぎるデータを拒否
    if (place.length > MAX_PLACE_LENGTH) {
      return;
    }


    safeRecords.push({
      date: date,
      place: place
    });


    // 最大件数
    if (
      safeRecords.length >=
      MAX_RECORDS_PER_PREFECTURE
    ) {
      return;
    }
  });

  return safeRecords;
}


// =========================
// 記録取得
// =========================

function getTravelRecords(code) {

  const key = getRecordKey(code);

  if (!key) {
    return [];
  }

  const data = readJSON(key, []);

  return sanitizeRecords(data);
}


// =========================
// 記録表示
// =========================

function showTravelRecords(code) {

  travelRecordList.innerHTML = "";

  // ログイン確認
  if (!isRecordUserLoggedIn()) {
    return;
  }

  // 都道府県コード確認
  if (!isValidPrefectureCode(code)) {
    return;
  }

  const records =
    getTravelRecords(code);


  records.forEach((record, index) => {

    const card =
      document.createElement("div");

    card.className =
      "record-card";


    // =========================
    // タイトル
    // =========================

    const title =
      document.createElement("h4");

    title.textContent =
      (index + 1) + "回目の旅行";


    // =========================
    // 日付
    // =========================

    const date =
      document.createElement("p");

    date.textContent =
      "訪問日：" +
      (record.date || "未入力");


    // =========================
    // 場所
    // =========================

    const place =
      document.createElement("p");

    place.textContent =
      "訪れた場所：" +
      (record.place || "未入力");


    // =========================
    // 削除ボタン
    // =========================

    const deleteButton =
      document.createElement("button");

    deleteButton.textContent =
      "この記録を削除";

    deleteButton.className =
      "delete-record-button";


    deleteButton.addEventListener(
      "click",
      () => {

        deleteTravelRecord(
          code,
          index
        );
      }
    );


    // =========================
    // HTMLへ追加
    // =========================

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(place);
    card.appendChild(deleteButton);

    travelRecordList.appendChild(card);
  });
}


// =========================
// 記録削除
// =========================

function deleteTravelRecord(
  code,
  index
) {

  // ログイン確認
  if (!isRecordUserLoggedIn()) {
    return;
  }

  // 都道府県コード確認
  if (!isValidPrefectureCode(code)) {
    return;
  }

  // 整数以外を拒否
  if (
    !Number.isInteger(index) ||
    index < 0
  ) {
    return;
  }

  const key =
    getRecordKey(code);

  if (!key) {
    return;
  }

  const records =
    getTravelRecords(code);


  // 存在しない記録を削除しない
  if (index >= records.length) {
    return;
  }


  records.splice(index, 1);


  const saved =
    writeJSON(key, records);

  if (!saved) {

    alert(
      "記録を削除できませんでした。"
    );

    return;
  }


  // 表示更新
  showTravelRecords(code);
  showRecordList();

  message.textContent =
    "旅行記録を削除しました。";
}


// =========================
// 記録保存
// =========================

saveRecordButton.addEventListener(
  "click",
  () => {

    // =========================
    // ログイン確認
    // =========================

    if (!isRecordUserLoggedIn()) {

      alert(
        "ログインしてください。"
      );

      return;
    }


    // =========================
    // 都道府県コード確認
    // =========================

    if (
      !selectedCode ||
      !isValidPrefectureCode(
        selectedCode
      )
    ) {

      alert(
        "都道府県を正しく選択してください。"
      );

      return;
    }


    // =========================
    // 日付確認
    // =========================

    const date =
      visitDate.value;


    if (!date) {

      alert(
        "訪問日を入力してください。"
      );

      return;
    }


    // HTMLのdate入力だけに頼らず
    // JavaScript側でも検証する

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {

      alert(
        "訪問日を正しく入力してください。"
      );

      return;
    }


    // =========================
    // 実在する日付か確認
    // =========================

    const dateObject =
      new Date(
        date + "T00:00:00"
      );


    if (
      Number.isNaN(
        dateObject.getTime()
      )
    ) {

      alert(
        "訪問日を正しく入力してください。"
      );

      return;
    }


    const normalizedDate =
      dateObject.getFullYear()
      + "-"
      + String(
          dateObject.getMonth() + 1
        ).padStart(2, "0")
      + "-"
      + String(
          dateObject.getDate()
        ).padStart(2, "0");


    if (
      normalizedDate !== date
    ) {

      alert(
        "存在しない日付です。"
      );

      return;
    }


    // =========================
    // 場所確認
    // =========================

    const place =
      travelPlace.value.trim();


    if (
      place.length >
      MAX_PLACE_LENGTH
    ) {

      alert(
        "訪れた場所は200文字以内で入力してください。"
      );

      return;
    }


    // =========================
    // 現在の記録を取得
    // =========================

    const key =
      getRecordKey(
        selectedCode
      );

    if (!key) {
      return;
    }


    const records =
      getTravelRecords(
        selectedCode
      );


    // =========================
    // 記録数制限
    // =========================

    if (
      records.length >=
      MAX_RECORDS_PER_PREFECTURE
    ) {

      alert(
        "この都道府県の旅行記録は20件まで保存できます。"
      );

      return;
    }


    // =========================
    // 新しい記録
    // =========================

    const record = {
      date: date,
      place: place
    };


    records.push(record);


    // =========================
    // 保存
    // =========================

    const saved =
      writeJSON(
        key,
        records
      );


    if (!saved) {

      alert(
        "旅行記録を保存できませんでした。"
      );

      return;
    }


    // =========================
    // 入力欄をクリア
    // =========================

    visitDate.value = "";
    travelPlace.value = "";


    // =========================
    // 表示更新
    // =========================

    showTravelRecords(
      selectedCode
    );

    showRecordList();


    message.textContent =
      prefectureNames[
        selectedCode
      ] +
      "の旅行記録を保存しました。";
  }
);


// =========================
// 全旅行記録一覧
// =========================

function showRecordList() {

  recordList.innerHTML = "";

  // ログインしていない場合
  if (!isRecordUserLoggedIn()) {
    return;
  }


  let hasRecord = false;


  // =========================
  // 47都道府県を確認
  // =========================

  Object.keys(
    prefectureNames
  ).forEach((code) => {

    // 不正コードを除外
    if (
      !isValidPrefectureCode(code)
    ) {
      return;
    }


    const records =
      getTravelRecords(code);


    records.forEach(
      (record, index) => {

        hasRecord = true;


        // =========================
        // カード
        // =========================

        const card =
          document.createElement("div");

        card.className =
          "list-record-card";


        // =========================
        // 都道府県名
        // =========================

        const title =
          document.createElement("h3");

        title.textContent =
          prefectureNames[code];


        // =========================
        // 回数
        // =========================

        const number =
          document.createElement("p");

        number.textContent =
          (index + 1) +
          "回目の旅行";


        // =========================
        // 日付
        // =========================

        const date =
          document.createElement("p");

        date.textContent =
          "訪問日：" +
          (record.date || "未入力");


        // =========================
        // 場所
        // =========================

        const place =
          document.createElement("p");

        place.textContent =
          "訪れた場所：" +
          (record.place || "未入力");


        // =========================
        // カードに追加
        // =========================

        card.appendChild(title);
        card.appendChild(number);
        card.appendChild(date);
        card.appendChild(place);

        recordList.appendChild(card);
      }
    );
  });


  // =========================
  // 記録がない場合
  // =========================

  if (!hasRecord) {

    const emptyMessage =
      document.createElement("p");

    emptyMessage.textContent =
      "まだ旅行記録がありません。";

    recordList.appendChild(
      emptyMessage
    );
  }
}


// =========================
// 旅行記録一覧の表示切り替え
// =========================

toggleRecordButton.addEventListener(
  "click",
  () => {

    if (!isRecordUserLoggedIn()) {
      return;
    }

    recordListSection.classList.toggle("show");

    if (
      recordListSection.classList.contains("show")
    ) {
      toggleRecordButton.textContent =
        "旅行記録を隠す";
    } else {
      toggleRecordButton.textContent =
        "旅行記録を見る";
    }
  }
);