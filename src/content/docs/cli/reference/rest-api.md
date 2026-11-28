---
title: REST API 參考
description: Stitch v2alpha REST API 管理 Workspace、loop、insight 與 solution。
appliesTo: Stitch CLI（2026-11-20）
caveat: 用 stitch api 呼叫這些端點前，要先在本機執行一次 stitch enable loop 開啟 Workspace 功能。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：REST API
    url: https://stitch.google.com/docs/cli/reference/rest-api/
  - title: Stitch Docs：CLI Commands
    url: https://stitch.google.com/docs/cli/reference/commands/
  - title: "@google/stitch 0.13.0：README"
    url: https://unpkg.com/@google/stitch@0.13.0/README.md
---

## 這組 API 做什麼

Stitch 文件列出的 `v2alpha` 端點沒有 Canvas 專案或畫面；專案與畫面用 `stitch find`、`stitch generate` 等[資源指令](/cli/reference/commands/)操作。

## 從 CLI 呼叫

`stitch api` 是 Workspace 指令，先開啟一次：

```shell
stitch enable loop
```

之後就能直接呼叫端點：

```shell
stitch api workspaces
stitch api workspaces/<workspace-id>/goals
```

不是 `GET` 的請求用 `-X` 指定方法，例如請 Stitch 為 Workspace 建議 goal：

```shell
stitch api -X POST workspaces/{workspace}/goals/suggest
```

`path` 也可以寫成 Discovery 方法 ID，例如 `workspaces.list`。常用旗標：

| 旗標 | 用途 |
| --- | --- |
| `--method`、`-X` | HTTP 方法：`GET`、`POST`、`PATCH`、`PUT`、`DELETE`（預設 `GET`） |
| `--dryRun` | 驗證內容並預覽請求，不呼叫 API |
| `--filter` | 依關鍵字或條件篩選項目 |
| `--force` | 不確認，直接執行 |
| `--yes`、`-y` | 略過確認提示 |

## 路徑參數、查詢參數與方法 ID

- 路徑中的 `{workspace}`、`{goal}` 等段落是路徑參數，換成實際 ID。在參數表裡它們叫 `name`、`parent` 或 `user`，值是資源名稱，例如 `workspaces/{workspace}`；資源名稱不含 `:addRepository` 這類方法後綴，所以不一定等於完整路徑。
- 「查詢參數」欄的「—」表示該端點沒有路徑以外的查詢參數。
- `filter` 多數是 AIP-160 運算式；`organizations`、`workspaces`、`users` 的列表用 CEL 運算式。
- `pageSize` 與 `pageToken` 用來分頁：`pageToken` 填上一次回應給的權杖。
- `updateMask` 指定要更新的欄位。
- 「方法 ID」是各端點在 Stitch 文件中的名稱，例如 `workspaces.list`。

## 帳號、條款與共用端點

| 方法 | 路徑 | 方法 ID | 用途 | 查詢參數 |
| --- | --- | --- | --- | --- |
| `POST` | `clientNotices:fetch` | `clientNotices.fetch` | 取得給用戶端的動態通知、警示橫幅、服務中斷通知與免責聲明 | — |
| `POST` | `contexts:parseMcpJson` | `contexts.parseMcpJson` | 把 MCP JSON 設定解析成標準化的工具服務商設定 | — |
| `POST` | `feedback:submit` | `feedback.submit` | 送出產品意見回饋（例如來自 Stitch CLI） | — |
| `POST` | `v2alpha:completeOAuth` | `completeOAuth` | 用授權碼換取權杖並安全儲存，完成 OAuth 2.0 流程 | — |
| `GET` | `organizations` | `organizations.list` | 列出組織 | `filter`（CEL）、`pageSize`、`pageToken` |
| `GET` | `organizations/{organization}` | `organizations.get` | 依資源名稱取得一個組織 | — |
| `POST` | `tos:accept` | `tos.accept` | 記錄目前使用者已接受指定版本的服務條款 | — |
| `GET` | `tos:check` | `tos.check` | 檢查目前使用者是否已接受指定版本的服務條款 | `user`、`version` |
| `POST` | `users/{user}/tos:accept` | `users.tos.accept` | 記錄使用者已接受指定版本的服務條款 | — |
| `GET` | `users/{user}/tos:check` | `users.tos.check` | 檢查使用者是否已接受指定版本的服務條款 | `version` |
| `GET` | `users/{user}/preferences` | `users.getPreferences` | 取得使用者偏好設定 | — |
| `PATCH` | `users/{user}/preferences` | `users.updatePreferences` | 更新使用者偏好設定 | `updateMask` |

