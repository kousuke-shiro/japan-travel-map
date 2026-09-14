// =========================
// 認証・画面切り替え
// =========================


// =========================
// セキュリティ設定
// =========================

// PBKDF2の反復回数
const PASSWORD_ITERATIONS = 200000;

// saltのサイズ
const SALT_LENGTH = 16;

// ハッシュのサイズ
const HASH_LENGTH = 256;

// ログイン失敗回数
const MAX_LOGIN_ATTEMPTS = 5;

// ログイン停止時間
const LOGIN_LOCK_TIME = 30000;

// ログイン失敗回数
let failedLoginAttempts = 0;

// ログイン停止終了時刻
let loginLockedUntil = 0;

// 使用禁止ID
const RESERVED_IDS = new Set([
  "__proto__",
  "prototype",
  "constructor"
]);


// =========================
// 暗号機能確認
// =========================

function isCryptoAvailable() {
  return (
    window.crypto &&
    window.crypto.subtle &&
    window.crypto.getRandomValues
  );
}


// =========================
// Uint8Array → Base64
// =========================

function bytesToBase64(bytes) {
  let binary = "";

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}


// =========================
// Base64 → Uint8Array
// =========================

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}


// =========================
// パスワードをハッシュ化
// =========================

async function createPasswordHash(password) {

  if (!isCryptoAvailable()) {
    throw new Error("暗号機能が利用できません。");
  }

  const encoder = new TextEncoder();

  // ランダムなsaltを作成
  const salt = window.crypto.getRandomValues(
    new Uint8Array(SALT_LENGTH)
  );

  // パスワードを鍵として読み込む
  const key = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    {
      name: "PBKDF2"
    },
    false,
    ["deriveBits"]
  );

  // PBKDF2でハッシュを作成
  const hashBuffer =
    await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: PASSWORD_ITERATIONS,
        hash: "SHA-256"
      },
      key,
      HASH_LENGTH
    );

  const hash = new Uint8Array(hashBuffer);

  return {
    passwordHash: bytesToBase64(hash),
    salt: bytesToBase64(salt),
    algorithm: "PBKDF2-SHA-256",
    iterations: PASSWORD_ITERATIONS
  };
}


// =========================
// パスワード検証
// =========================

async function verifyPassword(password, user) {

  if (!isCryptoAvailable()) {
    throw new Error("暗号機能が利用できません。");
  }

  if (
    !user ||
    typeof user.passwordHash !== "string" ||
    typeof user.salt !== "string" ||
    user.algorithm !== "PBKDF2-SHA-256" ||
    user.iterations !== PASSWORD_ITERATIONS
  ) {
    return false;
  }

  try {

    const encoder = new TextEncoder();

    const salt = base64ToBytes(user.salt);
    const storedHash = base64ToBytes(
      user.passwordHash
    );

    // 想定外のsalt・ハッシュを拒否
    if (salt.length !== SALT_LENGTH) {
      return false;
    }

    if (storedHash.length !== HASH_LENGTH / 8) {
      return false;
    }

    const key = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      {
        name: "PBKDF2"
      },
      false,
      ["deriveBits"]
    );

    const hashBuffer =
      await window.crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: PASSWORD_ITERATIONS,
          hash: "SHA-256"
        },
        key,
        HASH_LENGTH
      );

    const calculatedHash =
      new Uint8Array(hashBuffer);

    return constantTimeEqual(
      calculatedHash,
      storedHash
    );

  } catch (error) {

    console.error(
      "パスワード検証に失敗しました。",
      error
    );

    return false;
  }
}


// =========================
// ハッシュ比較
// =========================

function constantTimeEqual(a, b) {

  if (
    !(a instanceof Uint8Array) ||
    !(b instanceof Uint8Array)
  ) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  let difference = 0;

  for (let i = 0; i < a.length; i++) {
    difference |= a[i] ^ b[i];
  }

  return difference === 0;
}


// =========================
// IDチェック
// =========================

function isValidUserId(id) {

  if (typeof id !== "string") {
    return false;
  }

  // 3～32文字
  if (id.length < 3 || id.length > 32) {
    return false;
  }

  // 空白を禁止
  if (/\s/.test(id)) {
    return false;
  }

  // 特殊なIDを禁止
  if (RESERVED_IDS.has(id.toLowerCase())) {
    return false;
  }

  return true;
}


// =========================
// パスワードチェック
// =========================

function isValidNewPassword(password) {

  if (typeof password !== "string") {
    return false;
  }

  // 8～128文字
  if (password.length < 8) {
    return false;
  }

  if (password.length > 128) {
    return false;
  }

  return true;
}


// =========================
// ログイン停止確認
// =========================

function isLoginLocked() {

  return Date.now() < loginLockedUntil;
}


// =========================
// ログイン失敗処理
// =========================

function registerLoginFailure() {

  failedLoginAttempts++;

  if (
    failedLoginAttempts >= MAX_LOGIN_ATTEMPTS
  ) {
    loginLockedUntil =
      Date.now() + LOGIN_LOCK_TIME;

    failedLoginAttempts = 0;

    return true;
  }

  return false;
}


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

  // ログインしていなければ表示しない
  if (!currentUser) {
    showLoginScreen();
    return;
  }

  loginScreen.style.display = "none";
  registerScreen.style.display = "none";
  travelScreen.style.display = "block";

  userName.textContent = currentUser;
}


// =========================
// 新規登録
// =========================

showRegisterButton.addEventListener(
  "click",
  () => {

    loginMessage.textContent = "";

    loginId.value = "";
    loginPassword.value = "";

    registerId.value = "";
    registerPassword.value = "";

    registerMessage.textContent = "";

    showRegisterScreen();
  }
);


