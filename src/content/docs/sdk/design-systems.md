---
title: 管理設計系統
description: 用 SDK 建立、列出、更新設計系統，並套用到專案的畫面上。
appliesTo: Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）
caveat: 套用時每個畫面實例只能帶 id 和 sourceScreen；多帶位置、尺寸等欄位會得到 invalid argument 錯誤。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：How to manage design systems
    url: https://stitch.google.com/docs/sdk/design-systems/
  - title: "@google/stitch-sdk 0.3.5：dist/generated/src/project.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/generated/src/project.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/generated/src/project.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/generated/src/project.d.ts
  - title: "@google/stitch-sdk 0.3.5：dist/generated/src/types.generated.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/generated/src/types.generated.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/generated/src/designsystem.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/generated/src/designsystem.d.ts
---

## 設計系統是什麼

設計系統定義專案的視覺規則：顏色、字體、間距。套用到畫面後，所有畫面都遵循同一套視覺語言。用 SDK 可以建立、更新、套用設計系統，不必打開 Stitch 介面。

| 動作 | 方法 | 會呼叫 API |
| --- | --- | --- |
| 建立 | `project.createDesignSystem({ displayName })` | 是 |
| 列出 | `project.listDesignSystems()` | 是 |
| 用 ID 取得 handle | `project.designSystem(id)` | 否 |
| 從 `DESIGN.md` 建立（只有 0.4.0） | `project.uploadDesignMd(designMdBase64)` → `project.createDesignSystemFromDesignMd(selectedScreenInstance, deviceType?)` | 是 |
| 更新 | `ds.update({ displayName })` | 是 |
| 套用到畫面 | `ds.apply(instances)` | 是 |

## 建立

```ts
import { stitch } from "@google/stitch-sdk";

const project = stitch.project("your-project-id");
const ds = await project.createDesignSystem({ displayName: "My Theme" });
console.log(`Created: ${ds.id}`);
```

`displayName` 是在 Stitch 介面上顯示的名稱，取個看得出用途的名字，例如「Brand Dark Mode」比「DS 1」好。

## 列出現有的設計系統

```ts
const systems = await project.listDesignSystems();
for (const ds of systems) {
  console.log(`${ds.id}: ${ds.data?.displayName}`);
}
```

## 用 ID 取得設計系統

已經知道 asset ID 時，可以省掉一次網路請求：

```ts
const ds = project.designSystem("existing-asset-id");
```

這只在本機建立 handle，不會向伺服器取資料。ID 可以來自前一個步驟，或從 Stitch 介面取得。

## 從 DESIGN.md 建立

已經有定義視覺識別的 `DESIGN.md` 時，呼叫兩個方法就能轉成設計系統。這兩個方法只在 0.4.0（`next`）有，0.3.5（`latest`）沒有：

```ts
import { readFileSync } from "node:fs";

const markdown = readFileSync("DESIGN.md", "utf-8");
const instance = await project.uploadDesignMd(Buffer.from(markdown, "utf-8").toString("base64"));
const ds = await project.createDesignSystemFromDesignMd(
  { id: instance.id, sourceScreen: instance.sourceScreen },
  "DESKTOP",
);
```

## 更新

```ts
const updated = await ds.update({ displayName: "Updated Theme" });
```

## 套用到畫面

套用設計系統會用新的視覺 token 重新繪製畫面。`apply()` 需要 `SelectedScreenInstance` 物件，從專案的畫面實例（screen instance）取得：

```ts
const projectData = await stitch.callTool("get_project", {
  name: `projects/${project.id}`,
});

// Extract screen instances
const instances = projectData.screenInstances.map((si: any) => ({
  id: si.id,
  sourceScreen: si.sourceScreen,
}));

// Apply the design system to all screens
const screens = await ds.apply(instances);
console.log(`Applied to ${screens.length} screens`);
```

每個實例物件只放 `id` 和 `sourceScreen`。多帶位置或尺寸之類的欄位，會得到「invalid argument」錯誤。

## 完整流程：建立並套用

建立專案、產生畫面、建立設計系統，再套用：

```ts
import { stitch } from "@google/stitch-sdk";

const project = await stitch.createProject("Themed App");

// Generate a few screens
const home = await project.generate("Riders in Kaohsiung see this first: a map of nearby bike docks and one large Unlock button");
const settings = await project.generate("Account area showing this month's kilometers ridden, saved payment cards and which alerts the rider gets");

// Create and apply a design system
const ds = await project.createDesignSystem({ displayName: "Productivity Theme" });

// Get screen instances for applying
const projectData = await stitch.callTool("get_project", {
  name: `projects/${project.id}`,
});

const instances = projectData.screenInstances.map((si: any) => ({
  id: si.id,
  sourceScreen: si.sourceScreen,
}));

await ds.apply(instances);
console.log("Design system applied to all screens");
```

兩段提示詞分別要 Stitch 做高雄單車騎士一打開就看到的畫面（附近租借站地圖和一個大的 Unlock 按鈕），以及顯示本月騎乘公里數、已存付款卡片和通知選項的帳戶畫面。

## 和已發布套件的差異

除了從 `DESIGN.md` 建立的兩個方法，這些用法在 0.3.5 與 0.4.0 都能執行。

| 項目 | Stitch 文件 | 0.3.5（latest） | 0.4.0（next） |
| --- | --- | --- | --- |
| `uploadDesignMd()`、`createDesignSystemFromDesignMd()` | `Project` 的方法 | 沒有（`project.d.ts` 只宣告 `generate`、`screens`、`getScreen`、`createDesignSystem`、`listDesignSystems`、`designSystem`、`screen`） | 有（`project.d.ts` 第 59、64 行） |
| `createDesignSystem()` 的參數 | `{ displayName: string }` | `DesignSystemInput`：`displayName?`、`designTokens?`、`styleGuidelines?`、`theme?`（`types.generated.d.ts` 第 151 行） | 同 0.3.5 |
| `ds.apply()` 回傳 | `Screen` 陣列 | `Promise<Screen[]>` | `Promise<Generation<Screen, ApplyDesignSystemResponse>>`（`designsystem.d.ts` 第 36 行），有 `.length` 與 `.screens` |
