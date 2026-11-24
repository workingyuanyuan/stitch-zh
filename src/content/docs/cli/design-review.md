---
title: 審查 App 介面
description: 在本機拿執行中的 App 和 DESIGN.md 比對，找出偏離設計系統的地方。
appliesTo: Stitch CLI（2026-11-20）
caveat: 審查全程在本機執行，不呼叫雲端；先啟動本機開發伺服器，儲存庫裡也要有 DESIGN.md。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Audit App UI
    url: https://stitch.google.com/docs/cli/design-review/
---

## 審查什麼

功能一路上線，實作很容易偏離設計系統：這裡換了字重，那裡多了一條不符合設計系統的卡片邊框，某個色碼被改成相近的值。

審查的每個步驟都在你的電腦上執行，不呼叫雲端。審查之後，可以選擇把快照上傳到 Stitch Canvas 試改。

| 步驟 | 做法 |
| --- | --- |
| 1. 準備 | 儲存庫裡有 `DESIGN.md`，裝好 `/stitch` Skill（`stitch agent-skills add`），啟動開發伺服器 |
| 2. 擷取 | 交給 `/stitch`，或自己執行 `stitch capture` |
| 3. 比對 | 依四項檢查找出問題 |
| 4. 在畫布上試改（選用） | 用 `stitch upload screen` 上傳快照，再修改或產生變化版本 |

## 用 `/stitch` Skill 審查

啟動開發伺服器，請 coding agent 審查一個路由：

```text
/stitch The new /booking page of our Hualien homestay site goes live on Friday. How far has it drifted from DESIGN.md? Rank what you find, worst first, and wait for me to pick the fixes.
```

這段要 agent 在花蓮民宿網站的新 `/booking` 頁面週五上線前，檢查它偏離 `DESIGN.md` 多少，把問題依嚴重程度排序，再等你挑要修哪些。

agent 會：

1. 找出執行中的本機開發伺服器。
2. 擷取 hydration 後的實際 DOM（`.stitch/captured-dom.html`）和一張 `1280x800` 驗證截圖（`.stitch/verify-capture.png`）。
3. 拿兩者和 `DESIGN.md` 比對。

結果是一份排好優先順序的問題清單，每一項都對應到實際的 CSS 選擇器、截圖區域與 `DESIGN.md` 規則。agent 會停下來，讓你決定先套用哪些修正。

## 從終端機擷取

也可以自己先擷取快照，再交給 agent：

```bash
stitch capture http://localhost:5173/dashboard -o .stitch/captured-dom.html
```

這個指令會在本機寫出兩個檔案：

| 檔案 | 內容 |
| --- | --- |
| `.stitch/captured-dom.html` | hydration 後的 DOM，含計算後樣式與結構標記 |
| `.stitch/verify-capture.png` | `1280x800` 截圖，顯示視窗裡實際渲染的內容 |

截圖裡如果是登入畫面或擋住頁面的視窗，在 `chrome-devtools` CLI 操作的瀏覽器分頁裡直接登入，再照該分頁當下的樣子重新擷取，不重新載入頁面：

```bash
stitch capture --tab -o .stitch/captured-dom.html
```

## 四項檢查

不論交給 `/stitch` 或自己看快照，重點放在這四項：

| 檢查 | 要問的問題 |
| --- | --- |
| 顏色與表面 token | 背景、邊框、主要強調色用的是 `DESIGN.md` 裡的確切 hex 值，還是混進了隨意的灰色？ |
| 字體與數字 | 標題、內文、數據顯示是否符合字級與等寬數字的規則？ |
| 空間節奏 | 內距與間隙是否依 4px/8px 格線，還是元素擠在容器邊緣？ |
| 視覺克制 | 該用純文字的地方，是否多了狀態圓點、膠囊徽章或套疊的邊框？ |

## 在 Stitch Canvas 上試修正

審查發現版面問題，又想在動程式碼之前先看幾種視覺方案時，把擷取的快照直接上傳到 Stitch Canvas 專案：

```bash
stitch upload screen .stitch/captured-dom.html \
  --route "/dashboard" \
  --title "Dashboard Current"
```

接著用 `stitch edit screen` 或 `stitch generate variants` 在畫布上試不同的版面，再把選中的設計帶回程式碼庫。
