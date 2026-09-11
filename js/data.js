// =========================
// 日本地図
// =========================

const map = "https://raw.githubusercontent.com/geolonia/japanese-prefectures/master/map-full.svg";

const areas = {
  "01": "hokkaido",
  "02": "tohoku", "03": "tohoku", "04": "tohoku", "05": "tohoku", "06": "tohoku", "07": "tohoku",
  "08": "kanto", "09": "kanto", "10": "kanto", "11": "kanto", "12": "kanto", "13": "kanto", "14": "kanto",
  "15": "chubu", "16": "chubu", "17": "chubu", "18": "chubu", "19": "chubu", "20": "chubu", "21": "chubu", "22": "chubu", "23": "chubu",
  "24": "kinki", "25": "kinki", "26": "kinki", "27": "kinki", "28": "kinki", "29": "kinki", "30": "kinki",
  "31": "chugoku", "32": "chugoku", "33": "chugoku", "34": "chugoku", "35": "chugoku",
  "36": "shikoku", "37": "shikoku", "38": "shikoku", "39": "shikoku",
  "40": "kyushu", "41": "kyushu", "42": "kyushu", "43": "kyushu", "44": "kyushu", "45": "kyushu", "46": "kyushu", "47": "kyushu"
};

const regionNames = {
  hokkaido: "北海道",
  tohoku: "東北",
  kanto: "関東",
  chubu: "中部",
  kinki: "近畿",
  chugoku: "中国",
  shikoku: "四国",
  kyushu: "九州"
};

const regionTotals = {
  hokkaido: 1,
  tohoku: 6,
  kanto: 7,
  chubu: 9,
  kinki: 7,
  chugoku: 5,
  shikoku: 4,
  kyushu: 8
};

const prefectureNames = {
  "01": "北海道", "02": "青森県", "03": "岩手県", "04": "宮城県", "05": "秋田県", "06": "山形県", "07": "福島県",
  "08": "茨城県", "09": "栃木県", "10": "群馬県", "11": "埼玉県", "12": "千葉県", "13": "東京都", "14": "神奈川県",
  "15": "新潟県", "16": "富山県", "17": "石川県", "18": "福井県", "19": "山梨県", "20": "長野県", "21": "岐阜県", "22": "静岡県", "23": "愛知県",
  "24": "三重県", "25": "滋賀県", "26": "京都府", "27": "大阪府", "28": "兵庫県", "29": "奈良県", "30": "和歌山県",
  "31": "鳥取県", "32": "島根県", "33": "岡山県", "34": "広島県", "35": "山口県",
  "36": "徳島県", "37": "香川県", "38": "愛媛県", "39": "高知県",
  "40": "福岡県", "41": "佐賀県", "42": "長崎県", "43": "熊本県", "44": "大分県", "45": "宮崎県", "46": "鹿児島県", "47": "沖縄県"
};
