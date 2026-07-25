# Firebase(Firestore) 移行 実装計画 — 案A（GAS書き込み方式）

最終更新: 2026-07-15

## 0. この計画の方針（前提の再確認）

- **役割分担**
  - Googleフォーム + スプレッドシート … 生データの受け皿・審査待ち行列（source of truth）
  - GAS … 投稿受付・承認/却下の処理、**承認済みデータをFirestoreへ書き出す同期処理**
  - Firestore … 「承認済みで公開してよいデータ」だけを置く**読み取り専用の公開キャッシュ**
  - ホームページ(React) … Firestoreから直接読む（GASを介さないので高速）
- **案Aの核**: Firestoreへの書き込みは **GASだけ** が行う。ブラウザからFirestoreへは書かない（＝書き込み経路が1本なので不整合が起きにくい）。
- **Googleアカウント/フォームは維持**。既存の [gas/adminFunctions.gs](../gas/adminFunctions.gs) の承認処理をベースに拡張する。

```
[投稿] フォーム → スプレッドシート(未承認)
                     │ 管理者がAdminページで承認
                     ▼
[GAS] approveExperience() ─(既存)→ シートのステータス更新＋承認メール
                     └─(★追加)→ FirestoreにupsertPublishedDoc()
                                          │
[表示] Homepage(React) ──読み取り──────────┘  (Firebase SDK, 高速)
```

---

## 1. Firestore データモデル設計

DB初心者向けに用語だけ先に:
- **コレクション(collection)** … テーブルのようなもの（例: `experiences`）
- **ドキュメント(document)** … 1レコード（例: 1件の体験談）。IDを持つ
- **読み取り課金** … 「1ドキュメント読む＝1リード」。無料枠は1日5万リード。**ホームページ1回の表示で何リード発生するかを意識して設計する**

### 1-1. コレクション構成

3カテゴリを別コレクションにする:

| コレクション | 中身 | ドキュメントID |
|---|---|---|
| `experiences` | 承認済みの体験談 | シートの行番号（既存の `id` と一致させる） |
| `places` | 承認済みの居場所 | 同上 |
| `schools` | 承認済みの進路 | 同上 |

> ドキュメントIDをシート行番号にすることで、「同じ投稿を再承認したら上書き（upsert）」が自然にでき、重複が生まれない。

### 1-2. ドキュメントのフィールド（公開してよい項目だけ）

**重要な原則**: メールアドレス等の個人情報（[adminFunctions.gs](../gas/adminFunctions.gs) の `EMAIL_ADDRESS_INDEX`=BF列など）は**Firestoreに入れない**。入れるのは画面表示に必要な項目だけ。これにより「全員が読める」設定でも安全になる。

`experiences` ドキュメント例:
```json
{
  "id": 12,
  "title": "…",
  "summary": "…",
  "description": "…",
  "authorName": "匿名",
  "date": "2026/06/01",
  "startGrade": "中学1年",
  "trigger": "…",
  "supportTypes": "居場所, 学習支援",
  "questionTags": ["2-2", "6-1-5"],
  "approvedAt": "2026/06/02 10:30",
  "publishedAt": <serverTimestamp>
}
```
> `getApprovedExperiences()` が返しているフィールド構成をほぼそのまま流用できる（`approvalDate`・`editCount` 等の運用メタは表示に不要なら省く）。`questionTags` はホームページの質問別ピックアップ（`getExperiencesByQuestion`）をFirestore側で再現するために持たせておくと後で楽。

`places` / `schools` は、それぞれ [src/data/placeCards.js](../src/data/placeCards.js) / [src/data/schoolCards.js](../src/data/schoolCards.js) の1件分の構造（`title`,`body`,`detailInfo`,`searchTags`,`tags`…）をそのままドキュメントにする。`images` は require() のままにはできないので、後述（§6）の通り**画像URL文字列**に置き換える。

### 1-3. ホームページの読み取りコストを抑える設計

