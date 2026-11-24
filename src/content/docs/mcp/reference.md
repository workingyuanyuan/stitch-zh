---
title: Stitch MCP 工具參考
description: 遠端 Stitch MCP 服務有 14 個工具，管理專案、畫面與設計系統，並用 AI 產生與修改畫面。
appliesTo: Stitch MCP（2026-11-20）
caveat: 產生與修改畫面通常要幾分鐘；連線錯誤不一定代表失敗，應避免重試，過幾分鐘改用 get_screen 查看。generate_screen_from_text 每次呼叫都建立新畫面，重試可能產生重複畫面。
lastVerified: 2026-11-20
sources:
  - title: Stitch Docs：Reference（MCP）
    url: https://stitch.google.com/docs/mcp/reference/
  - title: Stitch Docs：Stitch via MCP
    url: https://stitch.google.com/docs/mcp/setup/
---

## 這是哪一個伺服器

這些是遠端 Stitch MCP 服務的工具，也就是 [MCP 用戶端](/mcp/setup/)連到 `https://stitch.googleapis.com/mcp` 時可用的工具。Stitch CLI 內建的 MCP 伺服器是另一個伺服器，有[自己的工具](/cli/reference/mcp-tools/)。

## 工具一覽

| # | 工具 | 分類 | 唯讀 | 標註 | 用途 |
| --- | --- | --- | --- | --- | --- |
| 1 | `create_project` | Project Management | `false` | `destructive` | 建立專案 |
| 2 | `get_project` | Project Management | `true` | `readOnly` | 取得一個專案 |
| 3 | `list_projects` | Project Management | `true` | `readOnly` | 列出專案 |
| 4 | `list_screens` | Screen Management | `true` | `readOnly` | 列出專案裡的畫面 |
| 5 | `get_screen` | Screen Management | `true` | `readOnly` | 取得一個畫面 |
| 6 | `generate_screen_from_text` | AI Generation | `false` | `destructive` | 用提示詞產生新畫面 |
| 7 | `edit_screens` | AI Generation | `false` | `destructive` | 用提示詞修改現有畫面 |
| 8 | `generate_variants` | AI Generation | `false` | `destructive` | 產生現有畫面的變化版本 |
| 9 | `create_design_system` | Design Systems | `false` | `destructive` | 建立設計系統 |
| 10 | `update_design_system` | Design Systems | `false` | `destructive` | 更新設計系統 |
| 11 | `list_design_systems` | Design Systems | `true` | `readOnly` | 列出設計系統 |
| 12 | `apply_design_system` | Design Systems | `false` | `destructive` | 把設計系統套用到畫面 |
| 13 | `upload_design_md` | Design Systems | `false` | `destructive` | 上傳 DESIGN.md 檔案 |
| 14 | `create_design_system_from_design_md` | Design Systems | `false` | `destructive` | 從上傳的 DESIGN.md 建立設計系統 |

