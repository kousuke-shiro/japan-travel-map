// =========================
// ログイン画面
// =========================

const loginScreen =
  document.getElementById("login-screen");

const loginId =
  document.getElementById("login-id");

const loginPassword =
  document.getElementById("login-password");

const loginButton =
  document.getElementById("login-button");

const showRegisterButton =
  document.getElementById("show-register-button");

const loginMessage =
  document.getElementById("login-message");

// =========================
// 新規登録画面
// =========================

const registerScreen =
  document.getElementById("register-screen");

const registerId =
  document.getElementById("register-id");

const registerPassword =
  document.getElementById("register-password");

const registerButton =
  document.getElementById("register-button");

const backLoginButton =
  document.getElementById("back-login-button");

const registerMessage =
  document.getElementById("register-message");

// =========================
// 旅行画面
// =========================

const travelScreen =
  document.getElementById("travel-screen");

const userName =
  document.getElementById("user-name");

const logoutButton =
  document.getElementById("logout-button");

const message =
  document.getElementById("message");

// =========================
// 日本地図
// =========================

const mapContainer =
  document.getElementById("map");

const count =
  document.getElementById("count");

// =========================
// モーダル
// =========================

const confirmModal =
  document.getElementById("confirm-modal");

const modalTitle =
  document.getElementById("modal-title");

const confirmMessage =
  document.getElementById("confirm-message");

const confirmButton =
  document.getElementById("confirm-button");

const cancelButton =
  document.getElementById("cancel-button");

const visitCount =
  document.getElementById("visit-count");

const addVisitButton =
  document.getElementById("add-visit-button");

const removeVisitButton =
  document.getElementById("remove-visit-button");

const unvisitButton =
  document.getElementById("unvisit-button");

// =========================
// 写真
// =========================

const photoInput =
  document.getElementById("photo-input");

const savePhotoButton =
  document.getElementById("save-photo-button");

const photoPreview =
  document.getElementById("photo-preview");

const photoModal =
  document.getElementById("photo-modal");

const largePhoto =
  document.getElementById("large-photo");

const closePhotoModal =
  document.getElementById("close-photo-modal");

// =========================
// 旅行記録
// =========================

const visitDate =
  document.getElementById("visit-date");

const travelPlace =
  document.getElementById("travel-place");

const saveRecordButton =
  document.getElementById("save-record-button");

const travelRecordList =
  document.getElementById("travel-record-list");

const recordList =
  document.getElementById("record-list");

// =========================
// 進捗
// =========================

const progressPercent =
  document.getElementById("progress-percent");

const progressBarFill =
  document.getElementById("progress-bar-fill");

const progressCount =
  document.getElementById("progress-count");

const regionProgress =
  document.getElementById("region-progress");

// =========================
// 現在の状態
// =========================

let currentUser = null;

let selectedCode = null;












const toggleRecordButton =
  document.getElementById("toggle-record-button");

  const recordListSection =
  document.getElementById("record-list-section");