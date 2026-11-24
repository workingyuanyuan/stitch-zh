---
title: SDK 架構
description: Stitch SDK 是建在 MCP 之上、自動產生的 domain 層，分成三層。
appliesTo: Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）
caveat: SDK 不是手寫的 REST 用戶端，而是透過 HTTP 連到 Stitch 的 MCP 伺服器；上傳檔案的 upload 例外，直接送到 REST API。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Architecture
    url: https://stitch.google.com/docs/sdk/architecture/
  - title: Stitch Docs：How to upload files
    url: https://stitch.google.com/docs/sdk/upload-image/
  - title: "@google/stitch-sdk 0.3.5：dist/src/project-ext.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/src/project-ext.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/screen-ext.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/screen-ext.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/generated/src/project.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/generated/src/project.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/src/singleton.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/src/singleton.d.ts
---

## 為什麼用 MCP，不用 REST

Stitch 本來就有一個讓 AI 代理直接連線的 MCP 伺服器。SDK 不另外維護一套 REST API，而是透過 HTTP 連到同一個 MCP 伺服器，每個工具只有一個資料來源。

| 好處 | 說明 |
| --- | --- |
| 只有一套 API | SDK 能用的工具和 AI 代理用的工具完全相同，不會不一致 |
| 更新即時 | MCP 伺服器推出新工具時，SDK 的產生器會自動納入 |
| 和代理相容 | 不論在 SDK 腳本還是 AI 代理裡，`callTool` 的語意都一樣 |

上傳檔案的 `project.upload()` 是例外：它從硬碟讀檔後直接送到 Stitch REST API，見[上傳檔案](/sdk/upload-image/)。

## 三層架構

```
┌─────────────────────────────────┐
│     stitch (singleton proxy)     │  ← What you import
├─────────────────────────────────┤
│  Stitch / Project / Screen       │  ← Generated domain classes
├─────────────────────────────────┤
│       StitchToolClient           │  ← MCP-over-HTTP transport
└─────────────────────────────────┘
```

| 層 | 名稱 | 角色 |
| --- | --- | --- |
| 1（底層） | `StitchToolClient` | 傳輸：透過 HTTP 連到 MCP 伺服器 |
| 2 | `Stitch`、`Project`、`Screen` | Domain：自動產生的類別 |
| 3（頂層） | `stitch` 單例 | 便利：可直接匯入使用的 SDK 入口 |

### 第 1 層：StitchToolClient（傳輸）

整個 SDK 的基礎。它透過 HTTP 連到 Stitch MCP 伺服器，處理驗證（API Key 或 OAuth），並提供 `callTool(name, params)`，可以呼叫任何 MCP 工具。需要完整控制時，可以直接使用這一層。

### 第 2 層：自動產生的 domain 類別

`Stitch`、`Project`、`Screen` 由兩個檔案**自動產生**：

| 檔案 | 內容 |
| --- | --- |
| `tools-manifest.json` | 每個 MCP 工具的名稱、說明與輸入 schema 的快照 |
| `domain-map.json` | 人工撰寫的對應表，把工具分配到 domain 類別與方法 |

產生腳本讀這兩個檔案，在 `generated/src/` 輸出 TypeScript 類別。每個方法都只是 `callTool` 的簡單封裝，負責對應參數和解析回應。

產生過程用內容雜湊鎖定：只有 manifest 或 domain map 真的改變時，重新產生才會有差異，避免無謂的變動。

### 第 3 層：stitch 單例（便利）

一個 `Proxy` 物件。它從環境變數延遲初始化 `StitchToolClient`，再依方法名稱把呼叫轉給 `Stitch` domain 類別或 `StitchToolClient`。

| 你寫的 | 轉給 |
| --- | --- |
| `stitch.projects()` | `Stitch.projects()` |
| `stitch.callTool(...)` | `StitchToolClient.callTool()` |

## Identity map：不呼叫 API 的 handle

`stitch.project(id)` 和 `new Project(client, id)` 只建立 **handle**，不呼叫 API。它們解析 ID（去掉 `projects/` 前綴），回傳一個 `Project` 物件，可以馬上呼叫 `.generate()`、`.screens()` 或 `.getScreen()`。

前一個步驟已經拿到專案 ID 時，不必再向伺服器取一次。

## AI SDK 轉接器

`stitchTools()`（從 `@google/stitch-sdk/ai` 匯入）把 SDK 接到 Vercel AI SDK。它讀同一份 `tools-manifest.json`，產生和 `generateText()`、`streamText()` 相容的 `Record<string, Tool>`。

轉接器對 `ai` 套件**沒有執行期相依**。它用 `Symbol.for("vercel.ai.schema")` 重建工具 schema 的格式，符合 AI SDK 的內部協定，但不匯入 AI SDK 的任何程式碼。只用 domain API 的人，用到的 SDK 因此保持輕量。

## 錯誤處理

所有 domain 方法都在內部捕捉錯誤，再以帶結構化錯誤碼的 `StitchError` 拋出，所以只要捕捉一種錯誤型別：

```ts
import { StitchError } from "@google/stitch-sdk";

try {
  await screen.edit("...");
} catch (e) {
  if (e instanceof StitchError) {
    console.error(e.code, e.message);
  }
}
```

Stitch 文件另寫上傳檔案的 `project.upload()` 從不丟出、失敗時回傳結果物件；已發布套件的型別宣告則是回傳 [`Screen` 陣列](/sdk/upload-image/)。

## 和已發布套件的差異

| 項目 | Stitch 文件 | 0.3.5（latest） | 0.4.0（next） |
| --- | --- | --- | --- |
| 自動產生的類別 | `Stitch`、`Project`、`Screen` | 另有 `DesignSystem` 也是產生的；匯出的 `Project` 是手寫的延伸類別，加上 `upload()`、`downloadAssets()`，因為它們用的是沒有對應 MCP 工具的私有 REST 端點或檔案系統操作（`project-ext.d.ts` 第 1–11 行） | 同 0.3.5；`Screen` 也有手寫延伸，加上 `readHtml()`、`readImage()` 等（`screen-ext.d.ts`） |
| `new Project(client, id)` | 建立 handle 的方式之一 | 可用 | 建構子標為 deprecated，改用 `stitch.project(id)` 等工廠方法（`project.d.ts` 第 23 行） |
| `stitch` 單例初始化的時機 | 第一次存取時 | 第一次存取時（`singleton.d.ts` 第 10 行） | 第一次呼叫方法時，不是存取屬性時（`singleton.d.ts` 第 30 行） |