ホームページは複数セクションでカードを並べるため、素朴に作るとリードが増える。段階的に:

- **フェーズ1（まず動かす）**: 各コレクションを `orderBy(publishedAt desc).limit(N)` で取得。1セクション=数リード。個人サイト規模なら無料枠(5万/日)に対して十分小さい。まずこれで良い。
- **将来の最適化（必要になったら）**: カテゴリごとに「公開スナップショット」ドキュメントを1つ持ち（例 `published/experiences` に配列で格納）、ホームページはそれを**1リード**で読む。GASは承認時にこのスナップショットを作り直す。1ドキュメント上限1MBに注意（体験談が数百件を超えたら個別docへ切替）。

> 迷ったらフェーズ1で開始。最適化は「遅い/リードが多い」と実測できてからで良い。

---

## 2. GAS側の実装（案Aの本体）

### 2-1. サービスアカウントの準備（初回のみ）

1. Firebaseプロジェクトを作成（無料のSparkプランでOK）。
2. Google Cloud Console で**サービスアカウント**を作成し、鍵(JSON)を発行。→ `client_email` と `private_key` を控える。
3. GASの **スクリプトプロパティ**（`PropertiesService.getScriptProperties()`）に `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` / `FIREBASE_PROJECT_ID` を保存する。**コードに鍵をベタ書きしない**（`.gitignore` 済みの世界と同じ扱い）。

### 2-2. Firestore書き込みライブラリの導入

GASからFirestore RESTを叩くのに定番の **`FirestoreApp`**（GASライブラリ, ID: `1VUSl4b1r1eoNcRWotZM3e87ygkxvXltOgyDZhixqncz9lQ3MjfT1iKFw`）を利用。これがサービスアカウントのJWT署名・トークン取得を肩代わりしてくれるので、自前で署名処理を書かなくて済む。

新規ファイル `gas/firestoreSync.gs` を作り、薄いラッパーを用意:

```javascript
// gas/firestoreSync.gs（擬似コード）
function getFirestore_() {
  const p = PropertiesService.getScriptProperties();
  return FirestoreApp.getFirestore(
    p.getProperty('FIREBASE_CLIENT_EMAIL'),
    p.getProperty('FIREBASE_PRIVATE_KEY'),
    p.getProperty('FIREBASE_PROJECT_ID')
  );
}

// 承認時: 公開ドキュメントを作成/上書き
function upsertPublishedDoc_(collection, id, data) {
  try {
    const fs = getFirestore_();
    fs.updateDocument(collection + '/' + id, data, /* mask */ false); // 無ければ作成、有れば上書き
    Logger.log('Firestore upsert 成功: ' + collection + '/' + id);
  } catch (e) {
    Logger.log('Firestore upsert 失敗（承認自体は継続）: ' + e);
    // 同期失敗はログに残すが、シート更新の成否とは切り離す（§5参照）
  }
}

// 却下/未承認化時: 公開から取り下げる
function removePublishedDoc_(collection, id) {
  try {
    getFirestore_().deleteDocument(collection + '/' + id);
    Logger.log('Firestore delete 成功: ' + collection + '/' + id);
  } catch (e) {
    Logger.log('Firestore delete 失敗: ' + e);
  }
}
```

### 2-3. 既存の承認処理へフックを追加

[adminFunctions.gs](../gas/adminFunctions.gs) の各関数の**成功時の return 直前**に1行足すだけ:

- `approveExperience(id)` … シート更新後、公開用フィールドを組み立てて
  `upsertPublishedDoc_('experiences', id, buildPublicExperience_(sheetRow))`
- `rejectExperience(id, reason)` … `removePublishedDoc_('experiences', id)`
- `returnToPending(id)` … `removePublishedDoc_('experiences', id)`（未承認に戻す＝公開から外す）
- `onEditTrigger(e)` … 承認済みが編集され未承認化される箇所でも `removePublishedDoc_(...)` を呼ぶ（古い内容が公開に残らないように）

