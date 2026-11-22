---
title: SDK 參考
description: Stitch SDK 的類別、方法、設定欄位、錯誤、列舉與環境變數一覽。
appliesTo: Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）
caveat: Stitch 文件沒寫 SDK 版本；對照 npm 的 0.3.5（latest）與 0.4.0（next），部分方法、選項名稱與回傳型別不同，見文末差異表。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Reference（SDK）
    url: https://stitch.google.com/docs/sdk/reference/
  - title: "@google/stitch-sdk 0.3.5：README"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/README.md
  - title: "@google/stitch-sdk 0.4.0：README"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/README.md
  - title: "@google/stitch-sdk 0.3.5：package.json"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/package.json
  - title: "@google/stitch-sdk 0.4.0：package.json"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/package.json
  - title: "@google/stitch-sdk 0.3.5：dist/src/index.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/src/index.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/index.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/index.d.ts
  - title: "@google/stitch-sdk 0.3.5：dist/generated/src/project.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/generated/src/project.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/generated/src/project.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/generated/src/project.d.ts
  - title: "@google/stitch-sdk 0.3.5：dist/generated/src/screen.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/generated/src/screen.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/generated/src/screen.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/generated/src/screen.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/screen-ext.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/screen-ext.d.ts
  - title: "@google/stitch-sdk 0.3.5：dist/src/project-ext.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/src/project-ext.d.ts
  - title: "@google/stitch-sdk 0.3.5：dist/generated/src/types.generated.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/generated/src/types.generated.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/generated/src/types.generated.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/generated/src/types.generated.d.ts
  - title: "@google/stitch-sdk 0.3.5：dist/src/spec/client.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/src/spec/client.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/spec/client.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/spec/client.d.ts
  - title: "@google/stitch-sdk 0.3.5：dist/src/client.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/src/client.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/client.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/client.d.ts
  - title: "@google/stitch-sdk 0.3.5：dist/src/spec/errors.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/src/spec/errors.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/spec/errors.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/spec/errors.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/generation.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/generation.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/tools-adapter.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/tools-adapter.d.ts
---

## 安裝與匯出

```shell
npm install @google/stitch-sdk
```

Stitch 文件沒有寫它對應哪一版 SDK。npm 上有兩版：`0.3.5`（`latest`，2026-05-12 發布，預設安裝這版）與 `0.4.0`（`next`，2026-10-01 發布，用 `npm install @google/stitch-sdk@next` 安裝）。已發布套件和 Stitch 文件不同的地方在表格裡註明，完整列在「和已發布套件的差異」。

主套件 `@google/stitch-sdk` 的匯出：

```ts
import {
  stitch,           // Default singleton instance
  Stitch,           // Domain class: project management
  Project,          // Domain class: screen management within a project
  Screen,           // Domain class: screen operations
  StitchToolClient, // Low-level MCP client
  StitchProxy,      // Local proxy server
  StitchError,      // Error class
  StitchErrorCode,  // Error code enum
} from "@google/stitch-sdk";
```

| 匯出 | 角色 |
| --- | --- |
| `stitch` | 預設的單例 |
| `Stitch` | Domain 類別：管理專案 |
| `Project` | Domain 類別：管理專案裡的畫面 |
| `Screen` | Domain 類別：畫面操作 |
| `StitchToolClient` | 低階 MCP 用戶端 |
| `StitchProxy` | 本機 proxy 伺服器 |
| `StitchError` | 錯誤類別 |
| `StitchErrorCode` | 錯誤碼列舉 |

AI SDK 轉接器在獨立的子路徑：

```ts
import { stitchTools } from "@google/stitch-sdk/ai";
```

Stitch 文件的匯出清單沒有 `DesignSystem`；兩版套件都有匯出它，也匯出更多名稱，見文末。

## `stitch`（單例）

預設入口。它是延遲初始化的 `Proxy`，同時提供 `Stitch` 的 domain 方法和 `StitchToolClient` 的基礎方法。第一次存取時，從環境變數讀取 `STITCH_API_KEY` 與 `STITCH_HOST`（0.4.0 改為第一次呼叫方法時才初始化）。

