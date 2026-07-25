/**
 * Google Apps Script (GAS) - 列定義
 *
 * スプレッドシートの列位置を各所にハードコードするのをやめ、
 * 1行目（ヘッダー行）から実行時に解決します。
 *
 * フォームの設問が増減しても、ヘッダー名さえ変わらなければコード修正は不要です。
 * 設問文そのものを書き換えた場合のみ、下の COLUMN_DEFS を直してください。
 *
 * ■ 照合ルール
 *   question: ヘッダーセルの「1行目」= 設問番号で照合（例: '4-1-2'）
 *   header:   ヘッダー名の完全一致で照合（管理用の列）
 *
 * ■ 注意: 設問番号は中身と一対一ではありません
 *   2026年のフォーム改訂で番号が繰り上がり、同じ番号が別の内容を指すようになりました。
 *     1-3   旧: 初めて不登校になった学年  →  新: 生まれた年
 *     1-4   旧: 家族構成                  →  新: 初めて不登校になった学年
 *     4-x-2 旧: 通学期間（列ごと削除）    →  新: 選んだ理由
 *     4-x-3 旧: 選んだ理由                →  新: 感想
 *   内部キー（birthYear, school1Reason など）が中身の正であり、
 *   設問番号はあくまでヘッダーを引くための鍵として扱ってください。
 */

const COLUMN_DEFS = {
  // --- セクション1: 基本情報 ---
  timestamp:  { header: 'タイムスタンプ' },
  authorName: { question: '1-2' },  // ペンネーム
  birthYear:  { question: '1-3' },  // 本人の生まれた年
  grade:      { question: '1-4' },  // 初めて不登校になった学年
  family:     { question: '1-5' },  // 家族構成

  // --- セクション2: 不登校のきっかけと経過 ---
  trigger: { question: '2-1' },   // きっかけ（複数選択可）
  detail:  { question: '2-2' },   // なりはじめの頃の状態
  q2_3:    { question: '2-3' },   // 保護者の初動
  q2_4:    { question: '2-4' },   // 子どもの反応
  q2_5:    { question: '2-5' },   // 学校の反応・対応
  q2_6:    { question: '2-6' },   // 初動の振り返り
  q2_7:    { question: '2-7' },   // 不登校1か月の生活
  q2_8:    { question: '2-8' },   // 一番つらかった時期
  q2_9:    { question: '2-9' },   // 改善のきっかけ
  q2_10:   { question: '2-10' },  // さらなる改善
  q2_11:   { question: '2-11' },  // 学校との繋がり
  q2_12:   { question: '2-12' },  // 仕事への影響

  // --- セクション3: 子どもの成長過程 ---
  q3_1: { question: '3-1' },  // 小学生のころ
  q3_2: { question: '3-2' },  // 中学生のころ
  q3_3: { question: '3-3' },  // 高校生のころ
  q3_4: { question: '3-4' },  // 中学卒業後の通信制・定時制

  // --- セクション4: 通信制・定時制の学校情報（最大3校） ---
  school1Name:   { question: '4-1-1' },
  school1Reason: { question: '4-1-2' },  // 選んだ理由
  school1Review: { question: '4-1-3' },  // 感想
  school1Cost:   { question: '4-1-4' },  // 費用
  school1More:   { question: '4-1-5' },  // 他にもあるか

  school2Name:   { question: '4-2-1' },
  school2Reason: { question: '4-2-2' },
  school2Review: { question: '4-2-3' },
  school2Cost:   { question: '4-2-4' },
  school2More:   { question: '4-2-5' },

  school3Name:   { question: '4-3-1' },
  school3Reason: { question: '4-3-2' },
  school3Review: { question: '4-3-3' },
  school3Cost:   { question: '4-3-4' },
  // 4-3 には「他にもあるか」の設問はありません（学校は最大3校のため）

  // --- セクション5: 行政・民間サポートの有無 ---
  q5_1: { question: '5-1' },

  // --- セクション6: 利用したサポート（最大3つ） ---
  support1Type:    { question: '6-1-1' },
  support1Detail:  { question: '6-1-2' },
  support1Freq:    { question: '6-1-3' },
  support1Reason:  { question: '6-1-4' },
  support1Feeling: { question: '6-1-5' },
  support1More:    { question: '6-1-6' },

  support2Type:    { question: '6-2-1' },
  support2Detail:  { question: '6-2-2' },
  support2Freq:    { question: '6-2-3' },
  support2Reason:  { question: '6-2-4' },
  support2Feeling: { question: '6-2-5' },
  support2More:    { question: '6-2-6' },

  support3Type:    { question: '6-3-1' },
  support3Detail:  { question: '6-3-2' },
  support3Freq:    { question: '6-3-3' },
  support3Reason:  { question: '6-3-4' },
  support3Feeling: { question: '6-3-5' },
  // 6-3 には「他にも」の設問はありません（サポートは最大3つのため）

  // --- セクション7: その他のサポートと今の想い ---
  q7_1: { question: '7-1' },
  q7_2: { question: '7-2' },

  // --- 投稿者情報 ---
  consent: { header: '体験談を投稿する前に' },  // 同意チェック（表示・検索の対象外）
  email:   { header: 'メールアドレス' },

  // --- 管理用（フォームの設問ではなく、シート上で手動追加された列） ---
  approvalStatus:      { header: '承認ステータス' },
  approvalDate:        { header: '承認日時' },
  lastEditDate:        { header: '最終編集日時' },
  approvalCount:       { header: '承認回数' },
  rejectReason:        { header: '却下理由' },
  firstSubmitDate:     { header: '初回投稿日時' },
  editCount:           { header: '編集回数' },
  submissionState:     { header: '投稿状態' },
  rejectReasonHistory: { header: '却下理由履歴' }
};

