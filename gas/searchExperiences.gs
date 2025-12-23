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
      case 'getExperienceById':
        result = getExperienceById(params.id);
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
 * IDで特定の体験談を取得（全データを返す）
 * @param {number} id - 体験談のID（行番号）
 * @return {object} - 体験談データ
 */
function getExperienceById(id) {
  try {
    // テスト環境では常にgetActiveSpreadsheetを使用
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('シート「' + SHEET_NAME + '」が見つかりません。SHEET_NAMEを確認してください。');
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // IDは行番号に対応（1-indexed）
    const rowIndex = parseInt(id);
    
    if (rowIndex < 1 || rowIndex >= data.length) {
      return {
        success: false,
        error: '指定されたIDの体験談が見つかりません'
      };
    }
    
    const row = data[rowIndex];
    
    // 列インデックスの定義
    const timestampIndex = 0;    // A列: タイムスタンプ
    const authorNameIndex = 1;   // B列: 1-2 ペンネーム
    const gradeIndex = 2;        // C列: 1-3 初めて不登校になった学年
    const familyIndex = 3;       // D列: 1-4 家族構成
    const triggerIndex = 4;      // E列: 2-1 不登校になったきっかけ
    const detailIndex = 5;       // F列: 2-2 詳しい状況
    
    // 3. 学校に行っていた時の様子
    const q3_1Index = 6;         // G列: 3-1 学校での様子
    const q3_2Index = 7;         // H列: 3-2 友人関係
    const q3_3Index = 8;         // I列: 3-3 勉強面
    const q3_4Index = 9;         // J列: 3-4 家での様子
    
    // 4. 不登校になってからの様子
    const q4_1Index = 10;        // K列: 4-1 初期の様子
    const q4_2Index = 11;        // L列: 4-2 過ごし方
    const q4_3Index = 12;        // M列: 4-3 心身の状態
    const q4_4Index = 13;        // N列: 4-4 家族との関係
    
    // 5. 周囲の反応・サポート
    const q5_1Index = 14;        // O列: 5-1 学校の対応
    const q5_2Index = 15;        // P列: 5-2 親の対応
    const q5_3Index = 16;        // Q列: 5-3 その他の支援
    
    // 6. 利用したサポート（最大3つ）
    const support1TypeIndex = 35;      // AJ列: 6-1-1 サポート1の種類
    const support1DetailIndex = 36;    // AK列: 6-1-2 サポート1の詳細
    const support1FreqIndex = 37;      // AL列: 6-1-3 サポート1の頻度
    const support1FeelingIndex = 38;   // AM列: 6-1-4 サポート1の感想
    const support1HelpIndex = 39;      // AN列: 6-1-5 サポート1の役立ち
    const support1AdviceIndex = 40;    // AO列: 6-1-6 サポート1のアドバイス
    
    const support2TypeIndex = 41;      // AP列: 6-2-1 サポート2の種類
    const support2DetailIndex = 42;    // AQ列: 6-2-2 サポート2の詳細
    const support2FreqIndex = 43;      // AR列: 6-2-3 サポート2の頻度
    const support2FeelingIndex = 44;   // AS列: 6-2-4 サポート2の感想
    const support2HelpIndex = 45;      // AT列: 6-2-5 サポート2の役立ち
    const support2AdviceIndex = 46;    // AU列: 6-2-6 サポート2のアドバイス
    
    const support3TypeIndex = 47;      // AV列: 6-3-1 サポート3の種類
    const support3DetailIndex = 48;    // AW列: 6-3-2 サポート3の詳細
    const support3FreqIndex = 49;      // AX列: 6-3-3 サポート3の頻度
    const support3FeelingIndex = 50;   // AY列: 6-3-4 サポート3の感想
    const support3HelpIndex = 51;      // AZ列: 6-3-5 サポート3の役立ち
    const support3AdviceIndex = 52;    // BA列: 6-3-6 サポート3のアドバイス
    
    // 7. 現在と今後
    const q7_1Index = 53;        // BB列: 7-1 現在の状況
    const q7_2Index = 54;        // BC列: 7-2 同じ境遇の人へのメッセージ
    
    // タイトルを生成（2-2の詳しい状況から）
    const title = String(row[detailIndex] || '').substring(0, 50) + '...';
    
    return {
      success: true,
      data: {
        id: rowIndex,
        title: title,
        
        // 基本情報（セクション1）
        timestamp: row[timestampIndex],
        authorName: row[authorNameIndex] || '匿名',
        authorInitial: getInitial(row[authorNameIndex]),
        date: formatDate(row[timestampIndex]),
        grade: row[gradeIndex] || '',
        family: row[familyIndex] || '',
        
        // セクション2: 不登校のきっかけ
        trigger: row[triggerIndex] || '',
        detail: String(row[detailIndex] || ''),
        description: String(row[detailIndex] || ''), // 互換性のため
        
        // セクション3: 学校に行っていた時の様子
        schoolBehavior: String(row[q3_1Index] || ''),
        friendRelation: String(row[q3_2Index] || ''),
        studyStatus: String(row[q3_3Index] || ''),
        homeStatus: String(row[q3_4Index] || ''),
        
        // セクション4: 不登校になってからの様子
        initialStatus: String(row[q4_1Index] || ''),
        dailyLife: String(row[q4_2Index] || ''),
        mentalPhysical: String(row[q4_3Index] || ''),
        familyRelation: String(row[q4_4Index] || ''),
        
        // セクション5: 周囲の反応・サポート
        schoolResponse: String(row[q5_1Index] || ''),
        parentResponse: String(row[q5_2Index] || ''),
        otherSupport: String(row[q5_3Index] || ''),
        
        // セクション6: 利用したサポート
        supports: [
          {
            type: row[support1TypeIndex] || '',
            detail: String(row[support1DetailIndex] || ''),
            frequency: row[support1FreqIndex] || '',
            feeling: String(row[support1FeelingIndex] || ''),
            helpful: String(row[support1HelpIndex] || ''),
            advice: String(row[support1AdviceIndex] || '')
          },
          {
            type: row[support2TypeIndex] || '',
            detail: String(row[support2DetailIndex] || ''),
            frequency: row[support2FreqIndex] || '',
            feeling: String(row[support2FeelingIndex] || ''),
            helpful: String(row[support2HelpIndex] || ''),
            advice: String(row[support2AdviceIndex] || '')
          },
          {
            type: row[support3TypeIndex] || '',
            detail: String(row[support3DetailIndex] || ''),
            frequency: row[support3FreqIndex] || '',
            feeling: String(row[support3FeelingIndex] || ''),
            helpful: String(row[support3HelpIndex] || ''),
            advice: String(row[support3AdviceIndex] || '')
          }
        ].filter(s => s.type), // 種類が入力されているもののみ
        
        // サポートの種類（簡易版・互換性のため）
        support: [row[support1TypeIndex], row[support2TypeIndex], row[support3TypeIndex]]
          .filter(s => s).join(', '),
        
        // セクション7: 現在と今後
        currentStatus: String(row[q7_1Index] || ''),
        message: String(row[q7_2Index] || '')
      }
    };
    
  } catch (error) {
    Logger.log('Get By ID Error: ' + error.toString());
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