- `completeOAuth` 不帶資源路徑：Workspace 與服務商的身分包在 `state_token` 裡，由伺服器解析。
- `user` 預設是目前驗證的使用者 `users/me`；偏好設定的路徑也可以寫 `users/me/preferences`。
- `version` 是要檢查的條款版本，例如 `"2026-03-18"`；省略時以後端目前生效的版本為準。
- `users.updatePreferences` 的 `updateMask` 空白或含 `*` 時，更新所有可變更的欄位。

## Workspace

| 方法 | 路徑 | 方法 ID | 用途 | 查詢參數 |
| --- | --- | --- | --- | --- |
| `GET` | `workspaces` | `workspaces.list` | 列出 Workspace | `filter`（CEL）、`pageSize`、`pageToken` |
| `POST` | `workspaces` | `workspaces.create` | 建立新的 Workspace | — |
| `GET` | `workspaces/{workspace}` | `workspaces.get` | 依資源名稱取得一個 Workspace | — |
| `PATCH` | `workspaces/{workspace}` | `workspaces.patch` | 更新 Workspace | `updateMask` |
| `DELETE` | `workspaces/{workspace}` | `workspaces.delete` | 刪除 Workspace | — |
| `POST` | `workspaces/{workspace}:addRepository` | `workspaces.addRepository` | 為 Workspace 加入儲存庫 | — |
| `POST` | `workspaces/{workspace}:removeRepository` | `workspaces.removeRepository` | 從 Workspace 移除儲存庫 | — |
| `POST` | `workspaces/{workspace}:addUser` | `workspaces.addUser` | 為 Workspace 加入使用者 | — |
| `POST` | `workspaces/{workspace}:removeUser` | `workspaces.removeUser` | 從 Workspace 移除使用者 | — |
| `GET` | `workspaces/{workspace}/users` | `workspaces.users.list` | 列出 Workspace 的使用者 | `filter`（CEL）、`pageSize`、`pageToken` |
| `POST` | `workspaces/{workspace}:createToolkitConnectLink` | `workspaces.createToolkitConnectLink` | 建立用來在 Workspace 中驗證工具組（toolkit）的連結 | — |
| `GET` | `workspaces/{workspace}/userNotificationSettings` | `workspaces.getUserNotificationSettings` | 取得呼叫者在這個 Workspace 的通知設定 | — |
| `PATCH` | `workspaces/{workspace}/userNotificationSettings` | `workspaces.updateUserNotificationSettings` | 更新呼叫者在這個 Workspace 的通知設定 | `updateMask` |
| `GET` | `workspaces/{workspace}/workspaceNotificationSettings` | `workspaces.getWorkspaceNotificationSettings` | 取得 Workspace 層級的通知設定 | — |
| `PATCH` | `workspaces/{workspace}/workspaceNotificationSettings` | `workspaces.updateWorkspaceNotificationSettings` | 更新 Workspace 層級的通知設定 | `updateMask` |

## Goal

| 方法 | 路徑 | 方法 ID | 用途 | 查詢參數 |
| --- | --- | --- | --- | --- |
| `GET` | `workspaces/{workspace}/goalTemplates` | `workspaces.goalTemplates.list` | 列出可用的起始 goal 範本 | `filter`、`pageSize`、`pageToken`、`readMask` |
| `GET` | `workspaces/{workspace}/goals` | `workspaces.goals.list` | 列出 Workspace 的 goal | `filter`、`pageSize`、`pageToken`、`readMask` |
| `POST` | `workspaces/{workspace}/goals` | `workspaces.goals.create` | 建立新的 goal | — |
| `POST` | `workspaces/{workspace}/goals/suggest` | `workspaces.goals.suggest` | 為 Workspace 建議 goal | — |
| `GET` | `workspaces/{workspace}/goals/{goal}` | `workspaces.goals.get` | 取得一個 goal | `readMask` |
| `PATCH` | `workspaces/{workspace}/goals/{goal}` | `workspaces.goals.patch` | 更新 goal | `updateMask` |
| `DELETE` | `workspaces/{workspace}/goals/{goal}` | `workspaces.goals.delete` | 刪除 goal | — |
| `GET` | `workspaces/{workspace}/goals/{goal}/insightGeneration` | `workspaces.goals.getInsightGeneration` | 取得最近一次 insight 生成的狀態 | — |
| `GET` | `workspaces/{workspace}/goals/{goal}/insightGeneration:queryStatusUpdates` | `workspaces.goals.insightGeneration.queryStatusUpdates` | 查詢 insight 生成過程中發出的中間狀態更新 | `pageSize`、`pageToken` |

