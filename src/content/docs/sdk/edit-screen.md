---
title: 修改畫面
description: screen.edit() 用一段自然語言修改現有畫面，回傳新的 Screen 物件。
appliesTo: Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）
caveat: 產生畫面最長可能需要一分鐘；逾時時不要重試，伺服器仍在處理。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：How to edit a screen
    url: https://stitch.google.com/docs/sdk/edit-screen/
  - title: "@google/stitch-sdk 0.3.5：dist/generated/src/screen.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/generated/src/screen.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/generated/src/screen.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/generated/src/screen.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/generation.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/generation.d.ts
---

## 用途

已經有畫面時，用 `screen.edit(prompt, deviceType?, modelId?)` 以自然語言反覆修改。SDK 負責呼叫背後的工具。

## 1. 找出要修改的畫面

從現有專案取一個畫面：

```ts
import { stitch } from "@google/stitch-sdk";

const projects = await stitch.projects();
const project = projects.at(0);
const screens = await project.screens();
const screen = screens.at(0);

console.log(`Editing screen ${screen.id} in project ${project.id}`);
```

## 2. 修改

把修改指示傳給 `screen.edit()`：

```ts
const edited = await screen.edit("Night-shift baristas use this after dark: dim everything on the screen and let only the order buttons glow lantern orange");
```

這段提示詞說明大夜班咖啡師在夜裡使用，要 Stitch 把整個畫面調暗，只讓點單按鈕亮出燈籠橘。

`edited` 是**新的** `Screen`，原本的 `screen` 不會改變。產生畫面最長可能需要一分鐘；逾時時不要重試，伺服器還在處理。

## 3. 比較前後

```ts
const originalHtml = await screen.getHtml();
const editedHtml = await edited.getHtml();

console.log(`Original: ${originalHtml}`);
console.log(`Edited:   ${editedHtml}`);
```

## 指定裝置類型或模型

第二、三個參數可選，分別是裝置類型與模型：

```ts
const edited = await screen.edit(
  "While the menu scrolls, keep today's pickup time and a call-the-shop button fixed at the foot of the screen",
  "MOBILE",          // deviceType
  "GEMINI_3_PRO"     // modelId
);
```

這段提示詞要 Stitch 讓今天的取餐時間和打電話給店家的按鈕固定在畫面最下方，菜單捲動時仍看得到。

| 參數 | 可用的值 |
| --- | --- |
| `deviceType` | `DEVICE_TYPE_UNSPECIFIED`、`MOBILE`、`DESKTOP`、`TABLET`、`AGNOSTIC` |
| `modelId` | `MODEL_ID_UNSPECIFIED`、`GEMINI_3_PRO`、`GEMINI_3_FLASH`；已發布套件另有其他值，見下表 |

完整型別見 [SDK 參考](/sdk/reference/)。

## 和已發布套件的差異

上面的程式碼在兩版都能執行。

| 項目 | Stitch 文件 | 0.3.5（latest） | 0.4.0（next） |
| --- | --- | --- | --- |
| `edit()` 回傳 | 新的 `Screen` | `Promise<Screen>`（`screen.d.ts` 第 24 行） | `Promise<Generation<Screen, EditScreensResponse>>`（`screen.d.ts` 第 31 行）；可當 `Screen` 用，`.first` 是第一個畫面 |
| 第二個參數 | `deviceType` | `deviceType` | `deviceType`，或物件 `{ deviceType?, modelId? }` |
| `modelId` 的值 | `MODEL_ID_UNSPECIFIED`、`GEMINI_3_PRO`、`GEMINI_3_FLASH` | 多了 `GEMINI_3_1_PRO` | 多了 `GEMINI_3_8_FLASH`、`GEMINI_3_5_FLASH_LITE`、`GEMINI_3_1_PRO` |
| `getHtml()` | 回傳下載網址 | 回傳下載網址 | 仍回傳下載網址，標為 deprecated，建議改用 `getHtmlUrl()` |