`buildPublicExperience_(sheetRow)` は、`getApprovedExperiences()` 内のマッピングロジックを関数として切り出して再利用する（重複を作らない）。**メール列など非公開フィールドは含めない**。

### 2-4. （拡張）居場所・進路の承認関数

体験談と同じ設計で、居場所/進路用のシートに対する
`approvePlace / rejectPlace / approveSchool / rejectSchool …` を追加し、それぞれ
`upsertPublishedDoc_('places', id, …)` / `upsertPublishedDoc_('schools', id, …)` を呼ぶ。§6で詳述。

---

## 3. フロント側の実装（読み取りをFirestoreへ）

### 3-1. Firebase SDK 導入

```
npm install firebase
```
`src/config/firebaseConfig.js` を新設し、Web用の公開設定（apiKey等）を `.env`（`REACT_APP_FIREBASE_*`）から読む。
> このapiKeyは秘密鍵ではなく公開情報。アクセス制御は§4のセキュリティルールで行う（DB初心者が混同しやすいポイント）。

### 3-2. 読み取りAPIを差し替え

`src/utils/firestoreApi.js` を新設し、[gasApi.js](../src/utils/gasApi.js) の**読み取り系**と同じ関数シグネチャで提供する:

| 既存(GAS) | 置き換え後(Firestore) |
|---|---|
| `getAllExperiences(limit)` | `experiences` を `orderBy(publishedAt desc).limit()` |
| `getExperiencesByQuestion(qid, limit)` | `where('questionTags','array-contains',qid).limit()` |
| `getExperienceById(id)` | `doc('experiences/'+id).get()` |

> 関数名・戻り値の形を既存に合わせておけば、各ページ（[HomePage.js](../src/HomePage.js) 等）は**import元を変えるだけ**で移行できる。差分を最小化する。

### 3-3. 何をGASに残すか

- **投稿系**（`postExperience`）… GASのまま（フォーム/シートが受け皿なので変更不要）
- **管理系**（`getPending/approve/reject…`）… GASのまま（Adminページは引き続きGASを叩く）
- **公開読み取り**（ホームページ）… Firestoreへ移行 ← 今回の主目的
- **検索**（`searchExperiences`）… フェーズ1はGASのまま残してよい。負荷/速度が問題になったらFirestoreの `where` クエリへ移行（複合条件はインデックス設定が必要になる点だけ注意）。

---

## 4. セキュリティルール（Firestore）

