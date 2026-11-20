---
title: 變化版本（Variations）
description: Variations 一次產生多個設計選項，適合卡關、探索版面或整體換風格時使用。
appliesTo: Stitch 網頁版（2026-11-20）
caveat: 一次可產生一到五個選項，是 2026-11-20 的上限；Variations 適合大幅改動，但提示詞仍要寫明方向。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Using Variations
    url: https://stitch.google.com/docs/learn/variants/
---

## 什麼時候用

Variations 一次產生多個設計選項，目前是一個到五個。它讓你跳出每次只產生一個版本的線性流程，同時比較幾種可能。

| 情況 | 適合的工具 |
| --- | --- |
| 具體的小修改，例如換一個按鈕的顏色 | 一般的 Chat |
| 卡關：知道目前的設計不對，但不知道要改什麼 | Variations |
| 探索：同樣的內容想看三種版面概念 | Variations |
| 轉向：一次把整體風格換掉，例如從企業藍換成霓虹 Cyberpunk | Variations |

## Creative Range：變化的幅度

每次產生變化版本時，要指定 `Creative Range`，也就是允許 Stitch 離目前的設計多遠。

| 設定 | 幅度 | 會改變什麼 | 用途 |
| --- | --- | --- | --- |
| `Refined` | 低 | 保留結構，調整字體、細微的間距與顏色 | 修飾 |
| `Creative` | 高 | 可以完全重排版面、換圖片、翻新主題 | 看看還有什麼可能 |

## 提示詞可以一次改很多

一般修改建議一次只做一項主要修改；Variations 相反，適合大幅改動。因為會產生多個選項讓你挑，主題和版面的修改可以寫在同一個提示詞裡。

```text
Give the whole app a warm, handcrafted feel in cream and terracotta, and rebuild the Menu screen as a two-column grid of cards.
```

| 提示詞片段 | 作用 |
| --- | --- |
| `a warm, handcrafted feel` | 定調 |
| `in cream and terracotta` | 指定配色 |
| `the Menu screen` | 指定畫面 |
| `a two-column grid of cards` | 清楚、具體的版面指示 |

這段提示詞把整個 App 換成溫暖的手作感、米白配赤陶色，並把 Menu 畫面重做成兩欄的卡片網格。

要求大幅改動時，也要寫出方向。只說「改得不一樣」不夠，要說往哪裡改，例如 minimalist（極簡）或 bold（大膽）。

## 從最好的版本繼續

選項出來後，可能會發現某一個的版面最好，另一個的配色比較好。

1. 選出最接近想法的版本當基礎。
2. 對這個版本再做一次 Variations：選取它，把 `Creative Range` 調到 `Refined`，請 Stitch 套用另一個選項裡你喜歡的配色。
