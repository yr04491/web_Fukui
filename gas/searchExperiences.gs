/**
 * Google Apps Script (GAS) - 体験談検索API
 * 
 * このスクリプトをGoogle Apps Scriptエディタにコピーして使用してください。
 * スプレッドシートから体験談データを検索し、Reactアプリに返すWeb APIです。
 */

// スプレッドシートのID（ここに実際のスプレッドシートIDを設定してください）
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// シート名 - Googleフォームの回答シート名に変更してください
const SHEET_NAME = 'フォームの回答 1'; // Googleフォームの回答シート名を設定

/**
 * Web アプリケーションとして公開するためのdoPost関数
 * POSTリクエストを受け付けます
 */
function doPost(e) {
  try {
    // POSTデータを取得
    const params = JSON.parse(e.postData.contents);
    const endpoint = params.endpoint;

    let result;
    
    switch(endpoint) {
      case 'searchExperiences':
        result = searchExperiences(params.keyword, params.filters);
        break;
      case 'getAllExperiences':
        result = getAllExperiences(params.limit);
        break;
      case 'postExperience':
        result = postExperience(params);
        break;
      default:
        result = {
          success: false,
          error: '不正なエンドポイントです'
        };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * OPTIONSリクエストへの対応（CORS プリフライト）
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * フリーワード検索で体験談を取得
 * @param {string} keyword - 検索キーワード
 * @param {object} filters - フィルター条件
 * @return {object} - 検索結果
 */
function searchExperiences(keyword, filters = {}) {
  try {
    // テスト環境では常にgetActiveSpreadsheetを使用
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。SHEET_NAMEを確認してください。');
    }
    
    const data = sheet.getDataRange().getValues();
    
    // ヘッダー行を取得（1行目）- スプレッドシートの実際の列名
    const headers = data[0];
    const timestampIndex = 0; // A列: タイムスタンプ
    const authorNameIndex = 1; // B列: 1-2ペンネーム
    const gradeIndex = 2; // C列: 1-3初めて不登校になった学年
    const familyIndex = 3; // D列: 1-4家族構成
    const triggerIndex = 4; // E列: 2-1不登校になったきっかけ（複数選択可）
    const detailIndex = 5; // F列: 2-2詳しい状況
    const support1Index = 35; // AJ列: 6-1-1サポートの種類
    const support2Index = 41; // AP列: 6-2-1サポートの種類
    const support3Index = 47; // AV列: 6-3-1サポートの種類
    
    // データ行（2行目以降）を検索
    const results = [];
    const keywordLower = keyword.toLowerCase();
    const isWildcardSearch = keyword === '*'; // ワイルドカード検索（全件対象）
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 空行をスキップ
      if (!row[authorNameIndex] && !row[detailIndex]) continue;
      
      // キーワード検索（全ての記述回答から検索）
      // ワイルドカード検索の場合はキーワードチェックをスキップ
      if (!isWildcardSearch) {
        const searchableText = row.slice(1).join(' ').toLowerCase();
        
        if (!searchableText.includes(keywordLower)) {
          continue;
        }
      }
      

      // フィルター条件の適用
      if (filters && Object.keys(filters).length > 0) {
        let matchFilter = true;
        
        // 学年フィルター
        if (filters.grade && filters.grade.length > 0) {
          const rowGrade = String(row[gradeIndex] || '');
          if (!filters.grade.some(filterGrade => rowGrade.includes(filterGrade))) {
            matchFilter = false;
          }
        }
        
        // きっかけフィルター（複数選択可能な項目）
        if (filters.trigger && filters.trigger.length > 0) {
          const rowTrigger = String(row[triggerIndex] || '');
          // 選択されたフィルターのいずれかが含まれているかチェック
          if (!filters.trigger.some(filterTrigger => rowTrigger.includes(filterTrigger))) {
            matchFilter = false;
          }
        }
        
        // サポートの種類フィルター（3つの列のいずれかに含まれているか）
        if (filters.support && filters.support.length > 0) {
          const support1 = String(row[support1Index] || '');
          const support2 = String(row[support2Index] || '');
          const support3 = String(row[support3Index] || '');
          const allSupports = support1 + ', ' + support2 + ', ' + support3;
          
          // 選択されたフィルターのいずれかが含まれているかチェック
          if (!filters.support.some(filterSupport => allSupports.includes(filterSupport))) {
            matchFilter = false;
          }
        }
        
        if (!matchFilter) continue;
      }
      
      // タイトルを生成（詳しい状況の最初の50文字）
      const title = String(row[detailIndex] || '').substring(0, 50) + '...';
      
      // 結果に追加
      results.push({
        id: i,
        title: title,
        description: String(row[detailIndex] || ''),
        authorName: row[authorNameIndex] || '匿名',
        authorInitial: getInitial(row[authorNameIndex]),
        date: formatDate(row[timestampIndex]),
        grade: row[gradeIndex],
        trigger: row[triggerIndex],
        support: [row[support1Index], row[support2Index], row[support3Index]].filter(s => s).join(', ')
      });
    }
    
    return {
      success: true,
      data: results,
      count: results.length
    };
    
  } catch (error) {
    Logger.log('Search Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * すべての体験談を取得（ピックアップ用）
 * @param {number} limit - 取得件数の上限
 * @return {object} - 体験談データ
 */
function getAllExperiences(limit = null) {
  try {
    // テスト環境では常にgetActiveSpreadsheetを使用
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。SHEET_NAMEを確認してください。');
    }
    
    const data = sheet.getDataRange().getValues();
    
    const timestampIndex = 0; // A列: タイムスタンプ
    const authorNameIndex = 1; // B列: 1-2ペンネーム
    const gradeIndex = 2; // C列: 1-3初めて不登校になった学年
    const detailIndex = 5; // F列: 2-2詳しい状況
    
    const results = [];
    const maxRows = limit ? Math.min(limit + 1, data.length) : data.length;
    
    for (let i = 1; i < maxRows; i++) {
      const row = data[i];
      
      if (!row[authorNameIndex] && !row[detailIndex]) continue;
      
      // タイトルを生成（詳しい状況の最初の50文字）
      const title = String(row[detailIndex] || '').substring(0, 50) + '...';
      
      results.push({
        id: i,
        title: title,
        description: String(row[detailIndex] || ''),
        authorName: row[authorNameIndex] || '匿名',
        authorInitial: getInitial(row[authorNameIndex]),
        date: formatDate(row[timestampIndex]),
        grade: row[gradeIndex]
      });
      
      if (limit && results.length >= limit) break;
    }
    
    return {
      success: true,
      data: results,
      count: results.length
    };
    
  } catch (error) {
    Logger.log('Get All Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 体験談を投稿（Googleフォーム経由で投稿されるため、このエンドポイントは使用しない）
 * @param {object} experienceData - 投稿データ
 * @return {object} - 投稿結果
 */
function postExperience(experienceData) {
  // Googleフォーム経由で投稿するため、この関数は使用しません
  return {
    success: false,
    message: '体験談の投稿はGoogleフォームをご利用ください'
  };
}

/**
 * ヘルパー関数: 名前のイニシャルを取得
 * @param {string} name - 名前
 * @return {string} - イニシャル
 */
function getInitial(name) {
  if (!name) return 'A';
  return name.charAt(0).toUpperCase();
}

/**
 * ヘルパー関数: 日付を整形
 * @param {Date|string} date - 日付
 * @return {string} - 整形された日付文字列
 */
function formatDate(date) {
  if (!date) return '';
  
  try {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  } catch (error) {
    return String(date);
  }
}
