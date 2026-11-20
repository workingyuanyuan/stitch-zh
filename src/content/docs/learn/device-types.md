---
title: 裝置類型：App 與 Web
description: 建立專案時選 App 或 Web，決定 Stitch 怎麼安排版面與導覽；跨裝置最好重新轉譯，不是縮放。
appliesTo: Stitch 網頁版（2026-11-20）
caveat: 專案會一直產生建立時所選裝置尺寸的畫面；在 App 專案裡輸入要求產生網頁的提示詞，網頁內容會被放進 App 的外框。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Device Types
    url: https://stitch.google.com/docs/learn/device-types/
---

## 兩種模式的差異

建立專案時，Stitch 要你選 `App` 或 `Web`。這個選擇不只是螢幕大小，它決定 Stitch 怎麼解讀版面、導覽與資訊層級。

| 模式 | 版面的取向 |
| --- | --- |
| `App` | 垂直捲動、導覽列放在底部（拇指容易按到的區域）、內容上下堆疊 |
| `Web` | 橫向展開、導覽列放在頂部、多欄網格 |

用 `App` 模式做的畫面放到桌機上，看起來像一個放大的 App。用 `Web` 模式做的設計擠進手機螢幕，常會少掉細節，以及原生 App 應有的介面元件。

## 把 App 設計轉成 Web

從一個平台換到另一個平台，最好的做法是轉譯，不是調整尺寸：寫一段提示詞，說明哪些地方要為新的裝置改變。

1. 下載現有畫面的圖片，當作參考圖（Reference Image）。
2. 建立一個設為 `Web` 模式的新專案，或在原專案裡為新畫面寫一段更新用的提示詞，並附上參考圖。
3. 在提示詞裡說明怎麼運用較大的螢幕，重點放在導覽、主視覺區塊與網格密度。

以一家茶飲店為例。先在 `App` 模式做手機點餐介面：

```text
Cha Dao is a neighbourhood tea shop that wants a phone app for ordering ahead.
Keep it bright and simple, with strong contrast.
List the drinks by type of tea, one card per row, with the drink name large and the price small.
Add a tab bar for Menu, Stores, and My Orders.
```

這段提示詞依序說明：茶飲店「Cha Dao」要一個預先點餐的手機 App、明亮簡單的高對比風格、依茶類分組且一列一張卡片的飲品清單、有 Menu、Stores、My Orders 三個分頁的底部分頁列。

再用下面的提示詞轉成桌機網站：

```text
Rework this phone design as a desktop site for "Cha Dao".
Replace the tab bar with a navigation bar across the top: logo on the left, Menu, Stores, and My Orders on the right.
Make the seasonal drink banner a wide hero, with the photo filling the background and the text over it.
Show the drinks three cards per row instead of one. Keep the same card colours and the simple look.
```

| 提示詞裡處理的項目 | 指示 |
| --- | --- |
| 導覽 | 把底部分頁列換成頂部的橫向導覽列：左邊是標誌，右邊是三個連結 |
| 主視覺區塊 | 把當季飲品的橫幅改成寬版主視覺：照片鋪滿背景，文字疊在上面 |
| 網格密度 | 飲品從一列一張卡片改成一列三張，保留卡片顏色與簡單的風格 |

這樣的提示詞把重點放在保留品牌的感覺，同時為新的裝置調整版面。

## 在同一個專案裡切換裝置類型

在同一個專案裡也可以用提示詞轉成另一種裝置類型，但需要手動調整：

1. 產生設計。
2. 用 `Preview > Device Type` 把檢視切換到目標裝置，例如 Desktop。
3. 元件看起來被裁掉時，手動調整外框大小。

從 `App` 換成 `Web` 時，把設計外框的高度往下拉長很多。Stitch 常常已經產生網站其餘的部分，只是原本的 App 外框太短而看不到；拖曳外框的控制點往下，可能會露出其餘的版面。
