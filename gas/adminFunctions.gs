/**
 * Google Apps Script (GAS) - 管理者機能
 * 
 * 体験談の承認・却下機能を提供します
 */

// 承認ステータス関連の列インデックス（0始まり）
const APPROVAL_STATUS_INDEX = 55; // BD列（56列目）: 承認ステータス
const APPROVAL_DATE_INDEX = 56;   // BE列（57列目）: 承認日時
const LAST_EDIT_DATE_INDEX = 57;  // BF列（58列目）: 最終編集日時
const APPROVAL_COUNT_INDEX = 58;  // BG列（59列目）: 承認回数

// ステータス定数
const STATUS = {
  PENDING: '未承認',
  APPROVED: '承認済み',
  REJECTED: '却下'
};

/**
 * 未承認の体験談を取得
 * @return {object} - 未承認体験談の配列
 */
function getPendingExperiences() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。');
    }
    
    const data = sheet.getDataRange().getValues();
    const results = [];
    
    // 基本情報の列インデックス
    const timestampIndex = 0;
    const authorNameIndex = 1;
    const gradeIndex = 2;
    const triggerIndex = 4;
    const detailIndex = 5;
    
    // 2行目以降をチェック（1行目はヘッダー）
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 承認ステータスが「未承認」または空欄の場合
      const status = row[APPROVAL_STATUS_INDEX] || STATUS.PENDING;
      
      if (status === STATUS.PENDING) {
        // タイトルを生成（詳しい状況の最初の50文字）
        const title = String(row[detailIndex] || '').substring(0, 50) + '...';
        
        // サポートの種類を取得（複数のサポート列から）
        const support1Index = 35; // AJ列
        const support2Index = 41; // AP列
        const support3Index = 47; // AV列
        const supportTypes = [];
        if (row[support1Index]) supportTypes.push(row[support1Index]);
        if (row[support2Index]) supportTypes.push(row[support2Index]);
        if (row[support3Index]) supportTypes.push(row[support3Index]);
        
        results.push({
          id: i,
          title: title,
          summary: String(row[detailIndex] || '').substring(0, 100) + '...',
          description: String(row[detailIndex] || ''),
          authorName: row[authorNameIndex] || '匿名',
          date: formatDate(row[timestampIndex]),
          startGrade: row[gradeIndex] || '',
          trigger: row[triggerIndex] || '',
          supportTypes: supportTypes.join(', '),
          status: status,
          lastEditDate: row[LAST_EDIT_DATE_INDEX] || ''
        });
      }
    }
    
    return {
      success: true,
      data: results,
      count: results.length
    };
    
  } catch (error) {
    Logger.log('Get Pending Experiences Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 承認済みの体験談を取得
 * @return {object} - 承認済み体験談の配列
 */
function getApprovedExperiences() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。');
    }
    
    const data = sheet.getDataRange().getValues();
    const results = [];
    
    // 基本情報の列インデックス
    const timestampIndex = 0;
    const authorNameIndex = 1;
    const gradeIndex = 2;
    const triggerIndex = 4;
    const detailIndex = 5;
    
    // 2行目以降をチェック
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 承認ステータスが「承認済み」の場合
      if (row[APPROVAL_STATUS_INDEX] === STATUS.APPROVED) {
        const title = String(row[detailIndex] || '').substring(0, 50) + '...';
        
        // サポートの種類を取得
        const support1Index = 35;
        const support2Index = 41;
        const support3Index = 47;
        const supportTypes = [];
        if (row[support1Index]) supportTypes.push(row[support1Index]);
        if (row[support2Index]) supportTypes.push(row[support2Index]);
        if (row[support3Index]) supportTypes.push(row[support3Index]);
        
        results.push({
          id: i,
          title: title,
          summary: String(row[detailIndex] || '').substring(0, 100) + '...',
          description: String(row[detailIndex] || ''),
          authorName: row[authorNameIndex] || '匿名',
          date: formatDate(row[timestampIndex]),
          startGrade: row[gradeIndex] || '',
          trigger: row[triggerIndex] || '',
          supportTypes: supportTypes.join(', '),
          status: STATUS.APPROVED,
          approvalDate: row[APPROVAL_DATE_INDEX] || '',
          approvalCount: row[APPROVAL_COUNT_INDEX] || 0
        });
      }
    }
    
    return {
      success: true,
      data: results,
      count: results.length
    };
    
  } catch (error) {
    Logger.log('Get Approved Experiences Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 体験談を承認
 * @param {number} id - 体験談のID（行番号）
 * @return {object} - 処理結果
 */
function approveExperience(id) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。');
    }
    
    // 行番号をチェック（1行目はヘッダー、2行目以降がデータ）
    const rowNumber = parseInt(id);
    if (rowNumber < 1 || rowNumber >= sheet.getLastRow()) {
      throw new Error('無効な行番号です: ' + id);
    }
    
    // 実際のシート上の行は1を足す（0始まりのインデックスを1始まりの行番号に変換）
    const sheetRow = rowNumber + 1;
    
    // 現在の承認回数を取得
    const currentCount = sheet.getRange(sheetRow, APPROVAL_COUNT_INDEX + 1).getValue() || 0;
    
    // 承認ステータスを更新
    sheet.getRange(sheetRow, APPROVAL_STATUS_INDEX + 1).setValue(STATUS.APPROVED);
    
    // 承認日時を記録
    const now = new Date();
    sheet.getRange(sheetRow, APPROVAL_DATE_INDEX + 1).setValue(Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss'));
    
    // 承認回数をインクリメント
    sheet.getRange(sheetRow, APPROVAL_COUNT_INDEX + 1).setValue(parseInt(currentCount) + 1);
    
    return {
      success: true,
      message: '体験談を承認しました',
      id: id
    };
    
  } catch (error) {
    Logger.log('Approve Experience Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 体験談を却下
 * @param {number} id - 体験談のID（行番号）
 * @return {object} - 処理結果
 */
function rejectExperience(id) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。');
    }
    
    // 行番号をチェック
    const rowNumber = parseInt(id);
    if (rowNumber < 1 || rowNumber >= sheet.getLastRow()) {
      throw new Error('無効な行番号です: ' + id);
    }
    
    const sheetRow = rowNumber + 1;
    
    // 承認ステータスを「却下」に更新
    sheet.getRange(sheetRow, APPROVAL_STATUS_INDEX + 1).setValue(STATUS.REJECTED);
    
    return {
      success: true,
      message: '体験談を却下しました',
      id: id
    };
    
  } catch (error) {
    Logger.log('Reject Experience Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 日付フォーマット関数（既存のsearchExperiences.gsにもあるが、ここでも定義）
 */
function formatDate(timestamp) {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    return Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd');
  } catch (error) {
    return '';
  }
}

/**
 * フォーム編集時の自動処理（onEditトリガー用）
 * Googleフォームで回答が編集された際に、承認ステータスを「未承認」に戻す
 */
function onEditTrigger(e) {
  try {
    const sheet = e.source.getActiveSheet();
    
    // 対象シートかチェック
    if (sheet.getName() !== SHEET_NAME) {
      return;
    }
    
    const range = e.range;
    const row = range.getRow();
    
    // ヘッダー行は無視
    if (row <= 1) {
      return;
    }
    
    // タイムスタンプ列（A列）の変更でない場合、ユーザーによる編集と判断
    // Googleフォームからの編集の場合、複数列が同時に更新される
    const editedColumn = range.getColumn();
    
    // 承認ステータス列以外が編集された場合
    if (editedColumn !== APPROVAL_STATUS_INDEX + 1 && 
        editedColumn !== APPROVAL_DATE_INDEX + 1 && 
        editedColumn !== APPROVAL_COUNT_INDEX + 1) {
      
      // 現在のステータスを確認
      const currentStatus = sheet.getRange(row, APPROVAL_STATUS_INDEX + 1).getValue();
      
      // 承認済みの場合のみ、未承認に戻す
      if (currentStatus === STATUS.APPROVED) {
        sheet.getRange(row, APPROVAL_STATUS_INDEX + 1).setValue(STATUS.PENDING);
        
        // 最終編集日時を記録
        const now = new Date();
        sheet.getRange(row, LAST_EDIT_DATE_INDEX + 1).setValue(
          Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss')
        );
        
        Logger.log('体験談（行' + row + '）が編集されたため、承認ステータスを未承認に変更しました。');
      }
    }
    
  } catch (error) {
    Logger.log('onEditTrigger Error: ' + error.toString());
  }
}
