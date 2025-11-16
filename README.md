```
src/
├── main.ts                  ← アプリの起動エントリーポイント
├── assets/                  ← CSVなどの静的ファイルを置く場所
│   └── customers.csv        ← ダミーデータ（顧客情報）
└── app/
    ├── app.component.ts     ← 画面全体をまとめる親コンポーネント
    ├── app.config.ts        ← ルーティングやHTTP設定
    ├── core/                ← 共通ロジック（データ取得・お気に入り管理など）
    │   ├── data.service.ts      ← CSVを読み込む処理
    │   ├── favorites.service.ts ← お気に入り（★）の状態管理
    │   └── models.ts            ← データ型定義（Customer型など）
    └── features/             ← 機能ごとのUI部品（コンポーネント）
        ├── search-form/          ← 検索フォーム部分
        │   ├── search-form.component.ts
        │   └── search-form.component.html
        └── result-list/          ← 検索結果一覧
            ├── result-list.component.ts
            └── result-list.component.html
```