registerButton.addEventListener(
  "click",
  async () => {

    if (!isCryptoAvailable()) {

      registerMessage.textContent =
        "安全な暗号機能が利用できません。HTTPSまたはlocalhostで開いてください。";

      return;
    }

    const id = registerId.value.trim();
    const password = registerPassword.value;

    // IDチェック
    if (!id) {

      registerMessage.textContent =
        "IDを入力してください。";

      return;
    }

    if (!isValidUserId(id)) {

      registerMessage.textContent =
        "IDは3～32文字で、空白を含めないでください。";

      return;
    }

    // パスワードチェック
    if (!password) {

      registerMessage.textContent =
        "パスワードを入力してください。";

      return;
    }

    if (!isValidNewPassword(password)) {

      registerMessage.textContent =
        "パスワードは8～128文字で設定してください。";

      return;
    }

    registerButton.disabled = true;

    try {

      const users = getUsers();

      // 自分自身のプロパティとして存在するか確認
      if (
        Object.prototype.hasOwnProperty.call(
          users,
          id
        )
      ) {

        registerMessage.textContent =
          "そのIDはすでに使用されています。";

        return;
      }

      // パスワードをハッシュ化
      const securePassword =
        await createPasswordHash(password);

      users[id] = securePassword;

      const saved = saveUsers(users);

      if (!saved) {

        registerMessage.textContent =
          "ユーザー情報を保存できませんでした。";

        return;
      }

      // 入力欄を完全にクリア
      registerId.value = "";
      registerPassword.value = "";

      loginId.value = "";
      loginPassword.value = "";

      registerMessage.textContent = "";

      showLoginScreen();

      loginMessage.textContent =
        "登録が完了しました。ログインしてください。";

    } catch (error) {

      console.error(
        "ユーザー登録に失敗しました。",
        error
      );

      registerMessage.textContent =
        "登録処理に失敗しました。";

    } finally {

      registerButton.disabled = false;
    }
  }
);


// =========================
// ログイン画面へ戻る
// =========================

backLoginButton.addEventListener(
  "click",
  () => {

    registerId.value = "";
    registerPassword.value = "";

    loginId.value = "";
    loginPassword.value = "";

    registerMessage.textContent = "";

    showLoginScreen();
  }
);


// =========================
// ログイン
// =========================

loginButton.addEventListener(
  "click",
  async () => {

    // ロック中
    if (isLoginLocked()) {

      const remaining =
        Math.ceil(
          (loginLockedUntil - Date.now()) / 1000
        );

      loginMessage.textContent =
        "ログインを一時停止しています。"
        + remaining
        + "秒後に再試行してください。";

      return;
    }


    if (!isCryptoAvailable()) {

      loginMessage.textContent =
        "安全な暗号機能が利用できません。HTTPSまたはlocalhostで開いてください。";

      return;
    }


    const id = loginId.value.trim();
    const password = loginPassword.value;

    const users = getUsers();

    let loginSuccess = false;


    try {

      const user =
        Object.prototype.hasOwnProperty.call(
          users,
          id
        )
          ? users[id]
          : null;


      // =========================
      // 新しい安全な形式
      // =========================

      if (
        user &&
        typeof user.passwordHash === "string" &&
        typeof user.salt === "string"
      ) {

        loginSuccess =
          await verifyPassword(
            password,
            user
          );
      }


      // =========================
      // 古い形式
      // =========================

      /*
        以前のサイトでは

        {
          password: "パスワード"
        }

        という形式で保存していた。

        正しいパスワードでログインできた場合だけ、
        新しいPBKDF2形式へ移行する。
      */

      else if (
        user &&
        typeof user.password === "string"
      ) {

        loginSuccess =
          user.password === password;


        // 正しいパスワードなら
        // その場で安全な形式へ移行
        if (loginSuccess) {

          const securePassword =
            await createPasswordHash(
              password
            );

          users[id] = securePassword;

          const saved =
            saveUsers(users);

          if (!saved) {
            loginSuccess = false;
          }
        }
      }


      // =========================
      // ログイン失敗
      // =========================

      if (!loginSuccess) {

        const locked =
          registerLoginFailure();

        if (locked) {

          loginMessage.textContent =
            "ログインに5回失敗したため、30秒間停止します。";

        } else {

          loginMessage.textContent =
            "IDまたはパスワードが違います。";
        }

        return;
      }


      // =========================
      // ログイン成功
      // =========================

      failedLoginAttempts = 0;
      loginLockedUntil = 0;

      currentUser = id;

      // 入力欄をクリア
      loginId.value = "";
      loginPassword.value = "";

      loginMessage.textContent = "";

      showTravelScreen();

      loadMap();

      showRecordList();

    } catch (error) {

      console.error(
        "ログイン処理に失敗しました。",
        error
      );

      loginMessage.textContent =
        "ログイン処理に失敗しました。";

    }
  }
);


// =========================
// ログアウト
// =========================

logoutButton.addEventListener(
  "click",
  () => {

    currentUser = null;
    selectedCode = null;

    // モーダルを閉じる
    if (typeof closeModal === "function") {
      closeModal();
    }

    // 写真モーダルを閉じる
    if (
      typeof photoModal !== "undefined" &&
      photoModal
    ) {
      photoModal.style.display = "none";
    }

    // 地図を削除
    mapContainer.innerHTML = "";

    // 表示情報をクリア
    userName.textContent = "";

    recordList.innerHTML = "";
    travelRecordList.innerHTML = "";
    photoPreview.innerHTML = "";

    loginId.value = "";
    loginPassword.value = "";

    message.textContent = "";

    showLoginScreen();
  }
);