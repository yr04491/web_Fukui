/**
 * getExperienceById関数のテスト
 * スプレッドシートから全てのデータが正しく取得できているか確認
 */

/**
 * テスト: IDで体験談を取得して全フィールドを確認
 */
function testGetExperienceById() {
  Logger.log('=== getExperienceById テスト ===\n');
  
  try {
    // テスト対象のID（2行目 = ID:1）
    const testId = 1;
    
    Logger.log('テスト対象ID: ' + testId + '\n');
    
    // getExperienceByIdを実行
    const result = getExperienceById(testId);
    
    if (!result.success) {
      Logger.log('✗ エラー: ' + result.error);
      return;
    }
    
    const data = result.data;
    
    Logger.log('✓ データ取得成功\n');
    Logger.log('=== 取得されたデータの内容 ===\n');
    
    // 基本情報
    Logger.log('【基本情報】');
    Logger.log('ID: ' + data.id);
    Logger.log('タイトル: ' + data.title);
    Logger.log('投稿者: ' + data.authorName);
    Logger.log('イニシャル: ' + data.authorInitial);
    Logger.log('日付: ' + data.date);
    Logger.log('学年: ' + data.grade);
    Logger.log('家族構成: ' + data.family);
    
    // セクション2
    Logger.log('\n【セクション2: 不登校のきっかけと経過】');
    Logger.log('2-1 きっかけ: ' + data.trigger);
    Logger.log('2-2 詳しい状況: ' + (data.detail ? data.detail.substring(0, 100) + '...' : '(なし)'));
    Logger.log('2-3 保護者の初動: ' + (data.parentInitialAction ? data.parentInitialAction.substring(0, 100) + '...' : '(なし)'));
    Logger.log('2-4 子どもの反応: ' + (data.childReaction ? data.childReaction.substring(0, 100) + '...' : '(なし)'));
    Logger.log('2-5 学校の反応・対応: ' + (data.schoolResponse ? data.schoolResponse.substring(0, 100) + '...' : '(なし)'));
    Logger.log('2-6 初動の振り返り: ' + (data.initialReflection ? data.initialReflection.substring(0, 100) + '...' : '(なし)'));
    Logger.log('2-7 不登校1か月の生活: ' + (data.firstMonthLife ? data.firstMonthLife.substring(0, 100) + '...' : '(なし)'));
    Logger.log('2-8 一番つらかった時期: ' + (data.hardestTime ? data.hardestTime.substring(0, 100) + '...' : '(なし)'));
    Logger.log('2-9 改善のきっかけ: ' + (data.improvementTrigger ? data.improvementTrigger.substring(0, 100) + '...' : '(なし)'));
    
    // セクション3
    Logger.log('\n【セクション3: 子どもの成長過程】');
    Logger.log('3-1 小学生のころ: ' + (data.elementarySchool ? data.elementarySchool.substring(0, 100) + '...' : '(なし)'));
    Logger.log('3-2 中学生のころ: ' + (data.juniorHighSchool ? data.juniorHighSchool.substring(0, 100) + '...' : '(なし)'));
    Logger.log('3-3 高校生のころ: ' + (data.highSchool ? data.highSchool.substring(0, 100) + '...' : '(なし)'));
    Logger.log('3-4 通信制・定時制: ' + (data.alternativeSchool ? data.alternativeSchool.substring(0, 100) + '...' : '(なし)'));
    
    // セクション5
    Logger.log('\n【セクション5: 行政・民間サポート】');
    Logger.log('5-1 利用したサポート: ' + (data.supportUsed ? data.supportUsed.substring(0, 100) + '...' : '(なし)'));
    
    // セクション6
    Logger.log('\n【セクション6: 利用したサポート】');
    Logger.log('サポート数: ' + (data.supports ? data.supports.length : 0));
    if (data.supports && data.supports.length > 0) {
      data.supports.forEach((support, idx) => {
        Logger.log('\n  サポート' + (idx + 1) + ':');
        Logger.log('    種類: ' + support.type);
        Logger.log('    名称: ' + (support.name ? support.name.substring(0, 80) + '...' : '(なし)'));
        Logger.log('    利用期間・回数: ' + (support.frequency ? support.frequency.substring(0, 80) + '...' : '(なし)'));
        Logger.log('    きっかけ: ' + (support.reason ? support.reason.substring(0, 80) + '...' : '(なし)'));
        Logger.log('    感想: ' + (support.feeling ? support.feeling.substring(0, 80) + '...' : '(なし)'));
      });
    }
    
    // セクション7
    Logger.log('\n【セクション7: その他のサポートと今の想い】');
    Logger.log('7-1 その他のサポート・活動: ' + (data.otherSupport ? data.otherSupport.substring(0, 100) + '...' : '(なし)'));
    Logger.log('7-2 不登校に対する考え・想い: ' + (data.currentThoughts ? data.currentThoughts.substring(0, 100) + '...' : '(なし)'));
    
    Logger.log('\n✓ テスト完了');
    
  } catch (error) {
    Logger.log('✗ エラー: ' + error.toString());
    Logger.log('スタックトレース: ' + error.stack);
  }
}

