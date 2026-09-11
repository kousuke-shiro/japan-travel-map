// =========================
// 画面切り替え
// =========================

function showLoginScreen() {
  loginScreen.style.display = "block";
  registerScreen.style.display = "none";
  travelScreen.style.display = "none";
}

function showRegisterScreen() {
  loginScreen.style.display = "none";
  registerScreen.style.display = "block";
  travelScreen.style.display = "none";
}

function showTravelScreen() {
  loginScreen.style.display = "none";
  registerScreen.style.display = "none";
  travelScreen.style.display = "block";
  userName.textContent = currentUser;
}

// =========================
// 新規登録
// =========================

showRegisterButton.addEventListener("click", () => {
  loginMessage.textContent = "";

  loginId.value = "";
  loginPassword.value = "";

  registerId.value = "";
  registerPassword.value = "";

  showRegisterScreen();
});

registerButton.addEventListener("click", () => {
  const id = registerId.value.trim();
  const password = registerPassword.value;

  if (!id || !password) {
    registerMessage.textContent =
      "IDとパスワードを入力してください。";
    return;
  }

  const users = getUsers();

  if (users[id]) {
    registerMessage.textContent =
      "そのIDはすでに使用されています。";
    return;
  }

  users[id] = {
    password: password
  };

  saveUsers(users);

  registerId.value = "";
  registerPassword.value = "";

  loginId.value = "";
  loginPassword.value = "";

  registerMessage.textContent = "";

  showLoginScreen();

  loginMessage.textContent =
    "登録が完了しました。ログインしてください。";
});

backLoginButton.addEventListener("click", () => {
  registerId.value = "";
  registerPassword.value = "";

  loginId.value = "";
  loginPassword.value = "";

  registerMessage.textContent = "";

  showLoginScreen();
});


// =========================
// ログイン
// =========================

loginButton.addEventListener("click", () => {
  const id = loginId.value.trim();
  const password = loginPassword.value;
  const users = getUsers();

  if (!users[id] || users[id].password !== password) {
    loginMessage.textContent =
      "IDまたはパスワードが違います。";
    return;
  }

  currentUser = id;

  loginId.value = "";
  loginPassword.value = "";

  loginMessage.textContent = "";

  showTravelScreen();
  loadMap();
  showRecordList();
});


// =========================
// ログアウト
// =========================

logoutButton.addEventListener("click", () => {
  currentUser = null;

  mapContainer.innerHTML = "";
  userName.textContent = "";

  loginId.value = "";
  loginPassword.value = "";

  message.textContent = "";

  showLoginScreen();
});
