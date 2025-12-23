/**
 * GAS絞り込み検索機能のテスト用関数
 * Apps Scriptエディタで実行してください
 * 
 * 実行前の準備:
 * 1. searchExperiences.gsを同じプロジェクトに追加
 * 2. SHEET_NAMEを実際のシート名に変更
 * 3. スプレッドシートを開いた状態でテストを実行
 */

// シート名（実際のシート名に変更してください）
const TEST_SHEET_NAME = 'フォームの回答 1';

/**
 * テスト1: スプレッドシートの構造を確認
 */
function test1_CheckSpreadsheetStructure() {
  Logger.log('=== テスト1: スプレッドシートの構造確認 ===\n');
  
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TEST_SHEET_NAME);
    
    if (!sheet) {
      Logger.log('✗ エラー: シート「' + TEST_SHEET_NAME + '」が見つかりません');
      Logger.log('シート名を確認してください');
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    Logger.log('総行数: ' + data.length + '行（ヘッダー含む）');
    Logger.log('データ行数: ' + (data.length - 1) + '行');
    Logger.log('列数: ' + headers.length + '列\n');
    
    Logger.log('--- ヘッダー行（重要な列のみ） ---');
    Logger.log('A列(0): ' + headers[0]);  // タイムスタンプ
    Logger.log('B列(1): ' + headers[1]);  // ペンネーム
    Logger.log('C列(2): ' + headers[2]);  // 学年
    Logger.log('E列(4): ' + headers[4]);  // きっかけ
    Logger.log('F列(5): ' + headers[5]);  // 詳しい状況
    Logger.log('AJ列(35): ' + (headers[35] || '(空)'));  // サポート1
    Logger.log('AP列(41): ' + (headers[41] || '(空)'));  // サポート2
    Logger.log('AV列(47): ' + (headers[47] || '(空)'));  // サポート3
    
    Logger.log('\n--- データサンプル（2行目） ---');
    if (data.length > 1) {
      const sampleRow = data[1];
      Logger.log('タイムスタンプ: ' + sampleRow[0]);
      Logger.log('ペンネーム: ' + sampleRow[1]);
      Logger.log('学年: ' + sampleRow[2]);
      Logger.log('きっかけ: ' + sampleRow[4]);
      Logger.log('詳しい状況: ' + String(sampleRow[5]).substring(0, 100) + '...');
    } else {
      Logger.log('データ行がありません');
    }
    
    Logger.log('\n✓ 構造確認完了');
    
  } catch (error) {
    Logger.log('✗ エラー: ' + error.toString());
  }
}

/**
 * テスト2: ワイルドカード検索（全件取得）
 */
function test2_WildcardSearch() {
  Logger.log('\n=== テスト2: ワイルドカード検索（全件取得） ===\n');
  
  try {
    const result = searchExperiences('*', {});
    
    Logger.log('成功: ' + result.success);
    Logger.log('取得件数: ' + result.count);
    
    if (result.success && result.count > 0) {
      Logger.log('\n--- 最初の3件のデータ ---');
      result.data.slice(0, 3).forEach((item, index) => {
        Logger.log('\n【' + (index + 1) + '件目】');
        Logger.log('ID: ' + item.id);
        Logger.log('タイトル: ' + item.title);
        Logger.log('投稿者: ' + item.authorName);
        Logger.log('学年: ' + item.grade);
        Logger.log('きっかけ: ' + item.trigger);
        Logger.log('サポート: ' + item.support);
      });
      Logger.log('\n✓ ワイルドカード検索成功');
    } else if (result.count === 0) {
      Logger.log('⚠ 警告: データが0件です');
    } else {
      Logger.log('✗ エラー: ' + result.error);
    }
    
  } catch (error) {
    Logger.log('✗ エラー: ' + error.toString());
  }
}

/**
 * テスト3: キーワード検索
 */
function test3_KeywordSearch() {
  Logger.log('\n=== テスト3: キーワード検索 ===\n');
  
  // テストキーワード（実際のデータに合わせて変更）
  const testKeywords = ['学校', '不登校', '支援'];
  
  testKeywords.forEach(keyword => {
    Logger.log('--- 検索: "' + keyword + '" ---');
    
    try {
      const result = searchExperiences(keyword, {});
      
      Logger.log('成功: ' + result.success);
      Logger.log('件数: ' + result.count);
      
      if (result.success && result.count > 0) {
        Logger.log('最初の1件: ' + result.data[0].title);
        Logger.log('✓ 検索成功\n');
      } else if (result.count === 0) {
        Logger.log('⚠ 該当データなし\n');
      } else {
        Logger.log('✗ エラー: ' + result.error + '\n');
      }
      
    } catch (error) {
      Logger.log('✗ エラー: ' + error.toString() + '\n');
    }
  });
}