- `goalTemplates.list` 與 `goals.list` 的 `pageSize` 未指定時最多回傳 20 筆，上限 100，超過以 100 計。
- `queryStatusUpdates` 的 `pageToken` 填上一次的權杖，只取新發出的更新。

## Insight

| 方法 | 路徑 | 方法 ID | 用途 | 查詢參數 |
| --- | --- | --- | --- | --- |
| `GET` | `workspaces/{workspace}/insights` | `workspaces.insights.list` | 列出 Workspace 的 insight | `filter`、`pageSize`、`pageToken`、`readMask` |
| `GET` | `workspaces/{workspace}/insights:batchGet` | `workspaces.insights.batchGet` | 依名稱一次取得多個 insight | `names` |
| `GET` | `workspaces/{workspace}/insights/summary` | `workspaces.insights.getSummary` | 依狀態統計 insight 數量 | `filter` |
| `POST` | `workspaces/{workspace}/insights/generate` | `workspaces.insights.generate` | 為一組 goal 產生 insight | — |
| `GET` | `workspaces/{workspace}/insights/{insight}` | `workspaces.insights.get` | 取得一個 insight | — |
| `POST` | `workspaces/{workspace}/insights/{insight}:dismiss` | `workspaces.insights.dismiss` | 略過一個 insight | — |
| `POST` | `workspaces/{workspace}/insights/{insight}:undismiss` | `workspaces.insights.undismiss` | 取消略過一個 insight | — |
| `POST` | `workspaces/{workspace}/insights/{insight}/setReadStatus` | `workspaces.insights.setReadStatus` | 設定個人對這個 insight 的已讀／未讀狀態 | — |
| `GET` | `workspaces/{workspace}/insights/{insight}/investigationReport` | `workspaces.insights.getInvestigationReport` | 取得 insight 最新的調查報告（對應最近一次 insight update） | — |
| `GET` | `workspaces/{workspace}/insights/{insight}/insightUpdates` | `workspaces.insights.insightUpdates.list` | 列出 insight 的更新紀錄 | `filter`、`orderBy`、`pageSize`、`pageToken`、`readMask` |
| `GET` | `workspaces/{workspace}/insights/{insight}/insightUpdates/{insightUpdate}/investigationReport` | `workspaces.insights.insightUpdates.getInvestigationReport` | 取得某一次 insight update 當時的調查報告 | — |

- `insights.list` 的 `filter` 支援欄位 `state`、`goal_ids`；`readMask` 不支援萬用字元 `*`。
- `insights:batchGet` 的 `names` 必填，一次最多 100 個，格式 `workspaces/{workspace}/insights/{insight}`。
- `insightUpdates.list` 的 `filter` 支援 `substantive`、`source`、`create_time`、`description`；`orderBy` 只支援 `create_time`，預設 `create_time desc`；`readMask` 不支援 `*`。
- `insights.list` 與 `insightUpdates.list` 的 `pageSize` 未指定時最多 20 筆，上限 100。

## Insight 回饋

| 方法 | 路徑 | 方法 ID | 用途 | 查詢參數 |
| --- | --- | --- | --- | --- |
| `GET` | `workspaces/{workspace}/feedback:batchGet` | `workspaces.feedback.batchGet` | 一次取得多個 insight 的回饋 | `names` |
| `GET` | `workspaces/{workspace}/insights/{insight}/feedback` | `workspaces.insights.feedback.list` | 列出一個 insight 的回饋 | `pageSize`、`pageToken` |
| `POST` | `workspaces/{workspace}/insights/{insight}/feedback` | `workspaces.insights.feedback.create` | 對 insight 送出回饋 | `insightFeedbackId` |
| `GET` | `workspaces/{workspace}/insights/{insight}/feedback/{feedback}` | `workspaces.insights.feedback.get` | 取得一筆回饋 | — |
| `PATCH` | `workspaces/{workspace}/insights/{insight}/feedback/{feedback}` | `workspaces.insights.feedback.patch` | 更新一筆回饋 | `updateMask` |
| `DELETE` | `workspaces/{workspace}/insights/{insight}/feedback/{feedback}` | `workspaces.insights.feedback.delete` | 刪除一筆回饋 | — |

