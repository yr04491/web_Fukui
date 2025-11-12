# 福井県不登校情報サイト - web_Fukui

このプロジェクトは [Create React App](https://github.com/facebook/create-react-app) でブートストラップされました。

## 📐 レスポンシブデザイン仕様

### デスクトップ版 (基準: 1304px)

画面レイアウト比率:
```
|--3.83%--|[ナビ20.70%]|--5.52%--|[メイン41.41%]|--5.52%--|[バナー15.34%]|--7.67%--|
  (50px)    (270px)     (72px)     (540px)      (72px)     (200px)       (100px)
```

- **ナビゲーション**: 幅270px (20.70%)、左から50px (3.83%)
- **メインコンテンツ**: 幅540px (41.41%)
- **バナー**: 幅200px (15.34%)、右から100px (7.67%)
- **要素間隔**: 72px (5.52%)

### モバイル版 (基準: 580px)

画面レイアウト比率:
```
|--3.45%--|[メインコンテンツ93.10%]|--3.45%--|
  (20px)         (540px)            (20px)
```

- **メインコンテンツのみ表示**: 幅540px (93.10%)
- **左右余白**: 各20px (3.45%)
- **ハンバーガーメニュー**: 幅270px (46.55%)、右寄せ表示

### 比率ベースのレスポンシブ対応

デバイスや画面サイズに関わらず、比率を維持することで一貫したレイアウトを実現:
- `%` 単位で幅を指定
- `max-width` / `min-width` で範囲を制限
- 画面幅に応じて自動的にスケール

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