/**
 * テスト4: 学年フィルター
 */
function test4_GradeFilter() {
  Logger.log('\n=== テスト4: 学年フィルター ===\n');
  
  const gradeFilters = [
    { grade: ['小学校1年生'] },
    { grade: ['中学校1年生'] },
    { grade: ['小学校1年生', '小学校2年生'] }
  ];
  
  gradeFilters.forEach((filter, index) => {
    Logger.log('--- フィルター' + (index + 1) + ': ' + JSON.stringify(filter.grade) + ' ---');
    
    try {
      const result = searchExperiences('*', filter);
      
      Logger.log('成功: ' + result.success);
      Logger.log('件数: ' + result.count);
      
      if (result.success && result.count > 0) {
        // 最初の2件の学年を確認
        result.data.slice(0, 2).forEach((item, idx) => {
          Logger.log('  ' + (idx + 1) + '件目の学年: ' + item.grade);
        });
        Logger.log('✓ フィルター成功\n');
      } else if (result.count === 0) {
        Logger.log('⚠ 該当データなし\n');
      } else {
        Logger.log('✗ エラー: ' + result.error + '\n');
      }
      
    } catch (error) {
      Logger.log('✗ エラー: ' + error.toString() + '\n');
    }
  });
}

/**
 * テスト5: きっかけフィルター
 */
function test5_TriggerFilter() {
  Logger.log('\n=== テスト5: きっかけフィルター ===\n');
  
  const triggerFilters = [
    { trigger: ['いじめ／友人関係'] },
    { trigger: ['勉強のつまずき'] },
    { trigger: ['発達特性・体調要因'] }
  ];
  
  triggerFilters.forEach((filter, index) => {
    Logger.log('--- フィルター' + (index + 1) + ': ' + JSON.stringify(filter.trigger) + ' ---');
    
    try {
      const result = searchExperiences('*', filter);
      
      Logger.log('成功: ' + result.success);
      Logger.log('件数: ' + result.count);
      
      if (result.success && result.count > 0) {
        // 最初の2件のきっかけを確認
        result.data.slice(0, 2).forEach((item, idx) => {
          Logger.log('  ' + (idx + 1) + '件目のきっかけ: ' + item.trigger);
        });
        Logger.log('✓ フィルター成功\n');
      } else if (result.count === 0) {
        Logger.log('⚠ 該当データなし\n');
      } else {
        Logger.log('✗ エラー: ' + result.error + '\n');
      }
      
    } catch (error) {
      Logger.log('✗ エラー: ' + error.toString() + '\n');
    }
  });
}

/**
 * テスト6: サポートフィルター
 */
function test6_SupportFilter() {
  Logger.log('\n=== テスト6: サポートフィルター ===\n');
  
  const supportFilters = [
    { support: ['フリースクール'] },
    { support: ['スクールカウンセラー'] },
    { support: ['当事者の親の会'] }
  ];
  
  supportFilters.forEach((filter, index) => {
    Logger.log('--- フィルター' + (index + 1) + ': ' + JSON.stringify(filter.support) + ' ---');
    
    try {
      const result = searchExperiences('*', filter);
      
      Logger.log('成功: ' + result.success);
      Logger.log('件数: ' + result.count);
      
      if (result.success && result.count > 0) {
        // 最初の2件のサポートを確認
        result.data.slice(0, 2).forEach((item, idx) => {
          Logger.log('  ' + (idx + 1) + '件目のサポート: ' + item.support);
        });
        Logger.log('✓ フィルター成功\n');
      } else if (result.count === 0) {
        Logger.log('⚠ 該当データなし\n');
      } else {
        Logger.log('✗ エラー: ' + result.error + '\n');
      }
      
    } catch (error) {
      Logger.log('✗ エラー: ' + error.toString() + '\n');
    }
  });
}

/**
 * テスト7: 複合フィルター（学年 + きっかけ）
 */