- `feedback:batchGet` 的 `names` 必填，填的是 insight 的資源名稱。
- `feedback.create` 不支援由用戶端指定 ID，`insightFeedbackId` 必須留空。
- `feedback.get` 與 `feedback.delete` 的 `{feedback}` 可以寫成虛擬別名 `like`，直接操作呼叫者自己的「讚」，不必先查它的 ID。

## Assessment

| 方法 | 路徑 | 方法 ID | 用途 | 查詢參數 |
| --- | --- | --- | --- | --- |
| `GET` | `workspaces/{workspace}/assessments` | `workspaces.assessments.list` | 列出 Workspace 的 assessment | `filter`、`pageSize`、`pageToken` |
| `POST` | `workspaces/{workspace}/assessments:generate` | `workspaces.assessments.generate` | 為一組 insight 產生 assessment | — |
| `GET` | `workspaces/{workspace}/assessments/{assessment}` | `workspaces.assessments.get` | 取得一個 assessment | — |
| `PATCH` | `workspaces/{workspace}/assessments/{assessment}` | `workspaces.assessments.patch` | 更新 assessment | `updateMask` |
| `DELETE` | `workspaces/{workspace}/assessments/{assessment}` | `workspaces.assessments.delete` | 刪除 assessment | — |

`assessments.list` 的 `filter` 支援欄位 `insights`，例如 `insights:"workspaces/123/insights/456"`；`pageSize` 未指定時最多 20 筆，上限 100。

## Context

| 方法 | 路徑 | 方法 ID | 用途 | 查詢參數 |
| --- | --- | --- | --- | --- |
| `GET` | `workspaces/{workspace}/contexts` | `workspaces.contexts.list` | 列出 Workspace 的 context | `filter`、`orderBy`、`pageSize`、`pageToken` |
| `POST` | `workspaces/{workspace}/contexts` | `workspaces.contexts.create` | 匯入新的 context | — |
| `GET` | `workspaces/{workspace}/contexts:search` | `workspaces.contexts.search` | 用向量嵌入依語意相似度搜尋 context | `query`、`filter`、`pageSize`、`pageToken`、`readMask`、`maxResults` |
| `POST` | `workspaces/{workspace}/contexts:initiateOAuth` | `workspaces.contexts.initiateOAuth` | 為工具服務商啟動 OAuth 2.0 流程，回傳要把使用者導向的授權網址 | — |
| `GET` | `workspaces/{workspace}/contexts/{context}` | `workspaces.contexts.get` | 依 ID 取得 context | — |
| `PATCH` | `workspaces/{workspace}/contexts/{context}` | `workspaces.contexts.patch` | 更新 context | `updateMask` |
| `DELETE` | `workspaces/{workspace}/contexts/{context}` | `workspaces.contexts.delete` | 刪除 context | — |

`contexts.list` 與 `contexts:search` 的 `filter` 可用欄位：

| 欄位 | 比對方式 | 例子 |
| --- | --- | --- |
| `data_source` | 等於 | `data_source = "user_feedback"` |
| `annotations.` 加鍵名 | 等於 | `annotations.env = "prod"` |
| `description` | 包含（`:` 運算子） | `description : "error"` |
| `data` | 包含（`:` 運算子） | `data : "exception"` |
| `create_time` | 大小比較，RFC 3339 時間 | `create_time >= "2024-01-01T00:00:00Z"` |

- `contexts.list` 的複合條件只支援 `AND`，例如 `data_source = "notes" AND description : "bug"`；格式錯誤或不支援的篩選回傳 `INVALID_ARGUMENT`。
- `contexts.list` 的 `pageSize` 未指定時最多 50 筆，上限 1000。
- `contexts:search` 的 `query` 必填，是自然語言的搜尋字串；`pageSize` 未指定時最多 10 筆，上限 100；`maxResults` 已棄用，改用 `page_size`。

## 檔案

