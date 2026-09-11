// =========================
// 写真
// =========================

function showPhotos(code) {
  photoPreview.innerHTML = "";

  const photos = JSON.parse(
    localStorage.getItem("photos_" + currentUser + "_" + code) || "[]"
  );

  photos.forEach((photo, index) => {
    const photoItem = document.createElement("div");
    photoItem.className = "photo-item";

    const image = document.createElement("img");
    image.src = photo;

    image.addEventListener("click", () => {
      largePhoto.src = photo;
      photoModal.style.display = "flex";
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "×";
    deleteButton.className = "delete-photo-button";

    deleteButton.addEventListener("click", () => {
      deletePhoto(code, index);
    });

    photoItem.appendChild(image);
    photoItem.appendChild(deleteButton);
    photoPreview.appendChild(photoItem);
  });
}

function deletePhoto(code, index) {
  const key = "photos_" + currentUser + "_" + code;

  const photos = JSON.parse(
    localStorage.getItem(key) || "[]"
  );

  photos.splice(index, 1);

  localStorage.setItem(key, JSON.stringify(photos));
  showPhotos(code);
}

// =========================
// 写真追加
// =========================

savePhotoButton.addEventListener("click", () => {
  if (!selectedCode) return;

  const files = Array.from(photoInput.files);

  if (files.length === 0) {
    alert("写真を選択してください。");
    return;
  }

  const key =
    "photos_" +
    currentUser +
    "_" +
    selectedCode;

  const oldPhotos = JSON.parse(
    localStorage.getItem(key) || "[]"
  );

  let completed = 0;

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) {
      completed++;
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      oldPhotos.push(reader.result);
      completed++;

      if (completed === files.length) {
        try {
          localStorage.setItem(
            key,
            JSON.stringify(oldPhotos)
          );

          photoInput.value = "";
          showPhotos(selectedCode);

        } catch (error) {
          alert(
            "写真の保存容量を超えました。写真の枚数やサイズを減らしてください。"
          );

          console.error(error);
        }
      }
    };

    reader.readAsDataURL(file);
  });
});

// =========================
// 写真拡大
// =========================

closePhotoModal.addEventListener("click", () => {
  photoModal.style.display = "none";
  largePhoto.src = "";
});

photoModal.addEventListener("click", (event) => {
  if (event.target === photoModal) {
    photoModal.style.display = "none";
    largePhoto.src = "";
  }
});
