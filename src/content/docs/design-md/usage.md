---
title: 檢視、編輯與匯出
description: 在 Stitch 的 Design System 面板檢視、編輯與匯出專案的 DESIGN.md。
appliesTo: DESIGN.md（2026-11-20）
caveat: 設定專案預設設計系統後，只有之後產生的畫面會沿用；既有畫面不會自動更新，要逐一套用。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：View, edit, and export
    url: https://stitch.google.com/docs/design-md/usage/
---

## 檢視目前的設計系統

開啟 `Design System` 面板，可以看到任一畫面目前使用的設計系統。面板顯示解析後的 token：顏色、字體、圓角、間距與元件模式。

專案裡有多個設計系統時，面板顯示的是目前選取的畫面所套用的那一個。

## 設定專案預設

把一個設計系統選為專案預設後，之後新產生的畫面都會自動沿用它的 token。

| 畫面 | 結果 |
| --- | --- |
| 設定預設之後產生的新畫面 | 自動沿用預設設計系統 |
| 設定之前就存在的畫面 | 不會自動更新；要逐一把設計系統套用到這些畫面上 |

## 在面板裡編輯

在 `Design System` 面板做的修改會同時更新結構化的 token 和 `DESIGN.md` 摘要。

| 可編輯的屬性 | 內容 |
| --- | --- |
| 配色 | primary、secondary、tertiary 與 neutral 基礎色 |
| 字體排印 | 標題、內文與標籤的字體家族 |
| 圓角 | 各級圓角半徑 |

更細的修改，例如元件準則、Do's and Don'ts 或 Overview 的敘述，要直接編輯 `DESIGN.md` 的 Markdown。

## 隨專案匯出

匯出專案時，`DESIGN.md` 會和產生的畫面一起放在 zip 檔裡。開發者、其他設計工具或其他 agent 拿到這份檔案，就有一份可以帶到 Stitch 以外使用的設計系統紀錄。

## 在 Stitch 之外檢查

`@google/design.md` CLI 可以依正式規格驗證任何 `DESIGN.md`、檢查 WCAG 對比度，並把 token 匯出成 Tailwind 或 W3C Design Token 格式。不論檔案是 Stitch 產生的還是手寫的都適用，見 [用 CLI 驗證 DESIGN.md](/design-md/cli/)。