/**
 * テスト: スプレッドシートの全列を確認
 */
function testCheckAllColumns() {
  Logger.log('=== スプレッドシートの全列確認 ===\n');
  
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      Logger.log('✗ エラー: シート「' + SHEET_NAME + '」が見つかりません');
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    Logger.log('総列数: ' + headers.length + '\n');
    Logger.log('=== 全列のヘッダー ===\n');
    
    // 全ての列のヘッダーを表示
    for (let i = 0; i < headers.length; i++) {
      const columnLetter = columnToLetter(i);
      Logger.log(columnLetter + '列(' + i + '): ' + headers[i]);
    }
    
    // データサンプル（2行目）の主要な列
    if (data.length > 1) {
      Logger.log('\n=== データサンプル（2行目） ===\n');
      const sampleRow = data[1];
      
      // セクション3-4の列を確認
      Logger.log('G列(6): ' + (sampleRow[6] ? String(sampleRow[6]).substring(0, 50) + '...' : '(空)'));
      Logger.log('H列(7): ' + (sampleRow[7] ? String(sampleRow[7]).substring(0, 50) + '...' : '(空)'));
      Logger.log('I列(8): ' + (sampleRow[8] ? String(sampleRow[8]).substring(0, 50) + '...' : '(空)'));
      Logger.log('J列(9): ' + (sampleRow[9] ? String(sampleRow[9]).substring(0, 50) + '...' : '(空)'));
      Logger.log('K列(10): ' + (sampleRow[10] ? String(sampleRow[10]).substring(0, 50) + '...' : '(空)'));
      Logger.log('L列(11): ' + (sampleRow[11] ? String(sampleRow[11]).substring(0, 50) + '...' : '(空)'));
      Logger.log('M列(12): ' + (sampleRow[12] ? String(sampleRow[12]).substring(0, 50) + '...' : '(空)'));
      Logger.log('N列(13): ' + (sampleRow[13] ? String(sampleRow[13]).substring(0, 50) + '...' : '(空)'));
      Logger.log('O列(14): ' + (sampleRow[14] ? String(sampleRow[14]).substring(0, 50) + '...' : '(空)'));
      Logger.log('P列(15): ' + (sampleRow[15] ? String(sampleRow[15]).substring(0, 50) + '...' : '(空)'));
      Logger.log('Q列(16): ' + (sampleRow[16] ? String(sampleRow[16]).substring(0, 50) + '...' : '(空)'));
      
      // セクション7の列を確認
      Logger.log('BB列(53): ' + (sampleRow[53] ? String(sampleRow[53]).substring(0, 50) + '...' : '(空)'));
      Logger.log('BC列(54): ' + (sampleRow[54] ? String(sampleRow[54]).substring(0, 50) + '...' : '(空)'));
    }
    
    Logger.log('\n✓ 列確認完了');
    
  } catch (error) {
    Logger.log('✗ エラー: ' + error.toString());
  }
}

/**
 * 列番号をアルファベットに変換
 */
function columnToLetter(column) {
  let temp, letter = '';
  while (column >= 0) {
    temp = column % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp) / 26 - 1;
  }
  return letter;
}

/**
 * クイックテスト: 主要な確認のみ実行
 */
function quickTestById() {
  Logger.log('=== クイックテスト: getExperienceById ===\n');
  
  testCheckAllColumns();
  Logger.log('\n---\n');
  testGetExperienceById();
}