| 方法 | 路徑 | 方法 ID | 用途 | 查詢參數 |
| --- | --- | --- | --- | --- |
| `POST` | `workspaces/{workspace}/files` | `media.upload` | 建立一個 File | — |
| `GET` | `workspaces/{workspace}/files` | `workspaces.files.list` | 列出 Workspace 的檔案 | `filter`、`orderBy`、`pageSize`、`pageToken` |
| `GET` | `workspaces/{workspace}/files/{file}` | `workspaces.files.get` | 依 ID 取得檔案 | — |
| `DELETE` | `workspaces/{workspace}/files/{file}` | `workspaces.files.delete` | 從 Workspace 刪除檔案 | — |
| `GET` | `workspaces/{workspace}/fileSystemEntries` | `workspaces.fileSystemEntries.list` | 列出 Workspace 的檔案系統項目 | `filter`、`pageSize`、`pageToken` |
| `POST` | `workspaces/{workspace}/fileSystemEntries` | `workspaces.fileSystemEntries.create` | 在指定路徑建立檔案系統項目 | `fileSystemEntryId` |
| `GET` | `workspaces/{workspace}/fileSystemEntries/{fileSystemEntrie}` | `workspaces.fileSystemEntries.get` | 依路徑取得檔案系統項目 | — |
| `PATCH` | `workspaces/{workspace}/fileSystemEntries/{fileSystemEntrie}` | `workspaces.fileSystemEntries.patch` | 更新指定路徑的檔案系統項目 | `updateMask` |
| `DELETE` | `workspaces/{workspace}/fileSystemEntries/{fileSystemEntrie}` | `workspaces.fileSystemEntries.delete` | 刪除指定路徑的檔案系統項目 | — |

- `files.list` 的 `filter` 只支援 `annotations.` 加鍵名的等於比對（例如 `annotations.env = "prod"`），複合條件只支援 `AND`；用其他欄位（例如 `display_name`）篩選會回傳 `INVALID_ARGUMENT`。
- 檔案系統項目資源名稱的最後一段（路徑寫作 `{fileSystemEntrie}`）是使用者指定的相對路徑；`fileSystemEntryId` 是建立時指定的這一段。

## Skill

| 方法 | 路徑 | 方法 ID | 用途 | 查詢參數 |
| --- | --- | --- | --- | --- |
| `GET` | `workspaces/{workspace}/skills` | `workspaces.skills.list` | 列出 Workspace 的 Skill | `filter`、`pageSize`、`pageToken` |
| `POST` | `workspaces/{workspace}/skills` | `workspaces.skills.create` | 在 Workspace 建立 Skill | `skillId` |
| `PATCH` | `workspaces/{workspace}/skills/{skill}` | `workspaces.skills.patch` | 更新 Skill | `allowMissing`、`updateMask` |
| `DELETE` | `workspaces/{workspace}/skills/{skill}` | `workspaces.skills.delete` | 刪除 Skill | — |

- 伺服器不會產生 Skill ID：必須用 `skillId` 或 `skill.name` 提供；兩者都給時必須一致，否則回傳 `INVALID_ARGUMENT`。
- `allowMissing` 設為 `true` 時，找不到的 Skill 會被建立。

## 工具服務商

| 方法 | 路徑 | 方法 ID | 用途 | 查詢參數 |
| --- | --- | --- | --- | --- |
| `GET` | `workspaces/{workspace}/toolProviders` | `workspaces.toolProviders.list` | 列出 Workspace 可用的工具服務商 | `filter`、`orderBy`、`pageSize`、`pageToken` |
| `POST` | `workspaces/{workspace}/toolProviders:upsert` | `workspaces.toolProviders.upsert` | 新增或更新使用者的工具服務商設定 | — |
| `DELETE` | `workspaces/{workspace}/toolProviders/{toolProvider}` | `workspaces.toolProviders.delete` | 刪除使用者的工具服務商設定 | — |
| `POST` | `workspaces/{workspace}/toolProviders/{toolProvider}:upsertAuth` | `workspaces.toolProviders.upsertAuth` | 取代工具服務商的整組驗證標頭 | — |
| `DELETE` | `workspaces/{workspace}/toolProviders/{toolProvider}:deleteAuth` | `workspaces.toolProviders.deleteAuth` | 刪除工具服務商的所有驗證憑證 | — |

## 事件與 webhook

