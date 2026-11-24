---
title: DESIGN.md 是什麼
description: DESIGN.md 是人和 AI agent 都能讀、能改的純文字設計系統文件。
appliesTo: DESIGN.md（2026-11-20）
caveat: 用 YAML 寫的 design token 才是規範值；Markdown 內文的顏色名稱與說明只提供套用的情境與理由。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：What is DESIGN.md?
    url: https://stitch.google.com/docs/design-md/overview/
  - title: google-labs-code/design.md：README（db977b3）
    url: https://github.com/google-labs-code/design.md/blob/db977b3c1d1f309269f43d5d17ae828d54bd6ae3/README.md
---

## 它解決什麼問題

每個專案都有自己的視覺識別：顏色、字體、間距、元件樣式。這些資訊通常放在 Figma 檔、品牌 PDF，或設計師的腦袋裡，AI agent 都讀不到。

`DESIGN.md` 和 `README.md`、`AGENTS.md` 的分工：

| 檔案 | 讀者 | 內容 |
| --- | --- | --- |
| `README.md` | 人 | 這個專案是什麼 |
| `AGENTS.md` | Coding agent | 怎麼建置這個專案 |
| `DESIGN.md` | Design agent | 這個專案應該長什麼樣子、給人什麼感覺 |

## 有了它會怎樣

Stitch 這類 design agent 讀了 `DESIGN.md` 之後，產生的每個畫面都照同一套視覺規則：同樣的配色、字體排印與元件樣式。沒有它，每個畫面各自獨立；有了它，畫面看起來屬於同一個產品。

`DESIGN.md` 會跟著設計一起演變，不是寫好就不動的設定檔。常見的循環是：agent 產生它，你修改它，修改後的版本再套用到之後反覆調整的畫面上。

## 兩層結構

| 層 | 內容 | 給誰用 |
| --- | --- | --- |
| YAML front matter | 機器可讀的 design token：精確的 hex 色碼、字體屬性、間距級距 | 讓 agent 拿到精確數值 |
| Markdown 內文 | 人可讀的設計理由 | 告訴 agent 這些數值為什麼存在、怎麼用 |

Stitch 文件把 token 放在 front matter；DESIGN.md 儲存庫 `google-labs-code/design.md` 的 README 另外允許把 token 寫成 `yaml` 程式碼區塊，穿插在各個 `##` 章節裡。格式版本標為 `alpha`，還在積極開發，格式會改變。

規格是基礎，不是硬性規定。它為顏色、字體排印、版面與元件提供共同的詞彙，讓 agent、工具和團隊有共同依據，同時保留依領域需求擴充的空間：未知的章節和自訂的 token 會被接受，不會被拒絕。

## 三種產生方式

從最省力到最精確：

| 方式 | 做法 | 結果 |
| --- | --- | --- |
| 讓 agent 產生 | 描述想要的氛圍 | agent 把美感意圖轉成 token 與設計準則 |
| 從既有品牌推導 | 提供品牌網站的網址或一張圖片 | agent 擷取配色、字體排印與風格模式，寫成 `DESIGN.md` |
| 手寫 | 直接編寫 `DESIGN.md` | 精確寫下自己的設計偏好 |

### 讓 agent 產生

在 Stitch 裡用一段提示詞描述氛圍即可：

```text
Calm and trustworthy, like a good neighborhood clinic. That is the feeling for a vaccine booking app in Hsinchu: cool blue and mint on lots of white, crisp corners, nothing loud.
```

這段提示詞請 Stitch 設計一款新竹的疫苗預約 App：先說要沉穩可信、像社區診所的感覺，再給冷藍與薄荷綠配大量留白、俐落的邊角、不張揚的方向。Stitch 會產生完整的設計系統（顏色、字體排印、間距、元件樣式），並整理成一份 `DESIGN.md`。

### 手寫

每個章節都只是 Markdown，design token 放在選用的 YAML front matter 裡。除了標準 Markdown 與 YAML，沒有其他特殊語法。

## 範例

下面是一份精簡的 `DESIGN.md`，對象是一個深色主題的夜市美食指南 App。YAML front matter 定義精確的 token 值，Markdown 內文說明設計意圖。

```markdown
---
name: Lantern Lane Night
colors:
  primary: "#F2A33A"
  secondary: "#8C5A3C"
  surface: "#1A1410"
  on-surface: "#F5E9DA"
  error: "#FF8A80"
typography:
  body-md:
    fontFamily: Noto Sans TC
    fontSize: 16px
    fontWeight: 400
rounded:
  md: 12px
---

# Design System

## Overview
A warm, lively dark interface for a night market food guide in Taichung.
Glowing accents on deep brown, large food photos, quick to scan on a phone.

## Colors
- **Primary** (#F2A33A): Lantern amber for CTAs, active tabs and the "open now" badge
- **Secondary** (#8C5A3C): Supporting UI, filter chips, secondary actions
- **Surface** (#1A1410): Page backgrounds
- **On-surface** (#F5E9DA): Primary text on dark backgrounds
- **Error** (#FF8A80): Validation errors, sold-out states

## Typography
- **Headlines**: Noto Sans TC, bold
- **Body**: Noto Sans TC, regular, 15–16px
- **Labels**: Noto Sans TC, medium, 12px

## Components
- **Buttons**: Rounded (12px), primary uses amber fill with dark text
- **Cards**: Food photo across the top, no shadow, 12px corners
- **Chips**: Outline style with a secondary-color border

## Do's and Don'ts
- Do keep amber for the one main action on each screen
- Don't put light text on an amber background
- Do keep text contrast at 4.5:1 or higher
```

Stitch 產生下一個畫面時讀的就是這樣一份文件。
