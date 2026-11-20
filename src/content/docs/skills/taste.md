---
title: Taste：taste-design
description: taste-design 從一個概念產生 DESIGN.md，明文禁止 AI 介面常見的樣式，並套用一套高標準規則。
appliesTo: Stitch Agent Skills（2026-11-20）
caveat: taste-design 從概念產生新的設計系統；要記錄現有程式碼或 Stitch 畫面的樣式，改用 extract-design-md 或 design-md。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Taste
    url: https://stitch.google.com/docs/skills/taste/
---

## taste-design 解決什麼問題

AI 產生的介面常常長得一樣：過度飽和的紫色漸層、置中的三欄卡片、`Inter` 字體、捏造的統計數字。`taste-design` 產生的設計系統明文禁止這些樣式，並套用一套高標準的規則。

這個 Skill 由社群成員 Leon Lin 貢獻，原始儲存庫是 [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)。

## 什麼時候用

| Skill | 做什麼 | 取向 |
| --- | --- | --- |
| `extract-design-md` | 從原始碼反推 design token | 描述性：記錄現有的樣子 |
| `design-md` | 從現有的 Stitch 畫面擷取 design token | 描述性：記錄現有的樣子 |
| `taste-design` | 從一個概念產生設計系統 | 規範性：強制套用高標準 |

從零開始、想要一個比 AI 平均水準更好的設計系統時，用 `taste-design`。

## 產生 DESIGN.md

```text
Station staff on the Taipei MRT glance at a wall screen to spot crowded platforms. Use the taste-design skill to create a premium DESIGN.md for that screen.
```

這段提示詞先說明情境（台北捷運站務人員看牆上螢幕找出擁擠的月台），再請 `taste-design` 為這個螢幕產生 premium 等級的 DESIGN.md。

產生的 DESIGN.md 包含：

- 依 taste spectrum 校準的視覺氛圍
- 嚴格的反模式規則
- 經過校準的配色
- 有明確主張的字體排印
- 彈簧物理（spring physics）的動態規格

## 配色

顏色用 HSL 表示，刻意壓低飽和度。這來自印刷設計的原則：講究的配色在大面積用低飽和度的顏色，高飽和度只留給小而有意圖的強調。

| Skill 強制的規則 | 內容 |
| --- | --- |
| 強調色的飽和度 | 低於 80%，不用過飽和的霓虹色 |
| 純黑 | 禁用 `#000000`，改用接近黑的顏色，例如 Zinc-950（`#18181B`） |
| 強調色數量 | 最多一個，強迫視覺上的節制 |

調整配色時直接說要改成什麼：

```text
The greys feel cold. Warm them up like river pebbles, and let a single jade green, #2F7D6D, be the only accent.
```

這段提示詞指出灰色太冷，請 Skill 把中性色調整成像河邊卵石般偏暖的灰，並以玉綠色 `#2F7D6D` 作為唯一的強調色。

## 字體排印

字級比例取自音程比例，也就是讓音程聽起來和諧的那些比值：

| 比例名稱 | 比值 | 性格 |
| --- | --- | --- |
| Minor Third | 1.200 | 緊湊，資訊密集 |
| Major Third | 1.250 | 平衡，用途廣 |
| Perfect Fourth | 1.333 | 寬鬆，編輯風格 |
| Golden Ratio | 1.618 | 戲劇性，衝擊力強 |

字體搭配規則：

| 規則 | 字體 |
| --- | --- |
| 禁用（太常見） | `Inter` |
| 建議的無襯線字體 | `Geist`、`Outfit`、`Cabinet Grotesk`、`Satoshi` |
| 建議的現代襯線字體 | `Fraunces`、`Gambarino`、`Editorial New` |
| 儀表板限制：只用無襯線加等寬 | `Geist` + `Geist Mono` |

```text
Set every number in Geist Mono so the columns line up, keep labels and body text in Geist, and switch the screen titles to Satoshi.
```

這段提示詞讓所有數字用 Geist Mono 以便欄位對齊，標籤與內文用 Geist，畫面標題改用 Satoshi。

## 空間節奏

所有外距、內距和間隔都是基本單位的倍數，基本單位通常是 4px 或 8px。這樣即使版面不對稱，眼睛仍會覺得有秩序。

### 調整密度

taste spectrum 從 1（寬鬆）到 10（像駕駛艙一樣密集）：

```text
Riders check this bus timetable app on a phone while waiting at the stop, so they need large, calm text. Make the DESIGN.md at density 3.
```

這段提示詞說明乘客在站牌邊用手機查公車時刻、需要大而穩定的文字，因此要求密度 3 的寬鬆 DESIGN.md。

密度越高，會出現這些變化：

- 數字改用等寬字體，方便對齊
- 用上邊框分隔，取代卡片
- 間距比例更緊
- 採平面設計的區塊，用字體排印而不是陰影區分層次

## 評分標準

從四個面向評估 DESIGN.md。高標準的設計在四個面向都要達到 7 分以上：

| 面向 | 衡量什麼 |
| --- | --- |
| Color Sophistication | 配色的節制、飽和度控制、對比安排是否有明確目的 |
| Typographic Craft | 字體的辨識度、字級的和諧、字重的層次 |
| Spatial Coherence | 基本單位是否一致、節奏、響應式縮放 |
| Visual Hierarchy | 主要、次要、第三層級是否清楚，資訊架構 |

某個面向不夠好時，指出問題和改法：

```text
Spacing looks uneven: card padding mixes 10px, 14px and 20px. Put every margin, padding and gap on an 8px grid.
```

這段提示詞指出 Spatial Coherence 不足（卡片內距混用 10px、14px、20px），請 Skill 把所有外距、內距和間隔都改成 8px 的倍數。

## 反模式檢查清單

定稿前，確認設計裡沒有這些：

- 表情符號（emoji）
- `Inter` 字體
- 純黑 `#000000`
- 霓虹外發光陰影
- 三欄等寬的卡片版面
- 捏造的數據，例如 `99.98% UPTIME`、`124ms AVG. RESPONSE`
- AI 文案的陳腔濫調，例如 `Elevate`、`Seamless`、`Unleash`
- 填充用的介面文字，例如 `Scroll to explore`、上下跳動的箭頭
- `LABEL // YEAR` 這種格式
