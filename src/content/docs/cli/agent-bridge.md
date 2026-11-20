---
title: 和 coding agent 反覆修改
description: 先上傳自己的圖當視覺基準，再明確設定構圖，最後在 localhost 加上互動。
appliesTo: Stitch CLI（2026-11-20）
caveat: 要讓 Stitch 原樣嵌入你上傳的圖，記載的做法是把它的託管網址寫進提示詞，或直接對上傳的畫面執行 stitch edit screen。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Iterate with Coding Agents
    url: https://stitch.google.com/docs/cli/agent-bridge/
---

## 三個步驟

跟 agent 要一個通用的 App 範本，結果通常平淡。效果好的做法是三步：

| 步驟 | 做法 | 指令 |
| --- | --- | --- |
| 1. 給視覺基準 | 先產生介面裡要用的圖，上傳到專案 | `stitch upload screen` |
| 2. 設定構圖 | 第一個提示詞就寫明畫布上有什麼、不要什麼 | `stitch edit screen` |
| 3. 在實際的 HTML 上修改 | 在 `localhost` 預覽，再加上互動 | `stitch serve`、`stitch edit screen` |

## 步驟一：先準備圖

從空白提示詞開始，配色容易流於一般。先給 Stitch 一個真實的東西去回應：在寫介面的提示詞之前，先產生要放進介面裡的圖。

