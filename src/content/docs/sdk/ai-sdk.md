---
title: 搭配 Vercel AI SDK
description: stitchTools() 把 Stitch 的工具轉成 Vercel AI SDK 格式，讓 LLM 自己安排設計流程。
appliesTo: Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）
caveat: stitchTools 要從獨立的子路徑 @google/stitch-sdk/ai 匯入，不是從主套件 @google/stitch-sdk。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Use with AI SDK
    url: https://stitch.google.com/docs/sdk/ai-sdk/
  - title: "@google/stitch-sdk 0.4.0：dist/src/tools-adapter.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/tools-adapter.d.ts
  - title: "@google/stitch-sdk 0.4.0：package.json"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/package.json
---

## 這是什麼

Stitch SDK 附帶一個 [Vercel AI SDK](https://sdk.vercel.ai) 轉接器。從子路徑 `/ai` 匯入 `stitchTools()`，直接放進 `generateText()` 或 `streamText()`。要呼叫哪些工具、依什麼順序，由 LLM 決定，你只寫提示詞。

## 1. 安裝三個套件

```shell
npm install @google/stitch-sdk ai @ai-sdk/google
```

## 2. 設定兩組金鑰

```shell
export STITCH_API_KEY="your-stitch-api-key"
export GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
```

| 環境變數 | 給誰用 |
| --- | --- |
| `STITCH_API_KEY` | Stitch 工具；也可以改用 `stitchTools({ apiKey })` 直接傳入，見下方 |
| `GOOGLE_GENERATIVE_AI_API_KEY` | 範例裡的 Gemini 模型（`@ai-sdk/google`） |

## 3. 基本用法

```ts
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { stitchTools } from "@google/stitch-sdk/ai";

const { text } = await generateText({
  model: google("gemini-3.1-flash-lite-preview"),
  tools: stitchTools(),
  maxSteps: 5,
  prompt: "I'm planning a weekend cycling trip around Sun Moon Lake. Open a Stitch project for it named 'Lakeside Ride', then design a mobile screen listing each stop on the loop with the distance from the last one.",
});

console.log(text);
```

這段提示詞先交代要規劃日月潭的週末單車行程，再要模型開一個名為 Lakeside Ride 的專案，並設計一個手機畫面，列出環湖路線的每個停靠點和與上一站的距離。

LLM 會先呼叫 `create_project`，再呼叫 `generate_screen_from_text`，最後用自然語言總結它做了什麼。流程控制的程式碼不用自己寫。

## 限制模型能用的工具

傳入 `include` 陣列，只開放列出的工具：

```ts
const tools = stitchTools({
  include: ["create_project", "generate_screen_from_text", "list_projects"],
});
```

適合縮小模型的權限，例如不讓它刪除專案。

## 直接傳入 API Key

不想依賴環境變數 `STITCH_API_KEY` 時，直接傳入：

```ts
const tools = stitchTools({ apiKey: "your-key-here" });
```

## 運作方式

| 事實 | 說明 |
| --- | --- |
| 回傳型別 | `Record<string, Tool>`，可直接當 AI SDK 的工具使用 |
| 執行 | 每個工具都已接好 `execute` 函式，會呼叫背後的 Stitch MCP 伺服器 |
| 相依性 | 對 `ai` 套件沒有任何執行期相依，只匯入 `Tool` 型別 |

更深入的設計見 [SDK 架構](/sdk/architecture/)。

## 和已發布套件的差異

本頁的程式碼在兩版都能執行；`stitchTools(options?)` 的兩個選項 `apiKey`、`include` 在兩版相同。

| 項目 | Stitch 文件 | 0.3.5（latest） | 0.4.0（next） |
| --- | --- | --- | --- |
| `include` 裡有不存在的工具名稱 | 沒有說明 | 型別宣告沒有說明 | 丟出錯誤（`tools-adapter.d.ts` 第 26 行：unknown names THROW） |
| 套件 `ai` | 另外安裝 | 不在 `dependencies` | 列為選用的 `peerDependencies`（`^6.0.0`） |
