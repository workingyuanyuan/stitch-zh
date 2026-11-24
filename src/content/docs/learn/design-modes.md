---
title: 設計模式
description: 四種設計模式：Thinking with 3 Pro、Redesign (Nano Banana Pro)、2.5 Pro、Fast。
appliesTo: Stitch 網頁版（2026-11-20）
caveat: 模式名稱帶有模型版本（Gemini 3 Pro、Nano Banana Pro、Gemini 2.5 Pro），可能隨 Stitch 更新而改變；這四種是 2026-11-20 的模式。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Design Modes
    url: https://stitch.google.com/docs/learn/design-modes/
---

## 四種模式

Stitch 不是單一的 AI 模型，而是一組設計引擎。在產生設定裡的 `Design Mode` 選單選擇要用哪一個。

| 模式 | 適合 | 特性 |
| --- | --- | --- |
| `Thinking with 3 Pro` | 複雜的邏輯、深入推理、準備當正式版本的設計 | 使用 Gemini 3 Pro；推理優先於速度，產生時間較長 |
| `Redesign (Nano Banana Pro)` | 翻新舊 App、風格實驗、用風格與氛圍引導設計 | 把過時的介面套上指定的設計美學；提示詞裡有明確的美術指導關鍵字時表現最好 |
| `2.5 Pro` | 高擬真的 HTML、A/B 比較 | 使用 Gemini 2.5 Pro；程式碼品質與設計擬真度很高 |
| `Fast` | 快速畫線框稿、匯出到 Figma | 為相容性最佳化，適合把初稿直接匯出到 Figma 再手動修飾 |

`Thinking with 3 Pro` 多花的時間用在推敲提示詞的含意：導覽怎麼走、資訊層級代表什麼、顏色之間怎麼搭配。複雜的儀表板，或細節很多的到達頁，適合用它。

## 用兩個模式比較同一個提示詞

先在 `Thinking with 3 Pro` 產生一次，再把完全相同的提示詞放到 `2.5 Pro` 執行，可以看到同一個想法的兩種詮釋。

## Redesign 的風格關鍵字

`Redesign` 模式適合 Vibe Design，也就是用風格與感覺的描述來帶動設計。寫明確的美術指導用語，效果比「讓它看起來酷一點」好。把不同類別的關鍵字組合起來，就能定義出一種視覺語言。

### 版面與結構

| 關鍵字 | 意思 |
| --- | --- |
| Bento Grid | 像便當盒的模組化卡片版面，內容分格排列成有層次的網格 |
| Editorial | 時尚雜誌的感覺：襯線字體的大標題、大量留白、不對稱的圖片配置 |
| Swiss Style | 客觀清晰：倚重網格系統、無襯線字體、文字靠左對齊 |
| Split-Screen | 畫面左右分割，常見做法是一邊純色塊、一邊滿版圖片 |

### 質感與深度

| 關鍵字 | 意思 |
| --- | --- |
| Glassmorphism | 毛玻璃：半透明、背景模糊、細白邊框 |
| Claymorphism | 柔軟、鼓起的立體形狀加內陰影，親切而有觸感 |
| Skeuomorphic | 擬真材質（皮革、紙、金屬），控制元件做成實體開關的樣子 |
| Grainy/Noise | 在漸層上加底片顆粒或紋理，降低數位感、增加溫度 |

### 氛圍與年代

| 關鍵字 | 意思 |
| --- | --- |
| Brutalist | 粗獷、不修飾：系統預設字體、高對比、銳利邊緣 |
| Cyberpunk | 深色模式、霓虹強調色（青色與洋紅）、故障特效（glitch）、科技感介面 |
| Y2K | 1990 年代末到 2000 年代初的樂觀風格：鍍鉻質感、泡泡字、亮藍與亮粉、膠囊形按鈕 |
| Retro-Futurism | 1980 年代的 Synthwave：夕陽、線框網格、錄影帶質感、發光線條 |

### 顏色與對比

| 關鍵字 | 意思 |
| --- | --- |
| Duotone | 整個介面只用兩種對比色和它們的深淺變化 |
| Monochromatic | 只用一個基礎色相，例如各種深淺的電光藍，做出一致的品牌感 |
| Pastel Goth | 柔和的乳白粉彩色，配上黑色的字體與邊框 |
| Dark Mode OLED | 背景用純黑 `#000000` 而不是深灰，為高對比而設計 |

範例：

```text
Redesign this settings page.
Use an Editorial layout with large serif headings.
Light background. Use generous whitespace between sections.
```

三行依序是動作（重新設計這個設定頁）、風格（Editorial 版面與襯線字體的大標題）、細節（淺色背景、區塊之間留白充足）。
