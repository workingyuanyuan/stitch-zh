---
title: SDK 快速上手
description: Stitch SDK（@google/stitch-sdk）讓你用 TypeScript 產生、修改與管理 UI 設計。
appliesTo: Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）
caveat: Stitch 文件沒有寫 SDK 版本；npm 上 latest 是 0.3.5、next 是 0.4.0，兩版的 API 有差異。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Build your first design
    url: https://stitch.google.com/docs/sdk/tutorial/
  - title: "@google/stitch-sdk 0.3.5：package.json"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/package.json
  - title: "@google/stitch-sdk 0.4.0：package.json"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/package.json
  - title: "@google/stitch-sdk 0.4.0：dist/src/generation.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/generation.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/screen-ext.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/screen-ext.d.ts
---

## 這一頁做出什麼

一支 TypeScript 腳本：建立專案、產生一個畫面，再取得這個畫面的 HTML 與圖片網址。SDK 不需要 MCP 設定檔，也不需要先裝 CLI，安裝套件就能用。

原始碼在 GitHub：[google-labs-code/stitch-sdk](https://github.com/google-labs-code/stitch-sdk)。

## SDK 版本

Stitch 文件沒有寫它對應哪一版 SDK。本站對照了 npm 上的兩個版本：

| 版本 | npm 標籤 | 發布日期 |
| --- | --- | --- |
| `0.3.5` | `latest`（`npm install @google/stitch-sdk` 預設安裝這版） | 2026-05-12 |
| `0.4.0` | `next` | 2026-10-01 |

各頁的程式碼依套件的型別宣告修正過，和 Stitch 文件不同的地方列在各頁最後的「和已發布套件的差異」。

## 需要準備

| 項目 | 說明 |
| --- | --- |
| 執行環境 | Node.js 20 以上，或 [Bun](https://bun.sh)（兩版套件的 `package.json` 寫的是 `>=18`） |
| Stitch API Key | 在 Stitch 的設定頁產生，步驟見 [MCP 設定](/mcp/setup/) |

## 1. 安裝 SDK

npm：

```shell
npm install @google/stitch-sdk
```

Bun：

```shell
bun add @google/stitch-sdk
```

## 2. 設定 API Key

把金鑰設成環境變數，SDK 會自動讀取。

```shell
export STITCH_API_KEY="your-api-key"
```

## 3. 寫腳本

建立 `my-first-design.ts`：

```ts
import { stitch } from "@google/stitch-sdk";

// 1. Create a project
const project = await stitch.createProject("My First App");
console.log(`Project created: ${project.id}`);

// 2. Generate a screen
const screen = await project.generate("A sign-in page for a bubble tea shop's loyalty app, with phone number and password fields");
console.log(`Screen generated: ${screen.id}`);

// 3. Get your outputs
const htmlUrl = await screen.getHtml();
const imageUrl = await screen.getImage();

console.log(`HTML:  ${htmlUrl}`);
console.log(`Image: ${imageUrl}`);
```

傳給 `generate()` 的提示詞要 Stitch 做一個手搖飲店會員 App 的登入頁，有手機號碼與密碼兩個欄位。

這段程式碼在 0.3.5 與 0.4.0 都能執行。0.4.0 的 `generate()` 回傳的是 `Generation` 物件，它把 `Screen` 的屬性與方法轉給第一個畫面，所以 `screen.id`、`screen.getHtml()` 照樣能用；要取得全部畫面用 `.screens`，只取第一個用 `.first`。

## 4. 執行

用 tsx：

```shell
npx tsx my-first-design.ts
```

用 Bun：

```shell
bun my-first-design.ts
```

輸出大致如下：

```shell
Project created: 4044680601076201931
Screen generated: 98b50e2ddc9943efb387052637738f61
HTML:  https://...
Image: https://...
```

用瀏覽器開啟 HTML 網址，會看到已經套好樣式的登入頁，Tailwind CSS 直接寫在 HTML 裡。

## 剛才用到的三個概念

| 概念 | 作用 |
| --- | --- |
| `stitch` | 預設的單例（singleton），用你的 API Key 連到 Stitch MCP 伺服器 |
| `project.generate(prompt)` | 把提示詞送給 Stitch，回傳一個 `Screen` 物件 |
| `screen.getHtml()`、`screen.getImage()` | 取得設計的下載網址 |

SDK 的 API 是物件導向、可串接的：`stitch` → `Project` → `Screen`，每個物件都能取得下一層。

## 和已發布套件的差異

| 項目 | Stitch 文件 | 0.3.5（latest） | 0.4.0（next） |
| --- | --- | --- | --- |
| SDK 版本 | 沒有寫 | — | — |
| Node.js | 20 以上 | `package.json` 的 `engines` 寫 `>=18` | 同 0.3.5 |
| `project.generate()` 回傳 | `Screen` | `Promise<Screen>` | `Promise<Generation<Screen, GenerateScreenFromTextResponse>>`，可當 `Screen` 用（`generation.d.ts` 第 13–19 行） |
| `getHtml()`、`getImage()` | 回傳下載網址 | 回傳下載網址 | 仍回傳下載網址，但標為 deprecated；改用 `getHtmlUrl()`、`getImageUrl()`（網址）或 `readHtml()`、`readImage()`（內容）（`screen-ext.d.ts` 第 4–8、17–36 行） |

## 接下來

| 想做的事 | 頁面 |
| --- | --- |
| 用後續提示詞修改畫面 | [修改畫面](/sdk/edit-screen/) |
| 探索其他版面與配色 | [產生變化版本](/sdk/generate-variants/) |
| 建立設計系統並套用到多個畫面 | [管理設計系統](/sdk/design-systems/) |
| 從硬碟匯入設計稿、截圖與 HTML 原型 | [上傳檔案](/sdk/upload-image/) |
| 讓 LLM 安排整個設計流程 | [搭配 Vercel AI SDK](/sdk/ai-sdk/) |
| 用 `callTool` 與 `listTools` 完整控制 | [Agent 工作流程](/sdk/agent-workflows/) |
| 查所有方法 | [SDK 參考](/sdk/reference/) |
