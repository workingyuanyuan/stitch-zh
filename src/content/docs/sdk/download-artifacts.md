---
title: 下載 HTML 與截圖
description: 每個 Stitch 畫面都有 HTML 檔與截圖兩種產出，SDK 提供下載網址，再自行下載存檔。
appliesTo: Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）
caveat: 截圖是二進位資料，要用 arrayBuffer 讀取再寫檔，不能用 text。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：How to download artifacts
    url: https://stitch.google.com/docs/sdk/download-artifacts/
  - title: "@google/stitch-sdk 0.4.0：dist/src/screen-ext.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/screen-ext.d.ts
  - title: "@google/stitch-sdk 0.3.5：dist/src/project-ext.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/src/project-ext.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/project-ext.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/project-ext.d.ts
---

## 兩種產出

| 產出 | 內容 | 取得網址 |
| --- | --- | --- |
| HTML 檔 | 完整的 HTML 文件，Tailwind CSS 寫在檔案內 | `screen.getHtml()` |
| 截圖 | 畫面的圖片 | `screen.getImage()` |

SDK 只給下載網址，下載與存檔用 `fetch` 和 Node.js 的 `fs` 自己處理。

## 1. 取得下載網址

```ts
import { stitch } from "@google/stitch-sdk";

const projects = await stitch.projects();
const screens = await projects.at(0).screens();
const screen = screens.at(0);

const htmlUrl = await screen.getHtml();
const imageUrl = await screen.getImage();
```

## 2. 存下 HTML

```ts
import fs from "fs/promises";

const response = await fetch(htmlUrl);
const html = await response.text();
await fs.writeFile(`${screen.id}.html`, html);
```

用瀏覽器開啟這個檔案，會看到套好 Tailwind 樣式、完整呈現的設計。

## 3. 存下截圖

圖片是二進位資料，改用 `arrayBuffer()`，不要用 `text()`：

```ts
const imgResponse = await fetch(imageUrl);
const buffer = await imgResponse.arrayBuffer();
await fs.writeFile(`${screen.id}.jpeg`, Buffer.from(buffer));
```

## 一次下載專案裡的所有畫面

```ts
import fs from "fs/promises";
import path from "path";

const outDir = "./designs";
await fs.mkdir(outDir, { recursive: true });

const project = (await stitch.projects()).at(0);
const screens = await project.screens();

for (const screen of screens) {
  const htmlUrl = await screen.getHtml();
  if (htmlUrl) {
    const res = await fetch(htmlUrl);
    await fs.writeFile(path.join(outDir, `${screen.id}.html`), await res.text());
  }

  const imgUrl = await screen.getImage();
  if (imgUrl) {
    const res = await fetch(imgUrl);
    await fs.writeFile(path.join(outDir, `${screen.id}.jpeg`), Buffer.from(await res.arrayBuffer()));
  }
}

console.log(`Downloaded ${screens.length} screens to ${outDir}`);
```

迴圈裡先檢查網址是否存在，再下載；檔名用畫面 ID，HTML 存成 `.html`，截圖存成 `.jpeg`。

## 和已發布套件的差異

本頁的程式碼在兩版都能執行。

| 項目 | Stitch 文件 | 0.3.5（latest） | 0.4.0（next） |
| --- | --- | --- | --- |
| `getHtml()`、`getImage()` | 回傳下載網址 | 回傳下載網址 | 仍回傳下載網址，標為 deprecated；網址改用 `getHtmlUrl()`、`getImageUrl()`（`screen-ext.d.ts` 第 4–8、17–26 行） |
| 直接取得內容 | 自己用 `fetch` 下載 | 沒有對應方法 | `readHtml()` 回傳 HTML 字串，`readImage()` 回傳 `Uint8Array`（`screen-ext.d.ts` 第 31、36 行） |
| 整個專案下載到資料夾 | 沒有提到，用迴圈自己下載 | `project.downloadAssets(outputDir, opts?)`，會改寫 HTML 裡的網址讓檔案自成一體（`project-ext.d.ts` 第 39 行） | 同 0.3.5 |
