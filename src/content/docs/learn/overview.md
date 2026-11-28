---
title: 快速上手
description: 用一段提示詞產生第一個設計，再逐項修改、試用原型，最後下載 HTML 與圖片。
appliesTo: Stitch 網頁版（2026-11-20）
caveat: Stitch 輸出的是圖片與 HTML 程式碼；要 React、Vue、Flutter、SwiftUI 等格式時，把 HTML 和參考圖交給 LLM 轉換。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Everything you need to know to design with Stitch
    url: https://stitch.google.com/docs/learn/overview/
---

## 流程一覽

| 步驟 | 目的 | 在 Stitch 裡的操作 |
| --- | --- | --- |
| 1 | 寫第一個提示詞 | 說明要做什麼、風格與內容 |
| 2 | 選裝置類型 | 選 `App` 或 `Web`，然後產生設計 |
| 3 | 逐項修改 | 選取畫面，按 `Edit`、`Add to Chat`，寫提示詞 |
| 4 | 調整主題 | 選取畫面，按 `Generate`，再按 `Edit Theme` |
| 5 | 試用原型 | 選取畫面，按 `Generate`，再按 `Prototype` |
| 6 | 下載 | 選取一個或多個畫面，按下載，取得 zip 檔 |

好設計來自反覆修改，不是來自完美的第一個提示詞。先產生一版，再從喜歡與不喜歡的地方改起。

## 第一個提示詞

起頭的提示詞可以照一個配方寫，分成三個部分，另外可以附一張參考圖。

| 部分 | 寫什麼 |
| --- | --- |
| Idea | 這是什麼：哪一種頁面或 App，給誰用 |
| Theme | 核心風格：氛圍、配色方向 |
| Content | 頁面上要有的內容 |
| Image | 參考圖（選用） |

```text
Ridge Line is a hiking club in Taipei, and it needs a home page.
The mood is calm and outdoorsy: deep green on off-white, with plenty of space.
Show this weekend's hike at the top, then three more upcoming hikes and a button to join.
```

三行依序是 Idea（台北登山社團的首頁）、Theme（沉穩的戶外風格，深綠配米白）、Content（最上方是本週的活動，接著是另外三場活動和加入按鈕）。

第一個提示詞只要寫出具體內容和大致的感覺。字體名稱與色碼留到後面再調整。

## 選裝置類型

`App` 或 `Web` 二選一，憑直覺選比較適合的那個。之後修改時，Stitch 有方法把設計轉成另一種，見[裝置類型：App 與 Web](/learn/device-types/)。

## 在畫布上移動

| 按鍵 | 作用 |
| --- | --- |
| `V` | 切換到選取工具（Select） |
| `H` | 切換到平移工具（Pan），拖曳移動畫布 |
| `⌘←` / `Ctrl+←` | 跳到上一個畫面；在畫布上迷路時，按它會跳到最近的畫面 |
| `⌘→` / `Ctrl+→` | 跳到下一個畫面 |
| `?` | 顯示全部快捷鍵 |

## 一次改一件事

設計產生後，選取要修改的畫面，按 `Edit`，再按 `Add to Chat`，然後寫提示詞。提示詞要寫明改哪裡、怎麼改。

```text
On the hike list, make the next upcoming hike stand out. Give its card a full-width photo and a larger title, and show the other hikes as compact rows below it.
```

| 提示詞片段 | 作用 |
| --- | --- |
| `On the hike list` | 指定要改的元件 |
| `a full-width photo and a larger title` | 具體的視覺指示 |
| `card`、`compact rows` | UI/UX 用語，讓 Stitch 知道要用哪種元件 |

這段提示詞要 Stitch 突顯最近的一場活動：它的卡片用滿版照片和較大的標題，其他活動縮成下方的精簡列表。

之後重複同一個步驟：選一個要調整的地方，用 UI/UX 用語寫出清楚指出要改哪個元件的提示詞，再產生。

## 調整主題：Edit Theme

修改屬於整體主題時，用 `Edit Theme` 比寫提示詞快。選取畫面，按 `Generate`，再按 `Edit Theme`，可以調整：

- 淺色或深色外觀
- 強調色
- 元件的圓角大小
- 字體

## 試用原型：Prototype

設計接近想要的樣子後，選取畫面，按 `Generate`，再按 `Prototype`。Stitch 會產生可以捲動、可以互動的原型。

原型用來檢查靜態設計看不到的狀態：

- 按鈕、連結、卡片在滑鼠移上去時的樣式
- 在文字框裡實際打字，看大小是否符合預期的字數
- 想像這個原型實際被使用的情境，看哪裡不順手

發現問題後，回到設計繼續修改。

## 下載程式碼與圖片

點選一個畫面，或拖曳框選多個畫面，按下載。瀏覽器會下載一個 zip 檔，裡面是設計的圖片與 HTML 程式碼。

HTML 是轉換成其他格式的基礎。把 HTML 和參考圖交給 LLM，可以轉成 React、Angular、Vue 等元件，或 Jetpack Compose、Flutter、SwiftUI 等非網頁平台的程式碼。