```ts
import { stitch } from "@google/stitch-sdk";
```

### Domain 方法

| 方法 | 回傳 | 作用 |
| --- | --- | --- |
| `createProject(title)` | `Promise<Project>` | 建立新專案 |
| `projects()` | `Promise<Project[]>` | 列出已驗證使用者能存取的所有專案 |
| `project(id)` | `Project` | 用現有的專案 ID 或資源名稱建立 `Project` handle，不呼叫 API |

### 基礎方法

| 方法 | 回傳 | 作用 |
| --- | --- | --- |
| `listTools()` | `Promise<{ tools: ToolDefinition[] }>` | 列出所有可用的 MCP 工具 |
| `callTool<T>(name, params)` | `Promise<T>` | 用名稱呼叫 MCP 工具 |
| `close()` | `Promise<void>` | 關閉底層 MCP 用戶端的連線 |

## `Stitch`

主要入口類別，管理專案。

```ts
import { Stitch, StitchToolClient } from "@google/stitch-sdk";

const client = new StitchToolClient({ apiKey: "..." });
const s = new Stitch(client);
```

### 建構子

| 參數 | 型別 | 內容 |
| --- | --- | --- |
| `client` | `StitchToolClient` | 已初始化的工具用戶端 |

### 方法

| 方法 | 回傳 | 作用 | 對應的 MCP 工具 |
| --- | --- | --- | --- |
| `createProject(title)` | `Promise<Project>` | 建立新專案 | `create_project` |
| `projects()` | `Promise<Project[]>` | 列出所有專案 | `list_projects` |
| `project(id)` | `Project` | 建立 `Project` handle，不呼叫 API；接受專案 ID 或完整資源名稱（`projects/{id}`） | — |

## `Project`

一個 Stitch 專案，內含畫面。

### 屬性

| 屬性 | 型別 | 內容 |
| --- | --- | --- |
| `projectId` | `string` | 專案 ID，不含 `projects/` 前綴 |
| `id` | `string` | `projectId` 的別名 |
| `data` | `any` | 從伺服器回應建立時的原始 API 回應資料；從 ID 字串建立時是 `undefined` |

### 方法

| 方法 | 參數 | 回傳 | 作用 |
| --- | --- | --- | --- |
| `generate(prompt, deviceType?, modelId?)` | `prompt: string`、`deviceType?: DeviceType`、`modelId?: ModelId` | `Promise<Screen>` | 用文字提示詞產生新畫面，對應 `generate_screen_from_text` |
| `screens()` | — | `Promise<Screen[]>` | 列出專案裡的所有畫面，對應 `list_screens` |
| `getScreen(screenId)` | `screenId: string` | `Promise<Screen>` | 用 ID 取得一個畫面，對應 `get_screen` |
| `upload(filePath, opts?)` | `filePath: string`、`opts?: { title?: string, createScreenInstances?: boolean }` | 兩版套件：`Promise<Screen[]>`（Stitch 文件寫 `Promise<UploadResult>`） | 上傳檔案（`.png`、`.jpg`、`.jpeg`、`.webp`、`.html`、`.htm`）並建立畫面；直接送到 REST API。Stitch 文件說它從不丟出例外，套件的宣告沒有這樣寫，見[上傳檔案](/sdk/upload-image/) |
| `createDesignSystem(ds)` | `ds: { displayName: string }` | `Promise<DesignSystem>` | 為這個專案建立設計系統 |
| `listDesignSystems()` | — | `Promise<DesignSystem[]>` | 列出專案裡的所有設計系統 |
| `designSystem(id)` | `id: string` | `DesignSystem` | 用 asset ID 建立 `DesignSystem` handle，不呼叫 API |
| `uploadDesignMd(designMdBase64)`（只有 0.4.0） | `designMdBase64: string` | `Promise<any>` | 上傳 base64 編碼的 `DESIGN.md`，回傳畫面實例，對應 `upload_design_md` |
| `createDesignSystemFromDesignMd(selectedScreenInstance, deviceType?)`（只有 0.4.0） | `selectedScreenInstance: SelectedScreenInstance`、`deviceType?: DeviceType` | `Promise<DesignSystem>` | 從已上傳的 `DESIGN.md` 建立設計系統，對應 `create_design_system_from_design_md` |

