---
title: 同步設計系統
description: 把 DESIGN.md 綁到 Stitch Canvas 專案，讓產生與修改的畫面都依同一套規則。
appliesTo: Stitch CLI（2026-11-20）
caveat: 新畫面會自動用專案目前的設計系統；要把指定的設計系統套到畫布上的舊畫面，用 stitch edit screen 加上 --design-system。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Sync Design Systems
    url: https://stitch.google.com/docs/cli/design-systems/
---

## 為什麼要綁 DESIGN.md

每個畫面都從零產生時，顏色、字體與間距會一個畫面一個樣。[`DESIGN.md`](/design-md/overview/) 讓 Stitch 專案記住視覺規則：綁定之後，用 `stitch generate screen` 產生或用 `stitch edit screen` 修改的畫面，都會自動依照其中的 design token 與版面規則。

| 方法 | 適合 |
| --- | --- |
| 請 `/stitch` Skill 產生並同步 | 不想手寫 token 定義 |
| `stitch upload design` | 自己改了 `DESIGN.md`，要推送到 Stitch Canvas |
| `stitch edit screen --design-system` | 把設計系統套用到既有的畫面 |

## 用 `/stitch` Skill 產生並同步

最快的方式是用 CLI 內附的 `/stitch` Skill（`stitch agent-skills add`），不必手寫 token 定義。

已有程式碼庫時，請 coding agent 擷取現有樣式並綁到 Stitch 專案：

```text
/stitch Our Stitch project should look like the site we already ship. Read the stylesheets and components in this repo, describe that look in a DESIGN.md, and attach it to the project.
```

這段要 agent 讓 Stitch 專案和已上線的網站長得一樣：讀儲存庫裡的樣式表與元件，把這套外觀寫成 `DESIGN.md`，再綁到專案上。

從零開始的新概念，描述想要的感覺，讓 Skill 寫規格並上傳：

```text
/stitch I'm starting a booking site for a hot spring inn in Beitou and there is no code yet. Give my Stitch project a design system: Noto Sans TC everywhere, steam white (#F7F5F2) behind everything, cypress brown (#3A2A1E) for text, and sulfur yellow (#D9A520) only on buttons that book a room. Keep the rules in a DESIGN.md.
```

這段要 agent 為還沒有程式碼的北投溫泉旅館訂房網站建立設計系統：全站 Noto Sans TC、蒸氣白底、檜木棕文字，硫磺黃只用在訂房按鈕，規則寫進 `DESIGN.md`。

Skill 在背後做的事：

1. 必要時把目前的資料夾連結到 Stitch 專案。
2. 寫出 `./DESIGN.md`（或 `.stitch/DESIGN.md`）。
3. 驗證結構。
4. 上傳到 Stitch Canvas。

## 好的 DESIGN.md 寫什麼

不論 agent 寫或自己寫，以下四項最能引導視覺產生：

| 項目 | 寫什麼 |
| --- | --- |
| 材質與表面 | 表面摸起來像什麼（溫暖的紙、髮絲紋鋁材、高對比的墨），以及不要什麼（多餘的狀態圓點、浮動的膠囊徽章、層層套疊的卡片邊框） |
| 配色與確切色碼 | 背景、結構邊框、主要強調色、文字色都給真實的 hex 值，Stitch 就不必猜 |
| 字體層級 | 主要的介面字體、表格數字用的等寬字體，以及從大標題到說明文字的明確級距 |
| 空間與格線 | 目標視窗寬度、4px/8px 間距節奏、內距規則，讓畫面保有留白，元素排列整齊 |

畫布上已經有一個畫面的樣子正是你要的，可以下載它的 HTML（`stitch download screen <screen-id>`），請 agent 把其中的 CSS 變數和字體選擇轉成專案的 `DESIGN.md`。

## 從終端機同步

直接改了 `DESIGN.md` 後，用 `stitch upload design` 推送到 Stitch Canvas：

```bash
stitch upload design DESIGN.md
```

還沒替資料夾固定預設專案（`stitch config set project <project-id>`）時，加上 `-p <project-id>`。上傳會在 Stitch 專案上建立或更新設計系統，下一次產生就用新規則。

## 套用到既有的畫面

新畫面會自動使用專案目前的設計系統。要把畫布上的舊畫面改成新版 `DESIGN.md` 的樣式，先列出專案的設計系統，再用 `stitch edit screen` 直接套用：

```bash
stitch find design-systems
stitch edit screen <screen-id> --design-system <design-system-id>
```