公開データしか置かないので、ルールは非常にシンプル。**読み取りは全員許可・書き込みは全面禁止**（書くのはサービスアカウント経由のGASだけで、これはルールを迂回する権限を持つため `false` でも書ける）。

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{col}/{doc} {
      allow read: if col in ['experiences','places','schools'];
      allow write: if false;   // クライアントからの書き込みは一切不可
    }
  }
}
```
> これで万一apiKeyが漏れても、第三者はデータを**読めるだけ**（元々公開情報）で、改ざんはできない。

---

## 5. 整合性・失敗時の扱い

案Aは書き込み経路が1本だが、「シート更新は成功、Firestore同期は失敗」は起こり得る。方針:

- **シート＝真実**。Firestoreは派生キャッシュ。同期失敗しても承認処理自体は成功として扱う（既存のメール送信失敗と同じ思想 = [adminFunctions.gs](../gas/adminFunctions.gs) の try/catch パターン踏襲）。
- 同期失敗は `Logger.log` に残す。
- **保険（推奨）**: 定期実行トリガー（時間主導, 例: 1日1回）で `reconcileFirestore_()` を走らせ、「シートで承認済み ↔ Firestoreに存在」の差分を突き合わせて自動修復する。これがあれば一時的な同期漏れは翌日に自動回復する。

---

## 6. 居場所・進路への投稿→承認フロー拡張

現状 [placeCards.js](../src/data/placeCards.js) / [schoolCards.js](../src/data/schoolCards.js) は静的ファイルで、更新に開発者が必要。これを体験談と同じ流れに載せる:

1. **Googleフォームを2つ用意**（居場所用・進路用）。フォーム項目＝`detailInfo` の各フィールド（location, phone, target, fee …）に対応させる。
2. 回答シートに `onFormSubmit` 相当を設定し、デフォルト「未承認」を付与。
3. GASに `getPendingPlaces / approvePlace / rejectPlace`（＋schools版）を追加。承認時に `upsertPublishedDoc_('places', id, …)`。
4. Adminページにタブを追加（体験談タブの複製）。[AdminPage.js](../src/pages/AdminPage/AdminPage.js) の既存UIを流用。
5. **画像の扱い**: 静的 `require()` は使えない。運営者にはフォームで画像をアップロードしてもらい（Google Drive/Firebase Storage）、公開URL文字列を `images: ["https://…"]` としてFirestoreに保存。フロントは文字列URLを `<img src>` で表示するよう変更。
6. 既存の静的データは**初期投入(バックフィル)**としてFirestoreへ一度だけ流し込む（§7）。移行後は静的ファイルを参照しないようにする。

---

## 7. 既存データの移行（バックフィル）

- **体験談**: シートに既にある「承認済み」行を、一度だけ全件 `upsertPublishedDoc_` で流し込む使い捨て関数 `backfillExperiences_()` をGASに書いて手動実行。
- **居場所/進路**: 現状の静的 `placeCards.js` / `schoolCards.js` の内容をシート（またはFirestore）へ初期投入。以後はフォーム/承認フローで更新。

---

## 8. フェーズ分けと工数目安

| フェーズ | 内容 | 目安 |
|---|---|---|
| 1 | Firebase作成・サービスアカウント・`FirestoreApp`導入・疎通確認 | 4–6h |
| 2 | `firestoreSync.gs` 実装＋体験談の承認処理へフック＋バックフィル | 8–10h |
| 3 | フロント: Firebase SDK導入・`firestoreApi.js`・ホームページ読み取り移行 | 8–12h |
| 4 | セキュリティルール・整合性チェック(reconcile)・動作検証 | 4–6h |
| 5 | 居場所/進路のフォーム・承認関数・Adminタブ・画像URL対応 | 12–18h |
| 6 | 検索のFirestore移行（任意・後回し可） | 6–10h |
| — | **合計** | **約42–62h** |

> フェーズ1–4で「体験談ホームページの高速化」が完成。フェーズ5で「運営者投稿の居場所/進路」が実現。この2つは独立して価値が出るので、4まで終えた時点でリリースしてよい。

---

## 9. 主なリスクと対策

| リスク | 対策 |
|---|---|
| GASのサービスアカウント鍵の管理 | スクリプトプロパティに保存、コード/Gitに残さない |
| 同期漏れ（シート済みだがFirestore未反映） | reconcile定期トリガーで自動修復（§5） |
| 個人情報の漏洩 | Firestoreには公開フィールドのみ書く（メール列等は除外, §1-2） |
| Firestore無料枠超過 | フェーズ1は個別docで十分。増えたらスナップショット化(§1-3) |
| 画像の扱い（require不可） | URL文字列で保存しStorage/Driveから配信（§6-5） |
| 検索の複合クエリでインデックスエラー | フェーズ6で複合インデックスを定義、当面はGAS検索を残す |

---

## 10. 最初の一歩（着手順）

1. Firebaseプロジェクト作成 → サービスアカウント鍵取得 → GASスクリプトプロパティ設定
2. `gas/firestoreSync.gs` を作り、`approveExperience` の1件で upsert が通ることを確認（疎通）
3. `backfillExperiences_()` で承認済みを一括投入
4. フロントに `firebase` 導入、`firestoreApi.getAllExperiences` をホームページ1セクションで試す
5. 問題なければ全セクションを差し替え → セキュリティルール確定 → リリース
