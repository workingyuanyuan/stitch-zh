---
title: 擷取主題
description: 從 Stitch 畫面的 HTML 取出 Tailwind 設定、Google Fonts 與 Material Symbols 來沿用。
appliesTo: Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）
caveat: 主題要從畫面的 HTML 取出：getHtml 只回傳下載網址，要先下載 HTML，再用正規表示式找出設定、字型與圖示。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：How to extract themes
    url: https://stitch.google.com/docs/sdk/extract-themes/
  - title: "@google/stitch-sdk 0.4.0：dist/src/screen-ext.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/screen-ext.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/generated/src/project.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/generated/src/project.d.ts
---

## HTML 裡有什麼

每個 Stitch 畫面產生的 HTML 文件都內嵌 Tailwind 設定與 Google Fonts 連結；設計有用到 Material Design 圖示時，也有 Material Symbols 的參照。

| 項目 | 在 HTML 裡的位置 | 取得的內容 |
| --- | --- | --- |
| Tailwind 設定 | `id="tailwind-config"` 的 `script` 標籤 | 完整的 `tailwind.config` 物件：顏色、字型、間距、圓角的 token |
| Google Fonts | 網址含 `fonts.googleapis.com` 的 `link` 標籤 | 設計用了哪些字型 |
| Material Symbols | class 含 `material-symbols-` 的 `span` 標籤 | 設計用了哪些 Material Design 圖示 |

## 1. 取得 HTML 內容

```ts
import { stitch } from "@google/stitch-sdk";

const project = (await stitch.projects()).at(0);
const screen = (await project.screens()).at(0);

const htmlUrl = await screen.getHtml();
const response = await fetch(htmlUrl);
const html = await response.text();
```

## 2. 取出 Tailwind 設定

```ts
const configMatch = html.match(/<script id="tailwind-config">([\s\S]*?)<\/script>/);

if (configMatch) {
  console.log("Tailwind config:");
  console.log(configMatch[1].trim());
}
```

## 3. 取出 Google Fonts

```ts
const fontLinks = html.match(/<link[^>]*fonts\.googleapis\.com[^>]*>/g) || [];

for (const link of fontLinks) {
  console.log(link);
}
```

## 4. 取出 Material Symbols

設計有用 Material Design 圖示時：

```ts
const matches = Array.from(
  html.matchAll(/<span[^>]*class="[^"]*material-symbols-[^"]*"[^>]*>([^<]+)<\/span>/g)
);

const icons = new Set(matches.map(m => m.at(1).trim()));
console.log(`Icons used: ${[...icons].join(", ")}`);
```

## 整合擷取步驟

先用提示詞產生一個特定風格的畫面，再從它的 HTML 取出 design token：

```ts
const screen = await project.generate("Booking screen for a pottery class in Yingge: clay-brown backgrounds, glaze-green buttons and a heading font that looks hand-lettered");
const url = await screen.getHtml();
const html = await (await fetch(url)).text();

// Now extract tailwind config, fonts, and icons from `html`
```

這段提示詞要 Stitch 做鶯歌陶藝課的預約畫面：陶土棕背景、釉綠色按鈕，標題字型像手寫字。風格寫得具體，取出的 token 才有特色。

取得 `html` 後，套用上面三段程式碼取出 Tailwind 設定、字型與圖示，就能以 AI 產生的設計為起點，整理出一致的設計系統。

## 和已發布套件的差異

這些用法在 0.3.5 與 0.4.0 都能執行。

| 項目 | Stitch 文件 | 0.3.5（latest） | 0.4.0（next） |
| --- | --- | --- | --- |
| 取得 HTML 內容 | `getHtml()` 取得網址，再 `fetch` | 同 Stitch 文件 | 也可以用 `readHtml()` 直接取得 HTML 字串；`getHtml()` 仍回傳網址，標為 deprecated（`screen-ext.d.ts` 第 17–31 行） |
| `project.generate()` 回傳 | `Screen` | `Promise<Screen>` | `Promise<Generation<Screen, GenerateScreenFromTextResponse>>`，可當 `Screen` 用 |
