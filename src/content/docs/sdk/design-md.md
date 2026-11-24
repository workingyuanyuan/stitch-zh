---
title: 從 DESIGN.md 建立設計系統
description: 上傳 DESIGN.md，再把它轉成 Stitch 套用到畫面上的設計系統。
appliesTo: Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）
caveat: uploadDesignMd 與 createDesignSystemFromDesignMd 只在 0.4.0（next）有；npm 預設安裝的 0.3.5 沒有這兩個方法。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：How to create design systems from DESIGN.md
    url: https://stitch.google.com/docs/sdk/design-md/
  - title: "@google/stitch-sdk 0.3.5：dist/generated/src/project.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/generated/src/project.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/generated/src/project.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/generated/src/project.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/generated/src/responses.generated.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/generated/src/responses.generated.d.ts
  - title: "@google/stitch-sdk 0.3.5：dist/src/client.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/src/client.d.ts
---

## 兩個步驟

`DESIGN.md` 用純文字定義專案的視覺識別：顏色、字體、間距、元件樣式。用 SDK 把它變成設計系統分兩步：

| 步驟 | 方法 | 輸入 | 輸出 |
| --- | --- | --- | --- |
| 1. 上傳 | `project.uploadDesignMd(designMdBase64)` | base64 編碼的檔案內容 | 一個畫面實例（screen instance） |
| 2. 建立 | `project.createDesignSystemFromDesignMd(selectedScreenInstance, deviceType?)` | 上一步的 `id` 與 `sourceScreen` | 設計系統 |

這兩個方法只在 0.4.0（`next`）有，用 `npm install @google/stitch-sdk@next` 安裝。0.3.5（`latest`）沒有這兩個方法；它的 `callTool(name, args)` 接受任何工具名稱字串，文末「直接用 callTool」的寫法不依賴這兩個方法。

## 1. 上傳 DESIGN.md

```ts
import { stitch } from "@google/stitch-sdk";
import { readFileSync } from "node:fs";

const project = stitch.project("your-project-id");
const markdown = readFileSync("DESIGN.md", "utf-8");
const instance = await project.uploadDesignMd(Buffer.from(markdown, "utf-8").toString("base64"));
```

檔案內容必須先轉成 base64。`Buffer.from(str, 'utf-8').toString('base64')` 能正確處理所有 UTF-8 字串，包括中文這類非 ASCII 字元。

## 2. 建立設計系統

```ts
const ds = await project.createDesignSystemFromDesignMd(
  { id: instance.id, sourceScreen: instance.sourceScreen },
  "DESKTOP",
);
console.log(`Created design system: ${ds.id}`);
```

| 參數 | 必填 | 內容 |
| --- | --- | --- |
| `selectedScreenInstance` | 是 | 上傳回應裡的 `id` 與 `sourceScreen` |
| `deviceType` | 否 | `"DESKTOP"`、`"MOBILE"`、`"TABLET"` 或 `"AGNOSTIC"` |

## 3. 套用到畫面

和其他設計系統的套用方式相同：

```ts
const projectData = await stitch.callTool("get_project", {
  name: `projects/${project.id}`,
});

const instances = projectData.screenInstances.map((si: any) => ({
  id: si.id,
  sourceScreen: si.sourceScreen,
}));

await ds.apply(instances);
```

## 完整流程

```ts
import { stitch } from "@google/stitch-sdk";
import { readFileSync } from "node:fs";

const project = await stitch.createProject("Branded App");

// Generate screens first
const home = await project.generate("Tell visitors about our Alishan oolong subscription: the farmers who grow it, how a box arrives each month, and where to sign up");
const pricing = await project.generate("Put the monthly, quarterly and yearly tea boxes side by side so a visitor can compare them and choose one");

// Upload and create design system from DESIGN.md
const markdown = readFileSync("DESIGN.md", "utf-8");
const instance = await project.uploadDesignMd(Buffer.from(markdown, "utf-8").toString("base64"));
const ds = await project.createDesignSystemFromDesignMd(
  { id: instance.id, sourceScreen: instance.sourceScreen },
  "DESKTOP",
);

// Apply to all screens
const projectData = await stitch.callTool("get_project", {
  name: `projects/${project.id}`,
});
const screenInstances = projectData.screenInstances.map((si: any) => ({
  id: si.id,
  sourceScreen: si.sourceScreen,
}));
await ds.apply(screenInstances);
console.log("Design system from DESIGN.md applied to all screens");
```

兩段提示詞分別要 Stitch 介紹阿里山烏龍茶訂閱（茶農、每月如何寄送、在哪裡報名），以及把月繳、季繳、年繳三種茶盒並排比較、讓訪客挑選。

## 直接用 callTool

如果想直接用低階的 `callTool`，例如在 Agent 工作流程中：

```ts
const instance = await stitch.callTool("upload_design_md", {
  projectId: "your-project-id",
  designMdBase64: Buffer.from(markdown, "utf-8").toString("base64"),
});

const ds = await stitch.callTool("create_design_system_from_design_md", {
  projectId: "your-project-id",
  selectedScreenInstance: {
    id: instance.id,
    sourceScreen: instance.sourceScreen,
  },
  deviceType: "DESKTOP",
});
```

| 工具 | 參數 |
| --- | --- |
| `upload_design_md` | `projectId`、`designMdBase64` |
| `create_design_system_from_design_md` | `projectId`、`selectedScreenInstance`、`deviceType` |

## 和已發布套件的差異

| 項目 | Stitch 文件 | 0.3.5（latest） | 0.4.0（next） |
| --- | --- | --- | --- |
| `project.uploadDesignMd()` | 有，回傳 `Promise<any>` | 沒有（`project.d.ts` 沒有宣告） | 有，回傳 `Promise<UploadDesignMdResponse>`，含 `id?`、`sourceScreen?` 等欄位（`project.d.ts` 第 59 行） |
| `project.createDesignSystemFromDesignMd()` | 有，第二個參數 `deviceType?` | 沒有 | 有（`project.d.ts` 第 64 行）；第二個參數可以是 `deviceType`，或物件 `{ deviceType? }` |
| `ds.apply()` 回傳 | `Screen` 陣列 | `Promise<Screen[]>` | `Promise<Generation<Screen, ApplyDesignSystemResponse>>` |
| `callTool()` | `callTool(name, params)` | `callTool<T>(name: string, args: Record<string, any>)`（`client.d.ts` 第 34 行） | 同 0.3.5 |

## 下一步

- [DESIGN.md 規格](/design-md/specification/)：自己撰寫 `DESIGN.md` 的完整格式
- [管理設計系統](/sdk/design-systems/)：建立、更新、列出、套用設計系統
- [Agent 工作流程](/sdk/agent-workflows/)：用 `callTool` 與 `listTools` 完整控制
