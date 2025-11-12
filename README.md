# 福井県不登校情報サイト - web_Fukui

このプロジェクトは [Create React App](https://github.com/facebook/create-react-app) でブートストラップされました。

## 📐 レスポンシブデザイン仕様（最新版）

### ブレークポイント別レイアウト

#### 1. **1304px以上** - 中央寄せ表示
```
例: 1500px時
余白 = (1500-1304)/2 = 98px

|148(可変あり)|[ナビ270]|72|[メイン540]|72|[バナー200]|198(可変あり)|
    ↑                                              ↑
  50+98                                         100+98

合計: 148+270+72+540+72+200+198 = 1500px
```
- 1304pxレイアウトを中央寄せ
- 左右に均等に余白を追加

#### 2. **1304px以下** - デフォルトレイアウト
```
|50|[ナビ270]|72|[メイン540]|72|[バナー200]|100(可変あり)|
合計: 1304px
```
- すべて表示、右余白100px以上（可変）

#### 3. **1254px以下** - 右余白縮小
```
|50|[ナビ270]|72|[メイン540]|72|[バナー200]|50(可変あり)|
合計: 1254px
```
- 右余白が50px以上（可変）

#### 4. **1253px以下** - バナー非表示
```
|50|[ナビ270]|72|[メイン540]|(可変あり)|
```
- バナー非表示
- 右余白は画面幅に応じて可変

#### 5. **982px以下** - ナビ非表示、ハンバーガーメニュー表示
```
|(可変あり)|[メイン540]|(可変あり)|
※左右均等に余白、メイン中央配置
```
- **ナビゲーション非表示**
- **ハンバーガーメニュー表示**（右上に固定表示）
- メインコンテンツのみ、中央配置

**ハンバーガーメニュー開いた時:**
```
画面右側から270px幅のメニューが出現
|[メイン表示継続]|[ハンバーガー270]|
                        ↑右寄せ固定
```

#### 6. **560px以下** - 比率ベース縮小
```
比率: 左余白(1.79%) メイン(96.43%) 右余白(1.79%)
※10/560 = 1.79%, 540/560 = 96.43%

例: 400px時
|7.14(可変あり)|[メイン385.71(可変あり)]|7.14(可変あり)|
合計: 400px

例: 320px時
|5.71(可変あり)|[メイン308.57(可変あり)]|5.71(可変あり)|
合計: 320px
```
- メインコンテンツが画面幅に応じて縮小
- 左右余白の比率は1.79%で固定

**ハンバーガーメニュー開いた時:**
```
比率: メニュー幅 46.55% (270/580基準)
※画面幅に応じて縮小

例: 400px時
|[メイン表示継続]|[ハンバーガー186(可変あり)]|
                    ↑右寄せ、46.55%幅
```

### 📱 ハンバーガーメニュー仕様

- **表示条件**: 982px以下
- **位置**: 画面右上に固定
- **開閉**: 右側からスライドイン
- **幅**:
  - 561px以上: 270px固定
  - 560px以下: 46.55%（270/580基準）、画面幅に応じて縮小
- **最大幅**: 270px
- **z-index**: 999（メインコンテンツより上に表示）

### 🎨 デザイン原則

- **1304px以上**: 中央寄せで統一感を維持
- **1304px〜983px**: 固定幅レイアウト、段階的に要素を非表示
- **982px以下**: ハンバーガーメニュー化
- **560px以下**: 完全比率ベース、どんな画面サイズでもレイアウト崩れなし

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
