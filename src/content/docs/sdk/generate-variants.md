---
title: 產生變化版本
description: screen.variants() 依提示詞與選項，從一個畫面產生多個不同的設計版本。
appliesTo: Stitch SDK（@google/stitch-sdk 0.3.5 與 0.4.0，2026-11-20）
caveat: 數量選項在已發布套件裡叫 variantCount（1 到 5，預設 3）；Stitch 文件寫的 numVariants 不在套件的型別裡。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：How to generate variants
    url: https://stitch.google.com/docs/sdk/generate-variants/
  - title: "@google/stitch-sdk 0.3.5：dist/generated/src/types.generated.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/dist/generated/src/types.generated.d.ts
  - title: "@google/stitch-sdk 0.4.0：dist/generated/src/types.generated.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/generated/src/types.generated.d.ts
  - title: "@google/stitch-sdk 0.3.5：README"
    url: https://unpkg.com/@google/stitch-sdk@0.3.5/README.md
  - title: "@google/stitch-sdk 0.4.0：README"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/README.md
  - title: "@google/stitch-sdk 0.4.0：dist/generated/src/screen.d.ts"
    url: https://unpkg.com/@google/stitch-sdk@0.4.0/dist/generated/src/screen.d.ts
---

## 用途

給 SDK 一個畫面、一段提示詞和一組選項，它回傳一個陣列，裡面每個元素都是新的 `Screen` 物件，各自是原設計的一種變化。

## 1. 找出畫面

```ts
import { stitch } from "@google/stitch-sdk";

const projects = await stitch.projects();
const project = projects.at(0);
const screens = await project.screens();
const screen = screens.at(0);
```

## 2. 產生變化版本

```ts
const variants = await screen.variants(
  "Turn Order Now into a ghost button: clear fill, a thin tea-green border and tea-green lettering",
  { variantCount: 3 }
);

console.log(`Generated ${variants.length} variants`);
```

這段提示詞要 Stitch 把 Order Now 改成透明底、細茶綠色邊框與茶綠色文字的按鈕。

## 3. 瀏覽結果

每個變化版本都是完整的 `Screen`，有自己的 HTML 與圖片：

```ts
for (const variant of variants) {
  const html = await variant.getHtml();
  console.log(`Variant ${variant.id}: ${html}`);
}
```

## 選項

第二個參數控制產生方式：

```ts
const variants = await screen.variants(
  "Recolor this screen in the tones of the Hualien coast at sunrise, and try a few other arrangements of the cards too",
  {
    variantCount: 5,
    creativeRange: "REIMAGINE",
    aspects: ["COLOR_SCHEME", "LAYOUT"],
  }
);
```

這段提示詞要 Stitch 用花蓮海岸日出的色調重新配色，同時試幾種不同的卡片排法，對應下面的 COLOR_SCHEME 與 LAYOUT。

| 選項 | 可用的值 | 預設（套件 README） | 作用 |
| --- | --- | --- | --- |
| `variantCount` | `1`–`5` | `3` | 產生幾個版本 |
| `creativeRange` | `REFINE`、`EXPLORE`、`REIMAGINE` | `"EXPLORE"` | 相較原設計的變動幅度：`REFINE` 是細微調整，`REIMAGINE` 是大幅改變 |
| `aspects` | `LAYOUT`、`COLOR_SCHEME`、`IMAGES`、`TEXT_FONT`、`TEXT_CONTENT` | 全部 | 要變化哪些面向 |

`variants()` 也接受選用的第三、四個參數 `deviceType` 與 `modelId`。

## 和已發布套件的差異

| 項目 | Stitch 文件 | 0.3.5（latest） | 0.4.0（next） |
| --- | --- | --- | --- |
| 數量選項的名稱 | `numVariants` | `variantCount`（`types.generated.d.ts` 第 212 行；README 第 84 行） | `variantCount`（`types.generated.d.ts` 第 243 行；README 第 87 行） |
| `variants()` 回傳 | `Screen` 陣列 | `Promise<Screen[]>` | `Promise<Generation<Screen, GenerateVariantsResponse>>`；可以用 `for…of` 走訪，也有 `.length` 與 `.screens` |
| 第三個參數 | `deviceType` | `deviceType` | `deviceType`，或物件 `{ deviceType?, modelId? }` |
