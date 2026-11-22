---
title: CLI 內建 MCP 工具參考
description: Stitch CLI 內建 MCP 伺服器的 7 個工具：用途、參數與回傳內容。
appliesTo: Stitch CLI（2026-11-20）
caveat: 這裡是 CLI 內建 MCP 伺服器（stitch mcp start）的 7 個工具，和遠端 Stitch MCP 服務的工具清單不同。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：MCP Tools
    url: https://stitch.google.com/docs/cli/reference/mcp-tools/
  - title: Stitch Docs：Agent Skills & MCP
    url: https://stitch.google.com/docs/cli/mcp-and-skills/
---

## 這是哪一個伺服器

這些工具來自 Stitch CLI 本身內建的 MCP 伺服器，由 `stitch mcp start` 在本機透過 stdio 啟動，或由 `stitch mcp install` 註冊到 AI 編輯器。遠端 Stitch MCP 服務是另一個伺服器，工具清單不同，見 [MCP 參考](/mcp/reference/)。

自行設定 MCP 用戶端時，把它指向 `stitch mcp start`：

```json
{
  "mcpServers": {
    "stitch": {
      "command": "stitch",
      "args": ["mcp", "start"]
    }
  }
}
```

安裝與各編輯器的設定方式見 [Agent Skills 與 MCP](/cli/mcp-and-skills/)。

## 工具總覽

7 個工具的名稱與用法都對應 CLI 的動詞指令。「註記」是工具帶的 annotation：會修改資料的四個標為 `destructive`，唯讀的三個標為 `readOnly`。

| 工具 | 對應 CLI 指令 | 唯讀 | 註記 | 用途 | 回傳 |
| --- | --- | --- | --- | --- | --- |
| `stitch_create` | `stitch create` | `false` | `destructive` | 建立一個資源 | `{ resource, item, created }` |
| `stitch_delete` | `stitch delete` | `false` | `destructive` | 依 ID 刪除一個資源 | `{ resource, id, deleted }` |
| `stitch_edit` | `stitch edit` | `false` | `destructive` | 局部更新一個資源 | `{ resource, item, updateMask }` |
| `stitch_find` | `stitch find` | `true` | `readOnly` | 列出某種資源 | `{ resource, items, returnedCount, isTruncated, nextPageToken }` |
| `stitch_generate` | `stitch generate` | `false` | `destructive` | 啟動後端生成工作 | `{ resource, workspace, started, complete }` |
| `stitch_get` | `stitch get` | `true` | `readOnly` | 依 ID 取得一個資源 | `{ resource, item, availableActions? }` |
| `stitch_url` | `stitch url` | `true` | `readOnly` | 產生專案或畫面的標準畫布網址 | `{ resource, id, url, verified: false }` |

## 共通參數

多數工具都有以下選填參數：

| 參數 | 型別 | 用途 |
| --- | --- | --- |
| `workspace` | `string` | 覆寫 Workspace ID。沒有設定預設 Workspace 時，Workspace 範圍的資源必須提供 |
| `project` | `string` | Stitch 專案 ID。專案範圍的資源必須提供 |
| `dryRun` | `boolean` | 驗證並預覽請求，不實際送出（`stitch_find`、`stitch_get`、`stitch_url` 沒有這個參數） |

`stitch_delete` 與 `stitch_generate` 另外接受 `dry-run`，作用和 `dryRun` 相同。

## stitch_create

建立一個資源，對應 `stitch create <resource>`。加上 `dryRun` 時回傳完整的請求預覽。

| 參數 | 型別 | 必填 | 用途 |
| --- | --- | --- | --- |
| `resource` | `string` | 是 | 要建立的資源類型 |
| `body` | `object` | 是 | 資源內容（各資源的必填欄位見下表） |
| `workspace` | `string` | 否 | 覆寫 Workspace ID |
| `project` | `string` | 否 | Stitch 專案 ID |
| `dryRun` | `boolean` | 否 | 預覽請求，不送出 |

`resource` 可用的值：`project`、`screen`、`design-system`、`workspace`、`context`、`skill`、`loop`、`webhook`、`connection`、`priority`、`priorities`。

| 資源 | `body` 必填欄位 |
| --- | --- |
| `project` | `{}` |
| `screen` | `{prompt}` |
| `design-system` | `{designSystem={displayName, theme={bodyFont, colorMode, customColor, headlineFont, roundness}}}` |
| `workspace` | `{displayName}` |
| `context` | `{data, description}` |
| `skill` | `{content, id}` |
| `loop` | `{objective}` |
| `webhook` | `{eventTypes, url}` |
| `connection` | `{providerId}` |

## stitch_delete

依 ID 刪除一個資源，對應 `stitch delete <resource> <id>`。