可以在 [Google AI Studio](https://aistudio.google.com) 用 Gemini 3 Pro Image（`gemini-3-pro-image`）產生，長寬比設 `1:1`。提示詞裡要求畫面填滿到四邊，這樣得到的是純粹的封面圖，沒有邊框，也不是掛在牆上的畫。

```text
Square watercolor painting that fills the whole 1:1 frame edge to edge, with no border and no paper or wall around it. Misty oolong tea terraces on an Alishan hillside at dawn: soft jade green rows, pale gold morning light, and drifting white clouds in the valley below.
```

這段要一張填滿整個方形畫面的水彩畫：清晨阿里山的烏龍茶園梯田，玉綠色的茶行、淡金色晨光與山谷裡的雲霧。

```text
Square watercolor painting that fills the whole 1:1 frame edge to edge, with no border and no paper or wall around it. A rainy evening over Keelung harbor: deep teal water, slate-grey sky, and warm amber reflections from the harbor lights.
```

這段要另一張同樣規格的水彩畫：雨天傍晚的基隆港，深藍綠海面、石板灰天空和港口燈火的琥珀色倒影。

把圖存到本機，再用 `stitch upload screen` 上傳到 Stitch 專案：

```bash
stitch upload screen ./alishan-tea.png \
  --title "Alishan Dawn"

stitch upload screen ./keelung-harbor.png \
  --title "Keelung Rain"
```

### 讓 Stitch 用你的圖

| 做法 | 指令 |
| --- | --- |
| 取得已上傳圖片的網址，寫進提示詞 | `stitch get screen <screen-id> --format json` |
| 直接修改上傳的畫面 | `stitch edit screen <screen-id>` |

提示詞裡附上這個託管網址，Stitch 會逐像素嵌入你的圖，而不是自己編一張預留位置用的圖片。

## 步驟二：在第一個提示詞明確設定構圖

一次要求整個 App 時，模型很愛把每個角落塞滿狀態圓點、膠囊徽章和假的導覽列。提示詞要寫明畫布上該有什麼，其他一律不要。

一個構圖聚焦的提示詞包含四個部分：畫布、原則、圖、內容。下面的例子從圖和內容寫起，最後才寫限制：

```text
A product card for Alishan High Mountain Oolong, ivory (#FBF8F2) with dark ink text (#1E1B18) in Noto Serif TC, uses the uploaded tea terrace painting as a square tin label on its left half.
Right half, top to bottom: the tea name in 30px bold, "Chiayi County, 1,400 m" in 16px grey, "NT$680 / 150 g", a quantity stepper, and a solid ink "Add to cart" button.
Nothing else goes in the card: write each item as bare text, and skip icons, tags, chips, and dots.
The card floats alone in the middle of a plain rice-paper backdrop (#EFEAE0); keep the backdrop empty, with no navigation, headings, or footer.
```

| 段落 | 作用 |
| --- | --- |
| 第一行 | 圖：卡片的底色、文字色、字體，以及上傳的圖放在哪裡 |
| 第二行 | 內容：確切的文字、數字與控制項，由上而下排列 |
| 第三行 | 原則：卡片裡只放列出的項目，不加圖示、標籤或圓點 |
| 第四行 | 畫布：卡片單獨置中，背景完全空白 |

這段要一張阿里山高山烏龍茶的商品卡：左半邊是上傳的茶園畫作當罐身標籤，右半邊由上而下是品名、產地、價格、數量選擇器和加入購物車按鈕，卡片單獨置中在米紙色的空白背景上。

對上傳圖片的畫面執行 `stitch edit screen`，讓 Stitch 以這張畫為中心建立介面：

```bash
stitch edit screen <screen-id> \
  --device DESKTOP \
  --prompt "A product card for Alishan High Mountain Oolong, ivory (#FBF8F2) with dark ink text (#1E1B18) in Noto Serif TC..."
```

Stitch 會圍繞上傳的畫作建立卡片，介面上的強調色可以直接取自畫作的筆觸。

## 步驟三：在 localhost 預覽並加上互動

靜態截圖只說了一半。用 `stitch serve` 啟動本機預覽伺服器，你和 coding agent 都能在 `localhost` 檢查實際的 DOM：

```bash
stitch serve
```

Stitch 輸出的是真正的 HTML、CSS 和 JavaScript，所以不必停在靜態版面。挑一個讓設計動起來的修改：

```text
Add two tabs above the tea name, "Alishan Dawn" and "Keelung Rain", and let a click on either tab switch the card between two teas.
"Alishan Dawn" starts selected with a jade #4F7A5A button. Choosing "Keelung Rain" changes the name to "Keelung Harbor Black Tea", the price to "NT$520 / 150 g", the tin label to the uploaded harbor painting, and the button to teal #2F5D6B. Write the selected tab in bold #1E1B18 and the other in #8A847C grey.
Nothing outside the tabs and these four items should move or change, and the rice-paper backdrop stays empty.
```

| 段落 | 作用 |
| --- | --- |
| 第一行 | 互動：加什麼控制項，點了會怎樣 |
| 第二行 | 狀態：預設選哪一個，每個狀態的確切內容與顏色 |
| 第三行 | 保留：其他地方與背景都不變 |

這段要在品名上方加兩個分頁，點選時在兩款茶之間切換品名、價格、罐身畫作和按鈕顏色，預設選阿里山那款，其他地方都不動。

```bash
stitch edit screen <screen-id> \
  --device DESKTOP \
  --prompt "Add two tabs above the tea name, \"Alishan Dawn\" and \"Keelung Rain\", and let a click on either tab switch the card between two teas..."
```

在執行中的 `stitch serve` 裡開啟更新後的畫面，實際點點看，確認切換時畫作與顏色都跟著換。

## 繼續修改

流程就是這樣：用真實素材當基準，用清楚的限制設定構圖，在 `localhost` 測試互動狀態。設計滿意後，把 HTML 拉進程式碼庫，或繼續一次改一步。

| 下一步 | 頁面 |
| --- | --- |
| 從 CLI 產生變化版本、精準修改 | [產生與修改畫面](/cli/screens-and-variants/) |
| 讓本機的 `DESIGN.md` 和 Stitch 專案保持同步 | [同步設計系統](/cli/design-systems/) |
| `stitch upload screen`、`stitch edit screen`、`stitch serve` 的完整旗標 | [CLI 指令參考](/cli/reference/commands/) |
