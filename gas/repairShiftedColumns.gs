/**
 * Google Apps Script (GAS) - 列ズレで壊れた管理用データの修復
 *
 * ■ 背景
 * 2026年のフォーム改訂で設問が増減し、管理用の列が1つずつ左へずれました。
 * 旧コードは列位置をハードコードしていたため、シート修正後に動いたトリガーが
 * 管理用の値を「1つ右の列」に書き込んでいました。
 *
 *   書きたかった列        実際に書かれた列
 *   承認ステータス   →    承認日時
 *   承認日時         →    最終編集日時
 *   最終編集日時     →    承認回数
 *   承認回数         →    却下理由
 *   却下理由         →    初回投稿日時
 *   初回投稿日時     →    編集回数
 *   編集回数         →    投稿状態
 *   投稿状態         →    却下理由履歴
 *   却下理由履歴     →    BO列（シート範囲外・通常は未作成）
 *
 * ■ 使い方
 *   1. 必ず先にスプレッドシートのコピーを取ってください（この処理は元に戻せません）
 *   2. dryRunRepairShiftedColumns() を実行し、ログで対象行と変更内容を確認
 *   3. 問題なければ repairShiftedColumns() を実行
 *
 * ■ 注意
 *   回答本文（設問の列）は書き込み対象ではなかったため壊れていません。
 *   修復対象は管理用の列だけです。
 */

/**
 * 修復対象の行を検出する
 *
 * 「ずれて書き込まれた」行は、承認日時の列にステータス文字列（未承認/承認済み/却下）が
 * 入っていることで見分けられます。日時が入るはずの列に日本語のステータスは入りません。
 *
 * @param {Array} data - シート全体の値
 * @param {object} col - 列マップ
 * @return {Array} - 修復対象の情報の配列
 */
function findShiftedRows_(data, col) {
  const statuses = [STATUS.PENDING, STATUS.APPROVED, STATUS.REJECTED];
  const targets = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // 承認日時の列にステータス文字列が入っていたら、ずれて書き込まれた行
    if (statuses.indexOf(String(row[col.approvalDate]).trim()) === -1) continue;

    targets.push({
      sheetRow: i + 1,
      authorName: row[col.authorName],
      // ずれた値を1つ左へ戻す（ずれ元の列から読む）
      approvalStatus: row[col.approvalDate],
      approvalDate: row[col.lastEditDate],
      lastEditDate: row[col.approvalCount],
      approvalCount: row[col.rejectReason],
      rejectReason: row[col.firstSubmitDate],
      firstSubmitDate: row[col.editCount],
      editCount: row[col.submissionState],
      submissionState: row[col.rejectReasonHistory]
    });
  }

  return targets;
}

/**
 * 【確認用】修復対象を表示するだけで、シートは変更しない
 */
function dryRunRepairShiftedColumns() {
  runRepairShiftedColumns_(true);
}

/**
 * 【実行】ずれた管理用データを正しい列へ戻す
 * 実行前に必ずスプレッドシートのコピーを取ってください
 */
function repairShiftedColumns() {
  runRepairShiftedColumns_(false);
}

/**
 * 修復処理の本体
 * @param {boolean} dryRun - true なら確認のみでシートを変更しない
 */
function runRepairShiftedColumns_(dryRun) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  if (!sheet) {
    Logger.log('シート「' + SHEET_NAME + '」が見つかりません。');
    return;
  }

  const data = sheet.getDataRange().getValues();
  const col = getColumnMap(data[0]);
  assertWritableColumns_(col);

  const targets = findShiftedRows_(data, col);

  Logger.log(dryRun ? '===== 確認のみ（シートは変更しません）=====' : '===== 修復を実行します =====');
  Logger.log('修復対象: ' + targets.length + '行');

  if (targets.length === 0) {
    Logger.log('ずれて書き込まれた行は見つかりませんでした。');
    return;
  }

  targets.forEach(t => {
    Logger.log(
      '\n行' + t.sheetRow + '（' + (t.authorName || '投稿者不明') + '）\n' +
      '  承認ステータス   ← ' + t.approvalStatus + '\n' +
      '  承認日時         ← ' + t.approvalDate + '\n' +
      '  最終編集日時     ← ' + t.lastEditDate + '\n' +
      '  承認回数         ← ' + toCount_(t.approvalCount) + '\n' +
      '  却下理由         ← ' + t.rejectReason + '\n' +
      '  初回投稿日時     ← ' + t.firstSubmitDate + '\n' +
      '  編集回数         ← ' + toCount_(t.editCount) + '\n' +
      '  投稿状態         ← ' + t.submissionState
    );

    if (dryRun) return;

    // 列の並び順に依存しないよう、1セルずつ書き戻す
    sheet.getRange(t.sheetRow, colNum_(col, 'approvalStatus')).setValue(t.approvalStatus);
    sheet.getRange(t.sheetRow, colNum_(col, 'approvalDate')).setValue(t.approvalDate);
    sheet.getRange(t.sheetRow, colNum_(col, 'lastEditDate')).setValue(t.lastEditDate);
    sheet.getRange(t.sheetRow, colNum_(col, 'approvalCount')).setValue(toCount_(t.approvalCount));
    sheet.getRange(t.sheetRow, colNum_(col, 'rejectReason')).setValue(t.rejectReason);
    sheet.getRange(t.sheetRow, colNum_(col, 'firstSubmitDate')).setValue(t.firstSubmitDate);
    sheet.getRange(t.sheetRow, colNum_(col, 'editCount')).setValue(toCount_(t.editCount));
    sheet.getRange(t.sheetRow, colNum_(col, 'submissionState')).setValue(t.submissionState);

    // 却下理由履歴は範囲外の列に書かれており復元できないため空にする
    sheet.getRange(t.sheetRow, colNum_(col, 'rejectReasonHistory')).setValue('');
  });

  if (dryRun) {
    Logger.log('\n※ 実際に修復するには repairShiftedColumns() を実行してください');
    Logger.log('※ 実行前に必ずスプレッドシートのコピーを取ってください');
  } else {
    Logger.log('\n✓ ' + targets.length + '行を修復しました');
    Logger.log('※ 却下理由履歴は復元できないため空にしています。必要なら手動で補完してください。');
  }
}
