/**
 * カード（サムネイル）の設定ファイル
 * 
 * 各種カードコンポーネントのデザイン設定を一元管理します。
 * このファイルを編集することで、すべてのカードの見た目を統一的に変更できます。
 */

// TweetCard（体験談カード）の設定
export const tweetCardConfig = {
  // カードのサイズ
  width: 240,           // カードの幅（px）
  height: 149,          // カードの高さ（px）
  
  // パディング・余白
  padding: {
    top: 15,
    right: 20,
    bottom: 15,
    left: 20
  },
  
  // テキストエリア
  text: {
    maxWidth: 200,      // テキストの最大幅（px）
    fontSize: 14,       // フォントサイズ（px）
    lineHeight: 18,     // 行の高さ（px）
    maxLines: 3,        // 最大表示行数
    letterSpacing: '0.1em'  // 文字間隔
  },
  
  // 区切り線
  divider: {
    maxWidth: 200,      // 区切り線の最大幅（px）
    height: 2,          // 区切り線の高さ（px）
    dotSize: 1,         // ドットのサイズ（px）
    spacing: 8          // ドット間の間隔（px）
  },
  
  // フッター（投稿者情報）
  footer: {
    maxWidth: 200,      // フッターの最大幅（px）
    gap: 5,             // 要素間の間隔（px）
    
    // アバター
    avatar: {
      size: 25,         // アバターのサイズ（px）
      fontSize: 14,     // イニシャルのフォントサイズ（px）
      backgroundColor: '#F4BED3'  // 背景色
    },
    
    // 投稿者名
    authorName: {
      fontSize: 12,     // フォントサイズ（px）
      lineHeight: 15    // 行の高さ（px）
    },
    
    // 日付
    date: {
      fontSize: 12,     // フォントサイズ（px）
      lineHeight: 15    // 行の高さ（px）
    }
  },
  
  // ボーダー
  border: {
    width: 1.5,         // ボーダーの太さ（px）
    radius: 10,         // 角の丸み（px）
    color: 'var(--color-black)'  // ボーダーの色
  },
  
  // ホバー効果
  hover: {
    translateY: -2,     // 上方向への移動量（px）
    shadow: '0 4px 8px rgba(0, 0, 0, 0.1)'  // シャドウ
  }
};

// PlaceCard（居場所カード）の設定
export const placeCardConfig = {
  width: 240,
  height: 200,
  // 必要に応じて追加
};

// InterviewCard（インタビューカード）の設定
export const interviewCardConfig = {
  width: 240,
  height: 180,
  // 必要に応じて追加
};

// ReviewCard（口コミカード）の設定
export const reviewCardConfig = {
  width: 240,
  height: 160,
  // 必要に応じて追加
};

// デフォルトエクスポート（すべての設定を含むオブジェクト）
export default {
  tweetCard: tweetCardConfig,
  placeCard: placeCardConfig,
  interviewCard: interviewCardConfig,
  reviewCard: reviewCardConfig
};
