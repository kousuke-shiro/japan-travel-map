// =========================
// 写真管理
// =========================


// =========================
// セキュリティ設定
// =========================

// 1枚あたり最大2MB
const MAX_PHOTO_SIZE = 2 * 1024 * 1024;

// 1都道府県あたり最大10枚
const MAX_PHOTO_COUNT = 10;

// 許可する画像形式
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);


// =========================
// ログイン確認
// =========================

function isPhotoUserLoggedIn() {

  return (
    typeof currentUser === "string" &&
    currentUser.length > 0
  );
}


// =========================
// 都道府県コード確認
// =========================

function isValidPhotoCode(code) {

  return (
    typeof code === "string" &&
    isValidPrefectureCode(code)
  );
}


// =========================
// 写真保存用キー
// =========================

function getPhotoKey(code) {

  if (!isPhotoUserLoggedIn()) {
    return null;
  }

  if (!isValidPhotoCode(code)) {
    return null;
  }

  return (
    "photos_" +
    currentUser +
    "_" +
    code
  );
}


// =========================
// 保存されている写真の検証
// =========================

function sanitizePhotos(data) {

  if (!Array.isArray(data)) {
    return [];
  }

  const safePhotos = [];


  for (const photo of data) {

    // 文字列以外を拒否
    if (typeof photo !== "string") {
      continue;
    }


    // Data URL形式だけ許可
    if (!photo.startsWith("data:image/")) {
      continue;
    }


    // 許可された画像形式か確認
    let allowed = false;

    for (
      const type of ALLOWED_IMAGE_TYPES
    ) {

      if (
        photo.startsWith(
          "data:" + type + ";base64,"
        )
      ) {
        allowed = true;
        break;
      }
    }


    if (!allowed) {
      continue;
    }


    // 異常に長いData URLを拒否
    // Base64化すると元ファイルより大きくなるため、
    // 少し余裕を持たせて確認する。
    if (
      photo.length >
      MAX_PHOTO_SIZE * 1.5
    ) {
      continue;
    }


    safePhotos.push(photo);


    // 最大枚数
    if (
      safePhotos.length >=
      MAX_PHOTO_COUNT
    ) {
      break;
    }
  }


  return safePhotos;
}


// =========================
// 写真取得
// =========================

function getPhotos(code) {

  const key =
    getPhotoKey(code);

  if (!key) {
    return [];
  }

  const data =
    readJSON(key, []);

  return sanitizePhotos(data);
}


// =========================
// 写真表示
// =========================

function showPhotos(code) {

  photoPreview.innerHTML = "";

  // ログイン確認
  if (!isPhotoUserLoggedIn()) {
    return;
  }

  // 都道府県コード確認
  if (!isValidPhotoCode(code)) {
    return;
  }


  const photos =
    getPhotos(code);


  photos.forEach(
    (photo, index) => {

      // =========================
      // 写真コンテナ
      // =========================

      const photoItem =
        document.createElement("div");

      photoItem.className =
        "photo-item";


      // =========================
      // 画像
      // =========================

      const image =
        document.createElement("img");

      image.src = photo;

      image.alt =
        "旅行の思い出写真 " +
        (index + 1);

      image.loading = "lazy";


      // =========================
      // 拡大表示
      // =========================

      image.addEventListener(
        "click",
        () => {

          // ログイン状態を再確認
          if (!isPhotoUserLoggedIn()) {
            return;
          }

          // 選択中の都道府県を再確認
          if (
            !isValidPhotoCode(code)
          ) {
            return;
          }

          largePhoto.src = photo;

          photoModal.style.display =
            "flex";
        }
      );


      // =========================
      // 削除ボタン
      // =========================

      const deleteButton =
        document.createElement("button");

      deleteButton.textContent = "×";

      deleteButton.className =
        "delete-photo-button";

      deleteButton.type = "button";


      deleteButton.addEventListener(
        "click",
        () => {

          deletePhoto(
            code,
            index
          );
        }
      );


      // =========================
      // HTMLへ追加
      // =========================

      photoItem.appendChild(image);

      photoItem.appendChild(
        deleteButton
      );

      photoPreview.appendChild(
        photoItem
      );
    }
  );
}


// =========================
// 写真削除
// =========================

function deletePhoto(
  code,
  index
) {

  // ログイン確認
  if (!isPhotoUserLoggedIn()) {
    return;
  }

  // 都道府県コード確認
  if (!isValidPhotoCode(code)) {
    return;
  }

  // インデックス確認
  if (
    !Number.isInteger(index) ||
    index < 0
  ) {
    return;
  }


  const key =
    getPhotoKey(code);

  if (!key) {
    return;
  }


  const photos =
    getPhotos(code);


  // 存在しない写真を削除しない
  if (index >= photos.length) {
    return;
  }


  photos.splice(
    index,
    1
  );


  const saved =
    writeJSON(
      key,
      photos
    );


  if (!saved) {

    alert(
      "写真を削除できませんでした。"
    );

    return;
  }


  showPhotos(code);

  message.textContent =
    "写真を削除しました。";
}


// =========================
// 写真保存
// =========================

