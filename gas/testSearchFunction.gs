/**
 * GAS検索機能のテスト用関数
 * Apps Scriptエディタで実行してください
 */

/**
 * テスト1: スプレッドシートのデータを全て表示
 */
function testGetAllData() {
  const SHEET_NAME = '体験談データ';
  
  try {
    // 現在のスプレッドシートを使用（openByIdではなくgetActiveSpreadsheet）
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    Logger.log('=== スプレッドシートの全データ ===');
    Logger.log('総行数: ' + data.length);
    
    // ヘッダー行
    Logger.log('\n--- ヘッダー行（1行目） ---');
    Logger.log(data[0]);
    
    // データ行
    Logger.log('\n--- データ行（2行目以降） ---');
    for (let i = 1; i < data.length; i++) {
      Logger.log('行' + (i+1) + ': ' + JSON.stringify(data[i]));
    }
    
    Logger.log('\n✓ データ取得成功');
    
  } catch (error) {
    Logger.log('✗ エラー: ' + error.toString());
  }
}

/**
 * テスト2: ヘッダーのインデックスを確認
 */
function testHeaderIndexes() {
  const SHEET_NAME = '体験談データ';
  
  try {
    // 現在のスプレッドシートを使用
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    Logger.log('=== ヘッダーのインデックス確認 ===');
    Logger.log('タイトル: ' + headers.indexOf('タイトル'));
    Logger.log('内容: ' + headers.indexOf('内容'));
    Logger.log('投稿者名: ' + headers.indexOf('投稿者名'));
    Logger.log('投稿日: ' + headers.indexOf('投稿日'));
    Logger.log('学年: ' + headers.indexOf('学年'));
    Logger.log('きっかけ: ' + headers.indexOf('きっかけ'));
    Logger.log('状況: ' + headers.indexOf('状況'));
    Logger.log('支援体験: ' + headers.indexOf('支援体験'));
    
    Logger.log('\n--- 注意 ---');
    Logger.log('-1 が表示される場合、そのヘッダー名が見つかりません');
    Logger.log('スプレッドシートのヘッダー名とスクリプトの名前が一致しているか確認してください');
    
  } catch (error) {
    Logger.log('✗ エラー: ' + error.toString());
  }
}

/**
 * テスト3: 検索機能を直接テスト
 */
function testSearchFunction() {
  // テスト用のキーワード（スプレッドシートにあるデータに合わせて変更）
  const testKeyword = '不登校'; // ここを変更してテスト
  
  Logger.log('=== 検索テスト ===');
  Logger.log('検索キーワード: ' + testKeyword);
  
  try {
    const result = searchExperiences(testKeyword, {});
    
    Logger.log('\n--- 検索結果 ---');
    Logger.log('成功: ' + result.success);
    Logger.log('件数: ' + result.count);
    
    if (result.success && result.data.length > 0) {
      Logger.log('\n--- 取得データ ---');
      result.data.forEach((item, index) => {
        Logger.log('\n【' + (index + 1) + '件目】');
        Logger.log('ID: ' + item.id);
        Logger.log('タイトル: ' + item.title);
        Logger.log('内容: ' + item.description);
        Logger.log('投稿者: ' + item.authorName);
        Logger.log('日付: ' + item.date);
        Logger.log('学年: ' + item.grade);
      });
    } else if (result.success && result.data.length === 0) {
      Logger.log('✗ 検索結果が0件です');
      Logger.log('スプレッドシートにキーワード「' + testKeyword + '」を含むデータがあるか確認してください');
    } else {
      Logger.log('✗ 検索に失敗しました: ' + result.error);
    }
    
  } catch (error) {
    Logger.log('✗ エラー: ' + error.toString());
  }
}

/**
 * テスト4: 各データ行の検索マッチングをデバッグ
 */
function testSearchDebug() {
  const SHEET_NAME = '体験談データ';
  const testKeyword = '不登校'; // テストキーワード
  
  try {
    // 現在のスプレッドシートを使用
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const titleIndex = headers.indexOf('タイトル');
    const descriptionIndex = headers.indexOf('内容');
    const keywordLower = testKeyword.toLowerCase();
    
    Logger.log('=== 検索マッチングデバッグ ===');
    Logger.log('検索キーワード: ' + testKeyword + ' (小文字: ' + keywordLower + ')');
    Logger.log('総データ行数: ' + (data.length - 1));
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const title = String(row[titleIndex] || '');
      const description = String(row[descriptionIndex] || '');
      const combinedText = (title + ' ' + description).toLowerCase();
      
      Logger.log('\n--- 行' + (i+1) + ' ---');
      Logger.log('タイトル: "' + title + '"');
      Logger.log('内容: "' + description + '"');
      Logger.log('結合テキスト(小文字): "' + combinedText + '"');
      Logger.log('マッチ判定: ' + combinedText.includes(keywordLower));
      
      if (!title && !description) {
        Logger.log('⚠ この行は空です（スキップされます）');
      }
    }
    
  } catch (error) {
    Logger.log('✗ エラー: ' + error.toString());
  }
}

/**
 * テスト5: すべてのテストを実行
 */
function runAllTests() {
  Logger.log('========================================');
  Logger.log('GAS検索機能 - 統合テスト');
  Logger.log('========================================\n');
  
  testGetAllData();
  Logger.log('\n========================================\n');
  
  testHeaderIndexes();
  Logger.log('\n========================================\n');
  
  testSearchDebug();
  Logger.log('\n========================================\n');
  
  testSearchFunction();
  Logger.log('\n========================================');
  Logger.log('テスト完了');
  Logger.log('========================================');
}