「標註」欄是每個工具標示的行為類型：唯讀工具標 `readOnly`，其他工具標 `destructive`，意義見 [MCP Annotations](#mcp-annotations)。

## 容易弄混的 ID

| 參數 | 格式 | 從哪裡取得 |
| --- | --- | --- |
| `name`（專案） | `projects/{project}`，例如 `projects/4044680601076201931` | 專案資源名稱 |
| `projectId` | 不含 `projects/` 前綴，例如 `4044680601076201931` | 專案資源名稱去掉前綴 |
| `name`（畫面） | `projects/{project}/screens/{screen}` | 畫面資源名稱 |
| `selectedScreenIds` | 畫面 ID 陣列；`edit_screens` 註明不含 `screens/` 前綴 | — |
| `selectedScreenInstances`、`selectedScreenInstance` | 畫面實例（screen instance）物件，`id` 是實例 ID，不是來源畫面 ID | `get_project`；DESIGN.md 的實例來自 `upload_design_md` |
| `name`（設計系統） | `assets/{asset}`，例如 `assets/15996705518239280238` | `list_design_systems` |
| `assetId` | 不含 `assets/` 前綴 | `list_design_systems` 或 `create_design_system_from_design_md` |

## Project Management：專案

### `create_project`

建立新的 Stitch 專案。專案是 UI 設計與前端程式碼的容器。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `title` | `string` | 否 | 專案標題 |

回傳：新建的 `Project` 資源，含產生的 `name`、`title` 與中繼資料。

### `get_project`

用專案名稱取得一個專案的詳細資料。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `name` | `string` | 是 | 資源名稱，格式 `projects/{project}` |

回傳：`Project` 資源物件。

### `list_projects`

列出使用者可存取的所有專案，預設只列使用者擁有的。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `filter` | `string` | 否 | 針對 `view` 欄位的 AIP-160 篩選。支援 `view=owned`（預設）與 `view=shared` |

回傳：`Project` 資源物件陣列。

## Screen Management：畫面

### `list_screens`

列出一個專案裡的所有畫面。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `projectId` | `string` | 是 | 專案 ID，不含 `projects/` 前綴 |

回傳：[`Screen`](#screen) 物件陣列。

### `get_screen`

取得專案裡一個畫面的詳細資料。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `name` | `string` | 是 | 資源名稱，格式 `projects/{project}/screens/{screen}` |
| `projectId` | `string` | 是（已棄用） | 專案 ID，不含前綴 |
| `screenId` | `string` | 是（已棄用） | 畫面 ID，不含前綴 |

`projectId` 和 `screenId` 已棄用，改用 `name`，但目前三個參數都必填。

回傳：[`Screen`](#screen) 物件，含 `htmlCode`、`screenshot`、`figmaExport` 的檔案參照與下載網址。

## AI Generation：產生與修改

這三個工具共用兩個選填參數：

| 參數 | 可用值 |
| --- | --- |
| `deviceType` | `DEVICE_TYPE_UNSPECIFIED`、`MOBILE`、`DESKTOP`、`TABLET`、`AGNOSTIC` |
| `modelId` | `MODEL_ID_UNSPECIFIED`、`GEMINI_3_PRO`、`GEMINI_3_FLASH`、`GEMINI_3_1_PRO` |

`GEMINI_3_PRO` 已棄用，改用 `GEMINI_3_1_PRO` 或 `GEMINI_3_FLASH`。

### `generate_screen_from_text`

用文字提示詞產生新畫面。

- 通常要花幾分鐘。
- 每次呼叫都建立新畫面，逾時後重試可能產生重複畫面。
- 遇到連線錯誤也應避免重試：連線錯誤不一定代表失敗，過幾分鐘改用 `get_screen` 查看。
- 回應的 `output_components` 裡有建議時，把建議拿給使用者看；使用者接受，就用那則建議當新的 `prompt` 再呼叫一次。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `projectId` | `string` | 是 | 專案 ID，不含前綴 |
| `prompt` | `string` | 是 | 描述要產生的畫面的提示詞 |
| `deviceType` | `string` | 否 | 見上表 |
| `modelId` | `string` | 否 | 見上表 |

回傳：產生的 [`Screen`](#screen) 物件，以及 [`SessionOutputComponent`](#sessionoutputcomponent) 項目（文字、建議或設計參照）。

### `edit_screens`

用文字提示詞修改現有畫面。和 `generate_screen_from_text` 一樣通常要幾分鐘；遇到連線錯誤也應避免重試，過幾分鐘改用 `get_screen` 查看。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `projectId` | `string` | 是 | 專案 ID，不含前綴 |
| `selectedScreenIds` | `string[]` | 是 | 要修改的畫面 ID，不含 `screens/` 前綴 |
| `prompt` | `string` | 是 | 修改指示 |
| `deviceType` | `string` | 否 | 見上表 |
| `modelId` | `string` | 否 | 見上表 |

回傳：更新後的 [`Screen`](#screen) 物件。

### `generate_variants`

產生現有畫面的變化版本。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `projectId` | `string` | 是 | 專案 ID，不含前綴 |
| `selectedScreenIds` | `string[]` | 是 | 要產生變化版本的畫面 ID |
| `prompt` | `string` | 是 | 引導變化方向的文字 |
| `variantOptions` | [`VariantOptions`](#variantoptions) | 是 | 變化版本設定 |
| `deviceType` | `string` | 否 | 見上表 |
| `modelId` | `string` | 否 | 見上表 |

回傳：產生的變化版本 [`Screen`](#screen) 物件。

## Design Systems：設計系統

### `create_design_system`

為專案建立新的設計系統，設定套用到所有畫面的基礎 design token：顏色、字體、形狀、外觀。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `designSystem` | [`DesignSystem`](#designsystem) | 是 | 要建立的設計系統 |
| `projectId` | `string` | 否 | 專案 ID。留空則建立不屬於任何專案的全域資產 |

回傳：建立的設計系統 [`Asset`](#asset)。

### `update_design_system`

更新現有的設計系統，用 `name` 欄位指定資產。`designSystem` 和 `create_design_system` 用同一組 [`DesignSystem`](#designsystem)、[`DesignTheme`](#designtheme) 結構。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `name` | `string` | 是 | 資源名稱，格式 `assets/{asset}` |
| `projectId` | `string` | 是 | 專案 ID，不含前綴 |
| `designSystem` | [`DesignSystem`](#designsystem) | 是 | 更新後的設計系統內容 |

回傳：更新後的設計系統 [`Asset`](#asset)。

### `list_design_systems`

列出專案的所有設計系統；沒有給 `projectId` 時列出全域設計系統。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `projectId` | `string` | 否 | 專案 ID。留空則列出全域設計系統 |

回傳：包含設計系統的 [`Asset`](#asset) 物件陣列。

### `apply_design_system`

把設計系統套用到一個或多個畫面，依系統的 token（顏色、字體、形狀）修改畫面外觀。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `projectId` | `string` | 是 | 專案 ID，不含前綴 |
| `selectedScreenInstances` | [`SelectedScreenInstance`](#selectedscreeninstance)`[]` | 是 | 要更新的畫面實例，取自 `get_project` |
| `assetId` | `string` | 是 | 設計系統的資產 ID，取自 `list_design_systems`，不含 `assets/` 前綴 |

回傳：更新後的 [`Screen`](#screen) 物件。

### `upload_design_md`

把 DESIGN.md 檔案上傳到 Stitch 專案。這是 DESIGN.md 兩步驟流程的第一步，上傳後呼叫 `create_design_system_from_design_md` 建立設計系統。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `projectId` | `string` | 是 | 專案 ID，不含 `projects/` 前綴 |
| `designMdBase64` | `string` | 是 | Base64 編碼的 DESIGN.md 內容，解碼後必須是有效的 UTF-8 |

回傳：代表上傳的 DESIGN.md 的畫面實例物件。下一步要用到其中的 `id` 和 `sourceScreen`。

### `create_design_system_from_design_md`

從上傳的 DESIGN.md 建立設計系統，並顯示在介面上。必須在 `upload_design_md` 之後呼叫。

| 參數 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `projectId` | `string` | 是 | 專案 ID，不含前綴 |
| `selectedScreenInstance` | [`SelectedScreenInstance`](#selectedscreeninstance) | 是 | `upload_design_md` 建立的畫面實例 |
| `deviceType` | `string` | 否 | 設計系統的裝置類型，可用值同 [`DeviceType`](#devicetype-列舉) |

回傳：`DesignSystem`，含可以交給 `apply_design_system` 的 `assetId`。

## 完整範例

### 產生一個畫面

呼叫 `generate_screen_from_text` 的引數：

```json
{
  "projectId": "4044680601076201931",
  "prompt": "A mobile ordering screen for a bubble tea shop in Tainan: drink cards with photos, sugar and ice level options, and an order button at the bottom.",
  "deviceType": "MOBILE",
  "modelId": "GEMINI_3_FLASH"
}
```

`prompt` 要 Stitch 做台南手搖飲店的手機點餐畫面：附照片的飲料卡片、甜度冰塊選項，以及底部的點餐按鈕。

畫面產生的進度可以用 `get_screen` 查：`screenMetadata.status` 是 `IN_PROGRESS`、`COMPLETE` 或 `FAILED`。

### 從 DESIGN.md 建立並套用設計系統

| 步驟 | 工具 | 取用前一步的值 |
| --- | --- | --- |
| 1 | `upload_design_md` | — |
| 2 | `create_design_system_from_design_md` | 步驟 1 回傳的 `id`、`sourceScreen` |
| 3 | `get_project` | — |
| 4 | `apply_design_system` | 步驟 2 回傳的 `assetId`；步驟 3 取得的畫面實例 |

步驟 1 的引數：

```json
{
  "projectId": "4044680601076201931",
  "designMdBase64": "<base64-encoded DESIGN.md>"
}
```

步驟 2 的引數，`selectedScreenInstance` 放步驟 1 回傳的兩個欄位：

```json
{
  "projectId": "4044680601076201931",
  "selectedScreenInstance": {
    "id": "<id from upload_design_md>",
    "sourceScreen": "projects/4044680601076201931/screens/<screen-id>"
  }
}
```

步驟 4 的引數，`selectedScreenInstances` 的 `id` 是 `get_project` 裡的畫面實例 ID，不是畫面 ID：

```json
{
  "projectId": "4044680601076201931",
  "selectedScreenInstances": [
    {
      "id": "<screen-instance-id>",
      "sourceScreen": "projects/4044680601076201931/screens/<screen-id>"
    }
  ],
  "assetId": "<asset-id>"
}
```

## 參數的資料結構

### `VariantOptions`

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `variantCount` | `integer` | 變化版本數量，`1` 到 `5`，預設 `3` |
| `creativeRange` | [`CreativeRange`](#creativerange-列舉) | 變化幅度 |
| `aspects` | [`VariantAspect`](#variantaspect-列舉)`[]` | 要著重變化的面向 |

### `DesignSystem`

讓設計保持一致、符合品牌的視覺與功能準則。

| 欄位 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `displayName` | `string` | 是 | 顯示名稱 |
| `theme` | [`DesignTheme`](#designtheme) | 是 | 主題設定 |

### `DesignTheme`

| 欄位 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `colorMode` | [`ColorMode`](#colormode-列舉) | 是 | 淺色或深色 |
| `headlineFont` | [`Font`](#font-列舉) | 是 | 標題字體 |
| `bodyFont` | [`Font`](#font-列舉) | 是 | 內文字體 |
| `labelFont` | [`Font`](#font-列舉) | 否 | 標籤字體 |
| `roundness` | [`Roundness`](#roundness-列舉) | 是 | 圓角程度 |
| `customColor` | `string` | 是 | 動態色彩系統的種子色，十六進位，例如 `"#ff0000"` |
| `colorVariant` | [`ColorVariant`](#colorvariant-列舉) | 否 | 動態色彩系統的變體 |
| `overridePrimaryColor` | `string` | 否 | 覆寫主要色（十六進位） |
| `overrideSecondaryColor` | `string` | 否 | 覆寫次要色（十六進位） |
| `overrideTertiaryColor` | `string` | 否 | 覆寫第三色（十六進位） |
| `overrideNeutralColor` | `string` | 否 | 覆寫中性色（十六進位） |
| `designMd` | `string` | 否 | Markdown 格式的設計指示 |

`roundness` 在工具的輸入結構裡可用 `ROUNDNESS_UNSPECIFIED`、`ROUND_FOUR`、`ROUND_EIGHT`、`ROUND_TWELVE`、`ROUND_FULL`。

### `SelectedScreenInstance`

`apply_design_system` 和 `create_design_system_from_design_md` 使用。

| 欄位 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 畫面實例 ID，取自 `get_project`；不是來源畫面 ID |
| `sourceScreen` | `string` | 是 | 資源名稱，格式 `projects/{project}/screens/{screen}` |

## 回傳的型別

### `Screen`

Stitch 專案裡一個產生出來的畫面設計。

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `name` | `string` | 資源名稱，格式 `projects/{project}/screens/{screen}` |
| `id` | `string` | 畫面 ID（已棄用） |
| `title` | `string` | 畫面標題 |
| `prompt` | `string` | 產生畫面用的提示詞 |
| `screenshot` | [`File`](#file) | 畫面的截圖 |
| `htmlCode` | [`File`](#file) | 畫面的 HTML 程式碼 |
| `figmaExport` | [`File`](#file) | 畫面的 Figma 匯出檔 |
| `theme` | [`DesignTheme`](#designtheme) | 產生時用的主題 |
| `deviceType` | [`DeviceType`](#devicetype-列舉) | 裝置類型 |
| `screenType` | [`ScreenType`](#screentype-列舉) | 畫面類型 |
| `screenMetadata` | [`ScreenMetadata`](#screenmetadata) | 中繼資料：agent、狀態、顯示模式 |
| `width` | `string` | 畫面寬度 |
| `height` | `string` | 畫面高度 |
| `groupId` | `string` | 相關畫面（例如變化版本）的群組 ID |
| `groupName` | `string` | 群組的顯示名稱 |
| `generatedBy` | `string` | 產生者識別碼 |
| `isCreatedByClient` | `boolean` | 透過 API 上傳建立為 `true`，由 agent 產生為 `false` |

### `File`

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `name` | `string` | 資源名稱，格式 `projects/{project}/files/{file}` |
| `downloadUrl` | `string` | 下載網址；圖片是 FIFE base URL |
| `mimeType` | `string` | 例如 `"image/png"`、`"text/html"` |
| `fileContentBase64` | `string` | 上傳用的 Base64 內容（只寫） |
| `uploadBlobId` | `string` | 上傳服務的 BlobId |
| `userFeedback` | [`UserFeedback`](#userfeedback) | 最新的意見回饋（唯讀） |

### `Asset`

設計系統資源的外層包裝，`update_design_system` 使用。

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `name` | `string` | 資源名稱，格式 `assets/{asset}` |
| `designSystem` | [`DesignSystem`](#designsystem) | 設計系統內容 |
| `version` | `string` | 版本計數（唯讀），`0` 表示未建立版本 |

### `ScreenMetadata`

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `agentType` | `AgentTypeEnum` | `TURBO_AGENT`、`PRO_AGENT`、`IMAGE_AGENT`、`IMAGE_PRO_AGENT`、`HATTER_AGENT`、`GEMINI_3_AGENT` |
| `status` | `ScreenStatusEnum` | `IN_PROGRESS`、`COMPLETE`、`FAILED` |
| `statusMessage` | `string` | agent 給的狀態說明 |
| `displayMode` | `DisplayModeEnum` | `SCREENSHOT`、`HTML`、`CODE`、`MARKDOWN`、`STICKY_NOTE` |
| `isRemixed` | `boolean` | 畫面是否由 remix 建立 |
| `componentRegions` | `ComponentRegion[]` | 元件區域標註 |

### `SessionOutputComponent`

產生類工具在 `output_components` 裡回傳。

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `text` | `string` | agent 的文字回應 |
| `suggestion` | `string` | 給使用者的後續建議 |
| `design` | `Design` | 產生的設計參照 |

### `UserFeedback`

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `rating` | `string` | `POSITIVE` 或 `NEGATIVE` |
| `comment` | `string` | 補充意見 |
| `designFeedbackReason` | `string` | `DESIGN_DOESNT_MATCH_PROMPT`、`EDIT_DOESNT_MATCH_PROMPT`、`COMPONENT_ISSUE`、`INCORRECT_THEME` 等 |

## 列舉值

### `DeviceType` 列舉

| 值 | 說明 |
| --- | --- |
| `DEVICE_TYPE_UNSPECIFIED` | 未指定 |
| `MOBILE` | 手機 |
| `DESKTOP` | 桌機 |
| `TABLET` | 平板 |
| `AGNOSTIC` | 不限裝置 |

### `ModelId` 列舉

| 值 | 說明 |
| --- | --- |
| `MODEL_ID_UNSPECIFIED` | 未指定 |
| `GEMINI_3_PRO` | Gemini 3 Pro（已棄用，改用 `GEMINI_3_1_PRO` 或 `GEMINI_3_FLASH`） |
| `GEMINI_3_FLASH` | Gemini 3 Flash |
| `GEMINI_3_1_PRO` | Gemini 3.1 Pro |

### `ScreenType` 列舉

| 值 | 說明 |
| --- | --- |
| `SCREEN_TYPE_UNSPECIFIED` | 預設為 `DESIGN` |
| `DESIGN` | 設計畫面 |
| `IMAGE` | 純圖片 |
| `PROTOTYPE` | 設計原型 |
| `DOCUMENT` | 文件，例如 PRD |
| `PROTOTYPE_V2` | 設計原型 v2 |

### `ColorMode` 列舉

| 值 | 說明 |
| --- | --- |
| `COLOR_MODE_UNSPECIFIED` | 未指定 |
| `LIGHT` | 淺色 |
| `DARK` | 深色 |

### `ColorVariant` 列舉

`COLOR_VARIANT_UNSPECIFIED`（未指定）、`MONOCHROME`、`NEUTRAL`、`TONAL_SPOT`、`VIBRANT`、`EXPRESSIVE`、`FIDELITY`、`CONTENT`、`RAINBOW`、`FRUIT_SALAD`。

### `Font` 列舉

支援的字體家族：`INTER`、`DM_SANS`、`GEIST`、`SORA`、`MANROPE`、`LEXEND`、`EPILOGUE`、`BE_VIETNAM_PRO`、`PLUS_JAKARTA_SANS`、`PUBLIC_SANS`、`SPACE_GROTESK`、`SPLINE_SANS`、`WORK_SANS`、`MONTSERRAT`、`METROPOLIS`、`SOURCE_SANS_THREE`、`NUNITO_SANS`、`ARIMO`、`HANKEN_GROTESK`、`RUBIK`、`IBM_PLEX_SANS`、`NEWSREADER`、`NOTO_SERIF`、`DOMINE`、`LIBRE_CASLON_TEXT`、`EB_GARAMOND`、`LITERATA`、`SOURCE_SERIF_FOUR`。

輸入結構另有 `FONT_UNSPECIFIED`（未指定）。

### `Roundness` 列舉

| 值 | 說明 |
| --- | --- |
| `ROUNDNESS_UNSPECIFIED` | 未指定 |
| `ROUND_TWO` | Round 2（已棄用） |
| `ROUND_FOUR` | Round 4 |
| `ROUND_EIGHT` | Round 8 |
| `ROUND_TWELVE` | Round 12 |
| `ROUND_FULL` | 完全圓角 |

### `CreativeRange` 列舉

| 值 | 說明 |
| --- | --- |
| `CREATIVE_RANGE_UNSPECIFIED` | 未指定 |
| `REFINE` | 細微修飾，接近原設計 |
| `EXPLORE` | 適度探索（預設） |
| `REIMAGINE` | 大幅重新構想 |

### `VariantAspect` 列舉

| 值 | 說明 |
| --- | --- |
| `VARIANT_ASPECT_UNSPECIFIED` | 未指定 |
| `LAYOUT` | 元素排列 |
| `COLOR_SCHEME` | 配色 |
| `IMAGES` | 圖片運用 |
| `TEXT_FONT` | 字體選擇 |
| `TEXT_CONTENT` | 文字內容 |

## MCP Annotations

MCP Annotations 是 MCP 伺服器附在每個工具定義上的中繼資料提示，告訴用戶端（AI agent 或宿主程式）這個工具的行為特性，用戶端不必了解工具的實作，就能決定怎麼使用它。它屬於 [MCP 規格](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#data-types)的一部分。

| Annotation | 值為 `true` 時的意思 | 用戶端可以據此 |
| --- | --- | --- |
| `readOnlyHint` | 唯讀，不改變任何資料 | 不詢問使用者，自動核准 |
| `destructiveHint` | 可能建立、修改或刪除資源 | 先顯示確認對話框 |
| `idempotentHint` | 重複呼叫得到相同結果 | 網路失敗時安全地重試 |
| `openWorldHint` | 會和外部系統互動 | 稽核對外的互動 |

這些是提示，不是強制規則。Stitch 工具的實際標註：

| 工具 | 標註 | 意義 |
| --- | --- | --- |
| `list_projects` | `readOnlyHint: true` | 只取資料，agent 可以放心呼叫，沒有副作用 |
| `create_project` | `readOnlyHint: false`、`destructiveHint: true`、`idempotentHint: false` | 會改變狀態，用戶端應先請使用者確認 |
| `generate_screen_from_text` | `destructiveHint: true`、`idempotentHint: false` | 每次呼叫都建立新畫面，逾時後重試可能產生重複畫面 |
| 所有工具 | `openWorldHint: false` | 只和 Stitch 後端互動，不連到任意第三方服務 |

## 完整欄位

每個工具的完整 JSON Schema 與原始範例見 Stitch 文件的 [Stitch MCP Reference](https://stitch.google.com/docs/mcp/reference/)。
