---
title: Agent 工作流程
description: 用 listTools 查詢 Stitch MCP 工具目錄，用 callTool 直接呼叫工具，適合 AI 代理與自動化。
appliesTo: Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）
caveat: callTool 能呼叫 domain API 還沒包裝的工具，但參數要自己組；名稱與型別看 listTools 回傳的 JSON Schema。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Agent-driven workflows
    url: https://stitch.google.com/docs/sdk/agent-workflows/
  - title: "@google/stitch-sdk 0.3.5：package.json"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/package.json
  - title: "@google/stitch-sdk 0.4.0：package.json"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/package.json
  - title: "@google/stitch-sdk 0.3.5：dist/src/index.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/src/index.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/index.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/index.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/tools.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/tools.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/generated/src/project.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/generated/src/project.d.ts
---

## 什麼時候用低階 API

人寫腳本時，優先用 domain API（`stitch.projects()`、`project.generate()`）。以下情況改用低階的 `callTool` 與 `listTools`：

- 在做 AI 代理
- 在做自動化流程
- 需要 domain API 還沒包裝的工具

## 列出可用的工具

```ts
import { stitch } from "@google/stitch-sdk";

const { tools } = await stitch.listTools();
for (const tool of tools) {
  console.log(`${tool.name}: ${tool.description}`);
}
```

## 用名稱呼叫任何工具

`callTool` 可以直接呼叫每一個 MCP 工具，包括 domain API 還沒提供的：

```ts
// Create a project
const result = await stitch.callTool("create_project", { title: "Agent Project" });
console.log(result);

// Generate a screen
const screen = await stitch.callTool("generate_screen_from_text", {
  projectId: result.name.replace("projects/", ""),
  prompt: "A sales dashboard for a pineapple cake bakery in Taichung, with a daily orders chart and KPIs for revenue and returning customers",
});
console.log(screen);
```

第二個呼叫的提示詞要 Stitch 做一個台中鳳梨酥店的銷售儀表板：每日訂單圖表，以及營收和回購客人的 KPI。

| 工具 | 這裡用到的參數 |
| --- | --- |
| `create_project` | `title` |
| `generate_screen_from_text` | `projectId`（去掉 `projects/` 前綴的專案 ID）、`prompt` |

## 代理怎麼知道工具的參數

呼叫 `callTool` 前，代理要知道兩件事：工具需要哪些參數，以及回應長什麼樣子。SDK 有兩種取得方式。

| 方式 | 來源 | 時機 |
| --- | --- | --- |
| `listTools()` | 伺服器回傳的工具清單與 JSON Schema | 執行期查詢 |
| `toolDefinitions` | SDK 內建的陣列，由 `tools-manifest.json` 產生 | 建置時就寫入 |

### 執行期查詢：listTools()

`listTools()` 回傳完整的工具目錄和各自的 JSON Schema。代理讀這些 schema，就知道要組出什麼參數，不必事先寫死參數名稱：

```ts
const { tools } = await stitch.listTools();
const createTool = tools.find(t => t.name === "create_project");
console.log(JSON.stringify(createTool.inputSchema, null, 2));
// → { type: "object", properties: { title: { type: "string", ... } } }
```

### 建置時寫入：toolDefinitions

SDK 也附帶一個自動產生的 `toolDefinitions` 陣列，內容來自 `tools-manifest.json`，schema 與執行期查到的相同。`stitchTools()` 就是用它把工具接到 Vercel AI SDK，所以不需要在執行期呼叫 `listTools()`。

Stitch 文件從 `@google/stitch-sdk/tool-definitions` 匯入並註明 internal，但兩版套件都沒有開放這個子路徑。下面改從主套件匯入，0.3.5 與 0.4.0 都能用；0.4.0 另外提供 `@google/stitch-sdk/tools`，並把主套件的這個匯出標為 deprecated。

```ts
import { toolDefinitions } from "@google/stitch-sdk";

for (const tool of toolDefinitions) {
  console.log(tool.name, Object.keys(tool.inputSchema.properties));
}
```

### 回應沒有固定結構

`callTool` 回傳 MCP 伺服器的原始 JSON，資料結構依工具而異。代理應該在執行時檢查回應內容，不要假設固定的結構。

| 層級 | 回應 |
| --- | --- |
| Domain API（`project.generate()`、`screen.edit()`） | 解析成有型別的物件 |
| `callTool` | 原始 JSON，由代理自己解讀 |

## 混用 domain API 與工具 API

`stitch` 單例在同一個物件上提供兩層 API。可以先用 `callTool` 建立，再換成 domain API 處理其他事：

```ts
// Create via callTool (agent-style)
const raw = await stitch.callTool("create_project", { title: "Hybrid Flow" });

// Switch to domain API (human-style)
const project = stitch.project(raw.name);
const screen = await project.generate("A settings page for a Taiwan rail pass app, with seat preference and trip reminder options");
const html = await screen.getHtml();
```

這段提示詞要 Stitch 做一個台灣鐵路通行證 App 的設定頁，有座位偏好和行程提醒選項。

這就是 **identity map** 模式：`stitch.project(id)` 用任何專案 ID 或資源名稱建立 `Project` handle，不呼叫 API。用它把工具的原始結果接回可串接的 domain API。

## 自建用戶端

需要 OAuth 憑證，或要連到另一個 Stitch 環境時，直接建立 `StitchToolClient`：

```ts
import { StitchToolClient } from "@google/stitch-sdk";

const client = new StitchToolClient({
  accessToken: process.env.STITCH_ACCESS_TOKEN,
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
});

await client.connect();
const tools = await client.listTools();
console.log(`${tools.tools.length} tools available`);

await client.close();
```

## 選哪一種

| 做法 | 適合 |
| --- | --- |
| Domain API（`stitch.projects()` → `project.generate()` → `screen.getHtml()`） | 人寫的腳本、教學、單純的流程 |
| `callTool` | AI 代理、自動化、domain 層沒有的工具、執行時才決定用哪個工具 |
| `stitchTools()` | 整合 Vercel AI SDK，見[搭配 Vercel AI SDK](/sdk/ai-sdk/) |
| 自建 `StitchToolClient` | OAuth、多租戶，或不是預設伺服器的環境 |

## 和已發布套件的差異

| 項目 | Stitch 文件 | 0.3.5（latest） | 0.4.0（next） |
| --- | --- | --- | --- |
| `toolDefinitions` 的匯入路徑 | `@google/stitch-sdk/tool-definitions` | 沒有這個子路徑（`package.json` 的 `exports` 只有 `.`、`./ai`、`./adk`）；從 `@google/stitch-sdk` 匯出（`index.d.ts` 第 14 行） | 沒有這個子路徑；從 `@google/stitch-sdk/tools` 匯出（`tools.d.ts` 第 9 行），主套件的匯出標為 deprecated（`index.d.ts` 第 15–16 行） |
| `project.generate()` 回傳 | `Screen` | `Promise<Screen>` | `Promise<Generation<Screen, GenerateScreenFromTextResponse>>`，可當 `Screen` 用 |
