# 体験談検索機能 実装ガイド

## 実装概要

体験談のフリーワード検索機能を実装しました。この機能は、React（フロントエンド）とGoogle Apps Script（バックエンド）を組み合わせて構築されています。

---

## アーキテクチャ

```
[ユーザー] 
    ↓ キーワード入力
[React App - 体験談を探すページ]
    ↓ 検索ボタンクリック
[React App - 検索結果ページ]
    ↓ API リクエスト
[Google Apps Script (GAS)]
    ↓ データ検索
[Google スプレッドシート]
    ↓ 検索結果
[GAS → React]
    ↓ 表示
[検索結果ページに表示]
```

---

## 作成されたファイル

### 1. Reactコンポーネント

#### `/src/components/MainContent/experiences/ExperiencesSearchResultsContent.js`
検索結果を表示するページコンポーネント。
- URLパラメータから検索キーワードを取得
- GAS APIを呼び出して検索実行
- ローディング・エラー・結果の表示制御
- フィルター機能との連携

#### `/src/components/MainContent/experiences/ExperiencesSearchResultsContent.module.css`
検索結果ページのスタイル定義。
- レスポンシブデザイン対応
- ローディングスピナー
- エラー表示のスタイル

#### `/src/components/MainContent/experiences/ExperiencesContent.js` (更新)
既存の「体験談を探す」ページに検索機能を追加。
- 検索ボックスへの入力処理
- 検索ボタンクリック時のページ遷移
- Enterキーでの検索対応

### 2. API通信

#### `/src/utils/gasApi.js`
GAS APIとの通信を管理するユーティリティ関数。
- `searchExperiences()`: フリーワード検索
- `getAllExperiences()`: 全体験談取得（ピックアップ用）
- `postExperience()`: 体験談投稿
- エラーハンドリングとリトライ処理

#### `/src/config/gasConfig.js`
GAS APIの設定を管理。
- エンドポイントURL
- タイムアウト設定
- リトライ設定

### 3. ルーティング

#### `/src/App.js` (更新)
検索結果ページのルートを追加。
- `/experiences/search` ルートを追加
- URLパラメータでキーワードを受け渡し

### 4. Google Apps Script

#### `/gas/searchExperiences.gs`
スプレッドシートから体験談を検索するGASスクリプト。
- フリーワード検索機能
- フィルター機能（学年、きっかけ、状況、支援体験）
- CORS対応
- エラーハンドリング

### 5. ドキュメント

#### `/GAS_SETUP.md`
GASのセットアップ手順を詳しく説明。

#### `/.env.example` (更新)
GAS APIのURL設定を追加。

---

## セットアップ手順

### 1. Google スプレッドシートの準備

詳細は `GAS_SETUP.md` を参照してください。

1. 新しいスプレッドシートを作成
2. シート名を「体験談データ」に設定
3. ヘッダー行を設定（タイトル、内容、投稿者名、投稿日、学年、きっかけ、状況、支援体験）
4. スプレッドシートIDを取得

### 2. Google Apps Scriptのデプロイ

1. スプレッドシートから「拡張機能」→「Apps Script」を開く
2. `gas/searchExperiences.gs` の内容をコピー＆貼り付け
3. `SPREADSHEET_ID` を実際のIDに変更
4. ウェブアプリケーションとしてデプロイ
5. デプロイURLを取得

### 3. React アプリの環境変数設定

```bash
# .envファイルを作成
cp .env.example .env
```

`.env` ファイルを編集：
```env
REACT_APP_GAS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 4. 開発サーバーの再起動

```bash
npm start
```

---

## 使い方

### ユーザー側の操作

1. **検索ページへアクセス**
   - `http://localhost:3000/web_Fukui/experiences` にアクセス

2. **キーワードを入力**
   - 検索ボックスにキーワードを入力（例：「不登校」「フリースクール」）

3. **検索実行**
   - 「検索する」ボタンをクリック、またはEnterキーを押す

4. **検索結果の確認**
   - 検索結果ページ (`/experiences/search?keyword=XXX`) に遷移
   - 該当する体験談がカード形式で表示される

5. **フィルター機能の使用**（オプション）
   - 「絞り込み」ボタンをクリック
   - 学年、きっかけ、状況、支援体験などの条件を選択
   - 選択した条件で検索結果を絞り込み

---

## 技術仕様

### 検索ロジック

GASスクリプトでは以下の処理を行います：

1. **キーワードマッチング**
   - タイトルと内容の両方から検索
   - 大文字小文字を区別しない部分一致検索

2. **フィルタリング**
   - 学年、きっかけ、状況、支援体験の4つのカテゴリでフィルター可能
   - 複数の条件を組み合わせて絞り込み（AND条件）

3. **データ取得**
   - スプレッドシートから該当するデータを抽出
   - 日付を整形して返却
   - 投稿者名のイニシャルを自動生成

### API仕様

#### リクエスト形式

```javascript
POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

// Body
{
  "endpoint": "searchExperiences",
  "keyword": "不登校",
  "filters": {
    "grade": ["中学生"],
    "trigger": ["不登校"],
    "situation": ["学校復帰"],
    "support": ["フリースクール"]
  }
}
```

#### レスポンス形式

```javascript
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "不登校から学校復帰までの道のり",
      "description": "中学2年生の時に不登校になりましたが...",
      "authorName": "田中太郎",
      "authorInitial": "田",
      "date": "2025.11.27",
      "grade": "中学生",
      "trigger": "不登校",
      "situation": "学校復帰",
      "support": "フリースクール"
    }
  ],
  "count": 1
}
```

### エラーハンドリング

- タイムアウト: 30秒
- リトライ: 最大3回
- エラー時にはユーザーフレンドリーなメッセージを表示

---

## 今後の拡張予定

### 検索機能の改善
- [ ] 検索履歴の保存
- [ ] サジェスト機能
- [ ] タグ検索
- [ ] 全文検索の精度向上

### フィルター機能の拡張
- [ ] 日付範囲での絞り込み
- [ ] 人気順・新着順のソート
- [ ] 複数キーワードのOR検索

### パフォーマンス最適化
- [ ] 検索結果のキャッシュ
- [ ] ページネーション
- [ ] 無限スクロール

### データ管理
- [ ] 投稿機能の実装
- [ ] 管理画面の作成
- [ ] データのバックアップ機能

---

## トラブルシューティング

よくある問題と解決方法は `GAS_SETUP.md` の「トラブルシューティング」セクションを参照してください。

---

## 関連ドキュメント

- [GAS セットアップガイド](./GAS_SETUP.md) - GASの詳細なセットアップ手順
- [OAuth セットアップガイド](./OAUTH_SETUP.md) - Google OAuth 2.0の設定方法
- [README.txt](./README.txt) - プロジェクト全体の構成説明

---

更新日: 2025年11月27日