/**
 * 書き込み対象の列。ここがズレるとデータを破壊するため、
 * 解決できなかった場合はエラーで止めます。
 */
const REQUIRED_WRITE_COLUMNS = [
  'approvalStatus',
  'approvalDate',
  'lastEditDate',
  'approvalCount',
  'rejectReason',
  'firstSubmitDate',
  'editCount',
  'submissionState',
  'rejectReasonHistory'
];

// 1回の実行中はヘッダーを何度も解決し直さないようにキャッシュする
var __columnMapCache = null;
var __columnMapCacheKey = null;

/**
 * ヘッダー行から内部キー → 列インデックス（0始まり）のマップを作る
 * @param {Array} headers - シート1行目の値の配列
 * @return {object} - 例: { timestamp: 0, authorName: 1, ... }
 */
function getColumnMap(headers) {
  const cacheKey = headers.join('');
  if (__columnMapCache && __columnMapCacheKey === cacheKey) {
    return __columnMapCache;
  }

  // ヘッダーの照合トークン → 列インデックス
  const byToken = {};
  for (let i = 0; i < headers.length; i++) {
    const token = normalizeColumnToken_(headerToken_(headers[i]));
    if (!token) continue;
    // 同じトークンが複数あった場合は左側を優先（重複ヘッダー対策）
    if (!(token in byToken)) {
      byToken[token] = i;
    }
  }

  const map = {};
  const missing = [];

  Object.keys(COLUMN_DEFS).forEach(key => {
    const def = COLUMN_DEFS[key];
    const token = normalizeColumnToken_(def.question || def.header);

    if (token in byToken) {
      map[key] = byToken[token];
    } else {
      // 読み取り時は row[-1] === undefined となり空文字として扱われる
      map[key] = -1;
      missing.push(key + ' (照合キー: ' + token + ')');
    }
  });

  if (missing.length > 0) {
    Logger.log(
      '⚠️ 列が見つかりませんでした。フォームの設問が変更された可能性があります:\n  ' +
      missing.join('\n  ') +
      '\n→ columns.gs の COLUMN_DEFS を更新してください。'
    );
  }

  __columnMapCache = map;
  __columnMapCacheKey = cacheKey;
  return map;
}

/**
 * シートからヘッダー行を読んで列マップを作る
 * （getDataRange()を使わない関数向け）
 * @param {Sheet} sheet - 対象シート
 * @return {object} - 列マップ
 */