## `DesignSystem`

定義專案視覺 token 的設計系統 asset。

### 屬性

| 屬性 | 型別 | 內容 |
| --- | --- | --- |
| `id` | `string` | asset ID |
| `data` | `any` | 原始 API 回應資料；從 ID 字串建立時是 `undefined` |

### 方法

| 方法 | 參數 | 回傳 | 作用 |
| --- | --- | --- | --- |
| `update(ds)` | `ds: { displayName?: string }` | `Promise<DesignSystem>` | 更新設計系統的中繼資料 |
| `apply(selectedScreenInstances)` | `{ id: string, sourceScreen: string }[]` | `Promise<Screen[]>` | 把設計系統套用到指定畫面；只傳 `id` 與 `sourceScreen`，多帶欄位會出錯 |

## `Screen`

一個產生出來的 UI 畫面，可取得 HTML 程式碼與截圖。

### 屬性

| 屬性 | 型別 | 內容 |
| --- | --- | --- |
| `projectId` | `string` | 所屬專案的 ID |
| `screenId` | `string` | 畫面 ID |
| `id` | `string` | `screenId` 的別名 |
| `data` | `any` | 原始 API 回應資料 |

### 方法

| 方法 | 參數 | 回傳 | 作用 |
| --- | --- | --- | --- |
| `edit(prompt, deviceType?, modelId?)` | `prompt: string`、`deviceType?: DeviceType`、`modelId?: ModelId` | `Promise<Screen>` | 用文字提示詞修改畫面；回傳**新的** `Screen`，原畫面不變；對應 `edit_screens` |
| `variants(prompt, variantOptions, deviceType?, modelId?)` | `prompt: string`、`variantOptions: VariantOptions`、`deviceType?: DeviceType`、`modelId?: ModelId` | `Promise<Screen[]>` | 產生變化版本，對應 `generate_variants`；`VariantOptions` 見下 |
| `getHtml()` | — | `Promise<string>` | 回傳 HTML 的下載網址；有快取的網址時直接使用 |
| `getImage()` | — | `Promise<string>` | 回傳截圖的下載網址；有快取的網址時直接使用 |

## `StitchToolClient`

低階 MCP 用戶端，透過 HTTP 連到 Stitch 伺服器。

```ts
import { StitchToolClient } from "@google/stitch-sdk";
```

### 建構子

| 參數 | 型別 | 內容 |
| --- | --- | --- |
| `config` | `StitchConfigInput` | 連線設定 |

### `StitchConfigInput`

| 欄位 | 型別 | 必填 | 內容 |
| --- | --- | --- | --- |
| `apiKey` | `string` | `apiKey` 與 `accessToken` 擇一 | 驗證用的 API Key |
| `accessToken` | `string` | `apiKey` 與 `accessToken` 擇一 | OAuth 存取權杖 |
| `projectId` | `string` | 使用 `accessToken` 時必填 | Google Cloud 專案 ID（OAuth 用） |
| `baseUrl` | `string` | 否 | 改用其他伺服器網址，預設 `https://stitch.googleapis.com/mcp` |

### 方法

| 方法 | 回傳 | 作用 |
| --- | --- | --- |
| `connect()` | `Promise<void>` | 明確連到 MCP 伺服器；第一次呼叫工具時會自動連線 |
| `callTool<T>(name, params)` | `Promise<T>` | 用指定參數呼叫指定名稱的 MCP 工具 |
| `listTools()` | `Promise<{ tools: ToolDefinition[] }>` | 列出伺服器上所有可用的工具 |
| `close()` | `Promise<void>` | 關閉連線 |

## `stitchTools(options?)`

AI SDK 轉接器，回傳 Vercel AI SDK 格式的 Stitch 工具。從子路徑 `/ai` 匯入：

