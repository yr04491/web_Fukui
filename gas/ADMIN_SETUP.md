# 管理者機能 GAS セットアップ手順

## 概要
体験談の承認・却下機能とメール通知を実装するためのGoogle Apps Script (GAS) セットアップ手順です。

## 前提条件
- スプレッドシートに以下の列が追加されていること：
  - **BD列（56列目）**: メールアドレス（自動収集）
  - **BE列（57列目）**: 承認ステータス
  - **BF列（58列目）**: 承認日時
  - **BG列（59列目）**: 最終編集日時
  - **BH列（60列目）**: 承認回数
  - **BI列（61列目）**: 却下理由

## セットアップ手順

### 1. Googleフォームの設定

承認・却下メールを送信するために、Googleフォームで以下の設定を行ってください：

1. **フォームを開く** → 右上の「設定」（⚙️）をクリック
2. **全般タブ** で以下を有効化：
   - ☑️ **メールアドレスを収集する**（必須）
   - ☑️ **回答のコピーを回答者に送信**（推奨）
   - ☑️ **回答を1回に制限する**（推奨 - 重複投稿防止）
   - ☑️ **回答後に編集できるようにする**（任意）

3. **設定を保存**

これにより、BD列にメールアドレスが自動的に記録されます。

### 2. GASファイルの追加

Google Apps Scriptエディタで、新しいファイル `adminFunctions.gs` を作成し、`gas/adminFunctions.gs` の内容をコピーしてください。

### 3. フォームURLの設定

`adminFunctions.gs` の冒頭にある `FORM_URL` を、あなたのGoogleフォームの編集URLに置き換えてください：

```javascript
const FORM_URL = 'https://docs.google.com/forms/d/YOUR_FORM_ID/edit';
```

フォームのURLは、フォームを開いて「送信」→「リンクをコピー」から取得できます。

### 4. 既存ファイルの更新

`searchExperiences.gs` を以下のように更新してください：

1. `doPost` 関数に新しいエンドポイントを追加（既に更新済み）
2. `searchExperiences` 関数に承認ステータスのチェックを追加（既に更新済み）
3. `getAllExperiences` 関数に承認ステータスのチェックを追加（既に更新済み）

### 5. メール送信機能のテスト

メール送信が正しく動作するか確認するため、テスト関数を実行します：

```javascript
function testApprovalEmail() {
  // テスト用メールアドレス（自分のアドレスに置き換えてください）
  const testEmail = 'your-email@example.com';
  const testName = 'テストユーザー';
  const testTitle = 'これはテスト体験談です...';
  
  sendApprovalEmail(testEmail, testName, testTitle);
  Logger.log('承認メールのテスト送信完了');
}

function testRejectionEmail() {
  // テスト用メールアドレス（自分のアドレスに置き換えてください）
  const testEmail = 'your-email@example.com';
  const testName = 'テストユーザー';
  const testTitle = 'これはテスト体験談です...';
  const testReason = '詳細な情報が不足しているため、再投稿をお願いします。';
  
  sendRejectionEmail(testEmail, testName, testTitle, testReason);
  Logger.log('却下メールのテスト送信完了');
}
```

GASエディタで上記の関数を実行し、メールが正しく届くか確認してください。

### 6. 初期データの設定

既存のデータを承認済みにする場合は、以下のスクリプトを実行してください：

```javascript
function setAllToApproved() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('フォームの回答 1');
  const lastRow = sheet.getLastRow();
  
  // 2行目から最終行まで（1行目はヘッダー）
  for (let i = 2; i <= lastRow; i++) {
    // BE列（57列目）に「承認済み」を設定
    sheet.getRange(i, 57).setValue('承認済み');
    
    // BF列（58列目）に承認日時を設定
    const now = new Date();
    sheet.getRange(i, 58).setValue(Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss'));
    
    // BH列（60列目）に承認回数「1」を設定
    sheet.getRange(i, 60).setValue(1);
  }
  
  Logger.log('すべてのデータを承認済みに設定しました');
}
```

## メール送信の仕組み

### 承認時のメール

- 承認ボタンをクリックすると、投稿者のメールアドレスに承認通知が自動送信されます
- 件名: 「【承認通知】あなたの体験談が承認されました」
- 本文には承認日時と体験談のタイトルが含まれます

### 却下時のメール

- 却下ボタンをクリックして却下理由を記入すると、投稿者に却下理由付きメールが送信されます
- 件名: 「【再投稿のお願い】体験談について」
- 本文には却下理由と再投稿用のフォームURLが含まれます
- 投稿者は修正後、新規投稿として再度送信します

### メール送信の失敗について

- メール送信に失敗しても、承認・却下処理自体は正常に完了します
- エラーはGASのログに記録されます

## 却下された投稿の管理

### データの保持期間

却下された投稿はスプレッドシートに履歴として保持されますが、以下のクリーンアップ関数で古いデータを削除できます：

```javascript
/**
 * 90日以上経過した却下投稿を自動削除
 * 定期的に実行することを推奨（月次トリガーなど）
 */
function cleanupRejectedExperiences() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('フォームの回答 1');
  const data = sheet.getDataRange().getValues();
  const today = new Date();
  const APPROVAL_STATUS_INDEX = 56; // BE列
  const APPROVAL_DATE_INDEX = 57;   // BF列
  const STATUS_REJECTED = '却下';
  
  for (let i = data.length - 1; i >= 1; i--) {
    const status = data[i][APPROVAL_STATUS_INDEX];
    const rejectDate = data[i][APPROVAL_DATE_INDEX];
    
    if (status === STATUS_REJECTED && rejectDate) {
      const daysSinceRejection = (today - new Date(rejectDate)) / (1000 * 60 * 60 * 24);
      
      // 90日以上経過した却下投稿を削除
      if (daysSinceRejection > 90) {
        sheet.deleteRow(i + 1);
        Logger.log('削除: 行' + (i + 1) + ' (却下から' + Math.floor(daysSinceRejection) + '日経過)');
      }
    }
  }
  
  Logger.log('クリーンアップ完了');
}
```

### 7. トリガーの設定（必須）

承認ワークフローを正しく機能させるために、以下の2つのトリガーを設定してください。

#### 7-1. フォーム送信トリガー

新しく投稿された体験談のデフォルトステータスを「未承認」に自動設定します。

1. **GASエディタ**で「トリガー」（⏰時計アイコン）をクリック
2. 右下の「**トリガーを追加**」をクリック
3. 以下のように設定：
   - **実行する関数**: `onFormSubmit`
   - **実行するデプロイ**: `Head`
   - **イベントのソース**: `スプレッドシートから`
   - **イベントの種類**: `フォーム送信時`
4. 「**保存**」をクリック

> **Note**: `onFormSubmit` 関数は `adminFunctions.gs` に既に実装されています。

#### 7-2. 編集トリガー

Googleフォームで投稿を編集した際に、自動的に承認ステータスを「未承認」に戻します。

1. 同じく「**トリガーを追加**」をクリック
2. 以下のように設定：
   - **実行する関数**: `onEditTrigger`
   - **実行するデプロイ**: `Head`
   - **イベントのソース**: `スプレッドシートから`
   - **イベントの種類**: `編集時`
3. 「**保存**」をクリック

> **Note**: `onEditTrigger` 関数は `adminFunctions.gs` に既に実装されています。

### 8. デプロイ

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