| 參數 | 型別 | 必填 | 用途 |
| --- | --- | --- | --- |
| `resource` | `string` | 是 | 要刪除的資源類型 |
| `id` | `string` | 是 | 要刪除的資源 ID |
| `workspace` | `string` | 否 | 覆寫 Workspace ID |
| `project` | `string` | 否 | Stitch 畫布專案 ID |
| `dryRun`、`dry-run` | `boolean` | 否 | 預覽會刪除什麼，不發出任何 HTTP 請求 |
| `confirm` | `boolean` | 否 | 刪除會連帶刪除或具破壞性的資源（workspace、project、context）時必須設為 `true` |

`resource` 可用的值：`projects`、`project`、`workspaces`、`workspace`、`contexts`、`context`、`loops`、`loop`、`priority`、`priorities`、`webhooks`、`webhook`。這個工具不能刪除 `file`、`skill` 或 `connection`，這三種要用 CLI 的 `stitch delete`。

## stitch_edit

局部更新一個資源，對應 `stitch edit <resource> <id>`。

- 一般情況回傳 `{ resource, item, updateMask }`。
- 畫布以非同步方式套用的修改（設計系統）回傳 `{ resource, id, status: 'pending', session, requested, message }`，呼叫端應稍後重新讀取該資源。
- 加上 `dryRun` 時回傳完整的請求預覽。

| 參數 | 型別 | 必填 | 用途 |
| --- | --- | --- | --- |
| `resource` | `string` | 是 | 要修改的資源類型 |
| `id` | `string` | 是 | 要修改的資源 ID。畫面也接受 `projects/<p>/screens/<s>` 或 Stitch 畫布網址，並使用其中的專案 |
| `patch` | `object` | 是 | 要更新的欄位（可修改的欄位見下表） |
| `updateMask` | `string` | 否 | 以逗號分隔的欄位路徑；省略時由 `patch` 的鍵推導 |
| `workspace` | `string` | 否 | 覆寫 Workspace ID |
| `project` | `string` | 否 | Stitch 專案 ID |
| `dryRun` | `boolean` | 否 | 預覽請求，不修改資源 |

`resource` 可用的值：`screen`、`design-system`、`workspace`、`context`、`file`、`skill`、`loop`、`webhook`、`priority`、`priorities`。

| 資源 | `patch` 可修改的欄位 |
| --- | --- |
| `screen` | `deviceType`、`modelId`、`prompt`、`designSystem` |
| `design-system` | `designSystem` 下的 `displayName` 與 `theme`；`theme` 可含 `bodyFont`、`colorMode`、`colorVariant`、`customColor`、`designMd`、`headlineFont`、`labelFont`、`overrideNeutralColor`、`overridePrimaryColor`、`overrideSecondaryColor`、`overrideTertiaryColor`、`roundness`、`spacing`、`typography` |
| `workspace` | `description`、`displayName`、`priorityGroups`、`repositories` |
| `context` | `annotations`、`data`、`dataSource`、`description`、`expireTime`、`schema` |
| `file` | `content`、`path` |
| `skill` | `content`、`description` |
| `loop` | `autonomyLevel`、`description`、`groupId` |
| `webhook` | `displayName`、`eventTypes`、`secret`、`sslVerificationEnabled`、`state` |

## stitch_find

列出某種資源，對應 `stitch find <resource>`。要看某一筆的完整內容，再用 `stitch_get` 查詢它的 ID。

| 參數 | 型別 | 必填 | 用途 |
| --- | --- | --- | --- |
| `resource` | `string` | 是 | 要列出的資源類型 |
| `criteria` | `object` | 否 | 依資源而定的篩選條件，例如 projects=`{title}`、screens=`{title, deviceType}`、design-systems=`{displayName}`，或 `{id, state}` |
| `workspace` | `string` | 否 | 覆寫 Workspace ID |
| `project` | `string` | 否 | Stitch 畫布專案 ID |
| `limit` | `integer` | 否 | 最多回傳幾筆，預設 50 |
| `pageSize` | `integer` | 否 | 每頁向 API 要求的筆數，預設等於 `limit` |
| `pageToken` | `string` | 否 | 從上次結果的 `nextPageToken` 繼續。畫布資源不支援 |
| `filter` | `string` | 否 | AIP-160 篩選運算式 |
| `include` | `array` | 否 | 要一併帶入每筆項目的相關集合 |

`resource` 可用的值（單複數都可）：`projects`、`project`、`screens`、`screen`、`design-systems`、`design-system`、`workspaces`、`workspace`、`contexts`、`context`、`files`、`file`、`skills`、`skill`、`loops`、`loop`、`priority`、`priorities`、`webhooks`、`webhook`、`insights`、`insight`、`solutions`、`solution`、`connections`、`connection`、`toolProvider`、`toolProviders`、`tool-provider`、`tool-providers`、`organizations`、`organization`。

## stitch_generate

啟動一個後端生成工作（畫面、變化版本、insight、solution），對應 `stitch generate <resource>`。生成是非同步的，所以回傳的 `complete` 一定是 `false`；之後用 `stitch_find` 查詢結果。

