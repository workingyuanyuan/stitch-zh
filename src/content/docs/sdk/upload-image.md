---
title: 上傳檔案
description: project.upload() 把硬碟上的設計稿、截圖或 HTML 原型上傳到 Stitch，變成畫面。
appliesTo: Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）
caveat: Stitch 文件說 upload 回傳含 success 的結果物件；0.3.5 與 0.4.0 的型別宣告都是直接回傳 Screen 陣列。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：How to upload files
    url: https://stitch.google.com/docs/sdk/upload-image/
  - title: "@google/stitch-sdk 0.3.5：dist/src/project-ext.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/src/project-ext.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/project-ext.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/project-ext.d.ts
  - title: "@google/stitch-sdk 0.3.5：dist/src/spec/upload.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/src/spec/upload.d.ts
  - title: "@google/stitch-sdk 0.3.5：README"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/README.md
---

## 上傳一個檔案

```ts
import { stitch } from "@google/stitch-sdk";

const project = stitch.project("your-project-id");

const screens = await project.upload("./mockup.png", {
  title: "Home Screen",
});

const [screen] = screens;
console.log(`Screen created: ${screen.id}`);
const html = await screen.getHtml();
const imageUrl = await screen.getImage();
```

這段程式碼依已發布套件的型別宣告撰寫：`upload()` 回傳建立的 `Screen` 陣列。Stitch 文件的寫法不同，見文末的差異表。

SDK 從硬碟讀取檔案，直接送到 Stitch REST API，不必自己轉 base64，也不必開瀏覽器。這條路徑沒有輸出 token 數量的限制；由 agent 透過 MCP 呼叫傳送 base64 內容時，常卡在這個限制。

## 支援的格式

| 副檔名 | 類型 | 畫面類型 |
| --- | --- | --- |
| `.png` | 圖片 | `IMAGE` |
| `.jpg` / `.jpeg` | 圖片 | `IMAGE` |
| `.webp` | 圖片 | `IMAGE` |
| `.html` / `.htm` | 文件 | `DOCUMENT` |

SDK 依副檔名自動判斷，`.html` 與 `.htm` 會設成 `DOCUMENT` 畫面。適合匯入現有網頁或原型的靜態快照。

## 選項

| 選項 | 型別 | 預設 | 作用 |
| --- | --- | --- | --- |
| `title` | `string` | — | 畫面在 Stitch 裡顯示的標題 |
| `createScreenInstances` | `boolean` | `true` | 是否把畫面放到畫布上 |

## 上傳 HTML 原型

上傳一個可獨立使用（self-contained）的 HTML 檔，匯入現有的設計：

```ts
const screens = await project.upload("./prototype.html", {
  title: "Landing Page Prototype",
});
```

## 處理失敗

套件 README 寫明，所有 domain 類別的方法失敗時都丟出 `StitchError`，所以用 `try`／`catch` 接住：

```ts
import { StitchError } from "@google/stitch-sdk";

try {
  const screens = await project.upload("./mockup.png");
  console.log(`Created ${screens.length} screens`);
} catch (e) {
  if (e instanceof StitchError) {
    console.error(`${e.code}: ${e.message}`);
  }
}
```

### 上傳錯誤碼

Stitch 文件列出下面五個錯誤碼。套件把同樣五個值定義成 `UploadErrorCode` 型別，屬於內部上傳處理器回傳的 `UploadResult`；`project.upload()` 的型別宣告不包含它們。

| 錯誤碼 | 意思 |
| --- | --- |
| `FILE_NOT_FOUND` | 指定路徑沒有這個檔案 |
| `UNSUPPORTED_FORMAT` | 副檔名不是 `.png`、`.jpg`、`.jpeg`、`.webp`、`.html` 或 `.htm` |
| `AUTH_FAILED` | API Key 無效或沒有提供 |
| `UPLOAD_FAILED` | 伺服器拒絕這次上傳 |
| `UNKNOWN_ERROR` | 非預期的失敗 |

## 一次上傳整個資料夾

用迴圈逐一上傳：

```ts
import fs from "fs/promises";
import path from "path";

const project = stitch.project("your-project-id");
const files = await fs.readdir("./designs");

for (const file of files) {
  if (/\.(png|jpe?g|webp|html?)$/i.test(file)) {
    const screens = await project.upload(
      path.join("./designs", file),
      { title: path.parse(file).name },
    );
    console.log(`Uploaded ${file} → ${screens[0].id}`);
  }
}
```

這段程式碼只上傳支援格式的檔案，並用去掉副檔名的檔名當畫面標題。

## 和已發布套件的差異

| 項目 | Stitch 文件 | 0.3.5（latest） | 0.4.0（next） |
| --- | --- | --- | --- |
| `upload()` 的回傳型別 | `Promise<UploadResult>`：`{ success: true, screens }` 或 `{ success: false, error }` | `Promise<Screen[]>`（`project-ext.d.ts` 第 24 行） | `Promise<Screen[]>`（`project-ext.d.ts` 第 24 行） |
| 失敗時 | 從不丟出例外，回傳 `success: false` | `project.upload()` 的宣告沒有寫；回傳 `UploadResult`、「never throws」的是內部的 `UploadHandler.execute()`（`upload-handler.d.ts` 第 5、10 行）；README 寫 domain 類別的方法失敗時丟出 `StitchError` | 同 0.3.5 |
| `UploadResult` 型別 | 本頁的回傳值 | 有匯出這個型別（`dist/src/index.d.ts`），但不是 `project.upload()` 的回傳型別 | 同 0.3.5 |