savePhotoButton.addEventListener(
  "click",
  () => {

    // =========================
    // ログイン確認
    // =========================

    if (!isPhotoUserLoggedIn()) {

      alert(
        "ログインしてください。"
      );

      return;
    }


    // =========================
    // 都道府県確認
    // =========================

    if (
      !selectedCode ||
      !isValidPhotoCode(
        selectedCode
      )
    ) {

      alert(
        "都道府県を正しく選択してください。"
      );

      return;
    }


    // =========================
    // ファイル確認
    // =========================

    const files =
      Array.from(
        photoInput.files || []
      );


    if (files.length === 0) {

      alert(
        "写真を選択してください。"
      );

      return;
    }


    // =========================
    // 現在の写真を取得
    // =========================

    const key =
      getPhotoKey(
        selectedCode
      );

    if (!key) {
      return;
    }


    const oldPhotos =
      getPhotos(
        selectedCode
      );


    // =========================
    // 枚数確認
    // =========================

    if (
      oldPhotos.length >=
      MAX_PHOTO_COUNT
    ) {

      alert(
        "この都道府県には写真を10枚まで保存できます。"
      );

      return;
    }


    const remainingSlots =
      MAX_PHOTO_COUNT -
      oldPhotos.length;


    if (
      files.length >
      remainingSlots
    ) {

      alert(
        "保存できる写真はあと"
        + remainingSlots
        + "枚です。"
      );

      return;
    }


    // =========================
    // ファイル検証
    // =========================

    const validFiles = [];


    for (const file of files) {

      // MIMEタイプ確認
      if (
        !ALLOWED_IMAGE_TYPES.has(
          file.type
        )
      ) {

        alert(
          "JPEG、PNG、WebP、GIF形式の写真だけ保存できます。"
        );

        return;
      }


      // ファイルサイズ確認
      if (
        file.size >
        MAX_PHOTO_SIZE
      ) {

        alert(
          "1枚あたりの写真サイズは2MB以下にしてください。"
        );

        return;
      }


      // 空ファイル拒否
      if (file.size <= 0) {

        alert(
          "空のファイルは保存できません。"
        );

        return;
      }


      validFiles.push(file);
    }


    // =========================
    // 保存処理
    // =========================

    savePhotoFiles(
      selectedCode,
      key,
      oldPhotos,
      validFiles
    );
  }
);


// =========================
// 写真ファイル保存処理
// =========================

function savePhotoFiles(
  code,
  key,
  oldPhotos,
  files
) {

  let completed = 0;

  let failed = false;

  const newPhotos = [];


  files.forEach(
    (file) => {

      const reader =
        new FileReader();


      // =========================
      // 読み込み成功
      // =========================

      reader.onload = () => {

        if (failed) {
          return;
        }


        const result =
          reader.result;


        // Data URLの確認
        if (
          typeof result !== "string"
        ) {

          failed = true;

          alert(
            "写真の読み込みに失敗しました。"
          );

          return;
        }


        // 許可されたData URLか確認
        let allowed = false;

        for (
          const type of ALLOWED_IMAGE_TYPES
        ) {

          if (
            result.startsWith(
              "data:" +
              type +
              ";base64,"
            )
          ) {

            allowed = true;

            break;
          }
        }


        if (!allowed) {

          failed = true;

          alert(
            "許可されていない画像形式です。"
          );

          return;
        }


        // Data URLが大きすぎないか確認
        if (
          result.length >
          MAX_PHOTO_SIZE * 1.5
        ) {

          failed = true;

          alert(
            "写真のデータサイズが大きすぎます。"
          );

          return;
        }


        newPhotos.push(result);

        completed++;


        // =========================
        // 全ファイル完了
        // =========================

        if (
          completed === files.length
        ) {

          const allPhotos =
            oldPhotos.concat(
              newPhotos
            );


          // 最終枚数確認
          if (
            allPhotos.length >
            MAX_PHOTO_COUNT
          ) {

            failed = true;

            alert(
              "写真の保存枚数が上限を超えています。"
            );

            return;
          }


          // =========================
          // LocalStorage保存
          // =========================

          const saved =
            writeJSON(
              key,
              allPhotos
            );


          if (!saved) {

            failed = true;

            alert(
              "写真を保存できませんでした。ブラウザの保存容量を確認してください。"
            );

            return;
          }


          // =========================
          // 入力欄クリア
          // =========================

          photoInput.value = "";


          // =========================
          // 表示更新
          // =========================

          showPhotos(code);


          message.textContent =
            "写真を保存しました。";
        }
      };


      // =========================
      // 読み込みエラー
      // =========================

      reader.onerror = () => {

        if (failed) {
          return;
        }

        failed = true;

        alert(
          "写真の読み込みに失敗しました。"
        );
      };


      // =========================
      // 読み込み開始
      // =========================

      reader.readAsDataURL(
        file
      );
    }
  );
}


// =========================
// 写真モーダルを閉じる
// =========================

closePhotoModal.addEventListener(
  "click",
  () => {

    photoModal.style.display =
      "none";

    largePhoto.src = "";
  }
);


photoModal.addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      photoModal
    ) {

      photoModal.style.display =
        "none";

      largePhoto.src = "";
    }
  }
);