```ts
import { stitchTools } from "@google/stitch-sdk/ai";
```

| 參數欄位 | 型別 | 內容 |
| --- | --- | --- |
| `options.apiKey` | `string` | 取代環境變數 `STITCH_API_KEY` |
| `options.include` | `string[]` | 只包含列出的工具名稱 |

回傳 `Record<string, Tool>`，可直接放進 `generateText({ tools: stitchTools() })`。用法見[搭配 Vercel AI SDK](/sdk/ai-sdk/)。

## `StitchError`

所有 SDK 方法丟出的錯誤類別。Stitch 文件把 `Project` 的 `upload()` 列為例外（從不丟出），兩版套件的型別宣告沒有這個例外。

| 屬性 | 型別 | 內容 |
| --- | --- | --- |
| `message` | `string` | 可直接閱讀的錯誤訊息 |
| `code` | `StitchErrorCode` | 結構化的錯誤碼 |

| 靜態方法 | 作用 |
| --- | --- |
| `StitchError.fromUnknown(error)` | 把任何被丟出的值包成 `StitchError` |

## 列舉

| 型別 | 值 |
| --- | --- |
| `DeviceType` | `"DEVICE_TYPE_UNSPECIFIED"`、`"MOBILE"`、`"DESKTOP"`、`"TABLET"`、`"AGNOSTIC"` |
| `ModelId` | `"MODEL_ID_UNSPECIFIED"`、`"GEMINI_3_PRO"`、`"GEMINI_3_FLASH"`（已發布套件有更多值，見文末） |
| `CreativeRange` | `"CREATIVE_RANGE_UNSPECIFIED"`、`"REFINE"`、`"EXPLORE"`、`"REIMAGINE"` |
| `VariantAspect` | `"VARIANT_ASPECT_UNSPECIFIED"`、`"LAYOUT"`、`"COLOR_SCHEME"`、`"IMAGES"`、`"TEXT_FONT"`、`"TEXT_CONTENT"` |

### `VariantOptions`

這個型別在 Stitch 文件的參考頁沒有展開；欄位依兩版套件的 `types.generated.d.ts`：

| 欄位 | 型別 | 內容 |
| --- | --- | --- |
| `variantCount` | `number` | 產生幾個版本，1 到 5，預設 3（README）；Stitch 文件的教學頁寫成 `numVariants` |
| `creativeRange` | `CreativeRange` | 變動幅度 |
| `aspects` | `VariantAspect[]` | 要變化的面向 |

## 環境變數

| 變數 | 內容 |
| --- | --- |
| `STITCH_API_KEY` | 驗證用的 API Key，`stitch` 單例與 `stitchTools()` 會讀取 |
| `STITCH_HOST` | 改用其他 MCP 伺服器網址，預設 `https://stitch.googleapis.com/mcp`；0.4.0 把它列為 `STITCH_BASE_URL` 的 deprecated 別名 |
| `STITCH_ACCESS_TOKEN` | OAuth 存取權杖，可取代 API Key |
| `GOOGLE_CLOUD_PROJECT` | Google Cloud 專案 ID，使用 OAuth 時必填 |

## 和已發布套件的差異