function getColumnMapFromSheet(sheet) {
  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  return getColumnMap(headers);
}

/**
 * 書き込みに使う列が全て解決できているか確認する
 * 解決できていない列があればエラーを投げ、誤った列への書き込みを防ぐ
 * @param {object} col - 列マップ
 */
function assertWritableColumns_(col) {
  const missing = REQUIRED_WRITE_COLUMNS.filter(key => col[key] === undefined || col[key] < 0);

  if (missing.length > 0) {
    throw new Error(
      '管理用の列が見つかりません: ' + missing.join(', ') +
      '。シートのヘッダー行と columns.gs の COLUMN_DEFS を確認してください。' +
      '（誤った列への書き込みを避けるため処理を中止しました）'
    );
  }
}

/**
 * 列インデックス（0始まり）をシートの列番号（1始まり）に変換する
 * 未解決の列を書き込み対象にしようとした場合はエラーにする
 * @param {object} col - 列マップ
 * @param {string} key - 内部キー
 * @return {number} - 列番号（1始まり）
 */
function colNum_(col, key) {
  const index = col[key];
  if (index === undefined || index < 0) {
    throw new Error('列「' + key + '」が見つかりません。columns.gs の COLUMN_DEFS を確認してください。');
  }
  return index + 1;
}

/**
 * ヘッダーセルから照合トークンを取り出す
 * 設問列はセルの1行目が設問番号（例: '4-1-2'）になっている
 * @param {*} headerCell - ヘッダーセルの値
 * @return {string} - 照合トークン
 */
function headerToken_(headerCell) {
  return String(headerCell || '').split('\n')[0].trim();
}

/**
 * 照合トークンを正規化する（全角ハイフン・各種ダッシュ・空白の揺れを吸収）
 * @param {string} token - 照合トークン
 * @return {string} - 正規化後のトークン
 */
function normalizeColumnToken_(token) {
  return String(token || '')
    .replace(/[‐‑‒–—―ー－]/g, '-')      // 各種ダッシュ・全角ハイフンを半角に
    .replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))  // 全角数字を半角に
    .replace(/\s+/g, '')                  // 空白を除去
    .trim();
}

/**
 * 【動作確認用】現在のヘッダー行と列マップの対応を出力する
 * フォームの設問を変更したあとに実行して、ズレがないか確認してください。
 */
function debugColumnMap() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('シート「' + SHEET_NAME + '」が見つかりません。');
    return;
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const col = getColumnMap(headers);

  Logger.log('===== 列マップ（全 ' + headers.length + ' 列）=====');

  Object.keys(COLUMN_DEFS).forEach(key => {
    const index = col[key];
    if (index < 0) {
      Logger.log('❌ ' + key + ' → 見つかりません');
    } else {
      Logger.log(
        '✓ ' + key + ' → ' + columnLetter_(index) + '列 (index ' + index + '): ' +
        headerToken_(headers[index])
      );
    }
  });

  // 定義から漏れている列を洗い出す
  const mapped = {};
  Object.keys(col).forEach(key => { if (col[key] >= 0) mapped[col[key]] = key; });

  const unmapped = [];
  for (let i = 0; i < headers.length; i++) {
    if (!(i in mapped)) {
      unmapped.push(columnLetter_(i) + '列: ' + headerToken_(headers[i]));
    }
  }

  if (unmapped.length > 0) {
    Logger.log('\n⚠️ COLUMN_DEFS に未定義の列:\n  ' + unmapped.join('\n  '));
  } else {
    Logger.log('\n✓ 全ての列が COLUMN_DEFS に定義されています');
  }
}

/**
 * 列インデックス（0始まり）を列記号に変換する（ログ用）
 * @param {number} index - 列インデックス（0始まり）
 * @return {string} - 列記号（例: 'A', 'AB'）
 */
function columnLetter_(index) {
  let letter = '';
  let n = index;
  while (n >= 0) {
    letter = String.fromCharCode((n % 26) + 65) + letter;
    n = Math.floor(n / 26) - 1;
  }
  return letter;
}