function test7_CombinedFilter() {
  Logger.log('\n=== テスト7: 複合フィルター（学年 + きっかけ） ===\n');
  
  const combinedFilter = {
    grade: ['中学校1年生', '中学校2年生'],
    trigger: ['いじめ／友人関係']
  };
  
  Logger.log('フィルター: ' + JSON.stringify(combinedFilter));
  
  try {
    const result = searchExperiences('*', combinedFilter);
    
    Logger.log('成功: ' + result.success);
    Logger.log('件数: ' + result.count);
    
    if (result.success && result.count > 0) {
      Logger.log('\n--- 取得データの確認 ---');
      result.data.slice(0, 3).forEach((item, idx) => {
        Logger.log('\n【' + (idx + 1) + '件目】');
        Logger.log('学年: ' + item.grade);
        Logger.log('きっかけ: ' + item.trigger);
        Logger.log('タイトル: ' + item.title);
      });
      Logger.log('\n✓ 複合フィルター成功');
    } else if (result.count === 0) {
      Logger.log('⚠ 該当データなし');
    } else {
      Logger.log('✗ エラー: ' + result.error);
    }
    
  } catch (error) {
    Logger.log('✗ エラー: ' + error.toString());
  }
}

/**
 * テスト8: キーワード + フィルター
 */
function test8_KeywordWithFilter() {
  Logger.log('\n=== テスト8: キーワード + フィルター ===\n');
  
  const keyword = '学校';
  const filter = {
    grade: ['小学校1年生', '小学校2年生', '小学校3年生']
  };
  
  Logger.log('キーワード: "' + keyword + '"');
  Logger.log('フィルター: ' + JSON.stringify(filter));
  
  try {
    const result = searchExperiences(keyword, filter);
    
    Logger.log('成功: ' + result.success);
    Logger.log('件数: ' + result.count);
    
    if (result.success && result.count > 0) {
      Logger.log('\n--- 最初の2件 ---');
      result.data.slice(0, 2).forEach((item, idx) => {
        Logger.log('\n【' + (idx + 1) + '件目】');
        Logger.log('学年: ' + item.grade);
        Logger.log('タイトル: ' + item.title);
      });
      Logger.log('\n✓ キーワード+フィルター成功');
    } else if (result.count === 0) {
      Logger.log('⚠ 該当データなし');
    } else {
      Logger.log('✗ エラー: ' + result.error);
    }
    
  } catch (error) {
    Logger.log('✗ エラー: ' + error.toString());
  }
}

/**
 * テスト9: パフォーマンステスト
 */
function test9_PerformanceTest() {
  Logger.log('\n=== テスト9: パフォーマンステスト ===\n');
  
  const tests = [
    { name: 'ワイルドカード検索', keyword: '*', filters: {} },
    { name: '学年フィルターのみ', keyword: '*', filters: { grade: ['中学校1年生'] } },
    { name: 'きっかけフィルターのみ', keyword: '*', filters: { trigger: ['いじめ／友人関係'] } },
    { name: '複合フィルター', keyword: '*', filters: { grade: ['小学校1年生'], trigger: ['いじめ／友人関係'] } },
    { name: 'キーワード検索', keyword: '学校', filters: {} }
  ];
  
  tests.forEach(test => {
    Logger.log('--- ' + test.name + ' ---');
    
    try {
      const startTime = new Date().getTime();
      const result = searchExperiences(test.keyword, test.filters);
      const endTime = new Date().getTime();
      const duration = endTime - startTime;
      
      Logger.log('実行時間: ' + duration + 'ms');
      Logger.log('結果件数: ' + result.count);
      
      if (duration > 5000) {
        Logger.log('⚠ 警告: 実行時間が5秒を超えています（タイムアウトの可能性）');
      } else if (duration > 2000) {
        Logger.log('⚠ 注意: 実行時間が2秒を超えています');
      } else {
        Logger.log('✓ 正常な実行時間');
      }
      
    } catch (error) {
      Logger.log('✗ エラー: ' + error.toString());
    }
    
    Logger.log('');
  });
}

/**
 * すべてのテストを実行
 */
function runAllFilterTests() {
  Logger.log('========================================');
  Logger.log('GAS絞り込み検索機能 - 統合テスト');
  Logger.log('実行日時: ' + new Date());
  Logger.log('========================================');
  
  test1_CheckSpreadsheetStructure();
  test2_WildcardSearch();
  test3_KeywordSearch();
  test4_GradeFilter();
  test5_TriggerFilter();
  test6_SupportFilter();
  test7_CombinedFilter();
  test8_KeywordWithFilter();
  test9_PerformanceTest();
  
  Logger.log('\n========================================');
  Logger.log('テスト完了');
  Logger.log('========================================');
  Logger.log('\n実行ログ(Ctrl+Enter)を確認してください');
}

/**
 * クイックテスト: 基本的な動作確認のみ
 */
function quickTest() {
  Logger.log('=== クイックテスト ===\n');
  
  test1_CheckSpreadsheetStructure();
  test2_WildcardSearch();
  test9_PerformanceTest();
  
  Logger.log('\n=== クイックテスト完了 ===');
}
