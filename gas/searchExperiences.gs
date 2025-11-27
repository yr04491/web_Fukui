/**
 * Google Apps Script (GAS) - 体験談検索API
 * 
 * このスクリプトをGoogle Apps Scriptエディタにコピーして使用してください。
 * スプレッドシートから体験談データを検索し、Reactアプリに返すWeb APIです。
 */

// スプレッドシートのID（ここに実際のスプレッドシートIDを設定してください）
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// シート名
const SHEET_NAME = '体験談データ'; // スプレッドシートのシート名を設定

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
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // ヘッダー行を取得（1行目）
    const headers = data[0];
    const titleIndex = headers.indexOf('タイトル');
    const descriptionIndex = headers.indexOf('内容');
    const authorNameIndex = headers.indexOf('投稿者名');
    const dateIndex = headers.indexOf('投稿日');
    const gradeIndex = headers.indexOf('学年');
    const triggerIndex = headers.indexOf('きっかけ');
    const situationIndex = headers.indexOf('状況');
    const supportIndex = headers.indexOf('支援体験');
    
    // データ行（2行目以降）を検索
    const results = [];
    const keywordLower = keyword.toLowerCase();
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 空行をスキップ
      if (!row[titleIndex] && !row[descriptionIndex]) continue;
      
      // キーワード検索（タイトルと内容から検索）
      const title = String(row[titleIndex] || '');
      const description = String(row[descriptionIndex] || '');
      const combinedText = (title + ' ' + description).toLowerCase();
      
      if (!combinedText.includes(keywordLower)) {
        continue;
      }
      
      // フィルター条件の適用
      if (filters && Object.keys(filters).length > 0) {
        let matchFilter = true;
        
        // 学年フィルター
        if (filters.grade && filters.grade.length > 0) {
          if (!filters.grade.includes(row[gradeIndex])) {
            matchFilter = false;
          }
        }
        
        // きっかけフィルター
        if (filters.trigger && filters.trigger.length > 0) {
          if (!filters.trigger.includes(row[triggerIndex])) {
            matchFilter = false;
          }
        }
        
        // 状況フィルター
        if (filters.situation && filters.situation.length > 0) {
          if (!filters.situation.includes(row[situationIndex])) {
            matchFilter = false;
          }
        }
        
        // 支援体験フィルター
        if (filters.support && filters.support.length > 0) {
          if (!filters.support.includes(row[supportIndex])) {
            matchFilter = false;
          }
        }
        
        if (!matchFilter) continue;
      }
      
      // 結果に追加
      results.push({
        id: i,
        title: title,
        description: description,
        authorName: row[authorNameIndex] || '匿名',
        authorInitial: getInitial(row[authorNameIndex]),
        date: formatDate(row[dateIndex]),
        grade: row[gradeIndex],
        trigger: row[triggerIndex],
        situation: row[situationIndex],
        support: row[supportIndex]
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
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    const headers = data[0];
    const titleIndex = headers.indexOf('タイトル');
    const descriptionIndex = headers.indexOf('内容');
    const authorNameIndex = headers.indexOf('投稿者名');
    const dateIndex = headers.indexOf('投稿日');
    
    const results = [];
    const maxRows = limit ? Math.min(limit + 1, data.length) : data.length;
    
    for (let i = 1; i < maxRows; i++) {
      const row = data[i];
      
      if (!row[titleIndex] && !row[descriptionIndex]) continue;
      
      results.push({
        id: i,
        title: row[titleIndex] || '',
        description: row[descriptionIndex] || '',
        authorName: row[authorNameIndex] || '匿名',
        authorInitial: getInitial(row[authorNameIndex]),
        date: formatDate(row[dateIndex])
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
 * 体験談を投稿
 * @param {object} experienceData - 投稿データ
 * @return {object} - 投稿結果
 */
function postExperience(experienceData) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // 新しい行を追加
    const newRow = [
      experienceData.title || '',
      experienceData.description || '',
      experienceData.authorName || '匿名',
      new Date(),
      experienceData.grade || '',
      experienceData.trigger || '',
      experienceData.situation || '',
      experienceData.support || ''
    ];
    
    sheet.appendRow(newRow);
    
    return {
      success: true,
      message: '体験談を投稿しました'
    };
    
  } catch (error) {
    Logger.log('Post Error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
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