| 方法 | 路徑 | 方法 ID | 用途 | 查詢參數 |
| --- | --- | --- | --- | --- |
| `GET` | `workspaces/{workspace}/events` | `workspaces.events.list` | 列出 Workspace 的通知事件 | `pageSize`、`pageToken` |
| `POST` | `workspaces/{workspace}/events/{event}:replay` | `workspaces.events.replay` | 把通知事件重播給一個或多個訂閱者 | — |
| `GET` | `workspaces/{workspace}/eventDeliveries` | `workspaces.eventDeliveries.list` | 列出 Workspace 的事件遞送紀錄 | `filter`、`pageSize`、`pageToken` |
| `GET` | `workspaces/{workspace}/eventDeliveries/{eventDeliverie}` | `workspaces.eventDeliveries.get` | 依資源名稱取得一筆事件遞送紀錄 | — |
| `GET` | `workspaces/{workspace}/webhookConfigs` | `workspaces.webhookConfigs.list` | 列出 Workspace 的所有 webhook 設定 | `pageSize`、`pageToken` |
| `POST` | `workspaces/{workspace}/webhookConfigs` | `workspaces.webhookConfigs.create` | 建立新的 webhook 設定 | — |
| `GET` | `workspaces/{workspace}/webhookConfigs/{webhookConfig}` | `workspaces.webhookConfigs.get` | 取得一個 webhook 設定 | — |
| `PATCH` | `workspaces/{workspace}/webhookConfigs/{webhookConfig}` | `workspaces.webhookConfigs.patch` | 更新 webhook 設定 | `updateMask` |
| `DELETE` | `workspaces/{workspace}/webhookConfigs/{webhookConfig}` | `workspaces.webhookConfigs.delete` | 刪除 webhook 設定 | — |
| `PATCH` | `workspaces/{workspace}/webhookConfigs/{webhookConfig}/verify` | `workspaces.webhookConfigs.verify` | 送出 challenge 請求，確認端點正確回傳以驗證 webhook | — |
| `GET` | `workspaces/{workspace}/webhookEvents` | `workspaces.webhookEvents.list` | 列出 Workspace 的所有 webhook 事件 | `filter`、`pageSize`、`pageToken` |
| `GET` | `workspaces/{workspace}/webhookEvents/{webhookEvent}` | `workspaces.webhookEvents.get` | 取得一個 webhook 事件 | — |
| `POST` | `workspaces/{workspace}/webhookEvents/{webhookEvent}:send` | `workspaces.webhookEvents.send` | 把 webhook 事件送到設定的端點，可用來手動重送 | — |

- `eventDeliveries.list` 的 `filter` 是針對 `status` 與 `event_type` 的 AIP-160 運算式。
- `webhookEvents.list` 的 `filter` 支援 `delivery_state` 與 `event_type`。
- `webhookConfigs.list` 與 `webhookEvents.list` 的 `pageSize` 上限 100。
- `webhookConfigs.patch` 只修改 `updateMask` 指定的欄位；沒有設定 `updateMask` 時，更新所有可變更的欄位。

## 市場分析與 ProductMd

| 方法 | 路徑 | 方法 ID | 用途 | 查詢參數 |
| --- | --- | --- | --- | --- |
| `GET` | `workspaces/{workspace}/marketRadarCheckpoint` | `workspaces.getMarketRadarCheckpoint` | 取得競品市場分析的 checkpoint | — |
| `POST` | `workspaces/{workspace}/marketRadarCheckpoint/generate` | `workspaces.marketRadarCheckpoint.generate` | 在背景產生市場雷達 checkpoint | — |
| `POST` | `workspaces/{workspace}/productMd:generate` | `workspaces.productMd.generate` | 為 Workspace 啟動 ProductMd agent | — |
| `GET` | `workspaces/{workspace}/productMd:getStatus` | `workspaces.productMd.getStatus` | 輪詢執行中的 ProductMd agent 的中間狀態 | `executionId`、`continuationToken`、`agencySessionId` |

`productMd:getStatus` 的 `executionId` 是 `productMd:generate` 回傳的執行 ID；`continuationToken` 來自上一次的狀態回應；`agencySessionId` 已棄用，改用 `execution_id`。

## 和已發布套件的差異

| 項目 | Stitch 文件 | README 0.13.0 |
| --- | --- | --- |
| loop 相關路徑 | 端點清單用 `goals`（例如 `workspaces/{workspace}/goals`），沒有 `loops` | 範例寫 `stitch api workspaces/<id>/loops` |

## 完整欄位

Stitch 文件的 [REST API](https://stitch.google.com/docs/cli/reference/rest-api/) 頁另有每個參數的英文說明。
