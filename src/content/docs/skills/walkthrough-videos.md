---
title: 產生導覽影片：remotion
description: remotion Skill 把 Stitch 專案的畫面做成有轉場、縮放與文字疊加的導覽影片。
appliesTo: Stitch Agent Skills（2026-11-20）
caveat: Stitch 專案裡至少要有兩個已設計的畫面，並且要能存取 Stitch MCP 伺服器、裝好 Node.js 與 npm。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Generate walkthrough videos
    url: https://stitch.google.com/docs/skills/walkthrough-videos/
---

## remotion 做什麼

`remotion` 把 Stitch 專案的畫面做成導覽影片，包含畫面之間的交叉淡化、帶有彈簧動畫的縮放效果，以及疊在畫面上的文字。適合用在展示、給利害關係人審查，或放進文件。

| 步驟 | 做什麼 |
| --- | --- |
| 1 | 取得畫面與截圖 |
| 2 | 選轉場效果 |
| 3 | 在畫面上加文字 |
| 4 | 在 Remotion Studio 預覽，再輸出成影片檔 |
| 5 | 調整每個畫面的停留時間 |

## 事前準備

- 一個 Stitch 專案，裡面至少有兩個已設計的畫面
- 已安裝 Node.js 與 npm
- 能存取 Stitch MCP 伺服器

以下範例是一個夜市點餐 App，畫面依序是攤位列表、菜單、購物車和取餐號碼。

## 取得畫面

```text
I want to make a walkthrough of projects/123456. Download a screenshot of each of its screens first.
```

這段提示詞說明要為專案 `projects/123456` 做導覽影片，請 agent 先下載每個畫面的截圖。

Skill 會：

| 動作 | 結果 |
| --- | --- |
| 透過 MCP 取得畫面的中繼資料 | 每個畫面的資訊 |
| 下載全解析度截圖 | 存到 `assets/screens/` |
| 建立清單檔 | `screens.json`，記錄每個畫面的標題、尺寸與停留時間 |

## 選轉場效果

還沒有 Remotion 專案時，Skill 會先建立一個。接著設定轉場：

| 轉場 | 效果 | 適合 |
| --- | --- | --- |
| Fade（預設） | 畫面之間平順地交叉淡化 | 沉穩、專業的簡報 |
| Slide | 依方向滑入 | 依序進行的使用流程 |
| Zoom | 帶有彈簧動畫的縮放效果 | 強調某個功能 |

```text
Keep the mood calm: let each screen dissolve into the next, and make every cross-fade last 20 frames.
```

這段提示詞要求沉穩的節奏，每個畫面都淡化成下一個，每次交叉淡化 20 格。

```text
The video follows one customer from choosing a stall to getting a pickup number, so move between those screens with slides that run left to right.
```

這段提示詞說明影片跟著一位顧客從選攤位走到拿取餐號碼，請 agent 在這些畫面之間用由左往右的滑動轉場。

```text
Before the menu screen comes in, give the stall map on the home screen a spring zoom so viewers notice it.
```

這段提示詞請 agent 在菜單畫面出現前，對首頁的攤位地圖做一次彈簧縮放，讓觀眾注意到它。

三種可以混用：大部分畫面用淡化，關鍵的一刻用縮放強調。

## 在畫面上加文字

| 疊加 | 用途 |
| --- | --- |
| 畫面標題 | 每張畫面下方顯示標題 |
| 功能標示 | 用動態圖形指出某個元件 |
| 進度指示 | 顯示目前在導覽的哪個位置 |

```text
Label every slide with its screen title in the lower third, and let the label fade in instead of popping up.
```

這段提示詞在每張畫面的下方三分之一處標上畫面標題，標題用淡入的方式出現。

```text
On the cart screen, pulse a ring around the order total to draw the eye there.
```

這段提示詞在購物車畫面的訂單總額外圍加一個脈動的圓圈，吸引觀眾注意。

```text
Viewers should always know how much of the video is left. Draw a slim bar that fills across the top as it plays.
```

這段提示詞要讓觀眾隨時知道影片還剩多少，在最上方加一條隨播放填滿的細進度條。

## 預覽與輸出

先在瀏覽器裡的 Remotion Studio 預覽：

```text
Before anything gets rendered, let me watch it in Remotion Studio.
```

這段提示詞請 agent 在輸出之前先開 Remotion Studio，讓你預覽影片。

再輸出成檔案：

```text
Export the final cut to night-market-demo.mp4, encoded in H.264 so it plays on any device.
```

這段提示詞把成品用 H.264 編碼輸出成 `night-market-demo.mp4`，方便在各種裝置上播放。

### 畫質選項

| 旗標 | 效果 |
| --- | --- |
| `--quality 100` | 最高畫質，檔案較大 |
| `--codec h264` | 相容性最好 |
| `--codec h265` | 壓縮率較好，相容性較差 |
| `--concurrency 4` | 平行算圖，加快輸出 |

## 調整節奏

每個畫面的停留時間記在 `screens.json`，預設是 3 到 5 秒。

| 問題 | 調整 |
| --- | --- |
| 太快 | 加長每個畫面的停留時間 |
| 太慢 | 縮短停留時間，或改用比較有動感的轉場 |
| 快慢不均 | 複雜的畫面停久一點，簡單的短一點 |

```text
Cut the stall list down to 2 seconds; the cart screen goes by too fast, so let it stay for 5.
```

這段提示詞把攤位列表縮短為 2 秒，並把一閃而過的購物車畫面延長到 5 秒。

## 疑難排解

| 問題 | 解法 |
| --- | --- |
| 截圖模糊 | 在下載網址後面加上 `=w{width}`，取得全解析度 |
| 動畫不順 | 把影格率提高到 60fps |
| 疊加的文字位置不對 | 讓合成（composition）的尺寸和畫面尺寸一致 |
| Remotion 建置失敗 | 檢查 Node 版本的相容性，並執行 `npm install` |