| 項目 | Stitch 文件 | 0.3.5（latest） | 0.4.0（next） |
| --- | --- | --- | --- |
| SDK 版本 | 沒有寫 | — | — |
| 子路徑 | `/ai` | `.`、`./ai`、`./adk`（`package.json` 的 `exports`） | 另有 `./tools` |
| 主套件匯出 | 8 個名稱（見上） | 另有 `DesignSystem`、`toolDefinitions`、`toolMap`、`parseResourceName`、`repairToolSchemas`、`repairSchema`、`downloadAssetsTool`、`buildFifeSuffix`、`StitchProxyConfigSchema` 與多個型別（`index.d.ts`） | 另有 `DesignSystem`、`Generation`、`resetStitchSingleton`、`parseResourceName`、`repairToolSchemas`、`repairSchema`、`collectDefPool`、`downloadAssetsTool`；`toolDefinitions`、`toolMap` 標為 deprecated，改從 `./tools` 匯入（`index.d.ts`） |
| `createProject()` | `createProject(title)` | `createProject(title?: string)` | `createProject(titleOrOptions?: string \| { title?: string })` |
| `generate()`、`edit()` 回傳 | `Promise<Screen>` | `Promise<Screen>` | `Promise<Generation<Screen, …Response>>`，可當 `Screen` 用，有 `.first`、`.screens`、`.raw`（`generation.d.ts`） |
| `variants()`、`apply()` 回傳 | `Promise<Screen[]>` | `Promise<Screen[]>` | `Promise<Generation<Screen, …Response>>`，可走訪，有 `.length` |
| `deviceType` 參數 | 位置參數 | 位置參數 | 位置參數，或物件 `{ deviceType?, modelId? }` |
| `upload()` 回傳 | `Promise<UploadResult>` | `Promise<Screen[]>`（`project-ext.d.ts` 第 24 行） | 同 0.3.5 |
| `uploadDesignMd()`、`createDesignSystemFromDesignMd()` | 有 | 沒有 | 有；`uploadDesignMd()` 回傳 `Promise<UploadDesignMdResponse>` |
| `createDesignSystem()`、`update()` 的參數 | `{ displayName: string }`、`{ displayName?: string }` | `DesignSystemInput`：`displayName?`、`designTokens?`、`styleGuidelines?`、`theme?` | 同 0.3.5 |
| 文件沒列的方法 | — | `project.screen(id)`、`project.downloadAssets(outputDir, opts?)` | 同 0.3.5，另有 `screen.getHtmlUrl()`、`getImageUrl()`、`readHtml()`、`readImage()` |
| `getHtml()`、`getImage()` | 回傳下載網址 | 回傳下載網址 | 仍回傳下載網址，標為 deprecated（`screen-ext.d.ts` 第 4–8 行） |
| `DesignSystem` 屬性 | `id`、`data` | 另有 `projectId`、`assetId`（`id` 是 `assetId` 的別名） | 同 0.3.5，另有 `title` |
| 數量選項 | `numVariants`（教學頁） | `variantCount` | `variantCount` |
| `ModelId` 的值 | 3 個 | 另有 `GEMINI_3_1_PRO` | 另有 `GEMINI_3_8_FLASH`、`GEMINI_3_5_FLASH_LITE`、`GEMINI_3_1_PRO` |
| `StitchConfigInput` | `apiKey`、`accessToken`、`projectId`、`baseUrl` | 另有 `timeout`（README：預設 `300000` 毫秒） | 另有 `timeout`、`entityCache`、`retry` |
| `listTools()` 回傳 | `Promise<{ tools: ToolDefinition[] }>` | `Promise<{ tools: any[] }>` | 回傳各工具的 `name`、`description`、`inputSchema` 等欄位 |
| `close()` 之後 | 沒有說明 | 型別宣告沒有說明 | 不能再用，之後的呼叫丟出 `CLIENT_CLOSED`（`client.d.ts`） |
| `stitchTools({ include })` 有不存在的名稱 | 沒有說明 | 型別宣告沒有說明 | 丟出錯誤（`tools-adapter.d.ts` 第 26 行） |
| `StitchError` 屬性 | `message`、`code` | 另有 `suggestion?`、`recoverable` | 另有 `status?`、`toolName?`、`retryAfter?`、`clarification?` |
| `StitchErrorCode` 的值 | 沒有列 | `AUTH_FAILED`、`UNKNOWN_ERROR`、`NOT_FOUND`、`PERMISSION_DENIED`、`RATE_LIMITED`、`NETWORK_ERROR`、`VALIDATION_ERROR` | 另有 `SERVICE_UNAVAILABLE`、`CLIENT_CLOSED`、`CLARIFICATION_REQUIRED` |
| 環境變數 | `STITCH_HOST` | `STITCH_HOST` | `STITCH_BASE_URL`（`STITCH_HOST` 為 deprecated 別名）；專案 ID 也讀 `STITCH_PROJECT_ID`（`client.d.ts` 第 12–16 行） |
