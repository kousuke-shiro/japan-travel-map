// =========================
// HTML要素
// =========================

const loginScreen = document.getElementById("login-screen");
const registerScreen = document.getElementById("register-screen");
const travelScreen = document.getElementById("travel-screen");
const loginId = document.getElementById("login-id");
const loginPassword = document.getElementById("login-password");
const registerId = document.getElementById("register-id");
const registerPassword = document.getElementById("register-password");
const loginButton = document.getElementById("login-button");
const showRegisterButton = document.getElementById("show-register-button");
const registerButton = document.getElementById("register-button");
const backLoginButton = document.getElementById("back-login-button");
const loginMessage = document.getElementById("login-message");
const registerMessage = document.getElementById("register-message");
const userName = document.getElementById("user-name");
const logoutButton = document.getElementById("logout-button");
const count = document.getElementById("count");
const mapContainer = document.getElementById("map");
const message = document.getElementById("message");
const recordList = document.getElementById("record-list");
const progressPercent = document.getElementById("progress-percent");
const progressBarFill = document.getElementById("progress-bar-fill");
const progressCount = document.getElementById("progress-count");
const regionProgress = document.getElementById("region-progress");
const toggleRecordButton = document.getElementById("toggle-record-button");
const recordListSection = document.getElementById("record-list-section");
const confirmModal = document.getElementById("confirm-modal");
const modalTitle = document.getElementById("modal-title");
const confirmMessage = document.getElementById("confirm-message");
const visitCount = document.getElementById("visit-count");
const addVisitButton = document.getElementById("add-visit-button");
const removeVisitButton = document.getElementById("remove-visit-button");
const visitDate = document.getElementById("visit-date");
const travelPlace = document.getElementById("travel-place");
const saveRecordButton = document.getElementById("save-record-button");
const travelRecordList = document.getElementById("travel-record-list");
const photoInput = document.getElementById("photo-input");
const savePhotoButton = document.getElementById("save-photo-button");
const photoPreview = document.getElementById("photo-preview");
const cancelButton = document.getElementById("cancel-button");
const confirmButton = document.getElementById("confirm-button");
const unvisitButton = document.getElementById("unvisit-button");
const photoModal = document.getElementById("photo-modal");
const largePhoto = document.getElementById("large-photo");
const closePhotoModal = document.getElementById("close-photo-modal");

let currentUser = null;
let selectedCode = null;
