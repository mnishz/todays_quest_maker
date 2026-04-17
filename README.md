# Quest Maker

「何しよう？」を解決する、クエスト提案Webサービスです。

## 機能

- ボタンを押すとランダムにクエスト（お出かけ・体験の提案）が表示される
- カテゴリ（おでかけ、グルメ、エンタメ、スポーツ、学び、くらし）でフィルタリング
- クエスト達成記録（ブラウザのlocalStorageに保存）
- 難易度・所要時間の表示

## 使い方

ローカルで動かすには HTTP サーバーが必要です:

```bash
python3 -m http.server 8080
```

ブラウザで http://localhost:8080 を開いてください。

## 技術スタック

- HTML / CSS / JavaScript（フレームワークなし）
- データは `data/quests.json` で管理

## ファイル構成

```
quest_maker/
├── index.html          # メインページ
├── css/
│   └── style.css       # スタイリング
├── js/
│   └── app.js          # アプリのロジック
├── data/
│   └── quests.json     # クエストデータ（30個）
└── README.md
```
