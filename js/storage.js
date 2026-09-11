// =========================
// ユーザー情報
// =========================

function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// =========================
// 訪問情報
// =========================

function getVisits() {
  return JSON.parse(localStorage.getItem("visits_" + currentUser) || "{}");
}

function saveVisits(visits) {
  localStorage.setItem("visits_" + currentUser, JSON.stringify(visits));
}

function updateVisitedCount() {
  const visits = getVisits();
  count.textContent = Object.keys(visits).length;
  updateProgress();
}
