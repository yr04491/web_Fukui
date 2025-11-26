# Google OAuth 2.0 認証セットアップガイド

## 1. Google Cloud Platformでの設定

### 1-1. プロジェクトの作成
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）

### 1-2. OAuth 2.0 認証情報の作成
1. 左メニューから「APIとサービス」→「認証情報」を選択
2. 「認証情報を作成」→「OAuth クライアント ID」をクリック
3. 同意画面の構成（初回のみ）
   - ユーザータイプ: **外部** を選択
   - アプリ名: `web_Fukui` （任意）
   - ユーザーサポートメール: 自分のメールアドレス
   - デベロッパーの連絡先情報: 自分のメールアドレス
   - 「保存して次へ」をクリック
   - スコープは追加不要（デフォルトのまま）
   - テストユーザーを追加（必要に応じて）

4. OAuth クライアント ID の作成
   - アプリケーションの種類: **ウェブ アプリケーション**
   - 名前: `web_Fukui OAuth Client` （任意）
   - 承認済みの JavaScript 生成元:
     ```
     http://localhost:3000
     http://localhost:3000/web_Fukui
     ```
   - 承認済みのリダイレクト URI:
     ```
     http://localhost:3000
     http://localhost:3000/web_Fukui
     http://localhost:3000/web_Fukui/login
     ```
   - 「作成」をクリック

5. **クライアント ID** が表示されるのでコピー

### 1-3. 本番環境用の設定（GitHub Pages）
本番デプロイ時には、以下も追加：
- 承認済みの JavaScript 生成元:
  ```
  https://yr04491.github.io
  ```
- 承認済みのリダイレクト URI:
  ```
  https://yr04491.github.io/web_Fukui
  https://yr04491.github.io/web_Fukui/login
  ```

## 2. ローカル環境での設定

### 2-1. 環境変数ファイルの作成
プロジェクトのルートディレクトリに `.env` ファイルを作成：

```bash
cp .env.example .env
```

### 2-2. Client IDの設定
`.env` ファイルを開いて、Google Cloud Consoleで取得したClient IDを設定：

```env
REACT_APP_GOOGLE_CLIENT_ID=あなたのクライアントID.apps.googleusercontent.com
```

### 2-3. 開発サーバーの再起動
環境変数を読み込むため、開発サーバーを再起動：

```bash
# サーバーを停止（Ctrl + C）
npm start
```

## 3. 動作確認

### 3-1. ログインフローのテスト
1. ブラウザで `http://localhost:3000/web_Fukui` を開く
2. フッターの「体験談の投稿」をクリック
3. ログインページにリダイレクトされる
4. 「Googleでログイン」ボタンをクリック
5. Googleアカウントを選択してログイン
6. 投稿ページにリダイレクトされる

### 3-2. ログアウトのテスト
現在、ログアウト機能はブラウザのコンソールから実行可能：
```javascript
localStorage.removeItem('googleUser');
window.location.reload();
```

## 4. セキュリティに関する注意事項

### 4-1. .envファイルの管理
- `.env` ファイルは **絶対に Git にコミットしない**
- `.gitignore` に `.env` が含まれていることを確認
- `.env.example` のみをコミット

### 4-2. Client IDの扱い
- Client IDは公開されても問題ありませんが、Client Secret は **絶対に公開しない**
- 今回の実装ではClient Secretは使用していません（フロントエンドのみ）

### 4-3. 本番環境での考慮事項
- GitHub Pagesでデプロイする場合、環境変数は直接埋め込む必要があります
- ビルド時に環境変数を設定：
  ```bash
  REACT_APP_GOOGLE_CLIENT_ID=your_client_id npm run build
  ```

## 5. トラブルシューティング

### エラー: "Invalid Client"
- Client IDが正しく設定されているか確認
- Google Cloud Consoleで承認済みのJavaScript生成元とリダイレクトURIが正しく設定されているか確認

### ログインボタンが表示されない
- ブラウザのコンソールでエラーを確認
- `.env` ファイルが正しく読み込まれているか確認
  ```javascript
  console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);
  ```

### ログイン後にリダイレクトされない
- ブラウザのコンソールでエラーを確認
- ネットワークタブで認証リクエストが成功しているか確認

## 6. 今後の拡張機能

- [ ] ナビゲーションバーにログイン/ログアウトボタンを追加
- [ ] ユーザープロフィール表示
- [ ] 投稿履歴の表示
- [ ] 投稿の編集・削除機能
