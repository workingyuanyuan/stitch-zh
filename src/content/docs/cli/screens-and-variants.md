---
title: 產生與修改畫面
description: 用 Stitch CLI 建立專案、產生畫面、產生變化版本，再一次修改一處。
appliesTo: Stitch CLI（2026-11-20）
caveat: 每次 stitch edit screen 都把結果存成新畫面並回傳新 ID；下一次修改要用這個新 ID，才會接著最新版本改。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Generate & Edit Screens
    url: https://stitch.google.com/docs/cli/screens-and-variants/
---

## 流程一覽

| 步驟 | 指令 |
| --- | --- |
| 1. 建立專案並固定到資料夾 | `stitch create project`、`stitch config set project` |
| 2. 產生第一個畫面 | `stitch generate screen` |
| 3. 產生變化版本，試試差異較大的設計 | `stitch generate variants` |
| 4. 一次改一處 | `stitch edit screen` |
| 5. 預覽、下載 HTML | `stitch serve`、`stitch download screen`、`stitch open screen` |

## 建立專案並固定

每個畫面都屬於一個 Stitch Canvas 專案。建立新專案（或列出既有的專案），再把它固定到目前的資料夾，之後就不必再加 `--project`：

```bash
stitch create project --title "Tea Shop Dashboard"
stitch config set project <project-id>
```

在裝了 `/stitch` Skill（`stitch agent-skills add`）的 coding agent 裡，也可以直接請 `/stitch` 在同一輪建立專案並產生第一個畫面。

## 產生第一個畫面

第一個提示詞不必長。寫出三件事：這是什麼畫面、大致的感覺、畫面上要有的具體內容。

```text
A daily sales dashboard for a bubble tea chain with five shops in Taichung, on a soft oat-milk background (#F6F1EA) with dark brown text (#2B1E16) and clear tabular numbers, showing a 30-day sales chart by shop, a row of three KPI cards, and a table of today's best-selling drinks.
```

| 提示詞片段 | 作用 |
| --- | --- |
| `A daily sales dashboard for a bubble tea chain` | 這是什麼畫面 |
| `soft oat-milk background (#F6F1EA) with dark brown text (#2B1E16)` | 大致的感覺與配色 |
| `a 30-day sales chart by shop, a row of three KPI cards, and a table` | 畫面上的具體內容 |

這段提示詞要一個台中五家分店手搖飲連鎖的每日營收儀表板：燕麥奶色底配深棕文字，內容有各分店 30 天營收圖、三張 KPI 卡片和今日熱銷飲料表。

用 `stitch generate screen` 產生，`--device` 選 `DESKTOP` 或 `MOBILE`：

```bash
stitch generate screen \
  --device DESKTOP \
  --prompt "A daily sales dashboard for a bubble tea chain with five shops in Taichung, on a soft oat-milk background (#F6F1EA) with dark brown text (#2B1E16) and clear tabular numbers, showing a 30-day sales chart by shop, a row of three KPI cards, and a table of today's best-selling drinks."
```

### 指令結束時畫面還沒好

在互動式終端機裡，CLI 會在背景繼續檢查，下次執行任何 `stitch` 指令時印出 `Screen <id> is ready` 和畫面的連結。

| 情況 | 怎麼知道畫面好了 |
| --- | --- |
| 互動式終端機 | 下次執行 `stitch` 指令時自動提示 |
| 加了 `--json` | 不會自動提示，自己用 `stitch get screen` 查 |

## 產生變化版本

變化版本一次產生 1 到 5 個不同的選項，適合想大幅改動的時候。執行 `stitch generate variants` 時指定兩件事：

| 旗標 | 意思 |
| --- | --- |
| `--creative-range` | 變化的幅度（Creative Range） |
| `--aspects` | 要變化的面向（Aspects） |

| `--creative-range` | 用途 |
| --- | --- |
| `REFINE` | 已滿意目前的版面，只想試更細微的字體、間距或顏色修飾 |
| `EXPLORE` 或 `REIMAGINE` | 想看完全不同的版面、配色或字體 |

| `--aspects` 的值 | 變化的面向 |
| --- | --- |
| `LAYOUT` | 版面 |
| `COLOR_SCHEME` | 配色 |
| `TEXT_FONT` | 字體 |

```bash
stitch generate variants \
  --screen <screen-id> \
  --count 3 \
  --creative-range EXPLORE \
  --aspects LAYOUT,COLOR_SCHEME \
  --prompt "Swap the sales chart for a map of Taichung with one sales bubble per shop, and recolor the page with drink-menu tones: taro purple, matcha green, and brown sugar"
```

這段要三個選項，版面與配色都可以變：把營收圖換成台中地圖、每家分店一個營收泡泡，並改用飲料菜單上的芋頭紫、抹茶綠與黑糖色。

## 一次改一處

有了喜歡的畫面後，從嘗試大幅改動換成精準修改。只挑一件要改的事，寫清楚改「什麼」和「怎麼改」。

```text
In the best-selling drinks table, turn each row's cup count into a thin horizontal bar in caramel brown, longest at the top, so the top sellers stand out at a glance.
```

| 提示詞片段 | 作用 |
| --- | --- |
| `In the best-selling drinks table` | 指定要改的元件 |
| `a thin horizontal bar in caramel brown, longest at the top` | 具體的視覺指示 |
| `so the top sellers stand out at a glance` | 說明修改的目的 |

這段只改熱銷飲料表：把每一列的杯數換成焦糖棕色的細長條，最長的排在最上面，讓熱銷品項一眼就看得出來。

把這段指示交給 `stitch edit screen`：

```bash
stitch edit screen <screen-id> \
  --prompt "In the best-selling drinks table, turn each row's cup count into a thin horizontal bar in caramel brown, longest at the top, so the top sellers stand out at a glance."
```

每次修改都會把結果存成一個新畫面，並回傳新畫面的 ID。下一次 `stitch edit screen` 要傳這個新 ID，才會接著最新版本改。

## 在 localhost 預覽並下載 HTML

想在真正的瀏覽器裡看畫面，或讓 coding agent 檢查實際的 DOM，啟動本機預覽伺服器：

```bash
stitch serve
```

要把畫面的 HTML 下載到專案裡，或在瀏覽器開啟 Stitch Canvas 上的畫面：

```bash
stitch download screen <screen-id> --output ./screens/revenue-overview.html
stitch open screen <screen-id>
```
