// =========================
// LocalStorage 安全処理
// =========================

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);

    if (raw === null) {
      return fallback;
    }

    return JSON.parse(raw);

  } catch (error) {
    console.error("データの読み込みに失敗しました:", key, error);
    return fallback;
  }
}


function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;

  } catch (error) {
    console.error("データの保存に失敗しました:", key, error);
    return false;
  }
}


// =========================
// 都道府県コード確認
// =========================

function isValidPrefectureCode(code) {
  if (typeof prefectureNames === "undefined") {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(
    prefectureNames,
    code
  );
}


// =========================
// ユーザー情報
// =========================

function getUsers() {
  const users = readJSON("users", {});

  if (
    !users ||
    typeof users !== "object" ||
    Array.isArray(users)
  ) {
    return {};
  }

  const safeUsers = Object.create(null);

  Object.keys(users).forEach((id) => {
    const user = users[id];

    if (
      !user ||
      typeof user !== "object" ||
      Array.isArray(user)
    ) {
      return;
    }

    // 新しい安全な形式
    if (
      typeof user.passwordHash === "string" &&
      typeof user.salt === "string" &&
      user.algorithm === "PBKDF2-SHA-256" &&
      user.iterations === 200000
    ) {
      safeUsers[id] = {
        passwordHash: user.passwordHash,
        salt: user.salt,
        algorithm: user.algorithm,
        iterations: user.iterations
      };

      return;
    }

    // 以前の形式
    // auth.jsでログイン成功時に安全な形式へ移行する
    if (
      typeof user.password === "string" &&
      user.password.length <= 128
    ) {
      safeUsers[id] = {
        password: user.password
      };
    }
  });

  return safeUsers;
}


function saveUsers(users) {
  if (
    !users ||
    typeof users !== "object" ||
    Array.isArray(users)
  ) {
    return false;
  }

  const safeUsers = Object.create(null);

  Object.keys(users).forEach((id) => {
    const user = users[id];

    if (
      !user ||
      typeof user !== "object" ||
      Array.isArray(user)
    ) {
      return;
    }

    // 新しい安全な形式
    if (
      typeof user.passwordHash === "string" &&
      typeof user.salt === "string" &&
      user.algorithm === "PBKDF2-SHA-256" &&
      user.iterations === 200000
    ) {
      safeUsers[id] = {
        passwordHash: user.passwordHash,
        salt: user.salt,
        algorithm: user.algorithm,
        iterations: user.iterations
      };

      return;
    }

    // 古い形式
    // 既存ユーザーを一時的に維持するため
    if (
      typeof user.password === "string" &&
      user.password.length <= 128
    ) {
      safeUsers[id] = {
        password: user.password
      };
    }
  });

  return writeJSON("users", safeUsers);
}


// =========================
// 訪問情報
// =========================

function getVisits() {
  if (!currentUser) {
    return {};
  }

  const key = "visits_" + currentUser;
  const data = readJSON(key, {});

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    return {};
  }

  const safeVisits = {};

  Object.keys(data).forEach((code) => {

    // 存在する都道府県だけ許可
    if (!isValidPrefectureCode(code)) {
      return;
    }

    const visit = data[code];

    if (
      !visit ||
      typeof visit !== "object" ||
      Array.isArray(visit)
    ) {
      return;
    }

    const countValue = Number(visit.count);

    // 訪問回数は1～9999回まで
    if (
      !Number.isInteger(countValue) ||
      countValue < 1 ||
      countValue > 9999
    ) {
      return;
    }

    safeVisits[code] = {
      count: countValue
    };
  });

  return safeVisits;
}


function saveVisits(visits) {
  if (!currentUser) {
    return false;
  }

  if (
    !visits ||
    typeof visits !== "object" ||
    Array.isArray(visits)
  ) {
    return false;
  }

  const safeVisits = {};

  Object.keys(visits).forEach((code) => {

    if (!isValidPrefectureCode(code)) {
      return;
    }

    const visit = visits[code];

    if (
      !visit ||
      typeof visit !== "object" ||
      Array.isArray(visit)
    ) {
      return;
    }

    const countValue = Number(visit.count);

    if (
      !Number.isInteger(countValue) ||
      countValue < 1 ||
      countValue > 9999
    ) {
      return;
    }

    safeVisits[code] = {
      count: countValue
    };
  });

  return writeJSON(
    "visits_" + currentUser,
    safeVisits
  );
}


// =========================
// 訪問済み件数
// =========================

function updateVisitedCount() {
  const visits = getVisits();

  count.textContent = Object.keys(visits).length;

  updateProgress();
}