`resource` 可用的值：`screens`、`screen`、`variants`、`variant`、`insights`、`insight`、`solutions`、`solution`。

### 畫面與變化版本用的參數

| 參數 | 型別 | 用途 |
| --- | --- | --- |
| `project` | `string` | Stitch 畫布專案 ID。產生畫面與變化版本時必填，除非設了 `newProject` |
| `newProject` | `object` | 為生成的畫面建立新的畫布專案（說明寫可傳布林值或專案標題） |
| `title` | `string` | 選填的畫面或專案標題（產生畫面時） |
| `prompt` | `string` | 產生畫面或變化版本的提示詞 |
| `device`，別名 `deviceType` | `string` | 裝置類型：`MOBILE`、`DESKTOP`、`TABLET` 或 `AGNOSTIC` |
| `model`，別名 `modelId` | `string` | 模型 ID：`GEMINI_3_8_FLASH` 或 `GEMINI_3_5_FLASH_LITE` |
| `screen`，別名 `selectedScreenIds` | `object` ／ `array` | 產生變化版本的來源畫面 ID，一個或多個 |
| `count`，別名 `variantCount` | `integer` | 變化版本數量（1-5） |
| `creativeRange` | `string` | 變化幅度：`REFINE`、`EXPLORE` 或 `REIMAGINE` |
| `aspects` | `array` | 要變化的面向，例如 `LAYOUT`、`COLOR_SCHEME`、`TEXT_FONT` |
| `variantOptions` | `object` | 巢狀寫法：`{ variantCount, creativeRange, aspects }` |

### insight 與 solution 用的參數

| 參數 | 型別 | 用途 |
| --- | --- | --- |
| `priorities` | `array` | 限定生成範圍的 loop ID（只用於 `insights`；省略時涵蓋整個 Workspace） |
| `delayExecution` | `boolean` | 改排程執行，不立即開始（只用於 `insights`） |
| `insights` | `array` | 要產生 solution 的 insight ID（`solutions` 時必填，也只用於 `solutions`） |
| `replaceExisting` | `boolean` | 取代既有未指派的 solution，而不是附加（只用於 `solutions`） |

兩類都適用的參數：

- `workspace`：覆寫 Workspace ID。沒有設定預設 Workspace 時必填。
- `dryRun`、`dry-run`：驗證引數並預覽範圍，不啟動生成工作。

### 範例

在既有專案產生一個手機畫面時，傳給 `stitch_generate` 的引數：

```json
{
  "resource": "screen",
  "project": "<project-id>",
  "prompt": "Weekend farmers market map with stall categories and opening hours",
  "device": "MOBILE",
  "model": "GEMINI_3_8_FLASH"
}
```

提示詞要求一張標出攤位分類與營業時間的週末農夫市集地圖。

從一個畫面產生三個變化版本：

```json
{
  "resource": "variants",
  "project": "<project-id>",
  "selectedScreenIds": ["<screen-id>"],
  "count": 3,
  "creativeRange": "EXPLORE",
  "aspects": ["LAYOUT", "COLOR_SCHEME"]
}
```

## stitch_get

依 ID 取得一個資源，對應 `stitch get <resource> <id>`。回傳若有 `availableActions`，下一步就用其中列出的工具。

| 參數 | 型別 | 必填 | 用途 |
| --- | --- | --- | --- |
| `resource` | `string` | 是 | 要取得的資源類型 |
| `id` | `string` | 否 | 資源 ID。除了 `status` 以外都必填；`status` 必須省略 `id` |
| `workspace` | `string` | 否 | 覆寫 Workspace ID |
| `project` | `string` | 否 | Stitch 畫布專案 ID |

`resource` 可用的值和 `stitch_find` 相同，另外多一個 `status`。

## stitch_url

產生專案或畫面的標準畫布網址，完全不發出網路請求，所以回傳的 `verified` 是 `false`。對應 `stitch url <resource> <id>`。需要 Stitch 連結時用它，不要自己猜 `stitch.google.com` 的網址。

| 參數 | 型別 | 必填 | 用途 |
| --- | --- | --- | --- |
| `resource` | `string` | 是 | `project` 或 `screen` |
| `id` | `string` | 是 | 專案或畫面 ID，可以是單純 ID 或 `projects/<p>/screens/<s>` 形式的完整名稱 |
| `project` | `string` | 否 | 擁有該畫面的專案 ID。`resource` 是 `screen` 且 `id` 不是完整名稱時必填 |

## 在 CLI 查看 schema

每個工具都有對應的 CLI 指令可以印出 schema：

```shell
stitch create --schema
stitch delete --schema
stitch edit --schema
stitch find --schema
stitch generate --schema
stitch get --schema
stitch url --schema
```

各工具完整的 JSON 輸入 schema 見 Stitch 文件的 [MCP Tools](https://stitch.google.com/docs/cli/reference/mcp-tools/)。
