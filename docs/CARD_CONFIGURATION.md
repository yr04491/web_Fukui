# カード（サムネイル）設定ガイド

体験談カードなどのサムネイルのデザインを変更する方法について説明します。

## 設定ファイルの場所

カードのデザイン設定は以下のファイルで管理されています：

- **設定ファイル**: [src/config/cardConfig.js](../src/config/cardConfig.js)
- **スタイル**: [src/components/common/TweetCard/TweetCard.module.css](../src/components/common/TweetCard/TweetCard.module.css)

## カードサイズの変更方法

### 1. 設定ファイルを編集

`src/config/cardConfig.js`を開き、`tweetCardConfig`の値を変更します。

```javascript
export const tweetCardConfig = {
  // カードのサイズ
  width: 240,           // ← ここを変更
  height: 149,          // ← ここを変更
  
  // ...その他の設定
};
```

### 2. CSSファイルを更新

`src/components/common/TweetCard/TweetCard.module.css`を開き、対応する値を更新します。

```css
.tweetCard {
  width: 240px;  /* ← cardConfig.jsの値と合わせる */
  min-width: 240px;
  height: 149px; /* ← cardConfig.jsの値と合わせる */
  /* ...その他のスタイル */
}
```

**注意**: CSSファイルのコメントに `cardConfig.js: tweetCardConfig.xxx` と記載されている箇所が対応関係を示しています。

## よくある変更項目

### カードの幅を広げる

```javascript
// cardConfig.js
width: 280,  // 240 → 280 に変更
```

```css
/* TweetCard.module.css */
.tweetCard {
  width: 280px;
  min-width: 280px;
}
```

### テキストのサイズを大きくする

```javascript
// cardConfig.js
text: {
  fontSize: 16,      // 14 → 16 に変更
  lineHeight: 20,    // 18 → 20 に変更
}
```

```css
/* TweetCard.module.css */
.tweetText {
  font-size: 16px;
  line-height: 20px;
}
```

### 表示する行数を変更

```javascript
// cardConfig.js
text: {
  maxLines: 4,  // 3 → 4 に変更
}
```

```css
/* TweetCard.module.css */
.tweetText {
  -webkit-line-clamp: 4; /* 3 → 4 に変更 */
}
```

### アバターの色を変更

```javascript
// cardConfig.js
avatar: {
  backgroundColor: '#A8D5E2'  // 水色に変更
}
```

```css
/* TweetCard.module.css */
.authorAvatar {
  background: #A8D5E2;
}
```

## 設定可能な項目一覧

### カード全体
- `width` - カードの幅
- `height` - カードの高さ
- `padding` - 内側の余白
- `border` - ボーダーの設定

### テキスト
- `text.fontSize` - フォントサイズ
- `text.lineHeight` - 行の高さ
- `text.maxLines` - 最大表示行数
- `text.letterSpacing` - 文字間隔

### フッター
- `footer.avatar.size` - アバターのサイズ
- `footer.avatar.backgroundColor` - アバターの背景色
- `footer.authorName.fontSize` - 投稿者名のサイズ
- `footer.date.fontSize` - 日付のサイズ

## トラブルシューティング

### 変更が反映されない場合

1. ブラウザのキャッシュをクリア
2. 開発サーバーを再起動
   ```bash
   # Ctrl+C で停止後
   npm start
   ```

### レイアウトが崩れた場合

1. 設定ファイルとCSSファイルの値が一致しているか確認
2. 変更前の値に戻して動作を確認
3. 一つずつ変更して問題箇所を特定

## 他のカードタイプ

同じ方法で以下のカードも設定できます：

- **PlaceCard** (居場所カード) - `placeCardConfig`
- **InterviewCard** (インタビューカード) - `interviewCardConfig`
- **ReviewCard** (口コミカード) - `reviewCardConfig`

各カードの設定は `cardConfig.js` で管理されています。
