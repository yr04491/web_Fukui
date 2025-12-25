# 管理者機能 GAS セットアップ手順

## 概要
体験談の承認・却下機能を実装するためのGoogle Apps Script (GAS) セットアップ手順です。

## 前提条件
- スプレッドシートに以下の列が追加されていること：
  - **BD列（56列目）**: 承認ステータス
  - **BE列（57列目）**: 承認日時
  - **BF列（58列目）**: 最終編集日時
  - **BG列（59列目）**: 承認回数

## セットアップ手順

### 1. GASファイルの追加

Google Apps Scriptエディタで、新しいファイル `adminFunctions.gs` を作成し、`gas/adminFunctions.gs` の内容をコピーしてください。

### 2. 既存ファイルの更新

`searchExperiences.gs` を以下のように更新してください：

1. `doPost` 関数に新しいエンドポイントを追加（既に更新済み）
2. `searchExperiences` 関数に承認ステータスのチェックを追加（既に更新済み）
3. `getAllExperiences` 関数に承認ステータスのチェックを追加（既に更新済み）

### 3. 初期データの設定

既存のデータを承認済みにする場合は、以下のスクリプトを実行してください：

```javascript
function setAllToApproved() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('フォームの回答 1');
  const lastRow = sheet.getLastRow();
  
  // 2行目から最終行まで（1行目はヘッダー）
  for (let i = 2; i <= lastRow; i++) {
    // BD列（56列目）に「承認済み」を設定
    sheet.getRange(i, 56).setValue('承認済み');
    
    // BE列（57列目）に承認日時を設定
    const now = new Date();
    sheet.getRange(i, 57).setValue(Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss'));
    
    // BG列（59列目）に承認回数「1」を設定
    sheet.getRange(i, 59).setValue(1);
  }
  
  Logger.log('すべてのデータを承認済みに設定しました');
}
```

### 4. 編集トリガーの設定

Googleフォームで投稿を編集した際に、自動的に承認ステータスを「未承認」に戻すトリガーを設定します。

1. GASエディタで「トリガー」（時計アイコン）をクリック
2. 右下の「トリガーを追加」をクリック
3. 以下のように設定：
   - **実行する関数**: `onEditTrigger`
   - **実行するデプロイ**: `Head`
   - **イベントのソース**: `スプレッドシートから`
   - **イベントの種類**: `編集時`
4. 「保存」をクリック

### 5. 新しいフォーム投稿のデフォルト設定

新しく投稿された体験談のデフォルトステータスを「未承認」にするには、以下のトリガーも設定します：

```javascript
function onFormSubmit(e) {
  try {
    const sheet = e.range.getSheet();
    
    // 対象シートかチェック
    if (sheet.getName() !== 'フォームの回答 1') {
      return;
    }
    
    const row = e.range.getRow();
    
    // BD列（56列目）に「未承認」を設定
    sheet.getRange(row, 56).setValue('未承認');
    
    Logger.log('新しい投稿（行' + row + '）を未承認に設定しました。');
    
  } catch (error) {
    Logger.log('onFormSubmit Error: ' + error.toString());
  }
}
```

このトリガーも設定：
- **実行する関数**: `onFormSubmit`
- **イベントのソース**: `スプレッドシートから`
- **イベントの種類**: `フォーム送信時`

### 6. デプロイ

既存のWeb アプリケーションとして公開されているGASを再デプロイしてください：

1. GASエディタで「デプロイ」→「デプロイを管理」
2. 既存のデプロイの「編集」アイコンをクリック
3. 「バージョン」で「新バージョン」を選択
4. 「デプロイ」をクリック

## API エンドポイント

以下の新しいエンドポイントが利用可能になります：

### getPendingExperiences
未承認の体験談を取得
```javascript
{
  "endpoint": "getPendingExperiences"
}
```

### getApprovedExperiences
承認済みの体験談を取得
```javascript
{
  "endpoint": "getApprovedExperiences"
}
```

### approveExperience
体験談を承認
```javascript
{
  "endpoint": "approveExperience",
  "id": 2  // 行番号（2行目以降）
}
```

### rejectExperience
体験談を却下
```javascript
{
  "endpoint": "rejectExperience",
  "id": 2  // 行番号（2行目以降）
}
```

## 動作確認

1. テスト用の投稿を作成
2. 管理者画面（`/admin`）で未承認一覧に表示されることを確認
3. 承認ボタンをクリック
4. 承認済み一覧に移動することを確認
5. 体験談を探すページで表示されることを確認

## トラブルシューティング

### 承認ステータスが反映されない場合
- BD列の値が正確に「承認済み」「未承認」「却下」になっているか確認
- 全角・半角、スペースの有無を確認

### 編集時にステータスが戻らない場合
- `onEditTrigger` のトリガーが正しく設定されているか確認
- GASの実行ログで動作を確認

### データが表示されない場合
- スプレッドシートのシート名が「フォームの回答 1」になっているか確認
- GASの実行ログでエラーを確認
