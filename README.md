```
src/
├─ index.html
├─ main.ts
├─ styles.scss
│
├─ app/
│  ├─ app.component.html      ← 画面全体をまとめる親コンポーネント
│  ├─ app.component.scss
│  ├─ app.component.ts
│  ├─ app.config.ts           ← ルーティング／アプリ設定
│  └─ models.ts               ← データ型定義（Product 型など）
│
├─ product-list/              ← 検索結果の一覧表示
│  ├─ product-list.component.html
│  ├─ product-list.component.scss
│  └─ product-list.component.ts
│
├─ product-search-form/       ← 検索フォーム部分
│  ├─ product-search-form.component.html
│  ├─ product-search-form.component.scss
│  └─ product-search-form.component.ts
│
├─ services/
│  ├─ cart.service.ts         ← カート（🛒）状態管理
│  └─ product-data.service.ts ← CSV 読み込み・検索処理
│
└─ assets/
   └─ products.csv            ← データ（商品情報）
```
